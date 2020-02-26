import { PhantomString, ST } from '../../../helper/types';
import sha256 from 'sha256';
import { Memoize } from '@cryptoket/ts-memoize';
import { Hexadecimal, HT, HexString, Hex } from '../../../modules/hashing';
import { TIMESECOND } from '../../../helper/utility';
import type { Gachache } from './cache';

interface IGachaInitProps {
  seed: HexString<HT.SERVER_SEED>;
  rollId: HexString<HT.ROLL_ID>;
}
export class GachaInit {

  static async generateNew(cache: Gachache, rollId: HexString<HT.ROLL_ID>, n: number): Promise<GachaInit[]> {
    const seeds = [ ...new Array(n)].map(() => Hex.uid<HT.SERVER_SEED>());
    const gachas = seeds.map((seed) => new GachaInit({ seed, rollId }));
    await cache.store(rollId, gachas);
    return gachas;
  }

  __memo__: {
    serverHash?: HexString<HT.SERVER_HASHED_SEED>;
  } = {};
  #props: IGachaInitProps;
  constructor(props: IGachaInitProps) {
    this.#props = props;
  }

  serverSeed(): HexString<HT.SERVER_SEED> {
    return this.#props.seed;
  }

  hashedSeed(): HexString<HT.SERVER_HASHED_SEED> {
    return Memoize(this, 'serverHash', () => {
      return Hexadecimal.hash<HT.SERVER_HASHED_SEED>(this.serverSeed()).toString('hex');
    });
  }

  combine(message: PhantomString<ST.CLIENT_MNEMONICS>): Hexadecimal<HT.RNG_HASH> {
    return Hex.getRNG(Hex.hex(this.serverSeed()), Hex.hash(message));
  }

}
