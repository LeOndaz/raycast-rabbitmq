import { ExchangeResponse, PaginationOpts } from "../typing/rabbitMQ";
import { useDeferredState } from "./useDeferredState";
import { useRabbitMQ } from "./useRabbitMQ";

export const useExchanges = (opts: PaginationOpts & { vhost: string }) => {
  const rabbitMQ = useRabbitMQ()
  return useDeferredState<ExchangeResponse>(() => rabbitMQ.listExchanges(opts), undefined);
};