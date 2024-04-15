// TODO this file compiles incorrectly
import axios, { AxiosInstance } from "axios";
import { BindingResponse, ExchangeResponse, ListBindingsOpts, PaginationOpts } from "../typing/rabbitMQ";
import { camelizeObj } from "../utils/camelizeObj";

interface SendMessageOpts {
  queue: string;
  message: string;
}

interface SendJsonMessageOpts extends Omit<SendMessageOpts, "data"> {
  content: object;
}


export class RabbitMQ {
  protected static instance?: RabbitMQ;
  protected httpClient: AxiosInstance;
  private _isReady = false;

  constructor(apiUrl: string) {
    this.httpClient = this.initHTTPClient(apiUrl)
    this.init();
  }

  get isReady() {
    return this._isReady;
  }

  static getInstance(apiUrl: string): RabbitMQ {
    if (!RabbitMQ.instance) {
      RabbitMQ.instance = new RabbitMQ(apiUrl);
    }

    return RabbitMQ.instance;
  }


  public init() {
    try {
      console.log("installing rabbitmq_management plugin");
      this.enablePlugin("rabbitmq_management");
    } catch (e) {
      console.error(e);
      throw new Error(`failed to enable plugin rabbitmq_management: ${e}`);
    }

    this._isReady = true;
  }

  async listQueues() {
    return this.httpClient.get("/queues");
  }

  async getQueueByName(name: string) {
    return this.httpClient.get(`/queues/detailed`, {
      params: {
        name
      }
    });
  }

  async listExchanges(pageOpts: PaginationOpts & { vhost: string } = {
    page: 1,
    pageSize: 20,
    vhost: ""
  }): Promise<ExchangeResponse> {
    const urlEncodedVhost = encodeURIComponent(pageOpts.vhost);

    return this.httpClient.get(`/exchanges/${urlEncodedVhost}/`, {
      params: {
        "page_size": pageOpts.pageSize, // quotes to get around camelCase validation
        "use_regex": pageOpts.useRegex,
        page: pageOpts.page,
        name: pageOpts.name
      }
    }).then(r => r.data);
  }

  async listBindings({ srcExchange, destExchange, vhost }: ListBindingsOpts): Promise<BindingResponse> {
    vhost = encodeURIComponent(vhost);
    let exchange = "";
    let endpoint = "";

    if (srcExchange) {
      exchange = srcExchange;
      endpoint = "source";
    }

    if (destExchange) {
      exchange = destExchange;
      endpoint = "destination";
    }

    exchange = encodeURIComponent(exchange);
    return this.httpClient.get(`exchanges/${vhost}/${exchange}/bindings/${endpoint}`).then(r => r.data);
  }

  async getExchange(name: string, vhost: string) {
    const urlEncodedVhost = encodeURIComponent(vhost);
    return this.httpClient.get(`/exchanges/${urlEncodedVhost}/${name}`).then(r => r.data);
  }

  async send(sendOpts: SendMessageOpts) {
    sendOpts;
    return this;
  }

  async json(sendOpts: SendJsonMessageOpts) {
    return this.send({
      ...sendOpts,
      message: JSON.stringify(sendOpts.content)
    });
  }

  protected enablePlugin(name: string) {
    name;
    return this;
  }

  protected initHTTPClient(apiUrl: string): AxiosInstance {
    this;

    const client = axios.create({
      baseURL: apiUrl
    });

    client.interceptors.request.use((config) => {
      console.log(`${config.method?.toUpperCase()} ${config.url}`);

      config.auth = {
        username: "guest",
        password: "guest"
      };

      return config;
    });

    client.interceptors.response.use((response) => {
      if (typeof response.data === "object") {
        response.data = camelizeObj(response.data);
      }

      return response;
    });
    
    return client;
  }
}