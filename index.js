var through = require('through2');
var gutil = require('gulp-util');
var optimize = require('optimize-js');
var isObject = require('lodash/fp/isObject');
var defaultsDeep = require('lodash/fp/defaultsDeep');

var defaultOptions = defaultsDeep({
  sourceMaps: false
});

function setup(opts) {
  if (opts && !isObject(opts)) {
    gutil.log(gutil.colors.yellow(
      'gulp-optimize-j expects an object, non-object provided'
    ));
    opts = {};
  }

  var options = defaultOptions(opts);

  return options;
}

// plugin level function (dealing with files)
function gulpOptimizeJs(opts) {
  function transform (file, encoding, callback) {
    var options = setup(opts || {});

    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(
        new gutil.PluginError('gulp-optimize-js', 'Streaming not supported')
      );
    }

    var contents = file.contents.toString('utf8');

    try {
      var output = optimize(contents, options);
    } catch (err) {
      return callback(
        new gutil.PluginError(
          'gulp-optimize-js',
          'Unable to optimize. Is this valid JavaScript?'
        )
      );
    }

    file.contents = new Buffer(output);

    callback(null, file);
  }

  return through.obj(transform);
}

// exporting the plugin main function
module.exports = gulpOptimizeJs;
