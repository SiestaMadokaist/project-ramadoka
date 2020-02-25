import joi from '@hapi/joi';
import { ParamsMismatchSchema } from './errors';
import { Joy } from './joy';
import { NR } from './joy/base';

export namespace TIMESECOND {
  export enum ONE {
    SECOND = 1,
    MINUTE = 60,
    HOUR = 3600,
    DAY = 86400,
    WEEK = 604800,
  }
}

export async function parseBody<T>(thing: undefined | string | T, schema: Joy.SchemaOf<T>): Promise<NR<T>> {
  if (!thing) { throw new ParamsMismatchSchema('expected a string, got undefined instead'); }
  const parsed: T = (typeof thing === 'string') ? JSON.parse(thing) : thing;
  const validated = (schema as Joy.ObjectSchema<T>).validate(parsed);
  return validated.value;
}

export enum COMPARE {
  EQ = 0,
  GT = 1,
  LT = -1,
}

export function assertNonNull<T>(item: null | undefined | T, message: string): asserts item is NonNullable<T> {
  if (item === null) { throw new Error(message); }
  if (item === undefined) { throw new Error(message); }
}
