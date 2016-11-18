/* */ 
var fs = require('fs');
var async = require('async');
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var webpack = require('webpack');
var uglify = require('uglify-js');
var rimraf = require('rimraf');
var merge = require('merge-stream');
var argv = require('yargs').argv;
var ENTRY = './index.js';
var HEADER = './lib/header.js';
var DIST = './dist';
var VIS_JS = 'vis.js';
var VIS_MAP = 'vis.map';
var VIS_MIN_JS = 'vis.min.js';
var VIS_CSS = 'vis.css';
var VIS_MIN_CSS = 'vis.min.css';
var INDIVIDUAL_BUNDLES = [{
  entry: './index-timeline-graph2d.js',
  filename: 'vis-timeline-graph2d.min.js'
}, {
  entry: './index-network.js',
  filename: 'vis-network.min.js'
}, {
  entry: './index-graph3d.js',
  filename: 'vis-graph3d.min.js'
}];
function createBanner() {
  var today = gutil.date(new Date(), 'yyyy-mm-dd');
  var version = require('./package.json!systemjs-json').version;
  return String(fs.readFileSync(HEADER)).replace('@@date', today).replace('@@version', version);
}
var bannerPlugin = new webpack.BannerPlugin(createBanner(), {
  entryOnly: true,
  raw: true
});
var webpackModule = {
  loaders: [{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: {
      cacheDirectory: true,
      presets: ['es2015']
    }
  }],
  wrappedContextRegExp: /$^/
};
var webpackConfig = {
  entry: ENTRY,
  output: {
    library: 'vis',
    libraryTarget: 'umd',
    path: DIST,
    filename: VIS_JS,
    sourcePrefix: '  '
  },
  module: webpackModule,
  plugins: [bannerPlugin],
  cache: true
};
var uglifyConfig = {
  outSourceMap: VIS_MAP,
  output: {comments: /@license/}
};
var compiler = webpack(webpackConfig);
function handleCompilerCallback(err, stats) {
  if (err) {
    gutil.log(err.toString());
  }
  if (stats && stats.compilation && stats.compilation.errors) {
    stats.compilation.errors.forEach(function(err) {
      gutil.log(err.toString());
    });
    if (err || stats.compilation.errors.length > 0) {
      gutil.beep();
    }
  }
}
gulp.task('clean', function(cb) {
  rimraf(DIST + '/img', cb);
});
gulp.task('bundle-js', function(cb) {
  bannerPlugin.banner = createBanner();
  compiler.run(function(err, stats) {
    handleCompilerCallback(err, stats);
    cb();
  });
});
gulp.task('bundle-js-individual', function(cb) {
  bannerPlugin.banner = createBanner();
  async.each(INDIVIDUAL_BUNDLES, function(item, callback) {
    var webpackTimelineConfig = {
      entry: item.entry,
      output: {
        library: 'vis',
        libraryTarget: 'umd',
        path: DIST,
        filename: item.filename,
        sourcePrefix: '  '
      },
      module: webpackModule,
      plugins: [bannerPlugin, new webpack.optimize.UglifyJsPlugin()],
      cache: true
    };
    var compiler = webpack(webpackTimelineConfig);
    compiler.run(function(err, stats) {
      handleCompilerCallback(err, stats);
      callback();
    });
  }, cb);
});
gulp.task('bundle-css', function() {
  var files = ['./lib/shared/activator.css', './lib/shared/bootstrap.css', './lib/shared/configuration.css', './lib/timeline/component/css/timeline.css', './lib/timeline/component/css/panel.css', './lib/timeline/component/css/labelset.css', './lib/timeline/component/css/itemset.css', './lib/timeline/component/css/item.css', './lib/timeline/component/css/timeaxis.css', './lib/timeline/component/css/currenttime.css', './lib/timeline/component/css/customtime.css', './lib/timeline/component/css/animation.css', './lib/timeline/component/css/dataaxis.css', './lib/timeline/component/css/pathStyles.css', './lib/network/css/network-manipulation.css', './lib/network/css/network-tooltip.css', './lib/network/css/network-navigation.css', './lib/network/css/network-colorpicker.css'];
  return gulp.src(files).pipe(concat(VIS_CSS)).pipe(gulp.dest(DIST)).pipe(minifyCSS()).pipe(rename(VIS_MIN_CSS)).pipe(gulp.dest(DIST));
});
gulp.task('copy', ['clean'], function() {
  var network = gulp.src('./lib/network/img/**/*').pipe(gulp.dest(DIST + '/img/network'));
  var timeline = gulp.src('./lib/timeline/img/**/*').pipe(gulp.dest(DIST + '/img/timeline'));
  return merge(network, timeline);
});
gulp.task('minify', ['bundle-js'], function(cb) {
  var result = uglify.minify([DIST + '/' + VIS_JS], uglifyConfig);
  fs.writeFileSync(DIST + '/' + VIS_MIN_JS, result.code + '\n');
  fs.writeFileSync(DIST + '/' + VIS_MAP, result.map.replace(/"\.\/dist\//g, '"'));
  cb();
});
gulp.task('bundle', ['bundle-js', 'bundle-js-individual', 'bundle-css', 'copy']);
var bundle = 'bundle' in argv;
var minify = 'minify' in argv;
var watchTasks = [];
if (bundle || minify) {
  watchTasks = [];
  if (bundle)
    watchTasks.push('bundle');
  if (minify)
    watchTasks.push('minify');
} else {
  watchTasks = ['bundle', 'minify'];
}
gulp.task('watch', watchTasks, function() {
  gulp.watch(['index.js', 'lib/**/*'], watchTasks);
});
gulp.task('default', ['clean', 'bundle', 'minify']);
