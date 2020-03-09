import type { ID, Model } from '../Base';
import { PhantomNumber } from '../../helper/phantom-types';
import { SkillInterface } from '../Skill/interface';

export namespace CharacterInterface {
  export type SkillIndex = 0 | 1 | 2;
  export interface Schema extends Model<'character'> {
    level: PhantomNumber<'character-level'>;
    exp: PhantomNumber<'character-exp'>;
    skills: [SkillInterface.Schema, SkillInterface.Schema, SkillInterface.Schema];
  }
}
