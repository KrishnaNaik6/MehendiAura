import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { LOCALES } from "@/lib/i18n/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mehendiaura.com";
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("slug, updated_at")
    .eq("active", true);

  const { data: jewellery } = await supabase
    .from("jewellery")
    .select("slug, updated_at")
    .eq("active", true);

  const routes: MetadataRoute.Sitemap = [];

  LOCALES.forEach((locale) => {
    // Static Pages
    routes.push(
      {
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${baseUrl}/${locale}/services`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/${locale}/jewellery`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/${locale}/gallery`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${locale}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${baseUrl}/${locale}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      }
    );

    // Dynamic Service Pages
    (services || []).forEach((s) => {
      routes.push({
        url: `${baseUrl}/${locale}/services/${s.slug}`,
        lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });

    // Dynamic Jewellery Pages
    (jewellery || []).forEach((j) => {
      routes.push({
        url: `${baseUrl}/${locale}/jewellery/${j.slug}`,
        lastModified: j.updated_at ? new Date(j.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });
  });

  return routes;
}
