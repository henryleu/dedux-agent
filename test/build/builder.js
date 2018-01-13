/**
 * 1. make configuration aware items
 * 2. make state ware items
 * 3. make protocol client interceptors
 * 4. set protocol client
 */

const HttpClientBuilder = require('../../src/http/builder');
const BasicConfigurator = require('../../src/http/configurators/basic');
const EnvConfigurator = require('../../src/http/configurators/env');
const AgentConfigurator = require('../../src/http/configurators/node');

class Agent {
    constructor (context, state) {
        this.options = context;
        this.state = state;
        this.httpClient = null;
    }

    setHttpClient (httpClient) {
        this.httpClient = httpClient;
        return this;
    }
}

class Builder {
    constructor () {
        this.options = {};
        this.state = {};
        this.options = [];
        this.optionMap = {};
        this.httpClientBuilder = new HttpClientBuilder();
    }

    _addOption (option) {
        if (!(option instanceof Option)) { // todo is Option subclass's instance
            throw new Error('option needs to be the instance of Option subclass');
        }
        if (this.optionMap[option.name]) {
            throw new Error(`option ${option.name} exists`);
        }

        this.options.push(option);
        this.optionMap[option.name] = option;
        if (option.hasDefault) {
            this.options[option.name] = option.defaultValue;
        }
    }

    _validateOptions () {
        for (let option of this.options) {
            let result = option.valid(this.options[option.name]);
            if (result) throw new Error(result);
        }
    }

    _addConfigurator (configurator) {
        this.httpClientBuilder.addConfigurator(configurator);
    }

    _addRequestInterceptor (...args) {
        this.httpClientBuilder.addRequestInterceptor(...args);
    }

    _addResponseInterceptor (...args) {
        this.httpClientBuilder.addResponseInterceptor(...args);
    }

    set (name, value) {
        if (typeof name === 'string' && typeof value !== 'undefined') {
            const option = this.optionMap[name];
            if (!option) {
                throw new Error(`agent doesn't support the option ${name}`);
            }

            this.options[option.name] = value;
            return this;
        } else if (typeof name === 'object' && typeof value === 'undefined') {
            let config = name;
            for (let n in config) {
                if (config.hasOwnProperty(n)) {
                    this.set(n, config[n]);
                }
            }
            return this;
        } else {
            throw new Error('invalid parameters');
        }
    }

    build () {
        this._validateOptions();
        this.httpClientBuilder.setOptions(this.options);
        const httpClient = this.httpClientBuilder.build();

        const agent = new Agent(this.options, this.state);
        agent.setHttpClient(httpClient);

        console.log(agent);
        return agent;
    }
}

class Option {
    constructor (config) {
        if (typeof config !== 'object') throw new Error('config needs to be object');
        this.hasDefault = config.hasDefault;

        typeof config.defaultValue !== 'undefined' && (this.defaultValue = config.defaultValue);

        if (typeof config.name !== 'string' || !config.name) {
            throw new Error('config name is required');
        }
        this.name = config.name;

        if (typeof config.valid !== 'function') {
            throw new Error('config valid is required');
        }
        this.valid = config.valid;
    }
}

class DefaultBuilder extends Builder {
    constructor (settings, metadata) {
        super();
        this.settings = settings;
        this.metadata = metadata;

        let debug = new Option({
            name: 'debug',
            hasDefault: true,
            defaultValue: false,
            valid (value) {
                return typeof value === 'boolean' ? '' : 'invalid debug';
            }
        });
        this._addOption(debug);

        let env = new Option({
            name: 'env',
            hasDefault: true,
            defaultValue: 'dev',
            valid (value) {
                const envs = {dev: true, ci: true, prd: true};
                return envs[value] ? '' : 'invalid env, correct value should be dev, ci or prd';
            }
        });
        this._addOption(env);

        let appName = new Option({
            name: 'appName',
            hasDefault: false,
            valid (value) {
                const ends = {portal: true, boss: true, app: true};
                return ends[value] ? '' : 'invalid appName, correct value should be portal, boss or app';
            }
        });
        this._addOption(appName);

        const basicConfigurator = new BasicConfigurator(this.settings);
        this._addConfigurator(basicConfigurator);

        const envConfigurator = new EnvConfigurator(this.settings);
        this._addConfigurator(envConfigurator);

        const agentConfigurator = new AgentConfigurator();
        this._addConfigurator(agentConfigurator);

        /*
         * setup interceptors
         */
        const output = require('../../src/http/interceptors/output')();
        this._addResponseInterceptor(output.interceptor, output.errInterceptor);

        const debugReq = require('../../src/http/interceptors/debug').request(this.options);
        this._addRequestInterceptor(debugReq.interceptor, debugReq.errInterceptor);

        const debugRes = require('../../src/http/interceptors/debug').response(this.options);
        this._addResponseInterceptor(debugRes.interceptor, debugRes.errInterceptor);

        const tokenInterceptor = require('../../src/http/interceptors/token')(this.state);
        this._addRequestInterceptor(tokenInterceptor);
    }

    // build () {
    //     return new Agent();
    // }
}

module.exports = DefaultBuilder;

const builder = new DefaultBuilder(require('../../src/metadata/settings'), require('../../src/metadata/metadata'));
// const agent = builder.set('debug', true).set('env', 'ci').build();
const agent = builder.set({debug: true, env: 'ci', appName: 'portal'}).build();
console.log(agent);
