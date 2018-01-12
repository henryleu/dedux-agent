/*
 * Created by Henry Leu (henryleu@126.com) on 2018/1/11
 */
const axios = require('axios');

class HttpClient {
    constructor (context, configurators) {
        this.context = context;
        this.config = {};
        this.configurators = configurators;

        for (let c of this.configurators) {
            c.config(this.context, this.config);
        }

        this.fetch = axios.create(this.config);
    }

    addRequestInterceptor (inter, errInter) {
        this.fetch.interceptors.request.use(inter, errInter);
    }

    addResponseInterceptor (inter, errInter) {
        this.fetch.interceptors.response.use(inter, errInter);
    }

    request (url, data = [], meta) {
        const cfg = {
            method: 'post',
            url: url,
            data,
            meta
        };

        return this.fetch.request(cfg);
    }
}
module.exports = HttpClient;
