"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

export const ImportantNews = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/news/?important=true';
  const csrftoken = Cookies.get('csrftoken') || '';

  const fetchNews = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
      });
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const json = await response.json();
        setData(json['news']);
      }
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchNews(); }, []);

  if (loading || data.length === 0) return null;

  return (
    <div className="container mx-auto px-3 pt-3 sticky top-[57px] z-30">
      <div className="w-full rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 shadow-sm shadow-amber-100">
        <p className="mb-1 flex items-center gap-2 text-xs font-bold text-amber-700">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          重要なお知らせ
        </p>
        <div className="space-y-1">
          {data.map((news) => (
            <Link key={news['id']} href={`/news/${news['id']}`}>
              <p className="text-sm text-amber-800 hover:text-amber-950 transition-colors leading-relaxed">
                {news['title']}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
