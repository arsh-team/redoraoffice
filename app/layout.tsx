import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { MotionController } from "@/components/motion/MotionController";
import { motionBootstrapScript } from "@/components/motion/bootstrap";
import { JsonLd } from "@/components/seo/JsonLd";
import { imagePublicPath } from "@/lib/content/images";
import { site } from "@/lib/content/site";
import { organizationJsonLd } from "@/lib/seo/structured-data";
import "./globals.css";

// Same family and weight range the reference loads from Google Fonts (300–900).
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.defaultTitle, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: site.defaultTitle,
    description: site.description,
    url: "/",
    images: [imagePublicPath.hero],
  },
  twitter: {
    card: "summary_large_image",
    title: site.defaultTitle,
    description: site.description,
    images: [imagePublicPath.hero],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f2ea",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The inline bootstrap adds a motion class to <html> before hydration.
    <html lang="fa" dir="rtl" className={vazirmatn.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrapScript }} />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-redora-ink focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
        >
          رفتن به محتوای اصلی
        </a>
        {children}
        <MotionController />
        <JsonLd data={organizationJsonLd} />
      </body>
    </html>
  );
}
