import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { dentalColors } from '../../config/colors';
import { Shield, ArrowRight, User, Lock, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData);
      toast({
        title: "¡Bienvenido de nuevo!",
        description: "Sesión iniciada correctamente.",
      });
      navigate('/admin');
    } catch (error: any) {
      toast({
        title: "Error de acceso",
        description: error.response?.data?.error || "Credenciales incorrectas. Intenta de nuevo.",
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
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <img src="/assets/dentiqly-logo.png" alt="Dentiqly" className="h-12 w-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-extrabold text-[#0A0F2D]">Bienvenido</h1>
          <p className="text-gray-500 font-medium mt-2">Ingresa tus credenciales para acceder</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#2563FF] focus:bg-white transition-all text-gray-900"
                    placeholder="ejemplo@clinica.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700">Contraseña</label>
                  <a href="#" className="text-xs font-semibold text-[#2563FF] hover:underline">¿Olvidaste tu contraseña?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#2563FF] focus:bg-white transition-all text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2563FF] text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-[#1D4ED8] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Ingresar al sistema
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-[#2563FF] font-bold hover:underline">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-sm">
          <Shield className="h-4 w-4" />
          <span>Conexión segura y encriptada</span>
        </div>
      </div>
    </div>
  );
};
