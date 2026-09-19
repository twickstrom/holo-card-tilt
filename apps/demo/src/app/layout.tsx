import type {Metadata} from "next";
import type {ReactNode} from "react";

import {Geist, Geist_Mono} from "next/font/google";

import {ThemeProvider} from "@/components/theme-provider";

import "./globals.css";

const geistSans = Geist({subsets: ["latin"], variable: "--font-geist-sans"});
const geistMono = Geist_Mono({subsets: ["latin"], variable: "--font-geist-mono"});

export const metadata: Metadata = {
  title: "holo-card-tilt playground",
  description: "An interactive playground for holo-card-tilt.",
};

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground min-h-dvh font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
