import { PostEndpoint, PhantomString, ST, PhantomNumber } from '../../helper/types';
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
      cacheKey: HexString<HT.CACHE_KEY>;
      mnemonics: Array<PhantomString<ST.CLIENT_MNEMONICS>>;
    };
    response: {
      result: GachaResult[];
    };
  }

  export const Schema = Joy.object<Interface['body']>().keys({
    cacheKey: Joy.string().required(),
    mnemonics: Joy.array<Array<PhantomString<ST.CLIENT_MNEMONICS>>>().items(Joy.string().optional()).optional().default([]),
  }).required();

  export const Handler: PostHandler<Interface> = async (req) => {
    const cache = new Gachache(await INSTANCE.redisProxy());
    const loader = new GachaLoader({
      cache,
      cacheKey: req.body.cacheKey,
      mnemonics: req.body.mnemonics,
      store: StoryGacha,
    });
    return { result: await loader.getResult() };
  };

}
