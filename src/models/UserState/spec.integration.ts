import aws from 'aws-sdk';
import { env } from '../../helper/env';
import { UserState } from '.';
import { UserStateInterface } from './interface';
import { sleep } from '@cryptoket/ts-promise-helper';

async function main(): Promise<void> {
  await sleep(5000);
  const userState = await UserState.Table.get({
    id: 'test' as any,
    nonce: 0,
  });
}

if (process.argv[1] === __filename) {
  main();
}
