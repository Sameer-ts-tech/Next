import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Emerald Notes",
  description: "Next.js concepts class project: SSR, SSG, ISR, API Routes, Mongoose, and Server Actions.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-background text-foreground antialiased font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-zinc-950">
          {children}
        </main>
      </body>
    </html>
  );
}
