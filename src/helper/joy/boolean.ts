import Joi from '@hapi/joi';
import { RequiredOrOptionalCalled, CLE, SchemaInterface, EntriesDefined } from './base';
import { Joy } from '.';

export interface _BooleanSchema extends Joi.BooleanSchema, SchemaInterface, EntriesDefined<true> {
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  validate(b: boolean): Joy.ValidationResult<boolean>;
}

export function __(): _BooleanSchema {
  return Joi.boolean() as _BooleanSchema;
}
