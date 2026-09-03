import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, SchoolEvent } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

const monthNames = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktabr', 'Noyabr', 'Dekabr'];

export default function EventsPage() {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  useEffect(() => {
    supabase.from('events').select('*').eq('is_published', true).order('event_date', { ascending: true }).then(({ data }) => {
      if (data) setEvents(data);
      setLoading(false);
    });
  }, []);

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.event_date) >= now);
  const past = events.filter((e) => new Date(e.event_date) < now).reverse();

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = (firstDay.getDay() + 6) % 7;

  const eventsByDay: Record<number, SchoolEvent[]> = {};
  events.forEach((e) => {
    const d = new Date(e.event_date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(e);
    }
  });

  return (
    <div>
      <PageHero
        title="Tadbirlar"
        subtitle="Maktab hayotidan bo'lib o'tadigan va bo'lib o'tgan tadbirlar"
        image="https://images.pexels.com/photos/7567353/pexels-photo-7567353.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        breadcrumb={<Link to="/" className="hover:text-white">Bosh sahifa</Link>}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-2 mb-8">
          <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'list' ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>Ro'yxat</button>
          <button onClick={() => setView('calendar')} className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'calendar' ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>Kalendar</button>
        </div>

        {loading ? <LoadingSpinner size="lg" /> : view === 'calendar' ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setCalendarMonth(new Date(year, month - 1, 1))} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">←</button>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{monthNames[month]} {year}</h3>
              <button onClick={() => setCalendarMonth(new Date(year, month + 1, 1))} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">→</button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-slate-400 py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startWeekday }, (_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dayEvents = eventsByDay[day] || [];
                const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
                return (
                  <div key={day} className={`min-h-[70px] sm:min-h-[90px] p-1.5 rounded-lg border ${isToday ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-100 dark:border-slate-700'}`}>
                    <div className={`text-xs font-medium ${isToday ? 'text-primary-700 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'}`}>{day}</div>
                    {dayEvents.map((e) => (
                      <div key={e.id} className="mt-1 text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 truncate" title={e.title}>
                        {e.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ) : events.length === 0 ? <EmptyState title="Tadbirlar yo'q" /> : (
          <div className="space-y-12">
            {upcoming.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Yaqinlashmoqda</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcoming.map((event) => (
                    <div key={event.id} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all">
                      {event.image_url && (
                        <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-700">
                          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-5">
                        <h4 className="font-bold text-slate-900 dark:text-white">{event.title}</h4>
                        {event.description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{event.description}</p>}
                        <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-2"><Calendar className="h-3 w-3" /> {formatDate(event.event_date)}</span>
                          {event.event_time && <span className="flex items-center gap-2"><Clock className="h-3 w-3" /> {event.event_time}</span>}
                          {event.location && <span className="flex items-center gap-2"><MapPin className="h-3 w-3" /> {event.location}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">O'tgan tadbirlar</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {past.map((event) => (
                    <div key={event.id} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all opacity-75 hover:opacity-100">
                      {event.image_url && (
                        <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-700">
                          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-5">
                        <h4 className="font-bold text-slate-900 dark:text-white">{event.title}</h4>
                        <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-2"><Calendar className="h-3 w-3" /> {formatDate(event.event_date)}</span>
                          {event.location && <span className="flex items-center gap-2"><MapPin className="h-3 w-3" /> {event.location}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
