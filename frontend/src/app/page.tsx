"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faNewspaper, faUser, faUserGroup, faShop, faCalendar, faChevronRight,
  faCirclePlay, faClock, faCircleInfo, faTriangleExclamation, faLocationDot,
  faRecycle, faMap, faFlag, faGraduationCap, faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { ImportantNews } from "@/components/ImportantNews";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useState, useEffect } from "react";
import { Loading } from "@/components/Loading";
import Link from "next/link";
import Image from "next/image";
import Cookies from 'js-cookie';
import { fetchJsonCached } from "@/utils/api";

const HERO_IMAGES = [
  '/slideshow/1.jpg', '/slideshow/2.jpg', '/slideshow/3.jpg', '/slideshow/4.jpg',
  '/slideshow/5.jpg', '/slideshow/6.jpg', '/slideshow/7.jpg', '/slideshow/8.jpg',
];

/* ── Geometric decoration primitives ── */
const Ring = ({ cls }: { cls: string }) => (
  <div className={`absolute rounded-full border-[3px] pointer-events-none ${cls}`} />
);
const Diamond = ({ cls }: { cls: string }) => (
  <div className={`absolute rotate-45 pointer-events-none ${cls}`} />
);
const Cross = () => (
  <svg className="absolute pointer-events-none" width="40" height="40" viewBox="0 0 40 40" fill="none"
    style={{ top: '18%', left: '12%' }}>
    <rect x="17" y="2" width="6" height="36" rx="3" fill="rgba(255,255,255,0.30)" />
    <rect x="2" y="17" width="36" height="6" rx="3" fill="rgba(255,255,255,0.30)" />
  </svg>
);
const Triangle = ({ cls }: { cls: string }) => (
  <svg className={`absolute pointer-events-none ${cls}`} viewBox="0 0 60 52" fill="none">
    <polygon points="30,4 56,48 4,48" stroke="rgba(255,255,255,0.25)" strokeWidth="3" fill="none" />
  </svg>
);

/* ── 斜め背景 ── */
const DiagBg = ({ color }: { color: string }) => (
  <div className={`absolute inset-0 ${color} -skew-y-1 origin-top-left`} />
);

/* ── 波形セクション区切り ── */
const WaveTop = ({ fill, bg }: { fill: string; bg: string }) => (
  <div className={`w-full overflow-hidden leading-[0] ${bg}`}>
    <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
      className="w-full h-10 md:h-14 block">
      <path d="M0,28 C240,56 480,0 720,28 C960,56 1200,0 1440,28 L1440,0 L0,0 Z" fill={fill} />
    </svg>
  </div>
);

const WaveBottom = ({ fill, bg }: { fill: string; bg: string }) => (
  <div className={`w-full overflow-hidden leading-[0] ${bg}`}>
    <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
      className="w-full h-10 md:h-14 block">
      <path d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28 L1440,56 L0,56 Z" fill={fill} />
    </svg>
  </div>
);

/* ── Festival badge header ── */
function FestBadge({
  icon, title, sub, href, hrefLabel = '一覧へ', color,
}: {
  icon: any; title: string; sub: string; href?: string; hrefLabel?: string; color: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <span className={`inline-flex items-center gap-1.5 ${color} text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-[0.1em] mb-2`}>
          <FontAwesomeIcon icon={icon} className="text-[10px]" />
          {title}
        </span>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors shrink-0">
          {hrefLabel} <FontAwesomeIcon icon={faChevronRight} />
        </Link>
      )}
    </div>
  );
}

export default function Top() {
  /* Random hero image — chosen once on mount, changes every reload */
  const [heroImage] = useState<string>(
    () => HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)]
  );

  const [now, setNow]             = useState(new Date());
  const [newsData, setNewsData]   = useState([]);
  const [eventData, setEventData] = useState([]);
  const [shopData, setShopData]   = useState([]);
  const [newsLoading, setNewsLoading]   = useState(true);
  const [eventLoading, setEventLoading] = useState(true);
  const [shopLoading, setShopLoading]   = useState(true);

  const newsApiUrl  = process.env.NEXT_PUBLIC_API_URL + '/news/?top=true';
  const eventApiUrl = process.env.NEXT_PUBLIC_API_URL + '/event/?top=true';
  const shopApiUrl  = process.env.NEXT_PUBLIC_API_URL + '/shop/?top=true';
  const csrftoken   = Cookies.get('csrftoken') || '';

  const fetchNews = async () => {
    try {
      const data = await fetchJsonCached(newsApiUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      setNewsData(data['news']);
    } catch { setNewsData([]); } finally { setNewsLoading(false); }
  };
  const fetchEvent = async () => {
    try {
      const data = await fetchJsonCached(eventApiUrl, { method: 'GET', headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken } });
      setEventData(data['event']);
      setNow(new Date(data['now']));
    } catch { setEventData([]); } finally { setEventLoading(false); }
  };
  const fetchShop = async () => {
    try {
      const res  = await fetch(shopApiUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      const data = await res.json();
      setShopData(data['shop']);
    } catch { setShopData([]); } finally { setShopLoading(false); }
  };

  useEffect(() => { fetchNews(); fetchEvent(); fetchShop(); }, []);

  if (newsLoading || eventLoading || shopLoading) return <Loading />;

  return (
    <main>
      <ImportantNews />

      {/* ══════════════════════════════════════════════
          HERO — random background photo
      ══════════════════════════════════════════════ */}
      <section className="relative -mt-[60px] min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background photo */}
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          className="object-cover"
        />
        {/* Blue-tinted dark overlay */}
        <div className="absolute inset-0 bg-blue-950/55" />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Geometric shapes */}
        <Ring cls="w-80 h-80 border-white/20 -right-20 -top-20" />
        <Ring cls="w-48 h-48 border-white/15 -left-12 bottom-10" />
        <Ring cls="w-24 h-24 border-white/20 right-1/4 bottom-16" />
        <Diamond cls="w-14 h-14 bg-white/10 right-20 top-24" />
        <Diamond cls="w-8 h-8 bg-white/10 left-1/3 top-12" />
        <Diamond cls="w-5 h-5 bg-white/15 left-16 bottom-24" />
        <Cross />
        <Triangle cls="w-16 h-14 right-[15%] bottom-[20%]" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 py-20">
          <p className="mb-3 text-xs font-medium tracking-[0.3em] text-blue-200 uppercase drop-shadow">
            香川高等専門学校 詫間キャンパス
          </p>
          <h1 className="text-8xl md:text-9xl font-bold tracking-[0.2em] text-white mb-6
            drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
            電波祭
          </h1>
          <div className="mx-auto mb-6 w-16 h-[2px] bg-white/60" />
          <p className="text-xl md:text-2xl font-light tracking-[0.15em] text-white/90 mb-3 drop-shadow">
            第54回
          </p>
          <p className="text-sm text-white/70 tracking-[0.2em] drop-shadow">
            2026年10月31日（土）・11月1日（日）
          </p>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce">
          <FontAwesomeIcon icon={faArrowDown} className="text-sm" />
          <span className="text-[10px] tracking-widest">SCROLL</span>
        </div>

        {/* Fade to white at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
      </section>

      {/* ══════════════════════════════════════════════
          NEWS — full-width stripe
      ══════════════════════════════════════════════ */}
      <section className="bg-white border-b border-slate-100 py-16 px-5 md:px-10">
        <AnimatedSection>
          <div className="max-w-5xl mx-auto">
            <SectionHeader icon={faNewspaper} title="News" sub="運営からのお知らせ" href="/news" />
            <div className="mt-6 space-y-3">
              {newsData.length > 0 ? newsData.map((news) => (
                <Link key={news['id']} href={`/news/${news['id']}`} className="block group">
                  <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/60
                    p-4 transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm">
                    <div className="mt-1.5 w-1 self-stretch rounded-full bg-blue-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-400 mb-1">{new Date(news['created_at']).toLocaleDateString('ja-JP')}</p>
                      <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{news['title']}</h3>
                      <p className="mt-1 text-xs text-slate-400">
                        <FontAwesomeIcon icon={faUser} className="mr-1" />{news['user__username']}
                        　<FontAwesomeIcon icon={faUserGroup} className="mr-1" />{news['organization__name']}
                      </p>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} className="text-blue-200 text-xs mt-1.5 shrink-0 group-hover:text-blue-500 transition-colors" />
                  </div>
                </Link>
              )) : <EmptyState text="お知らせはありません" />}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ══════════════════════════════════════════════
          SHOP & EVENT — full-width stripe
      ══════════════════════════════════════════════ */}
      <section className="bg-[#f4f8ff] border-b border-slate-100 py-16 px-5 md:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2">

            <AnimatedSection delay={0}>
              <SectionHeader icon={faShop} title="Shop" sub="模擬店情報" href="/shop" />
              <div className="mt-6 space-y-3">
                {shopData.length > 0 ? shopData.map((shop) => (
                  <Link key={shop['id']} href={`/shop/${shop['id']}`} className="block group">
                    <div className="flex items-start gap-3 rounded-xl border border-white bg-white
                      p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
                      {shop['image__image__image'] ? (
                        <img src={shop['image__image__image']} alt={shop['name']}
                          className="w-16 h-16 object-cover rounded-lg shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <FontAwesomeIcon icon={faShop} className="text-blue-300" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{shop['name']}</h3>
                        <p className="mt-0.5 text-xs text-slate-400">@{shop['address']}</p>
                        <p className="text-xs text-slate-400">{shop['organization__name']}</p>
                      </div>
                    </div>
                  </Link>
                )) : <EmptyState text="模擬店情報はありません" />}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={80}>
              <SectionHeader icon={faCalendar} title="Event" sub="イベント情報" href="/event" />
              <div className="mt-6 space-y-3">
                {eventData.length > 0 ? eventData.map((event) => {
                  const start = new Date(event['start']);
                  const end   = new Date(event['end']);
                  const live  = start <= now && now < end;
                  const soon  = now < start && start <= new Date(now.getTime() + 3600000);
                  return (
                    <Link key={event['id']} href={`/event/${event['id']}`} className="block group">
                      <div className={`rounded-xl border p-4 shadow-sm transition-all hover:shadow-md
                        ${live ? 'border-green-200 bg-green-50' : 'border-white bg-white hover:border-blue-200'}`}>
                        <p className="text-xs text-slate-400 mb-1">
                          {start.toLocaleDateString('ja-JP')}{' '}
                          {start.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} 〜{' '}
                          {end.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {live && <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 rounded-full px-2 py-0.5 mb-1"><FontAwesomeIcon icon={faCirclePlay} /> 進行中</span>}
                        {soon && !live && <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full px-2 py-0.5 mb-1"><FontAwesomeIcon icon={faClock} /> まもなく開始</span>}
                        <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                          {event['title']} <span className="font-normal text-slate-400">@{event['place']}</span>
                        </h3>
                      </div>
                    </Link>
                  );
                }) : <EmptyState text="イベント情報はありません" />}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          INFORMATION — full-width stripe
      ══════════════════════════════════════════════ */}
      <section className="bg-white border-b border-slate-100 py-16 px-5 md:px-10">
        <AnimatedSection>
          <div className="max-w-5xl mx-auto">
            <SectionHeader icon={faCircleInfo} title="Information" sub="ご案内" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { href: '/information/caution', icon: faTriangleExclamation, label: 'ご来場の注意',    sub: '来場前にご確認ください',      color: 'text-amber-600 bg-amber-50' },
                { href: '/information/guide',   icon: faLocationDot,         label: '案内所・落とし物', sub: 'お気軽にお立ち寄りください',  color: 'text-blue-600 bg-blue-50' },
                { href: '/information/recycle', icon: faRecycle,             label: '分別について',    sub: 'ゴミの正しい分け方',          color: 'text-green-600 bg-green-50' },
                { href: '/information/access',  icon: faMap,                 label: 'アクセスマップ',  sub: '会場へのアクセス方法',        color: 'text-sky-600 bg-sky-50' },
              ].map(({ href, icon, label, sub, color }) => (
                <Link key={href} href={href} className="block group">
                  <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4
                    transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm">
                    <span className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg shrink-0 ${color}`}>
                      <FontAwesomeIcon icon={icon} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 text-xs shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ══════════════════════════════════════════════
          THEME — full-width dark stripe
      ══════════════════════════════════════════════ */}
      <section className="relative border-b border-blue-800 py-16 px-5 md:px-10 overflow-hidden">
        {/* Background image */}
        <Image src="/theme-bg.jpg" alt="" fill className="object-cover" />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-blue-950/60" />
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -right-10 -top-10 w-48 h-48 rounded-full border-[3px] border-blue-700/40 z-10" />
        <div className="pointer-events-none absolute left-12 bottom-0 w-16 h-16 rotate-45 bg-blue-800/60 translate-y-8 z-10" />

        <AnimatedSection delay={60} className="relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-1 h-5 rounded-full bg-blue-600" />
              <h2 className="text-xl font-bold tracking-[0.08em] text-white">
                <FontAwesomeIcon icon={faFlag} className="mr-2 text-blue-500" />
                Theme
              </h2>
            </div>
            <p className="text-xs text-slate-300 pl-3 mb-20">第54回電波祭テーマ</p>

            <div className="text-center mb-20">
              <p className="text-7xl font-bold text-white tracking-widest
                drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] mb-6">電波すぎて滅！</p>
              <p className="text-sm text-blue-300 tracking-widest">— 周波数はみるみる上昇中 —</p>
            </div>

            <p className="text-sm text-blue-100 leading-8 max-w-2xl mx-auto text-center">
              今年の電波祭のテーマは「繋（つなぐ）」です。<br />
              学生・地域・技術——異なる世界をひとつに繋ぎ、多くの人々との絆を深める場として、
              第54回電波祭を開催します。<br />
              在学生が日々の学びの中で積み上げてきた研究・制作・演奏の成果をここに発表し、
              来場者のみなさまと互いの交流を通じてともに成長することを目指しています。
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* ══════════════════════════════════════════════
          OVERVIEW — full-width stripe
      ══════════════════════════════════════════════ */}
      <section className="bg-[#f4f8ff] border-b border-slate-100 py-16 px-5 md:px-10">
        <AnimatedSection delay={60}>
          <div className="max-w-5xl mx-auto">
            <SectionHeader icon={faCalendar} title="Overview" sub="開催概要" />
            <table className="mt-6 w-full border-collapse text-sm">
              <tbody>
                {[
                  { label: '名称', value: '第54回 電波祭' },
                  { label: '日程', value: '2026年10月31日（土）・11月1日（日）' },
                  { label: '時間', value: '9:30 〜 16:30' },
                  { label: '入場', value: '無料' },
                ].map(({ label, value }) => (
                  <tr key={label} className="border-b border-slate-200 last:border-0">
                    <th className="w-1/3 py-3 px-6 text-left text-xs font-medium text-slate-400 whitespace-nowrap align-top">
                      {label}
                    </th>
                    <td className="py-3 px-6 text-slate-700">{value}</td>
                  </tr>
                ))}
                <tr className="border-b border-slate-200">
                  <th className="w-1/3 py-3 px-6 text-left text-xs font-medium text-slate-400 whitespace-nowrap align-top">
                    会場
                  </th>
                  <td className="py-3 px-6 text-slate-700">
                    <span>香川高等専門学校 詫間キャンパス</span>
                    <a
                      href="https://maps.app.goo.gl/mT7rGErfvYvPBacF7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <FontAwesomeIcon icon={faLocationDot} />
                      地図
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </AnimatedSection>
      </section>

      {/* ══════════════════════════════════════════════
          TIMETABLE — full-width stripe
      ══════════════════════════════════════════════ */}
      <TimetableSection />

      {/* ══════════════════════════════════════════════
          ABOUT — full-width stripe
      ══════════════════════════════════════════════ */}
      <section className="bg-[#f4f8ff] py-16 px-5 md:px-10">
        <AnimatedSection delay={60}>
          <div className="max-w-5xl mx-auto">
            <SectionHeader icon={faGraduationCap} title="About" sub="電波祭について" href="/about" hrefLabel="詳しく見る" />
            <p className="mt-5 text-sm text-slate-600 leading-7 max-w-2xl">
              電波祭は、香川高等専門学校 詫間キャンパスが毎年秋に開催する文化祭です。
              各学科の研究発表・模擬店・ステージイベントなど多彩なプログラムを楽しめます。
            </p>
          </div>
        </AnimatedSection>
      </section>
    </main>
  );
}

/* ── Shared sub-components ── */

function SectionHeader({
  icon, title, sub, href, hrefLabel = '一覧へ',
}: {
  icon: any; title: string; sub: string; href?: string; hrefLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="w-1 h-5 rounded-full bg-blue-600" />
          <h2 className="text-xl font-bold tracking-[0.08em] text-blue-900">
            <FontAwesomeIcon icon={icon} className="mr-2 text-blue-400" />
            {title}
          </h2>
        </div>
        <p className="text-xs text-slate-400 pl-3">{sub}</p>
      </div>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition-colors shrink-0">
          {hrefLabel} <FontAwesomeIcon icon={faChevronRight} />
        </Link>
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 text-center">
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  );
}

const TIMETABLE: Record<1 | 2, { time: string; label: string; type: 'ceremony' | 'stage' | 'exhibition' | 'activity' | 'break' }[]> = {
  1: [
    { time: '9:30',  label: '開会式',       type: 'ceremony'   },
    { time: '10:00', label: '研究・制作発表', type: 'exhibition' },
    { time: '11:00', label: 'ステージイベント', type: 'stage'   },
    { time: '12:00', label: '昼休憩',        type: 'break'      },
    { time: '13:00', label: '軽音楽演奏',    type: 'stage'      },
    { time: '14:30', label: '吹奏楽演奏',    type: 'stage'      },
    { time: '16:00', label: 'フィナーレ',    type: 'ceremony'   },
    { time: '16:30', label: '閉場',          type: 'break'      },
  ],
  2: [
    { time: '9:30',  label: '開場',          type: 'break'      },
    { time: '10:00', label: '研究・制作発表', type: 'exhibition' },
    { time: '11:30', label: 'ステージイベント', type: 'stage'   },
    { time: '12:00', label: '昼休憩',        type: 'break'      },
    { time: '13:00', label: 'スタンプラリー', type: 'activity'  },
    { time: '14:00', label: '体験コーナー',  type: 'activity'   },
    { time: '15:30', label: '閉会式',        type: 'ceremony'   },
    { time: '16:30', label: '閉場',          type: 'break'      },
  ],
};

const TYPE_STYLE: Record<string, string> = {
  ceremony:   'bg-blue-100   text-blue-700',
  stage:      'bg-purple-100 text-purple-700',
  exhibition: 'bg-green-100  text-green-700',
  activity:   'bg-orange-100 text-orange-700',
  break:      'bg-slate-100  text-slate-500',
};

const DAY_LABELS: Record<1 | 2, string> = {
  1: '10月31日（土）',
  2: '11月1日（日）',
};

function DayColumn({ day }: { day: 1 | 2 }) {
  return (
    <div>
      <p className="text-xs font-semibold text-blue-700 mb-3">{DAY_LABELS[day]}</p>
      <div className="space-y-2">
        {TIMETABLE[day].map(({ time, label, type }) => (
          <div key={time} className="flex items-center gap-4">
            <span className="w-12 shrink-0 text-xs text-slate-400 font-mono">{time}</span>
            <div className="w-px h-4 bg-slate-200 shrink-0" />
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${TYPE_STYLE[type]}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimetableSection() {
  const [day, setDay] = useState<1 | 2>(1);
  return (
    <section className="bg-white border-b border-slate-100 py-16 px-5 md:px-10">
      <AnimatedSection delay={60}>
        <div className="max-w-5xl mx-auto">
          <SectionHeader icon={faClock} title="Timetable" sub="公式イベント　タイムテーブル" />

          {/* モバイル: タブ切り替え */}
          <div className="md:hidden">
            <div className="mt-6 flex gap-2">
              {([1, 2] as const).map((d) => (
                <button key={d} onClick={() => setDay(d)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors
                    ${day === d ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {DAY_LABELS[d]}
                </button>
              ))}
            </div>
            <div className="mt-5">
              <DayColumn day={day} />
            </div>
          </div>

          {/* デスクトップ: 2カラム並列 */}
          <div className="hidden md:grid md:grid-cols-2 gap-10 mt-6">
            <DayColumn day={1} />
            <DayColumn day={2} />
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
