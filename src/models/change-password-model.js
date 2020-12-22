import * as validator from 'validator';
import BaseModel from './base';

export default class ChangePasswordModel extends BaseModel {
    static Validation = [
        { name: 'OldPassword', validator: (value) => (validator.isLength(value, { min: 6, max: 100 })) },
        { name: 'NewPassword', validator: (value) => (validator.isLength(value, { min: 6, max: 100 })) },
        { name: 'ConfirmPassword', validator: (value) => (validator.isLength(value, { min: 6, max: 100 })) },
    ];

    constructor(initData) {
        super();
        this.OldPassword = '';
        this.NewPassword = '';
        this.ConfirmPassword = '';
        this.ShowOldPassword = false;
        this.ShowNewPassword = false;
        this.ShowConfirmPassword = false;
        this.copyFrom(initData);
    }
}
