interface Event {
  id: number;
  title: string;
  place: string;
  detail: string;
  start: string;
  end: string;
  organization__name: string;
  user__username: string;
}

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding, faCalendar, faChevronLeft, faCirclePlay, faCircleStop, faClock, faList } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect, Fragment } from 'react';
import Cookies from 'js-cookie';
import { ImportantNews } from '@/components/ImportantNews';
import { Loading } from '@/components/Loading';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [now, setNow]       = useState(new Date());
  const [data, setData]     = useState<Event[]>([]);
  const [status, setStatus] = useState(0);
  const [loading, setLoading] = useState(true);
  const [image, setImage]   = useState<string[]>([]);
  const [karaoke, setKaraoke]     = useState<any[]>([]);
  const [brassband, setBrassband] = useState<any[]>([]);
  const [band, setBand]           = useState<any[]>([]);
  const [formattedDescription, setFormattedDescription] = useState<JSX.Element[] | null>(null);
  const apiUrl    = import.meta.env.VITE_API_URL + '/event/' + id + '/';
  const csrftoken = Cookies.get('csrftoken') || '';

  const fetchEvent = async () => {
    const response = await fetch(apiUrl, {
      method: 'GET', credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
    });
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const d = await response.json();
      setData(d['event']);
      setImage(d['image']);
      setKaraoke(d['karaoke'] || []);
      setBrassband(d['brassband'] || []);
      setBand(d['band'] || []);
      setStatus(response.status);
      setNow(new Date(d['now']));
    }
    setLoading(false);
  };

  useEffect(() => { fetchEvent(); }, []);

  useEffect(() => {
    if (data.length > 0) {
      setFormattedDescription(
        data[0]['detail'].split(/(\n)/).map((item, i) =>
          <Fragment key={i}>{item.match(/\n/) ? <br /> : item}</Fragment>
        )
      );
    }
  }, [data]);

  return (
    <main className="pb-16">
      <ImportantNews />

      {/* Page hero */}
      <div className="relative bg-blue-900 text-white py-14 overflow-hidden">
        <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full border-[3px] border-blue-600/30" />
        <div className="pointer-events-none absolute left-8 bottom-0 w-14 h-14 rotate-45 bg-blue-700/30 translate-y-7" />
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
        {loading ? <Loading /> : (
          <div className="card-panel rounded-2xl p-6 md:p-8">
            {status === 200 ? (
              <>
                {/* Status & time */}
                {(() => {
                  const start = new Date(data[0]['start']);
                  const end   = new Date(data[0]['end']);
                  const live  = start < now && now < end;
                  const ended = end < now;
                  return (
                    <div className="mb-4">
                      <p className="text-xs text-slate-400 mb-2">
                        {start.toLocaleDateString('ja-JP')}{' '}
                        {start.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} 〜{' '}
                        {end.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {live  && <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 rounded-full px-2.5 py-1"><FontAwesomeIcon icon={faCirclePlay} /> 進行中</span>}
                      {!live && !ended && <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full px-2.5 py-1"><FontAwesomeIcon icon={faClock} /> 開始前</span>}
                      {ended && <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 rounded-full px-2.5 py-1"><FontAwesomeIcon icon={faCircleStop} /> 終了済み</span>}
                    </div>
                  );
                })()}

                <h2 className="text-xl font-bold text-slate-800 mb-1">{data[0]['title']}</h2>
                <p className="text-sm text-slate-400 mb-6 pb-6 border-b border-slate-100">@{data[0]['place']}</p>

                <div className="text-sm text-slate-700 leading-8 mb-6">
                  {formattedDescription}
                </div>

                {image.map((img, i) => (
                  <img key={i} src={img} className="w-full h-auto my-6 rounded-xl" />
                ))}

                {/* Karaoke list */}
                {karaoke.length > 0 && (
                  <MusicTable title="カラオケ大会 楽曲リスト" headers={['順番', '曲名', 'アーティスト', '歌唱者']}>
                    {karaoke.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-2 text-slate-400 text-center">{s.order}</td>
                        <td className="px-3 py-2 font-semibold text-slate-800">{s.name}</td>
                        <td className="px-3 py-2 text-slate-500">{s.artist || '-'}</td>
                        <td className="px-3 py-2 text-slate-500">{s.sing_user}</td>
                      </tr>
                    ))}
                  </MusicTable>
                )}

                {/* Brass band list */}
                {brassband.length > 0 && (
                  <MusicTable title="吹奏楽 楽曲リスト" headers={['順番', '曲名', 'アーティスト', '開始時刻']}>
                    {brassband.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-2 text-slate-400 text-center">{s.order}</td>
                        <td className="px-3 py-2 font-semibold text-slate-800">{s.name}</td>
                        <td className="px-3 py-2 text-slate-500">{s.artist}</td>
                        <td className="px-3 py-2 text-slate-500">{s.performance_time ? s.performance_time.slice(0, 5) : '-'}</td>
                      </tr>
                    ))}
                  </MusicTable>
                )}

                {/* Band list */}
                {band.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <h3 className="flex items-center gap-2 text-base font-bold text-slate-800 mb-4">
                      <span className="w-1 h-5 rounded-full bg-blue-500" />
                      <FontAwesomeIcon icon={faList} className="text-blue-400" /> 軽音楽 バンド・楽曲リスト
                    </h3>
                    <div className="space-y-4">
                      {band.map((b) => (
                        <div key={b.id} className="rounded-xl border border-blue-100 bg-blue-50/40 overflow-hidden">
                          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                            <h4 className="text-sm font-bold text-blue-900">
                              [{b.order}] {b.name}
                              {b.performance_time && (
                                <span className="ml-2 text-xs font-normal text-blue-600">開始: {b.performance_time}</span>
                              )}
                            </h4>
                          </div>
                          <table className="w-full text-xs">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-slate-400 font-medium">#</th>
                                <th className="px-3 py-2 text-left text-slate-400 font-medium">曲名</th>
                                <th className="px-3 py-2 text-left text-slate-400 font-medium">アーティスト</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {b.songs.map((song: any) => (
                                <tr key={song.id} className="hover:bg-slate-50">
                                  <td className="px-3 py-2 text-slate-400">{song.order}</td>
                                  <td className="px-3 py-2 font-semibold text-slate-700">{song.name}</td>
                                  <td className="px-3 py-2 text-slate-500">{song.artist || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><FontAwesomeIcon icon={faUser} /> {data[0]['user__username']}</span>
                  <span className="flex items-center gap-1"><FontAwesomeIcon icon={faBuilding} /> {data[0]['organization__name']}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-400 text-center py-12">指定されたイベントが見つかりませんでした</p>
            )}
          </div>
        )}

        <Link to="/event" className="mt-6 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> イベント一覧に戻る
        </Link>
      </div>
    </main>
  );
}

function MusicTable({ title, headers, children }: { title: string; headers: string[]; children: React.ReactNode }) {
  return (
    <div className="mt-8 pt-8 border-t border-slate-100">
      <h3 className="flex items-center gap-2 text-base font-bold text-slate-800 mb-4">
        <span className="w-1 h-5 rounded-full bg-blue-500" />
        <FontAwesomeIcon icon={faList} className="text-blue-400" /> {title}
      </h3>
      <div className="overflow-hidden rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-blue-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
