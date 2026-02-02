# 프로젝트 분석 보고서

## 1. 개요

이 프로젝트는 React, TypeScript, Vite로 구축된 모던한 단일 페이지 디지털 청첩장입니다. 아키텍처는 BaaS(Backend-as-a-Service) 모델을 따르며, 방명록 및 RSVP와 같은 실시간 데이터 기능을 위해 Google Firestore를, 대규모 사진 갤러리 호스팅을 위해 AWS S3를 활용합니다. 프론트엔드는 `App.tsx`에 의해 조율되는 모듈식 컴포넌트로 깔끔하게 구조화되어 있습니다. 주요 특징은 S3 버킷의 공개 XML 목록을 파싱하여 자격 증명 없이 사진을 가져오는 독창적인 방법입니다. 또한 이 프로젝트에는 이미지 EXIF 데이터를 읽고, 날짜별로 사진을 정렬하고, 썸네일을 생성하고, 모든 것을 S3에 업로드하여 갤러리 콘텐츠 관리를 간소화하는 자동화된 스크립트와 같은 정교한 개발자 도구가 포함되어 있습니다.

## 2. 분석 과정

- 프로젝트의 목적을 이해하기 위해 `README.md` 파일을 읽었지만 일반적인 템플릿임을 확인했습니다.
- 핵심 기술, 라이브러리 및 종속성을 식별하기 위해 `package.json`을 검사했습니다.
- 전체 애플리케이션 구조와 컴포넌트 구성을 이해하기 위해 `App.tsx`를 분석하여 단일 페이지 애플리케이션임을 확인했습니다.
- 데이터베이스 백엔드로 Google Firestore를 사용하는 것을 확인하기 위해 `lib/firebase.ts`를 읽었습니다.
- 애플리케이션이 사진 저장을 위해 AWS S3와 어떻게 상호 작용하는지 이해하기 위해 `lib/s3.ts`를 읽었고, 공개 XML 목록을 파싱하는 것을 발견했습니다.
- Firestore에서 데이터를 가져오고 제출하는 방법을 확인하기 위해 `hooks/useGuestBook.ts`를 조사했으며, 실시간 리스너 사용에 주목했습니다.
- 이미지 처리 및 EXIF 데이터 추출을 포함하여 사진을 관리하고 업로드하는 개발자 워크플로우를 이해하기 위해 `scripts/upload-photos-auto.ts`를 분석했습니다.

## 3. 주요 아키텍처 파일

### `/Users/hwang-injun/dev/our-wedding/package.json`

- **이유:** 프론트엔드 프레임워크(React, Vite), 백엔드 서비스(Firebase, AWS SDK), 스타일링(Tailwind CSS) 및 사용자 정의 개발자 스크립트(`upload:auto`)를 포함한 전체 기술 스택을 정의합니다. 프로젝트의 구성 요소를 이해하기 위한 기본 소스입니다.
- **주요 심볼:** `dependencies`, `devDependencies`, `scripts`

### `/Users/hwang-injun/dev/our-wedding/App.tsx`

- **이유:** 전체 단일 페이지 애플리케이션의 진입점이자 레이아웃 역할을 하는 메인 컴포넌트입니다. 모든 다른 기능 컴포넌트가 최종 사용자 경험을 형성하기 위해 어떻게 조립되는지 보여줍니다.
- **주요 심볼:** `Hero`, `PhotoGallery`, `GuestBook`, `RSVP`

### `/Users/hwang-injun/dev/our-wedding/lib/firebase.ts`

- **이유:** Google Firebase에 대한 연결을 구성하고 초기화합니다. Firestore 데이터베이스 인스턴스(`db`)를 명시적으로 내보내어 방명록 메시지 및 RSVP와 같은 구조화된 데이터의 백엔드 역할을 확인합니다.
- **주요 심볼:** `initializeApp`, `getFirestore`

### `/Users/hwang-injun/dev/our-wedding/lib/s3.ts`

- **이유:** 이 파일은 AWS S3에서 사진 URL을 검색하는 로직을 포함합니다. 클라이언트에서 SDK 명령을 사용하는 대신 S3 버킷의 공개 XML 목록을 가져오는 독특한 방식을 사용하여 자격 증명을 노출하지 않고 이미지 자산을 처리하는 핵심 아키텍처 결정입니다.
- **주요 심볼:** `listS3Objects`

### `/Users/hwang-injun/dev/our-wedding/hooks/useGuestBook.ts`

- **이유:** 이 사용자 정의 훅은 방명록 기능에 대한 모든 비즈니스 로직을 캡슐화합니다. Firestore에서 실시간 데이터 가져오기 및 새 항목 제출을 포함하여 주요 대화형 컴포넌트의 데이터 흐름을 보여줍니다. 앱이 동적 데이터를 관리하는 방법을 대표합니다.
- **주요 심볼:** `useGuestBook`, `onSnapshot`, `addDoc`

### `/Users/hwang-injun/dev/our-wedding/scripts/upload-photos-auto.ts`

- **이유:** 이 스크립트는 프로젝트 콘텐츠 관리 아키텍처의 중요한 부분을 보여줍니다. 사진 준비(EXIF 읽기, 크기 조정, 썸네일 생성) 및 S3 업로드의 전체 프로세스를 자동화하여 개발자가 갤러리 콘텐츠를 채우고 유지하는 방법을 보여줍니다.
- **주요 심볼:** `S3Client`, `execSync`, `exiftool`, `magick`

test message
