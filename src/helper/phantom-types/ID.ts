import { Model as SequelizeModel } from 'sequelize';
import { PhantomBase } from './base';
type TM = (typeof SequelizeModel);
export type ID<M extends SequelizeModel> = PhantomBase<number, M, 'ID'>;

export interface ModelConstructor<PropsType, InstanceType> extends TM {
  new (props: PropsType): InstanceType & SequelizeModel;
}

export abstract class BaseModel<B extends SequelizeModel> extends SequelizeModel {
  id(): ID<B> {
    return 0 as ID<B>;
  }
}
