import Joi from '@hapi/joi';
import { Joy } from './';
import { CLE, EntriesDefined, NR, RequiredOrOptionalCalled, SchemaInterface } from './base';

export type SchemaOf<X> = X extends Buffer ? Joy.BinarySchema :
X extends string ? Joy.StringSchema :
X extends number ? Joy.NumberSchema :
X extends boolean ? Joy.BooleanSchema :
X extends Date ? Joy.DateSchema :
X extends (infer U)[] ? Joy.ArraySchema<U> :
X extends object ? Joy.ObjectSchema<X> :
never;

export interface PlainObjectSchema<X> extends Joi.ObjectSchema, SchemaInterface {
  keys(schema: { [K in keyof X]: SchemaOf<X[K]>}): this & EntriesDefined<true>;
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  validate(n: X): Joy.ValidationResult<X>;
}

export function __<X>(strict: boolean = false): PlainObjectSchema<X> {
  if (strict) { return Joi.object() as PlainObjectSchema<X>; }
  return Joi.object().unknown() as PlainObjectSchema<X>;
}
