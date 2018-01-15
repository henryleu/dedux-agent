/*
 * Created by Henry Leu (henryleu@126.com) on 2018/1/11
 */
const Configurator = require('./config');
const p = require('../../protocol');

class BasicConfigurator extends Configurator {
    constructor (appGroup, hdApp) {
        super();
        this.appGroup = appGroup;
        this.hdApp = hdApp;
    }

    config (options, config) {
        options.appGroup = this.appGroup;
        options.protocol = options.protocol || p.getProtocol();
        typeof options.secured === 'undefined' && (options.secured = p.isSecured());
        typeof options.isNode === 'undefined' && (options.isNode = p.isInNode());

        // set app info header
        config.headers[this.hdApp] = options.appGroup + '/' + options.appName;
        return config;
    }
}

module.exports = BasicConfigurator;
