/**
 * Created by henryleu on 25/12/2017.
 */
const assign = require('./assign');
const Client = require('./client');
const Group = require('./group');
const Fetcher = require('./fetcher');
const token = require('./fetcher/token');
const protocol = require('./protocol');
const { xAppName } = require('./keys');
const { InvalidLogin, WithoutLoginToken } = require('isocall').outputs;
const { appGroup, baseUrls } = require('./metadata/settings');

const Builder = function () {
    this.options = {
        env: 'dev',
        timeout: 5000,
        debug: false
    };
};

Builder.OptionKeys = {
    appId: true,
    appSecret: true,
    debug: true,
    timeout: true,
    env: true
};

Builder.newBuilder = function () {
    return new Builder();
};

const P = Builder.prototype;

P.config = function (options) {
    if (!options || typeof options !== 'object') {
        throw new Error('wrong parameters');
    }
    assign(this.options, options);
    return this;
};

P.set = function (key, value) {
    if (!Builder.OptionKeys[key]) {
        throw new Error('unsupported key');
    }
    this.options[key] = value;
    return this;
};

const getMethod = (fetcher, client, {url, meta}) => function () {
    if (meta.auth && !client.getLoginToken()) {
        return Promise.resolve(InvalidLogin.clone().sub(WithoutLoginToken.clone()));
    }
    const args = Array.prototype.slice.call(arguments);
    return fetcher.request(url, args, meta);
};

P._buildFetcher = function (appName) {
    const baseURL = protocol.getProtocol() + '//' + baseUrls[appName][this.options.env];
    const secured = protocol.isSecured();
    const isNode = protocol.isInNode();

    const headers = {};
    headers[xAppName] = appGroup + '/' + appName;

    const config = {baseURL, headers};
    config.timeout = this.options.timeout;

    const options = {secured, isNode};
    options.debug = this.options.debug;

    const client = this.client = new Client();
    const fetcher = new Fetcher(config, options);
    fetcher.useRequestInterceptor(token(client));

    return fetcher;
};

P.build = function (appName) {
    const fetcher = this._buildFetcher(appName);
    const client = this.client;
    const metadata = require('./metadata/metadata.json');
    const clientSdk = metadata[appName];
    const groups = clientSdk.groups;

    for (let groupData of groups) {
        const group = new Group(groupData.name);
        const methods = groupData.methods;

        for (let meta of methods) {
            const url = groupData.name + '/' + meta.name;
            group._addMethod(meta.name, getMethod(fetcher, client, {url, meta}));
        }

        client._addGroup(groupData.name, group);
    }

    this.client = null;
    return client;
};

P.buildPortal = function () { return this.build('portal'); };
P.buildBooker = function () { return this.build('booker'); };
P.buildBoss = function () { return this.build('boss'); };

module.exports = Builder;
