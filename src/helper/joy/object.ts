import Joi from '@hapi/joi';
import { Joy } from './';
import { RequiredOrOptionalCalled, CLE, SchemaInterface, EntriesDefined, NR, StrictDefinitionSchema, StrictCompulsorySchema } from './base';

export type SchemaOf<X> = X extends Record<string, string> ? Joy.EnumSchema<X> :
X extends string ? Joy.StringSchema:
X extends number ? Joy.NumberSchema :
X extends boolean ? Joy.BooleanSchema :
X extends Date ? Joy.DateSchema :
X extends Array<infer U> ? Joy.ArraySchema<U> :
X extends object ? Joy.ObjectSchema<X> :
never;

export interface _ObjectSchema<X> extends Joi.ObjectSchema, SchemaInterface {
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  keys(schema: Required<{ [K in keyof NR<X>]: SchemaOf<NR<X>[K]> }>): this & EntriesDefined<true>;
  validate(n: X): Joy.ValidationResult<X>;
}

export function __<X>(strict: boolean = false): _ObjectSchema<X> {
  if (strict) { return Joi.object() as _ObjectSchema<X>; }
  return Joi.object().unknown() as _ObjectSchema<X>;
}
