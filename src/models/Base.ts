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

// const doc = new Schema()
// export type NonVoid<T> = T extends void ? never : T extends null ? never : T;
// export type StringOnlyOperation<T> = T extends string ? string : never;
// export interface WhereQuery<Schema, Index extends string, K extends (keyof Schema)> extends SafeQuery {
//   beginsWith(value: StringOnlyOperation<Schema[K]>): IQuery<Schema, Index>;
//   between(low: NonVoid<Schema[K]>, high: NonVoid<Schema[K]>): IQuery<Schema, Index>;
//   eq(value: NonVoid<Schema[K]>): IQuery<Schema, Index>;
//   equals(value: NonVoid<Schema[K]>): IQuery<Schema, Index>;
//   gt(Value: NonVoid<Schema[K]>): IQuery<Schema, Index>;
//   gte(value: NonVoid<Schema[K]>): IQuery<Schema, Index>;
//   lt(value: NonVoid<Schema[K]>): IQuery<Schema, Index>;
//   lte(value: NonVoid<Schema[K]>): IQuery<Schema, Index>;
// }

// export interface FilterQuery<Schema, Index extends string, K extends (keyof Schema)> extends WhereQuery<Schema, Index, K> {
//   contains(value: StringOnlyOperation<Schema[K]>): IQuery<Schema, Index>;
//   exists(): IQuery<Schema, Index>;
//   in(values: Schema[K][]): IQuery<Schema, Index>;
//   ne(value: NonVoid<Schema[K]>): IQuery<Schema, Index>;
//   notContains(value: StringOnlyOperation<Schema[K]>): IQuery<Schema, Index>;
//   null(): IQuery<Schema, Index>;
// }

// interface SafeQuery extends Query {
//   addFilterCondition(): never;
//   addKeyCondition(): never;
//   ascending(): never;
//   attributes(): never;
//   consistentRead(): never;
//   contains(...args: any[]): any;
//   descending(): never;
//   expressionAttributeNames(): never;
//   expressionAttributeValues(): never;
//   filterExpression(): never;
//   limit(): never;
//   loadAll(): never;
//   notContains(...args: any[]): any;
//   projectionExpression(): never;
//   returnConsumedCapacity(): never;
//   select(): never;
//   startKey(): never;
//   usingIndex(): never;
//   where(): never;
// }

// export interface IQuery<Schema, Index extends string> extends Query {
//   addFilterCondition(condition: {
//       attributeNames: any;
//       attributeValues: any;
//   }): IQuery<Schema, Index>;
//   addKeyCondition(condition: {
//       attributeNames: any;
//       attributeValues: any;
//   }): IQuery<Schema, Index>;
//   ascending(): IQuery<Schema, Index>;
//   attributes(attrs: (string & keyof Schema)[]): IQuery<Schema, Index>;
//   consistentRead(read: boolean): IQuery<Schema, Index>;
//   contains(name: string): IQuery<Schema, Index>;
//   descending(): IQuery<Schema, Index>;
//   expressionAttributeNames(data: any): IQuery<Schema, Index>;
//   expressionAttributeValues(data: any): IQuery<Schema, Index>;
//   filter<K extends (string & keyof Schema)>(keyName: K): FilterQuery<Schema, Index, K>;
//   filterExpression(expression: any): IQuery<Schema, Index>;
//   limit(num: number): IQuery<Schema, Index>;
//   loadAll(): IQuery<Schema, Index>;
//   notContains(name: string): IQuery<Schema, Index>;
//   projectionExpression(data: any): IQuery<Schema, Index>;
//   returnConsumedCapacity(value?: string): IQuery<Schema, Index>;
//   select(value: string): IQuery<Schema, Index>;
//   startKey(hashKey: string, rangeKey: string): IQuery<Schema, Index>;
//   usingIndex(index: Index): IQuery<Schema, Index>;
//   where<K extends string  & (keyof Schema)>(key: K): WhereQuery<Schema, Index, K>;
// }

// export type DDBModel = typeof dynamodb.Model;
// export interface IParentConstructor<Schema, Index extends string> extends DDBModel {
//   prototype: dynamodb.Model & {
//     attrs: Schema;
//   };
//   // run<T extends IParentConstructor<Schema, Index>>(cb: (c: (new (...args: any[]) => DDBModel)) => IQuery<Schema, Index>): Promise<T[]>;
//   query(hashKey: string | number | boolean): IQuery<Schema, Index>;
//   update(item: Partial<Schema>, options: dynamodb.Model.OperationOptions, callback: (err: null | Error, data: { attrs: Schema }) => void): void;
//   update(item: Partial<Schema>, callback: (err: null | Error, data: { attrs: Schema }) => void): void;
//   update(item: Partial<Schema>, options?: dynamodb.Model.OperationOptions): Promise<{ attrs: Schema }>;

// }


// export interface ITableConfig<Schema extends Model<unknown>> {
//   hashKey: string & (keyof Schema);
//   indexes: {
//     hashKey: string & (keyof Schema);
//     name: string;
//     rangeKey?: string & (keyof Schema);
//     type: 'global' | 'local';
//   }[];
//   rangeKey?: string & (keyof Schema);
//   schema: {
//     [k in Keys<Schema>]: Joy.SchemaOf<Schema[k]>;
//   };
// }



// export function defineTable<Schema extends Model<unknown>, Index extends string>(name: string, config: ITableConfig<Schema>): IParentConstructor<Schema, Index> {
//   const environment = env.NODE_ENV;
//   const schema: Joy.ObjectSchema<Schema> = Joy.object().keys(config.schema).required();
//   const tableName = `production-${name}`;
//   // const tableName = `${environment}-${name}`;
//   class Parent extends dynamodb.define(tableName, config as unknown as dynamodb.DefineConfig) {

//     protected attrs!: Schema;
//     constructor(props: Schema) {
//       super(props);
//     }


//     normalized(): Schema {
//       const result = schema.validate(this.attrs);
//       return result.value as Schema;
//     }

//   }
//   return Parent as unknown as IParentConstructor<Schema, Index>;

// }
