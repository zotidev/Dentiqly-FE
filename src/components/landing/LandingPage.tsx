import React from 'react';
import { dentalColors } from '../../config/colors';
import { CheckCircle2, PlayCircle, Users, Globe, Activity, Calendar, Shield, Settings, Menu, X, ClipboardList, Receipt, BarChart3, Package, Bell, Lock, Zap, HeartHandshake, Star, ArrowRight, Facebook, Twitter, Instagram, Linkedin, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-[#0A0F2D]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              <img src="/assets/dentiqly-logo.png" alt="Dentiqly" className="h-10 w-auto" />
            </div>

            <div className="hidden md:flex space-x-8">
              <a href="#producto" className="text-sm font-medium text-gray-600 hover:text-[#2563FF] transition-colors">Producto</a>
              <a href="#funcionalidades" className="text-sm font-medium text-gray-600 hover:text-[#2563FF] transition-colors">Funcionalidades</a>
              <a href="#precios" className="text-sm font-medium text-gray-600 hover:text-[#2563FF] transition-colors">Precios</a>
              <a href="#recursos" className="text-sm font-medium text-gray-600 hover:text-[#2563FF] transition-colors">Recursos</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-[#2563FF] transition-colors">Ingresar</Link>
              <Link to="/register" className="bg-[#2563FF] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1D4ED8] transition-all shadow-md hover:shadow-lg">
                Probar gratis
              </Link>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-20 lg:pt-28 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-[#0A0F2D]">
                El software dental <span className="text-[#2563FF]">todo en uno</span> para clínicas que quieren crecer.
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Dentiqly te ayuda a gestionar tu clínica, tus pacientes y tus tratamientos de forma simple, segura y eficiente.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#2563FF]" />
                  <span className="text-sm font-medium text-gray-700">En la nube</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#2563FF]" />
                  <span className="text-sm font-medium text-gray-700">Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#2563FF]" />
                  <span className="text-sm font-medium text-gray-700">Fácil de usar</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/register" className="bg-[#2563FF] text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-[#1D4ED8] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  Comenzar prueba gratuita
                </Link>
                <button className="bg-white text-[#2563FF] border border-[#E5E7EB] px-8 py-4 rounded-xl text-base font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Ver cómo funciona
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                  <img src="https://i.pravatar.cc/100?img=2" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                  <img src="https://i.pravatar.cc/100?img=3" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#2563FF] flex items-center justify-center text-xs text-white font-bold">+500</div>
                </div>
                <p className="text-sm text-gray-600 font-medium">Más de 500 clínicas ya usan Dentiqly</p>
              </div>
            </div>

            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#2563FF]/20 to-[#02E3FF]/20 rounded-full blur-3xl -z-10"></div>

              {/* Hero Image */}
              <div className="relative z-10 flex justify-center">
                <img src="/assets/hero-tooth.png" alt="Dentiqly Platform" className="w-full max-w-lg object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Nav */}
      <div className="border-y border-gray-100 bg-white sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 gap-8 no-scrollbar justify-start md:justify-center">
            {[
              { name: 'Citas', icon: Calendar },
              { name: 'Pacientes', icon: Users },
              { name: 'Tratamientos', icon: ClipboardList },
              { name: 'Facturación', icon: Receipt },
              { name: 'Reportes', icon: BarChart3 },
              { name: 'Inventario', icon: Package },
              { name: 'Recordatorios', icon: Bell }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <button key={item.name} className={`flex flex-col items-center gap-2 min-w-[80px] group ${i === 0 ? 'text-[#2563FF]' : 'text-gray-500 hover:text-[#2563FF]'}`}>
                  <div className={`p-3 rounded-xl transition-colors ${i === 0 ? 'bg-blue-50 text-[#2563FF]' : 'bg-white text-gray-400 group-hover:bg-gray-50 group-hover:text-[#2563FF]'}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold">{item.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Feature Section */}
      <div className="py-24 bg-[#F4F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-bold text-[#2563FF] uppercase tracking-wider mb-2">Todo lo que tu clínica necesita</p>
              <h2 className="text-4xl font-bold text-[#0A0F2D] mb-6">Gestioná tu clínica desde un solo lugar</h2>
              <p className="text-gray-600 mb-8">
                Dentiqly centraliza todos los procesos de tu clínica para que ahorres tiempo y te enfoques en lo que realmente importa: tus pacientes.
              </p>

              <div className="space-y-8 mb-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                    <Calendar className="h-6 w-6 text-[#2563FF]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0A0F2D] mb-1">Ahorrá tiempo</h3>
                    <p className="text-sm text-gray-600">Automatizá tareas diarias y reducí el trabajo manual.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                    <Users className="h-6 w-6 text-[#2563FF]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0A0F2D] mb-1">Más organización</h3>
                    <p className="text-sm text-gray-600">Toda la información de tu clínica, ordenada y siempre accesible.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                    <Activity className="h-6 w-6 text-[#2563FF]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0A0F2D] mb-1">Tomá mejores decisiones</h3>
                    <p className="text-sm text-gray-600">Reportes claros y métricas en tiempo real para hacer crecer tu clínica.</p>
                  </div>
                </div>
              </div>

              <button className="bg-[#2563FF] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] transition-all shadow-md">
                Explorar funcionalidades
              </button>
            </div>

            <div className="relative">
              {/* Dashboard Mockup Image Placeholder */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-24 bg-[#F4F7FB] rounded-xl animate-pulse"></div>
                    ))}
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="h-40 bg-[#F4F7FB] rounded-xl animate-pulse"></div>
                      <div className="h-32 bg-[#F4F7FB] rounded-xl animate-pulse"></div>
                    </div>
                    <div className="w-1/3 space-y-4">
                      <div className="h-full bg-[#F4F7FB] rounded-xl animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Beneficios / Por qué elegirnos */}
      <div id="funcionalidades" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#0A0F2D] mb-4">Diseñado para la odontología moderna</h2>
            <p className="text-gray-600">Dentiqly está construido con las últimas tecnologías para garantizar que tu clínica opere sin interrupciones, con la máxima seguridad y velocidad.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#F4F7FB] border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                <Lock className="h-7 w-7 text-[#2563FF]" />
              </div>
              <h3 className="text-xl font-bold text-[#0A0F2D] mb-3">Seguridad de grado bancario</h3>
              <p className="text-gray-600">Tus datos y los de tus pacientes están encriptados y respaldados automáticamente todos los días.</p>
            </div>

            <div className="p-8 rounded-2xl bg-[#F4F7FB] border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-[#2563FF]" />
              </div>
              <h3 className="text-xl font-bold text-[#0A0F2D] mb-3">Rendimiento ultrarrápido</h3>
              <p className="text-gray-600">No más tiempos de espera. Dentiqly carga al instante para que no pierdas tiempo entre pacientes.</p>
            </div>

            <div className="p-8 rounded-2xl bg-[#F4F7FB] border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                <HeartHandshake className="h-7 w-7 text-[#2563FF]" />
              </div>
              <h3 className="text-xl font-bold text-[#0A0F2D] mb-3">Soporte humano</h3>
              <p className="text-gray-600">Un equipo de expertos listos para ayudarte en cualquier momento, sin bots ni largas esperas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Pricing */}
      <div id="precios" className="py-24 bg-[#F4F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#0A0F2D] mb-4">Un plan simple, todo incluido</h2>
            <p className="text-gray-600">Sin costos ocultos ni límites engañosos. Accedé a todas las herramientas que necesita tu clínica por un único valor mensual.</p>
          </div>

          <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 bg-[#0A0F2D] text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#2563FF] rounded-full blur-2xl opacity-50"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Plan Pro</h3>
              <div className="flex justify-center items-end gap-1 text-white mb-4">
                <span className="text-2xl font-bold">$</span>
                <span className="text-6xl font-extrabold tracking-tight">80.000</span>
                <span className="text-blue-200 mb-2">ARS/mes</span>
              </div>
              <p className="text-blue-100 text-sm">Ideal para clínicas en crecimiento</p>
            </div>
            <div className="p-8">
              <ul className="space-y-4 mb-8">
                {['Usuarios y profesionales ilimitados', 'Gestión de turnos y agenda online', 'Historias clínicas y odontogramas', 'Facturación y control de caja', 'Recordatorios automáticos por WhatsApp', 'Soporte prioritario 24/7'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#10B981] shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="w-full bg-[#2563FF] text-white px-6 py-4 rounded-xl text-base font-bold hover:bg-[#1D4ED8] transition-all shadow-md flex justify-center items-center gap-2">
                Comenzar ahora <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Testimonials */}
      <div className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#0A0F2D] mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-gray-600">Clínicas de todo el país confían en Dentiqly para su gestión diaria.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Dra. Sofía Martínez', role: 'Directora, Sonrisas Clinic', text: 'Dentiqly nos cambió la vida. Redujimos el ausentismo un 40% gracias a los recordatorios de WhatsApp.' },
              { name: 'Dr. Carlos López', role: 'Odontólogo Independiente', text: 'El odontograma digital es increíblemente intuitivo. Puedo armar presupuestos en segundos frente al paciente.' },
              { name: 'Lic. Ana Gómez', role: 'Administradora, Dental Center', text: 'La facturación y el control de caja pasaron de ser un dolor de cabeza a algo que se hace solo. 100% recomendado.' }
            ].map((testimonial, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex text-yellow-400 mb-4">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-bold text-[#0A0F2D] text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563FF] to-[#02E3FF] opacity-10"></div>
          <div className="bg-[#2563FF] rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
            <h2 className="text-3xl font-bold mb-4">¿Listo para llevar tu clínica al siguiente nivel?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
              Comenzá hoy mismo y descubrí cómo Dentiqly puede ayudarte a crecer y organizar tu clínica.
            </p>
            <Link to="/register" className="bg-white text-[#2563FF] px-8 py-4 rounded-xl text-base font-bold hover:bg-blue-50 transition-all shadow-lg flex items-center justify-center gap-2 mx-auto">
              Probar gratis ahora <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0A0F2D] text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <img src="/assets/dentiqly-logo.png" alt="Dentiqly" className="h-10 w-auto mb-6 brightness-0 invert" />
              <p className="text-gray-400 text-sm mb-6">El software dental todo en uno diseñado para clínicas modernas que buscan eficiencia y crecimiento.</p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Producto</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#02E3FF] transition-colors">Funcionalidades</a></li>
                <li><a href="#precios" className="hover:text-[#02E3FF] transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-[#02E3FF] transition-colors">Casos de Éxito</a></li>
                <li><a href="#" className="hover:text-[#02E3FF] transition-colors">Actualizaciones</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Recursos</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#02E3FF] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#02E3FF] transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-[#02E3FF] transition-colors">Tutoriales</a></li>
                <li><a href="#" className="hover:text-[#02E3FF] transition-colors">Guías Descargables</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="mailto:hola@dentiqly.com" className="hover:text-[#02E3FF] transition-colors">hola@dentiqly.com</a></li>
                <li><a href="#" className="hover:text-[#02E3FF] transition-colors">+54 9 11 1234-5678</a></li>
                <li>Buenos Aires, Argentina</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Dentiqly. Todos los derechos reservados.</p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
              <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
