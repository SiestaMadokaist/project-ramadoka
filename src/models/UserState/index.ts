import type { PhantomNumber } from '../../helper/phantom-types';
import { Schema } from 'dynamoose';
// import { ID, Model, defineTable, ITableConfig } from '../Base';
import type { CharacterInterface } from '../Characters/interface';
import { Joy } from '../../helper/joy';
import { UserStateInterface } from './interface';
import { Character } from '../Characters';
import { DBSchema, BaseModel, SchemaKeyAttribute } from '../Base';
import dynamoose from 'dynamoose';
import { assertNonNull, assert } from '../../helper/utility';
import { Memoize } from '@cryptoket/ts-memoize';
import BigNumber from 'bignumber.js';

export namespace UserState {
  const gte0 = (value?: number | BigNumber) => new BigNumber(value ?? 0).gte(0);
  const bigNumberMapper = {
    default: new BigNumber(0),
    type: 'number' as 'number',
    validate: gte0,
    get(value?: BigNumber): BigNumber {
      return new BigNumber(value ?? 0);
    },
    set(value?: BigNumber): number {
      return new BigNumber(value ?? 0).toNumber();
    },
  };
  const dbSchema = new DBSchema<UserStateInterface.Schema>({
    id: {
      type: 'string',
      required: true,
      hashKey: true,
    },
    credit: bigNumberMapper,
    createdAt: {
      default: () => Date.now(),
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
    token: bigNumberMapper,
    updates: {
      type: 'map',
      map: {
        credit: bigNumberMapper,
        token: bigNumberMapper,
        characters: { type: 'map', map: {} },
        memo: {
          type: 'string',
        }
      },
    }
  });

  type KeySchema = Pick<UserStateInterface.Schema, 'id' | 'nonce'>;
  const base = BaseModel.defineTable<UserStateInterface.Schema, KeySchema>('user_state', dbSchema);

  type Updates = UserStateInterface.Schema['updates'];
  type RUpdates = Omit<Required<Updates>, '__@type'>;

  class TableUpdater {
    constructor(private readonly table: Table, private readonly _updates: UserStateInterface.Schema['updates']) {}

    updates(): RUpdates {
      const updates: RUpdates = {
        credit: this._updates.credit ?? new BigNumber(0),
        token: this._updates.token ?? new BigNumber(0),
        characters: this._updates.characters ?? [],
        memo: this._updates.memo,
      };
      return updates;
    }

    incrToken(by: RUpdates['token']): TableUpdater {
      assert(by.gte(0), 'increment value must be greater than 0');
      const prevToken: RUpdates['token'] = this.updates().token;
      const updated = { ...this.updates(), token: prevToken.plus(by) };
      return new TableUpdater(this.table, updated);
    }

    useToken(by: RUpdates['token']): TableUpdater {
      assert(by.gte(0), 'used token must be greater than 0');
      const prevToken = this.updates().token;
      const updated = { ...this.updates(), token: prevToken.minus(by) };
      return new TableUpdater(this.table, updated);
    }

    incrCredit(by: RUpdates['credit']): TableUpdater {
      assert(by.gte(0), 'increase credit must be greater than 0');
      const credit = this.updates().credit.plus(by);
      const updated = { ...this.updates(), credit };
      return new TableUpdater(this.table, updated);
    }

    useCredit(by: RUpdates['credit']): TableUpdater {
      assert(by.gte(0), 'increase credit must be greater than 0');
      const credit = (this.updates().credit).minus(by);
      const updated = { ...this.updates(), credit };
      return new TableUpdater(this.table, updated);
    }

    raiseSkill(id: CharacterInterface.Schema['id'], index: CharacterInterface.SkillIndex): TableUpdater {
      assert(this.table.hasCharacter(id), `you dont have the character ${id}`);
      const updateCharacters: Record<string, CharacterInterface.Schema> = this.updates().characters ?? {};
      const savedCharacters: Record<string, CharacterInterface.Schema> = this.table.characters ?? {};
      const updatedCharacter = updateCharacters[id] ?? savedCharacters[id];
      assertNonNull(updatedCharacter, `you dont have the character ${id} ???`);
      const updatedCharacters: Record<string, CharacterInterface.Schema> = {
        ...updateCharacters,
        [updatedCharacter.id]: updatedCharacter,
      };
      const updated: Updates = { ...this.updates(), characters: updatedCharacters };
      return new TableUpdater(this.table, updated);
    }

  }

  function localUpdate(table: Table, updates: RUpdates): Table {
    const characters = {
      ...table.characters ?? {},
      ...updates.characters ?? {},
    };
    return new Table({
      characters,
      createdAt: Date.now(),
      credit: table.credit.plus(updates.credit),
      token: table.token.plus(updates.token),
      nonce: table.nonce + 1,
      id: table.id,
      updates,
    });
  }

  export class Table extends base {

    static initializeUpdate(u: Partial<RUpdates>): RUpdates {
      return u as RUpdates;
    }

    __memo__: {
      characterMap?: Map<CharacterInterface.Schema['id'], CharacterInterface.Schema>;
    } = {};

    static async get(key: KeySchema): Promise<Table> {
      const result = await super.get(key);
      if (!result) { throw new Error('not found'); }
      (result as any).__proto__ = Table.prototype;
      return result as Table;
    }

    private characterRecord(): Record<string, CharacterInterface.Schema> {
      return this.characters;
    }

    private characterMap(): Map<CharacterInterface.Schema['id'], CharacterInterface.Schema> {
      return Memoize(this, 'characterMap', () => {
        const map = new Map<CharacterInterface.Schema['id'], CharacterInterface.Schema>();
        for (const character of Object.values(this.characterRecord())) {
          map.set(character.id, character);
        }
        return map;
      });
    }

    hasCharacter(id: CharacterInterface.Schema['id']): boolean {
      return this.characterMap().has(id);
    }

    runUpdate(memo: string, callback: (updater: TableUpdater) => TableUpdater): Table {
      const updater = callback(new TableUpdater(this, { memo } as RUpdates));
      // tslint:disable-next-line:no-string-literal
      return localUpdate(this, updater['updates']());
    }

  }

  const _table = null as any as Table;

  function _typecheck(t: (typeof base)['prototype']): void {}
  _typecheck(_table);
}
