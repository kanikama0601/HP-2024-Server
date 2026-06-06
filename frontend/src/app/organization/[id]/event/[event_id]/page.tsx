"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faPaperPlane, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { set, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { fetchWithAuth } from '@/utils/api';
import { Loading } from '@/components/Loading';
import Link from 'next/link';

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

export default function Event({ params }: { params: { id: string, event_id: string }}) {

  const [sendLoading, setSendLoading] = useState(false);
  const [eventData, setEventData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + `/organization/${params.id}/event/${params.event_id}/`;

  type LoginDataType = {
    title: string;
    place: string;
    detail: string;
    start: Date;
    end: Date;
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
      router.push(`/organization/${params.id}/event`);
    } catch (error) {
      alert('エラー:' + error);
      setSendLoading(false);
    } finally {
    }
  };

  useEffect(() => {
		const fetchData = async () => {
				try {
						const data = await fetchWithAuth(apiUrl, 'GET');
            setEventData(data['event']);
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
    <main>
      {sendLoading && <Loading />}
      <div className="mx-3.5 my-10">
        <div className="container mx-auto text-white text-center m-12">
          <h2 className="text-3xl font-light text-shadow-md m-3">
          <FontAwesomeIcon icon={faCalendar} />  Edit Event
          </h2>
          <p className="text-sm mb-4">
          イベント編集
          </p>
        </div>
          {loading ? <Loading /> : (
          <div className="container mx-auto text-xl md:w-6/12 w-full">
            <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition dulation-100 text-center">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <input
                    placeholder="タイトル"
                    defaultValue={eventData[0]['title']}
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
                    defaultValue={eventData[0]['place']}
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
                    defaultValue={eventData[0]['detail']}
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
                    defaultValue={
                      eventData[0] && eventData[0]['start'] 
                        ? new Date(new Date(eventData[0]['start']).getTime() + 9 * 60 * 60 * 1000)
                            .toISOString()
                            .slice(0, 16)
                        : ''
                    }
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
                    defaultValue={
                      eventData[0] && eventData[0]['end'] 
                        ? new Date(new Date(eventData[0]['end']).getTime() + 9 * 60 * 60 * 1000)
                            .toISOString()
                            .slice(0, 16)
                        : ''
                    }
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
                <div>
                  <div className="image-previews">
                    {imageUrls.map((url, index) => (
                      <>
                        <img key={index} src={url} alt={`Preview ${index}`} className="w-11/12 m-2" />
                        <button
                            type='button'
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
                <button type="submit" className='m-6 p-4 border rounded-lg bg-gray-600 text-white'><FontAwesomeIcon icon={faPaperPlane} /> 編集</button>
              </form>
            </div>
          </div>
          )}
          <Link href={`/organization/${params.id}/event/${params.event_id}/delete`} className='bg-white-100'>
            <p className='text-center text-red-400 text-lg my-4'><FontAwesomeIcon icon={faTrashCan} /> イベントを削除</p>
          </Link>
        </div>
      </main>
  );
}