import BigNumber from 'bignumber.js';
import type { PhantomBigNumber } from './bignumber';

export const NUMBER = {
  ZERO<T>(): PhantomBigNumber<T> { return new BigNumber(0); },
  ONE<T>(): PhantomBigNumber<T> { return new BigNumber(1); },
};

