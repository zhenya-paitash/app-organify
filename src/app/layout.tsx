import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";

import { Cursor } from "@/modules/cursor";

import { cn } from "@/lib/utils";

import "./globals.css";

// FONTS
const font_body = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400"], variable: "--font-body", display: "swap" });
const font_heading = Bricolage_Grotesque({ subsets: ["latin"], weight: ["800"], variable: "--font-heading", display: "swap" });

// import localFont from "next/font/local"
// const font_heading = localFont({ src: "./fonts/ifonts/holden-hurst-font/holden-hurst.otf", variable: "--font-heading", display: "swap" });

// METADATA
export const metadata: Metadata = { title: "Organify", description: "Organize your tasks easily" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(font_body.variable, font_heading.variable)}>
      <head />
      <body className="antialiased min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange >
          <QueryProvider>
            <Toaster />
            <Cursor />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
