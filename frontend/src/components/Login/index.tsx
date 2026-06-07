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
          Cookies.set('username', data['username'], { expires: 7, path: '/' });
          window.dispatchEvent(new Event('auth-changed'));
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-3.5 my-10">
      {loading && <Loading />}
      <div className="container mx-auto text-center m-12">
        <h2 className="text-3xl font-light tracking-[0.12em] text-neutral-950 m-3">
        <FontAwesomeIcon icon={faArrowRightToBracket} /> Login
        </h2>
        <p className="text-sm mb-4 text-neutral-500">
        ログイン
        </p>
      </div>
				<div className="container mx-auto text-xl md:w-6/12 w-full">
						<div className="glass-panel w-full p-6 rounded-[2rem] py-8 my-4 text-center">
              <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  placeholder="ユーザーネーム"
                  {...register('username', {
                    required: {
                      value: true, 
                      message: 'ユーザーネームを入力してください',
                    },
                  })} 
                  className='w-11/12 m-4 p-4 rounded-2xl border border-neutral-200 bg-white/80 text-neutral-950 outline-none transition focus:border-neutral-900'
                />
                {errors.username?.message && <div className="text-sm text-neutral-700">{errors.username.message}</div>}
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
                  className='w-11/12 m-4 p-4 rounded-2xl border border-neutral-200 bg-white/80 text-neutral-950 outline-none transition focus:border-neutral-900'
                />
                {errors.password?.message && <div className="text-sm text-neutral-700">{errors.password.message}</div>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className='m-6 px-6 py-3 rounded-full bg-neutral-950 text-white transition hover:bg-neutral-700 disabled:opacity-60 disabled:cursor-not-allowed'
              >
                <FontAwesomeIcon icon={faLockOpen} /> ログイン
              </button>
            </form>
            <Link href={`/register`} className="text-sm text-neutral-600 transition hover:text-neutral-950">
              <FontAwesomeIcon icon={faUserPlus} /> アカウントをお持ちでない場合
            </Link>
					</div>
        </div>
      </div>
  );
}
