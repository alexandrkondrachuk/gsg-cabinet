import BaseModel from './base';

export default class PurchaseModel extends BaseModel {
    constructor(initData) {
        super();
        this.CreationDate = '';
        this.Dividends = 0;
        this.DividendsList = null;
        this.Id = 0;
        this.KilowattAmount = 0;
        this.PaymentPerKW = 0;
        this.PowerPlant = null;
        this.Price = 0;
        this.Sum = 0;
        this.UserId = '';
        this.copyFrom(initData);
    }
}
