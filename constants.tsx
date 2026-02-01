
import { TimelineItem, WeddingData, VenueLocation } from './types';

export const WEDDING_DATA: WeddingData = {
  groom: "Injun",
  bride: "Nuri",
  groomKr: "황인준",
  brideKr: "윤누리",
  groomPhone: "010-2620-6424",
  bridePhone: "010-6406-7539",
  weddingDate: new Date('2026-05-24T13:00:00'),
  firstMetDate: new Date('2023-04-01T09:00:00'), // 1,100 days roughly
  venue1: "서울대학교",
  venue2: "호암교수회관",
  venueAddress: "서울특별시 관악구 관악로 1",
};

export const VENUE_LOCATION: VenueLocation = {
  lat: 37.46764,
  lng: 126.96014,
  name: "서울대학교 호암교수회관",
  address: "서울특별시 관악구 관악로 1",
};

export const TIMELINE: TimelineItem[] = [
  {
    date: "2023.04",
    title: "처음 만난 날",
    description: "같은 회사, 같은 일. 동료로 시작된 우리의 이야기.",
    image: "https://picsum.photos/seed/meet/800/1000"
  },
  {
    date: "2023~2025",
    title: "함께한 시간들",
    description: "같이 공부하고, 같이 일하고. 수술도, 이사도, 실직도 — 우리는 늘 둘이서 해결했습니다.",
    image: "https://picsum.photos/seed/travel/800/1000"
  },
  {
    date: "2025.12",
    title: "첫 번째 결실",
    description: "Zero to 100 해커톤 수상. 팀으로서 받은 첫 번째 보상.",
    image: "https://picsum.photos/seed/promise/800/1000"
  },
  {
    date: "2026.05.24",
    title: "새로운 시작",
    description: "\"앞으로도 이렇게 살자.\" 그래서 결혼합니다.",
    image: "https://picsum.photos/seed/wedding/800/1000"
  }
];
