import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { dentalColors } from '../../config/colors';
import { Shield, CheckCircle2, ArrowRight, Building2, User, Mail, Lock, Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre_clinica: '',
    nombre_admin: '',
    email_admin: '',
    password: '',
    telefono: '',
    web_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await register(formData);
      toast({
        title: "¡Bienvenido a Dentiqly!",
        description: "Tu clínica ha sido registrada exitosamente. Ya puedes empezar a trabajar.",
      });
      if (response.tenant?.slug) {
        navigate(`/${response.tenant.slug}/admin`);
      } else {
        navigate('/admin');
      }
    } catch (error: any) {
      toast({
        title: "Error al registrarse",
        description: error.message || "Ocurrió un problema durante el registro. Revisa los datos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-stretch bg-white">
      {/* Lado Izquierdo: Información/Marketing */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A0F2D] relative overflow-hidden flex-col justify-center px-16">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        
        <div className="relative z-10">
          <Link to="/">
            <img src="/assets/dentiqly-logo.png" alt="Dentiqly" className="h-12 w-auto mb-12 brightness-0 invert" />
          </Link>
          
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Comienza tu transformación digital con Dentiqly
          </h2>
          
          <div className="space-y-6 mb-12">
            {[
              'Activación en minutos tras suscripción',
              'Setup automático de servicios y configuración',
              'Migración simple de datos',
              'Soporte prioritario durante el onboarding'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-blue-100">
                <CheckCircle2 className="h-6 w-6 text-[#02E3FF]" />
                <span className="text-lg">{text}</span>
              </div>
            ))}
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex gap-4 items-center mb-4">
              <div className="p-3 bg-[#2563FF] rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <p className="text-white font-bold text-lg italic">"Dentiqly nos permitió crecer un 30% en los primeros 6 meses."</p>
            </div>
            <p className="text-blue-200 text-sm">- Dra. Claudia Ruiz, Dental Care</p>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <img src="/assets/dentiqly-logo.png" alt="Dentiqly" className="h-10 w-auto" />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Crear nueva clínica</h1>
            <p className="text-gray-500 font-medium text-sm">Configura tu espacio de trabajo en segundos.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Clínica</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="nombre_clinica"
                    required
                    value={formData.nombre_clinica}
                    onChange={handleChange}
                    className="block w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563FF] focus:border-[#2563FF] transition-all"
                    placeholder="Ej: Clínica Dental"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Administrador</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="nombre_admin"
                    required
                    value={formData.nombre_admin}
                    onChange={handleChange}
                    className="block w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563FF] focus:border-[#2563FF] transition-all"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Teléfono de contacto</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="block w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563FF] focus:border-[#2563FF] transition-all"
                    placeholder="+54 11 ..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">URL / Web</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    name="web_url"
                    value={formData.web_url}
                    onChange={handleChange}
                    className="block w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563FF] focus:border-[#2563FF] transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Email profesional</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email_admin"
                  required
                  value={formData.email_admin}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563FF] focus:border-[#2563FF] transition-all"
                  placeholder="ejemplo@clinica.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563FF] focus:border-[#2563FF] transition-all"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2563FF] text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-[#1D4ED8] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creando tu clínica...
                  </>
                ) : (
                  <>
                    Comenzar prueba gratuita
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Al registrarte, aceptas nuestros{' '}
              <a href="#" className="text-[#2563FF] hover:underline font-semibold">Términos de Servicio</a> y{' '}
              <a href="#" className="text-[#2563FF] hover:underline font-semibold">Política de Privacidad</a>.
            </p>

            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="text-[#2563FF] font-bold hover:underline">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
