import { MetadataRoute } from "next";
import { getBackendUrl, getSiteUrl } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const lastModified = new Date();
  const backendUrl = getBackendUrl();

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  // Dynamically check if blog section is active and index published articles
  try {
    const portfolioRes = await fetch(`${backendUrl}/api/portfolio`, {
      next: { revalidate: 3600 },
    });

    let blogsEnabled = true;
    if (portfolioRes.ok) {
      const portfolioData = await portfolioRes.json();
      blogsEnabled = portfolioData.sections?.blogs !== false;
    }

    if (blogsEnabled) {
      routes.push({
        url: `${baseUrl}/blog`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.85,
      });

      const res = await fetch(`${backendUrl}/api/blogs`, {
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        const blogs = data.blogs || [];
        for (const b of blogs) {
          if (b.published !== false && b.slug) {
            routes.push({
              url: `${baseUrl}/blog/${b.slug}`,
              lastModified: b.updatedAt
                ? new Date(b.updatedAt)
                : b.createdAt
                ? new Date(b.createdAt)
                : lastModified,
              changeFrequency: "weekly",
              priority: 0.8,
            });
          }
        }
      }
    }
  } catch {
    // If backend is unreachable during build, core index route is safely retained
  }

  return routes;
}
