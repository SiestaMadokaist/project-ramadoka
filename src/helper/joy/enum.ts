import Joi from '@hapi/joi';
import { Joy } from '.';
import { CLE, EntriesDefined, RequiredOrOptionalCalled, SchemaInterface } from './base';

export interface PlainEnumSchema<X> extends Joi.StringSchema, SchemaInterface, EntriesDefined<true> {
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  validate(item: string): Joy.ValidationResult<string>;
}

export function __<T extends Record<string, string>>(items: T): PlainEnumSchema<T>  {
  return Joi.string().valid(...Object.values(items)) as PlainEnumSchema<T>;
}
