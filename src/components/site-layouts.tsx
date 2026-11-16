"use client";
import { usePathname } from "next/navigation";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";
import type { ComponentProps, ReactNode } from "react";

export function HomeShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <HomeLayout {...baseOptions(path === "/en" ? "en" : "zh", path)}>
      {children}
    </HomeLayout>
  );
}
export function DocsShell({
  children,
  tree,
}: Pick<ComponentProps<typeof DocsLayout>, "children" | "tree">) {
  const path = usePathname();
  return (
    <DocsLayout
      tree={tree}
      {...baseOptions(path.startsWith("/docs/en") ? "en" : "zh", path)}
    >
      {children}
    </DocsLayout>
  );
}
