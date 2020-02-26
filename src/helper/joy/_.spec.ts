/**
 * we dont really need unit test here tbh.
 * it is all in typecheck.
 */
import { Joy } from '.';

enum STATE {
  STARTED = 'STARTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
}

interface IA {
  arr_str: string[];
  obj_arr: Array<{
    obj: {
      obj: {};
    };
  }>;
  obj: {
    obj: {
      obj: {};
    };
  };
}

const schema: Joy.SchemaOf<IA> = Joy.object<IA>().keys({
  arr_str: Joy.array<IA['arr_str']>().items(Joy.string().required()).required(),
  obj: Joy.object<IA['obj']>().keys({
    obj: Joy.object<IA['obj']['obj']>().keys({
      obj: Joy.object<IA['obj']['obj']['obj']>().keys({}).required(),
    }).required(),
  }).required(),
  obj_arr: Joy.array<IA['obj_arr']>().items(Joy.object<IA['obj_arr'][0]>().keys({
    obj: Joy.object<IA['obj_arr'][0]>().keys({
      obj: Joy.object<IA['obj_arr'][0]['obj']>().keys({
        obj: Joy.object<IA['obj_arr'][0]['obj']['obj']>().keys({}).required(),
      }).required(),
    }).required(),
  }).required()).required(),
}).required();
