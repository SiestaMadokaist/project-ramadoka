import { GachaStore, GachaResult } from './store';
import { Memoize } from '@cryptoket/ts-memoize';
import { PhantomString, ST } from '../../../helper/types';
import { HexString, HT, Hexadecimal, Hex } from '../../../modules/hashing';
import { GachaRNG, GachaFactory } from './generator';
import { INSTANCE } from '../../../initial/instances';

export interface IGachaLoader {
  store: GachaStore;
  mnemonics: Array<PhantomString<ST.CLIENT_MNEMONICS>>;
  cacheKey: HexString<HT.CACHE_KEY>;
}

export class GachaLoader {

  __memo__: {
    gachas?: Promise<GachaRNG[]>;
    clientMnemonics?: Promise<Array<PhantomString<ST.CLIENT_MNEMONICS>>>;
    serverSeeds?: Promise<Array<HexString<HT.SERVER_SEED>>>;
    serverHashedSeeds?: Promise<Array<Hexadecimal<HT.SERVER_HASHED_SEED>>>
  } = {};

  constructor(private readonly props: IGachaLoader) {}

  private store(): GachaStore {
    return this.props.store;
  }

  cacheKey(): HexString<HT.CACHE_KEY> {
    return this.props.cacheKey;
  }

  private async gachas(): Promise<GachaRNG[]> {
    return Memoize(this, 'gachas', () => {
      return GachaFactory.loadAndLock(this.cacheKey());
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

  async getResult(): Promise<GachaResult[]> {
    const gachas = await this.gachas();
    const clientMnemonics = await this.clientMnemonics();
    const result = gachas
      .map((gacha, i) => gacha.combine(clientMnemonics[i]))
      .map((rngHash) => this.store().placement(rngHash));
    return result;
  }

}
