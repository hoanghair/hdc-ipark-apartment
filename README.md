# [HDC] 아이파크
http://iuidev.pages.hivelab.co.kr/hdc-ipark/@index.html

## Setup

- npm
- gulp4
- Node v20.x (20.18.0 이상 권장)

## Install

### nvm

- nvm 사용
- .nvmrc 파일에 버전 명시

```bash
$ nvm use 20.18.0
```

## Run & Build

### 1. Run install

```bash
$ npm install
```

### 2. Run

```bash
$ gulp
```

### 3. Build

```bash
$ gulp build
```

### 4. Deployment
- deploy 실행시, build와 master 브랜치로의 deploy가 함께 진행

```bash
$ gulp deploy --message "deploy commit message"
```
