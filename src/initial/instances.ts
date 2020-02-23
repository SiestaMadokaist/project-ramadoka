import * as RP from '@cryptoket/redis-proxy';
import { Memoize } from '@cryptoket/ts-memoize';
class Instance {
  __memo__: {
    redisProxy?: Promise<RP.Base>;
  } = {};

  redisProxy(): Promise<RP.Base> {
    return Memoize(this, 'redisProxy', async () => {
      return new RP.PassThrough({ db: 3, url: 'redis://localhost:6379' });
    });
  }
}

export const INSTANCE = new Instance();
