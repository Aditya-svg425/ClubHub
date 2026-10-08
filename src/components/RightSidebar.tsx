import React, { useState, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { NoticeItem, CalendarEvent } from '../types';
import {
  Bell,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Info,
  Clock,
  MapPin,
  Tag,
  Plus,
  Play,
  Pause,
  ExternalLink,
} from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const {
    notices,
    calendarEvents,
    isStudentCouncil,
    setActiveTab,
  } = usePortal();

  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState<{ date: string; events: CalendarEvent[] } | null>(null);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);

  // Calendar State: October 2026 as standard anchor
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 9, 1)); // October 2026 (0-indexed month)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Generate days for monthly grid
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: Array<{
      dateStr: string;
      dayNum: number;
      isCurrentMonth: boolean;
      events: CalendarEvent[];
    }> = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthDays - i);
      const dateStr = prevDate.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayNum: prevMonthDays - i,
        isCurrentMonth: false,
        events: calendarEvents.filter((e) => e.date === dateStr),
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      // Format as YYYY-MM-DD
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      const dateStr = `${year}-${mm}-${dd}`;
      days.push({
        dateStr,
        dayNum: day,
        isCurrentMonth: true,
        events: calendarEvents.filter((e) => e.date === dateStr),
      });
    }

    // Fill remaining grid to 35 or 42 cells
    const remaining = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      const nextDate = new Date(year, month + 1, day);
      const dateStr = nextDate.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayNum: day,
        isCurrentMonth: false,
        events: calendarEvents.filter((e) => e.date === dateStr),
      });
    }

    return days;
  }, [year, month, calendarEvents]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (dayData: { dateStr: string; events: CalendarEvent[] }) => {
    setSelectedDateEvents({
      date: dayData.dateStr,
      events: dayData.events,
    });
  };

  return (
    <aside className="w-full xl:w-80 2xl:w-88 flex flex-col gap-6 shrink-0">
      {/* ========================================================= */}
      {/* 1. TOP RIGHT: NOTICE BOARD (Department & Club Notices)     */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Notice Board</h3>
              <p className="text-[10px] text-slate-600">Live Campus & Dept Feed</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMarqueePaused(!isMarqueePaused)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
              title={isMarqueePaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
            >
              {isMarqueePaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            {isStudentCouncil && (
              <button
                onClick={() => setActiveTab('admin-builder')}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                title="Manage Notices"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            )}
          </div>
        </div>

        {/* Marquee ticker / Card list of upcoming small notices */}
        <div
          className={`mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1 no-scrollbar ${
            isMarqueePaused ? '' : 'transition-all'
          }`}
        >
          {notices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all cursor-pointer group text-left"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    notice.priority === 'high'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  {notice.category}
                </span>
                <span className="text-[10px] text-slate-600 font-mono tabular-nums">
                  {notice.date}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 line-clamp-2 leading-snug">
                {notice.title}
              </h4>
              <p className="text-[10px] text-slate-600 mt-1 truncate">
                {notice.department}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. BOTTOM RIGHT: INTERACTIVE CALENDAR                      */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Campus Calendar</h3>
              <p className="text-[10px] text-slate-600">
                {monthNames[month]} {year}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between gap-2 py-2 px-1 text-[11px] font-medium border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span className="text-rose-900 font-semibold">Holiday</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            <span className="text-blue-900 font-semibold">Big Event</span>
          </div>
          {isStudentCouncil && (
            <button
              onClick={() => setActiveTab('admin-builder')}
              className="text-[10px] text-indigo-600 hover:underline font-semibold cursor-pointer"
            >
              + Add
            </button>
          )}
        </div>

        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-600 pt-2 pb-1">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            const hasHoliday = day.events.some((e) => e.type === 'Holiday');
            const hasBigEvent = day.events.some((e) => e.type === 'Big Event');
            const hasEvents = day.events.length > 0;

            return (
              <button
                key={`${day.dateStr}-${idx}`}
                onClick={() => handleDayClick(day)}
                className={`h-9 rounded-lg flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                  !day.isCurrentMonth
                    ? 'text-slate-300 hover:bg-slate-50'
                    : hasHoliday
                    ? 'bg-rose-50 border border-rose-200 text-rose-900 font-bold hover:bg-rose-100'
                    : hasBigEvent
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 font-bold hover:bg-blue-100'
                    : 'text-slate-700 hover:bg-slate-100 font-medium'
                }`}
                title={
                  hasEvents
                    ? day.events.map((e) => `${e.type}: ${e.name}`).join(' | ')
                    : day.dateStr
                }
              >
                <span className="text-xs leading-none tabular-nums">{day.dayNum}</span>

                {/* Event Indicator Dots */}
                {hasEvents && (
                  <div className="flex gap-0.5 mt-0.5">
                    {hasHoliday && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                    {hasBigEvent && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Upcoming calendar highlights list */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Featured Month Highlights
          </div>
          <div className="space-y-1.5">
            {calendarEvents
              .filter((e) => e.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
              .slice(0, 3)
              .map((ev) => (
                <div
                  key={ev.id}
                  onClick={() =>
                    setSelectedDateEvents({
                      date: ev.date,
                      events: [ev],
                    })
                  }
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        ev.type === 'Holiday'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ev.type}
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono tabular-nums">
                      {ev.date}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">{ev.name}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    selectedNotice.priority === 'high'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  {selectedNotice.category} Notice
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">{selectedNotice.title}</h3>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 py-2 border-y border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Department: <strong className="text-slate-800">{selectedNotice.department}</strong></span>
              <span className="font-mono">{selectedNotice.date}</span>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {selectedNotice.description}
            </p>

            <button
              onClick={() => setSelectedNotice(null)}
              className="mt-6 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Date Events Modal */}
      {selectedDateEvents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Campus Schedule
                </h3>
                <p className="text-xs text-slate-500 font-mono">{selectedDateEvents.date}</p>
              </div>
              <button
                onClick={() => setSelectedDateEvents(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-72 overflow-y-auto">
              {selectedDateEvents.events.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  No institutional holidays or big events scheduled on this day.
                </div>
              ) : (
                selectedDateEvents.events.map((ev) => (
                  <div
                    key={ev.id}
                    className={`p-3.5 rounded-xl border ${
                      ev.type === 'Holiday'
                        ? 'bg-rose-50/60 border-rose-200'
                        : 'bg-blue-50/60 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          ev.type === 'Holiday'
                            ? 'bg-rose-200 text-rose-900'
                            : 'bg-blue-200 text-blue-900'
                        }`}
                      >
                        {ev.type}
                      </span>
                      {ev.venue && (
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {ev.venue}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{ev.name}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ev.description}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 flex gap-2">
              {isStudentCouncil && (
                <button
                  onClick={() => {
                    setSelectedDateEvents(null);
                    setActiveTab('admin-builder');
                  }}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Manage Events in Admin
                </button>
              )}
              <button
                onClick={() => setSelectedDateEvents(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
