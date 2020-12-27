import BaseModel from './base';

export default class OperationModel extends BaseModel {
    constructor(initData) {
        super();
        this.Comment = '';
        this.CreationDate = '';
        this.Id = 0;
        this.KilowattAmount = 0;
        this.OperationType = 1;
        this.PaymentPerKW = 0;
        this.PowerPlant = null;
        this.Price = 0;
        this.SourceId = 0;
        this.Sum = 0;
        this.UserId = '';
        this.copyFrom(initData);
    }
}
