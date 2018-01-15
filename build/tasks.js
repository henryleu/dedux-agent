/**
 * Created by henryleu on 07/07/2017.
 */
const path = require('path');
const gulp = require('gulp');
const jsonFile = require('jsonfile');
const getMetadata = require('./getMetadata');
const metadataPath = path.join(__dirname, '../test/metadata/metadata.json');
const metadataDistPath = path.join(__dirname, '../dist/metadata/');

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

gulp.task('copy', ['update'], function () {
    return gulp.src(metadataPath).pipe(gulp.dest(metadataDistPath));
});

/**
 * Define a task which is used to parse jsdoc to json object
 * and save the parsed json object to template.json file
 */
const writeMetadataJson = writeJson(metadataPath);
gulp.task('update', function () {
    return getMetadata()
        .then(writeMetadataJson)
        .then(function () {
            console.log('metadata is updated and saved to template.json');
        })
});

gulp.task('build', ['copy', 'update']);

gulp.task('default', ['copy', 'update']);
