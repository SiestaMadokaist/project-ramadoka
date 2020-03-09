import aws from 'aws-sdk';
import { UserState } from '.';
import { sleep } from '@cryptoket/ts-promise-helper';
import $debug from 'debug';
import { UserStateInterface } from './interface';
import BigNumber from 'bignumber.js';
const debug = $debug('userstate:spec:integration');

describe('UserState', () => {
  const userState = new UserState.Table({
    characters: [],
    createdAt: Date.now(),
    credit: new BigNumber(0),
    token: new BigNumber(0),
    id: 'test' as UserStateInterface.Schema['id'],
    nonce: 0,
    updates: { memo: 'initialization' },
  });
  it('update token correctly', async () => {
    const updated = userState.runUpdate('buy token #123', (updater) => {
      return updater
        .incrToken(new BigNumber(3))
        .useToken(new BigNumber(2));
    });
    expect(updated.token).toEqual(new BigNumber(1));
  });
});
// async function main(): Promise<void> {
//   await sleep(5000);
//   const userState = new UserState.Table({
//     characters: [],
//     id: 'test' as UserStateInterface.Schema['id'],
//     token: new BigNumber(0),
//     createdAt: 0,
//     credit: new BigNumber(0),
//     nonce: 0,
//     updates: UserState.Table.initializeUpdate({}),
//   });
//   const updatedState = userState.runUpdate('testupdate', (updater) => {
//     return updater.incrCredit(new BigNumber(5))
//       .incrCredit(new BigNumber(5))
//       .incrToken(new BigNumber(5))
//       .useToken(new BigNumber(3));
//   });
//   debug(updatedState.originalItem());
// }
