"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShop, faPaperPlane, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { set, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { fetchWithAuth } from '@/utils/api';
import { Loading } from '@/components/Loading';
import Link from 'next/link';

interface Shop {
  id: number;
  name: string;
  address: string;
  detail: string;
}

interface Menu {
  id: number;
  name: string;
  price: number;
}

export default function Shop({ params }: { params: { id: string, shop_id: string }}) {

  const [sendLoading, setSendLoading] = useState(false);
  const [shopData, setShopData] = useState<Shop[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + `/organization/${params.id}/shop/${params.shop_id}/`;

  type LoginDataType = {
    name: string;
    address: string;
    detail: string;
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
    const csrftoken = Cookies.get('csrftoken') || '';
    
    try {
      const send_data = { ...data, imageUrls: imageUrls, menus: menus };
      const response = await fetchWithAuth(apiUrl, 'POST', send_data);
      router.push(`/organization/${params.id}/shop`);
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
            setShopData(data['shop']);
            if (data['image']) {
              setImageUrls(data['image']);
            } else {
              setImageUrls([]);
            }
            if (data['menu']) {
              setMenus(data['menu']);
            } else {
              setMenus([]);
            }
				} catch (error) {
						console.error('データ取得エラー:', error);
				} finally {
						setLoading(false);
				}
		};

		fetchData();
}, []);

  const handleImageUpload = async (shop: React.ChangeEvent<HTMLInputElement>) => {
    setSendLoading(true);
    const files = shop.target.files;
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
          <FontAwesomeIcon icon={faShop} />  Edit Shop
          </h2>
          <p className="text-sm mb-4">
          模擬店編集
          </p>
        </div>
          {loading ? <Loading /> : (
          <div className="container mx-auto text-xl md:w-6/12 w-full">
            <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition dulation-100 text-center">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <input
                    placeholder="店名"
                    defaultValue={shopData[0]['name']}
                    {...register('name', {
                      required: {
                        value: true, 
                        message: 'タイトルを入力してください',
                      },
                    })} 
                    className='w-11/12 m-4 p-4 border-2 rounded-lg'
                  />
                  {errors.name?.message && <div>{errors.name.message}</div>}
                </div>
                <div>
                  <input
                    placeholder="場所"
                    defaultValue={shopData[0]['address']}
                    {...register('address', {
                      required: {
                        value: true, 
                        message: '場所を入力してください',
                      },
                    })} 
                    className='w-11/12 m-4 p-4 border-2 rounded-lg'
                  />
                  {errors.address?.message && <div>{errors.address.message}</div>}
                </div>
                <div>
                  <textarea
                    placeholder="詳細"
                    defaultValue={shopData[0]['detail']}
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
                <div className='md:w-full w-full text-center'>
                  <h3 className="text-lg font-medium">メニュー</h3>
                  {menus && menus.map((menu, index) => (
                    <div key={index} className="menu-item">
                      <input
                        type='hidden'
                        value={menu.id}
                        onChange={(e) => updateMenu(index, 'id', e.target.value)}
                        className='md:w-6/12 w-11/12 m-2 p-2 border-2 rounded-lg'
                      />
                      <input
                        placeholder="メニュー名"
                        value={menu.name}
                        onChange={(e) => updateMenu(index, 'name', e.target.value)}
                        className='md:w-6/12 w-11/12 m-2 p-2 border-2 rounded-lg'
                      />
                      <input
                        type="number"
                        placeholder="価格"
                        value={menu.price}
                        onChange={(e) => updateMenu(index, 'price', parseFloat(e.target.value))}
                        className='md:w-3/12 w-8/12 m-2 p-2 border-2 rounded-lg'
                      />
                      <button type="button" onClick={() => removeMenu(index)} className="m-2 p-2 border rounded-lg bg-red-600 text-white">削除</button>
                    </div>
                  ))}
                  <button type="button" onClick={addMenu} className="m-4 p-2 border rounded-lg bg-blue-600 text-white">メニュー追加</button>
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
                <button type="submit" className='m-6 p-4 border rounded-lg bg-gray-600 text-white'><FontAwesomeIcon icon={faPaperPlane} /> 更新</button>
              </form>
            </div>
          </div>
          )}
          <Link href={`/organization/${params.id}/shop/${params.shop_id}/delete`} className='bg-white-100'>
            <p className='text-center text-red-400 text-lg my-4'><FontAwesomeIcon icon={faTrashCan} /> 模擬店を削除</p>
          </Link>
        </div>
      </main>
  );
}