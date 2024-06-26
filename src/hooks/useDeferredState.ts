import { DependencyList, useEffect, useMemo } from "react";
import { useDeferredAction } from "./useDeferredAction";

export const useDeferredState = <T>(f: (...args: unknown[]) => Promise<T>, deps: DependencyList = [], initialState?: T) => {
  /**
   * useState, but from the server
   * */

  const [cb, data, isLoading, error] = useDeferredAction<T>(f, deps, initialState);

  useEffect(function callCb() {
    cb().then();
  }, [cb]);

  return useMemo(() => [
    data,
    isLoading,
    error
  ], [isLoading, error, data]) as [T | undefined, boolean, Error | null | unknown];
};
