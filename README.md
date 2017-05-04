# gulp-prepack-js

> gulp plugin to optimize JavaScript code with facebook [Prepack](https://prepack.io/)

## Install

```bash
npm i --save-dev gulp-prepack-js
```

## Usage

```javascript
const gulp = require('gulp');
const prepack = require('gulp-prepack-js');

gulp.task('js', function () {
    return gulp.src('js/*.js')
        .pipe(prepack({
            compatibility: 'browser',
            sourceMaps: true,
        }))
        .pipe(gulp.dest('dist'));
});
```

## Options

See the [`prepack` options](https://prepack.io/getting-started.html#options).