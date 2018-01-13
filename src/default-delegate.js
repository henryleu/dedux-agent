/*
 * Created by Henry Leu (henryleu@126.com) on 2018/1/12
 */

const HttpClientBuilder = require('./http/builder');
const interceptors = require('./http/interceptors');
const configurators = require('./http/configurators');
const Group = require('./group');
const { InvalidLogin, WithoutLoginToken } = require('isocall').outputs;

class Delegate {
    constructor (settings, metadata) {
        this.settings = settings;
        this.metadata = metadata;
    }

    _buildHttpClient (options, state) {
        let httpClientBuilder = new HttpClientBuilder();

        /*
         * setup configurators
         */
        const BasicConfigurator = configurators.basic;
        const basicConfigurator = new BasicConfigurator(this.settings);
        httpClientBuilder.addConfigurator(basicConfigurator);

        const EnvConfigurator = configurators.env;
        const envConfigurator = new EnvConfigurator(this.settings);
        httpClientBuilder.addConfigurator(envConfigurator);

        const NodeConfigurator = configurators.node;
        const nodeConfigurator = new NodeConfigurator();
        httpClientBuilder.addConfigurator(nodeConfigurator);

        const TimeoutConfigurator = configurators.timeout;
        const timeoutConfigurator = new TimeoutConfigurator();
        httpClientBuilder.addConfigurator(timeoutConfigurator);

        /*
         * setup interceptors
         */
        const output = interceptors.output();
        httpClientBuilder.addResponseInterceptor(output.interceptor, output.errInterceptor);

        const debugReq = interceptors.debug.request(options);
        httpClientBuilder.addRequestInterceptor(debugReq.interceptor, debugReq.errInterceptor);

        const debugRes = interceptors.debug.response(options);
        httpClientBuilder.addResponseInterceptor(debugRes.interceptor, debugRes.errInterceptor);

        const tokenInterceptor = interceptors.token(state);
        httpClientBuilder.addRequestInterceptor(tokenInterceptor);

        httpClientBuilder.setOptions(options);
        return httpClientBuilder.build();
    }

    _buildSdk (options, state, httpClient) {
        const appMeta = this.metadata[options.appName];
        const groups = appMeta.groups;
        const sdk = {};

        const getMethod = (httpClient, state, {url, meta}) => function () {
            if (meta.auth && !state.loginToken) {
                return Promise.resolve(InvalidLogin.clone().sub(WithoutLoginToken.clone()));
            }
            const args = Array.prototype.slice.call(arguments);
            return httpClient.request(url, args, meta);
        };

        for (let groupData of groups) {
            const group = new Group(groupData.name);
            const methods = groupData.methods;

            for (let meta of methods) {
                const url = groupData.name + '/' + meta.name;
                group._addMethod(meta.name, getMethod(httpClient, state, {url, meta}));
            }

            sdk[groupData.name] = group;
        }
        return sdk;
    }

    mixin (agent) {
        const options = agent.getOptions();
        const state = agent.getState();
        const httpClient = this._buildHttpClient(options, state);
        const sdk = this._buildSdk(options, state, httpClient);
        return Object.assign(agent, sdk);
    }
}

module.exports = Delegate;
