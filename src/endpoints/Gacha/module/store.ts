import { PhantomBigNumber, NT, NUMBER, PhantomNumber } from '../../../helper/types';
import { Memoize } from '@cryptoket/ts-memoize';
import BigNumber from 'bignumber.js';
import { Hexadecimal, HT, Hex } from '../../../modules/hashing';
import { Joy } from '../../../helper/joy';

export enum RARITY {
  SSR = 'SSR',
  SR = 'SR',
  R = 'R',
  C = 'C',
}

export interface GachaResult {
  name: string;
  rarity: RARITY;
  odds: PhantomNumber<NT.ODDS>;
}

interface IGachaStore {
  store: GachaResult[];
}

const schema: Joy.SchemaOf<IGachaStore> = Joy.object<IGachaStore>().keys({
  store: Joy.array<GachaResult>().items(Joy.object<GachaResult>().keys({
    name: Joy.string().required(),
    odds: Joy.number().required().integer(),
    rarity: Joy.enums(RARITY).required(),
  }).required()).required(),
}).required();

export class GachaStore {
  private props: IGachaStore;
  constructor(props: IGachaStore) {
    this.props = schema.validate(props).value;
  }

  private store(): GachaResult[] {
    return this.props.store;
  }

  __memo__: {
    totalChance?: PhantomBigNumber<NT.ODDS>;
  } = {};

  placement(rngScoreHex: Hexadecimal<HT.RNG_HASH>): GachaResult {
    let currentScore = NUMBER.ZERO<NT.ODDS>();
    const accumulativeOdds = this.accumulativeOdds();
    for (const gr of this.store()) {
      const incr = NUMBER.ONE<NT.ODDS>().multipliedBy(gr.odds).dividedBy(accumulativeOdds);
      currentScore = currentScore.plus(incr);
      const currentScoreHex = Hex.fromNumber<HT.RNG_HASH>(currentScore);
      if (rngScoreHex.lt(currentScoreHex)) { return gr; }
    }
    return this.store()[this.store().length];
  }

  private accumulativeOdds(): PhantomBigNumber<NT.ODDS> {
    return Memoize(this, 'totalChance', () => {
      let total = NUMBER.ZERO<NT.ODDS>();
      for (const gr of this.store()) {
        total = total.plus(new BigNumber(gr.odds));
      }
      return total;
    });
  }
}
