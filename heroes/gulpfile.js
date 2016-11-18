gulp = require('gulp'); // gulp it, baby
Builder = require('systemjs-builder');

gulp.task('modules', function(cb) {

    doModules('main', './dist/bundle.js')
    .then(function(){
        console.log('Build of modules complete');
        cb();
    })
    .catch(function(err){
        console.error(err);
    });

});

function doModules(manifest, target) {
    return new Builder({
        baseURL: 'app/'
    })
    .build(manifest, target);
}

gulp.task('default', ['modules']);