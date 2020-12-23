import BaseModel from './base';

export default class ProfileDetailsModel extends BaseModel {
    constructor(initData) {
        super();
        this.PhoneNumber = '';
        this.FirstName = '';
        this.LastName = '';
        this.BirthDate = '';
        this.Sex = 1;
        this.copyFrom(initData);
    }
}
