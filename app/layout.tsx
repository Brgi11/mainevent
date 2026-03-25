import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { headers } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";

export const metadata: Metadata = {
  title: {
    default: "Main Event",
    template: "%s · Main Event",
  },
  description:
    "Premium entertainment and event production based in Split, Croatia.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname");
  const bodyClass = pathname != null && pathname !== "/" ? "inner-page" : "";

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={bodyClass}>
        <LanguageProvider>
          <SiteHeader />
          <main className="site-main">{children}</main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
