import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faUserGroup, faShop, faCalendar, faCircleCheck, faGear, faBuilding, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Loading } from '@/components/Loading';
import { fetchWithAuth } from '@/utils/api';

export default function OrganizationPage() {
  const { id } = useParams<{ id: string }>();

  const [organizationData, setOrganizationData] = useState([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [owner, setOwner] = useState(false);
  const [organizationLoading, setOrganizationLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  const url = import.meta.env.VITE_API_URL + `/organization/${id}/`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWithAuth(url, 'GET');
        if (!data['organizations'] || data['organizations'].length === 0) {
          setErrorStatus(404);
        } else {
          setOrganizationData(data['organizations']);
          setPermissions(data['permissions']);
          setOwner(data['delete']);
        }
      } catch (error: any) {
        setErrorStatus(error.status ?? 500);
      } finally {
        setOrganizationLoading(false);
      }
    };
    fetchData();
  }, [id, url]);

  if (errorStatus === 404) {
    return (
      <main className="pb-16">
        <div className="relative bg-blue-900 text-white py-14 overflow-hidden">
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold tracking-[0.1em]">404 Not Found</h1>
            <p className="text-sm text-blue-300 mt-2">指定されたオーガナイゼーションが見つかりませんでした。</p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-10 max-w-2xl text-center">
          <Link to="/organization" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
            <FontAwesomeIcon icon={faChevronLeft} /> オーガナイゼーション選択へ戻る
          </Link>
        </div>
      </main>
    );
  }

  if (errorStatus === 403) {
    return (
      <main className="pb-16">
        <div className="relative bg-blue-900 text-white py-14 overflow-hidden">
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold tracking-[0.1em]">403 Forbidden</h1>
            <p className="text-sm text-blue-300 mt-2">このページへのアクセス権限がありません。</p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-10 max-w-2xl text-center">
          <Link to="/organization" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
            <FontAwesomeIcon icon={faChevronLeft} /> オーガナイゼーション選択へ戻る
          </Link>
        </div>
      </main>
    );
  }

  if (organizationLoading) return <Loading />;

  const orgName = organizationData.length > 0 ? organizationData[0]['name'] : '';

  const menuItems = [
    { show: permissions.includes('news'),  to: `/organization/${id}/news`,       icon: faNewspaper,   label: 'お知らせ' },
    { show: permissions.includes('shop'),  to: `/organization/${id}/shop`,       icon: faShop,        label: '模擬店' },
    { show: permissions.includes('event'), to: `/organization/${id}/event`,      icon: faCalendar,    label: 'イベント' },
    { show: true,                          to: `/organization/${id}/member`,     icon: faUserGroup,   label: 'オーガナイゼーションメンバー' },
    { show: owner,                         to: `/organization/${id}/permission`, icon: faCircleCheck, label: '新規権限申請' },
    { show: owner,                         to: `/organization/${id}/edit`,       icon: faGear,        label: 'オーガナイゼーションの編集' },
  ];

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
              <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-300" />{orgName}
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">オーガナイゼーションメニュー</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="space-y-3">
          {menuItems.filter(item => item.show).map(({ to, icon, label }) => (
            <Link key={to} to={to}>
              <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex items-center gap-3">
                <FontAwesomeIcon icon={icon} className="text-blue-400 w-4" />
                <span className="text-sm font-medium text-slate-800">{label}</span>
              </div>
            </Link>
          ))}
        </div>
        <Link to="/organization" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> オーガナイゼーション選択へ戻る
        </Link>
      </div>
    </main>
  );
}
