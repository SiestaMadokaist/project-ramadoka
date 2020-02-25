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

export interface PlainObjectSchema<X> extends Joi.ObjectSchema, SchemaInterface {
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  keys(schema: Required<{ [K in keyof NR<X>]: SchemaOf<NR<X>[K]> }>): this & EntriesDefined<true>;
  validate(n: X): Joy.ValidationResult<X>;
}

export function __<X>(strict: boolean = false): PlainObjectSchema<X> {
  if (strict) { return Joi.object() as PlainObjectSchema<X>; }
  return Joi.object().unknown() as PlainObjectSchema<X>;
}
