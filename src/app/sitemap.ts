import { MetadataRoute } from "next";
import { getBackendUrl } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mehulpathak.tech";
  const lastModified = new Date();
  const backendUrl = getBackendUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#overview`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#skills`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#experience`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#projects`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#certificates`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#journey`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];

  // Dynamically verify if blogs section is active before indexing
  let blogRoutes: MetadataRoute.Sitemap = [];
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
      // Include main blog listing page
      blogRoutes.push({
        url: `${baseUrl}/blog`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      });

      const res = await fetch(`${backendUrl}/api/blogs`, {
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const data = await res.json();
        const blogs = data.blogs || [];
        const individualBlogRoutes = blogs
          .filter((b: any) => b.published !== false && b.slug)
          .map((b: any) => ({
            url: `${baseUrl}/blog/${b.slug}`,
            lastModified: b.updatedAt ? new Date(b.updatedAt) : (b.createdAt ? new Date(b.createdAt) : lastModified),
            changeFrequency: "weekly" as const,
            priority: 0.85,
          }));
        blogRoutes.push(...individualBlogRoutes);
      }
    }
  } catch {
    // If backend is unreachable during build, don't leak unpublished or disabled routes
  }

  return [...staticRoutes, ...blogRoutes];
}
