/**
 * Created by henryleu on 26/12/2017.
 */
const { xAuth } = require('../keys');

const tokenInterceptor = (client) => (config) => {
    config.meta.auth && (config.headers[xAuth] = 'Bearer ' + client.getLoginToken());
    return config;
};

module.exports = tokenInterceptor;
