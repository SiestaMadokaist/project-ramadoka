import sha256 from 'sha256';
import uuid from 'uuid';
import { Joy } from '../../helper/joy';
import { PhantomNumber, PhantomString, PostEndpoint, ST } from '../../helper/phantom-types';
import { PostHandler } from '../../helper/server';
import { INSTANCE } from '../../initial/instances';
import { Hex, Hexadecimal, HexString, HT } from '../../modules/hashing';
import { Gachache } from './module/cache';
import { GachaInit } from './module/generator';
/**
 * @description
 * 1st step of initializing gacha
 * give the user the hash of our seed.
 */
export namespace GachaInitialize {

  export interface Interface extends PostEndpoint {
    body: {
      n: 1 | 10;
    };
    path: 'gacha/initialize';
    response: {
      hashedSeeds: HexString<HT.SERVER_HASHED_SEED>[];
    };
  }

  export const Schema = Joy.object<Interface['body']>().keys({
    n: Joy.number().valid(1, 10).required(),
  }).required();

  export const Handler: PostHandler<Interface> = async (req) => {
    const cache = new Gachache(await INSTANCE.redisProxy());
    const rollId = Hex.uid<HT.ROLL_ID>();
    const gachas = await GachaInit.generateNew(cache, rollId, req.body.n);
    const hashedSeeds = gachas.map((g) => g.hashedSeed());
    return { hashedSeeds };
  };

}
