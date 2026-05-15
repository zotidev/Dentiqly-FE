import React from 'react';
import { Navbar } from '../landing/sections/Navbar';
import { FooterSection } from '../landing/sections/FooterSection';
import { SEO } from '../seo/SEO';

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
  seoDescription?: string;
  seoCanonical?: string;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({ title, subtitle, lastUpdated, children, seoDescription, seoCanonical }) => {
  return (
    <div className="min-h-screen bg-[#FAFCFF]">
      <SEO title={title} description={seoDescription || subtitle} canonical={seoCanonical} />
      <Navbar />

      {/* Hero header */}
      <header className="pt-40 pb-16 lg:pt-48 lg:pb-20 bg-[#FAFCFF] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-gradient-to-b from-[#2563FF]/8 to-[#02E3FF]/4 rounded-full blur-[120px]" />
          <div className="absolute top-[30%] -left-[10%] w-[40%] h-[40%] bg-gradient-to-tr from-[#8B5CF6]/8 to-transparent rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0A0F2D] mb-3 tracking-tight">{title}</h1>
          <p className="text-[#8A93A8] text-lg">{subtitle}</p>
          <p className="text-[#8A93A8]/50 text-sm mt-4">Ultima actualizacion: {lastUpdated}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 p-8 sm:p-12 lg:p-16">
          <div className="prose prose-gray max-w-none prose-headings:text-[#0B1023] prose-headings:font-extrabold prose-p:text-[#5A6178] prose-p:leading-relaxed prose-li:text-[#5A6178] prose-a:text-[#2563FF] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-strong:text-[#0B1023]">
            {children}
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};
