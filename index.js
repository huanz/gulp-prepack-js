const path = require('path');
const through = require('through2');
const applySourceMap = require('vinyl-sourcemaps-apply');
const PluginError = require('gulp-util').PluginError;
const prepack = require('prepack');

const reSourceMapComment = /\n\/\/# sourceMappingURL=.+?$/;

module.exports = function gulpPrepackJS(options) {
    options = options || {};
    const transform = function (file, enc, cb) {
        if (!file || !file.contents) {
            return cb(null, file);
        }
        if (file.isStream()) {
            this.emit('error', new PluginError('gulp-prepack-js', 'Streaming not supported!'));
            return cb(null, file);
        }
        if (file.sourceMap) {
            options.inputSourceMap = JSON.stringify(file.sourceMap);
            options.sourceMaps = true;
        }
        try {
            let serialized = prepack(file.contents.toString(), options);
            file.contents = new Buffer(serialized.code.replace(reSourceMapComment, ''));
            if (options.sourceMaps && serialized.map) {
                let sourceMap = JSON.parse(serialized.map);
                sourceMap.file = path.relative(file.base, file.path);
                sourceMap.sources = sourceMap.sources.map(function () {
                    return path.relative(file.base, file.path);
                });
                applySourceMap(file, sourceMap);
            }
            return cb(null, file);
        } catch (error) {
            return cb(error);
        }
    };

    return through.obj(transform);
};