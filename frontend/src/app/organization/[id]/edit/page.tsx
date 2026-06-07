"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPencil } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { fetchWithAuth } from '@/utils/api';
import { Loading } from '@/components/Loading';
import Link from 'next/link';

export default function News({ params }: { params: { id: string }}) {

  const [organization, setOrganization] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + `/organization/${params.id}/edit/`;

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
    router.push(`/organization/${params.id}`);
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
    <main>
      {sendLoading && <Loading />}
      <div className="mx-3.5 my-10">
        <div className="container mx-auto text-white text-center m-12">
          <h2 className="text-3xl font-light text-shadow-md m-3">
          <FontAwesomeIcon icon={faPencil} /> Edit Organization
          </h2>
          <p className="text-sm mb-4">
          オーガナイゼーションの編集
          </p>
        </div>
          {loading ? <Loading /> : (
          <div className="container mx-auto text-xl md:w-6/12 w-full">
            <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition dulation-100 text-center">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <input
                    placeholder="Organization"
                    defaultValue={organization[0]['name']}
                    {...register('name', {
                      required: {
                        value: true, 
                        message: 'オーガナイゼーションの名前を入力してください',
                      },
                    })} 
                    className='w-11/12 m-4 p-4 border-2 rounded-lg'
                  />
                  {errors.name?.message && <div>{errors.name.message}</div>}
                </div>
                <button type="submit" className='m-6 p-4 border rounded-lg bg-gray-600 text-white'><FontAwesomeIcon icon={faPencil} /> 変更</button>
              </form>
            </div>
          </div>
          )}
          <Link href={`/organization/${params.id}/delete`} className='bg-white-100'>
            <p className='text-center text-red-400 text-lg my-4'><FontAwesomeIcon icon={faTrashCan} /> オーガナイゼーションを削除</p>
          </Link>
        </div>
      </main>
  );
}
