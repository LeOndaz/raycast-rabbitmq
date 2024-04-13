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

  protected httpClient?: AxiosInstance;
  protected apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  static getInstance() {
    if (RabbitMQ.instance) {
      return RabbitMQ.instance;
    }

    return this.constructor("http://localhost:15672/api"); // hardcoded for now
  }


  public async init() {
    try {
      console.log("initializing HTTP client");
      await this.initHTTPClient(this.apiUrl).catch(console.error);
    } catch (e) {
      console.error(e);
      throw new Error(`failed to init axios: ${e}`);
    }

    try {
      console.log("installing rabbitmq_management plugin");
      await this.enablePlugin("rabbitmq_management").catch(console.error);
    } catch (e) {
      console.error(e);
      throw new Error(`failed to enable plugin rabbitmq_management: ${e}`);
    }
  }

  async listQueues() {
    return this.httpClient!.get("/queues");
  }

  async getQueueByName(name: string) {
    return this.httpClient!.get(`/queues/detailed`, {
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

    return this.httpClient!.get(`/exchanges/${urlEncodedVhost}/`, {
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
    return this.httpClient!.get(`exchanges/${vhost}/${exchange}/bindings/${endpoint}`).then(r => r.data);
  }

  async getExchange(name: string, vhost: string) {
    const urlEncodedVhost = encodeURIComponent(vhost);
    return this.httpClient!.get(`/exchanges/${urlEncodedVhost}/${name}`).then(r => r.data);
  }

  async send(sendOpts: SendMessageOpts) {
    return this.apiUrl || sendOpts;
  }

  async json(sendOpts: SendJsonMessageOpts) {
    return this.send({
      ...sendOpts,
      message: JSON.stringify(sendOpts.content)
    });
  }

  protected async enablePlugin(name: string) {
    name;
    return this;
  }

  protected async initHTTPClient(apiUrl: string) {
    this.httpClient = axios.create({
      baseURL: apiUrl
    });

    this.httpClient.interceptors.request.use((config) => {
      console.log(`${config.method?.toUpperCase()} ${config.url}`);

      config.auth = {
        username: "guest",
        password: "guest"
      };

      return config;
    });

    this.httpClient.interceptors.response.use((response) => {
      if (typeof response.data === "object") {
        response.data = camelizeObj(response.data);
      }

      return response;
    });
  }
}