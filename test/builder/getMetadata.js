/*
 * Created by Henry Leu (henryleu@126.com) on 2017/12/26
 */
// const getMetadata = require('../../build/getMetadata');
//
// getMetadata().then((metadata) => console.log(JSON.stringify(metadata, null, 4)));
const DefaultBuilder = require('../../src').DefaultBuilder;
const settings = require('../metadata/settings');
const metadata = require('../metadata/boot-metadata');
const helper = require('../../src').helper;
const path = require('path');
const writeJson = helper.writeJson(path.join(__dirname, '../metadata/metadata.json'));

const builder = new DefaultBuilder(settings, metadata);
const portal = builder
    .set('env', 'dev')
    .set('debug', false)
    .set('timeout', 3000)
    .build();

portal.agent.getMetadata().then(writeJson).then(console.log);
