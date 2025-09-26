import { useEffect, useState } from "react";

const cache: Record<string, any> = {};

type AsyncFn<TArgs extends any[], TResult> = (
  ...args: TArgs
) => Promise<TResult>;

export function useCachedAsync<TArgs extends any[], TResult>(
  cacheKey: string,
  fn: AsyncFn<TArgs, TResult>,
  args: TArgs,
  deps: any[] = []
) {
  const [data, setData] = useState<TResult | null>(cache[cacheKey] ?? null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cache[cacheKey]) {
      setData(cache[cacheKey]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fn(...args)
      .then((result) => {
        if (!cancelled) {
          cache[cacheKey] = result;
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
  }, [cacheKey, ...deps]);

  return { data, error, loading };
}
