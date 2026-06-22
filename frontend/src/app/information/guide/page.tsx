"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";

const items = [
  { emoji: "📍", heading: "案内所の場所",
    body: "案内所は正門を入ってすぐ右手に設置しています。開催時間中は常時スタッフが対応しております。お気軽にお声がけください。" },
  { emoji: "🕐", heading: "案内所の開設時間",
    list: ["1日目（11月2日）　9:30 〜 16:30", "2日目（11月3日）　9:30 〜 16:30"] },
  { emoji: "🔍", heading: "できること",
    list: ["会場マップの配布", "イベントスケジュールのご案内", "困りごと・お問い合わせへの対応", "落とし物の受付・保管", "車椅子の貸し出し（数量限定）"] },
  { emoji: "📦", heading: "落とし物について",
    body: "落とし物は案内所にて保管しております。お心当たりのある方は案内所スタッフまでお申し出ください。\n\nお帰りの際に拾われた落とし物があれば、案内所へお届けいただけると大変助かります。" },
];

export default function Guide() {
  return (
    <main className="pb-16">
      <div className="relative bg-blue-900 text-white py-14 overflow-hidden">
        <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full border-[3px] border-blue-600/30" />
        <div className="pointer-events-none absolute left-8 bottom-0 w-14 h-14 rotate-45 bg-blue-700/30 translate-y-7" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-1 h-6 rounded-full bg-blue-400" />
            <h1 className="text-3xl font-bold tracking-[0.08em]">
              <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-blue-300" />案内所・落とし物
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">お気軽にお立ち寄りください</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-2xl space-y-4">
        {items.map(({ emoji, heading, body, list }, i) => (
          <AnimatedSection key={heading} delay={i * 50}>
            <div className="card-panel rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl shrink-0 mt-0.5">{emoji}</span>
                <div className="flex-1">
                  <h2 className="text-sm font-bold text-slate-800 mb-2">{heading}</h2>
                  {body && <p className="text-sm text-slate-600 leading-7 whitespace-pre-line">{body}</p>}
                  {list && (
                    <ul className="text-sm text-slate-600 leading-7 space-y-1">
                      {list.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}

        <Link href="/" className="mt-2 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> トップへ戻る
        </Link>
      </div>
    </main>
  );
}
