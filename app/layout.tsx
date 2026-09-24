import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

/* --font-geist-sans, not --font-sans: globals.css points Tailwind's
   --font-sans at this one, so the two names can't reference each other. */
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Juan Alvarez — UX Designer",
    template: "%s — Juan Alvarez",
  },
  description:
    "UX Designer with 4 years of experience and a Design B.A. from UC Davis.",
};

/* No <main> here. A layout persists across navigation, so a ViewTransition
   in it would never fire — that lives in Shell, per page. */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
