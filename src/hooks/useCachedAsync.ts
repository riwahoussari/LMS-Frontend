import { useEffect, useState } from "react";
import { clearCacheKey, clearAllCache, getCache, setCache } from "@/lib/cache"; 


type AsyncFn<TArgs extends any[], TResult> = (
  ...args: TArgs
) => Promise<TResult>;

export function useCachedAsync<TArgs extends any[], TResult>(
  cacheKey: string,
  fn: AsyncFn<TArgs, TResult>,
  args: TArgs,
  deps: any[] = [],
  options?: { enabled?: boolean }
) {
  const [data, setData] = useState<TResult | null>(getCache(cacheKey) ?? null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (options?.enabled === false) return; // Do nothing of disabled

    if (getCache(cacheKey)) {
      setData(getCache(cacheKey));
      return;
    }

    let cancelled = false;
    setLoading(true);
    fn(...args)
      .then((result) => {
        if (!cancelled) {
          setCache(cacheKey, result);
          setData(result);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, options?.enabled, ...deps]);

  return { data, error, loading, clearCacheKey, clearAllCache };
}
