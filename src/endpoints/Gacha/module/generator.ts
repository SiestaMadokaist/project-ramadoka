import { PhantomString, ST } from '../../../helper/types';
import uuid from 'uuid';
import sha256 from 'sha256';
import { Memoize } from '@cryptoket/ts-memoize';
import { Hexadecimal, HT, HexString, Hex } from '../../../modules/hashing';
import * as RP from '@cryptoket/redis-proxy';
import { INSTANCE } from '../../../initial/instances';
import { TIME } from '@cryptoket/ts-promise-helper';
import { TIMESECOND } from '../../../helper/utility';
import { GachaResult, GachaStore } from './store';

class GachaHandler {
  static CACHE_LOCK: TIMESECOND.ONE.HOUR = TIMESECOND.ONE.HOUR;
  static async loadAndLock(cacheKey: HexString<HT.CACHE_KEY>): Promise<Gacha[]> {
    const cache = await INSTANCE.redisProxy();
    const data: null | Record<HexString<HT.SERVER_HASHED_SEED>, HexString<HT.SERVER_SEED>> = await cache.hgetall(cacheKey);
    if (data === null) { throw new Error(`cacheKey not found: ${cacheKey}`); }
    const keys = Object.keys(data) as Array<HexString<HT.SERVER_HASHED_SEED>>;
    const seeds = Object.values(data) as Array<HexString<HT.SERVER_SEED>>;
    return seeds.map((seed) => new Gacha({ cacheKey, seed }));
  }

  // static async getRNG(store: GachaStore, cacheKey: HexString<HT.CACHE_KEY>, messages: Array<PhantomString<ST.CLIENT_MNEMONICS>>): Promise<GachaResult[]> {
  //   const cache = await INSTANCE.redisProxy();
  //   await cache.lock(`lock:${cacheKey}`, GachaHandler.CACHE_LOCK);
  //   const gachas = await GachaHandler.loadAndLock(cacheKey);
  //   const gachaScores = gachas.map((g, i) => g.combine(messages[i]));
  //   return gachaScores.map((score) => store.placement(score));
  // }

  static async store(cacheKey: HexString<HT.CACHE_KEY>, gachas: Gacha[]): Promise<void> {
    const cache = await INSTANCE.redisProxy();
    const map = new Map<HexString<HT.SERVER_HASHED_SEED>, HexString<HT.SERVER_SEED>>();
    for (const gacha of gachas) {
      map.set(gacha.hashedSeed(), gacha.serverSeed());
    }
    const store: Record<HexString<HT.SERVER_HASHED_SEED>, HexString<HT.SERVER_SEED>> = (Object as any).fromEntries(map);
    await cache.hmset(cacheKey, store, GachaHandler.CACHE_LOCK);
  }

  static async generateNew(n: number): Promise<Gacha[]> {
    const cacheKey = Hex.uid<HT.CACHE_KEY>();
    const seeds = [ ...new Array(n)].map(() => Hex.uid<HT.SERVER_SEED>());
    const gachas = seeds.map((seed) => new Gacha({ seed, cacheKey }));
    await this.store(cacheKey, gachas);
    return gachas;
  }
}

export const GachaFactory: Pick<(typeof GachaHandler), 'generateNew' | 'loadAndLock'> = GachaHandler;
// export const GachaLoader: Pick<typeof GachaHandler, 'getRNG'> = GachaHandler;

class Gacha {

  __memo__: {
    serverHash?: HexString<HT.SERVER_HASHED_SEED>;
  } = {};
  constructor(private readonly props: { seed: HexString<HT.SERVER_SEED>, cacheKey: HexString<HT.CACHE_KEY>; }) {}

  serverSeed(): HexString<HT.SERVER_SEED> {
    return this.props.seed;
  }

  hashedSeed(): HexString<HT.SERVER_HASHED_SEED> {
    return Memoize(this, 'serverHash', () => {
      return sha256.x2(this.serverSeed()) as HexString<HT.SERVER_HASHED_SEED>;
    });
  }

  combine(message: PhantomString<ST.CLIENT_MNEMONICS>): Hexadecimal<HT.RNG_HASH> {
    return Hex.getRNG(Hex.hex(this.serverSeed()), Hex.hash(message));
  }

}

export type GachaRNG = Gacha;
