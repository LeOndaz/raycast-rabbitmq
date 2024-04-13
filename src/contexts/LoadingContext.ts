import React from "react";

export const LoadingContext = React.createContext<boolean>(false);
export const SetLoadingContext = React.createContext<(loading: boolean) => void>(() => false);