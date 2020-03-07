import { PhantomBase } from './base';
import type { PhantomBigNumber } from './bignumber';
export enum NT {
  STAMINA = 'STAMINA',
  QUARTZ_TOKEN = 'QUARTZ_TOKEN',
  KILO_STAMINA = 'KILO_STAMINA',
  MS_DIFF = 'MS_DIFF',
  STAMINA_PER_MS = 'STAMINA_PER_MS',
  TIMESTAMP_MS = 'TIMESTAMP_MS',
  MULTIPLIER = 'MULTIPLIER',
  DAMAGE = 'DAMAGE',
  ODDS = 'ODDS',
}
export type NumberLike<T> = PhantomBigNumber<T> | PhantomNumber<T>;
export type PhantomNumber<T> = PhantomBase<number, T, 'PhantomNumber'>;
// export type TypedNumber<X> = PhantomBase<number, X, 'TypedNumber'>;
