import { Memoize } from '@cryptoket/ts-memoize';
import BigNumber from 'bignumber.js';
import { Joy } from '../../../helper/joy';
import { logger } from '../../../helper/logger';
import { NT, NUMBER, PhantomBigNumber, PhantomNumber } from '../../../helper/phantom-types';
import { COMPARE } from '../../../helper/utility';
import { Hex, Hexadecimal, HT } from '../../../modules/hashing';

export enum RARITY {
  SSR = 'SSR',
  SR = 'SR',
  R = 'R',
  C = 'C',
}

export interface GachaResult {
  name: string;
  odds: PhantomNumber<NT.ODDS>;
  rarity: RARITY;
}

interface IGachaStore {
  store: GachaResult[];
}

const schema: Joy.SchemaOf<IGachaStore> = Joy.object<IGachaStore>().keys({
  store: Joy.array<GachaResult[]>().items(Joy.object<GachaResult>().keys({
    name: Joy.string().required(),
    odds: Joy.number().required().integer(),
    rarity: Joy.enums(RARITY).required(),
  }).required()).required(),
}).required();

export class GachaStore {
  private props: IGachaStore;

  __memo__: {
    totalChance?: PhantomBigNumber<NT.ODDS>;
  } = {};
  constructor(props: IGachaStore) {
    this.props = schema.validate(props).value;
  }

  placement(rngScoreHex: Hexadecimal<HT.RNG_HASH>): GachaResult {
    let currentScore = NUMBER.ZERO<NT.ODDS>();
    const accumulativeOdds = this.accumulativeOdds();
    for (const gr of this.store()) {
      const incr = NUMBER.ONE<NT.ODDS>().multipliedBy(gr.odds).dividedBy(accumulativeOdds);
      currentScore = currentScore.plus(incr);
      const currentScoreHex = Hex.fromNumber<HT.RNG_HASH>(currentScore);
      if (rngScoreHex.compare(currentScoreHex) === COMPARE.LT) { return gr; }
      if (rngScoreHex.compare(currentScoreHex) === COMPARE.EQ) { return gr; }
    }
    throw new Error(rngScoreHex.toString('hex'));
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

  private store(): GachaResult[] {
    return this.props.store;
  }
}
