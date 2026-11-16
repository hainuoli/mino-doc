"use client";
import SearchDialog from "@/components/search";
import { RootProvider } from "fumadocs-ui/provider/next";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

const chinese = {
  "Choose a language(language switcher)": "选择语言",
  "Choose a language(language switcher)(aria-label)": "选择语言",
  "Close Search(search dialog)(aria-label)": "关闭搜索",
  "Close Sidebar(aria-label)": "关闭目录",
  "Close Sidebar(sidebar)(aria-label)": "关闭目录",
  "Collapse Sidebar(sidebar)(aria-label)": "收起目录",
  "Copied Anchor Link(heading anchor)(aria-label)": "已复制链接",
  "Copied Markdown(page actions)": "已复制",
  "Copied Text(code block)(aria-label)": "已复制",
  "Copy Anchor Link(heading anchor)(aria-label)": "复制链接",
  "Copy Markdown(page actions)": "复制 Markdown",
  "Copy Text(code block)(aria-label)": "复制代码",
  "Dark(theme switcher)(aria-label)": "深色",
  "Hide Sidebar(sidebar)": "收起目录",
  "Language(language switcher)": "语言",
  "Layout Tab(layout tab trigger)": "选择语言",
  "Light(theme switcher)(aria-label)": "浅色",
  "Next Page(pagination)": "下一页",
  "No results found(search dialog)": "没有找到结果",
  "On this page(table of contents)": "本页目录",
  "Open Search(search trigger)(aria-label)": "打开搜索",
  "Open Sidebar(aria-label)": "打开目录",
  "Open Sidebar(sidebar)(aria-label)": "打开目录",
  "Previous Page(pagination)": "上一页",
  "Search failed(search dialog)": "搜索失败",
  "Search(search dialog)": "搜索",
  "Search(search trigger)": "搜索",
  "Show Sidebar(sidebar)": "展开目录",
  "Skip to Content(skip link)": "跳转到正文",
  "System(theme switcher)(aria-label)": "跟随系统",
  "Table of Contents(inline table of contents)": "目录",
  "Theme(site menu)": "主题",
  "Toggle Menu(home layout header)(aria-label)": "打开菜单",
  "Toggle Theme(theme switcher)(aria-label)": "切换主题",
};
export function Provider({ children }: { children: ReactNode }) {
  const path = usePathname();
  const zh = path !== "/en" && !path.startsWith("/docs/en");
  return (
    <RootProvider
      theme={{ defaultTheme: "dark" }}
      search={{ SearchDialog }}
      i18n={{
        locale: zh ? "zh" : "en",
        translations: zh ? chinese : undefined,
      }}
    >
      {children}
    </RootProvider>
  );
}
