import BaseModel from './base';

export default class UserInfoModel extends BaseModel {
    constructor(initData) {
        super();
        this.BTCAddress = '';
        this.Balance = 0;
        this.BirthDate = null;
        this.Email = '';
        this.FirstName = '';
        this.Id = '';
        this.LastName = '';
        this.PhoneNumber = '';
        this.Sex = 1;
        this.UserName = '';
        this.VerificationStatus = 0;

        this.copyFrom(initData);
    }
}
