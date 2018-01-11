/*
 * Created by Henry Leu (henryleu@126.com) on 2017/12/25
 */
const Builder = require('../../src').Builder;

const builder = Builder.newBuilder();

const portal = builder
    .set('env', 'dev')
    .set('debug', true)
    .config({
        timeout: 10000
    })
    .buildPortal();

const booker = builder
    .set('env', 'dev')
    .set('debug', true)
    .config({
        timeout: 10000
    })
    .buildBooker();

const test = async () => {
    let output = await portal.system.loginAnonymously();
    console.log(output);
    const userId = output.user._id;
    const at = output.user.at;

    output = await portal.tvcode.requestTvcode('13683042288', true);
    console.log(output);

    portal.setLoginToken(at);
    output = await portal.user.loadUserById(userId);
    console.log(output);

    booker.setLoginToken(at);
    output = await booker.user.loadUserById(userId);
    console.log(output);
};

test();
