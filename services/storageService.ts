
import { SiteContent } from '../types';
import { APP_CONFIG } from '../config';

// Using JSONBin.io V3 API
const BASE_URL = 'https://api.jsonbin.io/v3/b';

// Helper to determine credentials: Priority = Args -> Config File -> Env Vars
const getCredentials = (passedBinId?: string, passedApiKey?: string) => {
  // 1. Explicitly passed arguments (from Admin testing)
  if (passedBinId && passedApiKey) {
      return { binId: passedBinId, apiKey: passedApiKey };
  }

  // 2. Hardcoded Config (The "Firebase-like" seamless experience)
  if (APP_CONFIG.ENABLE_CLOUD_SYNC && APP_CONFIG.CLOUD_BIN_ID && APP_CONFIG.CLOUD_API_KEY) {
      return { binId: APP_CONFIG.CLOUD_BIN_ID, apiKey: APP_CONFIG.CLOUD_API_KEY };
  }

  // 3. Environment Variables (Vercel Deployment)
  // Polyfill check for safety
  const envBinId = typeof process !== 'undefined' && process.env?.REACT_APP_CLOUD_BIN_ID;
  const envApiKey = typeof process !== 'undefined' && process.env?.REACT_APP_CLOUD_API_KEY;

  if (envBinId && envApiKey) {
      return { binId: envBinId, apiKey: envApiKey };
  }

  return { binId: '', apiKey: '' };
};

export const fetchCloudContent = async (binIdArg?: string, apiKeyArg?: string): Promise<SiteContent | null> => {
  const { binId, apiKey } = getCredentials(binIdArg, apiKeyArg);

  if (!binId || !apiKey) {
      console.warn("Skipping cloud fetch: Missing credentials.");
      return null;
  }

  try {
    // CRITICAL: Add timestamp query param (?t=...) to bypass browser cache
    const timestamp = new Date().getTime();
    const response = await fetch(`${BASE_URL}/${binId}/latest?t=${timestamp}`, {
      method: 'GET',
      headers: {
        'X-Master-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // 404 or 401 usually means wrong keys
      console.error(`Cloud fetch error: ${response.status}`);
      return null;
    }

    const json = await response.json();
    return json.record as SiteContent;
  } catch (error) {
    console.error("Failed to fetch cloud content:", error);
    return null;
  }
};

export const saveCloudContent = async (binIdArg: string, apiKeyArg: string, content: SiteContent): Promise<boolean> => {
  // For saving, we usually rely on the explicitly passed args from the context to ensure
  // we are writing to the expected place, but we can fallback if needed.
  const { binId, apiKey } = getCredentials(binIdArg, apiKeyArg);

  if (!binId || !apiKey) throw new Error("Missing credentials for save");

  try {
    const response = await fetch(`${BASE_URL}/${binId}`, {
      method: 'PUT',
      headers: {
        'X-Master-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(content)
    });

    if (!response.ok) {
      throw new Error(`Cloud save failed: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error("Failed to save cloud content:", error);
    throw error;
  }
};

export const createCloudBin = async (apiKeyArg: string, content: SiteContent): Promise<string> => {
   // Use arg first, then config
   const apiKey = apiKeyArg || APP_CONFIG.CLOUD_API_KEY;
   
   if (!apiKey) throw new Error("Missing API Key");

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'X-Master-Key': apiKey,
        'Content-Type': 'application/json',
        'X-Bin-Name': 'ONESIP_APP_DATA', // Friendly name
        'X-Bin-Private': 'true' // IMPORTANT: Create as private
      },
      body: JSON.stringify(content)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Creation failed: ${response.status} ${errText}`);
    }

    const json = await response.json();
    return json.metadata.id; // Return the new Bin ID
  } catch (error) {
    console.error("Failed to create cloud bin:", error);
    throw error;
  }
};
