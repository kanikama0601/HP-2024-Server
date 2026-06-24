import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Loading } from '@/components/Loading';
import { useState } from 'react';

export default function RegisterPage() {
  type RegisterDataType = {
    username: string;
    email: string;
    password: string;
    password2: string;
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDataType>({
    reValidateMode: 'onSubmit',
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL + '/register/';
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
        navigate('/login');
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
    <main className="pb-16">
      {loading && <Loading />}

      {/* Page hero */}
      <div className="relative bg-blue-900 text-white py-14 overflow-hidden">
        <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full border-[3px] border-blue-600/30" />
        <div className="pointer-events-none absolute left-8 bottom-0 w-14 h-14 rotate-45 bg-blue-700/30 translate-y-7" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-1 h-6 rounded-full bg-blue-400" />
            <h1 className="text-3xl font-bold tracking-[0.1em]">
              <FontAwesomeIcon icon={faUserPlus} className="mr-2 text-blue-300" />Register
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">アカウント登録</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="card-panel rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5 tracking-wider">
                ユーザーネーム
              </label>
              <input
                placeholder="username"
                {...register('username', { required: 'ユーザーネームを入力してください' })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800
                  outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              {errors.username?.message && (
                <p className="mt-1.5 text-xs text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5 tracking-wider">
                Eメール
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                {...register('email', { required: 'Eメールアドレスを入力してください' })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800
                  outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              {errors.email?.message && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5 tracking-wider">
                パスワード
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', { required: 'パスワードを入力してください' })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800
                  outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              {errors.password?.message && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5 tracking-wider">
                パスワード確認
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password2', { required: 'パスワードを再度入力してください' })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800
                  outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              {errors.password2?.message && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password2.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white
                transition hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faUserPlus} /> 登録
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
              <FontAwesomeIcon icon={faArrowRightToBracket} className="text-xs" />
              すでにアカウントをお持ちの場合
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
