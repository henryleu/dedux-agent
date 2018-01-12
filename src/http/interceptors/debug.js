/**
 * Created by henryleu on 25/06/2017.
 */
const objectAssign = require('../../common/assign');
const stringify = require('json-stringify-safe');

const debug = function (msg) {
    console.log(typeof msg === 'string' ? msg : stringify(msg, null, 4));
};

const log = {debug: debug};

const request = (context) => {
    const interceptor = function (config) {
        if (context.debug) {
            log.debug('request debug:');
            const input = objectAssign({}, config);
            input.httpsAgent = undefined;
            input.httpAgent = undefined;
            log.debug(input);
        }
        return config;
    };

    const errInterceptor = function (error) {
        if (context.debug) {
            log.debug('request error debug:');
            log.debug(error);
        }
        return Promise.reject(error);
    };

    return {interceptor, errInterceptor};
};

const response = (context) => {
    const interceptor = function (response) {
        if (context.debug) {
            log.debug('response debug:');
            const output = objectAssign({}, response);
            output.config = undefined;
            output.request = undefined;
            log.debug(output);
        }
        return response;
    };

    const errInterceptor = function (error) {
        if (context.debug) {
            log.debug('response error debug:');
            log.debug(error);
        }
        return Promise.reject(error);
    };
    return {interceptor, errInterceptor};
};

module.exports = { request, response };
