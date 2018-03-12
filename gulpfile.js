var gulp = require("gulp");

gulp.task("install-pre-commit-hook", function() {
  gulp.src("hooks/tslint-pre-commit").pipe(gulp.dest(".git/hooks"));
});

gulp.task("default", ["install-pre-commit-hook"]);
