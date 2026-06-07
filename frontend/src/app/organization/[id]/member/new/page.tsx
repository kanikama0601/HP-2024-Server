"use client";

import Link from 'next/link';
import { useState } from 'react';
import { fetchWithAuth } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Loading } from '@/components/Loading';

export default function News({ params }: { params: { id: string }}) {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState('');
  const url = process.env.NEXT_PUBLIC_API_URL + `/organization/${params.id}/member/new/`;
  const router = useRouter();

  const fetchData = async () => {
    try {
        const data = await fetchWithAuth(url, 'POST', { 'username': user });
        router.push(`/organization/${params.id}/member`);
    } catch (error) {
        console.error('データ取得エラー:', error);
        setLoading(false);
        return;
    } finally {
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser(event.target.value);
  }

  const handleSubmit = (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault();
    fetchData();
  };

    return (
      <main>
      {loading && <Loading />}
      <div className="mx-3.5 my-10">
        <div className="container mx-auto text-white text-center m-12">
          <h2 className="text-3xl font-light text-shadow-md m-3">
          <FontAwesomeIcon icon={faUserPlus} /> Invite Member
          </h2>
          <p className="text-sm mb-4">
            メンバーを招待
          </p>
        </div>
        <div className="container mx-auto text-xl md:w-6/12 w-full">
          <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100 text-center">
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  placeholder="username"
                  onChange={handleInputChange}
                  className='w-11/12 m-4 p-4 border-2 rounded-lg'
                />
              </div>
              <button type="submit" className='m-6 p-4 border rounded-lg bg-gray-600 text-white'><FontAwesomeIcon icon={faUserPlus} /> 招待</button>
            </form>
          </div>
        </div>
      </div>
      <Link href={`/organization/${params.id}/member`} className='text-center'>
        <p className='text-white'>メンバー管理へ戻る</p>
      </Link>
    </main>
    );
}
