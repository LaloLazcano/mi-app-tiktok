import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart Bites",
  description: "Short interactive videos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Viewport meta para bloquear zoom en iOS */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        {/* Preload de videos */}
        <link rel="preload" href="/videos/video1.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/videos/video2.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/videos/video3.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/videos/video4.mp4" as="video" type="video/mp4" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
