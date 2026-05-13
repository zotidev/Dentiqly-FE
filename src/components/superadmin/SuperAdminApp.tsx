import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Building, Activity, DollarSign, LogOut, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../lib/api-client';
import { useToast } from '../../hooks/use-toast';

interface ClinicData {
  id: string;
  nombre: string;
  slug: string;
  plan: string;
  subscription_status: string;
  activo: boolean;
  createdAt: string;
  usuarios?: { id: string, nombre: string, email: string }[];
}

interface SuperAdminStats {
  totalClinics: number;
  activeClinics: number;
  pendingClinics: number;
  totalUsers: number;
}

export const SuperAdminApp: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [clinics, setClinics] = useState<ClinicData[]>([]);
  const [stats, setStats] = useState<SuperAdminStats>({
    totalClinics: 0, activeClinics: 0, pendingClinics: 0, totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchClinics = async () => {
    try {
      const response = await apiClient.get<{clinicas: ClinicData[], stats: SuperAdminStats}>('/superadmin/clinics');
      setClinics(response.clinicas);
      setStats(response.stats);
    } catch (error) {
      console.error('Error fetching clinics:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las clínicas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!window.confirm(`¿Estás seguro de cambiar el estado a ${newStatus}?`)) return;
    
    setUpdating(id);
    try {
      await apiClient.put(`/superadmin/clinics/${id}/status`, { status: newStatus });
      toast({
        title: "Estado actualizado",
        description: "La clínica ha sido actualizada correctamente."
      });
      fetchClinics(); // Refresh data
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado.",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  // Frontend role check - Permitimos explícitamente al dueño (riostiziano6@gmail.com)
  const isSuperAdmin = !((user as any)?.clinica_id || user?.clinicaId) || user?.email === 'riostiziano6@gmail.com';

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
        <ShieldAlert className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-bold text-gray-900">Acceso Denegado</h1>
        <p className="text-gray-500">Esta área es exclusiva para los administradores de la plataforma.</p>
        <button onClick={logout} className="px-4 py-2 bg-[#2563FF] text-white rounded-lg font-medium">Volver</button>
      </div>
    );
  }

  const filteredClinics = clinics.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar SuperAdmin */}
      <div className="w-64 bg-[#0A0F2D] text-white flex flex-col h-screen fixed">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-dental-secondary" />
          <div>
            <h1 className="font-bold text-xl">Dentiqly</h1>
            <p className="text-xs text-blue-200 uppercase tracking-widest">SuperAdmin</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl text-white font-medium">
            <Building className="w-5 h-5 text-blue-400" /> Clínicas
          </a>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="mb-4">
            <p className="text-sm font-medium text-white">{user?.nombre}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-white hover:bg-red-500 border border-red-400/30 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Panel de Control General</h2>
          <p className="text-gray-500">Gestión de todos los tenants (clínicas) de la plataforma.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium mb-2">Clínicas Registradas</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-gray-900">{stats.totalClinics}</p>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium mb-2">Suscripciones Activas</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-green-600">{stats.activeClinics}</p>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium mb-2">Pendientes de Pago</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-amber-600">{stats.pendingClinics}</p>
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium mb-2">Usuarios Totales</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900">Listado de Clínicas</h3>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar clínica..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563FF] focus:border-[#2563FF] outline-none text-sm w-64"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-semibold text-gray-600 text-sm">Clínica</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Admin / Email</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Registro</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Estado Actual</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm text-right">Acciones (Suscripción)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500"><Activity className="w-6 h-6 animate-spin mx-auto mb-2" /> Cargando...</td></tr>
                ) : filteredClinics.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">No se encontraron clínicas.</td></tr>
                ) : (
                  filteredClinics.map(clinic => {
                    const admin = clinic.usuarios?.[0];
                    return (
                      <tr key={clinic.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-gray-900">{clinic.nombre}</p>
                          <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded inline-block mt-1">/{clinic.slug}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-medium text-gray-800">{admin?.nombre || 'Sin Admin'}</p>
                          <p className="text-xs text-gray-500">{admin?.email || 'N/A'}</p>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {new Date(clinic.createdAt).toLocaleDateString('es-AR')}
                        </td>
                        <td className="p-4">
                          {clinic.subscription_status === 'active' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700"><CheckCircle className="w-3.5 h-3.5" /> Activa</span>}
                          {clinic.subscription_status === 'pending_payment' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700"><Clock className="w-3.5 h-3.5" /> Pago Pend.</span>}
                          {clinic.subscription_status === 'suspended' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700"><XCircle className="w-3.5 h-3.5" /> Suspendida</span>}
                          {clinic.subscription_status === 'trialing' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700"><Activity className="w-3.5 h-3.5" /> Trial</span>}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <select 
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-[#2563FF]"
                            value=""
                            onChange={(e) => handleUpdateStatus(clinic.id, e.target.value)}
                            disabled={updating === clinic.id}
                          >
                            <option value="" disabled>Cambiar a...</option>
                            <option value="active">Activar Suscripción</option>
                            <option value="pending_payment">Marcar Pago Pend.</option>
                            <option value="suspended">Suspender Cuenta</option>
                          </select>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


