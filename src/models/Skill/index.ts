import type { PhantomNumber } from '../../helper/phantom-types';
import { ID, Model, defineTable, ITableConfig } from '../Base';
import type { CharacterInterface } from '../Characters/interface';
import { Joy } from '../../helper/joy';
import { SkillInterface } from './interface';

export namespace Skill {
  export const schema: Joy.SchemaOf<SkillInterface.Schema> = Joy.object<SkillInterface.Schema>().keys({
    id: Joy.string().required(),
    level: Joy.number().required().min(0).max(10),
  }).required();

}
