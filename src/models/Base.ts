import type { RPhantomBase } from '../helper/phantom-types/base';
import { env } from '../helper/env';
import { Joy } from '../helper/joy';
import { Schema as Dynamoose, SchemaOptions } from 'dynamoose';

export type ID<M> = RPhantomBase<string, M, 'ID'>;
export interface Model<X> {
  '__@type'?: X;
  id: ID<X>;
}

type Keys<Schema extends Model<unknown>> = (keyof (Omit<Required<Schema>, '__@type'>));
type Type<V> = V extends number ? 'number' :
V extends string ? 'string' :
V extends boolean ?  'nativeBoolean':
V extends Date ? 'date' :
V extends Buffer ? 'buffer' :
V extends unknown[] ? 'list' :
V extends object ? 'map' :
never;

type MapOf<Schema, K extends (keyof Schema)> = Type<Schema[K]> extends 'map' ? {
  [K2 in (keyof Required<Schema[K]>)]: Type<Required<Schema[K]>[K2]>;
} : never;
export type SchemaAttribute<Schema extends Model<unknown>> = {
  [K in Keys<Schema>]: {
    type: Type<Schema[K]>;
    map?: MapOf<Schema, K>;
    hashKey?: boolean;
    rangeKey?: boolean;
    required?: boolean;
    default?: Schema[K] | (() => Schema[K] | Promise<Schema[K]>);
    enum?: unknown;
    validate?: (value: Schema[K], model: Schema) => boolean | Promise<boolean>;
  }
};

export class DBSchema<X extends Model<unknown>> extends Dynamoose {
  constructor(schema: SchemaAttribute<X>, options?: SchemaOptions) {
    super(schema as any, options);
  }
}
