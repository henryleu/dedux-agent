/**
 * Created by henryleu on 26/12/2017.
 */
const Builder = require('../src').Builder;
const builder = Builder.newBuilder();
const fetcher = builder
    .config({
        env: 'dev',
        debug: false,
        timeout: 10000
    })
    ._buildFetcher('portal');
const getMetadata = () => fetcher.request('agent/getMetadata');

module.exports = getMetadata;
