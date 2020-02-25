import { __ as _object, SchemaOf as _SchemaOf, PlainObjectSchema } from './object';
import { __ as _string, PlainStringSchema } from './string';
import { __ as _number, PlainNumberSchema  } from './number';
import { __ as _date, PlainDateSchema  } from './date';
import { __ as _boolean, PlainBooleanSchema  } from './boolean';
import { __ as _array, PlainArraySchema  } from './array';
import { __ as _enums, PlainEnumSchema  } from './enum';
import { StrictDefinitionSchema, StrictCompulsorySchema, CLE, NR } from './base';
import Joi = require('@hapi/joi');

export namespace Joy {
  export const string = _string;
  export const number = _number;
  export const date = _date;
  export const boolean = _boolean;
  export const object = _object;
  export const array = _array;
  export const enums = _enums;
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
  // tslint:enable:no-empty-interface
}
