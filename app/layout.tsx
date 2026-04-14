import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "สมัคร คอร์สเสกเงินในอากาศ ด้วย AI ปักตะกร้า ฉบับนายหน้า TikTok - KVid",
  description: "คอร์สเสกเงินในอากาศ ด้วย AI ปักตะกร้า ฉบับนายหน้า TikTok",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${geistSans.variable} antialiased`}>
      <body className="min-h-screen bg-slate-900 text-slate-200">
        {children}
      </body>
    </html>
  );
}
