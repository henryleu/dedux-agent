/*
 * Created by Henry Leu (henryleu@126.com) on 2017/12/26
 */
const DefaultBuilder = require('../dist/index').DefaultBuilder;
const settings = require('./metadata/settings');
const metadata = require('./metadata/pull');
const helper = require('./helper');
const path = require('path');
const writeJson = helper.writeJson(path.join(__dirname, './metadata/metadata.json'));
const builder = new DefaultBuilder(settings, metadata);
const portal = builder
    .set('env', 'dev')
    .set('debug', false)
    .set('timeout', 3000)
    .build();

portal.agent.getMetadata().then(writeJson).then(console.log);
