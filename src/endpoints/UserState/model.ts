import { PhantomNumber, NT } from '../../helper/phantom-types';
import { ID, ModelConstructor, BaseModel } from '../../helper/phantom-types/ID';
import { Sequelize, DataType, Model } from 'sequelize/types';
import { PhantomBase } from '../../helper/phantom-types/base';

/**
 * @description
 * if the user state.weapons at index of weapon index is set to true
 * that means this user has that weapon
 * otherwise he doesnt.
 * although, doubling the size and increase the possibility to have 4 state is also considerable.
 * e.g: 0/1/2/3, level 3 = max.
 */
export enum OWN_FLAGS {
  WEAPONS = 'WEAPONS',
  CHARACTERS = 'CHARACTERS',
}
export type PhantomBinary<T extends OWN_FLAGS> = PhantomBase<Buffer, T, 'PhantomBinary'>;

interface IUserState {
  id: ID<UserState>;
  userId: ID<User>;
  nonce: number;
  characters: PhantomBinary<OWN_FLAGS.CHARACTERS>;
  weapons: PhantomBinary<OWN_FLAGS.WEAPONS>;
}

declare class User extends BaseModel<User> {
}

declare class UserState extends BaseModel<UserState> {
}
