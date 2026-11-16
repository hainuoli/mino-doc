import { createGetUrl } from "fumadocs-core/source";
export const appName = "Mino";
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";
export const gitConfig = { user: "hainuoli", repo: "mino-doc", branch: "main" };
const getImageUrl = createGetUrl(docsImageRoute);
export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, "image.png"];
  return { segments, url: getImageUrl(segments, page.locale) };
}
