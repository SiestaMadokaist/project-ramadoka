import { StaminaSetup } from '.';
import { PhantomNumber, NT } from '../../../helper/phantom-types';
import BigNumber from 'bignumber.js';
import { ValidationException } from '../../../helper/errors';

describe('Stamina', () => {
  const initializationTs = Date.now();
  const staminaSetup = new StaminaSetup({
    maxValue: new BigNumber(150_000),
    recoveryPerMS: new BigNumber(10),
  });
  const stamina = staminaSetup._new(140 * 1000 as PhantomNumber<NT.STAMINA>, initializationTs);
  describe(stamina.valueAt.name, () => {
    it('prevent calculation before lastUpdate', () => {
      const afterConsumed = stamina.consume(20_000, initializationTs + 2000);
      expect(() => { afterConsumed.valueAt(initializationTs); }).toThrow(ValidationException);
    });
    describe('before maximum limit reached', () => {
      it('recover correctly', () => {
        expect(stamina.valueAt(initializationTs + 10).toNumber()).toBe(140100);
      });
      it('can be consumed correctly', () => {
        const afterConsumed = stamina.consume(20_000, initializationTs);
        expect(afterConsumed.valueAt(initializationTs).toNumber()).toBe(120_000);
      });
    });
    describe('after maximum limit reached', () => {
      it('doesnt recover anymore', () => {
        expect(stamina.valueAt(initializationTs + 2000).toNumber()).toBe(150_000);
      });
      it('can be consumed correctly', () => {
        const consumptionTime = initializationTs + 2000;
        const afterConsumed = stamina.consume(20_000, consumptionTime);
        expect(afterConsumed.valueAt(consumptionTime).toNumber()).toBe(130_000);
      });
    });
    describe('when recovered forcefully with item', () => {
      const recovered = stamina.recover(150_000 as PhantomNumber<NT.STAMINA>, initializationTs);
      it('start at that recovered value', () => {
        expect(recovered.valueAt(initializationTs).toNumber()).toBe(290_000);
      });
      it('stay at the recovered value', () => {
        expect(recovered.valueAt(initializationTs + 2000).toNumber()).toBe(290_000);
      });
      it('calculate correctly when consumed', () => {
        expect(stamina.valueAt(initializationTs).toNumber()).toBe(140_000);
        expect(recovered.valueAt(initializationTs).toNumber()).toBe(290_000);
        const consumed = recovered.consume(20_000, initializationTs);
        expect(consumed.valueAt(initializationTs).toNumber()).toBe(270_000);
      });
    });
  });
});
