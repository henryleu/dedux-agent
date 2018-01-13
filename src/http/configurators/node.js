/*
 * Created by Henry Leu (henryleu@126.com) on 2018/1/11
 */
const Configurator = require('./config');

class NodeConfigurator extends Configurator {
    config (options, config) {
        if (options.isNode) {
            if (options.secured) {
                const https = require('https');
                const httpsAgent = new https.Agent({keepAlive: true, rejectUnauthorized: false});
                Object.assign(config, {httpsAgent});
            } else {
                const http = require('http');
                const httpAgent = new http.Agent({keepAlive: true});
                Object.assign(config, {httpAgent});
            }
        }

        return config;
    }
}

module.exports = NodeConfigurator;
