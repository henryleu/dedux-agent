/**
 * Created by henryleu on 15/07/2017.
 */
const {
    UnknownNetworkError,
    NetworkRefused,
    RequestAborted,
    WrongHttpResponse,

    ServiceUnavailable,
    InternalServiceError,
    NotFound,
    Refused
} = require('isocall').outputs;

const infraCodes = {
    'ECONNREFUSED': NetworkRefused.clone(),
    'EHOSTUNREACH': NetworkRefused.clone(),
    'ECONNABORTED': RequestAborted.clone()
};

const httpCodes = {
    '404': NotFound.clone(),
    '500': InternalServiceError.clone(),
    '503': ServiceUnavailable.clone()
};

const handler = function (ret) {
    if (typeof ret.data === 'string') {
        return WrongHttpResponse.clone({rawData: ret.data});
    } else if (typeof ret.data === 'object') {
        return ret.data;
    } else {
        return WrongHttpResponse.clone({rawData: ret.data});
    }
};

const errorHandler = function (ret) {
    if (ret.response) {
        const code = ret.response.status;
        // console.log(ret.response);
        if (httpCodes['' + code]) {
            return httpCodes['' + code];
        }

        const status = Number(ret.response.status);
        const statusInfo = {subcode: ret.response.status, msg: ret.response.statusText};
        if (status >= 400 && status < 500) {
            return Refused.clone(statusInfo);
        } else {
            return InternalServiceError.clone(statusInfo);
        }
    } else {
        const doc = infraCodes[ret.code];
        if (doc) return doc;

        return UnknownNetworkError.clone({msg: ret.toString()});
    }
};

module.exports = () => ({
    interceptor: handler,
    errInterceptor: errorHandler
});
