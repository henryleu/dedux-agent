/*
 * Created by Henry Leu (henryleu@126.com) on 2018/1/11
 */
const Configurator = require('./config');

class EnvConfigurator extends Configurator {
    constructor (baseUrls) {
        super();
        this.baseUrls = baseUrls;
    }

    config (options, config) {
        const appName = options.appName;
        const env = options.env;
        const baseURL = options.protocol + '//' + this.baseUrls[appName][env];
        return Object.assign(config, {baseURL});
    }
}

module.exports = EnvConfigurator;
