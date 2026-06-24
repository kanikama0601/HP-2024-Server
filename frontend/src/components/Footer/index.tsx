'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faNewspaper, faShop, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";
import { Link } from 'react-router-dom';
import { useEffect } from "react";
import { useLocation } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { pathname } = useLocation();

  const beginNavigation = (target?: string) => {
    if (target && target === pathname) return;
    window.dispatchEvent(new Event("app-loading-start"));
  };

  useEffect(() => {
    window.dispatchEvent(new Event("app-loading-end"));
  }, [pathname]);

  return (
    <footer className="relative bg-blue-900 text-white overflow-hidden">
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full border-[3px] border-blue-700/40" />
      <div className="pointer-events-none absolute right-24 bottom-0 w-20 h-20 bg-blue-800/50 rotate-45 translate-y-10" />
      <div className="pointer-events-none absolute left-8 top-6 w-8 h-8 bg-blue-700/40 rotate-45" />
      <div className="pointer-events-none absolute left-32 bottom-4 w-3 h-3 rounded-full bg-blue-500/60" />
      <div className="pointer-events-none absolute left-48 top-10 w-2 h-2 rounded-full bg-blue-400/50" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-12 pb-8">
        {/* Logo row */}
        <div className="mb-8 flex items-center gap-3">
          <img src="/icon.jpg" alt="電波祭" className="w-9 h-9 rounded-lg object-cover" />
          <div>
            <p className="text-base font-bold tracking-[0.12em] text-white">香川高専 電波祭</p>
            <p className="text-xs text-blue-300 tracking-widest">DENPA-SAI 2026</p>
          </div>
        </div>

        {/* Links */}
        <nav className="mb-10 flex flex-wrap gap-x-8 gap-y-3">
          {[
            { href: '/',      icon: faHouse,     label: 'トップ' },
            { href: '/news',  icon: faNewspaper, label: 'お知らせ' },
            { href: '/shop',  icon: faShop,      label: '模擬店' },
            { href: '/event', icon: faCalendar,  label: 'イベント' },
          ].map(({ href, icon, label }) => (
            <Link
              key={href}
              to={href}
              onClick={() => beginNavigation(href)}
              className="flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={icon} className="text-xs text-blue-400" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-blue-800 pt-6">
          <p className="text-center text-xs text-blue-400">
            <FontAwesomeIcon icon={faCopyright} /> 2026 電波祭実行委員会. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
