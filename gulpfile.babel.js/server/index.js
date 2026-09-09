const { watch, series, parallel } = require('gulp');
const browser = require('browser-sync');
const { get } = browser;
const { minifyJS,concatLibsJS } = require('../js');
const { compileSCSS, concatLibsCSS } = require('../css');
const { generateImages, spriteSvg, generateSprite, spriteSvgMove, generateSVG } = require('../images');
const { generateHTML, setHTML } = require('../html');
const { swipeJS, swipeFont, swipeCSS, swipeHTML } = require('../swipe');
const { cloneFontFolder } = require('../clone');
const config = require('../../config.json');
const browsersync = browser.create('My server');

// Server
const browserSyncSetting = {
    server: {
        baseDir: 'dist/',
        index  : 'index.html'
    },
    port: 3030,
    open: true
};

// Browser-Sync
const launchServer = (done) => {
    if (browsersync) browsersync.init(browserSyncSetting);
    done();
}
// Server-reload
const browserSyncReload = (done) => {
  get('My server').reload();
  done();
}
// Watch
const watchingResources = (done) => {
    watch(config.jsSetting.src, series(swipeJS, concatLibsJS, minifyJS, browserSyncReload));
    watch(config.fontsSetting.src, series(swipeFont, cloneFontFolder, browserSyncReload));
    watch(config.imgSetting.apartWatchSrc, series(parallel(spriteSvg, generateSprite),spriteSvgMove));
    watch(config.imgSetting.svg, series(generateSVG));
    watch(config.imgSetting.watchSrc, series(generateImages, browserSyncReload));
    watch(config.htmlSetting.src, series(swipeHTML, parallel(setHTML), generateHTML, browserSyncReload));
    watch(config.cssSetting.src, series(swipeCSS, parallel(concatLibsCSS, compileSCSS), browserSyncReload));
    done();
}
module.exports = {
  launchServer,
  browserSyncReload,
  watchingResources
};