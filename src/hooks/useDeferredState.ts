import { DependencyList, useEffect, useMemo } from "react";
import { useDeferredAction } from "./useDeferredAction";

export const useDeferredState = <T>(f: (...args: unknown[]) => Promise<T>, deps: DependencyList = [], initialState?: Awaited<ReturnType<typeof f>>) => {
  /**
   * useState, but from the server
   * */

  const [cb, data, isLoading, error] = useDeferredAction<T>(f, deps, initialState);

  useEffect(function callCb() {
    cb();
  }, [cb]);

  return useMemo(() => [
    data,
    isLoading,
    error
  ], [isLoading, error, data]) as [T | undefined, boolean, Error | null];
};
