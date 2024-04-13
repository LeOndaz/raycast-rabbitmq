import { useContext } from "react";
import { LoadingContext } from "../contexts/LoadingContext";


export const useIsLoading = () => {
  return useContext(LoadingContext);
}
