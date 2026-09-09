const {src, dest} = require('gulp');
const webpackStream = require('webpack-stream');
const concat = require('gulp-concat');
const config = require('../../config.json');
const concatLibsJS = () =>
  src(config.jsSetting.libsApps)
  .pipe(concat('libs.js'))
  .pipe(dest(config.jsSetting.dist))
const minifyJS = () =>
  src(config.jsSetting.srcApps)
  .pipe(webpackStream({
    mode: 'production',
    output: {
      filename: config.jsSetting.minifyFileName
    },
    optimization: {
      minimize: true,
      minimizer: [
        new (require('terser-webpack-plugin'))({
          terserOptions: {
            compress: {
              drop_console:false, // 콘솔로그 유지
              drop_debugger: true, // 디버거는 제거
              passes: 2 // 압축 패스 카운트
            }
          }
        })
      ]
    }
  }))
  .pipe(dest(config.jsSetting.dist))
module.exports={
  minifyJS,
  concatLibsJS
}