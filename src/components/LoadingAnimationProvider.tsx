import React, { PropsWithChildren, useEffect, useState } from "react";
import { Detail } from "@raycast/api";
import { useIsLoading } from "../hooks/useIsLoading";

const markdownMessages = [
  "**Loading...** Please wait.",
  "**Gathering data...** Hang tight!",
  "**Almost there...** Stay tuned!",
  "**Preparing content...** Just a bit more!",
  "**Fetching details...** Hold on!",
  "**Crunching numbers...** Almost done!",
  "**Finalizing...** Thank you for waiting.",
  "**Wrapping up...** Nearly finished!",
  "**Polishing...** Just a moment!",
  "**Complete!** Ready to go."
];

interface IProps extends PropsWithChildren {
}

export const LoadingAnimationProvider: React.FC<IProps> = ({ children }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const isLoading = useIsLoading();
  
  useEffect(function animateIfLoading() {
    if (!isLoading) {
      return;
    }

    const intervalId = setInterval(() => {
      const newIdx = Math.floor(Math.random() * markdownMessages.length);
      setCurrentIdx(newIdx);
    }, 50);

    return () => {
      clearInterval(intervalId);
    };
  }, [isLoading]);

  return isLoading ? <Detail markdown={markdownMessages[currentIdx]} isLoading={isLoading} /> : children;
};