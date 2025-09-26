import { useEffect, useState } from "react";

const cache: Record<string, any> = {};

export function useCachedAsync<T, A extends any[]>(
  key: string,
  fn: (...args: A) => Promise<T>,
  args: A,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(cache[key] ?? null);
  const [loading, setLoading] = useState(!cache[key]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (cache[key]) return; // already cached

    let cancelled = false;
    setLoading(true);
    setError(null);

    fn(...args)
      .then((res) => {
        if (!cancelled) {
          cache[key] = res;
          setData(res);
        }
      })
      .catch((err) => !cancelled && setError(err))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [key, ...deps]);

  return { data, loading, error };
}
