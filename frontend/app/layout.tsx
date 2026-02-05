import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter", 
});

export const metadata: Metadata = {
  title: "EventEase - Your Gateway to Amazing Events",
  description: "Discover and book the best music events, concerts, and festivals near you. Join thousands of music lovers on EventEase.",
  icons: {
    icon: '/images/ev-favicon.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={ `${inter.className} antialiased`}>{children}</body>
    </html>
  );
}