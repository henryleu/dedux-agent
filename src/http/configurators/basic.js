/*
 * Created by Henry Leu (henryleu@126.com) on 2018/1/11
 */
const Configurator = require('./config');
const p = require('../../protocol');

class BasicConfigurator extends Configurator {
    constructor (settings) {
        super();
        this.settings = settings;
    }

    config (context, config) {
        context.appGroup = this.settings.appGroup;
        context.protocol = context.protocol || p.getProtocol();
        typeof context.secured === 'undefined' && (context.secured = p.isSecured());
        typeof context.isNode === 'undefined' && (context.isNode = p.isInNode());
        return config;
    }
}

module.exports = BasicConfigurator;
