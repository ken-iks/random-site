import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BackgroundToggle from "@/components/BackgroundToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lions Hub",
  description: "Until the lion learns to write, every story will glorify the hunter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let mode = {dark: true};
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${!mode.dark ? '!bg-gray-50' : ''}`}
      >
        <Navbar />
        <BackgroundToggle mode={mode} />
        {children}
      </body>
    </html>
  );
}
