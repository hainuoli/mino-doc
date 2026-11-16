import { source } from "@/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
} from "fumadocs-ui/layouts/docs/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { getPageImageUrl } from "@/lib/shared";
import Link from "next/link";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = `/llms.mdx${page.url}.md`;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      lang={page.url.includes("/zh") ? "zh-CN" : "en"}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <div className="docs-language flex items-center justify-between border-b pb-5">
        <Link
          href={
            page.url.includes("/zh")
              ? page.url.replace("/zh", "/en")
              : page.url.replace("/en", "/zh")
          }
          lang={page.url.includes("/zh") ? "en" : "zh-CN"}
        >
          {page.url.includes("/zh") ? "Read in English ↗" : "简体中文 ↗"}
        </Link>
        <MarkdownCopyButton markdownUrl={markdownUrl} />
      </div>
      <DocsBody
        className="docs-prose"
        lang={page.url.includes("/zh") ? "zh-CN" : "en"}
      >
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: process.env.NEXT_PUBLIC_SITE_URL
      ? { images: getPageImageUrl(page).url }
      : undefined,
  };
}
