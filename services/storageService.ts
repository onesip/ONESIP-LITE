
import { SiteContent } from '../types';

// Using JSONBin.io V3 API
const BASE_URL = 'https://api.jsonbin.io/v3/b';

export const fetchCloudContent = async (binId: string, apiKey: string): Promise<SiteContent | null> => {
  try {
    // CRITICAL: Add timestamp query param (?t=...) to bypass browser cache
    // This ensures visitors always see your latest edits immediately after refresh
    const timestamp = new Date().getTime();
    const response = await fetch(`${BASE_URL}/${binId}/latest?t=${timestamp}`, {
      method: 'GET',
      headers: {
        'X-Master-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Cloud fetch failed: ${response.statusText}`);
    }

    const json = await response.json();
    return json.record as SiteContent;
  } catch (error) {
    console.error("Failed to fetch cloud content:", error);
    throw error;
  }
};

export const saveCloudContent = async (binId: string, apiKey: string, content: SiteContent): Promise<boolean> => {
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

export const createCloudBin = async (apiKey: string, content: SiteContent): Promise<string> => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'X-Master-Key': apiKey,
        'Content-Type': 'application/json',
        'X-Bin-Name': 'ONESIP_APP_DATA', // Friendly name
        'X-Bin-Private': 'true' // IMPORTANT: Create as private to avoid permission issues
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
