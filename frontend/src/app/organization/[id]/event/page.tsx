"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faPlus, faUser, faCircleCheck, faCircleExclamation, faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
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

export default function News({ params }: { params: { id: string }}) {

  const [eventData, setEventData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const url = process.env.NEXT_PUBLIC_API_URL + `/organization/${params.id}/event/`;
    
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
        <main>
            <div className="mx-3.5 my-10">
                <div className="container mx-auto text-white text-center m-12">
                <h2 className="text-3xl font-light text-shadow-md m-3">
                <FontAwesomeIcon icon={faCalendar} />  Organization Event
                </h2>
                <p className="text-sm mb-4">
                イベント管理
                </p>
                </div>
								{loading ? (<Loading />) : (
                  <>
                    <div className="container mx-auto text-xl md:w-6/12 w-full">
                    {eventData && eventData.map((event) => (
                      <Link key={event['id']} href={`/organization/${params.id}/event/${event['id']}`}>
                        <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                          <p className="text-xs my-1.5 text-gray-700">{new Date(event['created_at']).toLocaleDateString('ja-JP')}</p>
                          <h3 className="text-base">{event['title']}</h3>
                          <p className="text-xs my-1.5 text-gray-700"><FontAwesomeIcon icon={faUser} /> {event['user__username']}</p>
                          {event['event_inspection__deleted'] ? (
                            <p className="text-xs my-1.5 text-red-600"><FontAwesomeIcon icon={faCircleXmark} /> 検証によって削除済み</p>
                          ) : (
                          event['event_inspection__ai'] ? (
                            event['event_inspection__inspected'] ? (
                              <p className="text-xs my-1.5 text-green-600"><FontAwesomeIcon icon={faCircleCheck} /> AI自動検証によって承認済み</p>
                            ) : (
                              <p className="text-xs my-1.5 text-yellow-600"><FontAwesomeIcon icon={faCircleExclamation} /> AI自動検証によって保留、人間による検証を待機中</p>
                            )
                          ) : (
                            event['event_inspection__inspected'] ? (
                              <p className="text-xs my-1.5 text-green-600"><FontAwesomeIcon icon={faCircleCheck} /> 人間によって承認済み</p>
                            ) : (
                              <p className="text-xs my-1.5 text-gray-700"><FontAwesomeIcon icon={faSpinner} /> AI自動検証を待機しています...</p>
                            )
                          ))}
                        </div>
                      </Link>
                    ))}
                    </div>
                  </>
                )}
                <Link href={`/organization/${params.id}/event/new`}>
                    <p className="text-center text-white hover:text-gray-200 transition duration-100 text-base"><FontAwesomeIcon icon={faPlus} /> イベントの追加</p>
                </Link>
            </div>
            <Link href={`/organization/${params.id}`} className='text-center'>
              <p className='text-white'>オーガナイゼーションメニューへ戻る</p>
            </Link>
        </main>
    );
}
