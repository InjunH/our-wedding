
export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  image: string;
}

export interface WeddingData {
  groom: string;
  bride: string;
  groomKr: string;
  brideKr: string;
  groomPhone: string;
  bridePhone: string;
  weddingDate: Date;
  firstMetDate: Date;
  venue1: string;
  venue2: string;
  venueAddress: string;
}

export interface VenueLocation {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

export interface RSVPFormData {
  name: string;
  phone: string;
  attendance: 'attending' | 'not-attending' | 'undecided';
  guestCount: number;
  side: 'groom' | 'bride';
  message?: string;
}

export type RSVPStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface GuestBookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: Date;
  side?: 'groom' | 'bride' | 'both';
  photoUrl?: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}
