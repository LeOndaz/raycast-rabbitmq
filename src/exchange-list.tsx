import React from "react";
import { ExchangeList } from "./components/Exchange/ExchangeList";
import { CommandProvider } from "./components/CommandProvider";

export default function Command() {
  return (
    <CommandProvider>
      <ExchangeList />
    </CommandProvider>
  );
}
