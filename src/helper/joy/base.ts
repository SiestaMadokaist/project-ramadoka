import Joi from '@hapi/joi';
// export type CLE = 'unknown' | 'optional' | 'required';
export enum CLE {
  /** @description unknown */
  U = 'U',
  /** @description optional */
  O = 'O',
  /** @description required */
  R = 'R',
}

export interface EntriesDefined<X extends boolean> {
  'please add .keys() / .items()': X;
}

export interface RequiredOrOptionalCalled<X extends CLE> {
  'please add .required() or .optional()': X;
}
export type StrictDefinitionSchema<X extends Joi.AnySchema, B extends boolean = false> = X & EntriesDefined<B>;
export type StrictCompulsorySchema<X extends Joi.AnySchema, CL extends CLE = CLE.U> = Omit<X, 'please add .required() or .optional()'> & RequiredOrOptionalCalled<CL>;
export type InitialSchema<X extends Joi.AnySchema> = StrictDefinitionSchema<StrictCompulsorySchema<X>>;
export interface SchemaInterface extends Joi.AnySchema {
  required(): this & RequiredOrOptionalCalled<CLE.R>;
  optional(): this & RequiredOrOptionalCalled<CLE.O>;
}

export type NR<X> = X extends number ? number :
X extends string ? string :
X extends boolean ? boolean :
X extends Array<(infer U)> ? U[] :
X extends Buffer ? Buffer :
X extends Date ? Date :
X extends Set<(infer S)> ? Set<S> :
X extends Record<string, unknown> ? Required<{
  [K in keyof X]: X[K];
}> : never;
