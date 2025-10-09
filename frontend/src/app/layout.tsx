import type { Metadata } from "next";
import LocalFont from "next/font/local";
import "./globals.css";


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
        className={`${productSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
