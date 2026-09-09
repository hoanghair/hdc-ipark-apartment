const del = require('del');
const config = require('../../config.json');

// Swipe Dist Folder
const swipeDist = () =>
    del([config.dir.dist])

// Swipe JS Dist Folder
const swipeJS = () =>
    del([config.jsSetting.dist])

// Swipe Font Dist Folder
const swipeFont = () =>
    del([config.fontsSetting.dist])

// Swipe HTML Dist Folder
const swipeHTML = () =>
    del([config.htmlSetting.dist])

// Swipe CSS Dist Folder
const swipeCSS = () =>
    del([config.cssSetting.dist])


module.exports = {
  swipeDist,
  swipeJS,
  swipeFont,
  swipeHTML,
  swipeCSS
};