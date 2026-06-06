"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faUserPlus, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Loading } from '@/components/Loading';

export default function Login() {

  const [loading, setLoading] = useState(false);

  type LoginDataType = {
    username: string;
    password: string;
  };

  const router = useRouter();

  const { 
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDataType>({
    reValidateMode: 'onSubmit',
  });

  let count: number = 0;

  const onSubmit = async (data: any) => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/auth/jwt/create/';
    const csrftoken = Cookies.get('csrftoken') || '';
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const responseData = await response.json();
        if (response.ok) {
          Cookies.set('access', responseData['access'], { expires: 1 / 24, path: '/' });
          Cookies.set('refresh', responseData['refresh'], { expires: 7, path: '/' });
          router.push('/organization');
        } else {
          alert('ログインに失敗しました');
        }
      } else {
        throw new Error('JSONではないレスポンスが返されました');
      }
    } catch (error) {
      console.error('エラー:', error);
      alert('エラー:' + error);
    }
  };

  return (
    <div className="mx-3.5 my-10">
      {loading && <Loading />}
      <div className="container mx-auto text-white text-center m-12">
        <h2 className="text-3xl font-light text-shadow-md m-3">
        <FontAwesomeIcon icon={faArrowRightToBracket} /> Login
        </h2>
        <p className="text-sm mb-4">
        ログイン
        </p>
      </div>
				<div className="container mx-auto text-xl md:w-6/12 w-full">
						<div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition dulation-100 text-center"><form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  placeholder="ユーザーネーム"
                  {...register('username', {
                    required: {
                      value: true, 
                      message: 'ユーザーネームを入力してください',
                    },
                  })} 
                  className='w-11/12 m-4 p-4 border-2 rounded-lg'
                />
                {errors.username?.message && <div>{errors.username.message}</div>}
              </div>
              <div>
                <input
                  id="password"
                  placeholder="パスワード"
                  type="password"
                  {...register('password', 
                    { 
                      required: {
                        value: true,
                        message: 'パスワードを入力してください'
                      },
                    }
                  )}
                  className='w-11/12 m-4 p-4 border-2 rounded-lg'
                />
                {errors.password?.message && <div>{errors.password.message}</div>}
              </div>
              <button type="submit" className='m-6 p-4 border rounded-lg bg-gray-600 text-white'><FontAwesomeIcon icon={faLockOpen} /> ログイン</button>
            </form>
            <Link href={`/register`}><FontAwesomeIcon icon={faUserPlus} /> アカウントをお持ちでない場合</Link>
					</div>
        </div>
      </div>
  );
}