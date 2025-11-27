
import { SiteContent } from '../types';
import { APP_CONFIG } from '../config';

const BASE_URL = 'https://api.jsonbin.io/v3/b';
const NUM_LIBRARY_BINS = 10;

const getCredentials = (binIdArg?: string, apiKeyArg?: string, libraryBinIdsArg?: string[]) => {
    const binId = binIdArg || APP_CONFIG.CLOUD_BIN_ID || '';
    const apiKey = apiKeyArg || APP_CONFIG.CLOUD_API_KEY || '';
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
                if (libJson.record && Array.isArray(libJson.record.library)) {
                    allLibraryImages.push(...libJson.record.library);
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

    // Partition library images into chunks for each bin
    const chunkSize = Math.ceil(libraryImages.length / NUM_LIBRARY_BINS);
    const libraryChunks = Array.from({ length: NUM_LIBRARY_BINS }, (_, i) =>
        libraryImages.slice(i * chunkSize, i * chunkSize + chunkSize)
    );

    try {
        const mainSavePromise = fetch(`${BASE_URL}/${binId}`, {
            method: 'PUT',
            headers: { 'X-Master-Key': apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify(mainContent)
        });

        const librarySavePromises = libraryBinIds.map((libBinId, i) =>
            fetch(`${BASE_URL}/${libBinId}`, {
                method: 'PUT',
                headers: { 'X-Master-Key': apiKey, 'Content-Type': 'application/json' },
                body: JSON.stringify({ library: libraryChunks[i] || [] }) // Ensure empty array for empty chunks
            })
        );
        
        const [mainResult, ...libraryResults] = await Promise.all([mainSavePromise, ...librarySavePromises]);
        
        const errors = [];
        if (!mainResult.ok) {
            errors.push(`Main Content Save Failed: ${await parseError(mainResult)}`);
        }
        libraryResults.forEach(async (res, i) => {
            if (!res.ok) {
                errors.push(`Media Library Bin #${i+1} Save Failed: ${await parseError(res)}`);
            }
        });
        
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
    const apiKey = (apiKeyArg || APP_CONFIG.CLOUD_API_KEY).trim();
    if (!apiKey) throw new Error("Missing API Key");

    try {
        const mainBinPromise = fetch(BASE_URL, {
            method: 'POST',
            headers: { 'X-Master-Key': apiKey, 'Content-Type': 'application/json', 'X-Bin-Name': 'ONESIP_MAIN_CONTENT', 'X-Bin-Private': 'true' },
            body: JSON.stringify(mainContent)
        });

        const libraryBinPromises = Array.from({ length: NUM_LIBRARY_BINS }, (_, i) =>
            fetch(BASE_URL, {
                method: 'POST',
                headers: { 'X-Master-Key': apiKey, 'Content-Type': 'application/json', 'X-Bin-Name': `ONESIP_MEDIA_LIBRARY_${i+1}`, 'X-Bin-Private': 'true' },
                body: JSON.stringify({ library: [] }) // Create empty library bins
            })
        );
        
        const [mainResult, ...libraryResults] = await Promise.all([mainBinPromise, ...libraryBinPromises]);

        if (!mainResult.ok || libraryResults.some(res => !res.ok)) {
            const mainError = !mainResult.ok ? await mainResult.text() : "OK";
            const libraryErrors = await Promise.all(libraryResults.map(async (res, i) => !res.ok ? `Lib #${i+1}: ${await res.text()}`: ""));
            throw new Error(`Bin creation failed: \nMain: ${mainError}\nLibraries: ${libraryErrors.filter(Boolean).join(', ')}`);
        }

        const mainJson = await mainResult.json();
        const libraryJsons = await Promise.all(libraryResults.map(res => res.json()));
        
        return {
            binId: mainJson.metadata.id,
            libraryBinIds: libraryJsons.map(json => json.metadata.id)
        };

    } catch (error) {
        console.error("Failed to create cloud bins:", error);
        throw error;
    }
};
