import BigNumber from 'bignumber.js';
import type { PhantomBigNumber } from './bignumber';
import { NT } from './number';

export const NUMBER = {
  ZERO<T extends NT>(): PhantomBigNumber<T> { return new BigNumber(0); },
  ONE<T extends NT>(): PhantomBigNumber<T> { return new BigNumber(1); },
};
