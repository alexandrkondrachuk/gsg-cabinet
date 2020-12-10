// config-overrides.js
module.exports = function override(config) {
    // eslint-disable-next-line no-param-reassign
    config.output = {
        ...config.output, // copy all settings
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js',
    };
    // eslint-disable-next-line no-param-reassign
    config.plugins[5].options.chunkFilename = 'static/css/[name].chunk.css';
    return config;
};
