import { GachaStore, GachaResult } from './store';
import { Memoize } from '@cryptoket/ts-memoize';
import { PhantomString, ST } from '../../../helper/phantom-types';
import { HexString, HT, Hexadecimal, Hex } from '../../../modules/hashing';
// import { GachaRNG, GachaFactory } from './generator';
import { INSTANCE } from '../../../initial/instances';
import { GachaInit } from './generator';
import { Gachache } from './cache';

export interface IGachaLoader {
  store: GachaStore;
  cache: Gachache;
  mnemonics: Array<PhantomString<ST.CLIENT_MNEMONICS>>;
  rollId: HexString<HT.ROLL_ID>;
}

export class GachaLoader {

  __memo__: {
    gachas?: Promise<GachaInit[]>;
    clientMnemonics?: Promise<Array<PhantomString<ST.CLIENT_MNEMONICS>>>;
    serverSeeds?: Promise<Array<HexString<HT.SERVER_SEED>>>;
    serverHashedSeeds?: Promise<Array<Hexadecimal<HT.SERVER_HASHED_SEED>>>
  } = {};

  constructor(private readonly props: IGachaLoader) {}

  private store(): GachaStore {
    return this.props.store;
  }

  rollId(): HexString<HT.ROLL_ID> {
    return this.props.rollId;
  }

  cache(): Gachache {
    return this.props.cache;
  }

  private async gachas(): Promise<GachaInit[]> {
    return Memoize(this, 'gachas', () => {
      return this.cache().loadAndLock(this.rollId());
    });
  }

  async clientMnemonics(): Promise<Array<PhantomString<ST.CLIENT_MNEMONICS>>> {
    return Memoize(this, 'clientMnemonics', async () => {
      const gachas = await this.gachas();
      const { mnemonics } = this.props;
      const result = gachas.map((_, i) => mnemonics[i] || '') as Array<PhantomString<ST.CLIENT_MNEMONICS>>;
      return result;
    });
  }

  async serverSeeds(): Promise<Array<HexString<HT.SERVER_SEED>>> {
    return Memoize(this, 'serverSeeds', async () => {
      const gachas = await this.gachas();
      return gachas.map((g) => g.serverSeed());
    });
  }

  async rngHashes(): Promise<Array<Hexadecimal<HT.RNG_HASH>>> {
    const gachas = await this.gachas();
    const clientMnemonics = await this.clientMnemonics();
    const result = gachas
      .map((gacha, i) => gacha.combine(clientMnemonics[i]));
    return result;
  }

  async getResult(): Promise<GachaResult[]> {
    const hashes = await this.rngHashes();
    return hashes.map((rngHash) => this.store().placement(rngHash));
    // return result;
  }

}
