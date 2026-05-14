import React, { useRef } from "react"
import { useLenis } from "./animations/useLenis"
import { CustomCursor } from "./components/CustomCursor"
import { Navbar } from "./sections/Navbar"
import { HeroSection } from "./sections/HeroSection"
import { LogoCarousel } from "./sections/LogoCarousel"
import { ProductShowcase } from "./sections/ProductShowcase"
import { BentoGridSection } from "./sections/BentoGridSection"
import { ScrollRevealSection } from "./sections/ScrollRevealSection"
import { MetricsSection } from "./sections/MetricsSection"
import { TabbedShowcase } from "./sections/TabbedShowcase"
import { FeatureDeepDive } from "./sections/FeatureDeepDive"
import { TestimonialSection } from "./sections/TestimonialSection"
import { SecuritySection } from "./sections/SecuritySection"
import { PricingSection } from "./sections/PricingSection"
import { CtaSection } from "./sections/CtaSection"
import { FooterSection } from "./sections/FooterSection"
import { PerformanceSection } from "./sections/PerformanceSection"

export const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  useLenis()

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#FAFCFF] font-sans text-[#0A0F2D] selection:bg-[#2563FF] selection:text-white overflow-hidden cursor-none md:cursor-none"
    >
      <CustomCursor />
      <Navbar />
      <HeroSection />
      <ProductShowcase />
      <BentoGridSection />
      <ScrollRevealSection />
      <TabbedShowcase />
      <PerformanceSection />
      <SecuritySection />
      <PricingSection />
      <CtaSection />
      <FooterSection />
    </div>
  )
}
