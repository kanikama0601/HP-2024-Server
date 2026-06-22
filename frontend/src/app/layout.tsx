import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GlobalLoading } from "@/components/GlobalLoading";
const inter = Inter({ subsets: ["latin"] });
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "香川高専 電波祭",
  description: "香川高等専門学校 詫間キャンパス 電波祭の公式Webページです。",
};

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="tracking-[0.04em]">
      <body className={`${inter.className} text-slate-900 min-h-screen flex flex-col bg-[#f4f8ff]`}>
        <GlobalLoading />
        <Header />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
