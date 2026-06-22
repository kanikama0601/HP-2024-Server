"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserGroup, faNewspaper, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { ImportantNews } from "@/components/ImportantNews";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Loading } from "@/components/Loading";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import Link from "next/link";
import { fetchJsonCached } from "@/utils/api";

const NewsPage = () => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl    = process.env.NEXT_PUBLIC_API_URL + '/news/';
  const csrftoken = Cookies.get('csrftoken') || '';

  const fetchNews = async () => {
    const data = await fetchJsonCached(apiUrl, {
      method: 'GET', credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
    });
    setData(data['news']);
    setLoading(false);
  };

  useEffect(() => { fetchNews(); }, []);

  return (
    <main className="pb-16">
      <ImportantNews />

      {/* Page hero */}
      <div className="relative bg-blue-900 text-white py-14 overflow-hidden">
        <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full border-[3px] border-blue-600/30" />
        <div className="pointer-events-none absolute left-8 bottom-0 w-14 h-14 rotate-45 bg-blue-700/30 translate-y-7" />
        <div className="pointer-events-none absolute right-1/3 top-4 w-5 h-5 rotate-45 bg-blue-500/30" />
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
        {loading && <Loading />}
        <div className="space-y-3">
          {data.map((news, i) => (
            <AnimatedSection key={news['id']} delay={i * 40}>
              <Link href={`/news/${news['id']}`} className="block group">
                <div className="card-panel rounded-xl p-5 transition-all hover:shadow-md hover:shadow-blue-100 hover:-translate-y-0.5">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-1 self-stretch rounded-full bg-blue-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-400 mb-1">{new Date(news['created_at']).toLocaleDateString('ja-JP')}</p>
                      <h2 className="text-base font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{news['title']}</h2>
                      <p className="mt-1 text-xs text-slate-400">
                        <FontAwesomeIcon icon={faUser} className="mr-1" />{news['user__username']}
                        　<FontAwesomeIcon icon={faUserGroup} className="mr-1" />{news['organization__name']}
                      </p>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} className="text-blue-200 text-xs mt-1 shrink-0 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
          {!loading && data.length === 0 && (
            <div className="card-panel rounded-xl p-8 text-center">
              <p className="text-sm text-slate-400">お知らせはありません</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default NewsPage;
