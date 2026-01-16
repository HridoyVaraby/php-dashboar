import type { Metadata } from "next";
import { Noto_Serif_Bengali, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import ClientLayout from "@/components/layout/ClientLayout";

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
  variable: "--font-noto-serif",
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://newsviewbd.com"),
  title: {
    default: "নিউজভিউ - শুধু নিউজ নয়, স্বপ্নের সঙ্গেও",
    template: "%s | নিউজভিউ",
  },
  description: "বাংলাদেশের সর্বশেষ সংবাদ, রাজনীতি, খেলাধুলা, প্রযুক্তি এবং আরও অনেক কিছু - NewsViewBD",
  applicationName: "NewsViewBD",
  authors: [{ name: "NewsViewBD" }],
  generator: "Next.js",
  keywords: ["News", "Bangladesh", "Bangla News", "Politics", "Sports", "Technology", "Entertainment"],
  referrer: "origin-when-cross-origin",
  creator: "NewsViewBD",
  publisher: "NewsViewBD",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    siteName: "নিউজভিউ",
    title: "নিউজভিউ - শুধু নিউজ নয়, স্বপ্নের সঙ্গেও",
    description: "বাংলাদেশের সর্বশেষ সংবাদ, রাজনীতি, খেলাধুলা, প্রযুক্তি এবং আরও অনেক কিছু",
    images: [
      {
        url: "/newsview.webp",
        width: 1200,
        height: 630,
        alt: "NewsViewBD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "নিউজভিউ - শুধু নিউজ নয়, স্বপ্নের সঙ্গেও",
    description: "বাংলাদেশের সর্বশেষ সংবাদ, রাজনীতি, খেলাধুলা, প্রযুক্তি এবং আরও অনেক কিছু",
    images: ["/newsview.webp"],
    creator: "@newsviewbd",
    site: "@newsviewbd",
  },
  verification: {
    google: "google-site-verification-code", // Placeholder
  },
  icons: {
    icon: "/Icon.svg",
    shortcut: "/Icon.svg",
    apple: "/Icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className={`${notoSerifBengali.variable} ${notoSansBengali.variable} antialiased font-bangla`} suppressHydrationWarning>
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
