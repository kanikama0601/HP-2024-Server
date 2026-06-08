"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCrown, faTrashCan, faRotate } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/Loading';
import { fetchWithAuth } from '@/utils/api';


export default function News({ params }: { params: { id: string, user_id: string }}) {

  const [sendLoading, setSendLoading] = useState(false);
  const [addData, setAddData] = useState(false);
  const [memberData, setMemberData] = useState([]);
  const [organizationLoading, setOrganizationLoading] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [organizationPermissions, setOrganizationPermissions] = useState<string[]>([]);
  const [owner, setOwner] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const url = process.env.NEXT_PUBLIC_API_URL + `/organization/${params.id}/member/${params.user_id}/`;
  const router = useRouter();

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
      router.push(`/organization/${params.id}/member`);
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
    <main>
      {sendLoading && <Loading />}
        <div className="mx-3.5 my-10">
            {organizationLoading ? (<Loading />) : (
              <>
                <div className="container mx-auto text-white text-center m-12">
                    <h2 className="text-3xl font-light text-shadow-md m-3">
                    <FontAwesomeIcon icon={faUser} /> {memberData[0]['username']}
                    </h2>
                    <p className="text-sm mb-4">
                        メンバー管理
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                  {organizationPermissions.includes('news') && (
                  <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                    <input 
                      type="checkbox"
                      id="news"
                      defaultChecked={permissions.includes('news')}
                      onChange={handleInputChange}
                      disabled={!addData}
                    />
                    <label> News</label>
                  </div>
                  )}
                  {organizationPermissions.includes('shop') && (
                  <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                    <input 
                      type="checkbox"
                      id="shop"
                      defaultChecked={permissions.includes('shop')}
                      onChange={handleInputChange}
                      disabled={!addData}
                    />
                    <label> Shop</label>
                  </div>
                  )}
                  {organizationPermissions.includes('menu') && (
                  <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                    <input 
                      type="checkbox"
                      id="menu"
                      defaultChecked={permissions.includes('menu')}
                      onChange={handleInputChange}
                      disabled={!addData}
                    />
                    <label> Menu</label>
                  </div>
                  )}
                  {organizationPermissions.includes('event') && (
                  <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                    <input 
                      type="checkbox"
                      id="event"
                      defaultChecked={permissions.includes('event')}
                      onChange={handleInputChange}
                      disabled={!addData}
                    />
                    <label> Event</label>
                  </div>
                  )}
                  {organizationPermissions.includes('band') && (
                  <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                    <input 
                      type="checkbox"
                      id="band"
                      defaultChecked={permissions.includes('band')}
                      onChange={handleInputChange}
                      disabled={!addData}
                    />
                    <label> Band</label>
                  </div>
                  )}
                  {organizationPermissions.includes('karaoke') && (
                  <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                    <input 
                      type="checkbox"
                      id="karaoke"
                      defaultChecked={permissions.includes('karaoke')}
                      onChange={handleInputChange}
                      disabled={!addData}
                    />
                    <label> Karaoke</label>
                  </div>
                  )}
                  {organizationPermissions.includes('brassband') && (
                  <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                    <input 
                      type="checkbox"
                      id="brassband"
                      defaultChecked={permissions.includes('brassband')}
                      onChange={handleInputChange}
                      disabled={!addData}
                    />
                    <label> Brass Band</label>
                  </div>
                  )}
                  {organizationPermissions.includes('inspection') && (
                  <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                    <input 
                      type="checkbox"
                      id="inspection"
                      defaultChecked={permissions.includes('inspection')}
                      onChange={handleInputChange}
                      disabled={!addData}
                    />
                    <label> Inspection</label>
                  </div>
                  )}
                  <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                    <input 
                      type="checkbox"
                      id="invite_user"
                      defaultChecked={permissions.includes('invite_user')}
                      onChange={handleInputChange}
                      disabled={!addData}
                    />
                    <label> Invite User</label>
                  </div>
                  {addData && (
                    <div className='text-center'>
                      <button type="submit" className='m-6 p-4 border rounded-lg bg-gray-600 text-white'><FontAwesomeIcon icon={faRotate} /> 更新</button>
                    </div>
                  )}
                </form>
                {addData && !isOwner && (
                  <Link href={`/organization/${params.id}/member/${params.user_id}/delete`} className='bg-white-100'>
                    <p className='text-center text-red-400 text-lg my-4'><FontAwesomeIcon icon={faTrashCan} /> オーガナイゼーションから退会</p>
                  </Link>
                )}
                {owner && !isOwner && (
                  <Link href={`/organization/${params.id}/member/${params.user_id}/change_owner`} className='bg-white-100'>
                    <p className='text-center text-red-400 text-lg my-4'><FontAwesomeIcon icon={faCrown} /> オーナーの譲渡</p>
                  </Link>
                )}
                {addData && isOwner && <p className='text-white text-center'><FontAwesomeIcon icon={faCrown} /> オーナーは退会できません</p>}
              </>
            )}
        </div>
      <Link href={`/organization/${params.id}/member`} className='text-center'>
        <p className='text-white'>メンバー管理へ戻る</p>
      </Link>
    </main>
);
}
