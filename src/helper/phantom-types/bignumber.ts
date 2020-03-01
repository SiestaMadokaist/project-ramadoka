import { BigNumber } from 'bignumber.js';
import type { NT, PhantomNumber } from './number';
import type { NumberLike } from './number';

export function bnFrom<T extends NT>(n: NumberLike<T>): PhantomBigNumber<T> {
  return new BigNumber(n) as PhantomBigNumber<T>;
}

export interface PhantomBigNumber<T extends NT> extends BigNumber {
  '__@type'?: T;
  minus(n: NumberLike<T>): PhantomBigNumber<T>;
  plus(n: NumberLike<T>): PhantomBigNumber<T>;
  lt(n: NumberLike<T>): boolean;
  gt(n: NumberLike<T>): boolean;
  lte(n: NumberLike<T>): boolean;
  gte(n: NumberLike<T>): boolean;
  eq(n: NumberLike<T>): boolean;
  toNumber(): PhantomNumber<T>;
}

export interface TimestampValue extends BigNumber {
  '__@type'?: 'TimestampValue';
  minus(n: TimestampDiff): TimestampValue;
  minus(n: TimestampValue): TimestampDiff;
  plus(n: TimestampDiff): TimestampValue;
  plus(n: TimestampValue): TimestampDiff;
  lt(n: TimestampValue): boolean;
  gt(n: TimestampValue): boolean;
  lte(n: TimestampValue): boolean;
  gte(n: TimestampValue): boolean;
  eq(n: TimestampValue): boolean;
}

export interface TimestampDiff extends BigNumber {
  '__@type'?: 'TimestampDiff';
  minus(n: TimestampDiff): TimestampDiff;
  plus(n: TimestampDiff): TimestampDiff;
  plus(n: TimestampValue): TimestampValue;
  lt(n: TimestampDiff): boolean;
  gt(n: TimestampDiff): boolean;
  lte(n: TimestampDiff): boolean;
  gte(n: TimestampDiff): boolean;
}
