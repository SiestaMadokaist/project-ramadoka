import * as RP from '@cryptoket/redis-proxy';
import { logger } from '../../../helper/logger';
import { NT, PhantomNumber, PhantomString, ST } from '../../../helper/phantom-types';
import { assertNonNull } from '../../../helper/utility';
import { Hex, Hexadecimal, HexString, HT } from '../../../modules/hashing';
import { StoryGacha } from '../store';
import { Gachache } from './cache';
import { GachaInit } from './generator';
import { GachaLoader } from './loader';
import { GachaStore, RARITY } from '../store/base';

class RedisMock implements RP.Base {
  #hmset: Map<string, Record<string, string>> = new Map();
  __memo__: { client?: unknown; } = {};

  db(): number {
    return 0;
  }

  eval<T extends string | number | string[] | number[]>(script: string, keys: string[], argv: string[]): Promise<T> {
    throw new Error('Method not implemented.');
  }

  async hgetall(key: string): Promise<{ [k: string]: string; } | null> {
    const data = this.#hmset.get(key);
    return data ?? null;
  }

  async hmset(key: string, argv: { [k: string]: string | number; }, ttl?: number | undefined): Promise<unknown> {
    const normalized: Record<string, string> = {};
    Object.keys(argv).forEach((k) => normalized[k] = argv[k].toString());
    return this.#hmset.set(key, normalized);
  }

  async lock(key: string, ttl: number): Promise<() => Promise<void>> {
    // logger.d({ info: 'lock is currently inactivated' });
    return async () => {};
  }

  quit(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  rpush(key: string, argv: string[], ttl?: number | undefined): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

}

describe('GachaInit', () => {
  describe('#generateNew', () => {
    it('store the seeds', async () => {
      const rp = new RedisMock();
      const cache = new Gachache(rp);
      const rollId = Hex.uid<HT.ROLL_ID>();
      await GachaInit.generateNew(cache, rollId, 10);
      const result = await rp.hgetall(rollId);
      assertNonNull(result, `${rollId} has no cache`);
      for (const key of Object.keys(result as Record<string, string>)) {
        const seed = result[key];
        expect(Hexadecimal.hash(seed)).toEqual(Hexadecimal.hex(key as HexString<HT.SERVER_HASHED_SEED>));
      }
    });
  });

  describe('.gacha result', () => {
    const rp = new RedisMock();
    const cache = new Gachache(rp);
    const store = new GachaStore({ store: [
      {
        name: 'SSR',
        odds: 1 as PhantomNumber<NT.ODDS>,
        rarity: RARITY.SSR,
      },
      {
        name: 'SR',
        odds: 3 as PhantomNumber<NT.ODDS>,
        rarity: RARITY.SR,
      },
      {
        name: 'R',
        odds: 9 as PhantomNumber<NT.ODDS>,
        rarity: RARITY.R,
      },
    ]});
    const sizeCount = 1000;
    const rollId = Hex.uid<HT.ROLL_ID>();
    const mnemonics: PhantomString<ST.CLIENT_MNEMONICS>[] = [ ...new Array(sizeCount)]
      .map(() => Hex.uid() as string as PhantomString<ST.CLIENT_MNEMONICS>);

    it('has a correct lower boundary', async () => {
      const result = store.placement(Hexadecimal.fromNumber(0 as PhantomNumber<NT.ODDS>));
      expect(result.rarity).toBe(RARITY.SSR);
    });

    it('has a correct upper boundary', async () => {
      const result = store.placement(Hexadecimal.fromNumber(1 as PhantomNumber<NT.ODDS>));
      expect(result.rarity).toBe(RARITY.R);
    });

    it('is idempotent', async () => {
      await GachaInit.generateNew(cache, rollId, 1);
      const clientMnemonics = ['test' as PhantomString<ST.CLIENT_MNEMONICS>];
      const loader1 = new GachaLoader({ cache, rollId, mnemonics: clientMnemonics, store });
      const [ firstHash ] = await loader1.rngHashes();
      const loader2 = new GachaLoader({ cache, rollId, mnemonics: clientMnemonics, store });
      const [ secondHash ] = await loader2.rngHashes();
      expect(firstHash).toEqual(secondHash);
    });

    it('has a reasonable ratio from random sampling', async () => {
      await GachaInit.generateNew(cache, rollId, sizeCount);
      const loader = new GachaLoader({ cache, rollId, mnemonics, store });
      const result = await loader.getResult();
      result.forEach((x) => { expect(x.name).toMatch(/^(?:SR)|(?:SSR)|(?:R)$/); });
      const ssr = result.filter((x) => x.rarity === RARITY.SSR).length;
      const sr = result.filter((x) => x.rarity === RARITY.SR).length;
      const r = result.filter((x) => x.rarity === RARITY.R).length;
      expect(r).toBeGreaterThan(7 * ssr);
      expect(r).toBeGreaterThan(2 * sr);
      expect(r).toBeLessThan(12 * ssr);
      expect(r).toBeLessThan(4 * sr);
      expect(sr).toBeGreaterThan(2 * ssr);
      expect(sr).toBeLessThan(4 * ssr);
    });
  });
});
