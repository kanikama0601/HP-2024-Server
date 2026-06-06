"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette, faNewspaper, faUser, faUserGroup, faShop, faCalendar, faChevronRight, faCircleStop, faCirclePlay, faClock } from "@fortawesome/free-solid-svg-icons";
import { ImportantNews } from "@/components/ImportantNews";
import { useState, useEffect } from "react";
import { Loading } from "@/components/Loading";
import Link from "next/link";
import Cookies from 'js-cookie';
import { set } from "react-hook-form";

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
			const response = await fetch(newsApiUrl, {
					method: 'GET',
					headers: {
							'Content-Type': 'application/json'
					},
			});
			const contentType = response.headers.get('content-type');
			if (contentType && contentType.includes('application/json')) {
					const data = await response.json();
					setNewsData(data['news']);
			}
			setNewsLoading(false);
	};
	const fetchEvent = async () => {
		const response = await fetch(eventApiUrl, {
				method: 'GET',
				headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': csrftoken,
				},
		});
		const contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
				const data = await response.json();
				setEventData(data['event']);
				setNow(new Date(data['now']));
		}
		setEventLoading(false);
};

	useEffect(() => {
			fetchNews(); // 関数を呼び出す
			fetchEvent();
	}, []); // コンポーネントのマウント時に実行

	return (
			<main>
				<ImportantNews />
				<h1 className="text-white font-bold text-center my-20 text-xl text-shadow-md mb-32 h-96f">
					<p className="my-5">香川高等専門学校</p>
					<p className="my-5">詫間キャンパス</p>
					<p className="my-20 text-6xl">電波祭</p>
					<p className="my-5">2024年11月2日-3日</p>
				</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 container mx-auto">
					<div className="mx-3.5 my-10">
						<div className="container mx-auto text-white">
							<h2 className="text-3xl font-light text-shadow-md">
							<FontAwesomeIcon icon={faPalette} /> Theme
							</h2>
							<p className="text-xs mb-4 mt-1">
							今年のテーマ
							</p>
						</div>
						<div className="container mx-auto text-base">
							<div className="w-full p-4 bg-white flex justify-between rounded-lg">
								<p>電波事変</p>
							</div>
						</div>
					</div>
					<div className="mx-3.5 my-10">
						<div className="container mx-auto text-white">
							<h2 className="text-3xl font-light text-shadow-md">
							<FontAwesomeIcon icon={faNewspaper} /> News
							</h2>
							<p className="text-xs mb-4 mt-1">
							運営からのお知らせ
							</p>
						</div>
						<div className="container mx-auto text-xl">
							{newsLoading ? <Loading /> :
							newsData.length > 0 ?
							newsData.map((news) => (
							<Link key={news['id']} href={`/news/${news['id']}`}>
								<div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
									<p className="text-xs my-1.5 text-gray-700">{new Date(news['created_at']).toLocaleDateString('ja-JP')}</p>
									<h3 className="text-base">{news['title']}</h3>
									<p className="text-xs my-1.5 text-gray-700"><FontAwesomeIcon icon={faUser} /> {news['user__username']}　<FontAwesomeIcon icon={faUserGroup} /> {news['organization__name']}</p>
								</div>
							</Link>
							))
							: <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
								<p className="text-base">お知らせはありません</p>
								</div>
							}
						</div>
						<Link href={"/news"}>
							<p className="text-center text-white hover:text-gray-200 transition duration-100">お知らせ一覧 <FontAwesomeIcon icon={faChevronRight} /></p>
						</Link>
					</div>
					<div className="mx-3.5 my-10">
						<div className="container mx-auto text-white">
							<h2 className="text-3xl font-light text-shadow-md">
							<FontAwesomeIcon icon={faShop} /> Shop
							</h2>
							<p className="text-xs mb-4 mt-1">
							模擬店情報
							</p>
						</div>
						<div className="container mx-auto text-xl">	
							<div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
								<p className="text-base">模擬店情報は下記リンクよりご覧ください</p>
							</div>
						</div>
						<Link href={"/shop"}>
							<p className="text-center text-white hover:text-gray-200 transition duration-100">模擬店一覧 <FontAwesomeIcon icon={faChevronRight} /></p>
						</Link>
					</div>
					<div className="mx-3.5 my-10">
						<div className="container mx-auto text-white">
							<h2 className="text-3xl font-light text-shadow-md">
							<FontAwesomeIcon icon={faCalendar} /> Event
							</h2>
							<p className="text-xs mb-4 mt-1">
							イベント情報
							</p>
						</div>
						<div className="container mx-auto text-xl">	
							{eventLoading ? <Loading /> :
							eventData.length > 0 ?
							eventData.map((event) => (
							<Link key={event['id']} href={`/event/${event['id']}`}>
								<div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
									<p className="text-xs my-1.5 text-gray-700">
										{new Date(event['start']).toLocaleDateString('ja-JP')} {new Date(event['start']).toLocaleTimeString('ja-JP', {hour: '2-digit', minute:'2-digit'})} ~ {new Date(event['end']).toLocaleTimeString('ja-JP', {hour: '2-digit', minute:'2-digit'})}
										{new Date(event['start']) < now && now < new Date(event['end']) && <span className="text-green-600">　<FontAwesomeIcon icon={faCirclePlay} /> 進行中</span>}
										{now < new Date(event['start']) && now < new Date(event['end']) && <span className="text-gray-600">　<FontAwesomeIcon icon={faClock} /> 開始前</span>}
										{new Date(event['start']) < now && new Date(event['end']) < now && <span className="text-red-600">　<FontAwesomeIcon icon={faCircleStop} /> 終了済み</span>}
									</p>
									<h3 className="text-base">{event['title']} <span className="text-gray-600">@{event['place']}</span></h3>
								</div>
							</Link>
							)): <div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
								<p className="text-base">イベント情報はありません</p>
								</div>
							}
						</div>
						<Link href={"/event"}>
							<p className="text-center text-white hover:text-gray-200 transition duration-100">イベント一覧 <FontAwesomeIcon icon={faChevronRight} /></p>
						</Link>
					</div>
				</div>
			</main>
	);
}
