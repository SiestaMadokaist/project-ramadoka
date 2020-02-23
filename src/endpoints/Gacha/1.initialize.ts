import { PostEndpoint, PhantomString, ST, PhantomNumber } from '../../helper/types';
import { PostHandler } from '../../helper/server';
import { logger } from '../../helper/logger';
import { Joy } from '../../helper/joy';
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
      hashes: Array<PhantomString<ST.SERVER_SEED_HASH>>;
    };
  }

  export const Schema = Joy.object<Interface['body']>().keys({
    n: Joy.number().valid(1, 10).required(),
  });

  export const Handler: PostHandler<Interface> = async (req) => {
    return { hashes: [] };
  };

}
