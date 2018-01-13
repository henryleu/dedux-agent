/*
 * Created by Henry Leu (henryleu@126.com) on 2018/1/11
 */
const Configurator = require('./config');

class TimeoutConfigurator extends Configurator {
    constructor (settings) {
        super();
        this.settings = settings;
    }

    config (options, config) {
        config.timeout = options.timeout;
        return config;
    }
}

module.exports = TimeoutConfigurator;
