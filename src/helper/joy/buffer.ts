import Joi from '@hapi/joi';
import { Joy } from '.';
import { CLE, EntriesDefined, RequiredOrOptionalCalled, SchemaInterface } from './base';

export interface PlainBinarySchema extends Joi.BinarySchema, SchemaInterface, EntriesDefined<true> {
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  validate(b: boolean): Joy.ValidationResult<boolean>;
}

export function __(): PlainBinarySchema {
  return Joi.binary() as PlainBinarySchema;
}
