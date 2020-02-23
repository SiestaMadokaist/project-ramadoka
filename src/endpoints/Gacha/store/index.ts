import { GachaStore, GachaResult, RARITY } from '../module/store';
import { PhantomNumber, NT } from '../../../helper/types';

const SSRs: GachaResult[] = [ ...new Array(3) ].map((i) => ({
  name: `SSR #${i}`,
  odds: 1 as PhantomNumber<NT.ODDS>,
  rarity: RARITY.SSR,
}));
const SRs: GachaResult[] = [ ...new Array(27) ].map((i) => ({
  name: `SR #${i}`,
  odds: 4 as PhantomNumber<NT.ODDS>,
  rarity: RARITY.SSR,
}));

export const StoryGacha = new GachaStore({
  store: [...SSRs, ...SRs]
});
