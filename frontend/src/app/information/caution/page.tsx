import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Link } from 'react-router-dom';

const items = [
  { emoji: "🚗", heading: "駐車場について",
    body: "キャンパス内の駐車場をご利用いただけます（無料）。混雑が予想されますので、できるだけ公共交通機関をご利用ください。駐車場が満車の際は係員の誘導に従ってください。" },
  { emoji: "🚬", heading: "喫煙について",
    body: "キャンパス内は全面禁煙です。指定の喫煙所以外での喫煙はご遠慮ください。" },
  { emoji: "🐕", heading: "ペットについて",
    body: "ペットを連れてのご入場はご遠慮ください。盲導犬・介助犬はお連れいただけます。" },
  { emoji: "📷", heading: "撮影について",
    body: "会場内での写真・動画撮影は原則自由ですが、出演者や他の来場者への配慮をお願いします。フラッシュ撮影は禁止です。ステージ前での三脚使用はご遠慮ください。" },
  { emoji: "🗑️", heading: "ゴミについて",
    body: "会場内のゴミは所定のゴミ箱へお捨てください。分別にご協力をお願いします。詳しくは「分別について」のページをご覧ください。" },
  { emoji: "🆘", heading: "緊急時について",
    body: "体調不良・けがをされた場合は、近くのスタッフまたは案内所へお声がけください。緊急時は迷わず119番・110番へご連絡ください。" },
];

export default function Caution() {
  return (
    <main className="pb-16">
      <PageHero
        icon={faTriangleExclamation}
        iconColor="text-amber-300"
        title="ご来場の注意"
        sub="来場前にご確認ください"
      />

      <div className="container mx-auto px-4 py-10 max-w-2xl space-y-4">
        {items.map(({ emoji, heading, body }, i) => (
          <AnimatedSection key={heading} delay={i * 50}>
            <div className="card-panel rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl shrink-0 mt-0.5">{emoji}</span>
                <div>
                  <h2 className="text-sm font-bold text-slate-800 mb-2">{heading}</h2>
                  <p className="text-sm text-slate-600 leading-7">{body}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}

        <Link to="/" className="mt-2 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faChevronLeft} /> トップへ戻る
        </Link>
      </div>
    </main>
  );
}

function PageHero({ icon, iconColor, title, sub }: { icon: any; iconColor: string; title: string; sub: string }) {
  return (
    <div className="relative bg-blue-900 text-white py-14 overflow-hidden">
      <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full border-[3px] border-blue-600/30" />
      <div className="pointer-events-none absolute left-8 bottom-0 w-14 h-14 rotate-45 bg-blue-700/30 translate-y-7" />
      <div className="pointer-events-none absolute right-1/3 top-6 w-5 h-5 rotate-45 bg-blue-500/25" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-1 h-6 rounded-full bg-blue-400" />
          <h1 className="text-3xl font-bold tracking-[0.08em]">
            <FontAwesomeIcon icon={icon} className={`mr-2 ${iconColor}`} />{title}
          </h1>
        </div>
        <p className="text-sm text-blue-300 tracking-widest">{sub}</p>
      </div>
    </div>
  );
}
