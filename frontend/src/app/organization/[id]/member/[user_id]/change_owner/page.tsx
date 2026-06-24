import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faArrowRightArrowLeft, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import { fetchWithAuth } from '@/utils/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Loading } from '@/components/Loading';

export default function News() {
  const { id, user_id } = useParams<{ id: string; user_id: string }>();

  const [loading, setLoading] = useState(false);
  const url = import.meta.env.VITE_API_URL + `/organization/${id}/member/${user_id}/change_owner/`;
  const navigate = useNavigate()

  const fetchData = async () => {
    try {
        const data = await fetchWithAuth(url, 'POST', { 'change_owner': true });
    } catch (error) {
        console.error('データ取得エラー:', error);
    } finally {
      navigate(`/organization/${id}/member`);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault();
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
              <FontAwesomeIcon icon={faCrown} className="mr-2 text-blue-300" />Change Owner
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">オーナーを譲渡</p>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <form onSubmit={handleSubmit}>
            <p className="text-center text-slate-700 mb-6">オーナーを譲渡しますか？</p>
            <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors mb-3">
              <FontAwesomeIcon icon={faArrowRightArrowLeft} className="mr-1" /> 譲渡
            </button>
          </form>
        </div>
        <Link to={`/organization/${id}/member/${user_id}`} className="mt-6 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> メンバーへ戻る
        </Link>
      </div>
    </main>
  );
}
