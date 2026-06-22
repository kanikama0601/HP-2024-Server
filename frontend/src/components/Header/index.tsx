'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse, faNewspaper, faShop, faCalendar, faBuilding,
  faArrowRightToBracket, faArrowRightFromBracket, faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

export const Header: React.FC = () => {
  const [openMenu, setOpenMenu]               = useState(false);
  const [isLoggedIn, setIsLoggedIn]           = useState(false);
  const [openAccountMenu, setOpenAccountMenu] = useState(false);
  const [accountName, setAccountName]         = useState("Account");
  const [scrollY, setScrollY]                 = useState(0);
  const pathname = usePathname();

  /* scrollY → 0〜150px でヘッダー背景を透明→白に変化 */
  const bgOpacity = Math.min(scrollY / 150, 1);

  const beginNavigation = (target?: string) => {
    if (target && target === pathname) return;
    window.dispatchEvent(new Event("app-loading-start"));
  };

  const syncAuthState = () => {
    const loggedIn = Cookies.get('refresh') !== undefined;
    setIsLoggedIn(loggedIn);
    setAccountName(Cookies.get('username') || "Account");
    setOpenAccountMenu(false);
    if (!loggedIn) setOpenMenu(false);
  };

  useEffect(() => {
    syncAuthState();
    const handleAuth = () => syncAuthState();
    window.addEventListener('auth-changed', handleAuth);
    window.addEventListener('focus', handleAuth);
    return () => {
      window.removeEventListener('auth-changed', handleAuth);
      window.removeEventListener('focus', handleAuth);
    };
  }, []);

  useEffect(() => {
    setOpenMenu(false);
    setOpenAccountMenu(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTopPage = pathname === '/';

  return (
    <div className="w-full fixed top-0 z-40">
      <header
        className="w-full px-4 py-3 md:px-8 flex items-center justify-between transition-colors duration-300"
        style={{
          backgroundColor: isTopPage
            ? `rgba(255,255,255,${bgOpacity})`
            : 'rgba(255,255,255,1)',
        }}
      >
        {/* Logo */}
        <Link href="/" onClick={() => beginNavigation("/")}>
          <div className="flex items-center gap-2">
            <img src="/icon.jpg" alt="電波祭" className="w-7 h-7 rounded-md object-cover" />
            <h1 className="text-base font-bold tracking-[0.12em] text-blue-900">
              香川高専 電波祭
            </h1>
          </div>
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setOpenMenu((v) => !v)}
          type="button"
          aria-label="メニュー"
          className="z-10 space-y-[5px] md:hidden p-2"
        >
          <span className={`block w-6 h-[2px] bg-blue-800 transition-all duration-300 ${openMenu ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block w-6 h-[2px] bg-blue-800 transition-all duration-300 ${openMenu ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-blue-800 transition-all duration-300 ${openMenu ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {(['/', '/news', '/shop', '/event'] as const).map((href, i) => {
            const labels = ['Top', 'News', 'Shop', 'Event'];
            return (
              <Link
                key={href}
                href={href}
                onClick={() => beginNavigation(href)}
                className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors
                  relative after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0
                  after:bg-blue-600 after:transition-all hover:after:w-full"
              >
                {labels[i]}
              </Link>
            );
          })}

          {isLoggedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenAccountMenu((v) => !v)}
                className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                {accountName}
              </button>
              {openAccountMenu && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-blue-100 bg-white shadow-lg shadow-blue-100/60">
                  <Link href="/organization" onClick={() => { beginNavigation("/organization"); setOpenAccountMenu(false); }}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <FontAwesomeIcon icon={faBuilding} className="w-4" /> Organization
                  </Link>
                  <Link href="/logout" onClick={() => { beginNavigation("/logout"); setOpenAccountMenu(false); }}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-4" /> Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" onClick={() => beginNavigation("/login")}
                className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">
                Login
              </Link>
              <Link href="/register" onClick={() => beginNavigation("/register")}
                className="rounded-full bg-blue-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-800 transition-colors">
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile drawer */}
        <>
          {openMenu && (
            <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setOpenMenu(false)} />
          )}
          <nav className={`fixed right-0 top-0 h-screen w-72 z-40 bg-white border-l border-blue-100 shadow-xl
            flex flex-col pt-6 px-6 transition-transform duration-300 ease-in-out md:hidden
            ${openMenu ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-bold text-blue-900 tracking-widest">MENU</span>
              <button onClick={() => setOpenMenu(false)} className="text-slate-400 hover:text-slate-700 p-1">✕</button>
            </div>
            <ul className="space-y-1">
              {[
                { href: '/',      icon: faHouse,     en: 'Top',   ja: 'トップページ' },
                { href: '/news',  icon: faNewspaper, en: 'News',  ja: '運営からのお知らせ' },
                { href: '/shop',  icon: faShop,      en: 'Shop',  ja: '模擬店情報' },
                { href: '/event', icon: faCalendar,  en: 'Event', ja: 'イベント情報' },
              ].map(({ href, icon, en, ja }) => (
                <li key={href}>
                  <Link href={href} onClick={() => beginNavigation(href)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-50 group transition-colors">
                    <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 group-hover:bg-blue-100 text-blue-600 transition-colors">
                      <FontAwesomeIcon icon={icon} className="text-sm" />
                    </span>
                    <div>
                      <p className="text-base font-medium text-slate-800">{en}</p>
                      <p className="text-xs text-slate-400">{ja}</p>
                    </div>
                  </Link>
                </li>
              ))}
              {isLoggedIn ? (
                <>
                  <li>
                    <Link href="/organization" onClick={() => { beginNavigation("/organization"); setOpenMenu(false); }}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-50 group transition-colors">
                      <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 group-hover:bg-blue-100 text-blue-600 transition-colors">
                        <FontAwesomeIcon icon={faBuilding} className="text-sm" />
                      </span>
                      <div>
                        <p className="text-base font-medium text-slate-800">{accountName}</p>
                        <p className="text-xs text-slate-400">アカウントメニュー</p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/logout" onClick={() => { beginNavigation("/logout"); setOpenMenu(false); }}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 group transition-colors">
                      <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 group-hover:bg-red-100 text-red-500 transition-colors">
                        <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-sm" />
                      </span>
                      <div>
                        <p className="text-base font-medium text-slate-800">Logout</p>
                        <p className="text-xs text-slate-400">ログアウト</p>
                      </div>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login" onClick={() => beginNavigation("/login")}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-50 group transition-colors">
                      <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 group-hover:bg-blue-100 text-blue-600 transition-colors">
                        <FontAwesomeIcon icon={faArrowRightToBracket} className="text-sm" />
                      </span>
                      <div>
                        <p className="text-base font-medium text-slate-800">Login</p>
                        <p className="text-xs text-slate-400">ログイン</p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" onClick={() => beginNavigation("/register")}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-50 group transition-colors">
                      <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 group-hover:bg-blue-100 text-blue-600 transition-colors">
                        <FontAwesomeIcon icon={faUserPlus} className="text-sm" />
                      </span>
                      <div>
                        <p className="text-base font-medium text-slate-800">Register</p>
                        <p className="text-xs text-slate-400">アカウント作成</p>
                      </div>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </>
      </header>
    </div>
  );
};
