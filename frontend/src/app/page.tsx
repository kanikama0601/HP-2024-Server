"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper, faUser, faUserGroup, faShop, faCalendar, faChevronRight, faCirclePlay, faClock, faCircleInfo, faTriangleExclamation, faLocationDot, faRecycle, faMap, faFlag, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { ImportantNews } from "@/components/ImportantNews";
import { useState, useEffect } from "react";
import { Loading } from "@/components/Loading";
import Link from "next/link";
import Cookies from 'js-cookie';
import { fetchJsonCached } from "@/utils/api";

export default function Top() {
	const [now, setNow] = useState(new Date());
	const [newsData, setNewsData] = useState([]);
	const [eventData, setEventData] = useState([]);
	const [shopData, setShopData] = useState([]);
	const [newsLoading, setNewsLoading] = useState(true);
	const [eventLoading, setEventLoading] = useState(true);
	const [shopLoading, setShopLoading] = useState(true);
	const newsApiUrl = process.env.NEXT_PUBLIC_API_URL + '/news/?top=true';
	const eventApiUrl = process.env.NEXT_PUBLIC_API_URL + '/event/?top=true';
	const shopApiUrl = process.env.NEXT_PUBLIC_API_URL + '/shop/?top=true';
	const csrftoken = Cookies.get('csrftoken') || '';

	const fetchNews = async () => {
		try {
			const data = await fetchJsonCached(newsApiUrl, {
					method: 'GET',
					headers: {
							'Content-Type': 'application/json'
					},
			});
			setNewsData(data['news']);
		} catch (error) {
			console.error('News load error:', error);
			setNewsData([]);
		} finally {
			setNewsLoading(false);
		}
	};
	const fetchEvent = async () => {
		try {
			const data = await fetchJsonCached(eventApiUrl, {
					method: 'GET',
					headers: {
							'Content-Type': 'application/json',
							'X-CSRFToken': csrftoken,
					},
			});
			setEventData(data['event']);
			setNow(new Date(data['now']));
		} catch (error) {
			console.error('Event load error:', error);
			setEventData([]);
		} finally {
			setEventLoading(false);
		}
	};

	const fetchShop = async () => {
		try {
			const res = await fetch(shopApiUrl, {
					method: 'GET',
					headers: {
							'Content-Type': 'application/json',
					},
			});
			const data = await res.json();
			setShopData(data['shop']);
		} catch (error) {
			console.error('Shop load error:', error);
			setShopData([]);
		} finally {
			setShopLoading(false);
		}
	};

	useEffect(() => {
			fetchNews();
			fetchEvent();
			fetchShop();
	}, []); // コンポーネントのマウント時に実行

	if (newsLoading || eventLoading || shopLoading) {
		return <Loading />;
	}

	return (
		<main className="pb-12">
			<ImportantNews />

			<section className="container mx-auto px-3 py-10 md:py-24">
				<div className="min-h-[58vh] flex items-center justify-center">
					<h1 className="text-center text-white font-bold text-xl md:text-2xl drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)]">
						<p className="my-5 drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">香川高等専門学校</p>
						<p className="my-5 drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">詫間キャンパス</p>
						<p className="my-20 text-6xl tracking-[0.18em] md:text-7xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">電波祭</p>
						<p className="my-5 drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">2024年11月2日-3日</p>
					</h1>
				</div>
			</section>

			<section className="container mx-auto px-3 pb-10">
				<div className="glass-panel rounded-[2rem] p-6 md:p-8">
					<div className="flex items-end justify-between gap-4">
						<div>
							<h2 className="text-2xl md:text-3xl font-light tracking-[0.12em] text-neutral-950">
								<FontAwesomeIcon icon={faNewspaper} /> News
							</h2>
							<p className="mt-1 text-xs text-neutral-500">運営からのお知らせ</p>
						</div>
						<Link href="/news" className="text-sm text-neutral-500 transition hover:text-neutral-950">
							一覧へ <FontAwesomeIcon icon={faChevronRight} />
						</Link>
					</div>
					<div className="mt-5 space-y-4">
						{newsData.length > 0 ?
						newsData.map((news) => (
							<Link key={news['id']} href={`/news/${news['id']}`} className="block">
								<div className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md p-5 transition hover:-translate-y-0.5 hover:bg-white/60 hover:shadow-sm">
									<p className="text-xs text-neutral-500">{new Date(news['created_at']).toLocaleDateString('ja-JP')}</p>
									<h3 className="mt-2 text-base font-medium text-neutral-950">{news['title']}</h3>
									<p className="mt-2 text-xs text-neutral-600">
										<FontAwesomeIcon icon={faUser} /> {news['user__username']}　<FontAwesomeIcon icon={faUserGroup} /> {news['organization__name']}
									</p>
								</div>
							</Link>
						))
						: <div className="rounded-2xl border border-white/60 bg-white/40 p-5">
							<p className="text-sm text-neutral-600">お知らせはありません</p>
						</div>
						}
					</div>
				</div>
			</section>

			<section className="container mx-auto px-3 pb-10">
				<div className="grid gap-6 md:grid-cols-2">
					<div className="glass-panel rounded-[2rem] p-6 md:p-8">
						<div className="flex items-end justify-between gap-4">
							<div>
								<h2 className="text-2xl md:text-3xl font-light tracking-[0.12em] text-neutral-950">
									<FontAwesomeIcon icon={faShop} /> Shop
								</h2>
								<p className="mt-1 text-xs text-neutral-500">模擬店情報</p>
							</div>
							<Link href="/shop" className="text-sm text-neutral-500 transition hover:text-neutral-950">
								一覧へ <FontAwesomeIcon icon={faChevronRight} />
							</Link>
						</div>
						<div className="mt-5 space-y-4">
							{shopData.length > 0 ?
							shopData.map((shop) => (
								<Link key={shop['id']} href={`/shop/${shop['id']}`} className="block">
									<div className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md p-5 transition hover:-translate-y-0.5 hover:bg-white/60 hover:shadow-sm">
										{shop['image__image__image'] && (
											<img src={shop['image__image__image']} alt={shop['name']} className="w-full h-32 object-cover rounded-xl mb-3" />
										)}
										<h3 className="text-base font-medium text-neutral-950">{shop['name']}</h3>
										<p className="mt-1 text-xs text-neutral-600">@{shop['address']}</p>
										<p className="mt-1 text-xs text-neutral-500">{shop['organization__name']}</p>
									</div>
								</Link>
							))
							: <div className="rounded-2xl border border-white/60 bg-white/40 p-5">
								<p className="text-sm text-neutral-600">模擬店情報はありません</p>
							</div>
							}
						</div>
					</div>

					<div className="glass-panel rounded-[2rem] p-6 md:p-8">
						<div className="flex items-end justify-between gap-4">
							<div>
								<h2 className="text-2xl md:text-3xl font-light tracking-[0.12em] text-neutral-950">
									<FontAwesomeIcon icon={faCalendar} /> Event
								</h2>
								<p className="mt-1 text-xs text-neutral-500">イベント情報</p>
							</div>
							<Link href="/event" className="text-sm text-neutral-500 transition hover:text-neutral-950">
								一覧へ <FontAwesomeIcon icon={faChevronRight} />
							</Link>
						</div>
						<div className="mt-5 space-y-4">
							{eventData.length > 0 ?
							eventData.map((event) => (
								<Link key={event['id']} href={`/event/${event['id']}`} className="block">
									<div className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md p-5 transition hover:-translate-y-0.5 hover:bg-white/60 hover:shadow-sm">
										<p className="text-xs text-neutral-500">
											{new Date(event['start']).toLocaleDateString('ja-JP')} {new Date(event['start']).toLocaleTimeString('ja-JP', {hour: '2-digit', minute:'2-digit'})} ~ {new Date(event['end']).toLocaleTimeString('ja-JP', {hour: '2-digit', minute:'2-digit'})}
											{new Date(event['start']) <= now && now < new Date(event['end']) && <span className="text-green-700">　<FontAwesomeIcon icon={faCirclePlay} /> 進行中</span>}
											{now < new Date(event['start']) && new Date(event['start']) <= new Date(now.getTime() + 60 * 60 * 1000) && <span className="text-orange-600">　<FontAwesomeIcon icon={faClock} /> まもなく開始</span>}
											{now < new Date(event['start']) && new Date(event['start']) > new Date(now.getTime() + 60 * 60 * 1000) && <span className="text-neutral-600">　<FontAwesomeIcon icon={faClock} /> 開始前</span>}
										</p>
										<h3 className="mt-2 text-base font-medium text-neutral-950">
											{event['title']} <span className="text-neutral-600">@{event['place']}</span>
										</h3>
									</div>
								</Link>
							))
							: <div className="rounded-2xl border border-white/60 bg-white/40 p-5">
								<p className="text-sm text-neutral-600">イベント情報はありません</p>
							</div>
							}
						</div>
					</div>
				</div>
			</section>

			<section className="container mx-auto px-3 pb-10">
				<div className="flex flex-col gap-6">

					{/* ご案内 */}
					<div className="glass-panel rounded-[2rem] p-6 md:p-8">
						<div className="flex items-end justify-between gap-4 mb-5">
							<div>
								<h2 className="text-2xl md:text-3xl font-light tracking-[0.12em] text-neutral-950">
									<FontAwesomeIcon icon={faCircleInfo} /> Information
								</h2>
								<p className="mt-1 text-xs text-neutral-500">ご案内</p>
							</div>
						</div>
						<div className="grid gap-3 sm:grid-cols-2">
							{[
								{ href: '/information/caution',  icon: faTriangleExclamation, label: 'ご来場の注意',    sub: '来場前にご確認ください' },
								{ href: '/information/guide',    icon: faLocationDot,         label: '案内所・落とし物', sub: 'お気軽にお立ち寄りください' },
								{ href: '/information/recycle',  icon: faRecycle,             label: '分別について',    sub: 'ゴミの正しい分け方' },
								{ href: '/information/access',   icon: faMap,                 label: 'アクセスマップ',  sub: '会場へのアクセス方法' },
							].map(({ href, icon, label, sub }) => (
								<Link key={href} href={href} className="block">
									<div className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md p-5 transition hover:-translate-y-0.5 hover:bg-white/60 hover:shadow-sm flex items-center gap-4">
										<span className="text-2xl text-neutral-700 w-8 text-center">
											<FontAwesomeIcon icon={icon} />
										</span>
										<div>
											<p className="text-base font-medium text-neutral-950">{label}</p>
											<p className="text-xs text-neutral-500 mt-0.5">{sub}</p>
										</div>
										<FontAwesomeIcon icon={faChevronRight} className="ml-auto text-neutral-400 text-xs" />
									</div>
								</Link>
							))}
						</div>
					</div>

					{/* テーマ */}
					<Link href="/theme" className="block">
						<div className="glass-panel rounded-[2rem] p-6 md:p-8 transition hover:shadow-lg">
							<div className="flex items-end justify-between gap-4 mb-6">
								<div>
									<h2 className="text-2xl md:text-3xl font-light tracking-[0.12em] text-neutral-950">
										<FontAwesomeIcon icon={faFlag} /> Theme
									</h2>
									<p className="mt-1 text-xs text-neutral-500">第43回電波祭テーマ</p>
								</div>
								<FontAwesomeIcon icon={faChevronRight} className="text-neutral-400" />
							</div>
							<p className="text-6xl font-bold text-neutral-950 tracking-widest text-center my-6">繋</p>
							<p className="text-center text-sm text-neutral-600 tracking-widest">— つなぐ、ひろがる、でんぱさい —</p>
						</div>
					</Link>

					{/* 電波祭について */}
					<div className="glass-panel rounded-[2rem] p-6 md:p-8">
						<div className="flex items-end justify-between gap-4 mb-4">
							<div>
								<h2 className="text-2xl md:text-3xl font-light tracking-[0.12em] text-neutral-950">
									<FontAwesomeIcon icon={faGraduationCap} /> About
								</h2>
								<p className="mt-1 text-xs text-neutral-500">電波祭について</p>
							</div>
							<Link href="/about" className="text-sm text-neutral-500 transition hover:text-neutral-950">
								詳しく見る <FontAwesomeIcon icon={faChevronRight} />
							</Link>
						</div>
						<p className="text-sm text-neutral-700 leading-7">
							電波祭は、香川高等専門学校 詫間キャンパスが毎年秋に開催する文化祭です。
						</p>
					</div>

				</div>
			</section>
		</main>
	);
}
