"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/utils/api';
import { Loading } from '@/components/Loading';

export default function Shop({ params }: { params: Promise<{ id: string, shop_id: string }>}) {
  const { id, shop_id } = use(params);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(0);
  const url = process.env.NEXT_PUBLIC_API_URL + `/organization/${id}/shop/${shop_id}/delete/`;
  const router = useRouter();

  const fetchData = async () => {
    try {
        const data = await fetchWithAuth(url, 'POST', { 'delete': true });
    } catch (error) {
        console.error('データ取得エラー:', error);
    } finally {
      if (status === 201) {
        alert('削除しました');
      } else if (status === 403) {
        alert('権限がありません');
      }
      router.push(`/organization/${id}/shop`);
    }
  };

  const handleSubmit = (shop: React.FormEvent) => {
    setLoading(true);
    shop.preventDefault();
    fetchData();
  };

  return (
    <main className="pb-16">
      {loading && <Loading />}
      {/* Page hero */}
      <div className="relative bg-blue-900 text-white py-14 overflow-hidden">
        <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full border-[3px] border-blue-600/30" />
        <div className="pointer-events-none absolute left-8 bottom-0 w-14 h-14 rotate-45 bg-blue-700/30 translate-y-7" />
        <div className="pointer-events-none absolute right-1/4 top-8 w-6 h-6 rotate-45 bg-blue-500/25" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-1 h-6 rounded-full bg-blue-400" />
            <h1 className="text-3xl font-bold tracking-[0.1em]">
              <FontAwesomeIcon icon={faTrashCan} className="mr-2 text-blue-300" />Delete Shop
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">模擬店を削除</p>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <form onSubmit={handleSubmit}>
            <p className="text-center text-slate-700 mb-6">模擬店を削除しますか？</p>
            <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors mb-3">
              <FontAwesomeIcon icon={faTrashCan} className="mr-1" /> 削除
            </button>
          </form>
        </div>
        <Link href={`/organization/${id}/shop/${shop_id}`} className="mt-6 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> 模擬店へ戻る
        </Link>
      </div>
    </main>
  );
}
