'use strict';
const {series, parallel } = require('gulp');
const { cloneRoot, cloneFontFolder } = require('./clone');
const { swipeDist } = require('./swipe');
const { setting } = require('./project');
const { minifyJS, concatLibsJS } = require('./js');
const { spriteSvg, generateSprite, generateImages, generateSVG, spriteSvgMove,delSvg } = require('./images');
const { concatLibsCSS, compileSCSS } = require('./css');
const { setHTML, generateHTML } = require('./html');
const { watchingResources, launchServer } = require('./server');
const { sourceDeploy } = require('./deploy');

const build = series(
  swipeDist,
  cloneRoot,
  parallel(generateImages, cloneFontFolder, concatLibsJS,minifyJS,concatLibsCSS),
  parallel(generateSVG, spriteSvg, generateSprite, setHTML),
  spriteSvgMove,
  delSvg,
  generateHTML,
  compileSCSS
);

const defaultTask = series(build, watchingResources, launchServer);
const deploy = series(build, sourceDeploy);

module.exports = {
  cloneRoot,
  setting,
  build,
  default: defaultTask,
  deploy
};