
import { TimelineItem, WeddingData, VenueLocation } from './types';

export const WEDDING_DATA: WeddingData = {
  groom: "Injun",
  bride: "Nuri",
  weddingDate: new Date('2026-05-24T12:00:00'),
  firstMetDate: new Date('2020-05-24T18:00:00'), // 2,190 days roughly
  venue: "The Grand Ballroom, Seoul Hotel",
  venueAddress: "Seoul, Republic of Korea",
};

export const VENUE_LOCATION: VenueLocation = {
  lat: 37.5665,
  lng: 126.9780,
  name: "The Grand Ballroom, Seoul Hotel",
  address: "서울시 중구 세종대로 99",
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
