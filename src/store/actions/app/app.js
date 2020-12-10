import { LOCALES } from '../../../lang';

export const APP_CHANGE_LANG = 'APP_CHANGE_LANG';
export const APP_CHANGE_LANG_FULFILLED = 'APP_CHANGE_LANG_FULFILLED';
export const APP_CHANGE_LANG_REJECTED = 'APP_CHANGE_LANG_REJECTED';

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
