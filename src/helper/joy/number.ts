import Joi from '@hapi/joi';
import { Joy } from '.';
import { CLE, EntriesDefined, RequiredOrOptionalCalled, SchemaInterface } from './base';

export interface PlainNumberSchema extends Joi.NumberSchema, SchemaInterface, EntriesDefined<true> {
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  validate(n: number): Joy.ValidationResult<number>;
}

export function __(): PlainNumberSchema {
  return Joi.number() as PlainNumberSchema;
}
