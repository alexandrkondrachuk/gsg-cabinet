import BaseModel from './base';

export default class InvestmentModel extends BaseModel {
    constructor(initData) {
        super();
        this.PowerPlantId = '';
        this.KilowattAmount = 0;
        this.Amount = 0;
        this.PaymentAmount = 0;

        this.copyFrom(initData);
    }
}
