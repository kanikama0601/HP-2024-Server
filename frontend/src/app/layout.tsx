import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Slideshow } from "@/components/Slideshow"
import { GlobalLoading } from "@/components/GlobalLoading"
const inter = Inter({ subsets: ["latin"] });
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export const metadata: Metadata = {
  title: "香川高専 電波祭",
  description: "香川高等専門学校 詫間キャンパス 電波祭の公式Webページです。",
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="tracking-[0.08em]">
      <body className={`${inter.className} text-neutral-900 min-h-screen flex flex-col`}>
        <GlobalLoading />
        <Header />
        <Slideshow />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
