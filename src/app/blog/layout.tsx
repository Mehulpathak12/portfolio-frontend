import type { Metadata } from "next";
import { cookies } from "next/headers";
import NotFound from "@/app/not-found";
import { getBackendUrl, getSiteUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Engineering Notes & Technical Blog",
  description:
    "In-depth technical articles, system design insights, applied AI & RAG pipelines, and full-stack software engineering by Mehul Pathak.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Engineering Notes & Technical Blog | Mehul Pathak",
    description:
      "In-depth technical articles on full-stack web applications, applied AI tooling, and systems architecture by Mehul Pathak.",
    url: `${siteUrl}/blog`,
    type: "website",
    siteName: "Mehul Pathak",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mehul Pathak Technical Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Notes & Technical Blog | Mehul Pathak",
    description:
      "Technical articles on full-stack architecture, applied AI & RAG pipelines, and modern software engineering.",
    images: ["/og-image.png"],
    creator: "@mehulpathak2004",
  },
};

async function checkBlogAccess(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_token")?.value;
    const backendUrl = getBackendUrl();

    const headers: Record<string, string> = { "Cache-Control": "no-cache" };
    if (adminToken) {
      headers["Authorization"] = `Bearer ${adminToken}`;
    }

    const res = await fetch(`${backendUrl}/api/portfolio`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      return true;
    }

    const data = await res.json();
    const blogEnabled = data.sections?.blogs !== false;

    if (blogEnabled) {
      return true;
    }

    // Blogs are hidden in admin settings
    // If admin is logged in with valid token, allow preview
    if (adminToken) {
      const authRes = await fetch(`${backendUrl}/api/admin/me`, {
        headers: { Authorization: `Bearer ${adminToken}` },
        cache: "no-store",
      });
      if (authRes.ok) {
        return true;
      }
    }

    // Not authenticated admin and section is hidden -> block access with 404
    return false;
  } catch (err) {
    console.error("Error verifying blog section visibility:", err);
    return true;
  }
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
