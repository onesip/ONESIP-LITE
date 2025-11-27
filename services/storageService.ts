import { SiteContent } from '../types';
import { APP_CONFIG } from '../config';

const BASE_URL = 'https://api.jsonbin.io/v3/b';

const getCredentials = (binIdArg?: string, apiKeyArg?: string) => {
    // Priority: Arguments > Environment Variables > config.ts fallback
    const binId = binIdArg || process.env.REACT_APP_CLOUD_BIN_ID || APP_CONFIG.CLOUD_BIN_ID || '';
    const apiKey = apiKeyArg || process.env.REACT_APP_CLOUD_API_KEY || APP_CONFIG.CLOUD_API_KEY || '';
    return { binId: binId.trim(), apiKey: apiKey.trim() };
};

export const fetchCloudContent = async (binIdArg?: string, apiKeyArg?: string): Promise<SiteContent | null> => {
    const { binId, apiKey } = getCredentials(binIdArg, apiKeyArg);

    if (!binId || !apiKey) {
        console.warn("Skipping cloud fetch: Missing credentials.");
        return null;
    }

    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`${BASE_URL}/${binId}/latest?t=${timestamp}`, {
            method: 'GET',
            headers: { 'X-Master-Key': apiKey, 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Cloud fetch error: ${response.status}`, errorText);
            return null;
        }

        const json = await response.json();
        // The entire content, including the library of base64 images, is now in the single record.
        return json.record as SiteContent;

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

export const saveCloudContent = async (binIdArg: string, apiKeyArg: string, content: SiteContent): Promise<boolean> => {
    const { binId, apiKey } = getCredentials(binIdArg, apiKeyArg);
    
    if (!binId || !apiKey) throw new Error("Missing credentials for save");
    
    try {
        const response = await fetch(`${BASE_URL}/${binId}`, {
            method: 'PUT',
            headers: { 'X-Master-Key': apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify(content) // Save the entire content object, including the library.
        });
        
        if (!response.ok) {
           throw new Error(`Cloud Save Failed: ${await parseError(response)}`);
        }
        
        return true;
    } catch (error) {
        console.error("Failed to save cloud content:", error);
        throw error;
    }
};

// This function is no longer needed as we are not creating separate media bins.
// It's kept here but is now unused, to avoid breaking imports if it was referenced elsewhere.
// A better approach would be to remove it and its references entirely. For now, it's neutered.
export const createCloudBins = async (apiKeyArg: string, mainContent: Omit<SiteContent, 'library'>): Promise<{ binId: string; libraryBinIds: string[] }> => {
    console.warn("createCloudBins is deprecated and no longer creates media bins.");
    const mainBinId = process.env.REACT_APP_CLOUD_BIN_ID || APP_CONFIG.CLOUD_BIN_ID;
    if (!mainBinId) throw new Error("Missing Main Bin ID.");

    // Return a dummy array, as this is no longer used for configuration checking.
    // The real check is now just for binId and apiKey.
    return Promise.resolve({
        binId: mainBinId,
        libraryBinIds: Array(10).fill("DEPRECATED") 
    });
};
