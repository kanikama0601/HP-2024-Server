"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap, faChevronLeft, faTrain, faBus, faCar, faPersonWalking } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Access() {
  return (
    <main>
      <div className="mx-3.5 my-10">
        <div className="container mx-auto text-white text-center m-12">
          <h2 className="text-3xl font-light text-shadow-md m-3">
            <FontAwesomeIcon icon={faMap} /> アクセスマップ
          </h2>
          <p className="text-sm mb-4">会場へのアクセス方法</p>
        </div>
        <div className="container mx-auto md:w-6/12 w-full space-y-4">

          <div className="w-full p-6 bg-white rounded-lg">
            <h3 className="text-base font-bold text-gray-800 mb-2">📍 会場住所</h3>
            <p className="text-sm text-gray-700 leading-7">
              香川高等専門学校 詫間キャンパス<br />
              〒769-1192 香川県三豊市詫間町香田551
            </p>
            <a
              href="https://maps.google.com/?q=香川高等専門学校+詫間キャンパス"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-xs text-blue-600 underline"
            >
              Google マップで開く →
            </a>
          </div>

          {/* 地図埋め込み */}
          <div className="w-full bg-white rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3272.0!2d133.633!3d34.216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3553fa2e1e2e1e1f%3A0x1234567890abcdef!2z6aaZ5bee6auY562J5LiJ5ZCI5a2m5qCh6aaZ6ZaA44Kt44Oj44Oz44OR44K5!5e0!3m2!1sja!2sjp!4v1234567890"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="アクセスマップ"
            />
          </div>

          <div className="w-full p-6 bg-white rounded-lg">
            <h3 className="text-base font-bold text-gray-800 mb-3">
              <FontAwesomeIcon icon={faTrain} className="mr-1 text-blue-600" /> 電車でお越しの方
            </h3>
            <p className="text-sm text-gray-700 leading-7">
              JR予讃線「詫間駅」下車、徒歩約15分。<br />
              または詫間駅からタクシーで約5分。
            </p>
          </div>

          <div className="w-full p-6 bg-white rounded-lg">
            <h3 className="text-base font-bold text-gray-800 mb-3">
              <FontAwesomeIcon icon={faBus} className="mr-1 text-green-600" /> バスでお越しの方
            </h3>
            <p className="text-sm text-gray-700 leading-7">
              三豊市コミュニティバス「詫間キャンパス前」下車すぐ。<br />
              時刻表は三豊市公式サイトをご確認ください。
            </p>
          </div>

          <div className="w-full p-6 bg-white rounded-lg">
            <h3 className="text-base font-bold text-gray-800 mb-3">
              <FontAwesomeIcon icon={faCar} className="mr-1 text-orange-600" /> お車でお越しの方
            </h3>
            <p className="text-sm text-gray-700 leading-7">
              高松自動車道「三豊鳥坂IC」より約20分。<br />
              キャンパス内に無料駐車場があります。<br />
              混雑時は係員の誘導に従ってください。
            </p>
          </div>

          <div className="w-full p-6 bg-white rounded-lg">
            <h3 className="text-base font-bold text-gray-800 mb-3">
              <FontAwesomeIcon icon={faPersonWalking} className="mr-1 text-purple-600" /> 徒歩でお越しの方
            </h3>
            <p className="text-sm text-gray-700 leading-7">
              詫間駅から徒歩約15分です。<br />
              案内看板を設置しておりますのでご参考にしてください。
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
