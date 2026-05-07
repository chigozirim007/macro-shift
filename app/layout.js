import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MacroShift: Master the Momentum.",
  description: "Decipher the Future. Direct the Shift.",
};

import AuthProvider from "@/components/AuthProvider";
import { auth } from "@/auth";

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-[100dvh] flex flex-col bg-[#000d14] text-white selection:bg-cyan-500/30">
        <AuthProvider session={session}>
          <Navbar/>
          <main className="flex-grow">
            {children}
          </main>
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
