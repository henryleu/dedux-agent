/**
 * Created by henryleu on 26/12/2017.
 */
const { hdAuth, LoginToken } = require('../../keys');

const tokenInterceptor = (state) => (config) => {
    const token = state[LoginToken];
    token && (config.headers[hdAuth] = 'Bearer ' + token);
    return config;
};

module.exports = tokenInterceptor;
