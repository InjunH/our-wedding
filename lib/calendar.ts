import { WEDDING_DATA, VENUE_LOCATION } from '../constants';

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  location: string;
  description: string;
}

const getWeddingEvent = (): CalendarEvent => ({
  title: `${WEDDING_DATA.groomKr} ♥ ${WEDDING_DATA.brideKr} 결혼식`,
  start: WEDDING_DATA.weddingDate,
  end: new Date(WEDDING_DATA.weddingDate.getTime() + 90 * 60 * 1000), // 1시간 30분 후
  location: `${VENUE_LOCATION.name}, ${VENUE_LOCATION.address}`,
  description: `${WEDDING_DATA.groomKr}과 ${WEDDING_DATA.brideKr}의 결혼식에 초대합니다.\n\n장소: ${VENUE_LOCATION.name}\n주소: ${VENUE_LOCATION.address}`,
});

const formatDateForICS = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

const formatDateForGoogle = (date: Date): string => {
  return date.toISOString().replace(/-|:|\.\d{3}/g, '');
};

export const downloadICS = (): void => {
  const event = getWeddingEvent();

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//KO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatDateForICS(event.start)}`,
    `DTEND:${formatDateForICS(event.end)}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.location}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    'STATUS:CONFIRMED',
    `UID:wedding-${WEDDING_DATA.groomKr}-${WEDDING_DATA.brideKr}@invitation`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${WEDDING_DATA.groomKr}_${WEDDING_DATA.brideKr}_결혼식.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getGoogleCalendarUrl = (): string => {
  const event = getWeddingEvent();
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDateForGoogle(event.start)}/${formatDateForGoogle(event.end)}`,
    location: event.location,
    details: event.description,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
