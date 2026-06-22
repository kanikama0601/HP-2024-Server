"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faPlus, faUser, faCircleCheck, faCircleExclamation, faCircleXmark, faSpinner, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { Loading } from '@/components/Loading';
import { fetchWithAuth } from '@/utils/api';

interface News {
  id: number;
  title: string;
  user__username: string;
  news_inspections__ai: boolean;
  news_inspections__inspected: boolean;
  news_inspections__deleted: boolean;
  created_at: string;
  updated_at: string;
}

export default function News({ params }: { params: Promise<{ id: string }>}) {
  const { id } = use(params);

  const [newsData, setNewsData] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const url = process.env.NEXT_PUBLIC_API_URL + `/organization/${id}/news/`;

  useEffect(() => {
		const fetchData = async () => {
				try {
						const data = await fetchWithAuth(url, 'GET');
            setNewsData(data['news']);
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
              <FontAwesomeIcon icon={faNewspaper} className="mr-2 text-blue-300" />Organization News
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">お知らせ管理</p>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {loading ? (<Loading />) : (
          <>
            {newsData && newsData.map((news) => (
              <Link key={news['id']} href={`/organization/${id}/news/${news['id']}`}>
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all mb-4">
                  <p className="text-xs mb-1 text-slate-500">{new Date(news['created_at']).toLocaleDateString('ja-JP')}</p>
                  <h3 className="text-base font-medium text-slate-800">{news['title']}</h3>
                  <p className="text-xs mt-1 text-slate-500"><FontAwesomeIcon icon={faUser} className="mr-1" />{news['user__username']}</p>
                  {news['news_inspections__deleted'] ? (
                    <p className="text-xs mt-1.5 text-red-600"><FontAwesomeIcon icon={faCircleXmark} className="mr-1" />検証によって削除済み</p>
                  ) : (
                  news['news_inspections__ai'] ? (
                    news['news_inspections__inspected'] ? (
                      <p className="text-xs mt-1.5 text-green-600"><FontAwesomeIcon icon={faCircleCheck} className="mr-1" />AI自動検証によって承認済み</p>
                    ) : (
                      <p className="text-xs mt-1.5 text-yellow-600"><FontAwesomeIcon icon={faCircleExclamation} className="mr-1" />AI自動検証によって保留、人間による検証を待機中</p>
                    )
                  ) : (
                    news['news_inspections__inspected'] ? (
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
        <Link href={`/organization/${id}/news/new`} className="mt-2 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faPlus} /> お知らせの追加
        </Link>
        <Link href={`/organization/${id}`} className="mt-4 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> オーガナイゼーションメニューへ戻る
        </Link>
      </div>
    </main>
  );
}
