import Joi from '@hapi/joi';
import { RequiredOrOptionalCalled, CLE, SchemaInterface, EntriesDefined } from './base';
import { SchemaOf } from './object';
import { Joy } from '.';

type ChildOf<X> = X extends Array<infer U> ? U : never;
export interface PlainArraySchema<X> extends Joi.ArraySchema, SchemaInterface {
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  items(schema: SchemaOf<X>): this & EntriesDefined<true>;
  validate(items: X[]): Joy.ValidationResult<X[]>;
}

export function __<X extends unknown[]>(): PlainArraySchema<ChildOf<X>> {
  return Joi.array() as PlainArraySchema<ChildOf<X>>;
}
