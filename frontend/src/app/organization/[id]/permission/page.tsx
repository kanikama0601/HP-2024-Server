import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faSpinner, faClockRotateLeft, faPaperPlane, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Loading } from '@/components/Loading';
import { fetchWithAuth } from '@/utils/api';
import { useNavigate } from 'react-router-dom';

interface Permission {
  id: number;
  permission_type: string;
  created_at: string;
  organization_permission_inspection__inspected: boolean;
  organization_permission_inspection__deleted: boolean;
}

export default function News() {
  const { id } = useParams<{ id: string }>();

  const [sendLoading, setSendLoading] = useState(false);
  const [permission, setPermission] = useState('');
  const [nowPermission, setNowPermission] = useState<Permission[]>([]);
  const [havePermission, setHavePermission] = useState<string[]>([]);
  const [organizationLoading, setOrganizationLoading] = useState(true);
  const url = import.meta.env.VITE_API_URL + `/organization/${id}/permission/`;
  const navigate = useNavigate();

  useEffect(() => {
		const fetchData = async () => {
				try {
						const data = await fetchWithAuth(url, 'GET');
            setHavePermission(data['permissions']);
            setNowPermission(data['now_permissions']);
				} catch (error) {
						console.error('データ取得エラー:', error);
				} finally {
						setOrganizationLoading(false);
				}
		};

		fetchData();
  }, []);

  const fetchData = async () => {
    try {
        if (permission !== '') {
          const data = await fetchWithAuth(url, 'POST', { 'permission': permission });
        }
        navigate(`/organization/${id}`);
    } catch (error) {
        console.error('データ取得エラー:', error);
        setSendLoading(false);
        return;
    } finally {
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPermission(event.target.value);
  }

  const handleSubmit = (event: React.FormEvent) => {
    setSendLoading(true);
    event.preventDefault();
    fetchData();
  };

  return (
    <main className="pb-16">
      {sendLoading && <Loading />}
      {/* Page hero */}
      <div className="relative bg-blue-900 text-white py-14 overflow-hidden">
        <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full border-[3px] border-blue-600/30" />
        <div className="pointer-events-none absolute left-8 bottom-0 w-14 h-14 rotate-45 bg-blue-700/30 translate-y-7" />
        <div className="pointer-events-none absolute right-1/4 top-8 w-6 h-6 rotate-45 bg-blue-500/25" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-1 h-6 rounded-full bg-blue-400" />
            <h1 className="text-3xl font-bold tracking-[0.1em]">
              <FontAwesomeIcon icon={faCircleCheck} className="mr-2 text-blue-300" />Request Permission
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">オーガナイゼーション権限の申請</p>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {organizationLoading ? (<Loading />) : (
          <>
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm mb-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <select
                    name='permission'
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value={""} hidden>-- 選択してください --</option>
                    {!havePermission.includes('news') && <option value={"news"}>news</option>}
                    {!havePermission.includes('shop') && <option value={"shop"}>shop</option>}
                    {!havePermission.includes('event') && <option value={"event"}>event</option>}
                    {!havePermission.includes('band') && <option value={"band"}>band</option>}
                    {!havePermission.includes('karaoke') && <option value={"karaoke"}>karaoke</option>}
                    {!havePermission.includes('brassband') && <option value={"brassband"}>brassband</option>}
                  </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faPaperPlane} /> 申請
                </button>
              </form>
            </div>

            <p className="text-sm text-slate-600 font-medium mb-3 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faClockRotateLeft} /> 申請履歴
            </p>
            {nowPermission && nowPermission.map((permissions) => (
              <div key={permissions['id']} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all mb-4">
                <p className="text-xs mb-1 text-slate-500">{new Date(permissions['created_at']).toLocaleDateString('ja-JP')}</p>
                <h3 className="text-base font-medium text-slate-800">{permissions['permission_type']}</h3>
                {permissions['organization_permission_inspection__inspected'] && <p className="text-xs mt-1.5 text-green-600"><FontAwesomeIcon icon={faCircleCheck} className="mr-1" />管理者によって承認済み</p>}
                {permissions['organization_permission_inspection__deleted'] && <p className="text-xs mt-1.5 text-red-600"><FontAwesomeIcon icon={faCircleXmark} className="mr-1" />管理者によって否認済み</p>}
                {!(permissions['organization_permission_inspection__inspected'] || permissions['organization_permission_inspection__deleted']) && <p className="text-xs mt-1.5 text-slate-500"><FontAwesomeIcon icon={faSpinner} className="mr-1" />管理者による承認を待機中...</p>}
              </div>
            ))}
          </>
        )}
        <Link to={`/organization/${id}`} className="mt-4 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> オーガナイゼーションメニューへ戻る
        </Link>
      </div>
    </main>
  );
}
