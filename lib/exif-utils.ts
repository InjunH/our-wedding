export interface ImageMetadata {
  url: string;
  dateTaken: Date | null;
}

// 폴더 경로에서 날짜 추출 시도 (예: history/2023-04/, history/2024-01/)
const extractDateFromFolderPath = (url: string): Date | null => {
  const decodedUrl = decodeURIComponent(url);

  // 패턴: history/2023-04/ 또는 /history/2023-04/
  const folderPattern = decodedUrl.match(/history\/(\d{4})[-_]?(0[1-9]|1[0-2])\//);
  if (folderPattern) {
    const [, year, month] = folderPattern;
    // 해당 월의 중간일(15일)로 설정
    const date = new Date(parseInt(year), parseInt(month) - 1, 15);
    if (!isNaN(date.getTime()) && date.getFullYear() >= 2020) {
      return date;
    }
  }

  return null;
};

// 파일명에서 날짜 추출 시도 (예: IMG_20231225_143000.jpg, 2023-12-25_photo.jpg 등)
const extractDateFromFilename = (url: string): Date | null => {
  const filename = decodeURIComponent(url.split('/').pop() || '');

  // 패턴 1: IMG_20231225_143000 또는 20231225_143000
  const pattern1 = filename.match(/(\d{4})(\d{2})(\d{2})[_-]?(\d{2})?(\d{2})?(\d{2})?/);
  if (pattern1) {
    const [, year, month, day, hour, minute, second] = pattern1;
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour || '0'),
      parseInt(minute || '0'),
      parseInt(second || '0')
    );
    if (!isNaN(date.getTime()) && date.getFullYear() >= 2020) {
      return date;
    }
  }

  // 패턴 2: 2023-12-25 또는 2023_12_25
  const pattern2 = filename.match(/(\d{4})[-_](\d{2})[-_](\d{2})/);
  if (pattern2) {
    const [, year, month, day] = pattern2;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (!isNaN(date.getTime()) && date.getFullYear() >= 2020) {
      return date;
    }
  }

  return null;
};

// 폴더 경로 또는 파일명에서 날짜 추출
// 우선순위: 1. 폴더 경로 (history/2023-04/) 2. 파일명
export const getImageDateTaken = (url: string): Promise<Date | null> => {
  return new Promise((resolve) => {
    // 1. 폴더 경로에서 날짜 추출 시도
    const folderDate = extractDateFromFolderPath(url);
    if (folderDate) {
      console.log(`[Folder] ${decodeURIComponent(url.split('/').slice(-2).join('/'))}: ${folderDate.toISOString()}`);
      resolve(folderDate);
      return;
    }

    // 2. 파일명에서 날짜 추출 시도
    const filenameDate = extractDateFromFilename(url);
    if (filenameDate) {
      console.log(`[Filename] ${decodeURIComponent(url.split('/').pop() || '')}: ${filenameDate.toISOString()}`);
    }
    resolve(filenameDate);
  });
};

// 여러 이미지의 촬영 날짜를 일괄 조회
export const getImagesDateTaken = async (urls: string[]): Promise<Map<string, Date | null>> => {
  const results = new Map<string, Date | null>();

  // 병렬로 처리하되 동시에 최대 5개씩
  const batchSize = 5;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const promises = batch.map(async (url) => {
      const date = await getImageDateTaken(url);
      results.set(url, date);
    });
    await Promise.all(promises);
  }

  return results;
};
