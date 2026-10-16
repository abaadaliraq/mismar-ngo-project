import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  authors: [{ name: "MISMAR Foundation", url: "https://www.mismar.ngo/" }],
  creator: "MISMAR Foundation",
  publisher: "MISMAR Foundation",
  title: "MISMAR FOUNDATION | ABU NAWAS — HERITAGE REVITALIZATION PROJECT",
  description:
    "MISMAR Foundation project proposal: safeguarding, conservation and restoration of historic houses in Abu Nawas, Baghdad. October 2026 — Proposal Version 1.0.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
