"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faPaperPlane, faTrashCan, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, use } from 'react';
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
  is_karaoke: boolean;
  is_brassband: boolean;
  is_band: boolean;
  organization__name: string;
  user__username: string;
}

export default function Event({ params }: { params: Promise<{ id: string, event_id: string }>}) {
  const { id, event_id } = use(params);

  const [sendLoading, setSendLoading] = useState(false);
  const [eventData, setEventData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [organizationPermissions, setOrganizationPermissions] = useState<string[]>([]);
  const [karaokeSongs, setKaraokeSongs] = useState<any[]>([]);
  const [brassbandSongs, setBrassbandSongs] = useState<any[]>([]);
  const [bands, setBands] = useState<any[]>([]);
  const [logs, setLogs] = useState<{message: string, type: 'success' | 'error'}[]>([]);
  const [modalOpen, setModalOpen] = useState<'karaoke' | 'brassband' | 'band' | 'bandSong' | null>(null);
  const [modalData, setModalData] = useState<any>({});
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + `/organization/${id}/event/${event_id}/`;

  const addLog = (message: string, type: 'success' | 'error' = 'success') => {
    setLogs(prev => [{message, type}, ...prev].slice(0, 5));
  };

  type LoginDataType = {
    title: string;
    place: string;
    detail: string;
    start: Date;
    end: Date;
    imageUrls: string;
    is_karaoke: boolean;
    is_brassband: boolean;
    is_band: boolean;
  };

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
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
      router.push(`/organization/${id}/event`);
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
            if (data['event'][0]) {
              setValue('is_karaoke', data['event'][0]['is_karaoke']);
              setValue('is_brassband', data['event'][0]['is_brassband']);
              setValue('is_band', data['event'][0]['is_band']);

              if (data['event'][0]['is_karaoke']) {
                fetchWithAuth(apiUrl + 'karaoke/', 'GET').then(kData => setKaraokeSongs(kData['karaoke']));
              }
              if (data['event'][0]['is_brassband']) {
                fetchWithAuth(apiUrl + 'brassband/', 'GET').then(kData => setBrassbandSongs(kData['brassband']));
              }
              if (data['event'][0]['is_band']) {
                fetchWithAuth(apiUrl + 'band/', 'GET').then(bData => setBands(bData['band']));
              }
            }
				} catch (error) {
						console.error('データ取得エラー:', error);
				} finally {
						setLoading(false);
				}
		};

    const fetchPermissions = async () => {
      try {
        const data = await fetchWithAuth(process.env.NEXT_PUBLIC_API_URL + `/organization/${id}/`, 'GET');
        setPermissions(data['permissions']);
        setOrganizationPermissions(data['organization_permissions'] || []);
      } catch (error) {
        console.error('Permission fetch error:', error);
      }
    };

		fetchData();
    fetchPermissions();
}, [apiUrl, id, setValue]);

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

  const handleAddKaraoke = async (data: {name: string, artist?: string, sing_user: string, order: number}) => {
    setSendLoading(true);
    try {
      await fetchWithAuth(apiUrl + 'karaoke/new/', 'POST', data);
      addLog(`更新しました。(${data.name})`);
      const kData = await fetchWithAuth(apiUrl + 'karaoke/', 'GET');
      setKaraokeSongs(kData['karaoke']);
      setModalOpen(null);
    } catch (error) {
      addLog(`エラー: ${error}`, 'error');
    } finally {
      setSendLoading(false);
    }
  };

  const handleDeleteKaraoke = async (karaoke_id: number) => {
    if (confirm('削除しますか？')) {
      const song = karaokeSongs.find(s => s.id === karaoke_id);
      setSendLoading(true);
      try {
        await fetchWithAuth(apiUrl + `karaoke/${karaoke_id}/delete/`, 'POST');
        addLog(`削除しました。(${song?.name})`);
        const kData = await fetchWithAuth(apiUrl + 'karaoke/', 'GET');
        setKaraokeSongs(kData['karaoke']);
      } catch (error) {
        addLog(`エラー: ${error}`, 'error');
      } finally {
        setSendLoading(false);
      }
    }
  };

  const handleAddBrassBand = async (data: {name: string, artist: string, order: number, performance_time?: string}) => {
    setSendLoading(true);
    try {
      await fetchWithAuth(apiUrl + 'brassband/new/', 'POST', data);
      addLog(`更新しました。(${data.name})`);
      const kData = await fetchWithAuth(apiUrl + 'brassband/', 'GET');
      setBrassbandSongs(kData['brassband']);
      setModalOpen(null);
    } catch (error) {
      addLog(`エラー: ${error}`, 'error');
    } finally {
      setSendLoading(false);
    }
  };

  const handleDeleteBrassBand = async (brassband_id: number) => {
    if (confirm('削除しますか？')) {
      const song = brassbandSongs.find(s => s.id === brassband_id);
      setSendLoading(true);
      try {
        await fetchWithAuth(apiUrl + `brassband/${brassband_id}/delete/`, 'POST');
        addLog(`削除しました。(${song?.name})`);
        const kData = await fetchWithAuth(apiUrl + 'brassband/', 'GET');
        setBrassbandSongs(kData['brassband']);
      } catch (error) {
        addLog(`エラー: ${error}`, 'error');
      } finally {
        setSendLoading(false);
      }
    }
  };

  const handleAddBand = async (data: {name: string, order: number, performance_time?: string}) => {
    setSendLoading(true);
    try {
      await fetchWithAuth(apiUrl + 'band/new/', 'POST', data);
      addLog(`更新しました。(${data.name})`);
      const bData = await fetchWithAuth(apiUrl + 'band/', 'GET');
      setBands(bData['band']);
      setModalOpen(null);
    } catch (error) {
      addLog(`エラー: ${error}`, 'error');
    } finally {
      setSendLoading(false);
    }
  };

  const handleDeleteBand = async (band_id: number) => {
    if (confirm('削除しますか？')) {
      const band = bands.find(b => b.id === band_id);
      setSendLoading(true);
      try {
        await fetchWithAuth(apiUrl + `band/${band_id}/delete/`, 'POST');
        addLog(`削除しました。(${band?.name})`);
        const bData = await fetchWithAuth(apiUrl + 'band/', 'GET');
        setBands(bData['band']);
      } catch (error) {
        addLog(`エラー: ${error}`, 'error');
      } finally {
        setSendLoading(false);
      }
    }
  };

  const handleAddBandSong = async (data: {name: string, artist?: string, order: number, band_id: number}) => {
    setSendLoading(true);
    try {
      await fetchWithAuth(apiUrl + `band/${data.band_id}/song/new/`, 'POST', {name: data.name, artist: data.artist || '', order: data.order});
      addLog(`更新しました。(${data.name})`);
      const bData = await fetchWithAuth(apiUrl + 'band/', 'GET');
      setBands(bData['band']);
      setModalOpen(null);
    } catch (error) {
      addLog(`エラー: ${error}`, 'error');
    } finally {
      setSendLoading(false);
    }
  };

  const handleDeleteBandSong = async (band_id: number, song_id: number) => {
    if (confirm('削除しますか？')) {
      const band = bands.find(b => b.id === band_id);
      const song = band?.songs.find((s: any) => s.id === song_id);
      setSendLoading(true);
      try {
        await fetchWithAuth(apiUrl + `band/${band_id}/song/${song_id}/delete/`, 'POST');
        addLog(`削除しました。(${song?.name})`);
        const bData = await fetchWithAuth(apiUrl + 'band/', 'GET');
        setBands(bData['band']);
      } catch (error) {
        addLog(`エラー: ${error}`, 'error');
      } finally {
        setSendLoading(false);
      }
    }
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
              <FontAwesomeIcon icon={faCalendar} className="mr-2 text-blue-300" />Edit Event
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">イベント編集</p>
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
                    defaultValue={eventData[0]['title']}
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
                    defaultValue={eventData[0]['place']}
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
                    defaultValue={eventData[0]['detail']}
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
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  {errors.start?.message && <div className="text-red-500 text-sm mt-1">{errors.start.message}</div>}
                </div>
                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-1">終了日時</p>
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
                {organizationPermissions.includes('brassband') && permissions.includes('brassband') && (
                  <div className='mb-4'>
                    <label className='flex items-center space-x-2'>
                      <input type="checkbox" {...register('is_brassband')} className='w-6 h-6' />
                      <span>吹奏楽のイベントにする</span>
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

              {eventData[0]['is_karaoke'] && (
                <div className='mt-10 border-t pt-10'>
                  <h3 className='text-xl mb-4'>カラオケ大会 楽曲管理</h3>
                  <table className='w-full text-sm text-left text-gray-500'>
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                      <tr>
                        <th className='px-4 py-2'>順番</th>
                        <th className='px-4 py-2'>曲名</th>
                        <th className='px-4 py-2'>アーティスト</th>
                        <th className='px-4 py-2'>歌唱者</th>
                        <th className='px-4 py-2'>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {karaokeSongs.map((song) => (
                        <tr key={song.id} className='bg-white border-b'>
                          <td className='px-4 py-2'>{song.order}</td>
                          <td className='px-4 py-2 font-bold text-gray-900'>{song.name}</td>
                          <td className='px-4 py-2'>{song.artist || '-'}</td>
                          <td className='px-4 py-2'>{song.sing_user}</td>
                          <td className='px-4 py-2'>
                            <button onClick={() => handleDeleteKaraoke(song.id)} className='text-red-500'>削除</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button type="button" onClick={() => {
                    const nextOrder = karaokeSongs.length > 0 ? Math.max(...karaokeSongs.map(s => s.order)) + 1 : 1;
                    setModalData({order: nextOrder});
                    setModalOpen('karaoke');
                  }} className='mt-4 p-2 bg-blue-500 text-white text-base rounded'>楽曲追加</button>
                  <div className='mt-4 text-left'>
                    {logs.map((log, i) => (
                      <p key={i} className={`text-sm ${log.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{log.message}</p>
                    ))}
                  </div>
                </div>
              )}

              {eventData[0]['is_brassband'] && (
                <div className='mt-10 border-t pt-10'>
                  <h3 className='text-xl mb-4'>吹奏楽 楽曲管理</h3>
                  <table className='w-full text-sm text-left text-gray-500'>
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                      <tr>
                        <th className='px-4 py-2'>順番</th>
                        <th className='px-4 py-2'>曲名</th>
                        <th className='px-4 py-2'>アーティスト</th>
                        <th className='px-4 py-2'>演奏開始時刻</th>
                        {permissions.includes('brassband') && (
                          <th className='px-4 py-2'>操作</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {brassbandSongs.map((song) => (
                        <tr key={song.id} className='bg-white border-b'>
                          <td className='px-4 py-2'>{song.order}</td>
                          <td className='px-4 py-2 font-bold text-gray-900'>{song.name}</td>
                          <td className='px-4 py-2'>{song.artist}</td>
                          <td className='px-4 py-2'>{song.performance_time ? song.performance_time.slice(0, 5) : '-'}</td>
                          {permissions.includes('brassband') && (
                            <td className='px-4 py-2'>
                              <button onClick={() => handleDeleteBrassBand(song.id)} className='text-red-500'>削除</button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {permissions.includes('brassband') && (
                    <button type="button" onClick={() => {
                      const nextOrder = brassbandSongs.length > 0 ? Math.max(...brassbandSongs.map(s => s.order)) + 1 : 1;
                      setModalData({order: nextOrder});
                      setModalOpen('brassband');
                    }} className='mt-4 p-2 bg-blue-500 text-white text-base rounded'>楽曲追加</button>
                  )}
                  <div className='mt-4 text-left'>
                    {logs.map((log, i) => (
                      <p key={i} className={`text-sm ${log.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{log.message}</p>
                    ))}
                  </div>
                </div>
              )}

              {eventData[0]['is_band'] && (
                <div className='mt-10 border-t pt-10'>
                  <h3 className='text-xl mb-4'>軽音楽 バンド・楽曲管理</h3>
                  {bands.map((band) => (
                    <div key={band.id} className='bg-gray-100 p-4 my-4 rounded text-left'>
                      <div className='flex justify-between items-center mb-2'>
                        <h4 className='text-lg font-bold'>[{band.order}] {band.name}{band.performance_time ? <span className='ml-2 text-sm font-normal text-gray-600'>開始: {band.performance_time}</span> : ''}</h4>
                        <button type="button" onClick={() => handleDeleteBand(band.id)} className='text-red-500 text-sm'>バンド削除</button>
                      </div>
                      <div className='pl-4 border-l-2'>
                        <table className='w-full text-xs text-left text-gray-500'>
                          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                            <tr>
                              <th className='px-2 py-1'>順番</th>
                              <th className='px-2 py-1'>曲名</th>
                              <th className='px-2 py-1'>アーティスト</th>
                              <th className='px-2 py-1'>操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {band.songs.map((song: any) => (
                              <tr key={song.id} className='bg-white border-b'>
                                <td className='px-2 py-1'>{song.order}</td>
                                <td className='px-2 py-1 font-bold text-gray-900'>{song.name}</td>
                                <td className='px-2 py-1'>{song.artist || '-'}</td>
                                <td className='px-2 py-1'>
                                  <button type="button" onClick={() => handleDeleteBandSong(band.id, song.id)} className='text-red-500'>削除</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button type="button" onClick={() => {
                          const nextOrder = band.songs.length > 0 ? Math.max(...band.songs.map((s: any) => s.order)) + 1 : 1;
                          setModalData({order: nextOrder, band_id: band.id});
                          setModalOpen('bandSong');
                        }} className='mt-2 p-1 bg-green-500 text-white text-xs rounded'>曲追加</button>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => {
                    const nextOrder = bands.length > 0 ? Math.max(...bands.map(b => b.order)) + 1 : 1;
                    setModalData({order: nextOrder});
                    setModalOpen('band');
                  }} className='mt-4 p-2 bg-blue-500 text-white text-base rounded'>バンド追加</button>
                  <div className='mt-4 text-left'>
                    {logs.map((log, i) => (
                      <p key={i} className={`text-sm ${log.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{log.message}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {modalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3">
                  <h3 className="text-xl mb-4 font-bold">
                    {modalOpen === 'karaoke' ? 'カラオケ楽曲追加' : modalOpen === 'brassband' ? '吹奏楽曲追加' : modalOpen === 'band' ? 'バンド追加' : '楽曲追加'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">順番</label>
                      <input
                        type="number"
                        value={modalData.order || ''}
                        onChange={(e) => setModalData({...modalData, order: parseInt(e.target.value)})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{modalOpen === 'band' ? 'バンド名' : '曲名'}</label>
                      <input
                        type="text"
                        value={modalData.name || ''}
                        onChange={(e) => setModalData({...modalData, name: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    {modalOpen === 'karaoke' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">アーティスト名</label>
                        <input
                          type="text"
                          value={modalData.artist || ''}
                          onChange={(e) => setModalData({...modalData, artist: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                    )}
                    {modalOpen === 'karaoke' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">歌唱者</label>
                        <input
                          type="text"
                          value={modalData.sing_user || ''}
                          onChange={(e) => setModalData({...modalData, sing_user: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                    )}
                    {modalOpen === 'brassband' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">アーティスト</label>
                        <input
                          type="text"
                          value={modalData.artist || ''}
                          onChange={(e) => setModalData({...modalData, artist: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                    )}
                    {modalOpen === 'brassband' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">演奏開始時刻</label>
                        <input
                          type="time"
                          value={modalData.performance_time || ''}
                          onChange={(e) => setModalData({...modalData, performance_time: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                    )}
                    {modalOpen === 'band' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">演奏開始時刻</label>
                        <input
                          type="time"
                          value={modalData.performance_time || ''}
                          onChange={(e) => setModalData({...modalData, performance_time: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                    )}
                    {modalOpen === 'bandSong' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">アーティスト名</label>
                        <input
                          type="text"
                          value={modalData.artist || ''}
                          onChange={(e) => setModalData({...modalData, artist: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setModalOpen(null)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={() => {
                        if (modalOpen === 'karaoke') handleAddKaraoke(modalData);
                        else if (modalOpen === 'brassband') handleAddBrassBand(modalData);
                        else if (modalOpen === 'band') handleAddBand(modalData);
                        else if (modalOpen === 'bandSong') handleAddBandSong(modalData);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      追加
                    </button>
                  </div>
                </div>
              </div>
            )}

            <Link href={`/organization/${id}/event/${event_id}/delete`} className="mt-6 flex items-center justify-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors">
              <FontAwesomeIcon icon={faTrashCan} /> イベントを削除
            </Link>
            <Link href={`/organization/${id}/event`} className="mt-4 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
              <FontAwesomeIcon icon={faChevronLeft} /> イベント一覧へ戻る
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
