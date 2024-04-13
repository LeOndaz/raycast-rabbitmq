import { ExchangeResponse, PaginationOpts } from "../typing/rabbitMQ";
import { useDeferredState } from "./useDeferredState";
import { RabbitMQ } from "../api/amqp";

export const useExchanges = (opts: PaginationOpts & { vhost: string }) => {
  return useDeferredState<ExchangeResponse>(() => RabbitMQ.getInstance().listExchanges(opts), undefined);
};