'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faNewspaper, faShop, faCalendar, faList } from "@fortawesome/free-solid-svg-icons";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const Footer: React.FC = () => {
    const pathname = usePathname();

    const beginNavigation = (target?: string) => {
        if (target && target === pathname) return;
        window.dispatchEvent(new Event("app-loading-start"));
    };

    useEffect(() => {
        window.dispatchEvent(new Event("app-loading-end"));
    }, [pathname]);

    return (
        <div className="w-full">
            <footer className="glass-panel w-full rounded-none px-4 py-6 md:px-8 md:py-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h2 className="text-3xl font-light tracking-[0.12em]">
                        <FontAwesomeIcon icon={faList} /> Menu
                        </h2>
                        <p className="text-xs mb-4 mt-1 text-neutral-500">
                        メニュー
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-6">
                        <Link href={"/"} onClick={() => beginNavigation("/")} className="text-base text-neutral-700 hover:text-neutral-950 transition-colors">
                            <span className="inline-flex items-center gap-2"><FontAwesomeIcon icon={faHouse} /> トップ</span>
                        </Link>
                        <Link href={"/news"} onClick={() => beginNavigation("/news")} className="text-base text-neutral-700 hover:text-neutral-950 transition-colors">
                            <span className="inline-flex items-center gap-2"><FontAwesomeIcon icon={faNewspaper} /> お知らせ</span>
                        </Link>
                        <Link href={"/shop"} onClick={() => beginNavigation("/shop")} className="text-base text-neutral-700 hover:text-neutral-950 transition-colors">
                            <span className="inline-flex items-center gap-2"><FontAwesomeIcon icon={faShop} /> 模擬店</span>
                        </Link>
                        <Link href={"/event"} onClick={() => beginNavigation("/event")} className="text-base text-neutral-700 hover:text-neutral-950 transition-colors">
                            <span className="inline-flex items-center gap-2"><FontAwesomeIcon icon={faCalendar} /> イベント</span>
                        </Link>
                    </div>
                </div>
                <p className="mx-auto mt-6 max-w-7xl text-center text-xs text-neutral-500">
                    <FontAwesomeIcon icon={faCopyright} /> 2024 電波祭実行委員会. All Right Reserved.
                </p>
            </footer>
        </div>
    );
};
