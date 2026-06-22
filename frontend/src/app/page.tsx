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

const HERO_IMAGES = ['/1.jpg','/2.jpg','/3.jpg','/4.jpg','/5.jpg','/6.jpg','/7.jpg','/8.jpg'];

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
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
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
            第43回
          </p>
          <p className="text-sm text-white/70 tracking-[0.2em] drop-shadow">
            2024年11月2日（土）・3日（日）
          </p>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce">
          <FontAwesomeIcon icon={faArrowDown} className="text-sm" />
          <span className="text-[10px] tracking-widest">SCROLL</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          NEWS — full-width stripe
      ══════════════════════════════════════════════ */}
      <section className="bg-white border-b border-slate-100 py-12 px-5 md:px-10">
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
      <section className="bg-[#f4f8ff] border-b border-slate-100 py-12 px-5 md:px-10">
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
      <section className="bg-white border-b border-slate-100 py-12 px-5 md:px-10">
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
      <section className="relative bg-blue-900 border-b border-blue-800 py-12 px-5 md:px-10 overflow-hidden">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -right-10 -top-10 w-48 h-48 rounded-full border-[3px] border-blue-700/40" />
        <div className="pointer-events-none absolute left-12 bottom-0 w-16 h-16 rotate-45 bg-blue-800/60 translate-y-8" />

        <AnimatedSection delay={60}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-1 h-5 rounded-full bg-blue-400" />
                  <h2 className="text-xl font-bold tracking-[0.08em] text-white">
                    <FontAwesomeIcon icon={faFlag} className="mr-2 text-blue-400" />
                    Theme
                  </h2>
                </div>
                <p className="text-xs text-blue-400 pl-3">第43回電波祭テーマ</p>
              </div>
              <Link href="/theme" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-200 transition-colors shrink-0">
                詳しく見る <FontAwesomeIcon icon={faChevronRight} />
              </Link>
            </div>
            <div className="mt-8 text-center">
              <p className="text-7xl font-bold text-white tracking-widest
                drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] mb-4">繋</p>
              <p className="text-sm text-blue-300 tracking-widest">— つなぐ、ひろがる、でんぱさい —</p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ══════════════════════════════════════════════
          ABOUT — full-width stripe
      ══════════════════════════════════════════════ */}
      <section className="bg-white py-12 px-5 md:px-10">
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
