import * as _ from 'lodash';
import moment from 'moment';
import BaseModel from './base';

export default class AuthInfoModel extends BaseModel {
    constructor(initData) {
        super();
        this['.expires'] = '';
        this['.issued'] = '';
        this.access_token = '';
        this.expires_in = '';
        this.token_type = 'bearer';
        this.userName = '';
        this.isTokenValid = false;
        this.copyFrom(initData);
        this.init(initData);
    }

    init(data) {
        if (data) {
            const expires = _.get(data, '.expires', null);
            this.isTokenValid = moment().isBefore(expires);
        }
    }
}
