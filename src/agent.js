/*
 * Created by Henry Leu (henryleu@126.com) on 2018/1/13
 */
const { LoginToken } = require('./keys');

class Agent {
    constructor (options) {
        this.options = options;
        this.state = {};
    }

    getOptions () { return this.options; }

    getState () { return this.state; }

    setLoginToken (token) {
        this.state[LoginToken] = token;
        return this;
    }
}

module.exports = Agent;
