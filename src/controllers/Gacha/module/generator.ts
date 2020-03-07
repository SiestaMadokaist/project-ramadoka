import { Memoize } from '@cryptoket/ts-memoize';
import sha256 from 'sha256';
import { PhantomString, ST } from '../../../helper/phantom-types';
import { TIMESECOND } from '../../../helper/utility';
import { Hex, Hexadecimal, HexString, HT } from '../../../modules/hashing';
import type { Gachache } from './cache';

interface IGachaInitProps {
  rollId: HexString<HT.ROLL_ID>;
  seed: HexString<HT.SERVER_SEED>;
}
export class GachaInit {

  static async generateNew(cache: Gachache, rollId: HexString<HT.ROLL_ID>, n: number): Promise<GachaInit[]> {
    const seeds = [ ...new Array(n)].map(() => Hex.uid<HT.SERVER_SEED>());
    const gachas = seeds.map((seed) => new GachaInit({ seed, rollId }));
    await cache.store(rollId, gachas);
    return gachas;
  }
  #props: IGachaInitProps;

  __memo__: {
    serverHash?: HexString<HT.SERVER_HASHED_SEED>;
  } = {};
  constructor(props: IGachaInitProps) {
    this.#props = props;
  }

  combine(message: PhantomString<ST.CLIENT_MNEMONICS>): Hexadecimal<HT.RNG_HASH> {
    return Hex.getRNG(Hex.hex(this.serverSeed()), Hex.hash(message));
  }

  hashedSeed(): HexString<HT.SERVER_HASHED_SEED> {
    return Memoize(this, 'serverHash', () => {
      return Hexadecimal.hash<HT.SERVER_HASHED_SEED>(this.serverSeed()).toString('hex');
    });
  }

  serverSeed(): HexString<HT.SERVER_SEED> {
    return this.#props.seed;
  }

}
