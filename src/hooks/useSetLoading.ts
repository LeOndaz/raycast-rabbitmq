import React from "react";
import { SetLoadingContext } from "../contexts/LoadingContext";

export const useSetLoading = () => {
  return React.useContext(SetLoadingContext);
}