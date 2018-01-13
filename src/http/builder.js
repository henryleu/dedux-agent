/*
 * Created by Henry Leu (henryleu@126.com) on 2018/1/11
 */
const HttpClient = require('./client');

class Builder {
    constructor () {
        this.options = {};
        this.configurators = [];
        this.request = [];
        this.response = [];
    }

    setOptions (options) {
        this.options = options;
        return this;
    }

    addConfigurator (configurator) {
        this.configurators.push(configurator);
        return this;
    }

    addRequestInterceptor (...args) {
        this.request.push(args);
        return this;
    }

    addResponseInterceptor (...args) {
        this.response.push(args);
        return this;
    }

    build () {
        const client = new HttpClient(this.options, this.configurators);
        for (let args of this.request) {
            client.addRequestInterceptor.apply(client, args);
        }
        for (let args of this.response) {
            client.addResponseInterceptor.apply(client, args);
        }
        return client;
    }
}

module.exports = Builder;
