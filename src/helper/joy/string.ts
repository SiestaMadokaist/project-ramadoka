import Joi from '@hapi/joi';
import { RequiredOrOptionalCalled, CLE, SchemaInterface, EntriesDefined } from './base';
import { Joy } from '.';

export interface _StringSchema extends Joi.StringSchema, SchemaInterface, EntriesDefined<true> {
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  validate(s: string): Joy.ValidationResult<string>;
}

export function __(): _StringSchema {
  return Joi.string() as _StringSchema;
}
