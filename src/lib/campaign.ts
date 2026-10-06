export interface CampaignParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  timestamp?: number;
}

const STORAGE_KEY = "royal_weddinghub_campaign";

/**
 * Captures UTM parameters from current URL and persists them in sessionStorage.
 * If already stored in the session, preserves previous attribution unless overridden.
 */
export function captureCampaignParams(): CampaignParams {
  if (typeof window === "undefined") return {};

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const hasUtm =
      urlParams.has("utm_source") ||
      urlParams.has("utm_medium") ||
      urlParams.has("utm_campaign") ||
      urlParams.has("utm_content") ||
      urlParams.has("utm_term");

    if (hasUtm) {
      const current: CampaignParams = {
        utm_source: urlParams.get("utm_source") || undefined,
        utm_medium: urlParams.get("utm_medium") || undefined,
        utm_campaign: urlParams.get("utm_campaign") || undefined,
        utm_content: urlParams.get("utm_content") || undefined,
        utm_term: urlParams.get("utm_term") || undefined,
        referrer: document.referrer || undefined,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return current;
    }

    // Check existing stored session
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as CampaignParams;
    }
  } catch (err) {
    console.debug("Campaign capture error:", err);
  }

  return {};
}

export function getStoredCampaignParams(): CampaignParams {
  if (typeof window === "undefined") return {};
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as CampaignParams;
    }
  } catch {
    // ignore
  }
  return {};
}
