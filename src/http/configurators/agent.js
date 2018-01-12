/*
 * Created by Henry Leu (henryleu@126.com) on 2018/1/11
 */
const Configurator = require('./config');

class AgentConfigurator extends Configurator {
    config (context, config) {
        if (context.isNode) {
            if (context.secured) {
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

module.exports = AgentConfigurator;
