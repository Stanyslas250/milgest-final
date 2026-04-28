import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Milgest — Gestion de militants",
    template: "%s | Milgest",
  },
  description:
    "Centralisez la gestion de vos membres, cotisations, grades et documents. L'ERP conçu pour les organisations politiques, associations et ONG.",
  keywords: [
    "gestion militants",
    "ERP association",
    "gestion membres",
    "cotisations",
    "organisation politique",
    "ONG",
  ],
  openGraph: {
    title: "Milgest — Gestion de militants",
    description:
      "Centralisez la gestion de vos membres, cotisations, grades et documents.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
