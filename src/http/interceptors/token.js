/**
 * Created by henryleu on 26/12/2017.
 */
const { xAuth } = require('../../keys');

const tokenInterceptor = (state) => (config) => {
    const token = state['loginToken'];
    if (token) {
        !config.headers && (config.headers = {});
        config.headers[xAuth] = 'Bearer ' + token;
    }
    return config;
};

module.exports = tokenInterceptor;
