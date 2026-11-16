import { Geist } from "next/font/google";
import SmoothScroll from "./components/SmoothScroll";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata = { title: "Juan Alvarez Portfolio" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geist.className}>
      <body className="antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}