const BUCKET_NAME = 'nuri-injun-wedding-card';
const REGION = 'ap-northeast-2';
const BUCKET_URL = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com`;

export interface S3Object {
  key: string;
  lastModified: string;
  size: number;
  url: string;
}

export interface S3ListOptions {
  prefix?: string;
  thumbnailsOnly?: boolean;
  maxKeys?: number;
  marker?: string;
}

export interface S3ListResult {
  objects: S3Object[];
  isTruncated: boolean;
  nextMarker?: string;
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic'];

function isImageFile(key: string): boolean {
  const lowerKey = key.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lowerKey.endsWith(ext));
}

export async function listS3Objects(
  options: S3ListOptions = {}
): Promise<S3ListResult> {
  const {
    prefix = '',
    thumbnailsOnly = false,
    maxKeys = 1000,
    marker = undefined
  } = options;

  // URL 구성
  let url = `${BUCKET_URL}?prefix=${encodeURIComponent(prefix)}`;
  if (maxKeys) {
    url += `&max-keys=${maxKeys}`;
  }
  if (marker) {
    url += `&marker=${encodeURIComponent(marker)}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch S3 bucket: ${response.statusText}`);
  }

  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

  // 페이지네이션 정보 추출
  const isTruncated =
    xmlDoc.getElementsByTagName('IsTruncated')[0]?.textContent === 'true';
  const nextMarker =
    xmlDoc.getElementsByTagName('NextMarker')[0]?.textContent || undefined;

  const contents = xmlDoc.getElementsByTagName('Contents');
  const objects: S3Object[] = [];

  for (let i = 0; i < contents.length; i++) {
    const content = contents[i];
    const key = content.getElementsByTagName('Key')[0]?.textContent || '';
    const lastModified =
      content.getElementsByTagName('LastModified')[0]?.textContent || '';
    const size = parseInt(
      content.getElementsByTagName('Size')[0]?.textContent || '0',
      10
    );

    if (key && isImageFile(key)) {
      // 썸네일만 필터링
      if (thumbnailsOnly && !key.includes('/thumb/')) {
        continue;
      }

      objects.push({
        key,
        lastModified,
        size,
        url: `${BUCKET_URL}/${encodeURIComponent(key)}`,
      });
    }
  }

  // 정렬: 최신순
  const sortedObjects = objects.sort(
    (a, b) =>
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  );

  return {
    objects: sortedObjects,
    isTruncated,
    nextMarker
  };
}

export function getImageUrl(key: string): string {
  return `${BUCKET_URL}/${encodeURIComponent(key)}`;
}

/**
 * 썸네일 URL에서 원본 URL 도출
 * history/2024-04/thumb/photo.jpg → history/2024-04/photo.jpg
 * 인코딩된 URL도 처리: %2Fthumb%2F → %2F
 */
export function getThumbnailOriginalUrl(thumbnailUrl: string): string {
  return thumbnailUrl
    .replace('%2Fthumb%2F', '%2F')  // 인코딩된 경로
    .replace('/thumb/', '/');        // 일반 경로 (fallback)
}

/**
 * URL이 썸네일인지 확인
 */
export function isThumbnailUrl(url: string): boolean {
  return url.includes('/thumb/') || url.includes('%2Fthumb%2F');
}

/**
 * 원본 URL에서 썸네일 URL 생성
 * history/YYYY-MM/xxx.jpg -> history/YYYY-MM/thumb/xxx.jpg
 */
export function getThumbnailUrl(url: string): string {
  const match = url.match(/(history\/\d{4}-\d{2}\/)(.*)/);
  if (match) {
    return url.replace(match[0], `${match[1]}thumb/${match[2]}`);
  }
  return url;
}
