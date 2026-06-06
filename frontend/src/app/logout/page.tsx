"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/Loading";
import Cookies from "js-cookie";

export default function Login() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = async () => {
      Cookies.remove('access');
      Cookies.remove('refresh');
      setLoading(false);
      router.push('/login');
  };

  useEffect(() => {
      logout(); // 関数を呼び出す
  }, []); // コンポーネントのマウント時に実行

  return (
    <main className="mx-3.5 my-10">
      <div className="container mx-auto text-white text-center m-12">
        <h2 className="text-3xl font-light text-shadow-md m-3">
        <FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout
        </h2>
        <p className="text-sm mb-4">
        ログアウト
        </p>
      </div>
      <div className="container mx-auto text-xl md:w-6/12 w-full">
          <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100 text-center">
              {loading ? (
                <Loading /> // Loadingコンポーネントを表示
              ) : (
                <p>ログアウトが完了しました</p>
              )}
          </div>
      </div>
    </main>
  );
}