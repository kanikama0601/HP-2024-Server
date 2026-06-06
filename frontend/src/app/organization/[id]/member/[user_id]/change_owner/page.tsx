"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { fetchWithAuth } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loading } from '@/components/Loading';

export default function News({ params }: { params: { id: string, user_id: string }}) {

  const [loading, setLoading] = useState(false);
  const url = process.env.NEXT_PUBLIC_API_URL + `/organization/${params.id}/member/${params.user_id}/change_owner/`;
  const router = useRouter()

  const fetchData = async () => {
    try {
        const data = await fetchWithAuth(url, 'POST', { 'change_owner': true });
    } catch (error) {
        console.error('データ取得エラー:', error);
    } finally {
      router.push(`/organization/${params.id}/member`);
    }
  };

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
          <FontAwesomeIcon icon={faCrown} /> Change Owner
          </h2>
          <p className="text-sm mb-4">
            オーナーを譲渡
          </p>
        </div>
        <div className="container mx-auto text-xl md:w-6/12 w-full">
          <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100 text-center">
            <form onSubmit={handleSubmit}>
              <p>オーナーを譲渡しますか？</p>
              <button type="submit" className='m-6 p-4 border rounded-lg bg-gray-600 text-white'><FontAwesomeIcon icon={faArrowRightArrowLeft} /> 譲渡</button><br />
              <Link href={`/organization/${params.id}/member/${params.user_id}`}><p className='text-base'>キャンセル</p></Link>
            </form>
          </div>
        </div>
      </div>
    </main>
    );
}
