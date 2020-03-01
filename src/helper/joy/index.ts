import Joi from '@hapi/joi';
import { PlainArraySchema, __ as _array  } from './array';
import { CLE, NR, StrictCompulsorySchema, StrictDefinitionSchema } from './base';
import { PlainBooleanSchema, __ as _boolean  } from './boolean';
import { PlainBinarySchema, __ as _binary } from './buffer';
import { PlainDateSchema, __ as _date  } from './date';
import { PlainEnumSchema, __ as _enums  } from './enum';
import { PlainNumberSchema, __ as _number  } from './number';
import { PlainObjectSchema, SchemaOf as _SchemaOf, __ as _object } from './object';
import { PlainStringSchema, __ as _string } from './string';

export namespace Joy {
  export const string = _string;
  export const number = _number;
  export const date = _date;
  export const boolean = _boolean;
  export const object = _object;
  export const array = _array;
  export const enums = _enums;
  export const binary = _binary;
  export type SchemaOf<X> = _SchemaOf<X>;
  export interface ValidationResult<X> extends Joi.ValidationResult {
    value: NR<X>;
  }
  // tslint:disable:no-empty-interface
  type Strict<X extends Joi.AnySchema> = StrictDefinitionSchema<StrictCompulsorySchema<X, CLE.R | CLE.O>, true>;
  export interface NumberSchema extends Strict<PlainNumberSchema> {}
  export interface StringSchema extends Strict<PlainStringSchema> {}
  export interface ObjectSchema<X> extends Strict<PlainObjectSchema<X>> {}
  export interface DateSchema extends Strict<PlainDateSchema> {}
  export interface BooleanSchema extends Strict<PlainBooleanSchema> {}
  export interface ArraySchema<X> extends Strict<PlainArraySchema<X>> {}
  export interface EnumSchema<X> extends Strict<PlainEnumSchema<X>> {}
  export interface BinarySchema extends Strict<PlainBinarySchema> {}
  // tslint:enable:no-empty-interface
}
