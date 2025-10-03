import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LocalFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const productSans = LocalFont({
  src: [
    {
      path: '../../public/fonts/ProductSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ProductSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ProductSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-product-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "In Sight | Feedback Forms Analyzer",
  description: "Powered by Google Developer Groups University of San Carlos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${productSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
