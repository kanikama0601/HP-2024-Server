"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faUserPlus, faCrown, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { Loading } from '@/components/Loading';
import { fetchWithAuth } from '@/utils/api';

interface Member {
  id: number;
  username: string;
  permissions: string[];
}

export default function News({ params }: { params: Promise<{ id: string }>}) {
  const { id } = use(params);

  const [addData, setAddData] = useState([]);
  const [memberData, setMemberData] = useState<Member[]>([]);
  const [organizationData, setOrganizationData] = useState([]);
  const [organizationLoading, setOrganizationLoading] = useState(true);
  const url = process.env.NEXT_PUBLIC_API_URL + `/organization/${id}/member/`;

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
              <FontAwesomeIcon icon={faUserGroup} className="mr-2 text-blue-300" />
              {!organizationLoading && organizationData[0] ? organizationData[0]['name'] : 'Organization'}
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">メンバー管理</p>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {organizationLoading ? (<Loading />) : (
          <>
            {memberData && memberData.map((member) => (
              <Link key={member['id']} href={`/organization/${id}/member/${member['id']}`}>
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all mb-4">
                  <h3 className="text-base font-medium text-slate-800">{member['username']}</h3>
                  {organizationData[0]['owner_id'] === member['id'] && (
                    <p className='text-xs mt-2 text-slate-600'><FontAwesomeIcon icon={faCrown} className="mr-1" />オーガナイゼーションオーナー</p>
                  )}
                  <p className='text-xs mt-2 text-slate-500'>
                    権限: {member['permissions'][0] !== "" && member['permissions'].length !== 0 ? member['permissions'].map((permission: any) => `${permission} `).join('') : (<span>なし</span>)}
                  </p>
                </div>
              </Link>
            ))}
          </>
        )}
        {addData && (
          <Link href={`/organization/${id}/member/new`} className="mt-2 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
            <FontAwesomeIcon icon={faUserPlus} /> メンバーを招待
          </Link>
        )}
        <Link href={`/organization/${id}`} className="mt-4 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> オーガナイゼーションメニューへ戻る
        </Link>
      </div>
    </main>
  );
}
