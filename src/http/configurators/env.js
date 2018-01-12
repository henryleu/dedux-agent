/*
 * Created by Henry Leu (henryleu@126.com) on 2018/1/11
 */
const Configurator = require('./config');

class EnvConfigurator extends Configurator {
    constructor (settings) {
        super();
        this.settings = settings;
    }

    config (context, config) {
        const appName = context.appName;
        const env = context.env;
        const baseURL = context.protocol + '//' + this.settings.baseUrls[appName][env];
        return Object.assign(config, {baseURL});
    }
}

module.exports = EnvConfigurator;
