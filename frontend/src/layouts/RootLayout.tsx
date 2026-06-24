import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { GlobalLoading } from '@/components/GlobalLoading';

export default function RootLayout() {
  return (
    <div className="tracking-[0.04em] text-slate-900 min-h-screen flex flex-col bg-[#f4f8ff]">
      <GlobalLoading />
      <Header />
      <div className="flex-1 pt-[60px]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
