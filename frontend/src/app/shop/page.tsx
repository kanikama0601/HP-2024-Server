"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop, faUserGroup, faHouse } from "@fortawesome/free-solid-svg-icons";
import { ImportantNews } from "@/components/ImportantNews";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Loading } from "@/components/Loading";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import Link from "next/link";
import { fetchJsonCached } from "@/utils/api";

const ShopPage = () => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl    = process.env.NEXT_PUBLIC_API_URL + '/shop/';
  const csrftoken = Cookies.get('csrftoken') || '';

  const fetchShop = async () => {
    const data = await fetchJsonCached(apiUrl, {
      method: 'GET', credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
    });
    setData(data['shop']);
    setLoading(false);
  };

  useEffect(() => { fetchShop(); }, []);

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
              <FontAwesomeIcon icon={faShop} className="mr-2 text-blue-300" />Shop
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">模擬店情報</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {loading && <Loading />}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {data.map((shop, i) => (
            <AnimatedSection key={shop['id']} delay={i * 40}>
              <Link href={`/shop/${shop['id']}`} className="block group h-full">
                <div className="card-panel rounded-2xl overflow-hidden h-full transition-all hover:shadow-md hover:shadow-blue-100 hover:-translate-y-0.5">
                  {shop['image__image__image'] ? (
                    <img src={shop['image__image__image']} alt={shop['name']}
                      className="w-full h-44 object-cover" />
                  ) : (
                    <div className="w-full h-28 bg-blue-50 flex items-center justify-center">
                      <FontAwesomeIcon icon={faShop} className="text-3xl text-blue-200" />
                    </div>
                  )}
                  <div className="p-5">
                    <h2 className="text-base font-semibold text-slate-800 group-hover:text-blue-700 transition-colors mb-1">
                      {shop['name']}
                    </h2>
                    <p className="text-xs text-slate-400">@{shop['address']}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <FontAwesomeIcon icon={faUserGroup} /> {shop['organization__name']}
                    </p>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
          {!loading && data.length === 0 && (
            <div className="col-span-full card-panel rounded-xl p-8 text-center">
              <p className="text-sm text-slate-400">模擬店情報はありません</p>
            </div>
          )}
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
            <FontAwesomeIcon icon={faHouse} /> トップページへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ShopPage;
