"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Loading } from "@/components/Loading";
import Link from "next/link";
import { fetchWithAuth } from '@/utils/api';

export default function Top() {

	return (
			<main>
				<div className="mx-3.5 my-10">
					<div className="container mx-auto text-white text-center m-12">
						<h2 className="text-3xl font-light text-shadow-md drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] m-3">
						<FontAwesomeIcon icon={faBuilding} /> Organization
						</h2>
						<p className="text-sm mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
						オーガナイゼーション
						</p>
					</div>
				<Suspense fallback={<Loading />}>
					<div className="container mx-auto text-xl md:w-6/12 w-full">
					<SearchParamsComponent />
						<Link href={"/organization/new"}>
								<p className="text-center text-white hover:text-gray-200 transition duration-100 text-base drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"><FontAwesomeIcon icon={faPlus} /> 新規作成</p>
						</Link>
					</div>
				</Suspense>
				</div>
			</main>
	);
}

function SearchParamsComponent() {
	const [status, setStatus] = useState(0);
	const [organizationData, setOrganizationData] = useState([]);
	const [organizationLoading, setOrganizationLoading] = useState(true);
	const url = process.env.NEXT_PUBLIC_API_URL + '/organization/';

	useEffect(() => {
		const fetchData = async () => {
				try {
						const data = await fetchWithAuth(url, 'GET');
						setOrganizationData(data['organizations']);
				} catch (error) {
						setStatus(404);
				} finally {
						setOrganizationLoading(false);
				}
		};

		fetchData();
}, []);
	const searchParams = useSearchParams();
	let next = searchParams.get('next');
	if (next === null) next = '';

	return (
		<>
		{organizationLoading && <Loading />}
		{status === 404 && (
			<div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
				<p className="text-sm my-2">オーガナイゼーションが見つかりませんでした</p>
				<p className="text-xs my-2">※既にオーガナイゼーションへ加入している場合は、再読み込みや再ログインをお試しください。</p>
			</div>
		)}
		{organizationData.map((organization) => (	
			<Link key={organization['id']} href={`/organization/${organization['id']}${next}`}>
				<div className="w-full p-4 bg-white rounded-lg py-6 my-4 hover:text-gray-600 transition duration-100">
					<h3 className="text-base">{organization['name']}</h3>
				</div>
			</Link>
		))}
		</>
	);
}
