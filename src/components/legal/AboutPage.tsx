import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Shield, Zap, Users, Globe, Award, Sparkles, MessageCircle, Building2 } from 'lucide-react';
import { SEO, PAGE_SEO } from '../seo/SEO';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '../landing/sections/Navbar';
import { FooterSection } from '../landing/sections/FooterSection';
import { About3DScene } from '../landing/About3DScene';

gsap.registerPlugin(ScrollTrigger);

export const AboutPage: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const missionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  const whyRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from('.about-hero-badge', {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.3,
      });

      gsap.from('.about-hero-title', {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power4.out',
        delay: 0.5,
      });

      gsap.from('.about-hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.8,
      });

      gsap.from('.about-hero-ctas > *', {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
        delay: 1,
      });

      // Mission section
      gsap.from('.mission-tag', {
        opacity: 0,
        x: -20,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: missionRef.current, start: 'top 80%' },
      });

      gsap.from('.mission-title', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: missionRef.current, start: 'top 75%' },
      });

      gsap.from('.mission-text', {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: missionRef.current, start: 'top 70%' },
      });

      // Stats counter animation
      gsap.from('.stat-card', {
        opacity: 0,
        y: 50,
        scale: 0.9,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: statsRef.current, start: 'top 80%' },
      });

      // Values
      gsap.from('.values-heading > *', {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: valuesRef.current, start: 'top 80%' },
      });

      gsap.from('.value-card', {
        opacity: 0,
        y: 60,
        rotateX: 10,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.value-card', start: 'top 85%' },
      });

      // Why section
      gsap.from('.why-heading > *', {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: whyRef.current, start: 'top 80%' },
      });

      gsap.from('.why-item', {
        opacity: 0,
        x: -30,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.why-item', start: 'top 90%' },
      });

      // Team / CTA
      gsap.from('.team-cta > *', {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: teamRef.current, start: 'top 80%' },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFCFF] font-sans text-[#0A0F2D] selection:bg-[#2563FF] selection:text-white overflow-hidden">
      <SEO {...PAGE_SEO.about} />
      <Navbar />

      {/* Hero — Light, with 3D */}
      <section ref={heroRef} className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#FAFCFF]">
        {/* Background gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-b from-[#2563FF]/10 to-[#02E3FF]/5 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-tr from-[#8B5CF6]/10 to-transparent rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl relative z-20">
              <div className="about-hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8">
                <Sparkles className="w-4 h-4 text-[#2563FF]" />
                <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2563FF] to-[#02E3FF]">
                  Nuestra historia
                </span>
              </div>

              <h1 className="about-hero-title text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] text-[#0A0F2D]">
                Transformando la{' '}
                <span className="relative whitespace-nowrap">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#2563FF] to-[#02E3FF]">
                    odontologia
                  </span>
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-blue-100/60 -z-10 rounded-full" />
                </span>{' '}
                digital.
              </h1>

              <p className="about-hero-subtitle text-xl text-gray-600 mb-10 max-w-xl leading-relaxed">
                Creemos que cada clinica dental merece herramientas de clase mundial.
                Construimos tecnologia que empodera a odontologos para enfocarse en lo que mas importa: sus pacientes.
              </p>

              <div className="about-hero-ctas flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="group relative bg-[#2563FF] text-white px-8 py-4 rounded-2xl text-base font-bold overflow-hidden shadow-[0_10px_30px_rgba(37,99,255,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,255,0.4)] transition-all"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative flex items-center justify-center gap-2">
                    Comenzar gratis
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
                <a
                  href="mailto:hola@dentiqly.com"
                  className="group bg-white text-[#0A0F2D] border-2 border-gray-100 px-8 py-4 rounded-2xl text-base font-bold hover:border-gray-200 transition-all flex items-center justify-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-[#2563FF] group-hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  Contactanos
                </a>
              </div>
            </div>

            {/* 3D Scene */}
            <div className="relative z-10 hidden lg:block">
              <div className="relative w-full aspect-square">
                <About3DScene />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section ref={statsRef} className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '+500', label: 'Clinicas activas', icon: Building2, color: '#2563FF' },
              { number: '+50K', label: 'Pacientes gestionados', icon: Users, color: '#02E3FF' },
              { number: '99.9%', label: 'Uptime garantizado', icon: Zap, color: '#10B981' },
              { number: '24/7', label: 'Soporte dedicado', icon: Shield, color: '#8B5CF6' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="stat-card text-center p-6 rounded-2xl hover:bg-[#F7F8FA] transition-colors"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${stat.color}12` }}
                >
                  <stat.icon className="w-7 h-7" style={{ color: stat.color }} />
                </div>
                <p className="text-4xl font-extrabold text-[#0B1023] mb-1">{stat.number}</p>
                <p className="text-sm text-[#8A93A8] font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section ref={missionRef} className="py-24 lg:py-32 bg-[#FAFCFF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="mission-tag inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2563FF]/10 text-[#2563FF] text-sm font-bold mb-6">
                <Heart className="w-4 h-4" />
                Nuestra mision
              </div>
              <h2 className="mission-title text-3xl lg:text-4xl font-extrabold text-[#0B1023] mb-8 tracking-tight leading-tight">
                Empoderar a las clinicas dentales con tecnologia que realmente funciona
              </h2>
              <div className="space-y-5">
                <p className="mission-text text-[#5A6178] text-lg leading-relaxed">
                  Dentiqly nacio de una frustracion real. Vimos como clinicas dentales brillantes
                  perdian horas valiosas en tareas administrativas usando software anticuado,
                  planillas de Excel, o directamente papel y lapiz.
                </p>
                <p className="mission-text text-[#5A6178] text-lg leading-relaxed">
                  Nos propusimos construir algo diferente: una plataforma que combine la
                  potencia de un sistema empresarial con la simplicidad de una app que usas
                  todos los dias. Cada funcionalidad esta pensada por y para odontologos.
                </p>
                <p className="mission-text text-[#5A6178] text-lg leading-relaxed">
                  Hoy, mas de 500 clinicas en Argentina confian en Dentiqly para gestionar
                  su operacion diaria. Y estamos recien empezando.
                </p>
              </div>
            </div>

            {/* Visual element — glowing card stack */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Back card */}
                <div className="absolute top-8 left-8 right-0 bottom-0 bg-[#2563FF]/5 rounded-3xl border border-[#2563FF]/10 transform rotate-3" />
                {/* Middle card */}
                <div className="absolute top-4 left-4 right-0 bottom-0 bg-[#02E3FF]/5 rounded-3xl border border-[#02E3FF]/10 transform -rotate-1" />
                {/* Front card */}
                <div className="relative bg-white rounded-3xl border border-gray-100 shadow-[0_20px_60px_rgb(0,0,0,0.06)] p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563FF] to-[#02E3FF] flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-[#0B1023]">Dashboard Dentiqly</p>
                        <p className="text-sm text-[#8A93A8]">Vista unificada de tu clinica</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-[#F7F8FA] rounded-xl p-4 text-center">
                        <p className="text-2xl font-extrabold text-[#2563FF]">24</p>
                        <p className="text-xs text-[#8A93A8] mt-1">Turnos hoy</p>
                      </div>
                      <div className="bg-[#F7F8FA] rounded-xl p-4 text-center">
                        <p className="text-2xl font-extrabold text-[#10B981]">98%</p>
                        <p className="text-xs text-[#8A93A8] mt-1">Asistencia</p>
                      </div>
                      <div className="bg-[#F7F8FA] rounded-xl p-4 text-center">
                        <p className="text-2xl font-extrabold text-[#8B5CF6]">$1.2M</p>
                        <p className="text-xs text-[#8A93A8] mt-1">Facturado</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 h-2 rounded-full bg-[#2563FF]/20 overflow-hidden">
                        <div className="h-full w-[75%] rounded-full bg-gradient-to-r from-[#2563FF] to-[#02E3FF]" />
                      </div>
                      <span className="text-xs font-bold text-[#2563FF]">75%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="py-24 lg:py-32 bg-[#0B1023] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-[#2563FF]/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] -left-[10%] w-[30%] h-[30%] bg-[#02E3FF]/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="values-heading text-center mb-16">
            <h2 className="text-sm font-extrabold text-[#02E3FF] tracking-widest uppercase mb-4">
              Lo que nos define
            </h2>
            <h3 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight">
              Nuestros valores
            </h3>
            <p className="text-white/40 text-lg max-w-2xl mx-auto mt-4">
              Los principios que guian cada linea de codigo que escribimos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Seguridad primero',
                description: 'Los datos de salud son sagrados. Encriptacion AES-256, backups cada hora y compliance total son la base de todo lo que hacemos.',
                gradient: 'from-[#2563FF] to-[#02E3FF]',
              },
              {
                icon: Zap,
                title: 'Simplicidad radical',
                description: 'La tecnologia debe simplificar, no complicar. Cada pantalla se disena para ser intuitiva desde el primer segundo.',
                gradient: 'from-[#02E3FF] to-[#10B981]',
              },
              {
                icon: Award,
                title: 'Mejora continua',
                description: 'Escuchamos a nuestros usuarios obsesivamente. Cada semana desplegamos mejoras basadas en feedback real de clinicas.',
                gradient: 'from-[#8B5CF6] to-[#2563FF]',
              },
            ].map((value) => (
              <div
                key={value.title}
                className="value-card group p-8 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-500"
                style={{ perspective: '1000px' }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{value.title}</h4>
                <p className="text-white/40 leading-relaxed text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Dentiqly */}
      <section ref={whyRef} className="py-24 lg:py-32 bg-[#FAFCFF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="why-heading text-center mb-16">
            <h2 className="text-sm font-extrabold text-[#2563FF] tracking-widest uppercase mb-4">
              Por que elegirnos
            </h2>
            <h3 className="text-3xl lg:text-5xl font-extrabold text-[#0B1023] tracking-tight">
              Por que Dentiqly?
            </h3>
            <p className="text-[#5A6178] text-lg max-w-2xl mx-auto mt-4">
              Porque una clinica dental no es solo un consultorio — es un negocio, un equipo,
              y un compromiso con la salud de las personas.
            </p>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              { icon: Sparkles, text: 'Disenado 100% para odontologia, no es un CRM generico adaptado.' },
              { icon: Zap, text: 'Activacion en minutos, sin necesidad de IT ni capacitaciones extensas.' },
              { icon: Building2, text: 'Multi-sucursal nativo: gestiona todas tus clinicas desde un panel.' },
              { icon: MessageCircle, text: 'Recordatorios WhatsApp que reducen inasistencias un 40%.' },
              { icon: Globe, text: 'Odontograma digital interactivo que tus pacientes entienden.' },
              { icon: Users, text: 'Soporte humano real. Contestamos en menos de 2 horas.' },
            ].map((item, i) => (
              <div key={i} className="why-item flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-[#2563FF]/20 hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#2563FF]/8 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-[#2563FF]" />
                </div>
                <p className="text-[#5A6178] text-base leading-relaxed font-medium pt-1.5">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={teamRef} className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="team-cta relative rounded-[2.5rem] bg-gradient-to-br from-[#2563FF] to-[#02E3FF] p-12 md:p-20 text-center overflow-hidden shadow-[0_20px_60px_rgba(37,99,255,0.2)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Listo para transformar
                <br />
                tu clinica?
              </h2>
              <p className="text-blue-100/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                Unite a mas de 500 clinicas que ya gestionan su dia a dia con Dentiqly.
                14 dias gratis, sin tarjeta de credito.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex bg-white text-[#2563FF] px-10 py-5 rounded-2xl text-lg font-bold hover:scale-105 transition-transform shadow-xl items-center gap-2 group"
                >
                  Crear mi cuenta gratis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex bg-white/10 text-white border border-white/20 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white/20 transition-all items-center justify-center"
                >
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};
