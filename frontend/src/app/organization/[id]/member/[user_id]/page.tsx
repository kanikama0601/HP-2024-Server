import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCrown, faTrashCan, faRotate, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '@/components/Loading';
import { fetchWithAuth } from '@/utils/api';


export default function News() {
  const { id, user_id } = useParams<{ id: string; user_id: string }>();

  const [sendLoading, setSendLoading] = useState(false);
  const [addData, setAddData] = useState(false);
  const [memberData, setMemberData] = useState([]);
  const [organizationLoading, setOrganizationLoading] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [organizationPermissions, setOrganizationPermissions] = useState<string[]>([]);
  const [owner, setOwner] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const url = import.meta.env.VITE_API_URL + `/organization/${id}/member/${user_id}/`;
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;
    setPermissions(prev => {
      const updatedPermissions = checked
          ? [...prev, id]
          : prev.filter(permission => permission !== id);
      return updatedPermissions;
    });
  }

  const fetchData = async () => {
    try {
        const data = await fetchWithAuth(url, 'POST', { 'permissions': permissions });
    } catch (error) {
        console.error('データ取得エラー:', error);
    } finally {
      navigate(`/organization/${id}/member`);
    }
};

  const handleSubmit = (event: React.FormEvent) => {
    setSendLoading(true);
    event.preventDefault();
    fetchData();
  };

  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await fetchWithAuth(url, 'GET');
            setAddData(data['add']);
            setMemberData(data['users']);
            setPermissions(data['permissions']);
            setOrganizationPermissions(data['organization_permissions']);
            setOwner(data['owner']);
            setIsOwner(data['is_owner']);
        } catch (error) {
            console.error('データ取得エラー:', error);
        } finally {
            setOrganizationLoading(false);
        }
    };

    fetchData();
  }, []);

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
              <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-300" />
              {!organizationLoading && memberData[0] ? memberData[0]['username'] : 'Member'}
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">メンバー管理</p>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {organizationLoading ? (<Loading />) : (
          <>
            <form onSubmit={handleSubmit}>
              {organizationPermissions.includes('news') && (
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all mb-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="news"
                      defaultChecked={permissions.includes('news')}
                      onChange={handleInputChange}
                      disabled={!addData}
                      className="w-5 h-5"
                    />
                    <span className="text-slate-700">News</span>
                  </label>
                </div>
              )}
              {organizationPermissions.includes('shop') && (
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all mb-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="shop"
                      defaultChecked={permissions.includes('shop')}
                      onChange={handleInputChange}
                      disabled={!addData}
                      className="w-5 h-5"
                    />
                    <span className="text-slate-700">Shop</span>
                  </label>
                </div>
              )}
              {organizationPermissions.includes('menu') && (
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all mb-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="menu"
                      defaultChecked={permissions.includes('menu')}
                      onChange={handleInputChange}
                      disabled={!addData}
                      className="w-5 h-5"
                    />
                    <span className="text-slate-700">Menu</span>
                  </label>
                </div>
              )}
              {organizationPermissions.includes('event') && (
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all mb-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="event"
                      defaultChecked={permissions.includes('event')}
                      onChange={handleInputChange}
                      disabled={!addData}
                      className="w-5 h-5"
                    />
                    <span className="text-slate-700">Event</span>
                  </label>
                </div>
              )}
              {organizationPermissions.includes('band') && (
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all mb-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="band"
                      defaultChecked={permissions.includes('band')}
                      onChange={handleInputChange}
                      disabled={!addData}
                      className="w-5 h-5"
                    />
                    <span className="text-slate-700">Band</span>
                  </label>
                </div>
              )}
              {organizationPermissions.includes('karaoke') && (
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all mb-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="karaoke"
                      defaultChecked={permissions.includes('karaoke')}
                      onChange={handleInputChange}
                      disabled={!addData}
                      className="w-5 h-5"
                    />
                    <span className="text-slate-700">Karaoke</span>
                  </label>
                </div>
              )}
              {organizationPermissions.includes('brassband') && (
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all mb-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="brassband"
                      defaultChecked={permissions.includes('brassband')}
                      onChange={handleInputChange}
                      disabled={!addData}
                      className="w-5 h-5"
                    />
                    <span className="text-slate-700">Brass Band</span>
                  </label>
                </div>
              )}
              {organizationPermissions.includes('inspection') && (
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all mb-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="inspection"
                      defaultChecked={permissions.includes('inspection')}
                      onChange={handleInputChange}
                      disabled={!addData}
                      className="w-5 h-5"
                    />
                    <span className="text-slate-700">Inspection</span>
                  </label>
                </div>
              )}
              <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all mb-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="invite_user"
                    defaultChecked={permissions.includes('invite_user')}
                    onChange={handleInputChange}
                    disabled={!addData}
                    className="w-5 h-5"
                  />
                  <span className="text-slate-700">Invite User</span>
                </label>
              </div>
              {addData && (
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 mb-4">
                  <FontAwesomeIcon icon={faRotate} /> 更新
                </button>
              )}
            </form>

            {addData && !isOwner && (
              <Link to={`/organization/${id}/member/${user_id}/delete`} className="mt-4 flex items-center justify-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors">
                <FontAwesomeIcon icon={faTrashCan} /> オーガナイゼーションから退会
              </Link>
            )}
            {owner && !isOwner && (
              <Link to={`/organization/${id}/member/${user_id}/change_owner`} className="mt-4 flex items-center justify-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors">
                <FontAwesomeIcon icon={faCrown} /> オーナーの譲渡
              </Link>
            )}
            {addData && isOwner && (
              <p className="text-center text-slate-500 text-sm mt-4">
                <FontAwesomeIcon icon={faCrown} className="mr-1" />オーナーは退会できません
              </p>
            )}
          </>
        )}
        <Link to={`/organization/${id}/member`} className="mt-6 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> メンバー管理へ戻る
        </Link>
      </div>
    </main>
  );
}
