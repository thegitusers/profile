import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shiva Kumar | Best Website Developer in Andaman, Port Blair",
  description:
    "Full-Stack web Developer | Expert in Laravel, React, Next.js | Building Digital Experiences with Modern Tech Stack",
  keywords: [
    "Developer",
    "Website Development",
    "Portfolio",
    "Full-Stack",
    "React",
    "Laravel",
    "Next.js",
    "Web Development",
    "Andaman",
    "Tourism",
    "Projects",
  ],
  authors: [{ name: "Shiva Kumar", url: "https://shivwebs.online" }],
  creator: "Shiva Kumar",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Shiva Kumar | Best Website Developer in Andaman, Port Blair",
    description:
      "Crafting exceptional digital experiences with modern technologies",
    url: "https://your-portfolio-url.com",
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/137149601?v=4",
        width: 1200,
        height: 630,
        alt: "Shiva Kumar Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shiva Kumar | Best Website Developer in Andaman, Port Blair",
    description:
      "Crafting exceptional digital experiences with modern technologies",
    images: ["https://avatars.githubusercontent.com/u/137149601?v=4"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NYRE7X673T"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NYRE7X673T');
          `}
        </Script>
        {children}
        <SpeedInsights />
<Analytics />
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
