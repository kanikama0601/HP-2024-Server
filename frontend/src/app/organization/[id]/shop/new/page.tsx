"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPaperPlane, faShop, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useState, use } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/utils/api';
import { Loading } from '@/components/Loading';
import Link from 'next/link';

interface Shop {
  id: number;
  name: string;
  address: string;
  detail: string;
  organization__name: string;
  user__username: string;
}

interface Menu {
  id: number;
  name: string;
  price: number;
}

export default function Shop({ params }: { params: Promise<{ id: string }>}) {
  const { id } = use(params);

  const [sendLoading, setSendLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + `/organization/${id}/shop/new/`;
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);

  type LoginDataType = {
    name: string;
    address: string;
    detail: string;
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

  const addMenu = () => {
    setMenus([...menus, { id: 0, name: '', price: 0 }]);
  };

  const updateMenu = (index: number, field: keyof Menu, value: string | number) => {
    const updatedMenus = menus.map((menu, i) =>
      i === index ? { ...menu, [field]: value } : menu
    );
    setMenus(updatedMenus);
  };

  const removeMenu = (index: number) => {
    setMenus(menus.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    setSendLoading(true);

    try {
      const send_data = { ...data, imageUrls: imageUrls, menus: menus };
      const response = await fetchWithAuth(apiUrl, 'POST', send_data);
    } catch (error) {
      alert('エラー:' + error);
      setSendLoading(false);
      return;
    } finally {
    }
    router.push(`/organization/${id}/shop`);
  };

  const handleImageUpload = async (Shop: React.ChangeEvent<HTMLInputElement>) => {
    setSendLoading(true);
    const files = Shop.target.files;
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
              <FontAwesomeIcon icon={faShop} className="mr-2 text-blue-300" />New Shop
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">模擬店作成</p>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <input
                placeholder="店名"
                {...register('name', {
                  required: {
                    value: true,
                    message: 'タイトルを入力してください',
                  },
                })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors.name?.message && <div className="text-red-500 text-sm mt-1">{errors.name.message}</div>}
            </div>
            <div className="mb-4">
              <input
                placeholder="場所"
                {...register('address', {
                  required: {
                    value: true,
                    message: '場所を入力してください',
                  },
                })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors.address?.message && <div className="text-red-500 text-sm mt-1">{errors.address.message}</div>}
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
            <div className='mb-4'>
              <h3 className="text-base font-medium text-slate-700 mb-2">メニュー</h3>
              {menus && menus.map((menu, index) => (
                <div key={index} className="menu-item flex flex-wrap gap-2 mb-2 items-center">
                  <input
                    type='hidden'
                    value={menu.id}
                    onChange={(e) => updateMenu(index, 'id', e.target.value)}
                  />
                  <input
                    placeholder="メニュー名"
                    value={menu.name}
                    onChange={(e) => updateMenu(index, 'name', e.target.value)}
                    className='flex-1 p-2 border border-slate-200 rounded-xl'
                  />
                  <input
                    type="number"
                    placeholder="価格"
                    value={menu.price}
                    onChange={(e) => updateMenu(index, 'price', parseFloat(e.target.value))}
                    className='w-28 p-2 border border-slate-200 rounded-xl'
                  />
                  <button type="button" onClick={() => removeMenu(index)} className="p-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-xl transition-colors">削除</button>
                </div>
              ))}
              <button type="button" onClick={addMenu} className="mt-2 p-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-xl transition-colors">メニュー追加</button>
            </div>
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
        <Link href={`/organization/${id}/shop`} className="mt-6 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> 模擬店一覧へ戻る
        </Link>
      </div>
    </main>
  );
}
