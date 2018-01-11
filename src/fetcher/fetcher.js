/**
 * Created by henryleu on 25/12/2017.
 */
const axios = require('axios');
const assign = require('../assign');
const debug = require('./debug');
const handle = require('./handle');

const Fetcher = function (config, options) {
    this.config = config;
    this.options = options;

    if (options.isNode) {
        if (options.secured) {
            const https = require('https');
            const httpsAgent = new https.Agent({keepAlive: true, rejectUnauthorized: false});
            this.config = assign({httpsAgent}, config);
        } else {
            const http = require('http');
            const httpAgent = new http.Agent({keepAlive: true});
            this.config = assign({httpAgent}, config);
        }
    }

    this.fetch = axios.create(this.config);
    const request = this.fetch.interceptors.request;
    const response = this.fetch.interceptors.response;

    /*
     * ensure response data to a standard structured json object
     */
    response.use(handle.handler, handle.errorHandler);

    /*
     * print request & response info if debug is on
     */
    if (this.options.debug) {
        request.use(debug.reqInterceptor, debug.reqErrInterceptor);
        response.use(debug.resInterceptor, debug.resErrInterceptor);
    }
};

Fetcher.prototype.useRequestInterceptor = function (inter, errInter) {
    this.fetch.interceptors.request.use(inter, errInter);
};

Fetcher.prototype.useResponseInterceptor = function (inter, errInter) {
    this.fetch.interceptors.response.use(inter, errInter);
};

Fetcher.prototype.request = function (url, data = [], meta = { auth: false }) {
    const cfg = {
        method: 'post',
        url: url,
        data,
        meta
    };

    return this.fetch.request(cfg);
};

module.exports = Fetcher;
