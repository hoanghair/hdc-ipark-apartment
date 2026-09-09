const { src, dest } = require('gulp');
const fs = require('fs-extra');
const cheerio = require('cheerio');
const newer = require('gulp-newer');
const htmlhint = require('gulp-htmlhint');
const ejs = require('gulp-ejs');
const beautify = require('gulp-jsbeautifier');
const config = require('../../config.json');

function setHTML() {
  return src([config.htmlSetting.src, '!' + config.htmlSetting.except])
    .pipe(newer(config.htmlSetting.dist))
    .pipe(ejs())
    .pipe(htmlhint('templates/htmlhint.json'))
    .pipe(htmlhint.reporter())
    .pipe(
      beautify({
        config: '.jsbeautifyrc',
        mode: 'VERIFY_AND_WRITE',
      })
    )
    .pipe(dest(config.dir.dist));
}

// 날짜 포맷 함수
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 파일 상태 자동 판단 함수
const getFileStatus = (stats) => {
  const birthDate = formatDate(stats.birthtime); // 생성 날짜
  const modifiedDate = formatDate(stats.mtime); // 수정 날짜

  // 생성 날짜와 수정 날짜가 같으면 new, 다르면 update
  return birthDate === modifiedDate ? 'new' : 'update';
};

const generateHTML = async (done) => {
  const dirPath = 'dist/views/';
  const files = await fs.promises.readdir(dirPath);
  const htmlFiles = files.filter((file) => file.endsWith('.html'));

  // 파일번호 정렬 함수
  const numberRegex = /\d+/g;
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  });
  const extractNumbers = (filename) =>
    (filename.match(numberRegex) || []).map((n) => parseInt(n, 10));

  htmlFiles.sort((a, b) => {
    const numsA = extractNumbers(a);
    const numsB = extractNumbers(b);
    if (numsA.length && numsB.length) {
      const len = Math.max(numsA.length, numsB.length);
      for (let i = 0; i < len; i++) {
        const va = numsA[i];
        const vb = numsB[i];
        if (va === undefined && vb === undefined) continue;
        if (va === undefined) return -1;
        if (vb === undefined) return 1;
        if (va !== vb) return va - vb;
      }
      return collator.compare(a, b);
    }
    if (numsA.length && !numsB.length) return -1;
    if (!numsA.length && numsB.length) return 1;
    return collator.compare(a, b);
  });

  let fileObjArr = [];
  let categories = [];
  let projectJson = JSON.parse(
    await fs.promises.readFile('templates/projectInfo.json', 'utf-8')
  );
  let projectInfo = {
    projectName: projectJson.project_name,
    projectAuthor: projectJson.author,
    projectOrg: projectJson.organization,
  };

  for (const file of htmlFiles) {
    const filePath = `${dirPath}${file}`;
    const stats = await fs.promises.stat(filePath);
    const fileInnerText = await fs.promises.readFile(filePath, 'utf8');
    const $ = cheerio.load(fileInnerText);
    let wholeTitle =
      $('meta[name="list"]').attr('content') || $('title').text();
    let splitTitle = wholeTitle.split(' : ');
    let pageStatus = $('body').data('pagestatus');
    let splitStatus = pageStatus ? pageStatus.split(' : ') : null;

    let fileData = {
      title: splitTitle[0],
      name: file,
      category: file.substring(0, 2),
      categoryText: splitTitle[1],
      listTitle: wholeTitle,
      mdate: stats.mtime,
    };

    // ✅ 상태 및 날짜 설정 로직
    let needsWrite = false;
    
    if (splitStatus && splitStatus[0] && splitStatus[1]) {
      // data-pagestatus에 "상태 : 날짜" 모두 있으면 → 그대로 사용
      fileData.splitStatus = splitStatus[0];
      fileData.splitStatusDate = splitStatus[1];
    } else if (splitStatus && splitStatus[0]) {
      // data-pagestatus에 "상태"만 있으면 → 상태는 그대로, 날짜는 기존 날짜 유지 (없으면 mtime 사용)
      fileData.splitStatus = splitStatus[0];
      fileData.splitStatusDate = splitStatus[1] || formatDate(stats.mtime);
    } else {
      // data-pagestatus 없으면 → 상태와 날짜 모두 자동
      // 단, 파일이 이미 생성된 경우 'update'로 고정 (초기 생성일만 'new')
      const autoStatus = getFileStatus(stats);
      fileData.splitStatus = autoStatus;
      // 'new'인 경우에만 생성일 사용, 'update'인 경우 mtime 사용
      fileData.splitStatusDate = autoStatus === 'new' 
        ? formatDate(stats.birthtime) 
        : formatDate(stats.mtime);
      
      // data-pagestatus가 없으면 자동으로 설정하여 다음 번에는 유지되도록 함
      if (!$('body').data('pagestatus')) {
        $('body').attr('data-pagestatus', `${autoStatus} : ${fileData.splitStatusDate}`);
        needsWrite = true;
      }
    }

    fileObjArr.push(fileData);
    if (!categories.includes(fileData.category))
      categories.push(fileData.category);

    // 파일 수정이 필요한 경우를 체크 (meta 제거 또는 data-pagestatus 자동 설정)
    if ($('meta[name="list"]').length) {
      $('meta[name="list"]').remove();
      needsWrite = true;
    }
    
    // 파일 수정이 필요한 경우 한 번만 쓰기
    if (needsWrite) {
      await fs.promises.writeFile(filePath, $.html({ decodeEntities: false }));
    }
  }

  let projectObj = {
    project: projectInfo,
    files: fileObjArr,
  };

  return src('templates/@index.html')
    .pipe(ejs(projectObj))
    .pipe(dest('dist/'))
    .on('end', done);
};

module.exports = {
  setHTML,
  generateHTML,
};
