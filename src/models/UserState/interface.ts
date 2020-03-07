import { PhantomNumber, NT } from '../../helper/phantom-types/number';
import { ID, Model, defineTable } from '../Base';
import type { CharacterInterface } from '../Characters/interface';
import { Joy } from '../../helper/joy';
import { TimestampValue } from '../../helper/phantom-types/bignumber';

export namespace UserStateInterface {

  // type Team = [Character['id'], Character['id'], Character['id']];

  export interface Schema extends Model<'user-state'> {
    nonce: PhantomNumber<'user-state-nonce'>;
    token: PhantomNumber<'token'>;
    credit: PhantomNumber<'credit'>;
    createdAt: PhantomNumber<NT.TIMESTAMP_MS>;
    characters: Record<CharacterInterface.Schema['id'], CharacterInterface.Schema>;
  }
}
