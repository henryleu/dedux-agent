/*
 * Created by Henry Leu (henryleu@126.com) on 2017/12/25
 */
const DefaultBuilder = require('../../src').DefaultBuilder;
const settings = require('../../src/metadata/settings');
const metadata = require('../../src/metadata/metadata');

const builder = new DefaultBuilder(settings, metadata);

const portal = builder
    .set('env', 'dev')
    .set('debug', true)
    .set('timeout', 3000)
    .build();

console.log(portal.getOptions());
const test = async () => {
    let output = await portal.system.loginAnonymously();
    console.log(output);
    // const userId = output.user._id;
    // const at = output.user.at;
    //
    // output = await portal.tvcode.requestTvcode('13683042288', true);
    // console.log(output);
    //
    // portal.setLoginToken(at);
    // output = await portal.user.loadUserById(userId);
    // console.log(output);
};

test();
