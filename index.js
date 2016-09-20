var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var optimize = require('optimize-js');

// plugin level function (dealing with files)
function gulpOptimizeJs() {
    var transform = function(file, encoding, callback) {
  	if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      var error = new gutil.PluginError('gulp-optimize-js', 'Streaming not supported');
      return callback(error);
    }

    var contents = file.contents.toString("utf8");

    var output = optimize(contents);

    file.contents = new Buffer(output);

    callback(null, file); 
  };

  return through.obj(transform);
}

// exporting the plugin main function
module.exports = gulpOptimizeJs;