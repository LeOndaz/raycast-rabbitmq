import { DependencyList, useCallback, useMemo, useState } from "react";

export const useDeferredAction = <T>(f: (...args: unknown[]) => Promise<T>, deps: DependencyList = [], initialState?: T) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null | unknown>(null);
  const [data, setData] = useState<T | undefined>(initialState);
  
  const callback = useCallback(async (...args: unknown[]) => {
    setIsLoading(true);

    try {
      const data = await f(...args);
      setData(data);
    } catch (e: unknown) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, deps);

  return useMemo(() => [
    callback,
    data,
    isLoading,
    error
  ], [callback, isLoading, error, data]) as [(...args: unknown[]) => void, T | undefined, boolean, Error | null];
};
