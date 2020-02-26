import Joi from '@hapi/joi';
import { RequiredOrOptionalCalled, CLE, SchemaInterface, EntriesDefined } from './base';
import { Joy } from '.';

export interface PlainBinarySchema extends Joi.BinarySchema, SchemaInterface, EntriesDefined<true> {
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  validate(b: boolean): Joy.ValidationResult<boolean>;
}

export function __(): PlainBinarySchema {
  return Joi.binary() as PlainBinarySchema;
}
