import Joi from '@hapi/joi';
import { RequiredOrOptionalCalled, CLE, SchemaInterface, EntriesDefined } from './base';
import { Joy } from '.';

export interface _NumberSchema extends Joi.NumberSchema, SchemaInterface, EntriesDefined<true> {
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  validate(n: number): Joy.ValidationResult<number>;
}

export function __(): _NumberSchema {
  return Joi.number() as _NumberSchema;
}
