import { HomeShell } from "@/components/site-layouts";
export default function Layout({ children }: LayoutProps<"/">) {
  return <HomeShell>{children}</HomeShell>;
}
