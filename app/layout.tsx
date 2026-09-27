import "@fontsource-variable/manrope";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
