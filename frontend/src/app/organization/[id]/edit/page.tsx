"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPencil, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, use } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { fetchWithAuth } from '@/utils/api';
import { Loading } from '@/components/Loading';
import Link from 'next/link';

export default function News({ params }: { params: Promise<{ id: string }>}) {
  const { id } = use(params);

  const [organization, setOrganization] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + `/organization/${id}/edit/`;

  type OrganizationName = {
    name: string;
  };

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationName>({
    reValidateMode: 'onSubmit',
  });

  let count: number = 0;

  const onSubmit = async (data: any) => {
    setSendLoading(true);
    const csrftoken = Cookies.get('csrftoken') || '';

    try {
      const response = await fetchWithAuth(apiUrl, 'POST', data);
    } catch (error) {
      console.error('エラー:', error);
      alert('エラー:' + error);
      setSendLoading(false);
      return;
    }
    router.push(`/organization/${id}`);
  };

  useEffect(() => {
		const fetchData = async () => {
				try {
						const data = await fetchWithAuth(apiUrl, 'GET');
            setOrganization(data['organization']);
				} catch (error) {
						console.error('データ取得エラー:', error);
				} finally {
						setLoading(false);
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
              <FontAwesomeIcon icon={faPencil} className="mr-2 text-blue-300" />Edit Organization
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">オーガナイゼーションの編集</p>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {loading ? <Loading /> : (
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <input
                  placeholder="Organization"
                  defaultValue={organization[0]['name']}
                  {...register('name', {
                    required: {
                      value: true,
                      message: 'オーガナイゼーションの名前を入力してください',
                    },
                  })}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.name?.message && <div className="text-red-500 text-sm mt-1">{errors.name.message}</div>}
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faPencil} /> 変更
              </button>
            </form>
          </div>
        )}
        <Link href={`/organization/${id}/delete`} className="mt-6 flex items-center justify-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors">
          <FontAwesomeIcon icon={faTrashCan} /> オーガナイゼーションを削除
        </Link>
        <Link href={`/organization/${id}`} className="mt-4 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> オーガナイゼーションメニューへ戻る
        </Link>
      </div>
    </main>
  );
}
