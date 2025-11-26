
import { SiteContent } from '../types';
import { APP_CONFIG } from '../config';

// Using JSONBin.io V3 API
const BASE_URL = 'https://api.jsonbin.io/v3/b';

// Helper to determine credentials: Priority = Args -> Config File -> Env Vars
const getCredentials = (passedBinId?: string, passedApiKey?: string) => {
  // 1. Explicitly passed arguments (from Admin testing)
  if (passedBinId && passedApiKey) {
      return { binId: passedBinId.trim(), apiKey: passedApiKey.trim() };
  }

  // 2. Hardcoded Config (The "Firebase-like" seamless experience)
  if (APP_CONFIG.ENABLE_CLOUD_SYNC && APP_CONFIG.CLOUD_BIN_ID && APP_CONFIG.CLOUD_API_KEY) {
      return { 
          binId: APP_CONFIG.CLOUD_BIN_ID.trim(), 
          apiKey: APP_CONFIG.CLOUD_API_KEY.trim() 
      };
  }

  // 3. Environment Variables (Vercel Deployment)
  const envBinId = typeof process !== 'undefined' && process.env?.REACT_APP_CLOUD_BIN_ID;
  const envApiKey = typeof process !== 'undefined' && process.env?.REACT_APP_CLOUD_API_KEY;

  if (envBinId && envApiKey) {
      return { binId: envBinId.trim(), apiKey: envApiKey.trim() };
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
   const apiKey = (apiKeyArg || APP_CONFIG.CLOUD_API_KEY).trim();
   
   if (!apiKey) throw new Error("Missing API Key");

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'X-Master-Key': apiKey,
        'Content-Type': 'application/json',
        'X-Bin-Name': 'ONESIP_APP_DATA',
        'X-Bin-Private': 'true'
      },
      body: JSON.stringify(content)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Creation failed: ${response.status} ${errText}`);
    }

    const json = await response.json();
    return json.metadata.id;
  } catch (error) {
    console.error("Failed to create cloud bin:", error);
    throw error;
  }
};
