'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faNewspaper, faShop, faCalendar, faBuilding, faArrowRightToBracket, faArrowRightFromBracket, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

export const Header: React.FC = () => {

    const [openMenu, setOpenMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [openAccountMenu, setOpenAccountMenu] = useState(false);
    const [accountName, setAccountName] = useState("Account");
    const pathname = usePathname();

    const switchMenuOpen = () => {
        setOpenMenu(!openMenu);
    }

    const beginNavigation = (target?: string) => {
        if (target && target === pathname) return;
        window.dispatchEvent(new Event("app-loading-start"));
    };

    const syncAuthState = () => {
        const loggedIn = Cookies.get('refresh') !== undefined;
        setIsLoggedIn(loggedIn);
        setAccountName(Cookies.get('username') || "Account");
        setOpenAccountMenu(false);
        if (!loggedIn) {
            setOpenMenu(false);
        }
    };

    useEffect(() => {
        syncAuthState();

        const handleAuthChanged = () => syncAuthState();
        window.addEventListener('auth-changed', handleAuthChanged as EventListener);
        window.addEventListener('focus', handleAuthChanged);

        return () => {
            window.removeEventListener('auth-changed', handleAuthChanged as EventListener);
            window.removeEventListener('focus', handleAuthChanged);
        };
    }, []);

    useEffect(() => {
        setOpenMenu(false);
        setOpenAccountMenu(false);
    }, [pathname]);

    return (
        <div className="w-full sticky top-0 z-40">
            <header className="glass-panel w-full px-4 py-4 md:px-8 flex items-center justify-between rounded-none">
                <Link href={"/"}>
                    <h1 className="text-lg font-semibold tracking-[0.18em]">香川高専 電波祭</h1>
                </Link>

                <button 
                    onClick={switchMenuOpen} 
                    type="button" 
                    className="z-10 space-y-2 md:hidden"
                >
                    <div 
                        className={
                            openMenu 
                        ? 'w-8 h-0.5 bg-neutral-900 translate-y-2.5 rotate-45 transition duration-500 ease-in-out' 
                        : 'w-8 h-0.5 bg-neutral-900 transition duration-500 ease-in-out'
                        } 
                    />
                    <div 
                        className={
                            openMenu 
                        ? 'opacity-0 transition duration-500 ease-in-out' 
                        : 'w-8 h-0.5 bg-neutral-900 transition duration-500 ease-in-out'
                        } 
                    />
                    <div 
                        className={
                            openMenu 
                        ? 'w-8 h-0.5 bg-neutral-900 -rotate-45 transition duration-500 ease-in-out' 
                        : 'w-8 h-0.5 bg-neutral-900 transition duration-500 ease-in-out'
                        } 
                    />
                </button>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" onClick={() => beginNavigation("/")} className="text-sm text-neutral-700 transition hover:text-neutral-950">Top</Link>
                    <Link href="/news" onClick={() => beginNavigation("/news")} className="text-sm text-neutral-700 transition hover:text-neutral-950">News</Link>
                    <Link href="/shop" onClick={() => beginNavigation("/shop")} className="text-sm text-neutral-700 transition hover:text-neutral-950">Shop</Link>
                    <Link href="/event" onClick={() => beginNavigation("/event")} className="text-sm text-neutral-700 transition hover:text-neutral-950">Event</Link>
                    {isLoggedIn ? (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setOpenAccountMenu((value) => !value)}
                                className="rounded-full border border-white/60 bg-white/50 px-4 py-2 text-sm text-neutral-700 transition hover:text-neutral-950"
                            >
                                {accountName}
                            </button>
                            {openAccountMenu && (
                                <div className="absolute right-0 mt-3 w-48 overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-lg backdrop-blur-md">
                                    <Link href="/organization" onClick={() => { beginNavigation("/organization"); setOpenAccountMenu(false); }} className="block px-4 py-3 text-sm text-neutral-700 transition hover:bg-white hover:text-neutral-950">
                                        Organization
                                    </Link>
                                    <Link href="/logout" onClick={() => { beginNavigation("/logout"); setOpenAccountMenu(false); }} className="block px-4 py-3 text-sm text-neutral-700 transition hover:bg-white hover:text-neutral-950">
                                        Logout
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link href="/login" onClick={() => beginNavigation("/login")} className="text-sm text-neutral-700 transition hover:text-neutral-950">Login</Link>
                            <Link href="/register" onClick={() => beginNavigation("/register")} className="text-sm text-neutral-700 transition hover:text-neutral-950">Register</Link>
                        </>
                    )}
                </nav>

                <nav
                    className={
                    openMenu
                        ? 'text-left fixed glass-panel right-0 top-0 w-72 h-screen flex flex-col justify-start pt-8 px-4 duration-300 ease-linear rounded-none rounded-l-3xl md:hidden'
                        : 'fixed right-[-100%] duration-300 ease-linear md:hidden'
                    }
                >
                    <ul className="mt-6 px-5">
                        <li className="my-4">
                            <Link href={"/"} onClick={() => beginNavigation("/")}>
                                <p className="text-3xl font-light my-1 tracking-[0.12em]">Top</p>
                                <p className="text-xs text-neutral-500"><FontAwesomeIcon icon={faHouse} /> トップページ</p>
                            </Link>
                        </li>
                        <li className="my-4">
                            <Link href={"/news"} onClick={() => beginNavigation("/news")}>
                                <p className="text-3xl font-light my-1 tracking-[0.12em]">News</p>
                                <p className="text-xs text-neutral-500"><FontAwesomeIcon icon={faNewspaper} /> 運営からのお知らせ</p>
                            </Link>
                        </li>
                        <li className="my-4">
                            <Link href={"/shop"} onClick={() => beginNavigation("/shop")}>
                                <p className="text-3xl font-light my-1 tracking-[0.12em]">Shop</p>
                                <p className="text-xs text-neutral-500"><FontAwesomeIcon icon={faShop} /> 模擬店情報</p>
                            </Link>
                        </li>
                        <li className="my-4">
                            <Link href={"/event"} onClick={() => beginNavigation("/event")}>
                                <p className="text-3xl font-light my-1 tracking-[0.12em]">Event</p>
                                <p className="text-xs text-neutral-500"><FontAwesomeIcon icon={faCalendar} /> イベント情報</p>
                            </Link>
                        </li>
                        {isLoggedIn ? (
                            <>
                                <li className="my-4">
                                    <button
                                        type="button"
                                        onClick={() => setOpenAccountMenu((value) => !value)}
                                        className="text-left"
                                    >
                                        <p className="text-3xl font-light my-1 tracking-[0.12em]">{accountName}</p>
                                        <p className="text-xs text-neutral-500">アカウントメニュー</p>
                                    </button>
                                    {openAccountMenu && (
                                        <div className="mt-3 overflow-hidden rounded-2xl border border-white/60 bg-white/75">
                                            <Link href={"/organization"} onClick={() => { beginNavigation("/organization"); setOpenAccountMenu(false); setOpenMenu(false); }} className="block px-4 py-3 text-sm text-neutral-700 transition hover:bg-white hover:text-neutral-950">
                                                <span className="inline-flex items-center gap-2"><FontAwesomeIcon icon={faBuilding} /> Organization</span>
                                            </Link>
                                            <Link href={"/logout"} onClick={() => { beginNavigation("/logout"); setOpenAccountMenu(false); setOpenMenu(false); }} className="block px-4 py-3 text-sm text-neutral-700 transition hover:bg-white hover:text-neutral-950">
                                                <span className="inline-flex items-center gap-2"><FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout</span>
                                            </Link>
                                        </div>
                                    )}
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="my-4">
                                    <Link href={"/login"} onClick={() => beginNavigation("/login")}>
                                        <p className="text-3xl font-light my-1 tracking-[0.12em]">Login</p>
                                        <p className="text-xs text-neutral-500"><FontAwesomeIcon icon={faArrowRightToBracket} /> ログイン</p>
                                    </Link>
                                </li>
                                <li className="my-4">
                                    <Link href={"/register"} onClick={() => beginNavigation("/register")}>
                                        <p className="text-3xl font-light my-1 tracking-[0.12em]">Register</p>
                                        <p className="text-xs text-neutral-500"><FontAwesomeIcon icon={faUserPlus} /> アカウント作成</p>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>
        </div>
    );
};
