
import React from 'react';
import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: '--font-chakra-petch',
});

export const metadata: Metadata = {
  title: "Gnarp Notes",
  description: "Upload a PDF and convert it into study flashcards with a fun, retro space theme. You can review the flashcards in the app or download them as a PowerPoint file.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${chakraPetch.variable} bg-slate-900 font-chakra`}>
        {children}
      </body>
    </html>
  );
}
