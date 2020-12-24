import BaseModel from './base';

export default class StationCalculatorModel extends BaseModel {
    constructor(initData) {
        super();
        this.KilowattAmount = 0;
        this.Amount = 0;
        this.PaymentAmount = 0;
        this.Roi = 0;
        this.InvestmentReturn = 0;
        this.copyFrom(initData);
    }
}
