"use client";

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
import { faUser, faNewspaper, faBuilding, faList, faCirclePlay, faCircleStop, faClock } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState, useEffect, Fragment } from 'react';
import Cookies from 'js-cookie';
import { ImportantNews } from '@/components/ImportantNews';
import { Loading } from '@/components/Loading';

export default function Event({ params }: { params: { id: string }}) {
    const [now, setNow] = useState(new Date());
    const [data, setData] = useState<Event[]>([]);
    const [status, setStatus] = useState(0);
	const [loading, setLoading] = useState(true);
    const [image, setImage] = useState<string[]>([]);
    const [formattedDescription, setFormattedDescription] = useState<JSX.Element[] | null>(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/event/' + params.id + '/';
    const csrftoken = Cookies.get('csrftoken') || '';

    const fetchNews = async () => {
        const response = await fetch(apiUrl, {
            method: 'GET',
						credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
        });
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            setData(data['event']);
            setImage(data['image']);
            setStatus(response.status);
            setNow(new Date(data['now']));
        }
		setLoading(false);
    };

    useEffect(() => {
        fetchNews(); // 関数を呼び出す
    }, []); // コンポーネントのマウント時に実行

    useEffect(() => {
        if (data.length > 0) {
            setFormattedDescription(data[0]['detail'].split(/(\n)/).map((item: string, index: number) => {
                return <Fragment key={index}>{item.match(/\n/) ? <br /> : item}</Fragment>;
            }));
        }
    }, [data]);


    return (
        <main>
            <ImportantNews />
            <div className="mx-3.5 my-10">
                <div className="container mx-auto text-white text-center m-12">
                    <h2 className="text-3xl font-light text-shadow-md m-3">
					<FontAwesomeIcon icon={faNewspaper} /> Event
					</h2>
					<p className="text-sm mb-4">
					イベント情報
					</p>
                </div>
				{loading ? (<Loading />) : (
                <div className="container mx-auto text-xl md:w-6/12 w-full">
                        <div className="w-full p-4 bg-white rounded-lg py-6 my-4 transition duration-100">
                            {status === 200 ? ( // dataが空でないことを確認
                                <>
                                    <p className="text-xs my-1.5 text-gray-700">
                                        {new Date(data[0]['start']).toLocaleDateString('ja-JP')} {new Date(data[0]['start']).toLocaleTimeString('ja-JP', {hour: '2-digit', minute:'2-digit'})} ~ {new Date(data[0]['end']).toLocaleTimeString('ja-JP', {hour: '2-digit', minute:'2-digit'})}
                                        {new Date(data[0]['start']) < now && now < new Date(data[0]['end']) && <span className="text-green-600">　<FontAwesomeIcon icon={faCirclePlay} /> 進行中</span>}
                                        {now < new Date(data[0]['start']) && now < new Date(data[0]['end']) && <span className="text-gray-600">　<FontAwesomeIcon icon={faClock} /> 開始前</span>}
                                        {new Date(data[0]['start']) < now && new Date(data[0]['end']) < now && <span className="text-red-600">　<FontAwesomeIcon icon={faCircleStop} /> 終了済み</span>}
                                    </p>
                                    <h3 className="text-base mb-2">{data[0]['title']}</h3>
                                    <p className="text-xs text-gray-700">@{data[0]['place']}</p>
                                    <p className='text-sm my-5'>{formattedDescription}</p>
                                    {image.map((img, index) => (
                                        <img key={index} src={img} className="w-full h-auto my-6" />
                                    ))}
                                    <p className="text-xs my-1.5 text-gray-700"><FontAwesomeIcon icon={faUser} /> {data[0]['user__username']}　<FontAwesomeIcon icon={faBuilding} /> {data[0]['organization__name']}</p>
                                </>
                            ) : (
                                <p className="text-xs my-1.5 text-gray-700">指定されたイベントが見つかりませんでした</p> // デフォルトメッセージ
                            )}
                        </div>
                    </div>
								)}
                                <Link href={"/event"}>
                                    <p className="text-center text-white hover:text-gray-200 transition duration-100"><FontAwesomeIcon icon={faList} /> イベント一覧</p>
                                </Link>
            </div>
        </main>
    );
}