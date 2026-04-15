import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GEMinw - GEM โกยยอดขาย 7 หลัก ด้วย Ai ปักตะกร้า ฉบับนายหน้า TikTok",
  description: "GEM โกยยอดขาย 7 หลัก ด้วย Ai ปักตะกร้า ฉบับนายหน้า TikTok",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${geistSans.variable} antialiased`}>
      <body className="min-h-screen bg-[#063347] text-[#E1E6EA]">
        {children}
      </body>
    </html>
  );
}
