import type { Metadata } from "next";
import { LightboxProvider } from "@/components/galleries/Lightbox";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { HomeHero } from "@/components/home/HomeHero";
import {
  AboutIntro,
  BlogPreview,
  CompareSection,
  HomeContact,
  HomeFaq,
  InspirationGallery,
  ProcessSteps,
  ServicesPreview,
  Testimonial,
} from "@/components/home/sections";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { PageShell } from "@/components/layout/PageShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({ path: "/" });

export default function HomePage() {
  return (
    <PageShell pageClass="homePage">
      <LightboxProvider>
        <HomeHero />
        <main id="main-content">
          <AboutIntro />
          <ServicesPreview />
          <FeaturedProjects />
          <InspirationGallery />
          <CompareSection />
          <ProcessSteps />
          <Testimonial />
          <BlogPreview />
          <HomeFaq />
          <HomeContact />
        </main>
        <SiteFooter variant="home" />
        <FloatingCta />
      </LightboxProvider>
    </PageShell>
  );
}
