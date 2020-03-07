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
  const greaterThan0 = (value: number) => value > 0;
  const dbSchema = new DBSchema<UserStateInterface.Schema>({
    id: {
      type: 'string',
      required: true,
      hashKey: true,
    },
    credit: {
      type: 'number',
      validate: greaterThan0,
    },
    createdAt: {
      type: 'number',
      validate: greaterThan0,
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
      validate: greaterThan0,
    },
  });

  type KeySchema = Pick<UserStateInterface.Schema, 'id' | 'nonce'>;
  export const Table = dynamoose.model<UserStateInterface.Schema, KeySchema>('production-user_states', dbSchema);
}
