var gulp = require('gulp'),
	mocha = require('gulp-mocha'),
	jsValidate = require('gulp-jsvalidate');

process.env.NODE_ENV = 'development';

var paths = {
	tests: 'test/**.js'
};

gulp.task('validate', function(){
	return gulp.src('app.js')
		.pipe(jsValidate());
});

gulp.task('test', function(){
	return gulp.src(paths.tests)
		.pipe(mocha({reporter: 'spec'}));
});

gulp.task('watch', function(){
	gulp.watch(paths.tests, ['test']);
});

gulp.task('default', ['test']);