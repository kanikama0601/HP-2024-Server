"use client";

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/utils/api';
import { Loading } from '@/components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export default function InspectionDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchWithAuth(process.env.NEXT_PUBLIC_API_URL + '/inspection/', 'GET')
      .then(d => {
        console.log('API Data:', d);
        setData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (category: string, id: number, approve: boolean) => {
    // 既存のinspectエンドポイントを呼び出す（パスを調整）
    const url = `${process.env.NEXT_PUBLIC_API_URL}/inspection/${category}/${id}/`;
    await fetchWithAuth(url, 'POST', { approve });
    // 成功したらデータを再取得して画面を更新
    window.location.reload();
  };

  const toggleExpand = (key: string) => {
    setExpandedId(expandedId === key ? null : key);
  };

  if (loading) return <Loading />;
  if (!data) return <div>データがありません</div>;

  const categories = Object.keys(data).filter(c => c !== 'menu' && c !== 'count');
  const filteredCategories = filter === 'all' ? categories : [filter];

  return (
    <main className="container mx-auto p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">全申請検閲ダッシュボード</h1>
      
      <select 
        className="mb-4 p-2 text-black"
        onChange={(e) => setFilter(e.target.value)}
        value={filter}
      >
        <option value="all">すべて</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      {filteredCategories.map(category => (
        <div key={category} className="mb-6">
          <h2 className="text-xl font-semibold mb-2 bg-gray-700 p-2">{category}</h2>
          {Array.isArray(data[category]) && data[category].map((item: any) => {
            const id = item.id || item.organization__id || item.news__id || item.shop__id || item.event__id || item.menu__id;
            const itemKey = `${category}-${id}`;
            const title = item.news__title || item.shop__name || item.event__title || item.organization__permission_type || 'ID: ' + id;
            const orgName = item.news__organization__name || item.event__organization__name || item.shop__organization__name || item.organization__organization__name || item.user__username || '所属不明';
            const detail = item.shop__detail || item.news__detail || item.event__detail || '詳細なし';

            return (
              <div key={itemKey} className="bg-white text-black p-4 mb-2 rounded">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExpand(itemKey)}>
                  <div>
                    <p><strong>{title}</strong></p>
                    <p className="text-sm text-gray-500">{orgName} (ID: {id})</p>
                  </div>
                  <FontAwesomeIcon icon={expandedId === itemKey ? faChevronUp : faChevronDown} />
                </div>
                
                {expandedId === itemKey && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="mb-4 text-sm">{detail}</p>
                    {/* 店舗の場合、紐づくメニューを表示 */}
                    {category === 'shop' && item.menus && item.menus.length > 0 && (
                        <div className="mb-4 text-sm">
                            <p className="font-bold">メニュー:</p>
                            <ul className="list-disc pl-5">
                                {item.menus.map((menu: any) => <li key={menu.menu__id}>{menu.menu__name}</li>)}
                            </ul>
                        </div>
                    )}
                    {item.ai && <p className="text-xs text-yellow-600 font-bold mb-2">● AI検証待機中</p>}
                    <div className="flex gap-2">
                      <button onClick={() => handleAction(category, id, true)} className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
                        <FontAwesomeIcon icon={faCheck} /> 承認
                      </button>
                      <button onClick={() => handleAction(category, id, false)} className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2">
                        <FontAwesomeIcon icon={faTimes} /> 拒否
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </main>
  );
}
