import { Joy } from '.';

enum STATE {
  STARTED = 'STARTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
}
interface IA {
  hello: string;
  world: number;
  ia: Omit<IA, 'ia'>;
  state: STATE;
}

const schema = Joy.object<IA>().keys({
  hello: Joy.string().required(),
  ia: Joy.object<IA['ia']>().keys({
    hello: Joy.string().required(),
    state: Joy.enums(STATE).optional(),
    world: Joy.number().required(),
  }).required(),
  state: Joy.enums(STATE).required(),
  world: Joy.number().required(),
}).required();

// const a: Joy.OptionalitySetNumberSchema = {} as any;
