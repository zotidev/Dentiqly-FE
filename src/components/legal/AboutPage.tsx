import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Heart, Shield, Zap, Users, Globe, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFCFF]">
      {/* Header */}
      <header className="bg-[#0B1023] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-[30%] -right-[15%] w-[50%] h-[50%] bg-[#2563FF]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] -left-[10%] w-[30%] h-[30%] bg-[#02E3FF]/8 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
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

          <div className="py-16 lg:py-24 text-center max-w-3xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Transformando la{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563FF] to-[#02E3FF]">
                odontologia digital
              </span>
            </h1>
            <p className="text-white/40 text-xl leading-relaxed">
              Creemos que cada clinica dental merece herramientas de clase mundial.
              Por eso construimos Dentiqly.
            </p>
          </div>
        </div>
      </header>

      {/* Mission */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2563FF]/10 text-[#2563FF] text-sm font-bold mb-6">
                <Heart className="w-4 h-4" />
                Nuestra mision
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0B1023] mb-6 tracking-tight">
                Empoderar a las clinicas dentales con tecnologia de vanguardia
              </h2>
              <p className="text-[#5A6178] text-lg leading-relaxed mb-6">
                Dentiqly nacio de una frustracion real: ver como clinicas dentales excelentes
                perdian horas en tareas administrativas con software obsoleto, planillas de Excel
                o incluso papel.
              </p>
              <p className="text-[#5A6178] text-lg leading-relaxed">
                Nuestra mision es simple: que cada odontologo pueda dedicar mas tiempo a sus
                pacientes y menos a la burocracia. Construimos una plataforma que combina
                diseno intuitivo, potencia tecnica y seguridad de nivel empresarial.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { number: '+500', label: 'Clinicas activas', icon: Users },
                { number: '+50K', label: 'Pacientes gestionados', icon: Globe },
                { number: '99.9%', label: 'Uptime garantizado', icon: Zap },
                { number: '24/7', label: 'Soporte dedicado', icon: Shield },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#2563FF]/10 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-[#2563FF]" />
                  </div>
                  <p className="text-3xl font-extrabold text-[#0B1023] mb-1">{stat.number}</p>
                  <p className="text-sm text-[#8A93A8] font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#0B1023] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-[#2563FF]/8 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Nuestros valores
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              Los principios que guian cada decision que tomamos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Seguridad primero',
                description: 'Los datos de salud son sagrados. Encriptacion AES-256, backups automaticos y cumplimiento normativo son la base, no un extra.',
              },
              {
                icon: Zap,
                title: 'Simplicidad radical',
                description: 'La tecnologia debe hacer tu vida mas facil, no mas compleja. Cada funcionalidad se disena para ser intuitiva desde el primer uso.',
              },
              {
                icon: Award,
                title: 'Excelencia continua',
                description: 'Escuchamos a nuestros usuarios y mejoramos constantemente. Cada semana desplegamos mejoras basadas en feedback real de clinicas.',
              },
            ].map((value) => (
              <div
                key={value.title}
                className="p-8 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#02E3FF]/15 flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-[#02E3FF]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-white/40 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Dentiqly */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0B1023] mb-6 tracking-tight">
            Por que Dentiqly?
          </h2>
          <p className="text-[#5A6178] text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Porque entendemos que una clinica dental no es solo un consultorio — es un negocio,
            un equipo, y sobre todo, un compromiso con la salud de las personas.
          </p>

          <div className="space-y-6 text-left max-w-2xl mx-auto">
            {[
              'Disenado especificamente para odontologia, no es un CRM generico adaptado.',
              'Activacion en minutos, sin necesidad de IT ni capacitaciones extensas.',
              'Multi-sucursal nativo: gestiona todas tus clinicas desde un panel unificado.',
              'Recordatorios automaticos por WhatsApp que reducen las inasistencias un 40%.',
              'Odontograma digital interactivo que tus pacientes entienden.',
              'Soporte humano real, no bots. Contestamos en menos de 2 horas.',
            ].map((item) => (
              <div key={item} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#02E3FF]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#02E3FF]" />
                </div>
                <p className="text-[#5A6178] text-base leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#2563FF] to-[#1D4ED8] rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-[20%] -right-[10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[80px]" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4 tracking-tight">
                Listo para transformar tu clinica?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
                Unite a mas de 500 clinicas que ya gestionan su dia a dia con Dentiqly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#2563FF] rounded-2xl font-bold text-base hover:bg-white/90 transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                >
                  Comenzar gratis
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold text-base hover:bg-white/20 transition-colors"
                >
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Dentiqly. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="/privacidad" className="hover:text-[#2563FF] transition-colors">Privacidad</Link>
            <Link to="/terminos" className="hover:text-[#2563FF] transition-colors">Terminos</Link>
            <Link to="/cookies" className="hover:text-[#2563FF] transition-colors">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
