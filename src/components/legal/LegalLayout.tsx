import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({ title, subtitle, lastUpdated, children }) => {
  return (
    <div className="min-h-screen bg-[#FAFCFF]">
      <header className="bg-[#0B1023] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-[30%] -right-[15%] w-[50%] h-[50%] bg-[#2563FF]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] -left-[10%] w-[30%] h-[30%] bg-[#02E3FF]/8 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/assets/dentiqly-logo.png" alt="Dentiqly" className="h-8 w-auto brightness-0 invert" />
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
          </div>

          <div className="py-12">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight">{title}</h1>
            <p className="text-white/40 text-lg">{subtitle}</p>
            <p className="text-white/25 text-sm mt-4">Ultima actualizacion: {lastUpdated}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 p-8 sm:p-12 lg:p-16">
          <div className="prose prose-gray max-w-none prose-headings:text-[#0B1023] prose-headings:font-extrabold prose-p:text-[#5A6178] prose-p:leading-relaxed prose-li:text-[#5A6178] prose-a:text-[#2563FF] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-strong:text-[#0B1023]">
            {children}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Dentiqly. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="/privacidad" className="hover:text-[#2563FF] transition-colors">Privacidad</Link>
            <Link to="/terminos" className="hover:text-[#2563FF] transition-colors">Terminos</Link>
            <Link to="/cookies" className="hover:text-[#2563FF] transition-colors">Cookies</Link>
            <Link to="/sobre-nosotros" className="hover:text-[#2563FF] transition-colors">Sobre nosotros</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
