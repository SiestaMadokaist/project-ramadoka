import { PhantomBase } from './base';
import type { PhantomBigNumber } from './bignumber';
export enum NT {
  STAMINA = 'STAMINA',
  KILO_STAMINA = 'KILO_STAMINA',
  MS_DIFF = 'MS_DIFF',
  STAMINA_PER_MS = 'STAMINA_PER_MS',
  TIMESTAMP_MS = 'TIMESTAMP_MS',
  MULTIPLIER = 'MULTIPLIER',
  DAMAGE = 'DAMAGE',
  ODDS = 'ODDS',
}
export type NumberLike<T extends NT> = PhantomBigNumber<T> | PhantomNumber<T>;
export type NTK = (keyof typeof NT);
export type PhantomNumber<T extends NT> = PhantomBase<number, T, 'PhantomNumber'>;
