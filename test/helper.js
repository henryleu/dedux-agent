/*
 * Created by Henry Leu (henryleu@126.com) on 2018/1/15
 */
const jsonFile = require('jsonfile');

const writeJson = function (filePath) {
    return function (json) {
        return new Promise(function (resolve, reject) {
            jsonFile.writeFile(filePath, json, {spaces: 4}, function (err) {
                if (err) return reject(err);
                resolve(json);
            });
        });
    };
};

module.exports = { writeJson };
