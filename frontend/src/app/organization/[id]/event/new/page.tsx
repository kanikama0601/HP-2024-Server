"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faCalendar, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/utils/api';
import { Loading } from '@/components/Loading';

interface Event {
  id: number;
  title: string;
  place: string;
  detail: string;
  start: string;
  end: string;
  organization__name: string;
  user__username: string;
}

export default function Event({ params }: { params: { id: string }}) {

  const [sendLoading, setSendLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + `/organization/${params.id}/event/new/`;
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);

  type LoginDataType = {
    title: string;
    place: string;
    detail: string;
    start: Date;
    end: Date;
    imageUrls: string[];
    is_karaoke: boolean;
    is_band: boolean;
  };

  const router = useRouter();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await fetchWithAuth(process.env.NEXT_PUBLIC_API_URL + `/organization/${params.id}/`, 'GET');
        setPermissions(data['permissions']);
      } catch (error) {
        console.error('Permission fetch error:', error);
      }
    };
    fetchPermissions();
  }, [params.id]);

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
    
    try {
      const send_data = { ...data, imageUrls: imageUrls };
      const response = await fetchWithAuth(apiUrl, 'POST', send_data);
    } catch (error) {
      alert('エラー:' + error);
      setSendLoading(false);
    } finally {
      router.push(`/organization/${params.id}/event`);
    }
  };

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
    <main>
      {sendLoading && <Loading />}
      <div className="mx-3.5 my-10">
        <div className="container mx-auto text-white text-center m-12">
          <h2 className="text-3xl font-light text-shadow-md m-3">
          <FontAwesomeIcon icon={faCalendar} />  New Event
          </h2>
          <p className="text-sm mb-4">
          イベント作成
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
                  <input
                    placeholder="場所"
                    {...register('place', {
                      required: {
                        value: true, 
                        message: '場所を入力してください',
                      },
                    })} 
                    className='w-11/12 m-4 p-4 border-2 rounded-lg'
                  />
                  {errors.place?.message && <div>{errors.place.message}</div>}
                </div>
                <div>
                  <textarea
                    placeholder="詳細"
                    {...register('detail', {
                      required: {
                        value: true, 
                        message: '詳細を入力してください',
                      },
                    })} 
                    className='w-11/12 m-4 p-4 border-2 rounded-lg h-64'
                  />
                  {errors.detail?.message && <div>{errors.detail.message}</div>}
                </div>
                <div className='text-left inline-block w-11/12'>
                  <p>開始日時</p>
                  <input
                    type="datetime-local"
                    {...register('start', {
                      required: {
                        value: true, 
                        message: '開始日時を入力してください',
                      },
                    })} 
                    className='my-4 p-4 border-2 rounded-lg w-full'
                  />
                  {errors.start?.message && <div>{errors.start.message}</div>}
                </div>
                <div className='text-left inline-block w-11/12'>
                  <p>終了日時</p>
                  <input
                    type="datetime-local"
                    {...register('end', {
                      required: {
                        value: true, 
                        message: '終了日時を入力してください',
                      },
                    })} 
                    className='my-4 p-4 border-2 rounded-lg w-full'
                  />
                  {errors.end?.message && <div>{errors.end.message}</div>}
                </div>
                {(permissions.includes('karaoke') || permissions.includes('inspection')) && (
                  <div className='text-left inline-block w-11/12 m-4'>
                    <label className='flex items-center space-x-2'>
                      <input type="checkbox" {...register('is_karaoke')} className='w-6 h-6' />
                      <span>カラオケ大会のイベントにする</span>
                    </label>
                  </div>
                )}
                {(permissions.includes('band') || permissions.includes('inspection')) && (
                  <div className='text-left inline-block w-11/12 m-4'>
                    <label className='flex items-center space-x-2'>
                      <input type="checkbox" {...register('is_band')} className='w-6 h-6' />
                      <span>軽音楽（バンド）のイベントにする</span>
                    </label>
                  </div>
                )}
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
                <button type="submit" className='m-6 p-4 border rounded-lg bg-gray-600 text-white'><FontAwesomeIcon icon={faPaperPlane} /> 作成</button>
              </form>
            </div>
          </div>
        </div>
      </main>
  );
}