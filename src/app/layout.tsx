import type { Metadata } from "next";
import { Geist, Geist_Mono, Shadows_Into_Light } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const shadowsIntoLight = Shadows_Into_Light({
  variable: "--font-sil",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "VerseYou",
  description: "VerseYou is a platform to send messages with music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${shadowsIntoLight.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
