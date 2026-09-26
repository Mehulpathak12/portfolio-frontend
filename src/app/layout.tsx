import type { Metadata } from "next";
import "./globals.css";
import { AdminProvider } from "@/context/AdminContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { getSiteUrl } from "@/lib/api";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mehul Pathak | Software Developer & AI/ML Engineer",
    template: "%s | Mehul Pathak",
  },
  description:
    "Mehul Pathak's portfolio — Software Developer and AI/ML Engineer building modern web applications, AI systems, and intelligent software.",
  keywords: [
    "Mehul Pathak",
    "Software Developer",
    "AI/ML Engineer",
    "Full Stack Developer",
    "React",
    "Next.js",
    "FastAPI",
    "Python",
    "RAG Applications",
    "Java Data Structures and Algorithms",
    "Portfolio",
    "Web Development"
  ],
  authors: [{ name: "Mehul Pathak", url: "https://github.com/Mehulpathak12" }],
  creator: "Mehul Pathak",
  publisher: "Mehul Pathak",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Mehul Pathak | Software Developer & AI/ML Engineer",
    description:
      "Mehul Pathak's portfolio — Software Developer and AI/ML Engineer building modern web applications, AI systems, and intelligent software.",
    siteName: "Mehul Pathak",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mehul Pathak - Software Developer & AI/ML Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehul Pathak | Software Developer & AI/ML Engineer",
    description:
      "Mehul Pathak's portfolio — Software Developer and AI/ML Engineer building modern web applications, AI systems, and intelligent software.",
    creator: "@mehulpathak2004",
    images: ["/og-image.png"],
  },
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
  icons: {
    icon: [
      { url: "/image/fav/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/image/fav/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/image/fav/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      "name": "Mehul Pathak",
      "jobTitle": "Software Developer & AI/ML Engineer",
      "url": siteUrl,
      "image": `${siteUrl}/og-image.png`,
      "sameAs": [
        "https://github.com/Mehulpathak12",
        "https://www.linkedin.com/in/mehul-2004-10-pathak",
        "https://leetcode.com/u/mehulpathak",
        "https://x.com/mehulpathak2004"
      ],
      "knowsAbout": [
        "Full-Stack Web Development",
        "React",
        "Next.js",
        "Node.js",
        "Python",
        "FastAPI",
        "Applied AI & RAG Tooling",
        "Data Structures and Algorithms",
        "MongoDB Atlas",
        "MySQL",
        "Tailwind CSS"
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": siteUrl,
      "name": "Mehul Pathak",
      "publisher": {
        "@id": `${siteUrl}/#person`
      },
      "inLanguage": "en-US"
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[#fbfbfd] text-neutral-900">
        <GoogleAnalytics />
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}
