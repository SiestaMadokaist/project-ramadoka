import * as RP from '@cryptoket/redis-proxy';
import { HexString, HT } from '../../../modules/hashing';
import { GachaInit } from './generator';
import { TIMESECOND } from '../../../helper/utility';
export class Gachache {
  private static LOCK_TTL: TIMESECOND.ONE.HOUR = TIMESECOND.ONE.HOUR;
  constructor(private readonly _client: RP.Base) {}

  private client(): RP.Base {
    return this._client;
  }

  async loadAndLock(cacheKey: HexString<HT.CACHE_KEY>): Promise<GachaInit[]> {
    const cache = await this.client();
    await cache.lock(cacheKey, Gachache.LOCK_TTL);
    const data: null | Record<HexString<HT.SERVER_HASHED_SEED>, HexString<HT.SERVER_SEED>> = await cache.hgetall(cacheKey);
    if (data === null) { throw new Error(`cacheKey not found: ${cacheKey}`); }
    const seeds = Object.values(data) as Array<HexString<HT.SERVER_SEED>>;
    return seeds.map((seed) => new GachaInit({ cacheKey, seed }));
  }

  async store(cacheKey: HexString<HT.CACHE_KEY>, gachas: GachaInit[]): Promise<void> {
    const cache = this.client();
    const map = new Map<HexString<HT.SERVER_HASHED_SEED>, HexString<HT.SERVER_SEED>>();
    for (const gacha of gachas) { map.set(gacha.hashedSeed(), gacha.serverSeed()); }
    const store: Record<HexString<HT.SERVER_HASHED_SEED>, HexString<HT.SERVER_SEED>> = (Object as any).fromEntries(map);
    await cache.hmset(cacheKey, store, Gachache.LOCK_TTL);
  }

}
