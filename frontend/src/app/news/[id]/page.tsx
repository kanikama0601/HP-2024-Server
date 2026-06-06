"use client";

interface News {
    id: number;
    title: string;
    detail: string;
    created_at: string;
    organization__name: string;
    user__username: string;
}

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faNewspaper, faBuilding, faList } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState, useEffect, Fragment } from 'react';
import Cookies from 'js-cookie';
import { ImportantNews } from '@/components/ImportantNews';
import { Loading } from '@/components/Loading';

export default function News({ params }: { params: { id: string }}) {
    const [data, setData] = useState<News[]>([]);
    const [image, setImage] = useState<string[]>([]);
    const [status, setStatus] = useState(0);
	const [loading, setLoading] = useState(true);
    const [formattedDescription, setFormattedDescription] = useState<JSX.Element[] | null>(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/news/' + params.id + '/';
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
            setData(data['news']);
            setImage(data['image']);
            setStatus(response.status);
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
                    <FontAwesomeIcon icon={faNewspaper} /> News
                    </h2>
                    <p className="text-sm mb-4">
                        運営からのお知らせ
                    </p>
                </div>
								{loading ? (<Loading />) : (
                <div className="container mx-auto text-xl md:w-6/12 w-full">
                        <div className="w-full p-4 bg-white rounded-lg py-6 my-4 transition duration-100">
                            {status === 200 ? ( // dataが空でないことを確認
                                <>
                                    <p className="text-xs my-1.5 text-gray-700">{new Date(data[0]['created_at']).toLocaleDateString('ja-JP')}</p>
                                    <h3 className="text-base mb-4">{data[0]['title']}</h3>
                                    <p className="text-xs my-1.5 text-gray-700"><FontAwesomeIcon icon={faUser} /> {data[0]['user__username']}　<FontAwesomeIcon icon={faBuilding} /> {data[0]['organization__name']}</p>
                                    <p className='text-sm mt-8 mb-4'>{formattedDescription}</p>
                                    {image.map((img, index) => (
                                        <img key={index} src={img} className="w-full h-auto my-6" />
                                    ))}
                                </>
                            ) : (
                                <p className="text-xs my-1.5 text-gray-700">指定されたニュースが見つかりませんでした</p> // デフォルトメッセージ
                            )}
                        </div>
                    </div>
								)}
                                <Link href={"/news"}>
                                    <p className="text-center text-white hover:text-gray-200 transition duration-100"><FontAwesomeIcon icon={faList} /> お知らせ一覧</p>
                                </Link>
            </div>
        </main>
    );
}