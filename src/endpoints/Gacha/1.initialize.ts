import { PostEndpoint, PhantomString, ST, PhantomNumber } from '../../helper/types';
import { PostHandler } from '../../helper/server';
import { Joy } from '../../helper/joy';
import sha256 from 'sha256';
import uuid from 'uuid';
import { Hexadecimal, HT, HexString } from '../../modules/hashing';
import { GachaFactory } from './module/generator';
// import { JoiGeneric, joiGeneric, Joi } from '../../helper/utility';

/**
 * @description
 * 1st step of initializing gacha
 * give the user the hash of our seed.
 */
export namespace GachaInitialize {

  export interface Interface extends PostEndpoint {
    path: 'gacha/initialize';
    body: {
      n: 1 | 10;
    };
    response: {
      hashedSeeds: Array<HexString<HT.SERVER_HASHED_SEED>>;
    };
  }

  export const Schema = Joy.object<Interface['body']>().keys({
    n: Joy.number().valid(1, 10).required(),
  }).required();

  export const Handler: PostHandler<Interface> = async (req) => {
    const gachas = await GachaFactory.generateNew(req.body.n);
    const hashedSeeds = gachas.map((g) => g.hashedSeed());
    return { hashedSeeds };
  };

}
