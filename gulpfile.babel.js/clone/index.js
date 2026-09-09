const { src, dest } = require('gulp');
const newer = require('gulp-newer');
const config = require('../../config.json');

// Clone files in root
const cloneRoot = () =>
  src([config.dir.src + '*.*', '!src/*.html'])
  .pipe(dest(config.dir.dist))

const cloneFontFolder = () =>
  src(config.fontsSetting.src)
  .pipe(newer(config.fontsSetting.dist))
  .pipe(dest(config.fontsSetting.dist))

module.exports={
  cloneRoot,
  cloneFontFolder
}