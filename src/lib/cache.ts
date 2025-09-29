const cache: Record<string, any> = {};

export function clearCacheKey(key: string) {
  delete cache[key];
}

export function clearAllCache() {
  Object.keys(cache).forEach((key) => delete cache[key]);
}

export function getCache<T = any>(key: string): T | null {
  return cache[key] ?? null;
}

export function setCache<T = any>(key: string, value: T) {
  cache[key] = value;
}
