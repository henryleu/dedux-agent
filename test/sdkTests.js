/*
 * Created by Henry Leu (henryleu@126.com) on 2017/12/25
 */
const portal = require('./agent');
console.log(portal.getOptions());
const test = async () => {
    let output = null;
    portal.setLoginToken('asdfasdf');
    output = await portal.system.loginAnonymously();
    console.log(output);
};

test();
