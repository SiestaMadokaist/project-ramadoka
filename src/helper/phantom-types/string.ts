import { PhantomBase } from './base';

export enum ST {
  /**
   * @description
   * any kind of string
   */
  CLIENT_MNEMONICS = 'CLIENT_MNEMONICS',

  CACHE_KEY = 'CACHE_KEY',
}
export type STK = (keyof typeof ST);
export type PhantomString<T extends ST> = PhantomBase<string, T, 'PhantomString'>;
