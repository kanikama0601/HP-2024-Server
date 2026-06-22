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
    const [karaoke, setKaraoke] = useState<any[]>([]);
    const [brassband, setBrassband] = useState<any[]>([]);
    const [band, setBand] = useState<any[]>([]);
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
            setKaraoke(data['karaoke'] || []);
            setBrassband(data['brassband'] || []);
            setBand(data['band'] || []);
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

                                    {karaoke.length > 0 && (
                                        <div className='mt-10 border-t pt-10 text-left'>
                                            <h4 className='text-lg font-bold mb-4'><FontAwesomeIcon icon={faList} /> カラオケ大会 楽曲リスト</h4>
                                            <table className='w-full text-sm text-left text-gray-500'>
                                                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                                                    <tr>
                                                        <th className='px-4 py-2'>順番</th>
                                                        <th className='px-4 py-2'>曲名</th>
                                                        <th className='px-4 py-2'>アーティスト</th>
                                                        <th className='px-4 py-2'>歌唱者</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {karaoke.map((song) => (
                                                        <tr key={song.id} className='bg-white border-b'>
                                                            <td className='px-4 py-2'>{song.order}</td>
                                                            <td className='px-4 py-2 font-bold text-gray-900'>{song.name}</td>
                                                            <td className='px-4 py-2'>{song.artist || '-'}</td>
                                                            <td className='px-4 py-2'>{song.sing_user}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {brassband.length > 0 && (
                                        <div className='mt-10 border-t pt-10 text-left'>
                                            <h4 className='text-lg font-bold mb-4'><FontAwesomeIcon icon={faList} /> 吹奏楽 楽曲リスト</h4>
                                            <table className='w-full text-sm text-left text-gray-500'>
                                                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                                                    <tr>
                                                        <th className='px-4 py-2'>順番</th>
                                                        <th className='px-4 py-2'>曲名</th>
                                                        <th className='px-4 py-2'>アーティスト</th>
                                                        <th className='px-4 py-2'>演奏開始時刻</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {brassband.map((song) => (
                                                        <tr key={song.id} className='bg-white border-b'>
                                                            <td className='px-2 py-2'>{song.order}</td>
                                                            <td className='px-4 py-2 font-bold text-gray-900'>{song.name}</td>
                                                            <td className='px-4 py-2'>{song.artist}</td>
                                                            <td className='px-4 py-2'>{song.performance_time ? song.performance_time.slice(0, 5) : '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {band.length > 0 && (
                                        <div className='mt-10 border-t pt-10 text-left'>
                                            <h4 className='text-lg font-bold mb-4'><FontAwesomeIcon icon={faList} /> 軽音楽 バンド・楽曲リスト</h4>
                                            {band.map((b) => (
                                                <div key={b.id} className='bg-gray-100 p-4 my-4 rounded'>
                                                    <h5 className='text-base font-bold mb-2'>[{b.order}] {b.name}{b.performance_time ? <span className='ml-2 text-sm font-normal text-gray-600'>開始: {b.performance_time}</span> : ''}</h5>
                                                    <div className='pl-4 border-l-2 border-gray-300'>
                                                        <table className='w-full text-xs text-left text-gray-500'>
                                                            <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                                                                <tr>
                                                                    <th className='px-2 py-1'>順番</th>
                                                                    <th className='px-2 py-1'>曲名</th>
                                                                    <th className='px-2 py-1'>アーティスト</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {b.songs.map((song: any) => (
                                                                    <tr key={song.id} className='bg-white border-b'>
                                                                        <td className='px-2 py-1'>{song.order}</td>
                                                                        <td className='px-2 py-1 font-bold text-gray-900'>{song.name}</td>
                                                                        <td className='px-2 py-1'>{song.artist || '-'}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-xs my-1.5 text-gray-700 mt-6"><FontAwesomeIcon icon={faUser} /> {data[0]['user__username']}　<FontAwesomeIcon icon={faBuilding} /> {data[0]['organization__name']}</p>
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