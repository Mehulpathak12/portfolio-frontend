import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AdminProvider } from "@/context/AdminContext";

const siteUrl = "https://mehulpathak.tech";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mehul Pathak | Full Stack Developer & Applied AI",
    template: "%s | Mehul Pathak",
  },
  description:
    "Portfolio of Mehul Pathak — Full Stack Software Developer crafting scalable web applications with React & Node.js, applied AI & RAG pipelines with Python, and Java algorithmic problem solving.",
  keywords: [
    "Mehul Pathak",
    "Mehul Pathak portfolio",
    "Full Stack Developer",
    "Applied AI Developer",
    "Python FastAPI Developer",
    "React Next.js Developer",
    "RAG Applications",
    "Java Data Structures and Algorithms",
    "LeetCode Mehul Pathak",
    "Software Engineer India",
    "Ajmer Developer"
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
    title: "Mehul Pathak | Full Stack Developer & Applied AI",
    description:
      "Explore full-stack apps, AI & RAG tooling, and software engineering projects by Mehul Pathak.",
    siteName: "Mehul Pathak Portfolio",
    images: [
      {
        url: "/image/about1.jpg",
        width: 800,
        height: 1000,
        alt: "Mehul Pathak - Full Stack & Applied AI Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehul Pathak | Full Stack Developer & Applied AI",
    description:
      "Full Stack Software Developer crafting scalable web applications, applied AI & RAG systems, and solving algorithms in Java.",
    creator: "@mehulpathak2004",
    images: ["/image/about1.jpg"],
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
    icon: "/image/about1.jpg",
    shortcut: "/image/about1.jpg",
    apple: "/image/about1.jpg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      "name": "Mehul Pathak",
      "jobTitle": "Full Stack & Software Developer",
      "url": siteUrl,
      "image": `${siteUrl}/image/about1.jpg`,
      "sameAs": [
        "https://github.com/Mehulpathak12",
        "https://www.linkedin.com/in/mehul-2004-10-pathak",
        "https://leetcode.com/u/mehulpathak",
        "https://x.com/mehulpathak2004"
      ],
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "MDS University"
      },
      "knowsAbout": [
        "Full Stack Web Development",
        "React",
        "Next.js",
        "Node.js",
        "Python",
        "FastAPI",
        "Retrieval-Augmented Generation (RAG)",
        "Artificial Intelligence",
        "Java",
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
      "name": "Mehul Pathak Portfolio",
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
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}
