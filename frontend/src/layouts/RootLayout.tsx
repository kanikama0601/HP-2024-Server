import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { GlobalLoading } from '@/components/GlobalLoading';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function RootLayout() {
  return (
    <div className="tracking-[0.04em] text-slate-900 min-h-screen flex flex-col bg-[#f4f8ff]">
      <ScrollToTop />
      <GlobalLoading />
      <Header />
      <div className="flex-1 pt-[60px]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
