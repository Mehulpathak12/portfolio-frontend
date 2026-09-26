import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import BlogIndexClient from "./BlogIndexClient";

export const dynamic = "force-dynamic";

async function checkBlogAccess(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_token")?.value;

    const headers: Record<string, string> = { "Cache-Control": "no-cache" };
    if (adminToken) {
      headers["Authorization"] = `Bearer ${adminToken}`;
    }

    const res = await fetch("http://127.0.0.1:8000/api/portfolio", {
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
      const authRes = await fetch("http://127.0.0.1:8000/api/admin/me", {
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

export default async function BlogPage() {
  const allowed = await checkBlogAccess();
  if (!allowed) {
    notFound();
  }

  return <BlogIndexClient />;
}
