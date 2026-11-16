import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(
  lang: "zh" | "en" = "zh",
  pathname = "/",
): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="mino-wordmark">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 2h7v3h-5v3H9v8h3v3h5v3h-7v-3H6v-3H3V8h3V5h4z" />
          </svg>
          mino<span aria-hidden="true">.</span>
        </span>
      ),
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
