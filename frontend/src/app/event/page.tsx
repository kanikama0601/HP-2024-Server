import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCirclePlay, faClock, faCircleStop, faCircleCheck, faHouse } from "@fortawesome/free-solid-svg-icons";
import { ImportantNews } from "@/components/ImportantNews";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Loading } from "@/components/Loading";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { fetchJsonCached } from "@/utils/api";

const EventPage = () => {
  const [now, setNow]         = useState(new Date());
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl    = import.meta.env.VITE_API_URL + '/event/';
  const csrftoken = Cookies.get('csrftoken') || '';

  const fetchEvent = async () => {
    const data = await fetchJsonCached(apiUrl, {
      method: 'GET', credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
    });
    setData(data['event']);
    setNow(new Date(data['now']));
    setLoading(false);
  };

  useEffect(() => { fetchEvent(); }, []);

  const sorted = [...data].sort((a, b) => {
    const aEnded = new Date(a['end']) <= now;
    const bEnded = new Date(b['end']) <= now;
    if (aEnded !== bEnded) return aEnded ? 1 : -1;
    return new Date(a['start']).getTime() - new Date(b['start']).getTime();
  });

  return (
    <main className="pb-16">
      <ImportantNews />

      {/* Page hero */}
      <div className="relative bg-blue-900 text-white py-14 overflow-hidden">
        <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full border-[3px] border-blue-600/30" />
        <div className="pointer-events-none absolute left-8 bottom-0 w-14 h-14 rotate-45 bg-blue-700/30 translate-y-7" />
        <div className="pointer-events-none absolute right-1/3 top-4 w-5 h-5 rotate-45 bg-blue-500/30" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-1 h-6 rounded-full bg-blue-400" />
            <h1 className="text-3xl font-bold tracking-[0.1em]">
              <FontAwesomeIcon icon={faCalendar} className="mr-2 text-blue-300" />Event
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">イベント情報</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {loading && <Loading />}
        <div className="space-y-3">
          {sorted.map((event, i) => {
            const start  = new Date(event['start']);
            const end    = new Date(event['end']);
            const live   = start <= now && now < end;
            const soon   = now < start && start <= new Date(now.getTime() + 3600000);
            const ended  = end <= now;

            return (
              <AnimatedSection key={event['id']} delay={i * 40}>
                <Link to={`/event/${event['id']}`} className="block group">
                  <div className={`card-panel rounded-xl p-5 transition-all hover:shadow-md hover:-translate-y-0.5
                    ${live ? 'ring-2 ring-green-400 ring-offset-1' : ended ? 'opacity-60' : ''}`}>
                    <div className="flex items-start gap-4">
                      {/* Status dot */}
                      <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 mt-2
                        ${live ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)] animate-pulse' :
                          soon ? 'bg-orange-400' :
                          ended ? 'bg-slate-300' : 'bg-blue-400'}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-400 mb-1">
                          {start.toLocaleDateString('ja-JP')}{' '}
                          {start.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} 〜{' '}
                          {end.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          {live  && <StatusBadge icon={faCirclePlay}  label="進行中"     cls="text-green-700 bg-green-100" />}
                          {soon  && <StatusBadge icon={faClock}        label="まもなく開始" cls="text-orange-700 bg-orange-100" />}
                          {ended && <StatusBadge icon={faCircleStop}   label="終了済み"   cls="text-slate-500 bg-slate-100" />}
                          {!live && !soon && !ended && <StatusBadge icon={faClock} label="開始前" cls="text-blue-600 bg-blue-50" />}
                        </div>
                        <h2 className="text-base font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                          {event['title']}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">@{event['place']}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
          {!loading && data.length === 0 && (
            <div className="card-panel rounded-xl p-8 text-center">
              <p className="text-sm text-slate-400">イベント情報はありません</p>
            </div>
          )}
        </div>
        <div className="mt-10 flex justify-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
            <FontAwesomeIcon icon={faHouse} /> トップページへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
};

function StatusBadge({ icon, label, cls }: { icon: any; label: string; cls: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5 ${cls}`}>
      <FontAwesomeIcon icon={icon} className="text-[10px]" /> {label}
    </span>
  );
}

export default EventPage;
