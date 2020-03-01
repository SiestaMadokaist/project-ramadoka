import type { PhantomBigNumber } from './bignumber';
import { PhantomBase } from './base';
export enum NT {
  MULTIPLIER = 'MULTIPLIER',
  DAMAGE = 'DAMAGE',
  ODDS = 'ODDS',
}
export type NumberLike<T extends NT> = PhantomBigNumber<T> | PhantomNumber<T>;
export type NTK = (keyof typeof NT);
export type PhantomNumber<T extends NT> = PhantomBase<number, T, 'PhantomNumber'>;
