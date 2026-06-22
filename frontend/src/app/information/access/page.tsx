"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap, faChevronLeft, faTrain, faBus, faCar, faPersonWalking } from "@fortawesome/free-solid-svg-icons";
import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";

const transportItems = [
  { icon: faTrain,         color: "bg-blue-100 text-blue-600",   heading: "電車でお越しの方",
    body: "JR予讃線「詫間駅」下車、徒歩約15分。または詫間駅からタクシーで約5分。" },
  { icon: faBus,           color: "bg-green-100 text-green-600", heading: "バスでお越しの方",
    body: "三豊市コミュニティバス「詫間キャンパス前」下車すぐ。時刻表は三豊市公式サイトをご確認ください。" },
  { icon: faCar,           color: "bg-orange-100 text-orange-600", heading: "お車でお越しの方",
    body: "高松自動車道「三豊鳥坂IC」より約20分。キャンパス内に無料駐車場があります。混雑時は係員の誘導に従ってください。" },
  { icon: faPersonWalking, color: "bg-sky-100 text-sky-600",     heading: "徒歩でお越しの方",
    body: "詫間駅から徒歩約15分です。案内看板を設置しておりますのでご参考にしてください。" },
];

export default function Access() {
  return (
    <main className="pb-16">
      <div className="relative bg-blue-900 text-white py-14 overflow-hidden">
        <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full border-[3px] border-blue-600/30" />
        <div className="pointer-events-none absolute left-8 bottom-0 w-14 h-14 rotate-45 bg-blue-700/30 translate-y-7" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-1 h-6 rounded-full bg-blue-400" />
            <h1 className="text-3xl font-bold tracking-[0.08em]">
              <FontAwesomeIcon icon={faMap} className="mr-2 text-blue-300" />アクセスマップ
            </h1>
          </div>
          <p className="text-sm text-blue-300 tracking-widest">会場へのアクセス方法</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-2xl space-y-4">

        <AnimatedSection>
          <div className="card-panel rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-5 rounded-full bg-blue-500" />
              <h2 className="text-sm font-bold text-slate-800">会場住所</h2>
            </div>
            <p className="text-sm text-slate-700 leading-7">
              香川高等専門学校 詫間キャンパス<br />
              〒769-1192 香川県三豊市詫間町香田551
            </p>
            <a
              href="https://maps.google.com/?q=香川高等専門学校+詫間キャンパス"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              Google マップで開く →
            </a>
          </div>
        </AnimatedSection>

        {/* Map embed */}
        <AnimatedSection delay={60}>
          <div className="card-panel rounded-2xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3272.0!2d133.633!3d34.216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3553fa2e1e2e1e1f%3A0x1234567890abcdef!2z6aaZ5bee6auY562J5LiJ5ZCI5a2m5qCh6aaZ6ZaA44Kt44Oj44Oz44OR44K5!5e0!3m2!1sja!2sjp!4v1234567890"
              width="100%" height="280"
              style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="アクセスマップ"
            />
          </div>
        </AnimatedSection>

        {transportItems.map(({ icon, color, heading, body }, i) => (
          <AnimatedSection key={heading} delay={(i + 2) * 50}>
            <div className="card-panel rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <span className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 ${color}`}>
                  <FontAwesomeIcon icon={icon} />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-800 mb-2">{heading}</h2>
                  <p className="text-sm text-slate-600 leading-7">{body}</p>
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
