import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css"; // 👈 هذا السطر هو اللي بيرجع الألوان والتنسيقات للموقع
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";

const cairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "حياة أنظف | مساحتك للتعافي",
  description: "دليلك العملي لصيام الدوبامين والتخلص من العادات السلبية",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.className} bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-300`}>
        <ThemeProvider>
          <Navbar /> 
          <main className="min-h-screen">
            {children}
          </main>
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}