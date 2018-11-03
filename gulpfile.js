const del = require("del");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const tslint = require("gulp-tslint");
const typescript = require("gulp-typescript");

const ts_project = typescript.createProject("tsconfig.json");

gulp.task("build", function () {
  return gulp.src("src/**/*.ts")
      .pipe(ts_project())
      .pipe(gulp.dest("build/"));
});

gulp.task("clean", function () {
  return del([
    "build/",
    "log/"
  ]);
});

gulp.task("lint:javascript", function () {
  return gulp.src("src/**/*.js")
      .pipe(eslint(".eslintrc"))
      .pipe(eslint.failAfterError());
});

gulp.task("lint:typescript", function () {
  return gulp.src("src/**/*.ts")
      .pipe(tslint({ configuration: "tslint.json" }))
      .pipe(tslint.default.report({
        summarizeFailureOutput: true,
        emitError: true
      }));
});

gulp.task("lint", ["lint:javascript", "lint:typescript"]);
gulp.task("default", ["build"]);
