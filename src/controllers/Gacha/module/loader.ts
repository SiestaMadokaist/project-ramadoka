import { Memoize } from '@cryptoket/ts-memoize';
import { PhantomString, ST } from '../../../helper/phantom-types';
// import { GachaRNG, GachaFactory } from './generator';
import { INSTANCE } from '../../../initial/instances';
import { Hex, Hexadecimal, HexString, HT } from '../../../modules/hashing';
import { Gachache } from './cache';
import { GachaInit } from './generator';
import { GachaResult, GachaStore } from '../store/base';

export interface IGachaLoader {
  cache: Gachache;
  mnemonics: PhantomString<ST.CLIENT_MNEMONICS>[];
  rollId: HexString<HT.ROLL_ID>;
  store: GachaStore;
}

export class GachaLoader {

  __memo__: {
    clientMnemonics?: Promise<PhantomString<ST.CLIENT_MNEMONICS>[]>;
    gachas?: Promise<GachaInit[]>;
    serverHashedSeeds?: Promise<Hexadecimal<HT.SERVER_HASHED_SEED>[]>
    serverSeeds?: Promise<HexString<HT.SERVER_SEED>[]>;
  } = {};

  constructor(private readonly props: IGachaLoader) {}

  cache(): Gachache {
    return this.props.cache;
  }

  async clientMnemonics(): Promise<PhantomString<ST.CLIENT_MNEMONICS>[]> {
    return Memoize(this, 'clientMnemonics', async () => {
      const gachas = await this.gachas();
      const { mnemonics } = this.props;
      const result = gachas.map((_, i) => mnemonics[i] ?? '') as PhantomString<ST.CLIENT_MNEMONICS>[];
      return result;
    });
  }

  async getResult(): Promise<GachaResult[]> {
    const hashes = await this.rngHashes();
    return hashes.map((rngHash) => this.store().placement(rngHash));
    // return result;
  }

  async rngHashes(): Promise<Hexadecimal<HT.RNG_HASH>[]> {
    const gachas = await this.gachas();
    const clientMnemonics = await this.clientMnemonics();
    const result = gachas
      .map((gacha, i) => gacha.combine(clientMnemonics[i]));
    return result;
  }

  rollId(): HexString<HT.ROLL_ID> {
    return this.props.rollId;
  }

  async serverSeeds(): Promise<HexString<HT.SERVER_SEED>[]> {
    return Memoize(this, 'serverSeeds', async () => {
      const gachas = await this.gachas();
      return gachas.map((g) => g.serverSeed());
    });
  }

  private async gachas(): Promise<GachaInit[]> {
    return Memoize(this, 'gachas', () => {
      return this.cache().loadAndLock(this.rollId());
    });
  }

  private store(): GachaStore {
    return this.props.store;
  }

}
