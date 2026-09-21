import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

/* --font-geist-sans, not --font-sans. globals.css points Tailwind's
   --font-sans at this one, so the two names stay distinct and the old
   self-referencing definition can't come back. */
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Juan Alvarez — UX Designer",
    /* Case study pages set just their own title; this wraps it. */
    template: "%s — Juan Alvarez",
  },
  description:
    "UX Designer with 4 years of experience and a Design B.A. from UC Davis.",
};

/* The layout deliberately renders almost nothing. No <main>, no background,
   no ViewTransition — a layout persists across navigation, so its children
   never mount or unmount and enter/exit would never fire from here. All of
   that lives in <Shell>, which each page renders. */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      {/* antialiased once, here — it used to be repeated on html and on every
          page's <main>. font-sans is explicit rather than relying on
          Tailwind's preflight default, so the font is visible in the markup. */}
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
