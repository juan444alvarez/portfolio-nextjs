import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import InternalTool from "./InternalTool";
import "./internal-tool.css";

const sans = Geist({ subsets: ["latin"], variable: "--chem-font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--chem-font-mono" });

export const metadata: Metadata = {
  title: "Work better, with anyone",
  description:
    "Pick the chemistry style that sounds most like you, and learn how to work well with the other ones.",
};

export default function InternalToolPage() {
  return <InternalTool className={`${sans.variable} ${mono.variable}`} />;
}
