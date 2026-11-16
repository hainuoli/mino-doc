import { source } from "@/lib/source";
import { DocsShell } from "@/components/site-layouts";
export default function Layout({ children }: LayoutProps<"/docs">) {
  return <DocsShell tree={source.getPageTree()}>{children}</DocsShell>;
}
