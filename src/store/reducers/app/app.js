import { Record } from 'immutable';
import { app as appActions } from '../../actions';
import { LOCALES } from '../../../lang';

const initialState = new Record({
    lang: LOCALES.ru,
})();

const app = (state = initialState, action) => {
    switch (action.type) {
    case appActions.APP_CHANGE_LANG:
    case appActions.APP_CHANGE_LANG_FULFILLED:
        return state.merge({ lang: action.payload });
    case appActions.APP_CHANGE_LANG_REJECTED:
        return state.merge({ lang: action.payload || LOCALES.en });
    default:
        return state;
    }
};

export default app;
