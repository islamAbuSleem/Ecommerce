import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/auth/Providers";
import { RouteTransition } from "@/components/ui/RouteTransition";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "A multi-vendor marketplace — discover products from multiple vendors in one place.",
  icons: {
    icon: "/favicon.ico",
  },
};

const FONT_LINKS = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap",
    precedence: "default",
  },
] as const;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      {FONT_LINKS.map((link) => (
        <link key={link.href} {...link} />
      ))}
      <body className="min-h-full flex flex-col bg-background font-sans text-text-primary">
        <Providers>
          <RouteTransition>{children}</RouteTransition>
        </Providers>
      </body>
    </html>
  );
}
