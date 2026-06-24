import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '@/utils/api';
import { Loading } from '@/components/Loading';

export default function Top() {
  const [organization, setOrganization] = useState('');
  const [loading, setLoading] = useState(false);
	const url = import.meta.env.VITE_API_URL + '/organization/new/';
  const navigate = useNavigate();

  const fetchData = async () => {
      try {
          const data = await fetchWithAuth(url, 'POST', { 'name': organization });
      } catch (error) {

      } finally {
        navigate('/organization');
      }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrganization(event.target.value);
  }

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
              <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-300" />New Organization
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">オーガナイゼーションを新規作成</p>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                placeholder="Organization"
                onChange={handleInputChange}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faPaperPlane} /> 作成
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
