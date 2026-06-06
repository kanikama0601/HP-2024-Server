"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faPaperPlane, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { fetchWithAuth } from '@/utils/api';
import { Loading } from '@/components/Loading';
import { useState } from 'react';

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
}

export default function News({ params }: { params: { id: string, news_id: string }}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + `/organization/${params.id}/news/new/`;
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  type LoginDataType = {
    title: string;
    detail: string;
    show_top: boolean;
    important: boolean;
    imageUrls: string[];
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
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
    setLoading(false);
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    const csrftoken = Cookies.get('csrftoken') || '';
    
    try {
      const send_data = { ...data, imageUrls: imageUrls };
      const response = await fetchWithAuth(apiUrl, 'POST', send_data);
    } catch (error) {
      console.error('エラー:', error);
      alert('エラー:' + error);
    } finally {
      router.push(`/organization/${params.id}/news`);
    }
  };

  return (
    <main>
      {loading && <Loading />}
      <div className="mx-3.5 my-10">
        <div className="container mx-auto text-white text-center m-12">
          <h2 className="text-3xl font-light text-shadow-md m-3">
          <FontAwesomeIcon icon={faNewspaper} /> New News
          </h2>
          <p className="text-sm mb-4">
          お知らせ登録
          </p>
        </div>
          <div className="container mx-auto text-xl md:w-6/12 w-full">
            <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition dulation-100 text-center">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <input
                    placeholder="タイトル"
                    {...register('title', {
                      required: {
                        value: true, 
                        message: 'タイトルを入力してください',
                      },
                    })} 
                    className='w-11/12 m-4 p-4 border-2 rounded-lg'
                  />
                  {errors.title?.message && <div>{errors.title.message}</div>}
                </div>
                <div>
                  <textarea
                    placeholder="本文"
                    {...register('detail', {
                      required: {
                        value: true, 
                        message: '本文を入力してください',
                      },
                    })} 
                    className='w-11/12 m-4 p-4 border-2 rounded-lg h-64'
                  />
                  {errors.detail?.message && <div>{errors.detail.message}</div>}
                </div>
                <div className='text-left inline-block w-full'>
                  <input
                    type="checkbox"
                    {...register('show_top')} 
                    className='m-4 p-4 border-2 rounded-lg'
                  />
                  <label className='text-base'>トップページへ表示</label>
                  {errors.show_top?.message && <div>{errors.show_top.message}</div>}
                </div>
                <div className='text-left inline-block w-full'>
                  <input
                    type="checkbox"
                    {...register('important')} 
                    className='m-4 p-4 border-2 rounded-lg'
                  />
                  <label className='text-base'>重要なお知らせへ表示</label>
                  {errors.show_top?.message && <div>{errors.show_top.message}</div>}
                </div>
                <div>
                  <div className="image-previews">
                    {imageUrls.map((url, index) => (
                      <>
                        <img key={index} src={url} alt={`Preview ${index}`} className="w-11/12 m-2" />
                        <button
                            onClick={() => handleRemoveImage(index)}
                            className="m-4 p-2 border rounded-lg bg-red-600 text-white text-base"
                          >
                            <FontAwesomeIcon icon={faTrashCan} /> 画像削除
                        </button>
                      </>
                    ))}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className='w-11/12 m-4 p-4 border-2 rounded-lg'
                  />
                  <input type="hidden" value={JSON.stringify(imageUrls)} {...register('imageUrls')} />
                </div>
                <button type="submit" className='m-6 p-4 border rounded-lg bg-gray-600 text-white'><FontAwesomeIcon icon={faPaperPlane} /> 送信</button>
              </form>
            </div>
          </div>
        </div>
      </main>
  );
}