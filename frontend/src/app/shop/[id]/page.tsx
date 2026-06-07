"use client";

interface Shop {
    id: number;
    name: string;
    address: string;
    detail: string;
    image__image__image: string;
    organization__name: string;
    user__username: string;
}

interface Menu {
    id: number;
    name: string;
    price: number;
}

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faShop, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState, useEffect, Fragment } from 'react';
import Cookies from 'js-cookie';
import { ImportantNews } from '@/components/ImportantNews';
import { Loading } from '@/components/Loading';

export default function Event({ params }: { params: { id: string }}) {
    const [data, setData] = useState<Shop[]>([]);
    const [status, setStatus] = useState(0);
	const [loading, setLoading] = useState(true);
    const [image, setImage] = useState<string[]>([]);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [formattedDescription, setFormattedDescription] = useState<JSX.Element[] | null>(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/shop/' + params.id + '/';
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
            setData(data['shop']);
            setImage(data['image']);
            setMenus(data['menu']);
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
					<h2 className="text-3xl font-light text-shadow-md drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] m-3">
					<FontAwesomeIcon icon={faShop} /> Shop
					</h2>
					<p className="text-sm mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
					模擬店情報
					</p>
				</div>
				{loading ? (<Loading />) : (
                <div className="container mx-auto text-xl md:w-6/12 w-full">
                        <div className="w-full p-4 bg-white rounded-lg py-6 my-4 transition duration-100">
                            {status === 200 ? ( // dataが空でないことを確認
                                <>
                                    {data[0]['image__image__image'] && <img src={data[0]['image__image__image']} alt={data[0]['name']} className="w-full h-40 object-cover rounded-lg mb-4" />}
                                    <h3 className="text-base my-1.5">{data[0]['name']}</h3>
                                    <p className="text-xs my-1.5 text-gray-700">@{data[0]['address']}</p>
                                    <p className="text-xs my-1.5 text-gray-700"><FontAwesomeIcon icon={faUserGroup} /> {data[0]['organization__name']}</p>
                                    <p className='text-sm my-5'>{formattedDescription}</p>
                                    {image.map((img, index) => (
                                        <img key={index} src={img} className="w-full h-auto my-6" />
                                    ))}
                                    {menus.length > 0 ? (
                                        <div className='text-center'>
                                            <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w-11/12 m-auto">
                                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3" style={{ width: '80%' }}>
                                                            Menu
                                                        </th>
                                                        <th scope="col" className="px-6 py-3" style={{ width: '20%' }}>
                                                            Price
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {menus.map((menu, index) => (
                                                        <tr key={index} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                                            <td><p className='text-sm my-1 px-2'>{menu['name']}</p></td>
                                                            <td><p className='text-sm my-1 px-2'>¥ {menu['price']}</p></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-xs my-1.5 text-gray-700 text-center">メニューが登録されていません</p>
                                    )}
                                </>
                            ) : (
                                <p className="text-xs my-1.5 text-gray-700">指定された模擬店が見つかりませんでした</p> // デフォルトメッセージ
                            )}
                        </div>
                    </div>
								)}
                                <Link href={"/shop"}>
                                    <p className="text-center text-white hover:text-gray-200 transition duration-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"><FontAwesomeIcon icon={faList} /> 模擬店一覧</p>
                                </Link>
            </div>
        </main>
    );
}
