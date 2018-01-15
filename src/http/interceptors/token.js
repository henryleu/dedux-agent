/**
 * Created by henryleu on 26/12/2017.
 */
const { LoginToken } = require('../../keys');

const tokenInterceptor = (state, hdAuth) => (config) => {
    const token = state[LoginToken];
    token && (config.headers[hdAuth] = 'Bearer ' + token);
    return config;
};

module.exports = tokenInterceptor;
