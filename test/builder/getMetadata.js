/*
 * Created by Henry Leu (henryleu@126.com) on 2017/12/26
 */
const getMetadata = require('../../build/getMetadata');

getMetadata().then((metadata) => console.log(JSON.stringify(metadata, null, 4)));
