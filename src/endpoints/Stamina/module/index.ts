import { PhantomNumber, NT, PhantomBigNumber } from '../../../helper/phantom-types';
import BigNumber from 'bignumber.js';
import { TimestampDiff, TimestampValue, bnFrom } from '../../../helper/phantom-types/bignumber';
import { NumberLike } from '../../../helper/phantom-types/number';
import { ValidationException } from '../../../helper/errors';

interface StaminaValue extends PhantomBigNumber<NT.STAMINA> {
  minus(value: StaminaValue): StaminaValue;
  plus(value: StaminaValue): StaminaValue;
  dividedBy(value: TimestampDiff): StaminaPerMS;
  dividedBy(value: StaminaPerMS): TimestampDiff;
  dividedToIntegerBy(value: TimestampDiff): StaminaPerMS;
  dividedToIntegerBy(value: StaminaPerMS): TimestampDiff;
}

interface StaminaPerMS extends PhantomBigNumber<NT.STAMINA_PER_MS> {
  multipliedBy(value: TimestampDiff): StaminaValue;
}

export interface IStaminaProps {
  setup: StaminaSetup;
  lastValue: StaminaValue;
  lastUpdateAt: TimestampValue;
}

interface StaminaBuilderProps {
  recoveryPerMS: NumberLike<NT.STAMINA_PER_MS>;
  maxValue: NumberLike<NT.STAMINA>;
}

export class StaminaSetup {
  constructor(readonly props: StaminaBuilderProps) {}

  _new(value: NumberLike<NT.STAMINA>, lastUpdateAt: NumberLike<NT.TIMESTAMP_MS>): Stamina {
    return new Stamina({
      lastValue: new BigNumber(value),
      lastUpdateAt: new BigNumber(lastUpdateAt),
      setup: this,
    });
  }

  maxValue(): StaminaValue {
    return bnFrom(this.props.maxValue);
  }

  recoveryPerMS(): StaminaPerMS {
    return bnFrom(this.props.recoveryPerMS);
  }
}

// tslint:disable-next-line:no-empty-interface
export interface StaminaType extends Stamina {}
class Stamina {

  constructor(private readonly props: IStaminaProps) {}

  private lastUpdateAt(): TimestampValue {
    return new BigNumber(this.props.lastUpdateAt);
  }

  private lastValue(): StaminaValue {
    return this.props.lastValue;
  }

  private maxValue(): StaminaValue {
    return this.setup().maxValue();
  }

  private setup(): StaminaSetup {
    return this.props.setup;
  }

  private recoveryPerMS(): StaminaPerMS {
    return this.setup().recoveryPerMS();
  }

  valueAt($ts?: NumberLike<NT.TIMESTAMP_MS>): StaminaValue {
    const ts: TimestampValue = new BigNumber($ts || Date.now());
    if (ts.lt(this.lastUpdateAt())) { throw new ValidationException(`cannot check value for ${ts} if lastUpdate at is ${ts}`); }
    if (this.props.lastValue.gt(this.maxValue())) { return this.props.lastValue; }
    const recoveryTime = ts.minus(this.lastUpdateAt());
    const recovered = this.recoveryPerMS().multipliedBy(recoveryTime);
    const currentValue = this.lastValue().plus(recovered);
    if (currentValue.gt(this.maxValue())) { return this.maxValue(); }
    return currentValue;
  }

  recover(amount: NumberLike<NT.STAMINA>, at: NumberLike<NT.TIMESTAMP_MS>): Stamina {
    return new Stamina({
      lastUpdateAt: new BigNumber(at),
      lastValue: this.valueAt(at).plus(new BigNumber(amount)),
      setup: this.setup(),
    });
  }

  consume(amount: NumberLike<NT.STAMINA>, at: NumberLike<NT.TIMESTAMP_MS>): Stamina {
    const lastValue = this.valueAt(at).minus(new BigNumber(amount));
    if (lastValue.lt(0)) { throw new ValidationException(`insufficient stamina`); }
    return new Stamina({
      lastValue,
      lastUpdateAt: new BigNumber(at),
      setup: this.setup(),
    });
  }
}
