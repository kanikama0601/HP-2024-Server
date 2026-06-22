"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Caution() {
  return (
    <main>
      <div className="mx-3.5 my-10">
        <div className="container mx-auto text-white text-center m-12">
          <h2 className="text-3xl font-light text-shadow-md m-3">
            <FontAwesomeIcon icon={faTriangleExclamation} /> ご来場の注意
          </h2>
          <p className="text-sm mb-4">来場前にご確認ください</p>
        </div>
        <div className="container mx-auto md:w-6/12 w-full space-y-4">

          <div className="w-full p-6 bg-white rounded-lg">
            <h3 className="text-base font-bold text-gray-800 mb-3">🚗 駐車場について</h3>
            <p className="text-sm text-gray-700 leading-7">
              キャンパス内の駐車場をご利用いただけます（無料）。<br />
              混雑が予想されますので、できるだけ公共交通機関をご利用ください。<br />
              駐車場が満車の際は係員の誘導に従ってください。
            </p>
          </div>

          <div className="w-full p-6 bg-white rounded-lg">
            <h3 className="text-base font-bold text-gray-800 mb-3">🚬 喫煙について</h3>
            <p className="text-sm text-gray-700 leading-7">
              キャンパス内は全面禁煙です。<br />
              指定の喫煙所以外での喫煙はご遠慮ください。
            </p>
          </div>

          <div className="w-full p-6 bg-white rounded-lg">
            <h3 className="text-base font-bold text-gray-800 mb-3">🐕 ペットについて</h3>
            <p className="text-sm text-gray-700 leading-7">
              ペットを連れてのご入場はご遠慮ください。<br />
              盲導犬・介助犬はお連れいただけます。
            </p>
          </div>

          <div className="w-full p-6 bg-white rounded-lg">
            <h3 className="text-base font-bold text-gray-800 mb-3">📷 撮影について</h3>
            <p className="text-sm text-gray-700 leading-7">
              会場内での写真・動画撮影は原則自由ですが、出演者や他の来場者への配慮をお願いします。<br />
              フラッシュ撮影は禁止です。ステージ前での三脚使用はご遠慮ください。
            </p>
          </div>

          <div className="w-full p-6 bg-white rounded-lg">
            <h3 className="text-base font-bold text-gray-800 mb-3">🗑️ ゴミについて</h3>
            <p className="text-sm text-gray-700 leading-7">
              会場内のゴミは所定のゴミ箱へお捨てください。<br />
              分別にご協力をお願いします。詳しくは「分別について」のページをご覧ください。
            </p>
          </div>

          <div className="w-full p-6 bg-white rounded-lg">
            <h3 className="text-base font-bold text-gray-800 mb-3">🆘 緊急時について</h3>
            <p className="text-sm text-gray-700 leading-7">
              体調不良・けがをされた場合は、近くのスタッフまたは案内所へお声がけください。<br />
              緊急時は迷わず119番・110番へご連絡ください。
            </p>
          </div>

        </div>
        <Link href="/" className="block text-center mt-8">
          <p className="text-white"><FontAwesomeIcon icon={faChevronLeft} /> トップへ戻る</p>
        </Link>
      </div>
    </main>
  );
}
