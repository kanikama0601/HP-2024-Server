"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";

export default function About() {
  return (
    <main className="pb-16">
      {/* Page hero */}
      <div className="relative bg-blue-900 text-white py-14 overflow-hidden">
        <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full border-[3px] border-blue-600/30" />
        <div className="pointer-events-none absolute left-8 bottom-0 w-14 h-14 rotate-45 bg-blue-700/30 translate-y-7" />
        <div className="pointer-events-none absolute right-1/4 top-8 w-6 h-6 rotate-45 bg-blue-500/25" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <p className="text-xs font-medium tracking-[0.3em] text-blue-300 uppercase mb-3">
            香川高等専門学校 詫間キャンパス
          </p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-1 h-6 rounded-full bg-blue-400" />
            <h1 className="text-3xl font-bold tracking-[0.1em]">
              <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-blue-300" />About
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">電波祭について</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-2xl space-y-5">

        <AnimatedSection>
          <div className="card-panel rounded-2xl p-6 md:p-8">
            <SectionHeading>電波祭とは</SectionHeading>
            <p className="text-sm text-slate-700 leading-8">
              電波祭は、香川高等専門学校 詫間キャンパスが毎年秋に開催する文化祭です。<br /><br />
              各学科の研究・制作発表をはじめ、模擬店、ステージイベント、軽音楽・吹奏楽演奏など
              多彩なプログラムをご用意しています。<br /><br />
              在学生・卒業生・地域の皆さまが一堂に会し、学びと交流の場として長年親しまれてきました。<br /><br />
              当日はスタンプラリーや各種体験コーナーも設けておりますので、お子様連れのご家族でもお楽しみいただけます。
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={60}>
          <div className="card-panel rounded-2xl p-6 md:p-8">
            <SectionHeading>開催概要</SectionHeading>
            <dl className="mt-4 divide-y divide-slate-50">
              {[
                { dt: '名称', dd: '第54回 電波祭' },
                { dt: '日程', dd: '2024年11月2日（土）・3日（日）' },
                { dt: '時間', dd: '9:30 〜 16:30' },
                { dt: '会場', dd: '香川高等専門学校 詫間キャンパス' },
                { dt: '入場', dd: '無料' },
              ].map(({ dt, dd }) => (
                <div key={dt} className="flex gap-4 py-3">
                  <dt className="w-16 shrink-0 text-xs text-slate-400 pt-0.5">{dt}</dt>
                  <dd className="text-sm text-slate-700">{dd}</dd>
                </div>
              ))}
            </dl>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={120}>
          <div className="card-panel rounded-2xl p-6 md:p-8">
            <SectionHeading>実行委員長の挨拶</SectionHeading>
            <p className="text-sm text-slate-700 leading-8 mt-4">
              皆さん、こんにちは。第54回電波祭実行委員長を務めます〇〇と申します。<br /><br />
              今年のテーマは「繋（つなぐ）」です。学生・地域・技術——異なる世界をひとつに繋ぎ、
              多くの人々との絆を深める場として、本年度の電波祭を開催いたします。<br /><br />
              在学生が日々の学びの中で積み上げてきた研究・制作・演奏の成果をここに発表し、
              来場者のみなさまと互いの交流を通じてともに成長することを目指しています。<br /><br />
              ご来場の皆さまにとって、思い出に残る一日となりますよう、スタッフ一同精一杯おもてなしいたします。
              どうぞお楽しみください。
            </p>
            <p className="text-xs text-slate-400 text-right mt-4">第54回電波祭実行委員長　〇〇 〇〇</p>
          </div>
        </AnimatedSection>

        <Link href="/" className="mt-2 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> トップへ戻る
        </Link>
      </div>
    </main>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-1 h-5 rounded-full bg-blue-500" />
      <h2 className="text-base font-bold text-slate-800">{children}</h2>
    </div>
  );
}
