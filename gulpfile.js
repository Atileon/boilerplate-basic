var gulp = require("gulp");
var uglify = require("gulp-uglify");
var liverelaod = require("gulp-livereload");
var concat = require("gulp-concat");
var minifyCss = require("gulp-minify-css");
var autoprefixer = require("gulp-autoprefixer");
var plumber = require("gulp-plumber");
var sourcemaps = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var babel = require("gulp-babel");
// Image compression
var imagemin = require("gulp-imagemin");
var jpgRecompress = require("imagemin-jpeg-recompress");
//Files paths
var INDEX_HTML = "public/index.html";
var IMAGES_PATH = "public/images/*";
var DIST_PATH = "public/dist";
var SCRIPTS_PATH = "public/scripts/**/*.js";
var STYLES_PATH = "public/css/**/*.css";
var SCSS_PATH = "public/scss/**/*.scss";

//HTML
gulp.task("html", function() {
  console.log("Starting html task");
  return gulp
    .src(INDEX_HTML)
    .pipe(
      plumber(function(err) {
        console.log("html task error");
        console.log(err);
        this.emit("end");
      })
    )
    .pipe(gulp.dest(DIST_PATH))
    .pipe(liverelaod());
});
// Styles
// gulp.task("styles", function() {
//   console.log("starting styles task");
//   return (
//     gulp
//       .src(["public/css/reset.css", STYLES_PATH])
//       .pipe(
//         plumber(function(err) {
//           console.log("Styles task error ");
//           console.log(err);
//           this.emit("end");
//         })
//       )
//       .pipe(sourcemaps.init())
//       .pipe(autoprefixer())
//       .pipe(concat("styles.css"))
//       // .pipe(minifyCss())
//       .pipe(sourcemaps.write())
//       .pipe(gulp.dest(DIST_PATH))
//       .pipe(liverelaod())
//   );
// });

// SCSS
gulp.task("scss", function() {
  console.log("starting scss task");
  return gulp
    .src("public/scss/styles.scss")
    .pipe(
      plumber(function(err) {
        console.log("Styles task error ");
        console.log(err);
        this.emit("end");
      })
    )
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(
      sass({
        // outputStyle: "compressed"
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH + "/css/"))
    .pipe(liverelaod());
});

//Scripts
gulp.task("scripts", function() {
  console.log("Starting scripts task");

  return gulp
    .src(SCRIPTS_PATH)
    .pipe(
      plumber(function(err) {
        console.log("Scripts Task Error");
        console.log(err);
        this.emit("end");
      })
    )
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["env"]
      })
    )
    .pipe(uglify())
    .pipe(concat("scripts.js"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH + "/scripts/"))
    .pipe(liverelaod());
});
//Images

gulp.task("images", function() {
  console.log("Starting images task");
  return gulp
    .src(IMAGES_PATH)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
        }),
        jpgRecompress()
      ])
    )
    .pipe(gulp.dest(DIST_PATH + "/images/"));
});

//Default task

gulp.task("default", ["html", "images", "scss", "scripts"], function() {
  console.log("Starting default task");
});

//Watch
gulp.task("watch", ["default"], function() {
  console.log("Starting watch task");
  require("./server");
  liverelaod.listen();
  gulp.watch(INDEX_HTML, ["html"]);
  gulp.watch(SCRIPTS_PATH, ["scripts"]);
  gulp.watch(SCSS_PATH, ["scss"]);
});
