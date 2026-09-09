const {src} = require('gulp');
const ghPages = require('gulp-gh-pages');
const gitRepoInfo = require('git-repo-info');
const config = require('../../config.json');

let info = gitRepoInfo();

const deployMessage = () => {
  let i = process.argv.indexOf("--message");
  return i !== -1 ? process.argv[i+1] : false
}

const sourceDeploy = () => 
  src([
    `${config.dir.dist}**/*`,
    `./.gitlab-ci.yml`,
  ])
  .pipe(ghPages({
    branch: 'master',
    message: deployMessage() ? `[DEPLOY] ${deployMessage()}` : `[DEPLOY] ${info.commitMessage}`
  }))

module.exports={
  sourceDeploy
}