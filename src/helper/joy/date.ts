import Joi from '@hapi/joi';
import { RequiredOrOptionalCalled, CLE, SchemaInterface, EntriesDefined } from './base';
import { Joy } from '.';

export interface PlainDateSchema extends Joi.DateSchema, SchemaInterface, EntriesDefined<true> {
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  validate(date: Date): Joy.ValidationResult<Date>;
}

export function __(): PlainDateSchema {
  return Joi.date() as PlainDateSchema;
}
