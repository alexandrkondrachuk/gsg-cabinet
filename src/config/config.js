import config from 'react-global-configuration';

const server = 'http://globalsungroup.com/';
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
            userDataURL: `${apiServer}api/Account/GetUserData`,
            stationsApiURL: `${apiServer}api/PowerPlants/`,
            contentPostsApiURL: `${server}wp-json/wp/v2/posts`,
        },
    },
    api: {
        categories: [45], // WP categories
    },
    timers: {
        redirectAfterAuth: 5 * 1000,
    },
});

export {
    config,
};
