import React, { PropsWithChildren, useState } from "react";
import { LoadingContext, SetLoadingContext } from "../contexts/LoadingContext";
import { LoadingAnimationProvider } from "./LoadingAnimationProvider";

export const CommandProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return <SetLoadingContext.Provider value={setIsLoading}>
    <LoadingContext.Provider value={isLoading}>
      <LoadingAnimationProvider>
        {children}
      </LoadingAnimationProvider>
    </LoadingContext.Provider>
  </SetLoadingContext.Provider>;
};