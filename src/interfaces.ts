// subscription and subscribe and subscriber
export type TBusSubscriptions = "next" | "error" | "complete";

export interface IBusSubscriptionCallbackFunctionBack<T = any> {
  (value: T): void;
}

export interface IBusSubscriptionCallbackFunctionParam<T = any> {
  data: T;
  next: IBusSubscriptionCallbackFunctionBack;
  error: IBusSubscriptionCallbackFunctionBack;
  complete: IBusSubscriptionCallbackVoidFunction;
}

export interface IBusSubscriptionCallbackFunction<T = any> {
  (sub: IBusSubscriptionCallbackFunctionParam<T>): void;
}

export interface IBusSubscriptionCallbackVoidFunction {
  (): void;
}

export interface IBusSubscriptionCallback<N = any, E = any> {
  start?: IBusSubscriptionCallbackVoidFunction;
  next?: IBusSubscriptionCallbackFunction<N>;
  error?: IBusSubscriptionCallbackFunction<E>;
  complete?: IBusSubscriptionCallbackVoidFunction;
}

export interface IBusSubscription<T = string, N = any, E = any> {
  subject: T;
  callback: IBusSubscriptionCallback<N, E>;
  once?: boolean;
}

export interface IBusSubscriber {
  unsubscribe: () => void;
}
// subject
export interface IBusSubject<N = any, E = any> {
  id: string; // for unsubscribtion
  once: boolean;
  started: boolean;
  callback: IBusSubscriptionCallback<N, E>;
}

export interface IBusSubjectMap {
  [subject: string]: IBusSubject[];
}

export interface IBusUseSubjectMap {
  [subject: string]: IBusSubscriptionCallbackFunction;
}
// call
export interface IBusCall<S = string, P = any> {
  subject: S;
  param?: P;
  type?: TBusSubscriptions;
  id?: string; // for back subject
}
