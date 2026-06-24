import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faCalendar, faPaperPlane, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchWithAuth } from '@/utils/api';
import { Loading } from '@/components/Loading';
import { Link } from 'react-router-dom';

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

export default function Event() {
  const { id } = useParams<{ id: string }>();

  const [sendLoading, setSendLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL + `/organization/${id}/event/new/`;
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [organizationPermissions, setOrganizationPermissions] = useState<string[]>([]);

  type LoginDataType = {
    title: string;
    place: string;
    detail: string;
    start: Date;
    end: Date;
    imageUrls: string[];
    is_karaoke: boolean;
    is_band: boolean;
    is_brassband: boolean;
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await fetchWithAuth(import.meta.env.VITE_API_URL + `/organization/${id}/`, 'GET');
        setPermissions(data['permissions']);
        setOrganizationPermissions(data['organization_permissions'] || []);
      } catch (error) {
        console.error('Permission fetch error:', error);
      }
    };
    fetchPermissions();
  }, [id]);

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
      navigate(`/organization/${id}/event`);
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
        const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/image/`, 'POST', formData);
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
              <FontAwesomeIcon icon={faCalendar} className="mr-2 text-blue-300" />New Event
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">イベント作成</p>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <input
                placeholder="タイトル"
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
              <input
                placeholder="場所"
                {...register('place', {
                  required: {
                    value: true,
                    message: '場所を入力してください',
                  },
                })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors.place?.message && <div className="text-red-500 text-sm mt-1">{errors.place.message}</div>}
            </div>
            <div className="mb-4">
              <textarea
                placeholder="詳細"
                {...register('detail', {
                  required: {
                    value: true,
                    message: '詳細を入力してください',
                  },
                })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 h-64"
              />
              {errors.detail?.message && <div className="text-red-500 text-sm mt-1">{errors.detail.message}</div>}
            </div>
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-1">開始日時</p>
              <input
                type="datetime-local"
                {...register('start', {
                  required: {
                    value: true,
                    message: '開始日時を入力してください',
                  },
                })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors.start?.message && <div className="text-red-500 text-sm mt-1">{errors.start.message}</div>}
            </div>
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-1">終了日時</p>
              <input
                type="datetime-local"
                {...register('end', {
                  required: {
                    value: true,
                    message: '終了日時を入力してください',
                  },
                })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors.end?.message && <div className="text-red-500 text-sm mt-1">{errors.end.message}</div>}
            </div>
            {organizationPermissions.includes('karaoke') && (permissions.includes('karaoke') || permissions.includes('inspection')) && (
              <div className='mb-4'>
                <label className='flex items-center space-x-2'>
                  <input type="checkbox" {...register('is_karaoke')} className='w-6 h-6' />
                  <span>カラオケ大会のイベントにする</span>
                </label>
              </div>
            )}
            {organizationPermissions.includes('band') && (permissions.includes('band') || permissions.includes('inspection')) && (
              <div className='mb-4'>
                <label className='flex items-center space-x-2'>
                  <input type="checkbox" {...register('is_band')} className='w-6 h-6' />
                  <span>軽音楽（バンド）のイベントにする</span>
                </label>
              </div>
            )}
            {organizationPermissions.includes('brassband') && permissions.includes('brassband') && (
              <div className='mb-4'>
                <label className='flex items-center space-x-2'>
                  <input type="checkbox" {...register('is_brassband')} className='w-6 h-6' />
                  <span>吹奏楽のイベントにする</span>
                </label>
              </div>
            )}
            <div className="mb-4">
              <div className="image-previews">
                {imageUrls.map((url, index) => (
                  <>
                    <img key={index} src={url} alt={`Preview ${index}`} className="w-full mb-2 rounded-lg" />
                    <button
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
              <FontAwesomeIcon icon={faPaperPlane} /> 作成
            </button>
          </form>
        </div>
        <Link to={`/organization/${id}/event`} className="mt-6 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> イベント一覧へ戻る
        </Link>
      </div>
    </main>
  );
}
