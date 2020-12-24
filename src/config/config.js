import config from 'react-global-configuration';

const server = 'http://akondrachuk.s-host.net/';
const apiServer = 'http://globalsungroup.com/sunserver/';

config.set({
    storage: {
        auth: 'auth',
        authInfo: 'authInfo',
    },
    urls: {
        main: {
            ru: '/',
            en: '/en/home/',
        },
        api: {
            createPurchaseURL: `${apiServer}api/Account/CreatePurchaseByUser`,
            userDataURL: `${apiServer}api/Account/GetUserData`,
            stationsApiURL: `${apiServer}api/PowerPlants/`,
            changePasswordURL: `${apiServer}api/Account/ChangePassword`,
            updateUserURL: `${apiServer}api/Account/UpdateUser`,
            uploadUserFileUrl: `${apiServer}api/Account/UploadUserFile`,
            contentPostsApiURL: `${server}wp-json/wp/v2/posts`,
        },
    },
    api: {
        categories: [45], // WP categories
    },
    timers: {
        redirectAfterAuth: 5 * 1000,
    },
    dateFormat: 'DD.MM.YYYY',
    limits: {
        min: 0,
        max: 100000,
        step: 100,
    },
    numberFormat: '0,0.00',
    numberParts: [',', ' '],
    numberShortFormat: '0,0',
});

export {
    config,
};
