import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BrandLogo } from "@/components/brand-logo";

export function baseOptions(
  lang: "zh" | "en" = "zh",
  pathname = "/",
): BaseLayoutProps {
  return {
    nav: {
      title: <BrandLogo />,
    },
    githubUrl: "https://github.com/hainuoli/mino",
    links: [
      { text: lang === "zh" ? "文档" : "Documentation", url: `/docs/${lang}` },
      {
        text: "API",
        url: "https://pkg.go.dev/github.com/hainuoli/mino",
        external: true,
      },
      {
        text: lang === "zh" ? "English" : "简体中文",
        url: pathname.startsWith("/docs/")
          ? pathname.replace(
              `/docs/${lang}`,
              `/docs/${lang === "zh" ? "en" : "zh"}`,
            )
          : lang === "zh"
            ? "/en"
            : "/",
      },
    ],
  };
}
