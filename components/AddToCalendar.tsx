import React from 'react';
import {
  downloadICS,
  getGoogleCalendarUrl,
  getNaverCalendarUrl,
  getOutlookCalendarUrl,
} from '../lib/calendar';

const AddToCalendar: React.FC = () => {
  const handleGoogleCalendar = () => {
    window.open(getGoogleCalendarUrl(), '_blank');
  };

  const handleNaverCalendar = () => {
    window.open(getNaverCalendarUrl(), '_blank');
  };

  const handleOutlookCalendar = () => {
    window.open(getOutlookCalendarUrl(), '_blank');
  };

  const buttonClass =
    'w-12 h-12 flex items-center justify-center rounded-full border border-stone-200 hover:border-gold hover:bg-gold/10 transition-all duration-300 group';

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold">
        Add to Calendar
      </span>
      <div className="flex justify-center gap-3">
        {/* Apple Calendar (ICS Download) */}
        <button
          onClick={downloadICS}
          className={buttonClass}
          title="Apple Calendar"
          aria-label="Apple Calendar에 추가"
        >
          <svg
            className="w-5 h-5 text-stone-500 group-hover:text-gold transition-colors"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
        </button>

        {/* Google Calendar */}
        <button
          onClick={handleGoogleCalendar}
          className={buttonClass}
          title="Google Calendar"
          aria-label="Google Calendar에 추가"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M18 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-stone-500 group-hover:text-gold transition-colors"
            />
            <path d="M8 2v4M16 2v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-stone-500 group-hover:text-gold transition-colors" />
            <path d="M8 14l2 2 4-4" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Naver Calendar */}
        <button
          onClick={handleNaverCalendar}
          className={buttonClass}
          title="네이버 캘린더"
          aria-label="네이버 캘린더에 추가"
        >
          <span className="text-sm font-bold text-[#03C75A] group-hover:text-gold transition-colors">N</span>
        </button>

        {/* Outlook Calendar */}
        <button
          onClick={handleOutlookCalendar}
          className={buttonClass}
          title="Outlook Calendar"
          aria-label="Outlook Calendar에 추가"
        >
          <svg
            className="w-5 h-5 text-stone-500 group-hover:text-gold transition-colors"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7 12a5 5 0 1 1 10 0 5 5 0 0 1-10 0zm5-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
            <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm2 0v12h16V6H4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AddToCalendar;
