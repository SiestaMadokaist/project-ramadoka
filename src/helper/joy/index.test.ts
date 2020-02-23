import { Joy } from '.';

enum STATE {
  STARTED = 'STARTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
}
interface IA {
  hello: string[];
}

const schema = Joy.object<IA>().keys({
  hello: Joy.array<string>().items(Joy.string().required()).required(),
}).required();

// const a: Joy.OptionalitySetNumberSchema = {} as any;
