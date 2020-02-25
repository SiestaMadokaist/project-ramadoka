import Joi from '@hapi/joi';
import { RequiredOrOptionalCalled, CLE, SchemaInterface, EntriesDefined } from './base';
import { Joy } from '.';

export interface PlainBooleanSchema extends Joi.BooleanSchema, SchemaInterface, EntriesDefined<true> {
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  validate(b: boolean): Joy.ValidationResult<boolean>;
}

export function __(): PlainBooleanSchema {
  return Joi.boolean() as PlainBooleanSchema;
}
