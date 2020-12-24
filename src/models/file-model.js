import moment from 'moment';
import BaseModel from './base';

export default class FileModel extends BaseModel {
    static FILE_DATE_FORMAT = 'YYYY-MM-DD hh:mm:ss';

    constructor(initData) {
        super();
        this.FileName = '';
        this.Base64Data = '';
        this.Comment = '';
        this.CreationDate = moment().format(FileModel.FILE_DATE_FORMAT);
        this.copyFrom(initData);
    }
}
