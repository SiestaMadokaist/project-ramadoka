import Joi from '@hapi/joi';
import { Joy } from '.';
import { CLE, EntriesDefined, RequiredOrOptionalCalled, SchemaInterface } from './base';

export interface PlainStringSchema extends Joi.StringSchema, SchemaInterface, EntriesDefined<true> {
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  validate(s: string): Joy.ValidationResult<string>;
}

export function __(): PlainStringSchema {
  return Joi.string() as PlainStringSchema;
}
