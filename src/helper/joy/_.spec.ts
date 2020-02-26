/**
 * we dont really need unit test here tbh.
 * it is all in typecheck.
 */
import { Joy } from '.';
import { logger } from '../logger';

enum STATE {
  STARTED = 'STARTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
}

interface MyInterface {
  arr_str: string[];
  obj_arr: Array<{
    x: {
      y: {
        z: number;
      };
    };
  }>;
  obj: {
    obj: {
      obj: {
        obj: string;
      };
    };
  };
}

const mySchema: Joy.SchemaOf<MyInterface> = Joy.object<MyInterface>().keys({
  arr_str: Joy.array<MyInterface['arr_str']>().items(Joy.string().required()).required(),
  obj: Joy.object<MyInterface['obj']>().keys({
    obj: Joy.object<MyInterface['obj']['obj']>().keys({
      obj: Joy.object<MyInterface['obj']['obj']['obj']>().keys({
        obj: Joy.string().required(),
      }).required(),
    }).required(),
  }).required(),
  obj_arr: Joy.array<MyInterface['obj_arr']>().items(Joy.object<MyInterface['obj_arr'][0]>().required().keys({
    x: Joy.object<MyInterface['obj_arr'][0]['x']>().required().keys({
      y: Joy.object<MyInterface['obj_arr'][0]['x']['y']>().required().keys({
        z: Joy.number().required(),
      }),
    }),
  })).required(),
}).required();

describe('Joy', () => {
  it('validate the schema', () => {
    const myObject: MyInterface = {
      arr_str: ['words'],
      obj: {
        obj: {
          obj: {
            obj: 'yes',
          },
        },
      },
      obj_arr: [{
        x: {
          y: {
            z: 3,
          },
        },
      }],
    };
    const result = mySchema.validate(myObject);
    expect(result.value).toEqual(myObject);
  });
});
