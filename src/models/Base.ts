import type { RPhantomBase } from '../helper/phantom-types/base';
import { env } from '../helper/env';
import { Joy } from '../helper/joy';
import { Schema as Dynamoose, SchemaOptions, ModelConstructor, ModelSchema } from 'dynamoose';
import dynamoose from 'dynamoose';
import BigNumber from 'bignumber.js';
dynamoose.setDefaults({
  prefix: `${env.NODE_ENV}-`,
  suffix: 's',
  create: false,
  waitForActive: false,
});

export type ID<M> = RPhantomBase<string, M, 'ID'>;
export interface Model<X> {
  '__@type'?: X;
  id: ID<X>;
}

type Keys<Schema> = (keyof (Omit<Required<Schema>, '__@type'>));
type Type<V> = V extends number ? 'number' :
V extends BigNumber ? 'number' :
V extends string ? 'string' :
V extends boolean ?  'nativeBoolean':
V extends Date ? 'date' :
V extends Buffer ? 'buffer' :
V extends unknown[] ? 'list' :
V extends object ? 'map' :
never;

type MapOf<Schema, K extends (keyof Schema)> = Type<Schema[K]> extends 'map' ? {
  [K2 in keyof Required<Schema>[K]]: SchemaKeyAttribute<Schema[K], K2>;
} : never;

export type SchemaKeyAttribute<Schema, K extends (keyof Schema)> = {
  type: Type<Schema[K]>;
  get?: (value: Schema[K]) => Schema[K];
  set?: (value: Schema[K]) => unknown;
  map?: MapOf<Schema, K>;
  hashKey?: boolean;
  rangeKey?: boolean;
  required?: boolean;
  default?: Schema[K] | (() => Schema[K] | Promise<Schema[K]>);
  enum?: unknown;
  validate?: (value: Schema[K], model: Schema) => boolean | Promise<boolean>;
};

export type SchemaAttribute<Schema> = {
  [K in Keys<Schema>]: SchemaKeyAttribute<Schema, K>;
};

export class DBSchema<X extends Model<unknown>> extends Dynamoose {
  constructor(schema: SchemaAttribute<X>, options?: SchemaOptions) {
    super(schema as any, options);
  }
}

export namespace BaseModel {
  export interface BaseTable<Schema, KeySchema> extends ModelConstructor<Schema, KeySchema> {}

  export function defineTable<Schema, KeySchema extends Partial<Schema>>(name: string, schema: Dynamoose): BaseTable<Schema, KeySchema> {
    return dynamoose.model(name, schema);
  }
}
