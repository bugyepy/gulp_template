const gulp = require(`gulp`);
const sass = require(`gulp-dart-sass`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const glob = require(`gulp-sass-glob`);
const plumber = require(`gulp-plumber`);
const notify = require(`gulp-notify`);
const uglify = require(`gulp-uglify`);
const rename = require(`gulp-rename`);
const pug = require(`gulp-pug`);
const browserSync = require(`browser-sync`);

const paths = {
  // ROOT
  root: `./dist/`,

  // 格納先
  src: {
    pug: `./src/pug/**/*.pug`,
    scss: `./src/assets/scss/**/*.scss`,
    js: `./src/assets/js/**/*.js`,
  },

  // 出力先
  dist: {
    css: `./dist/assets/css/`,
    js: `./dist/assets/js/`,
  }
};

gulp.task(`sass`, function () {
  return gulp.src(paths.src.scss)
    .pipe(
      plumber({
        errorHandler: notify.onError(`Error: <%= error.message %>`), //<-
      })
    )
    .pipe(glob())
    .pipe(
      sass({
        outputStyle: `compressed`,
      })
    )
    .pipe(postcss([
      autoprefixer({
        cascade: false,
        grid: true
      })
    ]))
    .pipe(gulp.dest(paths.dist.css));
});

gulp.task(`js`, function () {
  return gulp.src(paths.src.js)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(gulp.dest(paths.dist.js));
});

// PUGのコンパイル
gulp.task(`pug`, function () {
  return gulp.src([paths.src.pug, `!./src/pug/**/_*.pug`])
    .pipe(
      pug({
        pretty: true,
        basedir: `./src/pug`,
      })
    )
    .pipe(gulp.dest(paths.root));
});

// browser-sync
gulp.task(`browser-sync`, () => {
  return browserSync.init({
    server: {
      baseDir: paths.root,
    },
    port: 8080,
    reloadOnRestart: true,
  });
});

// browser-sync のリロード
gulp.task(`reload`, (done) => {
  browserSync.reload();
  done();
});

// watchタスク
gulp.task(`watch`, (done) => {
  gulp.watch([paths.src.scss], gulp.series(`sass`, `reload`));
  gulp.watch([paths.src.js], gulp.series(`js`, `reload`));
  gulp.watch([paths.src.pug], gulp.series(`pug`, `reload`));
  done();
});
gulp.task(`default`, gulp.parallel(`watch`, `browser-sync`));
