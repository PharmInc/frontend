import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { twitterChirp } from "@/lib/fonts";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pharminc",
  description: "", // TODO
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${twitterChirp.variable} min-h-screen flex flex-col font-chirp overflow-y-scroll`}>
        <div className="flex flex-col grow">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
