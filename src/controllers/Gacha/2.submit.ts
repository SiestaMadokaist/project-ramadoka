import { Joy } from '../../helper/joy';
import { PhantomNumber, PhantomString, PostEndpoint, ST } from '../../helper/phantom-types';
import { PostHandler } from '../../helper/server';
import { INSTANCE } from '../../initial/instances';
import { Hex, HexString, HT } from '../../modules/hashing';
import { Gachache } from './module/cache';
import { GachaLoader } from './module/loader';
import { GachaResult } from './store/base';
import { StoryGacha } from './store';
// import { JoiGeneric, joiGeneric, Joi } from '../../helper/utility';

/**
 * @description
 * 1st step of initializing gacha
 * give the user the hash of our seed.
 */
export namespace GachaSubmit {

  export interface Interface extends PostEndpoint {
    body: {
      mnemonics: PhantomString<ST.CLIENT_MNEMONICS>[];
      rollId: HexString<HT.ROLL_ID>;
    };
    path: 'gacha/submit';
    response: {
      result: GachaResult[];
    };
  }

  export const Schema = Joy.object<Interface['body']>().keys({
    mnemonics: Joy.array<PhantomString<ST.CLIENT_MNEMONICS>[]>().items(Joy.string().optional()).optional().default([]),
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
