import joi from '@hapi/joi';
import { ParamsMismatchSchema } from './errors';
import { Joy } from './joy';
import { NR } from './joy/base';

export async function parseBody<T>(thing: undefined | string | T, schema: Joy.SchemaOf<T>): Promise<NR<T>> {
  if (!thing) { throw new ParamsMismatchSchema('expected a string, got undefined instead'); }
  const parsed: T = (typeof thing === 'string') ? JSON.parse(thing) : thing;
  const validated = (schema as Joy.ObjectSchema<T>).validate(parsed);
  return validated.value;
}

interface A {
  hello: string;
  world: {
    foo: string;
    bar: number;
  };
}

// const a: A = {} as any;
// parseBody<A>(a, Joy.object<A>().keys({
//   hello: Joy.string().required(),
//   world: Joy.object<A['world']>().keys({
//     bar: Joy.number().optional().default,
//     foo: Joy.string().required(),
//   }).required(),
// }).required());
