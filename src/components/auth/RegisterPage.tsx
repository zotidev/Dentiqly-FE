import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Shield, CheckCircle2, ArrowRight, Building2, User, Mail, Lock, Loader2, Phone, Globe } from 'lucide-react';
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
        title: "Bienvenido a Dentiqly!",
        description: "Tu clinica ha sido registrada exitosamente. Ya puedes empezar a trabajar.",
      });
      if (response.tenant?.slug) {
        navigate(`/${response.tenant.slug}/admin`);
      } else {
        navigate('/admin');
      }
    } catch (error: any) {
      toast({
        title: "Error al registrarse",
        description: error.message || "Ocurrio un problema durante el registro. Revisa los datos.",
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
    <div className="min-h-screen flex items-stretch">
      {/* Left — Dark branding panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0B1023] relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-[20%] -right-[20%] w-[60%] h-[60%] bg-[#2563FF]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-[#02E3FF]/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
          <Link to="/">
            <img src="/assets/dentiqly-logo.png" alt="Dentiqly" className="h-10 w-auto brightness-0 invert" />
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Comienza tu transformacion digital con Dentiqly
          </h2>
          <p className="text-white/40 text-lg leading-relaxed mb-10">
            Configura tu clinica en minutos y comienza a gestionar pacientes, turnos y facturacion desde el dia uno.
          </p>

          <div className="space-y-4">
            {[
              'Activacion en minutos tras suscripcion',
              'Setup automatico de servicios y configuracion',
              'Migracion simple de datos',
              'Soporte prioritario durante el onboarding',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#02E3FF]/15 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#02E3FF]" />
                </div>
                <span className="text-white/60 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="p-5 bg-white/[0.04] rounded-2xl border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-[#02E3FF]" />
              <span className="text-white/80 text-sm font-bold">Seguridad empresarial</span>
            </div>
            <p className="text-white/40 text-sm">
              Tus datos protegidos con encriptacion AES-256. Copias de seguridad automaticas cada hora.
            </p>
          </div>
        </div>
      </div>

      {/* Right — Registration form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-12 bg-[#FAFCFF]">
        <div className="w-full max-w-lg">
          <div className="lg:hidden mb-8">
            <Link to="/">
              <img src="/assets/dentiqly-logo.png" alt="Dentiqly" className="h-10 w-auto" />
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-[#0B1023] mb-1">Crear nueva clinica</h1>
            <p className="text-[#8A93A8] font-medium text-sm">Configura tu espacio de trabajo en segundos.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B1023] mb-1.5 uppercase tracking-wider">Clinica</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-4 w-4 text-[#8A93A8]" />
                    </div>
                    <input
                      type="text"
                      name="nombre_clinica"
                      required
                      value={formData.nombre_clinica}
                      onChange={handleChange}
                      className="block w-full pl-9 pr-3 py-3 text-sm bg-[#F7F8FA] border border-transparent rounded-xl focus:ring-2 focus:ring-[#2563FF]/20 focus:border-[#2563FF] focus:bg-white transition-all text-[#0B1023]"
                      placeholder="Ej: Clinica Dental"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1023] mb-1.5 uppercase tracking-wider">Administrador</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-[#8A93A8]" />
                    </div>
                    <input
                      type="text"
                      name="nombre_admin"
                      required
                      value={formData.nombre_admin}
                      onChange={handleChange}
                      className="block w-full pl-9 pr-3 py-3 text-sm bg-[#F7F8FA] border border-transparent rounded-xl focus:ring-2 focus:ring-[#2563FF]/20 focus:border-[#2563FF] focus:bg-white transition-all text-[#0B1023]"
                      placeholder="Tu nombre"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B1023] mb-1.5 uppercase tracking-wider">Telefono</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-[#8A93A8]" />
                    </div>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="block w-full pl-9 pr-3 py-3 text-sm bg-[#F7F8FA] border border-transparent rounded-xl focus:ring-2 focus:ring-[#2563FF]/20 focus:border-[#2563FF] focus:bg-white transition-all text-[#0B1023]"
                      placeholder="+54 11 ..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1023] mb-1.5 uppercase tracking-wider">URL / Web</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-4 w-4 text-[#8A93A8]" />
                    </div>
                    <input
                      type="url"
                      name="web_url"
                      value={formData.web_url}
                      onChange={handleChange}
                      className="block w-full pl-9 pr-3 py-3 text-sm bg-[#F7F8FA] border border-transparent rounded-xl focus:ring-2 focus:ring-[#2563FF]/20 focus:border-[#2563FF] focus:bg-white transition-all text-[#0B1023]"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1023] mb-1.5 uppercase tracking-wider">Email profesional</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-[#8A93A8]" />
                  </div>
                  <input
                    type="email"
                    name="email_admin"
                    required
                    value={formData.email_admin}
                    onChange={handleChange}
                    className="block w-full pl-9 pr-3 py-3 text-sm bg-[#F7F8FA] border border-transparent rounded-xl focus:ring-2 focus:ring-[#2563FF]/20 focus:border-[#2563FF] focus:bg-white transition-all text-[#0B1023]"
                    placeholder="ejemplo@clinica.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1023] mb-1.5 uppercase tracking-wider">Contrasena</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[#8A93A8]" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-9 pr-3 py-3 text-sm bg-[#F7F8FA] border border-transparent rounded-xl focus:ring-2 focus:ring-[#2563FF]/20 focus:border-[#2563FF] focus:bg-white transition-all text-[#0B1023]"
                    placeholder="Minimo 6 caracteres"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2563FF] text-white py-3.5 px-6 rounded-xl font-bold text-sm hover:bg-[#1D4ED8] transition-all shadow-[0_8px_20px_rgba(37,99,255,0.25)] hover:shadow-[0_12px_30px_rgba(37,99,255,0.35)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      Creando tu clinica...
                    </>
                  ) : (
                    <>
                      Crear mi clínica
                      <ArrowRight className="h-4.5 w-4.5" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-[#8A93A8] mt-4">
                Al registrarte, aceptas nuestros{' '}
                <Link to="/terminos" className="text-[#2563FF] hover:text-[#1D4ED8] font-semibold transition-colors">Terminos de Servicio</Link> y{' '}
                <Link to="/privacidad" className="text-[#2563FF] hover:text-[#1D4ED8] font-semibold transition-colors">Politica de Privacidad</Link>.
              </p>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#8A93A8]">
              Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-[#2563FF] font-bold hover:text-[#1D4ED8] transition-colors">
                Inicia sesion aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
