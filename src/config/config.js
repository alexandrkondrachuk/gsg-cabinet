import config from 'react-global-configuration';

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
    },
    timers: {
        redirectAfterAuth: 5 * 1000,
    },
});

export {
    config,
};
