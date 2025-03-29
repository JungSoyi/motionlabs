<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# motionlabs

모션랩스 백엔드 채용 과제

## 환경 요구사항

- Docker 및 Docker Compose
- 또는 Node.js와 NestJS Framework (로컬 실행 시)

### Docker를 이용한 실행 방법

1. **저장소 클론**

```bash
git clone [repository-url]
```

2. **Docker Compose로 실행**

```bash
docker compose up
```

이 명령어로 필요한 모든 서비스(애플리케이션, 데이터베이스 등)가 자동으로 구성되고 실행됩니다.
백그라운드 실행을 원하시면 docker compose up -d 명령어를 사용하세요.

### 로컬 환경에서 실행 방법 (Docker 없이)

1. **의존성 설치**

```bash
npm install
```

2. **환경 변수 설정**

- .env 파일에 데이터베이스 연결 정보 설정

3. **애플리케이션 실행**

```bash
npm run start:dev
```

## 3. 설명 및 벤치마크 결과

### 주요 기능

1. **환자 데이터 관리**

- 엑셀 파일을 통한 환자 데이터 업로드
- 데이터 유효성 검증 및 중복 제거
- 페이지네이션 기반 환자 목록 조회
- 이름/전화번호 기반 검색 기능

2. **API 엔드포인트**

- POST /patient/upload: 환자 데이터 엑셀 파일 업로드
- GET /patient: 환자 목록 조회 (페이지네이션, 검색 지원)

3. **데이터 검증**

- 엑셀 파일 형식 검증
- 필수 필드 검증
- 데이터 형식 검증

## 기술 스택

- Backend: `NestJS`, `TypeScript`
- 문서화: `Swagger`
- 파일 처리: `Multer`
- 데이터 검증: `Class-validator`
- 컨테이너화: `Docker`, `Docker Compose`

### API 문서

Swagger UI를 통해 API 문서 확인 가능 (http://localhost:3000/api-docs)

### 성능 및 제한사항

- 페이지당 기본 데이터 수: 기본값 설정 필요
- 파일 업로드 제한: xlsx 형식만 지원
- 검색 성능: 인덱스 사용으로 최적화
