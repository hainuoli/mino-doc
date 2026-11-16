import type { Metadata } from "next";
import { Landing } from "@/components/landing";
export const metadata: Metadata = {
  title: { absolute: "Mino — Start small. Grow your way." },
  description:
    "A progressive Go toolkit. Lightweight, fast, and built for adoption on demand.",
};
export default function EnglishHomePage() {
  return <Landing lang="en" />;
}
