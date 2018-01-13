/*
 * Created by Henry Leu (henryleu@126.com) on 2017/12/25
 */

const Group = function (name) {
    this._name = name;
    this._groupList = [];
    this._groupHash = {};
    this._methodList = [];
    this._methodHash = {};
};

Group.prototype = {
    _addGroup: function (name, group) {
        this._groupList.push(group);
        this._groupHash[name] = group;
        this[name] = group;
        return this;
    },
    _addMethod: function (name, method) {
        this._methodList.push(method);
        this._methodHash[name] = method;
        this[name] = method;
        return this;
    },

    mixinGroups: function (target) {
        for (let name of this._groupHash) {
            target[name] = this._groupHash;
        }
    },

    tearDown: function () {
        this._groupList = null;
        this._groupHash = null;
        this._methodList = null;
        this._methodHash = null;
    }
}

module.exports = Group;
