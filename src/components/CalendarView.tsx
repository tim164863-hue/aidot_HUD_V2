import React from 'react';
import GlassCard from '@/components/GlassCard';
import { SEED_CALENDAR } from '@/lib/mock-data';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const CalendarView: React.FC = () => {
  const days = Array.from({ length: 35 }, (_, i) => i + 1);
  const currentDay = new Date().getDate();

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Workspace Calendar</h2>
          <p className="text-[13px] text-zinc-500">Syncing with 4 external calendars.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 glass rounded-lg border-white/10 text-zinc-400 hover:text-white">
            <ChevronLeft size={16} />
          </button>
          <span className="text-[13px] font-bold text-white mx-2">October 2024</span>
          <button className="p-2 glass rounded-lg border-white/10 text-zinc-400 hover:text-white">
            <ChevronRight size={16} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <GlassCard className="lg:col-span-3 p-6" delay={0.1}>
          <div className="grid grid-cols-7 mb-4 border-b border-white/5 pb-2">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-zinc-600 tracking-widest">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map(d => {
              const dayNum = d % 31 || 31;
              const isCurrent = dayNum === currentDay;
              const hasEvent = [4, 12, 18, 24].includes(dayNum);

              return (
                <div key={d} className={`aspect-square p-2 rounded-xl flex flex-col gap-1 transition-all group cursor-pointer ${
                  isCurrent ? 'bg-white/10 border border-white/20' : 'hover:bg-white/[0.03]'
                }`}>
                  <span className={`text-[11px] font-bold ${isCurrent ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                    {dayNum}
                  </span>
                  {hasEvent && (
                    <div className="w-1 h-1 rounded-full bg-blue-500 mt-auto mx-auto" />
                  )}
                </div>
              );
            })}
          </div>
        </GlassCard>

        <div className="space-y-4">
          <button className="w-full py-3 rounded-2xl bg-white text-black font-bold text-[12px] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-xl shadow-white/5">
            <Plus size={16} />
            Add Event
          </button>

          <GlassCard className="flex flex-col gap-4" delay={0.2}>
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Upcoming</h3>
            <div className="space-y-4">
              {SEED_CALENDAR.map(event => (
                <div key={event.id} className="group relative pl-3 border-l-2 border-blue-500/40">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-zinc-200">{event.title}</span>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                      {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <span className="absolute top-0 right-0 text-[8px] uppercase font-bold tracking-widest text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded-md">
                    {event.category}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
