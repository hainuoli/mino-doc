import type { Metadata } from "next";
import { Provider } from "@/components/provider";
import "./global.css";

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: { default: "Mino — 从一个包开始，随项目成长", template: "%s · Mino" },
  description: "渐进式 Go 开发库。轻量、快速、按需引入，沿用熟悉的 net/http。",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
