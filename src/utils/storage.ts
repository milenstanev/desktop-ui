/**
 * Safely parse JSON from localStorage. Returns fallback on parse error or invalid data.
 */
export function safeParseJson<T>(
  key: string,
  fallback: T,
  validator?: (value: unknown) => value is T
): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    if (validator && !validator(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}
