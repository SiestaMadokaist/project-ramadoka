import type { PhantomNumber } from '../../helper/phantom-types';
import { Schema } from 'dynamoose';
// import { ID, Model, defineTable, ITableConfig } from '../Base';
import type { CharacterInterface } from '../Characters/interface';
import { Joy } from '../../helper/joy';
import { UserStateInterface } from './interface';
import { Character } from '../Characters';
import { DBSchema } from '../Base';
import dynamoose from 'dynamoose';

export namespace UserState {
  const gte0 = (value: number) => value >= 0;
  const dbSchema = new DBSchema<UserStateInterface.Schema>({
    id: {
      type: 'string',
      required: true,
      hashKey: true,
    },
    credit: {
      type: 'number',
      // hashKey: true,
      validate: gte0,
    },
    createdAt: {
      type: 'number',
      validate: gte0,
    },
    characters: {
      type: 'map',
      map: {},
      validate: (value, model) => {
        return true;
      },
    },
    nonce: {
      type: 'number',
      rangeKey: true,
      required: true,
    },
    token: {
      type: 'number',
      validate: gte0,
    },
    updates: {
      type: 'map',
      map: {
        characters: 'map',
        credit: 'number',
        token: 'number',
        memo: 'string',
      },
    }
  });

  type KeySchema = Pick<UserStateInterface.Schema, 'id' | 'nonce'>;
  const base = dynamoose.model<UserStateInterface.Schema, KeySchema>('development-user_states', dbSchema);
  export class Table extends base {
    private combineCharacaters(value: Record<string, CharacterInterface.Schema>): UserStateInterface.Schema['characters'] {
      // @todo
      const prev = this.characters;
      const ids = Object.values(value).map((v) => v.id);
      return prev;
    }

    async update(value: UserStateInterface.Schema['updates']): Promise<Table> {
      const updated = await this.localUpdate(value);
      await updated.save({ overwrite: false });
      return updated;
    }

    localUpdate(value: UserStateInterface.Schema['updates']): Table {
      return new Table({
        characters: this.combineCharacaters(value.characters ?? {}),
        createdAt: Date.now(),
        credit: this.credit + (value.credit ?? 0),
        token: this.token + (value.token ?? 0),
        nonce: this.nonce + 1,
        id: this.id,
        updates: value,
      });
    }
  }
  const _typecheck: (typeof base)['prototype'] = {} as any as Table;
}
