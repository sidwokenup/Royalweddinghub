const USER_PREF_KEY = "royal_weddinghub_visitor";

export interface UserPreferences {
  name?: string;
  phone?: string;
  lastService?: string;
  lastSubmittedAt?: number;
}

export function saveUserPreferences(prefs: Partial<UserPreferences>): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getUserPreferences();
    const updated = { ...existing, ...prefs, lastSubmittedAt: Date.now() };
    localStorage.setItem(USER_PREF_KEY, JSON.stringify(updated));
  } catch (err) {
    console.debug("Failed to save preferences:", err);
  }
}

export function getUserPreferences(): UserPreferences {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(USER_PREF_KEY);
    if (stored) {
      return JSON.parse(stored) as UserPreferences;
    }
  } catch {
    // ignore
  }
  return {};
}
