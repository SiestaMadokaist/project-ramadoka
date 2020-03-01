import Joi from '@hapi/joi';
import { Joy } from '.';
import { CLE, EntriesDefined, RequiredOrOptionalCalled, SchemaInterface } from './base';

export interface PlainBooleanSchema extends Joi.BooleanSchema, SchemaInterface, EntriesDefined<true> {
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  validate(b: boolean): Joy.ValidationResult<boolean>;
}

export function __(): PlainBooleanSchema {
  return Joi.boolean() as PlainBooleanSchema;
}
