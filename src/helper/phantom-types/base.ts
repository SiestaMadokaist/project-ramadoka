export type PhantomBase<X, T, Name> = X & { '__@phantomId'?: T, '__@phantomType'?: Name };
export type RPhantomBase<X, T, Name> = X & { '__@phantomId': T, '__@phantomType': Name };
