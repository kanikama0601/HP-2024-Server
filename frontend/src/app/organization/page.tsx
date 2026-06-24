import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, Suspense } from "react";
import { Loading } from "@/components/Loading";
import { Link } from 'react-router-dom';
import { fetchWithAuth } from '@/utils/api';

export default function Top() {
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
              <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-300" />Organization
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">オーガナイゼーション</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <Suspense fallback={<Loading />}>
          <SearchParamsComponent />
          <Link to="/organization/new" className="mt-4 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
            <FontAwesomeIcon icon={faPlus} /> 新規作成
          </Link>
        </Suspense>
      </div>
    </main>
  );
}

function SearchParamsComponent() {
  const [status, setStatus] = useState(0);
  const [organizationData, setOrganizationData] = useState([]);
  const [organizationLoading, setOrganizationLoading] = useState(true);
  const url = import.meta.env.VITE_API_URL + '/organization/';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWithAuth(url, 'GET');
        setOrganizationData(data['organizations']);
      } catch (error) {
        setStatus((error as any).status ?? 500);
      } finally {
        setOrganizationLoading(false);
      }
    };
    fetchData();
  }, []);

  const [searchParams] = useSearchParams();
  let next = searchParams.get('next');
  if (next === null) next = '';

  return (
    <>
      {organizationLoading && <Loading />}
      {status !== 0 && (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 my-4 text-center">
          <p className="text-sm text-slate-600 my-2">オーガナイゼーションが見つかりませんでした</p>
          <p className="text-xs text-slate-400 my-2">※既にオーガナイゼーションへ加入している場合は、再読み込みや再ログインをお試しください。</p>
        </div>
      )}
      {organizationData.map((organization) => (
        <Link key={organization['id']} to={`/organization/${organization['id']}${next}`}>
          <div className="rounded-xl border border-slate-100 bg-white p-5 my-3 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
            <h3 className="text-base font-medium text-slate-800">{organization['name']}</h3>
          </div>
        </Link>
      ))}
    </>
  );
}
