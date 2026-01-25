const BUCKET_NAME = 'nuri-injun-wedding-card';
const REGION = 'ap-northeast-2';
const BUCKET_URL = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com`;

export interface S3Object {
  key: string;
  lastModified: string;
  size: number;
  url: string;
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic'];

function isImageFile(key: string): boolean {
  const lowerKey = key.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lowerKey.endsWith(ext));
}

export async function listS3Objects(): Promise<S3Object[]> {
  const response = await fetch(BUCKET_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch S3 bucket: ${response.statusText}`);
  }

  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

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
      objects.push({
        key,
        lastModified,
        size,
        url: `${BUCKET_URL}/${encodeURIComponent(key)}`,
      });
    }
  }

  return objects.sort(
    (a, b) =>
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  );
}

export function getImageUrl(key: string): string {
  return `${BUCKET_URL}/${encodeURIComponent(key)}`;
}
