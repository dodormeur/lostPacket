var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-cssmin');
var concat = require('gulp-concat');
var zip = require('gulp-zip');
var fs = require('fs');
var mkdirp = require('mkdirp');
var chalk = require('chalk');
var watch = require('gulp-watch');
var replace = require('gulp-replace');
var browserSync = require('browser-sync').create();
const closureCompiler = require('google-closure-compiler').gulp();

//Chalk colors
var error = chalk.bold.red;
var success = chalk.green;
var regular = chalk.white;

gulp.task('watch', (done) => {

	browserSync.init({
	   server: {
		   baseDir: "./build"
	   }
   });

	gulp.watch('./src/js/**/*.js', gulp.series('build-js', 'zip', 'check'));
	gulp.watch('./src/html/**/*.html', gulp.series('build-html', 'check'));
	gulp.watch('./src/css/**/*.css', gulp.series('build-css', 'check'));
	gulp.watch('./src/assets/**/*', gulp.series('build-assets', 'check'));
});

gulp.task('init', (done) => {
	//Create our directory structure
	mkdirp('./src', function (err) {
		mkdirp('./src/js', function (err) {
			mkdirp('./src/html', function (err) {
				mkdirp('./src/css', function (err) {
					mkdirp('./src/assets', function (err) {
						done();
					});
				});
			});
		});
	});
});

gulp.task('build-js', (done) => {

	return gulp.src('./src/js/**/*.js', {base: './'})
		.pipe(concat('game.js'))
      .pipe(closureCompiler({
          compilation_level: 'ADVANCED',
          warning_level: 'VERBOSE',
          output_wrapper: '%output%',
          js_output_file: 'output.min.js'
        }, {
          platform: ['native', 'java', 'javascript']
        }))
		.on('error', function (err) {
            console.log(err.toString());

            this.emit('end');
        })
      .pipe(gulp.dest('./build/'));


});

gulp.task('build-html', (done) => {
	return gulp.src('./src/html/**/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('./build/'));
});

gulp.task('build-css', (done) => {
	return gulp.src('./src/css/**/*.css')
		.pipe(cssmin())
		.pipe(gulp.dest('./build/'));
});

gulp.task('build-assets', (done) => {
	return gulp.src('./src/assets/**/*')
		.pipe(gulp.dest('./build/'));
});

gulp.task('zip', (done) => {
	return gulp.src('./build/**/*')
		.pipe(zip('entry.zip')) //gulp-zip performs compression by default
		.pipe(gulp.dest('dist'));
});

gulp.task('check', gulp.series('zip', (done) => {
	var stats = fs.statSync("./dist/entry.zip")
	var fileSize = stats.size;
	if (fileSize > 13312) {
		console.log(error("Your zip compressed game is larger than 13kb (13312 bytes)!"))
		console.log(regular("Your zip compressed game is " + fileSize + " bytes"));
	} else {
		console.log(success("Your zip compressed game is " + fileSize + " bytes."));
	}

    browserSync.reload();
	done();
}));

gulp.task("replace", (done) =>{
	return gulp.src(['build/index.html','build/main.css','build/menu.css','build/output.min.js'])
  /* .pipe(replace('HUD', 'a'))
  	.pipe(replace('ingame', 'z'))
   	//.pipe(replace('hidden', 'e'))
   	.pipe(replace('frameAlive', 'r'))
   	//.pipe(replace('menu', 't'))
   	.pipe(replace('middleMenu', 'y'))
   	.pipe(replace('option-disabled', 'p'))
   	.pipe(replace('options', 'u'))
   	.pipe(replace('option', 'i'))
   	.pipe(replace('startButton', 'o'))
   	.pipe(replace('continueButton', 'q'))
   	.pipe(replace('survivalButton', 's'))
   	.pipe(replace('statButton', 'd'))
   	.pipe(replace('infoMenu', 'f'))
   	.pipe(replace('startButton', 'g'))
   	.pipe(replace('stats', 'h'))
   	.pipe(replace('glitch-warning', 'j'))
   	.pipe(replace('plane', 'k'))
   	.pipe(replace('wall', 'l'))
   	//.pipe(replace('floor', 'm'))
   	//.pipe(replace('background', 'w'))
   	.pipe(replace('glitch', 'x'))
   	.pipe(replace('data', 'c'))
   	.pipe(replace('world', 'v'))
   	.pipe(replace('viewport', 'b'))
   	.pipe(replace('targeting', 'n'))
   	.pipe(replace('viewport', 'aa'))
   	.pipe(replace('remainingTime', 'az'))
   	.pipe(replace('viewport', 'ae'))*/
   .pipe(gulp.dest('buildReplaced/'));
});


gulp.task('build', gulp.series('build-html', 'build-js', 'build-assets', 'replace', 'check', (done) => {
	done();
}));
