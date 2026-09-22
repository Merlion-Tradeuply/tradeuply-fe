import "@fontsource-variable/manrope";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getCurrentClientFromCookies } from "@/lib/auth/current-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://tradeuply.com"),
  title: "TradeUply | Global Market Access and Trading Tools",
  description:
    "Explore global markets with TradeUply's real-time market insights, intuitive trading tools, and clear portfolio management experience.",
  keywords: [
    "global market access",
    "online trading platform",
    "real-time market insights",
    "trading tools",
    "portfolio management",
  ],
  openGraph: {
    title: "TradeUply | See the Market Clearly",
    description:
      "Global market access, real-time insights, intuitive tools, and portfolio management in one clear experience.",
    siteName: "TradeUply",
    type: "website",
    url: "/",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const client = await getCurrentClientFromCookies();

  return (
    <html lang="en">
      <body>
        <SiteHeader initialClient={client} key={client?.id ?? "guest"} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
