import joi from '@hapi/joi';
import BigNumber from 'bignumber.js';
export enum ST {
  LAMBDA_ENV = 'LAMBDA_ENV',
  SERVER_SEED_HASH = 'SERVER_SEED_HASH',
  SERVER_SEED = 'SERVER_SEED',
}

export enum NT {
  MULTIPLIER = 'MULTIPLIER',
  DAMAGE = 'DAMAGE',
}

export type PaginationQuery<T = unknown> = T & { before?: Date, limit?: number };
export type STK = (keyof typeof ST);
export type NTK = (keyof typeof NT);
export type PhantomString<T extends ST> = string & { '__@phantomId': T, '__@phantomType': 'PhantomString' };
export type PhantomNumber<T extends NT> = number & { '__@phantomId': T, '__@phantomType': 'PHantomNumber' };
type NumberLike<T extends NT> = PhantomBigNumber<T> | PhantomNumber<T>;

export interface PhantomBigNumber<T extends NT> extends BigNumber {
  plus(n: NumberLike<T>): PhantomBigNumber<T>;
  minus(n: NumberLike<T>): PhantomBigNumber<T>;
  multipliedBy(n: NumberLike<NT.MULTIPLIER>): PhantomBigNumber<T>;
  multipliedBy(n: NumberLike<NT>): PhantomBigNumber<NT>;
  dividedBy(n: NumberLike<NT.MULTIPLIER>): PhantomBigNumber<T>;
  dividedBy(n: NumberLike<NT>): PhantomBigNumber<NT>;
}

export const NUMBER = {
  ZERO<T extends NT>(): PhantomBigNumber<T> { return new BigNumber(0); },
  ONE<T extends NT>(): PhantomBigNumber<T> { return new BigNumber(1); },
};

export type NestedRequired<T> = Required<{ [K in keyof T]: NestedRequired<T[K]> }>;

export interface PostEndpoint {
  method: 'post';
  path: string;
  body: unknown;
  response: unknown;
}
