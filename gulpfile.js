const gulp = require('gulp');
let status = 'dev';
gulp.task('b', () => {
    require('./gulp/b')(status);
});
gulp.task('c', () => {
    require('./gulp/c')(status);
});
gulp.task('prod:b', () => {
    status = 'prod';
    gulp.start('b');
});
gulp.task('prod:c', () => {
    status = 'prod';
    gulp.start('c');
});
