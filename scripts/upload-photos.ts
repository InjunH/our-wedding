#!/usr/bin/env npx ts-node

/**
 * 시간대별 사진 업로드 스크립트
 *
 * 사용법:
 *   npx ts-node scripts/upload-photos.ts <사진폴더경로> <년-월>
 *
 * 예시:
 *   npx ts-node scripts/upload-photos.ts ~/Desktop/첫만남사진 2023-04
 *   npx ts-node scripts/upload-photos.ts ./photos/여행 2023-08
 *
 * 업로드 위치:
 *   history/2023-04/사진파일명.jpg
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// ESM에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 파일 로드
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// S3 설정 (.env에서 읽기)
const BUCKET_NAME = process.env.VITE_AWS_S3_BUCKET || 'nuri-injun-wedding-card';
const REGION = process.env.VITE_AWS_REGION || 'ap-northeast-2';
const ACCESS_KEY_ID = process.env.VITE_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.VITE_AWS_SECRET_ACCESS_KEY;

// 지원하는 이미지 확장자
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic'];

// MIME 타입 매핑
const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.heic': 'image/heic',
};

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
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Body: fileContent,
    ContentType: contentType,
  });

  await s3Client.send(command);
}

// 년-월 형식 검증
function validatePeriod(period: string): boolean {
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  return regex.test(period);
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

// 메인 함수
async function main() {
  // AWS 자격 증명 확인
  if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    console.error(`
오류: AWS 자격 증명이 설정되지 않았습니다.

.env 파일에 다음 값들이 있는지 확인하세요:
  VITE_AWS_ACCESS_KEY_ID=...
  VITE_AWS_SECRET_ACCESS_KEY=...
`);
    process.exit(1);
  }

  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║         시간대별 사진 업로드 스크립트                        ║
╚════════════════════════════════════════════════════════════╝

사용법:
  npx ts-node scripts/upload-photos.ts <사진폴더경로> <년-월>

예시:
  npx ts-node scripts/upload-photos.ts ~/Desktop/첫만남사진 2023-04
  npx ts-node scripts/upload-photos.ts ./photos/여행 2023-08

년-월 형식:
  2023-04  →  2023년 4월
  2023-12  →  2023년 12월
  2024-01  →  2024년 1월

업로드 위치:
  S3: history/2023-04/파일명.jpg
`);
    process.exit(1);
  }

  const [sourcePath, period] = args;
  const resolvedPath = path.resolve(sourcePath);

  // 년-월 형식 검증
  if (!validatePeriod(period)) {
    console.error(`\n오류: 년-월 형식이 올바르지 않습니다.`);
    console.error(`올바른 형식: 2023-04, 2024-01 등 (YYYY-MM)`);
    process.exit(1);
  }

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

  // 업로드 정보 출력
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                     업로드 정보                              ║
╚════════════════════════════════════════════════════════════╝

  소스 폴더: ${resolvedPath}
  시간대: ${period}
  S3 버킷: ${BUCKET_NAME}
  업로드 경로: history/${period}/

  발견된 이미지 파일 (${imageFiles.length}개):
`);

  imageFiles.forEach((file, index) => {
    const filename = path.basename(file);
    console.log(`    ${index + 1}. ${filename}`);
  });

  console.log('');

  // 확인 받기
  const confirmed = await askConfirmation('업로드를 진행하시겠습니까? (y/n): ');
  if (!confirmed) {
    console.log('\n업로드가 취소되었습니다.');
    process.exit(0);
  }

  console.log('\n업로드 시작...\n');

  // 업로드 진행
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const filePath = imageFiles[i];
    const filename = path.basename(filePath);
    const s3Key = `history/${period}/${filename}`;

    process.stdout.write(`  [${i + 1}/${imageFiles.length}] ${filename}... `);

    try {
      await uploadFile(filePath, s3Key);
      console.log('✓');
      successCount++;
    } catch (error) {
      console.log('✗');
      console.error(`      오류: ${(error as Error).message}`);
      failCount++;
    }
  }

  // 결과 출력
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                     업로드 완료                              ║
╚════════════════════════════════════════════════════════════╝

  성공: ${successCount}개
  실패: ${failCount}개

  S3 URL 예시:
  https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/history/${period}/${path.basename(imageFiles[0])}
`);
}

main().catch((error) => {
  console.error('예상치 못한 오류:', error);
  process.exit(1);
});
