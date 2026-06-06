"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faUserPlus, faCrown } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Loading } from '@/components/Loading';
import { fetchWithAuth } from '@/utils/api';

interface Member {
  id: number;
  username: string;
  permissions: string[];
}

export default function News({ params }: { params: { id: string }}) {

  const [addData, setAddData] = useState([]);
  const [memberData, setMemberData] = useState<Member[]>([]);
  const [organizationData, setOrganizationData] = useState([]);
  const [organizationLoading, setOrganizationLoading] = useState(true);
  const url = process.env.NEXT_PUBLIC_API_URL + `/organization/${params.id}/member/`;
    
  useEffect(() => {
		const fetchData = async () => {
				try {
						const data = await fetchWithAuth(url, 'GET');
            setAddData(data['add']);
            setMemberData(data['users']);
						setOrganizationData(data['organizations']);
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
            <div className="mx-3.5 my-10">
								{organizationLoading ? (<Loading />) : (
                  <>
                    <div className="container mx-auto text-white text-center m-12">
                        <h2 className="text-3xl font-light text-shadow-md m-3">
                        <FontAwesomeIcon icon={faUserGroup} /> {organizationData[0]['name']}
                        </h2>
                        <p className="text-sm mb-4">
                            メンバー管理
                        </p>
                    </div>
                    <div className="container mx-auto text-xl md:w-6/12 w-full">
                    {memberData && memberData.map((member) => (
                      <Link key={member['id']} href={`/organization/${params.id}/member/${member['id']}`}>
                        <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                          <h3 className="text-base">{member['username']}</h3>
                          {organizationData[0]['owner_id'] === member['id'] && (<p className='text-xs mt-2'><FontAwesomeIcon icon={faCrown} /> オーガナイゼーションオーナー</p>)}
                          <p className='text-xs mt-2'>
                          権限: {member['permissions'][0] !== "" && member['permissions'].length !== 0 ? member['permissions'].map((permission: any) => `${permission} `).join('') : (<span>なし</span>)}
                          </p>
                        </div>
                      </Link>
                    ))}
                    </div>
                  </>
                )}
                {addData && (
                <Link href={`/organization/${params.id}/member/new`}>
                    <p className="text-center text-white hover:text-gray-200 transition duration-100 text-base"><FontAwesomeIcon icon={faUserPlus} /> メンバーを招待</p>
                </Link>
                )}
            </div>
            <Link href={`/organization/${params.id}`} className='text-center'>
              <p className='text-white'>オーガナイゼーションメニューへ戻る</p>
            </Link>
        </main>
    );
}
