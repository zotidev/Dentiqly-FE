import React, { useEffect, useState } from 'react';
import { 
  Filter, Download, Plus, ArrowDownRight, ArrowUpRight, 
  Users, TrendingUp, TrendingDown, CheckCircle2, AlertCircle, 
  Settings2, Clock, Stethoscope, Copy, Check, X, Link2 
} from 'lucide-react';
import { turnosApi, profesionalesApi, serviciosApi, pacientesApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import type { Turno } from '../../types';

interface DashboardStats {
  totalTurnos: number;
  turnosHoy: number;
  totalProfesionales: number;
  totalServicios: number;
  totalPacientes: number;
  turnosPorEstado: Record<string, number>;
  turnosRecientes: Turno[];
  turnosPorProf: Record<string, number>;
  appointmentTrend: { fecha: string; count: number }[];
}

export const Dashboard: React.FC<{ 
  onNavigateToCalendar?: () => void,
  slug?: string
}> = ({ onNavigateToCalendar, slug }) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [hideBanner, setHideBanner] = useState(false);
  const bookingUrl = slug ? `${window.location.origin}/booking/${slug}` : '';

  const [stats, setStats] = useState<DashboardStats>({
    totalTurnos: 0, turnosHoy: 0, totalProfesionales: 0, 
    totalServicios: 0, totalPacientes: 0, turnosPorEstado: {},
    turnosRecientes: [], turnosPorProf: {}, appointmentTrend: []
  });
  const [loading, setLoading] = useState(true);

  const handleCopyLink = () => {
    if (!bookingUrl) return;
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const desde = new Date();
        desde.setDate(desde.getDate() - 30);
        const hasta = new Date();
        hasta.setDate(hasta.getDate() + 90);

        const [turnosRes, profRes, servRes, pacRes] = await Promise.all([
          turnosApi.listar({
            limit: 5000,
            fecha_desde: desde.toISOString().split('T')[0],
            fecha_hasta: hasta.toISOString().split('T')[0]
          }).catch(() => ({ data: [] })),
          profesionalesApi.listar({ estado: 'Activo', limit: 100 }).catch(() => ({ data: [] })),
          serviciosApi.listar().catch(() => ({ data: [] })),
          pacientesApi.listar({ limit: 5000 }).catch(() => ({ data: [] }))
        ]);

        const turnos = turnosRes.data || [];
        const profesionales = profRes.data || [];
        const pacientes = pacRes.data || [];

        const today = new Date().toISOString().split('T')[0];
        const turnosHoy = turnos.filter(turno => turno.fecha === today).length;

        const turnosPorEstado: Record<string, number> = {};
        turnos.forEach(turno => {
          turnosPorEstado[turno.estado] = (turnosPorEstado[turno.estado] || 0) + 1;
        });

        const turnosRecientes = [...turnos]
          .sort((a, b) => {
            const dateComparison = b.fecha.localeCompare(a.fecha);
            if (dateComparison !== 0) return dateComparison;
            return b.hora_inicio.localeCompare(a.hora_inicio);
          })
          .slice(0, 6);

        const appointmentTrend: { fecha: string; count: number }[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const count = turnos.filter(t => t.fecha === dateStr).length;
          appointmentTrend.push({ fecha: dateStr, count });
        }

        setStats({
          totalTurnos: turnos.length,
          turnosHoy,
          totalProfesionales: profesionales.length,
          totalServicios: servRes.data?.length || 0,
          totalPacientes: pacientes.length,
          turnosPorEstado,
          turnosRecientes,
          turnosPorProf: {},
          appointmentTrend
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563FF]"></div>
      </div>
    );
  }

  const maxTrendValue = Math.max(...stats.appointmentTrend.map(d => d.count), 1);

  return (
    <div className="bg-[#f0f2f5] min-h-screen p-4 sm:p-8 rounded-3xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">¡Hola de nuevo, {user?.nombre || 'Doc'}!</h1>
          <p className="text-gray-500 mt-1">Controla los turnos, pacientes y rendimiento de tu clínica.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition shadow-sm">
            <Filter className="w-4 h-4" /> Filtros
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition shadow-sm">
            <Download className="w-4 h-4" /> Exportar
          </button>
          <button onClick={onNavigateToCalendar} className="flex items-center gap-2 px-6 py-2 bg-[#2563FF] text-white rounded-full font-medium hover:bg-blue-700 transition shadow-md shadow-blue-500/20">
            <Plus className="w-4 h-4" /> Nuevo Turno
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Resumen */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-[340px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Resumen</h2>
              <p className="text-sm text-gray-400">Rendimiento de turnos.</p>
            </div>
            <select className="bg-gray-50 border-none text-sm font-medium text-gray-700 rounded-full px-4 py-2 outline-none cursor-pointer">
              <option>Semanal</option>
              <option>Mensual</option>
            </select>
          </div>
          
          <div className="flex gap-8 mb-8">
            <div>
              <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1">
                <ArrowDownRight className="w-3 h-3 text-red-500" /> Turnos Totales
              </p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTurnos}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1">
                <ArrowUpRight className="w-3 h-3 text-green-500" /> Atendidos
              </p>
              <p className="text-3xl font-bold text-gray-900">{stats.turnosPorEstado['Atendido'] || 0}</p>
            </div>
          </div>

          {/* Custom Bar Chart */}
          <div className="mt-auto h-32 flex items-end justify-between gap-3 pt-4 border-t border-gray-50">
            {stats.appointmentTrend.map((day, idx) => (
               <div key={idx} className="w-full bg-[#f4f7fb] rounded-t-lg relative group overflow-hidden" style={{ height: '100%' }}>
                 <div 
                   className="absolute bottom-0 w-full bg-[#2563FF] rounded-t-lg transition-all duration-700 ease-out" 
                   style={{ height: `${(day.count / maxTrendValue) * 100}%` }}
                   title={`${day.count} turnos el ${day.fecha}`}
                 ></div>
               </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-[340px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Actividad</h2>
              <p className="text-sm text-gray-400">Métricas clave de la clínica.</p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition"><Settings2 className="w-4 h-4 text-gray-600" /></button>
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition"><ArrowUpRight className="w-4 h-4 text-gray-600" /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            {/* Card 1 */}
            <div className="bg-[#f8f9fa] rounded-2xl p-5 border border-gray-100 flex flex-col justify-between">
              <div>
                 <p className="text-sm font-bold text-gray-700 flex items-center gap-2"><Users className="w-4 h-4" /> Pacientes Activos</p>
                 <p className="text-2xl font-bold text-gray-900 mt-4">{stats.totalPacientes}</p>
                 <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12.5% vs mes ant.</p>
              </div>
              <svg className="w-full h-12 mt-4 opacity-50" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0,20 Q10,5 20,25 T40,15 T60,25 T80,5 T100,20" fill="none" stroke="#2563FF" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            {/* Card 2 */}
            <div className="bg-[#f8f9fa] rounded-2xl p-5 border border-gray-100 flex flex-col justify-between">
              <div>
                 <p className="text-sm font-bold text-gray-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Completados</p>
                 <p className="text-2xl font-bold text-gray-900 mt-4">{stats.turnosPorEstado['Atendido'] || 0}</p>
                 <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +5.2% vs mes ant.</p>
              </div>
              <svg className="w-full h-12 mt-4 opacity-50" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0,25 Q15,10 30,20 T60,10 T80,25 T100,5" fill="none" stroke="#2563FF" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            {/* Card 3 (Dark Mode) */}
            <div className="bg-[#0A0F2D] rounded-2xl p-5 border border-[#1a1f3d] flex flex-col justify-between text-white shadow-lg">
              <div>
                 <p className="text-sm font-bold text-gray-300 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-[#02E3FF]" /> Ausencias</p>
                 <p className="text-2xl font-bold text-white mt-4">{stats.turnosPorEstado['Ausente'] || 0}</p>
                 <p className="text-xs text-red-400 font-bold mt-1 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> -2.4% vs mes ant.</p>
              </div>
              <svg className="w-full h-12 mt-4 opacity-80" viewBox="0 0 100 30" preserveAspectRatio="none">
                 <path d="M0,5 Q20,25 40,10 T70,25 T100,15" fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Small Cards Left */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl p-6 flex flex-col justify-center border border-gray-100 shadow-sm">
               <p className="text-sm text-gray-500 font-medium flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-blue-500" /> Turnos Hoy</p>
               <p className="text-3xl font-bold text-gray-900">{stats.turnosHoy}</p>
            </div>
            <div className="bg-white rounded-3xl p-6 flex flex-col justify-center border border-gray-100 shadow-sm">
               <p className="text-sm text-gray-500 font-medium flex items-center gap-2 mb-2"><Stethoscope className="w-4 h-4 text-teal-500" /> Profesionales</p>
               <p className="text-3xl font-bold text-gray-900">{stats.totalProfesionales}</p>
            </div>
          </div>

          {!hideBanner && (
            <div className="bg-[#2563FF] text-white rounded-3xl p-6 flex justify-between items-center shadow-lg relative overflow-hidden h-[120px]">
               <div className="z-10 relative">
                 <h3 className="text-lg font-bold text-white w-4/5 leading-tight">Comparte tu portal de reservas automático</h3>
                 <button onClick={handleCopyLink} className="mt-3 text-sm font-bold text-blue-100 hover:text-white flex items-center gap-1.5 transition-colors bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
                   {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? '¡Copiado!' : 'Copiar enlace'}
                 </button>
               </div>
               <button onClick={() => setHideBanner(true)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition z-10 absolute top-4 right-4">
                 <X className="w-4 h-4 text-white" />
               </button>
               <div className="absolute right-[-20px] bottom-[-30px] opacity-20 pointer-events-none">
                 <Link2 className="w-32 h-32 text-white transform rotate-12" />
               </div>
            </div>
          )}
        </div>

        {/* Transactions History Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Próximos Turnos</h2>
              <p className="text-sm text-gray-400">Movimientos y citas recientes.</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition">
              <Settings2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">Paciente</th>
                  <th className="pb-3 font-medium">Servicio</th>
                  <th className="pb-3 font-medium">Estado</th>
                  <th className="pb-3 font-medium">Fecha</th>
                  <th className="pb-3 font-medium text-right">Hora</th>
                </tr>
              </thead>
              <tbody>
                {stats.turnosRecientes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No hay turnos registrados</td>
                  </tr>
                ) : (
                  stats.turnosRecientes.map((turno) => (
                    <tr key={turno.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2563FF] flex items-center justify-center font-bold text-xs shrink-0">
                            {turno.paciente?.nombre?.charAt(0)}{turno.paciente?.apellido?.charAt(0)}
                          </div>
                          <span className="font-bold text-gray-900 truncate max-w-[120px]">{turno.paciente?.nombre} {turno.paciente?.apellido}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-500 font-medium">{turno.servicio?.nombre || 'General'}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          turno.estado === 'Atendido' ? 'bg-green-100 text-green-700' :
                          turno.estado === 'Confirmado' ? 'bg-[#2563FF]/10 text-[#2563FF]' :
                          turno.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                          turno.estado === 'Ausente' ? 'bg-gray-800 text-white' :
                          'bg-red-100 text-red-700'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {turno.estado}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600 font-medium">{new Date(turno.fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</td>
                      <td className="py-3 text-right text-gray-900 font-bold">{turno.hora_inicio}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};