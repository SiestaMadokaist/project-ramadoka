import { PostEndpoint, PhantomString, ST, PhantomNumber } from '../../helper/phantom-types';
import { PostHandler } from '../../helper/server';
import { Joy } from '../../helper/joy';
import { HT, HexString, Hex } from '../../modules/hashing';
import { GachaLoader } from './module/loader';
import { StoryGacha } from './store';
import { GachaResult } from './module/store';
import { Gachache } from './module/cache';
import { INSTANCE } from '../../initial/instances';
// import { JoiGeneric, joiGeneric, Joi } from '../../helper/utility';

/**
 * @description
 * 1st step of initializing gacha
 * give the user the hash of our seed.
 */
export namespace GachaSubmit {

  export interface Interface extends PostEndpoint {
    path: 'gacha/submit';
    body: {
      rollId: HexString<HT.ROLL_ID>;
      mnemonics: Array<PhantomString<ST.CLIENT_MNEMONICS>>;
    };
    response: {
      result: GachaResult[];
    };
  }

  export const Schema = Joy.object<Interface['body']>().keys({
    mnemonics: Joy.array<Array<PhantomString<ST.CLIENT_MNEMONICS>>>().items(Joy.string().optional()).optional().default([]),
    rollId: Joy.string().required(),
  }).required();

  export const Handler: PostHandler<Interface> = async (req) => {
    const cache = new Gachache(await INSTANCE.redisProxy());
    const loader = new GachaLoader({
      cache,
      mnemonics: req.body.mnemonics,
      rollId: req.body.rollId,
      store: StoryGacha,
    });
    return { result: await loader.getResult() };
  };

}
