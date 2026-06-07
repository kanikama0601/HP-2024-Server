"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper, faUser, faUserGroup, faShop, faCalendar, faChevronRight, faCircleStop, faCirclePlay, faClock } from "@fortawesome/free-solid-svg-icons";
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
	const [newsLoading, setNewsLoading] = useState(true);
	const [eventLoading, setEventLoading] = useState(true);
	const newsApiUrl = process.env.NEXT_PUBLIC_API_URL + '/news/?top=true';
	const eventApiUrl = process.env.NEXT_PUBLIC_API_URL + '/event/?top=true';
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

	useEffect(() => {
			fetchNews(); // 関数を呼び出す
			fetchEvent();
	}, []); // コンポーネントのマウント時に実行

	if (newsLoading || eventLoading) {
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
						<div className="mt-5 rounded-2xl border border-white/60 bg-white/40 p-5">
							<p className="text-base font-medium text-neutral-950">模擬店情報は下記リンクよりご覧ください</p>
							<p className="mt-2 text-sm leading-7 text-neutral-600">
								出店内容や場所を一覧で確認しやすいように整理しています。
							</p>
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
											{new Date(event['start']) < now && now < new Date(event['end']) && <span className="text-neutral-800">　<FontAwesomeIcon icon={faCirclePlay} /> 進行中</span>}
											{now < new Date(event['start']) && now < new Date(event['end']) && <span className="text-neutral-600">　<FontAwesomeIcon icon={faClock} /> 開始前</span>}
											{new Date(event['start']) < now && new Date(event['end']) < now && <span className="text-neutral-800">　<FontAwesomeIcon icon={faCircleStop} /> 終了済み</span>}
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
		</main>
	);
}
