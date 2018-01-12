/*
 * Created by Henry Leu (henryleu@126.com) on 2018/1/11
 */
const HttpClient = require('./client');

class Builder {
    constructor () {
        this.context = {};
        this.configurators = [];
        this.request = [];
        this.response = [];
    }

    setContext (ctx) {
        this.context = ctx;
        return this;
    }

    addConfigurator (configurator) {
        this.configurators.push(configurator);
        return this;
    }

    addRequestInterceptor (...args) {
        this.request.push(args);
    }

    addResponseInterceptor (...args) {
        this.response.push(args);
    }

    build () {
        const client = new HttpClient(this.context, this.configurators);
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
