export type NestedRequired<T> = Required<{ [K in keyof T]: NestedRequired<T[K]> }>;
export { PhantomBigNumber } from './bignumber';
export { PhantomString, ST } from './string';
export { PhantomNumber, NT } from './number';
export { NUMBER } from './constant';

export interface PostEndpoint {
  headers: {
    Authorization?: string;
  };
  body: unknown;
  method: 'post';
  path: string;
  response: unknown;
}
