"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Loading } from "@/components/Loading";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

export const ImportantNews = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/news/?important=true';
    const csrftoken = Cookies.get('csrftoken') || '';

    const fetchNews = async () => {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
        });
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            setData(data['news']);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchNews(); // 関数を呼び出す
    }, []); // コンポーネントのマウント時に実行

    if (data.length > 0) {
        return (
            <>
            {loading && <Loading />}
                <div className="container mx-auto px-3 sticky top-16 z-30">
                    <div className="glass-panel w-full m-auto px-4 py-4 rounded-2xl inline-block" style={{ backgroundColor: 'rgba(255, 231, 151, 0.6)' }}>
                        <p className="text-neutral-950 py-1 font-bold text-xs"><FontAwesomeIcon icon={faTriangleExclamation} /> 重要なお知らせ</p>
                        {data.map((news) => ( // 不要な波括弧を削除し、mapを正しく表示
                            <Link key={news['id']} href={`/news/${news['id']}`}>
                                <p className="py-1 text-neutral-700 hover:text-neutral-950 transition-colors">{news['title']}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                {loading && <Loading />}
            </>
        ) 
    }
};
