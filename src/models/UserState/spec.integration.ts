import { UserState } from '.';
import { logger } from '../../helper/logger';
import { Schema } from 'dynamoose';
import { UserStateInterface } from './interface';

async function main(): Promise<void> {
  const userState = await UserState.Table.get({
    id: 'test' as UserStateInterface.Schema['id'],
    nonce: 0,
  });
  logger.d({ userState });
}

if (process.argv[1] === __filename) {
  main();
}
