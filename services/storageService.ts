import { SiteContent } from '../types';
import { APP_CONFIG } from '../config';

const BASE_URL = 'https://api.jsonbin.io/v3/b';
const NUM_LIBRARY_BINS = 10;

const getCredentials = (binIdArg?: string, apiKeyArg?: string, libraryBinIdsArg?: string[]) => {
    // Priority: Arguments > Environment Variables > config.ts fallback
    const binId = binIdArg || process.env.REACT_APP_CLOUD_BIN_ID || APP_CONFIG.CLOUD_BIN_ID || '';
    const apiKey = apiKeyArg || process.env.REACT_APP_CLOUD_API_KEY || APP_CONFIG.CLOUD_API_KEY || '';
    const libraryBinIds = libraryBinIdsArg || [];
    return { binId: binId.trim(), apiKey: apiKey.trim(), libraryBinIds };
};

export const fetchCloudContent = async (binIdArg?: string, apiKeyArg?: string, libraryBinIdsArg?: string[]): Promise<SiteContent | null> => {
    const { binId, apiKey, libraryBinIds } = getCredentials(binIdArg, apiKeyArg, libraryBinIdsArg);

    if (!binId || !apiKey || libraryBinIds.length !== NUM_LIBRARY_BINS) {
        console.warn("Skipping cloud fetch: Missing credentials or incomplete library bin configuration.");
        return null;
    }

    try {
        const timestamp = new Date().getTime();
        const mainPromise = fetch(`${BASE_URL}/${binId}/latest?t=${timestamp}`, {
            method: 'GET',
            headers: { 'X-Master-Key': apiKey, 'Content-Type': 'application/json' },
        });

        const libraryPromises = libraryBinIds.map(libBinId => 
            fetch(`${BASE_URL}/${libBinId}/latest?t=${timestamp}`, {
                method: 'GET',
                headers: { 'X-Master-Key': apiKey, 'Content-Type': 'application/json' },
            })
        );

        const [mainResponse, ...libraryResponses] = await Promise.all([mainPromise, ...libraryPromises]);

        if (!mainResponse.ok) {
            console.error(`Main content cloud fetch error: ${mainResponse.status}`);
            return null;
        }

        const mainJson = await mainResponse.json();
        const allLibraryImages: string[] = [];

        for (const [i, res] of libraryResponses.entries()) {
            if (res.ok) {
                const libJson = await res.json();
                // Each bin should have { library: ["url"] } or { library: [] }
                if (libJson.record && Array.isArray(libJson.record.library) && libJson.record.library[0]) {
                    allLibraryImages.push(libJson.record.library[0]);
                }
            } else {
                console.warn(`Media Library bin #${i + 1} fetch error: ${res.status}.`);
            }
        }
        
        return { ...mainJson.record, library: allLibraryImages };

    } catch (error) {
        console.error("Failed to fetch cloud content:", error);
        return null;
    }
};

const parseError = async (response: Response): Promise<string> => {
    let errorDetails = `Status: ${response.status}`;
    try {
        const errorJson = await response.json();
        errorDetails += ` - ${errorJson.message || JSON.stringify(errorJson)}`;
    } catch (e) {
        errorDetails += ` ${response.statusText || 'Unknown Error'}`;
    }
    return errorDetails;
};

export const saveCloudContent = async (binIdArg: string, libraryBinIdsArg: string[], apiKeyArg: string, content: SiteContent): Promise<boolean> => {
    const { binId, apiKey, libraryBinIds } = getCredentials(binIdArg, apiKeyArg, libraryBinIdsArg);
    
    if (!binId || !apiKey || libraryBinIds.length !== NUM_LIBRARY_BINS) throw new Error("Missing credentials for save");
    
    const { library, ...mainContent } = content;
    const libraryImages = library || [];
    
    if (libraryImages.length > NUM_LIBRARY_BINS) {
        throw new Error(`Cannot save: Library contains ${libraryImages.length} images, but the maximum is ${NUM_LIBRARY_BINS}.`);
    }

    try {
        const mainSavePromise = fetch(`${BASE_URL}/${binId}`, {
            method: 'PUT',
            headers: { 'X-Master-Key': apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify(mainContent)
        });

        // One image per bin
        const librarySavePromises = libraryBinIds.map((libBinId, i) => {
            const imageForThisBin = libraryImages[i];
            const payload = {
                library: imageForThisBin ? [imageForThisBin] : [] // Store single image in an array or an empty array
            };
            return fetch(`${BASE_URL}/${libBinId}`, {
                method: 'PUT',
                headers: { 'X-Master-Key': apiKey, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        });
        
        const [mainResult, ...libraryResults] = await Promise.all([mainSavePromise, ...librarySavePromises]);
        
        const errors = [];
        if (!mainResult.ok) {
            errors.push(`Main Content Save Failed: ${await parseError(mainResult)}`);
        }
        for (const [i, res] of libraryResults.entries()) {
            if (!res.ok) {
                // This is an await in a loop but it's for error handling, so it's acceptable.
                errors.push(`Media Library Bin #${i+1} Save Failed: ${await parseError(res)}`);
            }
        }
        
        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }
        
        return true;
    } catch (error) {
        console.error("Failed to save cloud content:", error);
        throw error;
    }
};

export const createCloudBins = async (apiKeyArg: string, mainContent: Omit<SiteContent, 'library'>): Promise<{ binId: string; libraryBinIds: string[] }> => {
    const apiKey = apiKeyArg || process.env.REACT_APP_CLOUD_API_KEY || APP_CONFIG.CLOUD_API_KEY;
    const mainBinId = process.env.REACT_APP_CLOUD_BIN_ID || APP_CONFIG.CLOUD_BIN_ID;

    if (!apiKey) throw new Error("Missing API Key. Check Vercel environment variables (REACT_APP_CLOUD_API_KEY) or config.ts.");
    if (!mainBinId) throw new Error("Missing Main Bin ID. Check Vercel environment variables (REACT_APP_CLOUD_BIN_ID) or config.ts.");

    try {
        const libraryBinPromises = Array.from({ length: NUM_LIBRARY_BINS }, (_, i) =>
            fetch(BASE_URL, {
                method: 'POST',
                headers: { 'X-Master-Key': apiKey, 'Content-Type': 'application/json', 'X-Bin-Name': `ONESIP_MEDIA_LIBRARY_${i+1}`, 'X-Bin-Private': 'true' },
                body: JSON.stringify({ library: [] })
            })
        );
        
        const libraryResults = await Promise.all(libraryBinPromises);

        if (libraryResults.some(res => !res.ok)) {
            const libraryErrors = await Promise.all(libraryResults.map(async (res, i) => {
                if (res.ok) return "";
                let errorText = await res.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    errorText = errorJson.message || errorText;
                } catch (e) { /* Not a JSON error */ }
                return `  - Bin #${i + 1} Creation Failed (${res.status}): ${errorText}`;
            }));
            throw new Error(`One or more media library bins could not be created:\n${libraryErrors.filter(Boolean).join('\n')}`);
        }

        const libraryJsons = await Promise.all(libraryResults.map(res => res.json()));
        
        return {
            binId: mainBinId,
            libraryBinIds: libraryJsons.map(json => json.metadata.id)
        };

    } catch (error) {
        console.error("Failed to create cloud bins:", error);
        throw error; // Re-throw the already formatted error
    }
};
