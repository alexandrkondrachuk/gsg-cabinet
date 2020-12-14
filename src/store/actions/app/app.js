import { LOCALES } from '../../../lang';

export const APP_CHANGE_LANG = 'APP_CHANGE_LANG';
export const APP_CHANGE_LANG_FULFILLED = 'APP_CHANGE_LANG_FULFILLED';
export const APP_CHANGE_LANG_REJECTED = 'APP_CHANGE_LANG_REJECTED';
export const APP_GET_USER_INFO = 'APP_GET_USER_INFO';
export const APP_GET_STATIONS = 'APP_GET_STATIONS';

export function changeLang(payload = LOCALES.en) {
    return {
        type: APP_CHANGE_LANG,
        payload,
    };
}

// Just to test Async code

export function changeLangAsync(payload = LOCALES.en) {
    return (dispatch) => {
        setTimeout(() => dispatch(changeLang(payload)), 3000);
    };
}

export function changeLangPromise(payload = LOCALES.en) {
    return {
        type: APP_CHANGE_LANG,
        payload: new Promise((resolve) => {
            setTimeout(() => {
                resolve(payload);
            }, 3000);
        }),
    };
}

export function getUserInfo(model = null) {
    return {
        type: APP_GET_USER_INFO,
        payload: model,
    };
}

export function getStations(payload = null) {
    return {
        type: APP_GET_STATIONS,
        payload,
    };
}
