import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Juan Alvarez — UX Designer",
  description:
    "UX Designer with 4 years of experience and a Design B.A. from UC Davis.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.className} ${geistSans.variable} h-full antialiased`}
    >
      <head>
      </head>
      <body className="min-h-full">
        {children}
      </body>
    </html>
  );
}
