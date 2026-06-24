import { useState, useEffect, type PropsWithChildren } from "react";

// ─────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────
type PropsWithClassName = PropsWithChildren & { className?: string };

function Tag({ children, className }: PropsWithClassName) {
  return (
    <div
      className={`inline-block bg-black text-white px-4 py-1 text-xs font-bold tracking-widest uppercase rounded-sm ${className}`}
    >
      {children}
    </div>
  );
}

function GlitchText({ children }: PropsWithClassName) {
  return <span style={{ textShadow: "2px 0 #00FFFF, -2px 0 #FF00FF" }}>{children}</span>;
}

function HardShadowBtn({
  children,
  className = "",
  rotate = "",
}: PropsWithClassName & { rotate?: string }) {
  return (
    <button
      className={`border-4 border-black font-bold rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none ${rotate} ${className}`}
      style={{ boxShadow: "6px 6px 0 #000" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translate(-2px,-2px)";
        e.currentTarget.style.boxShadow = "8px 8px 0 #000";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "6px 6px 0 #000";
      }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────
// TopNavBar
// ─────────────────────────────────────────
function TopNavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="bg-white/80 backdrop-blur-md border-b-2 border-black w-[calc(100%-32px)] mx-4 mt-4 sticky top-4 z-50 rounded-lg"
      style={{ boxShadow: "4px 4px 0 #000" }}
    >
      <div className="flex justify-between items-center w-full px-6 py-4">
        <GlitchText className="text-5xl font-extrabold tracking-tighter leading-none">
          電波祭
        </GlitchText>

        <nav className="hidden md:flex gap-8 items-center">
          {["ラインナップ", "スケジュール", "アクセス", "グッズ"].map((label, i) => (
            <a
              key={label}
              href="#"
              className={`font-bold transition-all ${
                i === 0 ? "border-b-4 border-yellow-400" : "hover:bg-yellow-100 px-2 py-1 rounded"
              }`}
            >
              {label}
            </a>
          ))}
          <HardShadowBtn className="bg-yellow-300 px-6 py-2 text-sm" rotate="-rotate-1">
            TICKET
          </HardShadowBtn>
        </nav>

        <button className="md:hidden text-black" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="material-symbols-outlined text-4xl">{menuOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden flex flex-col gap-4 px-6 pb-6">
          {["ラインナップ", "スケジュール", "アクセス", "グッズ"].map((l) => (
            <a key={l} href="#" className="font-bold border-b border-black/10 pb-2">
              {l}
            </a>
          ))}
          <HardShadowBtn className="bg-yellow-300 px-6 py-3 self-start">TICKET</HardShadowBtn>
        </nav>
      )}
    </header>
  );
}

// ─────────────────────────────────────────
// Hero
// ─────────────────────────────────────────
function Hero() {
  return (
    <section
      className="relative min-h-[85vh] flex flex-col justify-center items-start overflow-hidden bg-white/40 px-6 md:px-12 py-12 m-4 rounded-xl border-4 border-black"
      style={{ boxShadow: "8px 8px 0 #000" }}
    >
      <div className="relative z-10 max-w-4xl">
        <Tag className="-rotate-1 mb-6">[ 2024 ANNUAL TECHNICAL FESTIVAL ]</Tag>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-none tracking-tighter mb-8">
          <GlitchText>「電波すぎて滅！</GlitchText>
          <br />
          <span style={{ color: "#FF00FF" }}>～周波数はみるみる上昇中～</span>」
        </h1>

        <p
          className="text-xl md:text-2xl font-bold mb-12 max-w-2xl border-l-8 pl-6 bg-white/60 p-4 rounded-r-lg"
          style={{ borderColor: "#00FFFF" }}
        >
          テクノロジー、アート、そしてノイズ。限界を超えた周波数があなたの感性をジャックする。
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <HardShadowBtn className="bg-yellow-300 px-10 py-4 text-xl -rotate-1">
            チケットを購入する
          </HardShadowBtn>
          <HardShadowBtn className="bg-white px-10 py-4 text-xl rotate-1 hover:bg-cyan-300">
            企画一覧を見る
          </HardShadowBtn>
        </div>
      </div>

      {/* Decorative watermark */}
      <div className="absolute right-0 bottom-0 p-12 hidden lg:block opacity-10 select-none">
        <div className="text-[120px] leading-none font-bold rotate-90 origin-bottom-right">
          DEMPA-SAI
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// Marquee
// ─────────────────────────────────────────
function Marquee() {
  const text =
    "* SYSTEM ONLINE * FREQUENCY RISING * TICKET ON SALE * SYSTEM ONLINE * FREQUENCY RISING * TICKET ON SALE * SYSTEM ONLINE * FREQUENCY RISING * TICKET ON SALE * SYSTEM ONLINE * FREQUENCY RISING * TICKET ON SALE * ";

  return (
    <div className="bg-black text-yellow-300 py-4 my-8 overflow-hidden -rotate-1 scale-105 border-y-4 border-black">
      <div
        className="whitespace-nowrap inline-block text-2xl font-bold tracking-widest"
        style={{ animation: "marquee 20s linear infinite" }}
      >
        {text}
        {text}
      </div>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────
// EventDetails
// ─────────────────────────────────────────
function ScannerOverlay() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "rgba(0,255,255,0.07)",
          mixBlendMode: "multiply",
        }}
      />
      <div
        className="absolute left-0 w-full h-0.5 pointer-events-none"
        style={{
          background: "#FF00FF",
          animation: "scan 4s linear infinite",
          zIndex: 10,
        }}
      />
      <style>{`
        @keyframes scan {
          0%   { top: 0%;   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </>
  );
}

function EventDetails() {
  return (
    <section className="flex gap-6 px-6 py-4" style={{ minHeight: 420 }}>
      {/* Outer wrapper carries rotate so overflow-hidden card is unaffected */}
      <div className="rotate-1" style={{ flex: "0 0 42%", display: "flex" }}>
        <div
          className="bg-white border-4 border-black p-8 rounded-xl flex flex-col justify-between gap-8 w-full"
          style={{ boxShadow: "8px 8px 0 #000" }}
        >
          <div>
            <Tag className="mb-4">DATE &amp; TIME</Tag>
            <h2
              className="text-4xl font-extrabold leading-tight mt-4"
              style={{ textShadow: "2px 0 #00FFFF, -2px 0 #FF00FF" }}
            >
              2024.11.02 - 03
              <br />
              10:00 - 18:00
            </h2>
          </div>
          <div>
            <Tag className="mb-4">LOCATION</Tag>
            <h2 className="text-2xl font-bold mt-4">
              国立電波技術大学
              <br />
              中央キャンパス特設会場
            </h2>
            <p className="mt-4 text-gray-600 text-sm">東京都港区芝公園4-2-8</p>
            <HardShadowBtn className="mt-6 bg-white px-5 py-2 text-sm hover:bg-pink-400 hover:text-white">
              Google Mapsで開く
            </HardShadowBtn>
          </div>
        </div>
      </div>

      {/* Outer wrapper carries rotate for the map */}
      <div className="-rotate-1" style={{ flex: "1 1 0", display: "flex" }}>
        <div
          className="relative overflow-hidden bg-gray-200 rounded-xl border-4 border-black w-full"
          style={{ boxShadow: "8px 8px 0 #000" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center grayscale contrast-125 hover:scale-110 transition-transform duration-700"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBzskFwcQBXnYV6upmOqllko07j5SfR0CX_PQWVZURbqlAfK6RBevJozbX-hSaBz2C-939MtlzAAU92dDCFAn5iTxihp0KwybC7QhcJmM12Xlyo-BHeYhbu0GvvDFOzLZIG8YRcjnV9R7fM7o5Rf9L6cAgupbsA8D5nhfoP-V_tJekzps442xzQT51idInn6HeANgMl8am0gb_dxCXmi1E7hww3RGNF4MZXkoDfmgNlALhX500eqWOb5CNdEDsFuqaTl88IK4j3Zg')",
            }}
          />
          <ScannerOverlay />
          <div
            className="absolute top-6 right-6 bg-black/90 backdrop-blur-sm p-5 text-white border-2 rounded-xl"
            style={{ borderColor: "#00FFFF", boxShadow: "6px 6px 0 #00FFFF", maxWidth: 200 }}
          >
            <span
              className="material-symbols-outlined text-3xl mb-3 block"
              style={{ color: "#00FFFF" }}
            >
              sensors
            </span>
            <p className="text-xs leading-relaxed">
              キャンパス全域で高密度な電波干渉が予想されます。デバイスの保護設定を推奨します。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// NavBentoGrid
// ─────────────────────────────────────────
const NAV_CARDS = [
  {
    id: "NAV_01",
    icon: "calendar_month",
    iconColor: "#FF00FF",
    title: "SCHEDULE",
    desc: "2日間にわたる超高密度スケジュール。メインステージからサテライト展示まで、すべての瞬間を見逃すな。",
    cta: "VIEW TIMETABLE",
    bg: "bg-white",
    rotate: "-rotate-1",
    hoverColor: "group-hover:text-pink-500",
  },
  {
    id: "NAV_02",
    icon: "experiment",
    iconColor: "#000",
    title: "EXHIBITS",
    desc: "最先端の電波工学から、脳を揺さぶるデジタルメディアアートまで。100以上の展示があなたを待ち受ける。",
    cta: "EXPLORE PROJECTS",
    bg: "bg-cyan-300",
    rotate: "rotate-1",
    hoverColor: "group-hover:underline",
  },
  {
    id: "NAV_03",
    icon: "info",
    iconColor: "#eaea00",
    title: "ABOUT",
    desc: "電波祭の歴史、そして今年のテーマに込められた想い。私たちのミッションは、まだ見ぬ周波数を開拓すること。",
    cta: "OUR MISSION",
    bg: "bg-white",
    rotate: "-rotate-1",
    hoverColor: "group-hover:text-yellow-500",
  },
];

function NavBentoGrid() {
  return (
    <section className="px-6 md:px-12 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {NAV_CARDS.map((card) => (
          <div
            key={card.id}
            className={`relative group ${card.bg} border-4 border-black p-8 flex flex-col justify-between h-[450px] rounded-xl hover:rotate-0 transition-all ${card.rotate} cursor-pointer`}
            style={{ boxShadow: "8px 8px 0 #000" }}
          >
            <div className="absolute -top-3 -left-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-sm">
              {card.id}
            </div>
            <div className="mt-8">
              <span
                className="material-symbols-outlined text-6xl mb-6 block"
                style={{ color: card.iconColor }}
              >
                {card.icon}
              </span>
              <h3
                className="text-5xl font-extrabold mb-4"
                style={card.id !== "NAV_02" ? { textShadow: "2px 0 #00FFFF, -2px 0 #FF00FF" } : {}}
              >
                {card.title}
              </h3>
              <p className="text-base leading-relaxed">{card.desc}</p>
            </div>
            <div
              className={`flex items-center gap-4 font-bold ${card.hoverColor} transition-colors`}
            >
              <span>{card.cta}</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// MissionSection
// ─────────────────────────────────────────
function MissionSection() {
  return (
    <section
      className="mx-6 md:mx-12 my-8 bg-white border-4 border-black rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      style={{ boxShadow: "8px 8px 0 #000" }}
    >
      {/* Left: statement */}
      <div className="p-12 flex flex-col justify-center border-b-4 md:border-b-0 md:border-r-4 border-black">
        <Tag className="-rotate-1 mb-8 self-start">STATEMENT</Tag>
        <h2 className="text-5xl font-extrabold leading-tight mb-10">
          <GlitchText>境界線を、</GlitchText>
          <br />
          <GlitchText>周波数が塗り替える。</GlitchText>
        </h2>
        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            私たちは常に「正常な」周波数帯域で生きている。しかし、その外側には膨大な未開の知覚が眠っている。2024年の電波祭は、その境界を破壊する試みだ。
          </p>
          <p>
            「電波すぎて滅！」という言葉は、終焉ではなく、過剰な刺激による新しい意識の誕生を意味している。高まる周波数の波に乗れ。
          </p>
        </div>
        <div
          className="mt-12 p-8 border-4 border-black bg-gray-50 rounded-lg relative rotate-1"
          style={{ boxShadow: "4px 4px 0 #000" }}
        >
          <div className="absolute -top-4 -right-4 bg-yellow-300 border-2 border-black px-3 py-1 font-bold text-sm uppercase rounded-sm">
            Warning
          </div>
          <p className="text-xs font-mono italic tracking-wider">
            CAUTION: HIGH FREQUENCY ENVIRONMENT. PROCEED WITH CURIOSITY.
          </p>
        </div>
      </div>

      {/* Right: stats */}
      <div className="p-12 bg-black text-white flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 text-center">
          <div className="mb-12">
            <div
              className="text-[140px] font-bold leading-none tracking-tighter mb-4"
              style={{
                color: "#eaea00",
                textShadow: "2px 0 #00FFFF, -2px 0 #FF00FF",
              }}
            >
              99%
            </div>
            <div className="font-bold text-2xl tracking-widest">SIGNAL INTENSITY</div>
          </div>
          <div className="grid grid-cols-2 gap-8 text-left">
            <div className="border-l-4 pl-4" style={{ borderColor: "#00FFFF" }}>
              <div className="text-2xl font-bold">120+</div>
              <div className="text-xs tracking-widest opacity-60">EXHIBITORS</div>
            </div>
            <div className="border-l-4 pl-4" style={{ borderColor: "#FF00FF" }}>
              <div className="text-2xl font-bold">45k</div>
              <div className="text-xs tracking-widest opacity-60">EXPECTED VISITORS</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// NewsletterCTA
// ─────────────────────────────────────────
function NewsletterCTA() {
  const [email, setEmail] = useState("");

  return (
    <section
      className="bg-yellow-300 mx-6 md:mx-12 my-8 p-12 border-4 border-black rounded-xl -rotate-1"
      style={{ boxShadow: "8px 8px 0 #000" }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2">
          <h2
            className="text-5xl font-extrabold leading-none mb-6"
            style={{ textShadow: "2px 0 #00FFFF, -2px 0 #FF00FF" }}
          >
            STAY TUNED.
          </h2>
          <p className="text-lg leading-relaxed">
            最新情報を誰よりも早く受信せよ。ニュースレター登録受付中。
          </p>
        </div>
        <div className="md:w-1/2 w-full flex flex-col md:flex-row gap-4">
          <input
            className="flex-grow bg-white border-4 border-black p-4 rounded-xl font-mono focus:ring-4 focus:ring-pink-400 outline-none placeholder:text-gray-400"
            placeholder="YOUR-EMAIL@DOMAIN.COM"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <HardShadowBtn className="bg-black text-white px-8 py-4 hover:bg-pink-500 whitespace-nowrap">
            SUBSCRIBE
          </HardShadowBtn>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// Footer
// ─────────────────────────────────────────
const FOOTER_LINKS = [
  { heading: "LEGAL", links: ["PRIVACY POLICY", "TERMS OF USE"] },
  { heading: "SUPPORT", links: ["CONTACT", "FAQ"] },
  { heading: "SOCIAL", links: ["TWITTER", "INSTAGRAM"] },
  { heading: "ARCHIVE", links: ["2023 RECAP", "2022 RECAP"] },
];

function Footer() {
  return (
    <footer className="bg-black w-full px-6 md:px-12 py-12 mt-20 flex flex-col gap-8 rounded-t-[40px]">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12">
        <GlitchText className="text-2xl font-bold text-yellow-300">電波祭 2024</GlitchText>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading} className="flex flex-col gap-4">
              <span className="text-white font-bold opacity-50 text-xs tracking-widest">
                {heading}
              </span>
              {links.map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-white text-xs tracking-widest hover:text-yellow-300 transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between gap-4">
        <p className="text-white text-xs tracking-widest">
          © 2024 DEMPA-SAI TECHNICAL FESTIVAL. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-yellow-300 animate-pulse">
            wifi_tethering
          </span>
          <span className="material-symbols-outlined text-yellow-300 animate-bounce">
            graphic_eq
          </span>
          <span className="material-symbols-outlined text-yellow-300 animate-pulse">podcasts</span>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────
// FAB
// ─────────────────────────────────────────
function FAB() {
  return (
    <button
      className="fixed bottom-8 right-8 text-white border-4 border-black px-5 py-4 rounded-xl z-[100] -rotate-1 group flex items-center gap-2 font-bold"
      style={{ background: "#FF00FF", boxShadow: "6px 6px 0 #000" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translate(-2px,-2px) rotate(-1deg)";
        e.currentTarget.style.boxShadow = "8px 8px 0 #000";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "6px 6px 0 #000";
      }}
    >
      <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">
        confirmation_number
      </span>
      GET TICKETS
    </button>
  );
}

// ─────────────────────────────────────────
// Background decorations
// ─────────────────────────────────────────
function BgDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {[
        { icon: "star", cls: "text-pink-400  text-4xl  top-[10%] left-[5%]  rotate-12" },
        { icon: "add", cls: "text-cyan-400  text-6xl  top-[40%] right-[8%] -rotate-6" },
        {
          icon: "change_history",
          cls: "text-yellow-400 text-5xl bottom-[15%] left-[12%] rotate-45",
        },
        { icon: "close", cls: "text-black     text-3xl  top-[25%] right-[25%] -rotate-15" },
        { icon: "pentagon", cls: "text-pink-400  text-7xl  bottom-[5%] right-[15%] rotate-12" },
      ].map(({ icon, cls }) => (
        <span key={icon + cls} className={`material-symbols-outlined absolute opacity-10 ${cls}`}>
          {icon}
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// App
// ─────────────────────────────────────────
export default function App() {
  // Load Material Symbols + Google Fonts
  useEffect(() => {
    const links = [
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap",
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
    ];
    links.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const el = document.createElement("link");
        el.rel = "stylesheet";
        el.href = href;
        document.head.appendChild(el);
      }
    });
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: "#f9f9f9",
        color: "#000",
        cursor: "crosshair",
        fontFamily: "'Bricolage Grotesque', sans-serif",
      }}
    >
      <BgDecorations />
      <div className="relative z-10">
        <TopNavBar />
        <main>
          <Hero />
          <Marquee />
          <EventDetails />
          <NavBentoGrid />
          <MissionSection />
          <NewsletterCTA />
        </main>
        <Footer />
      </div>
      <FAB />
    </div>
  );
}
