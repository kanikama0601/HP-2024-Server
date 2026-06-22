"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRecycle, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";

const bins = [
  { accent: "border-l-blue-400",  label: "燃えるゴミ",   emoji: "🗑️",
    examples: ["食べ残し", "紙くず", "割り箸・爪楊枝", "汚れた紙皿・紙コップ"] },
  { accent: "border-l-yellow-400", label: "プラスチック", emoji: "♻️",
    examples: ["ペットボトルのキャップ", "レジ袋・ビニール袋", "食品トレー（軽くすすいで）", "プラマーク付き容器"] },
  { accent: "border-l-green-400",  label: "ペットボトル", emoji: "🧴",
    examples: ["飲料用ペットボトル（ラベル・キャップ除く）"],
    note: "中をすすいでからお捨てください" },
  { accent: "border-l-slate-400",  label: "缶・ビン",    emoji: "🥫",
    examples: ["アルミ缶・スチール缶", "ガラスビン"],
    note: "中をすすいでからお捨てください" },
  { accent: "border-l-red-400",    label: "燃えないゴミ", emoji: "🚯",
    examples: ["割れたガラス", "陶器のかけら", "金属類"] },
];

export default function Recycle() {
  return (
    <main className="pb-16">
      <div className="relative bg-blue-900 text-white py-14 overflow-hidden">
        <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full border-[3px] border-blue-600/30" />
        <div className="pointer-events-none absolute left-8 bottom-0 w-14 h-14 rotate-45 bg-blue-700/30 translate-y-7" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-1 h-6 rounded-full bg-blue-400" />
            <h1 className="text-3xl font-bold tracking-[0.08em]">
              <FontAwesomeIcon icon={faRecycle} className="mr-2 text-green-300" />分別について
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">ゴミの正しい分け方</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-2xl space-y-4">

        <AnimatedSection>
          <div className="card-panel rounded-2xl p-6">
            <p className="text-sm text-slate-700 leading-7">
              電波祭ではゴミの分別にご協力をお願いしています。
              各ゴミ箱にはラベルを貼っていますので、正しい分別にご協力ください。
            </p>
          </div>
        </AnimatedSection>

        {bins.map(({ accent, label, emoji, examples, note }, i) => (
          <AnimatedSection key={label} delay={(i + 1) * 50}>
            <div className={`card-panel rounded-2xl p-6 border-l-4 ${accent}`}>
              <div className="flex items-start gap-3 mb-2">
                <span className="text-xl shrink-0">{emoji}</span>
                <h2 className="text-sm font-bold text-slate-800">{label}</h2>
              </div>
              <ul className="space-y-1 pl-8">
                {examples.map((ex) => (
                  <li key={ex} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                    {ex}
                  </li>
                ))}
              </ul>
              {note && <p className="mt-2 pl-8 text-xs text-slate-400">※ {note}</p>}
            </div>
          </AnimatedSection>
        ))}

        <AnimatedSection delay={350}>
          <div className="card-panel rounded-2xl p-6 border border-amber-200 bg-amber-50">
            <h2 className="text-sm font-bold text-amber-800 mb-2">⚠️ お願い</h2>
            <p className="text-sm text-amber-700 leading-7">
              分別が難しい場合は「燃えるゴミ」へお入れください。<br />
              案内所スタッフへお気軽にご質問ください。<br />
              皆さまのご協力をよろしくお願いいたします。
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
