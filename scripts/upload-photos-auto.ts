#!/usr/bin/env npx ts-node

/**
 * EXIF 날짜 기반 자동 분류 업로드 스크립트 (썸네일 + 원본)
 *
 * 사용법:
 *   npm run upload:auto <사진폴더경로>
 *
 * 예시:
 *   npm run upload:auto ~/Downloads/wedding-photos-all
 *
 * 동작:
 *   1. 폴더 내 모든 사진의 EXIF 날짜 읽기
 *   2. 년-월 별로 자동 그룹화
 *   3. 썸네일 (300px) + 원본 (1920px) 생성
 *   4. history/YYYY-MM/ 폴더로 업로드
 *   5. 날짜 없는 파일은 별도 폴더로 이동
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// ESM에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 파일 로드
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// S3 설정
const BUCKET_NAME = process.env.VITE_AWS_S3_BUCKET || 'nuri-injun-wedding-card';
const REGION = process.env.VITE_AWS_REGION || 'ap-northeast-2';
const ACCESS_KEY_ID = process.env.VITE_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.VITE_AWS_SECRET_ACCESS_KEY;

// 이미지 크기 설정
const THUMBNAIL_WIDTH = 300;
const FULL_MAX_WIDTH = 1920;

// 지원하는 이미지 확장자
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic'];

// S3 클라이언트 생성
const s3Client = new S3Client({
  region: REGION,
  credentials: ACCESS_KEY_ID && SECRET_ACCESS_KEY ? {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  } : undefined,
});

// 이미지 파일인지 확인
function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
}

// exiftool로 EXIF 날짜 읽기
function getExifDate(filePath: string): Date | null {
  try {
    const result = execSync(`exiftool -DateTimeOriginal -s3 "${filePath}"`, { encoding: 'utf-8' }).trim();
    if (result) {
      const [datePart, timePart] = result.split(' ');
      const [year, month, day] = datePart.split(':').map(Number);
      const [hour, minute, second] = (timePart || '00:00:00').split(':').map(Number);
      const date = new Date(year, month - 1, day, hour, minute, second);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  } catch {
    try {
      const result = execSync(`exiftool -CreateDate -s3 "${filePath}"`, { encoding: 'utf-8' }).trim();
      if (result) {
        const [datePart, timePart] = result.split(' ');
        const [year, month, day] = datePart.split(':').map(Number);
        const [hour, minute, second] = (timePart || '00:00:00').split(':').map(Number);
        const date = new Date(year, month - 1, day, hour, minute, second);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    } catch {
      // 무시
    }
  }
  return null;
}

// 이미지 리사이즈 (ImageMagick 사용)
function resizeImage(inputPath: string, outputPath: string, maxWidth: number): boolean {
  try {
    // HEIC 파일은 JPG로 변환
    const ext = path.extname(inputPath).toLowerCase();
    const finalOutput = ext === '.heic' ? outputPath.replace(/\.heic$/i, '.jpg') : outputPath;

    execSync(`magick "${inputPath}" -resize "${maxWidth}x>" -quality 85 "${finalOutput}"`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(`    리사이즈 실패: ${(error as Error).message}`);
    return false;
  }
}

// 폴더 내 이미지 파일 목록 가져오기
function getImageFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    throw new Error(`폴더를 찾을 수 없습니다: ${dirPath}`);
  }

  const files = fs.readdirSync(dirPath);
  return files
    .filter(isImageFile)
    .map(file => path.join(dirPath, file));
}

// 파일을 S3에 업로드
async function uploadFile(filePath: string, s3Key: string): Promise<void> {
  const fileContent = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Body: fileContent,
    ContentType: 'image/jpeg',
  });

  await s3Client.send(command);
}

// 사용자 확인 받기
async function askConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

interface PhotoGroup {
  period: string;
  files: Array<{ path: string; date: Date }>;
}

// 메인 함수
async function main() {
  // AWS 자격 증명 확인
  if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    console.error(`오류: AWS 자격 증명이 설정되지 않았습니다.`);
    process.exit(1);
  }

  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║   EXIF 자동 분류 업로드 (썸네일 + 원본)                      ║
╚════════════════════════════════════════════════════════════╝

사용법:
  npm run upload:auto <사진폴더경로>

예시:
  npm run upload:auto ~/Downloads/wedding-photos-all

동작:
  1. EXIF 날짜 기반으로 자동 분류
  2. 썸네일 (${THUMBNAIL_WIDTH}px) + 원본 (${FULL_MAX_WIDTH}px) 생성
  3. history/YYYY-MM/ 폴더로 업로드
  4. 날짜 없는 파일은 별도 폴더로 이동
`);
    process.exit(1);
  }

  const [sourcePath] = args;
  const resolvedPath = path.resolve(sourcePath);

  // 임시 폴더 생성
  const tempDir = path.join(resolvedPath, '_temp_resize');
  const noDateDir = path.join(resolvedPath, '_no_date');

  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  if (!fs.existsSync(noDateDir)) fs.mkdirSync(noDateDir, { recursive: true });

  // 이미지 파일 목록 가져오기
  let imageFiles: string[];
  try {
    imageFiles = getImageFiles(resolvedPath);
  } catch (error) {
    console.error(`\n오류: ${(error as Error).message}`);
    process.exit(1);
  }

  if (imageFiles.length === 0) {
    console.error(`\n오류: ${resolvedPath}에 이미지 파일이 없습니다.`);
    process.exit(1);
  }

  console.log(`\n📷 ${imageFiles.length}개의 이미지 파일 발견\n`);
  console.log('EXIF 날짜 분석 중...\n');

  // EXIF 날짜 읽기 및 그룹화
  const groups = new Map<string, PhotoGroup>();
  const noDateFiles: string[] = [];

  for (let i = 0; i < imageFiles.length; i++) {
    const filePath = imageFiles[i];
    const filename = path.basename(filePath);

    process.stdout.write(`\r  분석 중... ${i + 1}/${imageFiles.length}`);

    const date = getExifDate(filePath);

    if (date) {
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!groups.has(period)) {
        groups.set(period, { period, files: [] });
      }
      groups.get(period)!.files.push({ path: filePath, date });
    } else {
      noDateFiles.push(filePath);
    }
  }

  console.log('\n\n');

  // 결과 출력
  const sortedPeriods = Array.from(groups.keys()).sort();

  console.log(`╔════════════════════════════════════════════════════════════╗
║                     분석 결과                                ║
╚════════════════════════════════════════════════════════════╝
`);

  let totalWithDate = 0;
  for (const period of sortedPeriods) {
    const group = groups.get(period)!;
    console.log(`  📁 ${period}: ${group.files.length}개`);
    totalWithDate += group.files.length;
  }

  console.log(`
  ────────────────────────────────────
  ✅ EXIF 날짜 있음: ${totalWithDate}개 → 업로드 예정
  ❌ EXIF 날짜 없음: ${noDateFiles.length}개 → _no_date 폴더로 이동
`);

  if (totalWithDate === 0) {
    console.error('업로드할 파일이 없습니다.');
    process.exit(1);
  }

  // 날짜 없는 파일 이동
  if (noDateFiles.length > 0) {
    console.log(`날짜 없는 ${noDateFiles.length}개 파일을 _no_date 폴더로 이동 중...`);
    for (const filePath of noDateFiles) {
      const filename = path.basename(filePath);
      const destPath = path.join(noDateDir, filename);
      fs.renameSync(filePath, destPath);
    }
    console.log('완료\n');
  }

  // 확인 받기
  const confirmed = await askConfirmation(`${totalWithDate}개 파일을 업로드하시겠습니까? (y/n): `);
  if (!confirmed) {
    console.log('\n업로드가 취소되었습니다.');
    process.exit(0);
  }

  console.log('\n처리 시작...\n');

  // 업로드 진행
  let successCount = 0;
  let failCount = 0;
  let currentFile = 0;

  for (const period of sortedPeriods) {
    const group = groups.get(period)!;
    console.log(`\n📁 ${period} (${group.files.length}개)`);

    for (const { path: filePath } of group.files) {
      currentFile++;
      const filename = path.basename(filePath);
      const baseName = filename.replace(/\.[^.]+$/, '');
      const outputName = `${baseName}.jpg`;

      process.stdout.write(`  [${currentFile}/${totalWithDate}] ${filename.substring(0, 30)}... `);

      try {
        // 1. 썸네일 생성
        const thumbPath = path.join(tempDir, `thumb_${outputName}`);
        const thumbSuccess = resizeImage(filePath, thumbPath, THUMBNAIL_WIDTH);

        // 2. 원본 리사이즈
        const fullPath = path.join(tempDir, outputName);
        const fullSuccess = resizeImage(filePath, fullPath, FULL_MAX_WIDTH);

        if (!thumbSuccess || !fullSuccess) {
          throw new Error('리사이즈 실패');
        }

        // 3. S3 업로드
        const thumbKey = `history/${period}/thumb/${outputName}`;
        const fullKey = `history/${period}/${outputName}`;

        await uploadFile(thumbPath, thumbKey);
        await uploadFile(fullPath, fullKey);

        // 4. 임시 파일 삭제
        fs.unlinkSync(thumbPath);
        fs.unlinkSync(fullPath);

        console.log('✓');
        successCount++;
      } catch (error) {
        console.log('✗');
        console.error(`      ${(error as Error).message}`);
        failCount++;
      }
    }
  }

  // 임시 폴더 정리
  try {
    fs.rmdirSync(tempDir);
  } catch {
    // 무시
  }

  // 결과 출력
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                     업로드 완료                              ║
╚════════════════════════════════════════════════════════════╝

  성공: ${successCount}개
  실패: ${failCount}개
  날짜 없음 (이동됨): ${noDateFiles.length}개 → _no_date/

  S3 구조:
    history/${sortedPeriods[0]}/
      ├── thumb/xxx.jpg  (${THUMBNAIL_WIDTH}px 썸네일)
      └── xxx.jpg        (${FULL_MAX_WIDTH}px 원본)
`);
}

main().catch((error) => {
  console.error('예상치 못한 오류:', error);
  process.exit(1);
});
