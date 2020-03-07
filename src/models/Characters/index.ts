import type { PhantomNumber } from '../../helper/phantom-types';
import { ID, Model, defineTable, ITableConfig } from '../Base';
import type { CharacterInterface } from '../Characters/interface';
import { Joy } from '../../helper/joy';
import { Skill } from '../Skill';
import { SkillInterface } from '../Skill/interface';

export namespace Character {
  export const schema: Joy.SchemaOf<CharacterInterface.Schema> = Joy.object<CharacterInterface.Schema>().keys({
    id: Joy.string().required(),
    level: Joy.number().required().min(0).max(100),
    exp: Joy.number().required(),
    skills: Joy.array<SkillInterface.Schema[]>().items(Skill.schema).required(),
  }).required();
}

