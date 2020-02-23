import { __ as _object, SchemaOf as _SchemaOf, _ObjectSchema as _Object } from './object';
import { __ as _string, _StringSchema as _String } from './string';
import { __ as _number, _NumberSchema as _Number } from './number';
import { __ as _date, _DateSchema as _Date } from './date';
import { __ as _boolean, _BooleanSchema as _Boolean } from './boolean';
import { __ as _array, _ArraySchema as _Array } from './array';
import { __ as _enums, _EnumSchema as _Enum } from './enum';
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
  export interface NumberSchema extends Strict<_Number> {}
  export interface StringSchema extends Strict<_String> {}
  export interface ObjectSchema<X> extends Strict<_Object<X>> {}
  export interface DateSchema extends Strict<_Date> {}
  export interface BooleanSchema extends Strict<_Boolean> {}
  export interface ArraySchema<X> extends Strict<_Array<X>> {}
  export interface EnumSchema<X> extends Strict<_Enum<X>> {}
  // tslint:enable:no-empty-interface
}
