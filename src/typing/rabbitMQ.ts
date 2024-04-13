export interface Exchange {
  // arguments: {};
  autoDelete: boolean;
  durable: boolean;
  internal: boolean;
  name: string;
  type: string;
  userWhoPerformedAction: string;
  vhost: string;
};

export interface Binding {
  destination: string,
  routing_key: string,
  // arguments"
}

export type BindingResponse = RabbitMQResponse<Binding>;

export interface RabbitMQResponse<T> {
  items: T[],
  itemCount: number;
  filteredCount: number;
}

export type ExchangeResponse = RabbitMQResponse<Exchange>;


export interface PaginationOpts {
  pageSize?: number;
  page?: number;
  name?: string;
  useRegex?: boolean;
}


type ListBindingsXOROpts = { srcExchange: string; destExchange?: never } | {
  srcExchange?: never;
  destExchange: string
};
export type ListBindingsOpts = ListBindingsXOROpts & { vhost: string }