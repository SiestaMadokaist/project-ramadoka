import type { ID, Model } from '../Base';
import { PhantomNumber } from '../../helper/phantom-types';

export namespace SkillInterface {

  export interface Schema extends Model<'skill'> {
    level: PhantomNumber<'skill-level'>;
  }

}
