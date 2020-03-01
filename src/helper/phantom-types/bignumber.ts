import { NT } from './number';
import { BigNumber } from 'bignumber.js';
import type { NumberLike } from './number';
export interface PhantomBigNumber<T extends NT> extends BigNumber {
  plus(n: NumberLike<T>): PhantomBigNumber<T>;
  minus(n: NumberLike<T>): PhantomBigNumber<T>;
  multipliedBy(n: NumberLike<NT.MULTIPLIER>): PhantomBigNumber<T>;
  multipliedBy(n: NumberLike<NT>): PhantomBigNumber<NT>;
  dividedBy(n: NumberLike<NT.MULTIPLIER>): PhantomBigNumber<T>;
  dividedBy(n: NumberLike<NT>): PhantomBigNumber<NT>;
}
