import * as _ from 'lodash';
import BaseModel from './base';

export default class AuthModel extends BaseModel {
    constructor(initData) {
        super();
        this.grant_type = 'password';
        this.username = '';
        this.password = '';
        this.save = true;
        this.show = false;
        this.isReady = false;
        this.copyFrom(initData);
        this.init(initData);
    }

    init(data) {
        if (data) {
            const username = _.get(data, 'username', null);
            const password = _.get(data, 'password', null);

            this.isReady = !!(username) && !!(password);
        }
    }
}
