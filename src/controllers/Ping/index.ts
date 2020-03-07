import { Joy } from '../../helper/joy';
import { logger } from '../../helper/logger';
import { PostEndpoint } from '../../helper/phantom-types';
import { PostHandler } from '../../helper/server';
// import { JoiGeneric, joiGeneric, Joi } from '../../helper/utility';

namespace Ping {

  export interface Interface extends PostEndpoint {
    body: {
      ping: 'pong';
      pong?: 'ping';
    };
    path: 'ping';
    response: {
      pong: 'ping';
    };
  }

  export const Schema = Joy.object<Interface['body']>().keys({
    ping: Joy.string().required(),
    pong: Joy.string().required(),
  }).required();

  export const Handler: PostHandler<Interface> = async (req) => {
    return { pong: 'ping' };
  };

}
export default Ping;
