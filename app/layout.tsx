import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

// next/font downloads the font at build time and serves it from this app,
// so no request reaches Google when children use the app.
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Little Learners — Explore · Learn · Grow",
  description:
    "Aplikasi belajar terinspirasi Montessori untuk anak usia 4–6 tahun: membaca, menulis, angka, dan bahasa Inggris.",
};

export const viewport: Viewport = {
  themeColor: "#faf7f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
