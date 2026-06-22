"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Theme() {
  return (
    <main>
      <div className="mx-3.5 my-10">

        {/* ヘッダー：テーマ・サブタイトル */}
        <div className="container mx-auto text-white text-center my-12">
          <p className="text-sm mb-2 tracking-widest opacity-80">第43回電波祭テーマ</p>
          <h1 className="text-8xl font-bold tracking-widest drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] my-6">
            繋
          </h1>
          <p className="text-lg tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            — つなぐ、ひろがる、でんぱさい —
          </p>
        </div>

        {/* 説明 */}
        <div className="container mx-auto md:w-6/12 w-full space-y-4">

          <div className="w-full p-6 bg-white rounded-lg">
            <h2 className="text-base font-bold text-gray-800 mb-3">テーマについて</h2>
            <p className="text-sm text-gray-700 leading-8">
              今年の電波祭のテーマは「繋（つなぐ）」です。<br /><br />
              学生・地域・技術——異なる世界をひとつに繋ぎ、多くの人々との絆を深める場として、第43回電波祭を開催します。<br /><br />
              在学生が日々の学びの中で積み上げてきた研究・制作・演奏の成果をここに発表し、来場者のみなさまと互いの交流を通じてともに成長することを目指しています。
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
