"use client";

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/utils/api';
import { Loading } from '@/components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faChevronDown, faChevronUp, faClipboardList } from '@fortawesome/free-solid-svg-icons';

export default function InspectionDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchWithAuth(process.env.NEXT_PUBLIC_API_URL + '/inspection/', 'GET')
      .then(d => setData(d))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (category: string, id: number, approve: boolean) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/inspection/${category}/${id}/`;
    await fetchWithAuth(url, 'POST', { approve });
    window.location.reload();
  };

  const toggleExpand = (key: string) => {
    setExpandedId(expandedId === key ? null : key);
  };

  if (loading) return <Loading />;

  const categories = data ? Object.keys(data).filter(c => c !== 'menu' && c !== 'count') : [];
  const filteredCategories = filter === 'all' ? categories : [filter];

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
              <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-blue-300" />Inspection
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">全申請検閲ダッシュボード</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {!data ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 text-center text-sm text-slate-400">
            データがありません
          </div>
        ) : (
          <>
            {/* Filter */}
            <div className="mb-6">
              <select
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
              >
                <option value="all">すべて</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Categories */}
            {filteredCategories.map(category => (
              <div key={category} className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1 h-5 rounded-full bg-blue-500" />
                  <h2 className="text-base font-bold text-slate-700">{category}</h2>
                </div>

                {Array.isArray(data[category]) && data[category].length === 0 && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center text-sm text-slate-400">
                    申請はありません
                  </div>
                )}

                <div className="space-y-3">
                  {Array.isArray(data[category]) && data[category].map((item: any) => {
                    const id = item.id || item.organization__id || item.news__id || item.shop__id || item.event__id || item.menu__id;
                    const itemKey = `${category}-${id}`;
                    const title = item.news__title || item.shop__name || item.event__title || item.organization__permission_type || 'ID: ' + id;
                    const orgName = item.news__organization__name || item.event__organization__name || item.shop__organization__name || item.organization__organization__name || item.user__username || '所属不明';
                    const detail = item.shop__detail || item.news__detail || item.event__detail || '詳細なし';
                    const isExpanded = expandedId === itemKey;

                    return (
                      <div key={itemKey} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div
                          className="flex justify-between items-center p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => toggleExpand(itemKey)}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-800">{title}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{orgName}　(ID: {id})</p>
                          </div>
                          <FontAwesomeIcon
                            icon={isExpanded ? faChevronUp : faChevronDown}
                            className="text-slate-400 text-xs ml-4 shrink-0"
                          />
                        </div>

                        {isExpanded && (
                          <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                            <p className="text-sm text-slate-600 mb-4">{detail}</p>

                            {category === 'shop' && item.menus && item.menus.length > 0 && (
                              <div className="mb-4">
                                <p className="text-xs font-semibold text-slate-500 mb-1">メニュー</p>
                                <ul className="text-sm text-slate-700 space-y-1 pl-4 list-disc">
                                  {item.menus.map((menu: any) => (
                                    <li key={menu.menu__id}>{menu.menu__name}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {item.ai && (
                              <p className="text-xs text-amber-600 font-medium mb-3">● AI検証待機中</p>
                            )}

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAction(category, id, true)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors"
                              >
                                <FontAwesomeIcon icon={faCheck} /> 承認
                              </button>
                              <button
                                onClick={() => handleAction(category, id, false)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                              >
                                <FontAwesomeIcon icon={faTimes} /> 拒否
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
}
