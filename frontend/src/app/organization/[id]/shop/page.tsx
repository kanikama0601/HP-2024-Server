"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShop, faPlus, faUser, faCircleCheck, faCircleExclamation, faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Loading } from '@/components/Loading';
import { fetchWithAuth } from '@/utils/api';

interface Shop {
  id: number;
  name: string;
  address: string;
  detail: string;
  shop_inspection__ai: boolean;
  shop_inspection__inspected: boolean;
  shop_inspection__deleted: boolean;
  organization__name: string;
  user__username: string;
  created_at: string;
}

export default function News({ params }: { params: { id: string }}) {

  const [shopData, setShopData] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const url = process.env.NEXT_PUBLIC_API_URL + `/organization/${params.id}/shop/`;
    
  useEffect(() => {
		const fetchData = async () => {
				try {
						const data = await fetchWithAuth(url, 'GET');
            setShopData(data['shop']);
				} catch (error) {
						console.error('データ取得エラー:', error);
				} finally {
						setLoading(false);
				}
		};

		fetchData();
}, []);

    return (
        <main>
            <div className="mx-3.5 my-10">
                <div className="container mx-auto text-white text-center m-12">
                <h2 className="text-3xl font-light text-shadow-md m-3">
                <FontAwesomeIcon icon={faShop} /> Organization Shop
                </h2>
                <p className="text-sm mb-4">
                模擬店管理
                </p>
                </div>
								{loading ? (<Loading />) : (
                  <>
                    <div className="container mx-auto text-xl md:w-6/12 w-full">
                    {shopData && shopData.map((shop) => (
                      <Link key={shop['id']} href={`/organization/${params.id}/shop/${shop['id']}`}>
                        <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
                          <p className="text-xs my-1.5 text-gray-700">{new Date(shop['created_at']).toLocaleDateString('ja-JP')}</p>
                          <h3 className="text-base">{shop['name']}</h3>
                          <p className="text-xs my-1.5 text-gray-700"><FontAwesomeIcon icon={faUser} /> {shop['user__username']}</p>
                          {shop['shop_inspection__deleted'] ? (
                            <p className="text-xs my-1.5 text-red-600"><FontAwesomeIcon icon={faCircleXmark} /> 検証によって削除済み</p>
                          ) : (
                          shop['shop_inspection__ai'] ? (
                            shop['shop_inspection__inspected'] ? (
                              <p className="text-xs my-1.5 text-green-600"><FontAwesomeIcon icon={faCircleCheck} /> AI自動検証によって承認済み</p>
                            ) : (
                              <p className="text-xs my-1.5 text-yellow-600"><FontAwesomeIcon icon={faCircleExclamation} /> AI自動検証によって保留、人間による検証を待機中</p>
                            )
                          ) : (
                            shop['shop_inspection__inspected'] ? (
                              <p className="text-xs my-1.5 text-green-600"><FontAwesomeIcon icon={faCircleCheck} /> 人間によって承認済み</p>
                            ) : (
                              <p className="text-xs my-1.5 text-gray-700"><FontAwesomeIcon icon={faSpinner} /> AI自動検証を待機しています...</p>
                            )
                          ))}
                        </div>
                      </Link>
                    ))}
                    </div>
                  </>
                )}
                <Link href={`/organization/${params.id}/shop/new`}>
                    <p className="text-center text-white hover:text-gray-200 transition duration-100 text-base"><FontAwesomeIcon icon={faPlus} /> 模擬店の追加</p>
                </Link>
            </div>
            <Link href={`/organization/${params.id}`} className='text-center'>
              <p className='text-white'>オーガナイゼーションメニューへ戻る</p>
            </Link>
        </main>
    );
}
