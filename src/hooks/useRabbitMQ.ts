import { RabbitMQ } from "../api/amqp";

export const useRabbitMQ = (apiUrl: string) => {
  return RabbitMQ.getInstance(apiUrl)
};