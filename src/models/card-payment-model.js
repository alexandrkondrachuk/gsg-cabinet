import BaseModel from './base';

export default class CardPaymentModel extends BaseModel {
    constructor(initData) {
        super();
        this.CardNumber = '';
        this.CardHolderName = '';
        this.Cvv = '';
        this.ExpiredDate = '';
        this.Sum = 0;
        this.SmsCode = '';
        this.Status = 1; // 1 - (InProgress) , 2 - (SmsCode)
        this.copyFrom(initData);
    }
}
