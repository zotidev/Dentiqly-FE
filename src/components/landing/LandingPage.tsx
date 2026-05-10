import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { CheckCircle2, PlayCircle, Users, Activity, Calendar, Shield, Menu, X, ClipboardList, Receipt, BarChart3, Package, Bell, Lock, Zap, HeartHandshake, Star, ArrowRight, Facebook, Twitter, Instagram, Linkedin, Check, Sparkles, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero3D } from './Hero3D';

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="min-h-screen bg-[#FAFCFF] font-sans text-[#0A0F2D] selection:bg-[#2563FF] selection:text-white overflow-hidden">
      
      {/* Premium Floating Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
      >
        <div className="w-full max-w-6xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-6 py-4 flex justify-between items-center transition-all">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <img src="/assets/dentiqly-logo.png" alt="Dentiqly" className="h-8 w-auto" />
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {['Producto', 'Funcionalidades', 'Precios', 'Recursos'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-[#2563FF] hover:bg-blue-50/50 rounded-full transition-all">
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:text-[#2563FF] transition-colors">Ingresar</Link>
            <Link to="/register" className="relative group px-6 py-2.5 bg-[#0A0F2D] text-white rounded-full text-sm font-bold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(37,99,255,0.6)]">
              <span className="relative z-10 flex items-center gap-2">Probar gratis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2563FF] to-[#02E3FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

          <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <motion.div 
            style={{ y }}
            className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-b from-[#2563FF]/10 to-[#02E3FF]/5 rounded-full blur-[120px]" 
          />
          <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-tr from-[#8B5CF6]/10 to-transparent rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="max-w-2xl relative z-20">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8"
              >
                <Sparkles className="w-4 h-4 text-[#2563FF]" />
                <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2563FF] to-[#02E3FF]">La nueva era de la gestión dental</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-[#0A0F2D]"
              >
                Software dental <br/>
                <span className="relative whitespace-nowrap">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#2563FF] to-[#02E3FF]">todo en uno</span>
                  <motion.span 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "circOut" }}
                    className="absolute bottom-2 left-0 w-full h-4 bg-blue-100/60 -z-10 origin-left rounded-full"
                  />
                </span> <br/>
                sin complicaciones.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-xl text-gray-600 mb-10 max-w-xl leading-relaxed"
              >
                Transforma la forma en que operas tu clínica. Gestiona pacientes, historias clínicas y facturación con una fluidez que parece magia.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Link to="/register" className="group relative bg-[#2563FF] text-white px-8 py-4 rounded-2xl text-base font-bold overflow-hidden shadow-[0_10px_30px_rgba(37,99,255,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,255,0.4)] transition-all">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  <span className="relative flex items-center justify-center gap-2">Comenzar gratis <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></span>
                </Link>
                <button className="group bg-white text-[#0A0F2D] border-2 border-gray-100 px-8 py-4 rounded-2xl text-base font-bold hover:border-gray-200 transition-all flex items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-[#2563FF] group-hover:text-white transition-colors">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  Ver demo
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex items-center gap-5"
              >
                <div className="flex -space-x-4">
                  {[1,2,3,4].map((i) => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i}`} alt="User" className="w-12 h-12 rounded-full border-4 border-[#FAFCFF] shadow-sm" />
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-sm text-gray-600 font-medium mt-1">Confiado por +500 clínicas</p>
                </div>
              </motion.div>
            </div>

            <div className="relative z-10 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                className="relative"
              >
                <Hero3D />
              </motion.div>
            </div>

          </div>
        </div>
      </div>

      {/* Modern Bento Box Features */}
      <div id="funcionalidades" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-extrabold text-[#2563FF] tracking-widest uppercase mb-3">Poder sin límites</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-[#0A0F2D] mb-6 tracking-tight">Todo lo que necesitas, <br/>en una interfaz asombrosa.</h3>
            <p className="text-xl text-gray-600">Un ecosistema completo diseñado obsesivamente para que ahorres horas de trabajo cada semana.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Item 1 - Large */}
            <FadeIn delay={0.1} className="md:col-span-2 group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(37,99,255,0.1)] transition-all duration-500 overflow-hidden overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#2563FF]/10 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#2563FF] to-[#02E3FF] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                <Calendar className="text-white w-7 h-7" />
              </div>
              <h4 className="text-2xl font-bold text-[#0A0F2D] mb-3">Agenda Inteligente</h4>
              <p className="text-gray-600 mb-8 max-w-md">Visualiza tu día al instante. Arrastra, suelta y confirma turnos por WhatsApp automáticamente sin mover un dedo.</p>
              
              {/* Abstract UI representation */}
              <div className="w-full h-48 bg-[#FAFCFF] rounded-2xl border border-gray-100 p-4 relative overflow-hidden group-hover:-translate-y-2 transition-transform duration-500">
                <div className="flex gap-4 h-full">
                  <div className="w-16 h-full bg-white rounded-xl shadow-sm border border-gray-50 flex flex-col gap-2 p-2">
                    {[1,2,3,4].map(i => <div key={i} className="w-full h-8 bg-gray-50 rounded-lg"></div>)}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="w-full h-12 bg-white rounded-xl shadow-sm border border-gray-50 flex items-center px-4">
                      <div className="w-32 h-3 bg-blue-100 rounded-full"></div>
                    </div>
                    <div className="w-3/4 h-24 bg-gradient-to-r from-[#2563FF]/10 to-[#02E3FF]/10 rounded-xl border border-blue-100/50 relative">
                      <div className="absolute left-4 top-4 w-2 h-2 bg-[#2563FF] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Bento Item 2 */}
            <FadeIn delay={0.2} className="group relative bg-[#0A0F2D] text-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#2563FF] rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                <Users className="text-white w-7 h-7" />
              </div>
              <h4 className="text-2xl font-bold mb-3 relative z-10">Historia Clínica Digital</h4>
              <p className="text-gray-400 relative z-10">Toda la información de tus pacientes asegurada y accesible desde cualquier dispositivo, en cualquier lugar del mundo.</p>
            </FadeIn>

            {/* Bento Item 3 */}
            <FadeIn delay={0.3} className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(37,99,255,0.1)] transition-all duration-500 overflow-hidden">
               <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Receipt className="text-purple-600 w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-[#0A0F2D] mb-3">Facturación Simplificada</h4>
              <p className="text-gray-600 text-sm">Emite facturas y controla los pagos de múltiples profesionales sin dolores de cabeza financieros.</p>
            </FadeIn>

            {/* Bento Item 4 */}
            <FadeIn delay={0.4} className="md:col-span-2 group bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(37,99,255,0.1)] transition-all duration-500 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
              <div className="flex-1">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 className="text-emerald-600 w-7 h-7" />
                </div>
                <h4 className="text-2xl font-bold text-[#0A0F2D] mb-3">Métricas en Tiempo Real</h4>
                <p className="text-gray-600">Toma decisiones basadas en datos reales. Entiende de dónde vienen tus ingresos y optimiza el rendimiento de tu clínica.</p>
              </div>
              <div className="w-full md:w-1/2 h-40 bg-gray-50 rounded-2xl relative flex items-end justify-between p-4 group-hover:bg-emerald-50/30 transition-colors">
                {[40, 70, 45, 90, 65].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="w-8 bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-lg"
                  />
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Values / Tech Section */}
      <div className="py-32 bg-white relative overflow-hidden border-y border-gray-100">
        <div className="absolute -left-40 top-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Lock, title: 'Seguridad Bancaria', desc: 'Tus datos encriptados con AES-256. Copias de seguridad automáticas.' },
              { icon: Zap, title: 'Rendimiento Extremo', desc: 'Arquitectura edge computing para tiempos de carga de milisegundos.' },
              { icon: HeartHandshake, title: 'Soporte VIP', desc: 'Atención personalizada por humanos, no bots. Resolvemos rápido.' }
            ].map((feature, i) => (
              <FadeIn key={i} delay={i * 0.2} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-3xl bg-[#FAFCFF] border border-gray-100 shadow-sm flex items-center justify-center mb-6 group-hover:shadow-md group-hover:-translate-y-2 transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-[#2563FF]" />
                </div>
                <h4 className="text-xl font-bold text-[#0A0F2D] mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Pricing Section */}
      <div id="precios" className="py-32 bg-[#0A0F2D] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2563FF] rounded-[100%] blur-[120px] opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Simple, Transparente, Ilimitado.</h2>
            <p className="text-xl text-blue-200/70">Un único plan que escala con tu clínica. Sin letras chicas.</p>
          </FadeIn>

          <FadeIn delay={0.2} className="max-w-md mx-auto">
            <div className="relative p-[1px] rounded-[2rem] bg-gradient-to-b from-white/20 to-white/5 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-[#2563FF]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-[#0F1535] rounded-[2rem] p-10 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-white">Plan Pro</h3>
                  <span className="px-4 py-1.5 rounded-full bg-[#2563FF]/20 border border-[#2563FF]/30 text-[#2563FF] text-xs font-bold uppercase tracking-wider">Más Popular</span>
                </div>
                
                <div className="mb-8">
                  <span className="text-6xl font-extrabold text-white tracking-tight">$80.000</span>
                  <span className="text-blue-200/50 text-lg ml-2">ARS / mes</span>
                </div>

                <div className="space-y-5 mb-10">
                  {['Usuarios y profesionales ilimitados', 'Gestión de turnos y agenda online', 'Historias clínicas y odontogramas', 'Facturación y control de caja', 'Recordatorios por WhatsApp', 'Soporte prioritario 24/7'].map((feat, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2563FF]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-[#02E3FF]" />
                      </div>
                      <span className="text-blue-50/80">{feat}</span>
                    </div>
                  ))}
                </div>

                <Link to="/register" className="w-full py-4 rounded-xl bg-white text-[#0A0F2D] text-base font-bold flex justify-center items-center gap-2 hover:bg-gray-100 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  Comenzar 14 días gratis
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="relative rounded-[2.5rem] bg-gradient-to-br from-[#2563FF] to-[#02E3FF] p-12 md:p-20 text-center overflow-hidden shadow-[0_20px_60px_rgba(37,99,255,0.2)]">
            {/* Abstract background shapes inside CTA */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl mix-blend-overlay"></div>
            
            <h2 className="relative z-10 text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">El futuro de tu clínica<br/>comienza hoy.</h2>
            <p className="relative z-10 text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">Únete a las cientos de clínicas que ya están ahorrando tiempo y brindando una experiencia excepcional a sus pacientes.</p>
            
            <Link to="/register" className="relative z-10 inline-flex bg-white text-[#2563FF] px-10 py-5 rounded-2xl text-lg font-bold hover:scale-105 transition-transform shadow-xl items-center gap-2 group">
              Crear mi cuenta gratis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>
      </div>

      {/* Sleek Footer */}
      <footer className="bg-[#FAFCFF] border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <img src="/assets/dentiqly-logo.png" alt="Dentiqly" className="h-8 w-auto mb-6" />
              <p className="text-gray-500 text-sm mb-8 pr-4">Software de gestión dental de próxima generación para clínicas que exigen lo mejor.</p>
              <div className="flex gap-4">
                {[Twitter, Linkedin, Instagram, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#2563FF] hover:border-[#2563FF]/30 hover:bg-blue-50 transition-all">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[#0A0F2D] mb-6">Plataforma</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#2563FF] transition-colors">Funcionalidades</a></li>
                <li><a href="#precios" className="hover:text-[#2563FF] transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-[#2563FF] transition-colors">Seguridad</a></li>
                <li><a href="#" className="hover:text-[#2563FF] transition-colors">Actualizaciones</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#0A0F2D] mb-6">Recursos</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#2563FF] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#2563FF] transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-[#2563FF] transition-colors">Guías</a></li>
                <li><a href="#" className="hover:text-[#2563FF] transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#0A0F2D] mb-6">Compañía</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#2563FF] transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-[#2563FF] transition-colors">Contacto</a></li>
                <li><a href="mailto:hola@dentiqly.com" className="hover:text-[#2563FF] transition-colors">hola@dentiqly.com</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Dentiqly. Todos los derechos reservados.</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-gray-600 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Términos</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
