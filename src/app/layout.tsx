import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { variantBootScript } from "@/lib/variant";
import { t } from "@/messages";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], weight: ["800", "900"], variable: "--font-archivo", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://robotempo.com";
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const isDemo = process.env.NEXT_PUBLIC_DEMO === "1";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${t.meta.siteName}, ${t.meta.tagline.toLowerCase()}`, template: `%s | ${t.meta.siteName}` },
  description: t.meta.description,
  openGraph: { siteName: t.meta.siteName, locale: "nl_NL", type: "website" },
  twitter: { card: "summary_large_image" },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icon.svg` },
};

export const viewport: Viewport = { themeColor: "#FF5A1F" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${archivo.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: variantBootScript }} />
        {plausibleDomain && (
          <>
            <script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" />
            <script
              dangerouslySetInnerHTML={{
                __html: "window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}",
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-dvh overflow-x-hidden antialiased">
        <a href="#inhoud" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white">
          {t.nav.skip}
        </a>
        {isDemo && (
          <div className="bg-ink px-4 py-2 text-center text-xs font-semibold text-white">{t.demo}</div>
        )}
        {children}
      </body>
    </html>
  );
}
