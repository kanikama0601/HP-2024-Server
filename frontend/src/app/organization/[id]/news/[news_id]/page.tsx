"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faPaperPlane, faTrashCan, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, use } from 'react';
import { set, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { fetchWithAuth } from '@/utils/api';
import { Loading } from '@/components/Loading';
import Link from 'next/link';

interface News {
  id: number;
  title: string;
  detail: string;
  show_top: boolean;
  important: boolean;
  organization__name: string;
  user__username: string;
  created_at: string;
  updated_at: string;
  images__image__image: string[];
}

export default function News({ params }: { params: Promise<{ id: string, news_id: string }>}) {
  const { id, news_id } = use(params);

  const [sendLoading, setSendLoading] = useState(false);
  const [newsData, setNewsData] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + `/organization/${id}/news/${news_id}/`;

  type LoginDataType = {
    title: string;
    detail: string;
    show_top: boolean;
    important: boolean;
    imageUrls: string;
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
    setSendLoading(true);
    const csrftoken = Cookies.get('csrftoken') || '';

    try {
      const send_data = { ...data, imageUrls: imageUrls };
      const response = await fetchWithAuth(apiUrl, 'POST', send_data);
    } catch (error) {
      console.error('エラー:', error);
      alert('エラー:' + error);
    } finally {
      router.push(`/organization/${id}/news`);
    }
  };

  useEffect(() => {
		const fetchData = async () => {
				try {
						const data = await fetchWithAuth(apiUrl, 'GET');
            setNewsData(data['news']);
            if (data['image']) {
              setImageUrls(data['image']);
            } else {
              setImageUrls([]);
            }
				} catch (error) {
						console.error('データ取得エラー:', error);
				} finally {
						setLoading(false);
				}
		};

		fetchData();
}, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSendLoading(true);
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);

      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/image/`, 'POST', formData);
        setImageUrls(prevUrls => [...prevUrls, response['image']]);
      } catch (error) {
        alert('画像アップロードエラー:' + error);
      }
    }
    setSendLoading(false);
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };

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
              <FontAwesomeIcon icon={faNewspaper} className="mr-2 text-blue-300" />Edit News
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">お知らせ編集</p>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {loading ? <Loading /> : (
          <>
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <input
                    placeholder="タイトル"
                    defaultValue={newsData[0]['title']}
                    {...register('title', {
                      required: {
                        value: true,
                        message: 'タイトルを入力してください',
                      },
                    })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  {errors.title?.message && <div className="text-red-500 text-sm mt-1">{errors.title.message}</div>}
                </div>
                <div className="mb-4">
                  <textarea
                    placeholder="本文"
                    defaultValue={newsData[0]['detail']}
                    {...register('detail', {
                      required: {
                        value: true,
                        message: '本文を入力してください',
                      },
                    })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 h-64"
                  />
                  {errors.detail?.message && <div className="text-red-500 text-sm mt-1">{errors.detail.message}</div>}
                </div>
                <div className='mb-3'>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked={newsData[0]['show_top']}
                      {...register('show_top')}
                      className='w-5 h-5'
                    />
                    <span className='text-sm text-slate-700'>トップページへ表示</span>
                  </label>
                  {errors.show_top?.message && <div className="text-red-500 text-sm mt-1">{errors.show_top.message}</div>}
                </div>
                <div className='mb-4'>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked={newsData[0]['important']}
                      {...register('important')}
                      className='w-5 h-5'
                    />
                    <span className='text-sm text-slate-700'>重要なお知らせへ表示</span>
                  </label>
                </div>
                <div className="mb-4">
                  <div className="image-previews">
                    {imageUrls.map((url, index) => (
                      <>
                        <img key={index} src={url} alt={`Preview ${index}`} className="w-full mb-2 rounded-lg" />
                        <button
                            type='button'
                            onClick={() => handleRemoveImage(index)}
                            className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors mb-2"
                          >
                            <FontAwesomeIcon icon={faTrashCan} className="mr-1" /> 画像削除
                        </button>
                      </>
                    ))}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full p-3 border border-slate-200 rounded-xl"
                  />
                  <input type="hidden" value={JSON.stringify(imageUrls)} {...register('imageUrls')} />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faPaperPlane} /> 編集
                </button>
              </form>
            </div>

            <Link href={`/organization/${id}/news/${news_id}/delete`} className="mt-6 flex items-center justify-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors">
              <FontAwesomeIcon icon={faTrashCan} /> お知らせを削除
            </Link>
            <Link href={`/organization/${id}/news`} className="mt-4 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
              <FontAwesomeIcon icon={faChevronLeft} /> お知らせ一覧へ戻る
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
