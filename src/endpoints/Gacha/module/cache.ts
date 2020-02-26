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

  async loadAndLock(rollId: HexString<HT.ROLL_ID>): Promise<GachaInit[]> {
    const cache = await this.client();
    await cache.lock(rollId, Gachache.LOCK_TTL);
    const data: null | Record<HexString<HT.SERVER_HASHED_SEED>, HexString<HT.SERVER_SEED>> = await cache.hgetall(rollId);
    if (data === null) { throw new Error(`rollId not found: ${rollId}`); }
    const seeds = Object.values(data) as Array<HexString<HT.SERVER_SEED>>;
    return seeds.map((seed) => new GachaInit({ rollId, seed }));
  }

  async store(rollId: HexString<HT.ROLL_ID>, gachas: GachaInit[]): Promise<void> {
    const cache = this.client();
    const map = new Map<HexString<HT.SERVER_HASHED_SEED>, HexString<HT.SERVER_SEED>>();
    for (const gacha of gachas) { map.set(gacha.hashedSeed(), gacha.serverSeed()); }
    const store: Record<HexString<HT.SERVER_HASHED_SEED>, HexString<HT.SERVER_SEED>> = (Object as any).fromEntries(map);
    await cache.hmset(rollId, store, Gachache.LOCK_TTL);
  }

}
