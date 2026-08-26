import React from "react";
import { Metadata } from "next";
import { fetchShowcaseItems } from "./actions";
import { ShowcaseManagerView } from "@/components/admin/ShowcaseManagerView";

export const metadata: Metadata = {
  title: "Featured Showcase Manager | Admin Portal",
  description: "Manage and reorder homepage showcase carousel slides.",
};

export default async function ShowcaseAdminPage() {
  const { items } = await fetchShowcaseItems();

  return <ShowcaseManagerView initialItems={items} />;
}
