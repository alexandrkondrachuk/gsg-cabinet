import { Record } from 'immutable';
import * as _ from 'lodash';
import { app as appActions } from '../../actions';
import { LOCALES } from '../../../lang';
import AuthModel from '../../../models/auth-model';
import AuthInfoModel from '../../../models/auth-info-model';
import UserInfoModel from '../../../models/user-info-model';
import Register from '../../../classes/register';
import RegisterSession from '../../../classes/register-session';
import { config } from '../../../config';
import PurchaseModel from '../../../models/purchase-model';
import OperationModel from '../../../models/operation-model';

const storage = config.get('storage');
const authStoreName = _.get(storage, 'auth');
const authInfoStoreName = _.get(storage, 'authInfo');
// eslint-disable-next-line no-nested-ternary
const storageAuth = Register.has(authStoreName) ? Register.get(authStoreName) : RegisterSession.has(authStoreName) ? RegisterSession.get(authStoreName) : null;
// eslint-disable-next-line no-nested-ternary
const storageAuthInfo = Register.has(authInfoStoreName) ? Register.get(authInfoStoreName) : RegisterSession.has(authInfoStoreName) ? RegisterSession.get(authInfoStoreName) : null;
const auth = storageAuth ? new AuthModel(storageAuth) : new AuthModel();
const authInfo = (storageAuth && storageAuthInfo) ? new AuthInfoModel(storageAuthInfo) : new AuthInfoModel();

const initialState = new Record({
    lang: LOCALES.ru,
    auth,
    authInfo,
    userInfo: new UserInfoModel(),
    stations: null,
    purchases: [],
    history: [],
})();

function updateUserInfo(prevModel, newModel) {
    return new UserInfoModel(_.merge(prevModel, newModel));
}

function setPurchasesModel(purchases = []) {
    return purchases.map((purchase) => (new PurchaseModel(purchase)));
}

function setHistoryModel(history = []) {
    return history.map((operation) => (new OperationModel(operation)));
}

const app = (state = initialState, action) => {
    switch (action.type) {
    case appActions.APP_CHANGE_LANG:
    case appActions.APP_CHANGE_LANG_FULFILLED:
        return state.merge({ lang: action.payload });
    case appActions.APP_CHANGE_LANG_REJECTED:
        return state.merge({ lang: action.payload || LOCALES.en });
    case appActions.APP_GET_USER_INFO:
        return state.merge({ userInfo: action.payload });
    case appActions.APP_GET_STATIONS:
        return state.merge({ stations: action.payload });
    case appActions.APP_UPDATE_USER_INFO:
        return state.merge({ userInfo: updateUserInfo(state.userInfo, action.payload) });
    case appActions.APP_SET_PURCHASES:
        return state.merge({ purchases: setPurchasesModel(action.payload) });
    case appActions.APP_SET_HISTORY:
        return state.merge({ history: setHistoryModel(action.payload) });
    default:
        return state;
    }
};

export default app;
