/**
 * Created by henryleu on 25/06/2017.
 */
const objectAssign = require('../assign');
const stringify = require('json-stringify-safe');

const debug = function (msg) {
    console.log(typeof msg === 'string' ? msg : stringify(msg, null, 4));
};

const log = {debug: debug};

const reqInterceptor = function (config) {
    log.debug('Request:');
    const input = objectAssign({}, config);
    input.httpsAgent = undefined;
    input.httpAgent = undefined;
    log.debug(input);
    return config;
};

const reqErrInterceptor = function (error) {
    log.debug('Error:');
    log.debug(error);
    return Promise.reject(error);
};

const resInterceptor = function (response) {
    log.debug('Response:');
    const output = objectAssign({}, response);
    output.config = undefined;
    output.request = undefined;
    log.debug(output);
    return response;
};

const resErrInterceptor = function (error) {
    log.debug('Error:');
    log.debug(error);
    return Promise.reject(error);
};

module.exports = {
    log,
    reqInterceptor,
    reqErrInterceptor,
    resInterceptor,
    resErrInterceptor
};
