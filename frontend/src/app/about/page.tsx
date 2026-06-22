"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function About() {
  return (
    <main>
      <div className="mx-3.5 my-10">

        {/* ヘッダー */}
        <div className="container mx-auto text-white text-center my-12">
          <p className="text-sm mb-2 tracking-widest opacity-80">香川高等専門学校 詫間キャンパス</p>
          <h1 className="text-4xl font-light tracking-widest drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] my-6">
            <FontAwesomeIcon icon={faGraduationCap} /> About
          </h1>
          <p className="text-lg tracking-[0.15em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            電波祭について
          </p>
        </div>

        <div className="container mx-auto md:w-6/12 w-full space-y-4">

          {/* 電波祭とは */}
          <div className="w-full p-6 bg-white rounded-lg">
            <h2 className="text-base font-bold text-gray-800 mb-3">電波祭とは</h2>
            <p className="text-sm text-gray-700 leading-8">
              電波祭は、香川高等専門学校 詫間キャンパスが毎年秋に開催する文化祭です。<br /><br />
              各学科の研究・制作発表をはじめ、模擬店、ステージイベント、軽音楽演奏、カラオケ大会など多彩なプログラムをご用意しています。<br /><br />
              在学生・卒業生・地域の皆さまが一堂に会し、学びと交流の場として長年親しまれてきました。<br /><br />
              当日はスタンプラリーや各種体験コーナーも設けておりますので、お子様連れのご家族でもお楽しみいただけます。
            </p>
          </div>

          {/* 開催概要 */}
          <div className="w-full p-6 bg-white rounded-lg">
            <h2 className="text-base font-bold text-gray-800 mb-3">開催概要</h2>
            <table className="w-full text-sm text-gray-700 leading-8">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-1.5 pr-4 text-gray-500 whitespace-nowrap">名称</td>
                  <td className="py-1.5">第43回 電波祭</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-1.5 pr-4 text-gray-500 whitespace-nowrap">日程</td>
                  <td className="py-1.5">2024年11月2日（土）・3日（日）</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-1.5 pr-4 text-gray-500 whitespace-nowrap">時間</td>
                  <td className="py-1.5">9:30 〜 16:30</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-1.5 pr-4 text-gray-500 whitespace-nowrap">会場</td>
                  <td className="py-1.5">香川高等専門学校 詫間キャンパス</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 text-gray-500 whitespace-nowrap">入場</td>
                  <td className="py-1.5">無料</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 実行委員長の挨拶 */}
          <div className="w-full p-6 bg-white rounded-lg">
            <h2 className="text-base font-bold text-gray-800 mb-3">実行委員長の挨拶</h2>
            <p className="text-sm text-gray-700 leading-8">
              皆さん、こんにちは。第43回電波祭実行委員長を務めます〇〇と申します。<br /><br />
              今年のテーマは「繋（つなぐ）」です。学生・地域・技術——異なる世界をひとつに繋ぎ、多くの人々との絆を深める場として、本年度の電波祭を開催いたします。<br /><br />
              在学生が日々の学びの中で積み上げてきた研究・制作・演奏の成果をここに発表し、来場者のみなさまと互いの交流を通じてともに成長することを目指しています。<br /><br />
              準備にあたっては、多くの学生スタッフ・教職員・地域の皆さまにご支援いただきました。心より感謝申し上げます。<br /><br />
              ご来場の皆さまにとって、思い出に残る一日となりますよう、スタッフ一同精一杯おもてなしいたします。どうぞお楽しみください。
            </p>
            <p className="text-sm text-gray-500 mt-4 text-right">第43回電波祭実行委員長　〇〇 〇〇</p>
          </div>

        </div>

        <Link href="/" className="block text-center mt-8">
          <p className="text-white"><FontAwesomeIcon icon={faChevronLeft} /> トップへ戻る</p>
        </Link>
      </div>
    </main>
  );
}
