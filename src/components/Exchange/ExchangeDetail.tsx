import React, { useEffect } from "react";
import { Exchange } from "../../typing/rabbitMQ";
import { List } from "@raycast/api";
import { useBindings } from "../../hooks/useBindings";

interface IProps {
  exchange: Exchange;
}

export const ExchangeDetail: React.FC<IProps> = ({ exchange }) => {
  const [bindings, isLoading, error] = useBindings({
    srcExchange: exchange.name,
    vhost: exchange.vhost
  });

  useEffect(function logBindingsOnUpdate() {
    if (!isLoading) {
      console.log(bindings);
      console.log(error);
    }
  }, [isLoading]);

  return <List>
    {isLoading &&
      <List.Item title={"Loading..."} />
    }
  </List>;
};