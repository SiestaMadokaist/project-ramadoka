import sha256 from 'sha256';
import * as uuid from 'uuid';
import BigNumber from 'bignumber.js';
import { NT, NumberLike } from '../helper/phantom-types/number';
import { COMPARE } from '../helper/utility';
import { PhantomBase } from '../helper/phantom-types/base';
export enum HT {
  SERVER_HASHED_SEED = 'SERVER_HASHED_SEED',
  /**
   * @description
   * a 64 digit hexadecimal
   */
  CLIENT_SEED = 'CLIENT_SEED',
  /**
   * @description
   * a 64 digit hexadecimal
   */
  SERVER_SEED = 'SERVER_SEED',
  RNG_HASH = 'RNG_HASH',

  ROLL_ID = 'ROLL_ID',
}

export type HexString<T extends HT> = PhantomBase<string, T, 'HexString'>;

export class Hexadecimal<T extends HT> extends Buffer {
  '__@phantomId': T;
  '__@phantomType': 'PhantomHex';
  static uid<T extends HT>(): HexString<T> {
    return sha256.x2(uuid.v4()) as HexString<T>;
  }

  static fromString<T extends HT>(s: string, encoding?: 'hex'): Hexadecimal<T> {
    const proto = Buffer.from(s, encoding);
    (proto as any).prototype = this.prototype;
    return proto as Hexadecimal<T>;
    // return {
    //   __proto__: proto,
    //   ...(this.prototype),
    // } as any;
  }

  toString!: (h?: 'hex') => HexString<T>;

  static hash<T extends HT>(s: string): Hexadecimal<T> {
    return Hexadecimal.fromString(sha256.x2(s));
  }

  static hex<T extends HT>(s: HexString<HT>): Hexadecimal<T> {
    return Hexadecimal.fromString(s, 'hex');
  }

  static FF: BigNumber = new BigNumber(256);
  static fromNumber<T extends HT>(n: NumberLike<NT>): Hexadecimal<T> {
    const size = 32;
    const { FF } = Hexadecimal;
    let calcs = FF.pow(size).multipliedBy(n).minus(1);
    const result = Hexadecimal.alloc(size);
    for (let i = 0; i < size; i++) {
      const x = i + 1;
      const divisor = FF.pow(size - x);
      const m = calcs.dividedToIntegerBy(divisor);
      calcs = calcs.minus(m.multipliedBy(divisor));
      result[i] = m.toNumber();
    }
    return result as Hexadecimal<T>;
  }

  static getRNG(serverSeed: Hexadecimal<HT.SERVER_SEED>, clientHash: Hexadecimal<HT.CLIENT_SEED>): Hexadecimal<HT.RNG_HASH> {
    const result = sha256.x2(Buffer.concat([serverSeed as Buffer, clientHash]));
    return Hexadecimal.fromString(result, 'hex');
  }

  // lt(other: Hexadecimal<T>): boolean {
  //   return this.compare(other as Buffer) === COMPARE.LT;
  // }

  // gt(other: Hexadecimal<T>): boolean {
  //   return this.compare(other as Buffer) === COMPARE.GT;
  // }

  // eq(other: Hexadecimal<T>): boolean {
  //   return this.compare(other as Buffer) === COMPARE.EQ;
  // }

  // lte(other: Hexadecimal<T>): boolean {
  //   return this.lt(other) || this.eq(other);
  // }

  // gte(other: Hexadecimal<T>): boolean {
  //   return this.gt(other) || this.eq(other);
  // }

}
type STATICS = 'getRNG' | 'fromNumber' | 'hex' | 'hash' | 'uid';
export const Hex: Pick<(typeof Hexadecimal), STATICS> = Hexadecimal;

// export const Hexadecimal: Pick<$Hexadecimal, STATICS> = $Hexadecimal;
