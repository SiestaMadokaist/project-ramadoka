import Joi from '@hapi/joi';
import { Joy } from '.';
import { CLE, EntriesDefined, RequiredOrOptionalCalled, SchemaInterface } from './base';
import { SchemaOf } from './object';

type ChildOf<X> = X extends (infer U)[] ? U : never;
export interface PlainArraySchema<X> extends Joi.ArraySchema, SchemaInterface {
  items(schema: SchemaOf<X>): this & EntriesDefined<true>;
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  validate(items: X[]): Joy.ValidationResult<X[]>;
}

export function __<X extends unknown[]>(): PlainArraySchema<ChildOf<X>> {
  return Joi.array() as PlainArraySchema<ChildOf<X>>;
}
