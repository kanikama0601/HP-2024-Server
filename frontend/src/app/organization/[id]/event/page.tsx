"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faPlus, faUser, faCircleCheck, faCircleExclamation, faCircleXmark, faSpinner, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { Loading } from '@/components/Loading';
import { fetchWithAuth } from '@/utils/api';

interface Event {
  id: number;
  title: string;
  place: string;
  detail: string;
  start: string;
  end: string;
  event_inspection__ai: boolean;
  event_inspection__inspected: boolean;
  event_inspection__deleted: boolean;
  organization__name: string;
  user__username: string;
  created_at: string;
}

export default function News({ params }: { params: Promise<{ id: string }>}) {
  const { id } = use(params);

  const [eventData, setEventData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const url = process.env.NEXT_PUBLIC_API_URL + `/organization/${id}/event/`;

  useEffect(() => {
		const fetchData = async () => {
				try {
						const data = await fetchWithAuth(url, 'GET');
            setEventData(data['event']);
				} catch (error) {
						console.error('データ取得エラー:', error);
				} finally {
						setLoading(false);
				}
		};

		fetchData();
}, []);

  return (
    <main className="pb-16">
      {/* Page hero */}
      <div className="relative bg-blue-900 text-white py-14 overflow-hidden">
        <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full border-[3px] border-blue-600/30" />
        <div className="pointer-events-none absolute left-8 bottom-0 w-14 h-14 rotate-45 bg-blue-700/30 translate-y-7" />
        <div className="pointer-events-none absolute right-1/4 top-8 w-6 h-6 rotate-45 bg-blue-500/25" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-1 h-6 rounded-full bg-blue-400" />
            <h1 className="text-3xl font-bold tracking-[0.1em]">
              <FontAwesomeIcon icon={faCalendar} className="mr-2 text-blue-300" />Organization Event
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">イベント管理</p>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {loading ? (<Loading />) : (
          <>
            {eventData && eventData.map((event) => (
              <Link key={event['id']} href={`/organization/${id}/event/${event['id']}`}>
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all mb-4">
                  <p className="text-xs mb-1 text-slate-500">{new Date(event['created_at']).toLocaleDateString('ja-JP')}</p>
                  <h3 className="text-base font-medium text-slate-800">{event['title']}</h3>
                  <p className="text-xs mt-1 text-slate-500"><FontAwesomeIcon icon={faUser} className="mr-1" />{event['user__username']}</p>
                  {event['event_inspection__deleted'] ? (
                    <p className="text-xs mt-1.5 text-red-600"><FontAwesomeIcon icon={faCircleXmark} className="mr-1" />検証によって削除済み</p>
                  ) : (
                  event['event_inspection__ai'] ? (
                    event['event_inspection__inspected'] ? (
                      <p className="text-xs mt-1.5 text-green-600"><FontAwesomeIcon icon={faCircleCheck} className="mr-1" />AI自動検証によって承認済み</p>
                    ) : (
                      <p className="text-xs mt-1.5 text-yellow-600"><FontAwesomeIcon icon={faCircleExclamation} className="mr-1" />AI自動検証によって保留、人間による検証を待機中</p>
                    )
                  ) : (
                    event['event_inspection__inspected'] ? (
                      <p className="text-xs mt-1.5 text-green-600"><FontAwesomeIcon icon={faCircleCheck} className="mr-1" />人間によって承認済み</p>
                    ) : (
                      <p className="text-xs mt-1.5 text-slate-500"><FontAwesomeIcon icon={faSpinner} className="mr-1" />AI自動検証を待機しています...</p>
                    )
                  ))}
                </div>
              </Link>
            ))}
          </>
        )}
        <Link href={`/organization/${id}/event/new`} className="mt-2 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faPlus} /> イベントの追加
        </Link>
        <Link href={`/organization/${id}`} className="mt-4 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> オーガナイゼーションメニューへ戻る
        </Link>
      </div>
    </main>
  );
}
