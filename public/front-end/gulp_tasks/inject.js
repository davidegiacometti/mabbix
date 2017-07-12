const gulp = require('gulp');
const browserSync = require('browser-sync');
const wiredep = require('wiredep').stream;
const angularFilesort = require('gulp-angular-filesort');
const gulpInject = require('gulp-inject');

const conf = require('../conf/gulp.conf');

gulp.task('inject', inject);

function inject() {
  const injectScripts = gulp.src([
    conf.path.tmp('**/*.js'),
    `!${conf.path.tmp('**/*.spec.js')}`
  ])
      .pipe(angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  const injectStyle = gulp.src([
    conf.path.tmp('**/*.css'),
    //`!${conf.path.tmp('**/*.spec.js')}`
  ]);  

  const injectOptions = {
    ignorePath: [conf.paths.src, conf.paths.tmp],
    addRootSlash: false
  };

    gulp.src([
      'bower_components/material-design-icons/sprites/svg-sprite/*.svg',
      'src/assets/**'
      ])
        .pipe(gulp.dest(conf.paths.assets_serve));

  return gulp.src(conf.path.src('index.html'))
    .pipe(gulpInject(injectScripts, injectOptions))
    .pipe(gulpInject(injectStyle, injectOptions))
    .pipe(wiredep(Object.assign({}, conf.wiredep)))
    .pipe(gulp.dest(conf.paths.tmp))
    .pipe(browserSync.stream());
}
