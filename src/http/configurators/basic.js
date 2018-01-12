/*
 * Created by Henry Leu (henryleu@126.com) on 2018/1/11
 */
const Configurator = require('./config');
const protocolUtil = require('../../protocol');

class BasicConfigurator extends Configurator {
    constructor (settings) {
        super();
        this.settings = settings;
    }

    config (context, config) {
        context.appGroup = this.settings.appGroup;
        context.protocol = context.protocol || protocolUtil.getProtocol();
        typeof context.secured === 'undefined' && (context.secured = protocolUtil.isSecured());
        typeof context.isNode === 'undefined' && (context.isNode = protocolUtil.isInNode());

        return config;
    }
}

module.exports = BasicConfigurator;
