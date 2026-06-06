"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faSpinner, faClockRotateLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Loading } from '@/components/Loading';
import { fetchWithAuth } from '@/utils/api';
import { useRouter } from 'next/navigation';

interface Permission {
  id: number;
  permission_type: string;
  created_at: string;
  organization_permission_inspection__inspected: boolean;
  organization_permission_inspection__deleted: boolean;
}

export default function News({ params }: { params: { id: string }}) {

  const [sendLoading, setSendLoading] = useState(false);
  const [permission, setPermission] = useState('');
  const [nowPermission, setNowPermission] = useState<Permission[]>([]);
  const [havePermission, setHavePermission] = useState<string[]>([]);
  const [organizationLoading, setOrganizationLoading] = useState(true);
  const url = process.env.NEXT_PUBLIC_API_URL + `/organization/${params.id}/permission/`;
  const router = useRouter();
    
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
    } catch (error) {
        console.error('データ取得エラー:', error);
    } finally {
      router.push(`/organization/${params.id}`);
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
        <main>
            {sendLoading && <Loading />}
            <div className="mx-3.5 my-10">
								{organizationLoading ? (<Loading />) : (
                  <>
                    <div className="container mx-auto text-white text-center m-12">
                        <h2 className="text-3xl font-light text-shadow-md m-3">
                        <FontAwesomeIcon icon={faCircleCheck} /> Request Organization Permission
                        </h2>
                        <p className="text-sm mb-4">
                            オーガナイゼーション権限の申請
                        </p>
                    </div>
                    <div className="container mx-auto text-xl md:w-6/12 w-full text-center">
                      <form onSubmit={handleSubmit}>
                        <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100 text-base">
                          <select name='permission' onChange={handleInputChange}>
                            <option value={""} hidden>-- 選択してください --</option>
                            {!havePermission.includes('news') && <option value={"news"}>news</option>}
                            {!havePermission.includes('shop') && <option value={"shop"}>shop</option>}
                            {!havePermission.includes('event') && <option value={"event"}>event</option>}
                            {!havePermission.includes('band') && <option value={"band"}>band</option>}
                            {!havePermission.includes('karaoke') && <option value={"karaoke"}>karaoke</option>}
                            {!havePermission.includes('inspection') && <option value={"inspection"}>inspection</option>}
                          </select>
                        </div>
                        <button type="submit" className='m-6 p-4 border rounded-lg bg-gray-600 text-white'><FontAwesomeIcon icon={faPaperPlane} /> 申請</button>
                      </form>
                    </div>
                    <div className="container mx-auto text-xl md:w-6/12 w-full">
                    <p className="text-sm mb-4 text-center text-white mt-4"><FontAwesomeIcon icon={faClockRotateLeft} /> 申請履歴</p>
                    {nowPermission && nowPermission.map((permissions) => (
                      <div key={permissions['id']}>
                        <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                          <p className="text-xs my-1.5 text-gray-700">{new Date(permissions['created_at']).toLocaleDateString('ja-JP')}</p>
                          <h3 className="text-base">{permissions['permission_type']}</h3>
                          {permissions['organization_permission_inspection__inspected'] && <p className="text-xs my-1.5 text-green-600"><FontAwesomeIcon icon={faCircleCheck} /> 管理者によって承認済み</p>}
                          {permissions['organization_permission_inspection__deleted'] && <p className="text-xs my-1.5 text-red-600"><FontAwesomeIcon icon={faCircleXmark} /> 管理者によって否認済み</p>}
                          {!(permissions['organization_permission_inspection__inspected'] || permissions['organization_permission_inspection__deleted']) && <p className="text-xs my-1.5 text-gray-600"><FontAwesomeIcon icon={faSpinner} /> 管理者による承認を待機中...</p>}
                        </div>
                      </div>
                    ))}
                    </div>
                  </>
                )}
            </div>
            <Link href={`/organization/${params.id}`} className='text-center'>
              <p className='text-white'>オーガナイゼーションメニューへ戻る</p>
            </Link>
        </main>
    );
}