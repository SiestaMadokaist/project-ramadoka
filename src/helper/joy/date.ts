import Joi from '@hapi/joi';
import { Joy } from '.';
import { CLE, EntriesDefined, RequiredOrOptionalCalled, SchemaInterface } from './base';

export interface PlainDateSchema extends Joi.DateSchema, SchemaInterface, EntriesDefined<true> {
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  validate(date: Date): Joy.ValidationResult<Date>;
}

export function __(): PlainDateSchema {
  return Joi.date() as PlainDateSchema;
}
