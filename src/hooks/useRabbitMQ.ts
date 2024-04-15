import { RabbitMQ } from "../api/amqp";

export const useRabbitMQ = () => {
  const rabbitMQ = RabbitMQ.getInstance("http://localhost:15672/api");
  

  if (!rabbitMQ.isReady) {
    rabbitMQ.init();
  }

  return rabbitMQ;
};