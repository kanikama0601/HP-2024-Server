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
import { faShop, faUserGroup, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState, useEffect, Fragment } from 'react';
import Cookies from 'js-cookie';
import { ImportantNews } from '@/components/ImportantNews';
import { Loading } from '@/components/Loading';

export default function ShopDetail({ params }: { params: { id: string } }) {
  const [data, setData]   = useState<Shop[]>([]);
  const [status, setStatus] = useState(0);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<string[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [formattedDescription, setFormattedDescription] = useState<JSX.Element[] | null>(null);
  const apiUrl    = process.env.NEXT_PUBLIC_API_URL + '/shop/' + params.id + '/';
  const csrftoken = Cookies.get('csrftoken') || '';

  const fetchShop = async () => {
    const response = await fetch(apiUrl, {
      method: 'GET', credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
    });
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      setData(data['shop']);
      setImage(data['image']);
      setMenus(data['menu']);
      setStatus(response.status);
    }
    setLoading(false);
  };

  useEffect(() => { fetchShop(); }, []);

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
              <FontAwesomeIcon icon={faShop} className="mr-2 text-blue-300" />Shop
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">模擬店情報</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {loading ? <Loading /> : (
          <div className="card-panel rounded-2xl overflow-hidden">
            {status === 200 ? (
              <>
                {data[0]['image__image__image'] && (
                  <img src={data[0]['image__image__image']} alt={data[0]['name']}
                    className="w-full h-56 object-cover" />
                )}
                <div className="p-6 md:p-8">
                  <h2 className="text-xl font-bold text-slate-800 mb-2">{data[0]['name']}</h2>
                  <p className="text-sm text-slate-400 mb-1">@{data[0]['address']}</p>
                  <p className="flex items-center gap-1 text-sm text-slate-400 mb-6 pb-6 border-b border-slate-100">
                    <FontAwesomeIcon icon={faUserGroup} /> {data[0]['organization__name']}
                  </p>
                  <div className="text-sm text-slate-700 leading-8 mb-6">
                    {formattedDescription}
                  </div>
                  {image.map((img, i) => (
                    <img key={i} src={img} className="w-full h-auto my-6 rounded-xl" />
                  ))}

                  {/* Menu */}
                  {menus.length > 0 ? (
                    <div className="mt-6">
                      <h3 className="flex items-center gap-2 text-base font-bold text-slate-800 mb-4">
                        <span className="w-1 h-5 rounded-full bg-blue-500" />メニュー
                      </h3>
                      <div className="overflow-hidden rounded-xl border border-slate-100">
                        <table className="w-full text-sm">
                          <thead className="bg-blue-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider w-4/5">メニュー</th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-blue-700 uppercase tracking-wider w-1/5">価格</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {menus.map((menu, i) => (
                              <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 text-slate-700">{menu['name']}</td>
                                <td className="px-4 py-3 text-right font-medium text-blue-700">¥{menu['price']}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-center text-slate-400 mt-4">メニューが登録されていません</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-400 text-center py-12">指定された模擬店が見つかりませんでした</p>
            )}
          </div>
        )}

        <Link href="/shop" className="mt-6 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> 模擬店一覧に戻る
        </Link>
      </div>
    </main>
  );
}
