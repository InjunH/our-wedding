
import { TimelineItem, WeddingData, VenueLocation } from './types';

export const WEDDING_DATA: WeddingData = {
  groom: "Injun",
  bride: "Nuri",
  groomKr: "황인준",
  brideKr: "윤누리",
  groomPhone: "010-2620-6424",
  bridePhone: "010-6406-7539",
  weddingDate: new Date('2026-05-24T13:00:00'),
  firstMetDate: new Date('2020-05-24T18:00:00'), // 2,190 days roughly
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
    date: "2020.05.24",
    title: "First Meeting",
    description: "The moment our separate worlds collided. A chance encounter that became our destiny.",
    image: "https://picsum.photos/seed/meet/800/1000"
  },
  {
    date: "2021.10.12",
    title: "The First Journey",
    description: "Walking at the same pace, discovering that every path is better when traveled together.",
    image: "https://picsum.photos/seed/travel/800/1000"
  },
  {
    date: "2023.12.24",
    title: "The Promise",
    description: "Under the winter lights, we promised to build a history that would last a lifetime.",
    image: "https://picsum.photos/seed/promise/800/1000"
  },
  {
    date: "2026.05.24",
    title: "The Beginning",
    description: "Our history is just getting started. We invite you to be part of our most important chapter.",
    image: "https://picsum.photos/seed/wedding/800/1000"
  }
];
