import { Action, ActionPanel, List } from "@raycast/api";
import { ExchangeDetail } from "./ExchangeDetail";
import { useExchanges } from "../../hooks/useExchanges";
import { usePagination } from "../../hooks/usePagination";

export const ExchangeList = () => {
  const {
    page,
    pageSize
  } = usePagination();

  const [exchanges, isLoading] = useExchanges({
    page,
    pageSize,
    vhost: "/"
  }); // FIXME, 1

  return <List>
    {!isLoading && exchanges &&
      exchanges.items.map(exchange => <List.Item
        key={exchange.name || "default"}
        icon="list-icon.png"
        title={exchange.name || "AMQP default"}
        actions={
          <ActionPanel>
            <Action.Push title="Get Bindings" target={<ExchangeDetail exchange={exchange} />} />
          </ActionPanel>
        }
      />)
    }
  </List>;
};