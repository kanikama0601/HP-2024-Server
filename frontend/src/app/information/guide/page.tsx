"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Guide() {
  return (
    <main>
      <div className="mx-3.5 my-10">
        <div className="container mx-auto text-white text-center m-12">
          <h2 className="text-3xl font-light text-shadow-md m-3">
            <FontAwesomeIcon icon={faLocationDot} /> 案内所・落とし物
          </h2>
          <p className="text-sm mb-4">お気軽にお立ち寄りください</p>
        </div>
        <div className="container mx-auto md:w-6/12 w-full space-y-4">

          <div className="w-full p-6 bg-white rounded-lg">
            <h3 className="text-base font-bold text-gray-800 mb-3">📍 案内所の場所</h3>
            <p className="text-sm text-gray-700 leading-7">
              案内所は正門を入ってすぐ右手に設置しています。<br />
              開催時間中は常時スタッフが対応しております。<br />
              お気軽にお声がけください。
            </p>
          </div>

          <div className="w-full p-6 bg-white rounded-lg">
            <h3 className="text-base font-bold text-gray-800 mb-3">🕐 案内所の開設時間</h3>
            <ul className="text-sm text-gray-700 leading-7 space-y-1">
              <li>1日目（11月2日）　9:30 〜 16:30</li>
              <li>2日目（11月3日）　9:30 〜 16:30</li>
            </ul>
          </div>

          <div className="w-full p-6 bg-white rounded-lg">
            <h3 className="text-base font-bold text-gray-800 mb-3">🔍 できること</h3>
            <ul className="text-sm text-gray-700 leading-7 list-disc list-inside space-y-1">
              <li>会場マップの配布</li>
              <li>イベントスケジュールのご案内</li>
              <li>困りごと・お問い合わせへの対応</li>
              <li>落とし物の受付・保管</li>
              <li>車椅子の貸し出し（数量限定）</li>
            </ul>
          </div>

          <div className="w-full p-6 bg-white rounded-lg">
            <h3 className="text-base font-bold text-gray-800 mb-3">📦 落とし物について</h3>
            <p className="text-sm text-gray-700 leading-7">
              落とし物は案内所にて保管しております。<br />
              お心当たりのある方は案内所スタッフまでお申し出ください。<br /><br />
              お帰りの際に拾われた落とし物があれば、案内所へお届けいただけると大変助かります。
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
