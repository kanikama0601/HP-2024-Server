"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Loading } from '@/components/Loading';
import { useState } from 'react';

export default function Login() {

  type LoginDataType = {
    username: string;
    email: string;
    password: string;
    password2: string;
  };

  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/register/';
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
      if (response.ok) {
        alert('登録が完了しました。ログインしてください。');
        router.push('/login');
      } else if (contentType && contentType.includes('application/json')) {
        const responseData = await response.json();
        alert('登録に失敗しました: ' + JSON.stringify(responseData));
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
    <main>
      {loading && <Loading />}
      <div className="mx-3.5 my-10">
        <div className="container mx-auto text-white text-center m-12">
          <h2 className="text-3xl font-light text-shadow-md m-3">
          <FontAwesomeIcon icon={faUserPlus} /> Register
          </h2>
          <p className="text-sm mb-4">
          アカウント登録
          </p>
        </div>
          <div className="container mx-auto text-xl md:w-6/12 w-full">
            <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition dulation-100 text-center">
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
                    className='w-11/12 m-4 p-4 border-2 rounded-lg'
                  />
                  {errors.username?.message && <div>{errors.username.message}</div>}
                </div>
                <div>
                  <input
                    placeholder="Eメール"
                    {...register('email', {
                      required: {
                        value: true, 
                        message: 'Eメールアドレスを入力してください',
                      },
                    })} 
                    className='w-11/12 m-4 p-4 border-2 rounded-lg'
                  />
                  {errors.email?.message && <div>{errors.email.message}</div>}
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
                <div>
                  <input
                    id="password2"
                    placeholder="パスワード確認"
                    type="password"
                    {...register('password2', 
                      { 
                        required: {
                          value: true,
                          message: 'パスワードを再度入力してください'
                        },
                      }
                    )}
                    className='w-11/12 m-4 p-4 border-2 rounded-lg'
                  />
                  {errors.password2?.message && <div>{errors.password2.message}</div>}
                </div>
                <button type="submit" className='m-6 p-4 border rounded-lg bg-gray-600 text-white'><FontAwesomeIcon icon={faUserPlus} /> 登録</button>
              </form>
            </div>
          </div>
        </div>
      </main>
  );
}