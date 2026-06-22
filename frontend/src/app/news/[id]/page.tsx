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
import { faUser, faNewspaper, faBuilding, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState, useEffect, Fragment } from 'react';
import Cookies from 'js-cookie';
import { ImportantNews } from '@/components/ImportantNews';
import { Loading } from '@/components/Loading';

export default function NewsDetail({ params }: { params: { id: string } }) {
  const [data, setData]   = useState<News[]>([]);
  const [image, setImage] = useState<string[]>([]);
  const [status, setStatus] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formattedDescription, setFormattedDescription] = useState<JSX.Element[] | null>(null);
  const apiUrl    = process.env.NEXT_PUBLIC_API_URL + '/news/' + params.id + '/';
  const csrftoken = Cookies.get('csrftoken') || '';

  const fetchNews = async () => {
    const response = await fetch(apiUrl, {
      method: 'GET', credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
    });
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      setData(data['news']);
      setImage(data['image']);
      setStatus(response.status);
    }
    setLoading(false);
  };

  useEffect(() => { fetchNews(); }, []);

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
              <FontAwesomeIcon icon={faNewspaper} className="mr-2 text-blue-300" />News
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">運営からのお知らせ</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {loading ? <Loading /> : (
          <div className="card-panel rounded-2xl p-6 md:p-8">
            {status === 200 ? (
              <>
                <p className="text-xs text-slate-400 mb-2">
                  {new Date(data[0]['created_at']).toLocaleDateString('ja-JP')}
                </p>
                <h2 className="text-xl font-bold text-slate-800 mb-4 leading-snug">
                  {data[0]['title']}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-slate-100 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faUser} /> {data[0]['user__username']}
                  </span>
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faBuilding} /> {data[0]['organization__name']}
                  </span>
                </div>
                <div className="text-sm text-slate-700 leading-8">
                  {formattedDescription}
                </div>
                {image.map((img, i) => (
                  <img key={i} src={img} className="w-full h-auto my-6 rounded-xl" />
                ))}
              </>
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">
                指定されたニュースが見つかりませんでした
              </p>
            )}
          </div>
        )}

        <Link href="/news" className="mt-6 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> お知らせ一覧に戻る
        </Link>
      </div>
    </main>
  );
}
