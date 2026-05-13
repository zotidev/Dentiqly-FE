import React, { useRef } from "react"
import { useLenis } from "./animations/useLenis"
import { CustomCursor } from "./components/CustomCursor"
import { Navbar } from "./sections/Navbar"
import { HeroSection } from "./sections/HeroSection"
import { LogoCarousel } from "./sections/LogoCarousel"
import { ProductShowcase } from "./sections/ProductShowcase"
import { MetricsSection } from "./sections/MetricsSection"
import { FeatureDeepDive } from "./sections/FeatureDeepDive"
import { TestimonialSection } from "./sections/TestimonialSection"
import { SecuritySection } from "./sections/SecuritySection"
import { FaqSection } from "./sections/FaqSection"
import { PricingSection } from "./sections/PricingSection"
import { CtaSection } from "./sections/CtaSection"
import { FooterSection } from "./sections/FooterSection"

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
      <LogoCarousel />
      <ProductShowcase />
      <MetricsSection />
      <FeatureDeepDive />
      <TestimonialSection />
      <SecuritySection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <FooterSection />
    </div>
  )
}
