import { ListBindingsOpts, BindingResponse } from "../typing/rabbitMQ";
import { useDeferredState } from "./useDeferredState";

export const useBindings = (opts: ListBindingsOpts) => {
  return useDeferredState<BindingResponse>((rabbitMQ) => rabbitMQ.listBindings(opts));
};