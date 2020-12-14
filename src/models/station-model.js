import BaseModel from './base';

export default class StationModel extends BaseModel {
    constructor(initData) {
        super();
        this.copyFrom(initData);
    }
}
