import BigNumber from 'bignumber.js';
import { NT } from './number';
import type { PhantomBigNumber } from './bignumber';

export const NUMBER = {
  ZERO<T extends NT>(): PhantomBigNumber<T> { return new BigNumber(0); },
  ONE<T extends NT>(): PhantomBigNumber<T> { return new BigNumber(1); },
};
