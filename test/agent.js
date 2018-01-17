const DefaultBuilder = require('../dist/index').DefaultBuilder;
const settings = require('./metadata/settings');
const metadata = require('./metadata/metadata');
const builder = new DefaultBuilder(settings, metadata);

// module.exports = builder
//     .set('env', 'dev')
//     .set('debug', false)
//     .set('appName', 'portal')
//     .set('timeout', 3000)
//     .build();

module.exports = builder
    .set({
        env: 'dev',
        appName: 'portal',
        debug: false,
        timeout: 5000
    })
    .build();
