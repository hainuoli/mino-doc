import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

export const revalidate = false;
export const { staticGET: GET } = createFromSource(source, {
  async buildIndex(page) {
    const structuredData = page.path.endsWith("index.mdx")
      ? { headings: [], contents: [] }
      : page.data.structuredData;
    return {
      id: page.url,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      tag: page.url.startsWith("/docs/en") ? "en" : "zh",
      structuredData,
    };
  },
});
