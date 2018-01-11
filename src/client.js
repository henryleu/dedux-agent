/**
 * Created by henryleu on 25/12/2017.
 */

const Group = require('./group');
const assign = require('./assign');

const Client = function () {
    Group.call(this, 'client');
    this._agent = {};
};

Client.prototype.setLoginToken = function (token) {
    this._agent.loginToken = token;
    return this;
};

Client.prototype.getLoginToken = function () {
    return this._agent.loginToken;
};

assign(Client.prototype, Group.prototype);

module.exports = Client;
