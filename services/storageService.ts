
import { SiteContent } from '../types';
import { APP_CONFIG } from '../config';

// Using JSONBin.io V3 API
const BASE_URL = 'https://api.jsonbin.io/v3/b';

const getCredentials = (binIdArg?: string, apiKeyArg?: string, libraryBinIdArg?: string) => {
    let binId = binIdArg || APP_CONFIG.CLOUD_BIN_ID || '';
    let apiKey = apiKeyArg || APP_CONFIG.CLOUD_API_KEY || '';
    // This one is special, as it's not in the hardcoded config for simplicity
    let libraryBinId = libraryBinIdArg || '';

    return { binId: binId.trim(), apiKey: apiKey.trim(), libraryBinId: libraryBinId.trim() };
};


export const fetchCloudContent = async (binIdArg?: string, apiKeyArg?: string, libraryBinIdArg?: string): Promise<SiteContent | null> => {
  const { binId, apiKey, libraryBinId } = getCredentials(binIdArg, apiKeyArg, libraryBinIdArg);

  if (!binId || !apiKey || !libraryBinId) {
      console.warn("Skipping cloud fetch: Missing one or more credentials (binId, libraryBinId, apiKey).");
      return null;
  }

  try {
    const timestamp = new Date().getTime();
    const mainPromise = fetch(`${BASE_URL}/${binId}/latest?t=${timestamp}`, {
      method: 'GET',
      headers: { 'X-Master-Key': apiKey, 'Content-Type': 'application/json' },
    });
    const libraryPromise = fetch(`${BASE_URL}/${libraryBinId}/latest?t=${timestamp}`, {
        method: 'GET',
        headers: { 'X-Master-Key': apiKey, 'Content-Type': 'application/json' },
    });

    const [mainResponse, libraryResponse] = await Promise.all([mainPromise, libraryPromise]);

    if (!mainResponse.ok) {
      console.error(`Main content cloud fetch error: ${mainResponse.status}`);
      return null; // Main content is critical
    }

    const mainJson = await mainResponse.json();
    let libraryData: string[] = [];

    if (libraryResponse.ok) {
        const libraryJson = await libraryResponse.json();
        if (libraryJson.record && Array.isArray(libraryJson.record.library)) {
            libraryData = libraryJson.record.library;
        }
    } else {
        console.warn(`Media Library cloud fetch error: ${libraryResponse.status}. Proceeding with an empty library.`);
    }

    return { ...mainJson.record, library: libraryData };

  } catch (error) {
    console.error("Failed to fetch cloud content:", error);
    return null;
  }
};

const parseError = async (response: Response): Promise<string> => {
    let errorDetails = `Status: ${response.status}`;
    try {
        const errorJson = await response.json();
        if (errorJson.message) {
            errorDetails += ` - ${errorJson.message}`;
        } else {
            errorDetails += ` - ${JSON.stringify(errorJson)}`;
        }
    } catch (e) {
        if (response.statusText) {
            errorDetails += ` ${response.statusText}`;
        }
    }
    return errorDetails;
}

export const saveCloudContent = async (binIdArg: string, libraryBinIdArg: string, apiKeyArg: string, content: SiteContent): Promise<boolean> => {
    const { binId, apiKey, libraryBinId } = getCredentials(binIdArg, apiKeyArg, libraryBinIdArg);
    
    if (!binId || !apiKey || !libraryBinId) throw new Error("Missing credentials for save");
    
    const { library, ...mainContent } = content;
    const libraryContent = { library: library || [] };

    try {
        const mainSavePromise = fetch(`${BASE_URL}/${binId}`, {
            method: 'PUT',
            headers: { 'X-Master-Key': apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify(mainContent)
        });

        const librarySavePromise = fetch(`${BASE_URL}/${libraryBinId}`, {
            method: 'PUT',
            headers: { 'X-Master-Key': apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify(libraryContent)
        });
        
        const [mainResult, libraryResult] = await Promise.all([mainSavePromise, librarySavePromise]);
        
        const errors = [];
        if (!mainResult.ok) {
            const errorDetails = await parseError(mainResult);
            errors.push(`Main Content Save Failed: ${errorDetails}`);
        }
        if (!libraryResult.ok) {
            const errorDetails = await parseError(libraryResult);
            errors.push(`Media Library Save Failed: ${errorDetails}`);
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

export const createCloudBins = async (apiKeyArg: string, content: SiteContent): Promise<{ binId: string, libraryBinId: string }> => {
   const apiKey = (apiKeyArg || APP_CONFIG.CLOUD_API_KEY).trim();
   if (!apiKey) throw new Error("Missing API Key");

    const { library, ...mainContent } = content;
    const libraryContent = { library: library || [] };

  try {
    const mainBinPromise = fetch(BASE_URL, {
      method: 'POST',
      headers: { 'X-Master-Key': apiKey, 'Content-Type': 'application/json', 'X-Bin-Name': 'ONESIP_MAIN_CONTENT', 'X-Bin-Private': 'true' },
      body: JSON.stringify(mainContent)
    });
    const libraryBinPromise = fetch(BASE_URL, {
        method: 'POST',
        headers: { 'X-Master-Key': apiKey, 'Content-Type': 'application/json', 'X-Bin-Name': 'ONESIP_MEDIA_LIBRARY', 'X-Bin-Private': 'true' },
        body: JSON.stringify(libraryContent)
    });

    const [mainResult, libraryResult] = await Promise.all([mainBinPromise, libraryBinPromise]);
    
    if (!mainResult.ok || !libraryResult.ok) {
        const mainError = !mainResult.ok ? await mainResult.text() : "";
        const libraryError = !libraryResult.ok ? await libraryResult.text() : "";
        throw new Error(`Bin creation failed: \nMain: ${mainError}\nLibrary: ${libraryError}`);
    }

    const mainJson = await mainResult.json();
    const libraryJson = await libraryResult.json();

    return { binId: mainJson.metadata.id, libraryBinId: libraryJson.metadata.id };

  } catch (error) {
    console.error("Failed to create cloud bins:", error);
    throw error;
  }
};
