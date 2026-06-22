"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";

export default function Theme() {
  return (
    <main className="pb-16">
      {/* Special hero for theme page */}
      <div className="relative bg-blue-900 text-white overflow-hidden">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full border-[4px] border-blue-600/25" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 w-40 h-40 rounded-full border-[3px] border-blue-700/30" />
        <div className="pointer-events-none absolute right-1/4 top-8 w-10 h-10 rotate-45 bg-blue-700/30" />
        <div className="pointer-events-none absolute left-1/3 bottom-8 w-6 h-6 rotate-45 bg-blue-500/30" />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, #93c5fd 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative z-10 text-center py-20 px-6">
          <p className="text-xs font-medium tracking-[0.3em] text-blue-300 uppercase mb-4">
            第43回電波祭テーマ
          </p>
          <p className="text-9xl md:text-[11rem] font-bold tracking-[0.15em] text-white
            drop-shadow-[0_6px_30px_rgba(0,0,0,0.5)] leading-none mb-8">
            繋
          </p>
          <div className="mx-auto mb-6 w-20 h-[2px] bg-blue-400" />
          <p className="text-lg tracking-[0.2em] text-blue-200">
            — つなぐ、ひろがる、でんぱさい —
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-2xl space-y-5">

        <AnimatedSection>
          <div className="card-panel rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-5 rounded-full bg-blue-500" />
              <h2 className="text-base font-bold text-slate-800">テーマについて</h2>
            </div>
            <p className="text-sm text-slate-700 leading-8">
              今年の電波祭のテーマは「繋（つなぐ）」です。<br /><br />
              学生・地域・技術——異なる世界をひとつに繋ぎ、多くの人々との絆を深める場として、
              第43回電波祭を開催します。<br /><br />
              在学生が日々の学びの中で積み上げてきた研究・制作・演奏の成果をここに発表し、
              来場者のみなさまと互いの交流を通じてともに成長することを目指しています。
            </p>
          </div>
        </AnimatedSection>

        <Link href="/" className="mt-2 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> トップへ戻る
        </Link>
      </div>
    </main>
  );
}
