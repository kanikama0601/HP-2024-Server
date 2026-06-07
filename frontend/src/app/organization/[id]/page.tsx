"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faUserGroup, faShop, faCalendar, faCircleExclamation, faCircleCheck, faGear, faBuilding } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Loading } from '@/components/Loading';
import { fetchWithAuth } from '@/utils/api';

export default function News({ params }: { params: { id: string }}) {

  const [organizationData, setOrganizationData] = useState([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [owner, setOwner] = useState(false);
  const [organizationLoading, setOrganizationLoading] = useState(true);
  const url = process.env.NEXT_PUBLIC_API_URL + `/organization/${params.id}/`;
    
  useEffect(() => {
		const fetchData = async () => {
				try {
						const data = await fetchWithAuth(url, 'GET');
						setOrganizationData(data['organizations']);
            setPermissions(data['permissions']);
            setOwner(data['delete']);
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
                        <h2 className="text-3xl font-light text-shadow-md drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] m-3">
                        <FontAwesomeIcon icon={faBuilding} /> {organizationData[0]['name']}
                        </h2>
                        <p className="text-sm mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                            オーガナイゼーションメニュー
                        </p>
                    </div>
                    <div className="container mx-auto text-xl md:w-6/12 w-full">
                    {permissions.includes('news') && (
                      <Link href={`/organization/${params.id}/news`}>
                        <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                          <h3 className="text-base"><FontAwesomeIcon icon={faNewspaper} /> お知らせ</h3>
                        </div>
                      </Link>
                    )}
                    {permissions.includes('shop') && (
                      <Link href={`/organization/${params.id}/shop`}>
                        <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                          <h3 className="text-base"><FontAwesomeIcon icon={faShop} /> 模擬店</h3>
                        </div>
                      </Link>
                    )}
                    {permissions.includes('event') && (
                      <Link href={`/organization/${params.id}/event`}>
                        <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                          <h3 className="text-base"><FontAwesomeIcon icon={faCalendar} /> イベント</h3>
                        </div>
                      </Link>
                    )}
                      <Link href={`/organization/${params.id}/member`}>
                        <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                          <h3 className="text-base"><FontAwesomeIcon icon={faUserGroup} /> オーガナイゼーションメンバー</h3>
                        </div>
                      </Link>
                    {owner && (
                      <>
                        <Link href={`/organization/${params.id}/permission`}>
                          <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                            <h3 className="text-base"><FontAwesomeIcon icon={faCircleCheck} /> 新規権限申請</h3>
                          </div>
                        </Link>
                        <Link href={`/organization/${params.id}/edit`}>
                          <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                            <h3 className="text-base"><FontAwesomeIcon icon={faGear} /> オーガナイゼーションの編集</h3>
                          </div>
                        </Link>
                      </>
                    )}
                    </div>
                  </>
                )}
                <Link href={`/organization`} className='text-center'>
                  <p className='text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]'>オーガナイゼーション選択へ戻る</p>
                </Link>
            </div>
        </main>
    );
}
