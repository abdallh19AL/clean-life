import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "Clean Life | عيادة الصحة والرياضة",
  description: "خطتك الصحية المخصصة للتغذية والتدريب مع خبراء Clean Life",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#2D6A4F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, padding: 0, fontFamily: `${cairo.style.fontFamily}, 'Segoe UI', sans-serif` }}>
        {children}
      </body>
    </html>
  );
}