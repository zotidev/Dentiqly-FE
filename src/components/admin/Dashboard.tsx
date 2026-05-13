import React, { useEffect, useState } from 'react';
import {
  Plus, ArrowUpRight, ArrowDownRight,
  Users, TrendingUp, TrendingDown, CheckCircle2, AlertCircle,
  Clock, Stethoscope, Copy, Check, X, Link2,
  CalendarDays, Activity, Zap, BarChart3, ArrowRight,
  Sparkles, UserPlus, ClipboardList
} from 'lucide-react';
import { turnosApi, profesionalesApi, serviciosApi, pacientesApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/use-toast';
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

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
};

const StatCard: React.FC<{
  label: string;
  value: number;
  icon: React.ElementType;
  trend?: { value: string; positive: boolean };
  gradient: string;
  iconColor: string;
  delay?: number;
}> = ({ label, value, icon: Icon, trend, gradient, iconColor, delay = 0 }) => (
  <div
    className="relative bg-white rounded-2xl p-5 border border-gray-100/80 shadow-card card-hover overflow-hidden group"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.04] pointer-events-none">
      <Icon className="w-full h-full" />
    </div>
    <div className={`w-10 h-10 rounded-xl ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <p className="text-[13px] font-medium text-gray-500 mb-1">{label}</p>
    <p className="text-3xl font-extrabold text-gray-900 tracking-tight animate-count-up">{value}</p>
    {trend && (
      <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trend.positive ? 'text-emerald-600' : 'text-red-500'}`}>
        {trend.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        {trend.value}
      </div>
    )}
  </div>
);

export const Dashboard: React.FC<{
  onNavigateToCalendar?: () => void,
  slug?: string
}> = ({ onNavigateToCalendar, slug }) => {
  const { user } = useAuth();
  const { toast } = useToast();
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
    toast({ title: "Enlace copiado", description: "El link de reservas fue copiado al portapapeles." });
    setTimeout(() => setCopied(false), 2000);
  };

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

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateStatus = async (id: number, nuevoEstado: string) => {
    try {
      await turnosApi.actualizar(id, { estado: nuevoEstado });
      toast({
        title: nuevoEstado === 'Confirmado' ? "Turno Confirmado" : "Turno Cancelado",
        description: "El estado del turno se ha actualizado correctamente.",
      });
      fetchStats();
    } catch (e: any) {
      console.error('Error al actualizar estado:', e);
      toast({
        title: "Error",
        description: e.response?.data?.error || "No se pudo actualizar el estado del turno.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl gradient-primary animate-pulse-soft flex items-center justify-center shadow-blue-glow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const maxTrendValue = Math.max(...stats.appointmentTrend.map(d => d.count), 1);
  const atendidos = stats.turnosPorEstado['Atendido'] || 0;
  const pendientes = stats.turnosPorEstado['Pendiente'] || 0;
  const ausentes = stats.turnosPorEstado['Ausente'] || 0;
  const confirmados = stats.turnosPorEstado['Confirmado'] || 0;

  return (
    <div className="min-h-screen font-sans">
      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in">
        <div>
          <p className="text-sm font-medium text-blue-500 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {getGreeting()}
          </p>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
            {user?.nombre || 'Doc'}, acá está tu resumen
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Controlá los turnos, pacientes y rendimiento de tu clínica.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onNavigateToCalendar}
            className="flex items-center gap-2 px-5 py-2.5 gradient-primary text-white rounded-xl font-semibold text-sm hover:shadow-blue-glow transition-all duration-300 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Nuevo Turno
          </button>
        </div>
      </div>

      {/* ═══ STAT CARDS ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <StatCard
          label="Turnos Hoy"
          value={stats.turnosHoy}
          icon={CalendarDays}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          iconColor="text-white"
          delay={0}
        />
        <StatCard
          label="Pacientes"
          value={stats.totalPacientes}
          icon={Users}
          trend={{ value: '+12.5% vs mes ant.', positive: true }}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          iconColor="text-white"
          delay={60}
        />
        <StatCard
          label="Profesionales"
          value={stats.totalProfesionales}
          icon={Stethoscope}
          gradient="bg-gradient-to-br from-violet-500 to-violet-600"
          iconColor="text-white"
          delay={120}
        />
        <StatCard
          label="Servicios"
          value={stats.totalServicios}
          icon={ClipboardList}
          gradient="bg-gradient-to-br from-amber-500 to-amber-600"
          iconColor="text-white"
          delay={180}
        />
      </div>

      {/* ═══ MAIN GRID ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

        {/* Chart Section */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-card border border-gray-100/80 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-4.5 h-4.5 text-blue-500" />
                Tendencia de Turnos
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Últimos 7 días</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-gray-500 font-medium">Turnos</span>
              </div>
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 lg:gap-3 pt-4">
            {stats.appointmentTrend.map((day, idx) => {
              const height = Math.max((day.count / maxTrendValue) * 100, 4);
              const dayName = new Date(day.fecha + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short' });
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-xs font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.count}
                  </span>
                  <div className="w-full relative" style={{ height: '100%' }}>
                    <div className="absolute bottom-0 w-full rounded-xl bg-gray-100/80 h-full" />
                    <div
                      className="absolute bottom-0 w-full rounded-xl bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-700 ease-out group-hover:from-blue-700 group-hover:to-blue-500"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 uppercase">{dayName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-card border border-gray-100/80 animate-fade-in" style={{ animationDelay: '260ms' }}>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-6">
            <Activity className="w-4.5 h-4.5 text-blue-500" />
            Estado de Turnos
          </h2>

          <div className="space-y-4">
            {[
              { label: 'Atendidos', count: atendidos, color: 'bg-emerald-500', textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
              { label: 'Confirmados', count: confirmados, color: 'bg-blue-500', textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
              { label: 'Pendientes', count: pendientes, color: 'bg-amber-500', textColor: 'text-amber-600', bgColor: 'bg-amber-50' },
              { label: 'Ausentes', count: ausentes, color: 'bg-red-500', textColor: 'text-red-600', bgColor: 'bg-red-50' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 group">
                <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className={`text-sm font-bold ${item.textColor}`}>{item.count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${stats.totalTurnos > 0 ? (item.count / stats.totalTurnos) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total de Turnos</span>
              <span className="text-2xl font-extrabold text-gray-900">{stats.totalTurnos}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ LOWER SECTION ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Booking CTA + Quick Actions */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {!hideBanner && (
            <div className="relative overflow-hidden rounded-2xl gradient-card-blue p-6 text-white shadow-blue-glow animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="160" cy="40" r="60" fill="white" opacity="0.1" />
                  <circle cx="180" cy="160" r="40" fill="white" opacity="0.08" />
                </svg>
              </div>
              <button
                onClick={() => setHideBanner(true)}
                className="absolute top-3 right-3 w-7 h-7 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition z-10"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4 backdrop-blur-sm">
                  <Link2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold leading-tight mb-1.5">Portal de Reservas</h3>
                <p className="text-sm text-blue-100/80 mb-4 leading-relaxed">Compartí tu enlace para que tus pacientes reserven online.</p>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 text-sm font-semibold bg-white/15 hover:bg-white/25 px-4 py-2 rounded-lg backdrop-blur-sm transition-all active:scale-[0.98]"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? '¡Copiado!' : 'Copiar enlace'}
                </button>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100/80 animate-fade-in" style={{ animationDelay: '360ms' }}>
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Nuevo Turno', icon: CalendarDays, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100', action: onNavigateToCalendar },
                { label: 'Nuevo Paciente', icon: UserPlus, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
                { label: 'Ver Calendario', icon: CalendarDays, color: 'bg-violet-50 text-violet-600 hover:bg-violet-100', action: onNavigateToCalendar },
                { label: 'Ver Reportes', icon: BarChart3, color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.action}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-xl text-xs font-semibold transition-all active:scale-[0.97] ${item.color}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-card border border-gray-100/80 animate-fade-in" style={{ animationDelay: '320ms' }}>
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-blue-500" />
                Próximos Turnos
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Movimientos y citas recientes</p>
            </div>
            <button
              onClick={onNavigateToCalendar}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors"
            >
              Ver todos
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Paciente</th>
                  <th className="pb-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Servicio</th>
                  <th className="pb-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="pb-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Fecha</th>
                  <th className="pb-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Hora</th>
                  <th className="pb-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {stats.turnosRecientes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                          <CalendarDays className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600">Sin turnos registrados</p>
                          <p className="text-xs text-gray-400 mt-0.5">Los próximos turnos aparecerán acá</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  stats.turnosRecientes.map((turno) => {
                    const initials = `${turno.paciente?.nombre?.charAt(0) || ''}${turno.paciente?.apellido?.charAt(0) || ''}`;
                    const colors = [
                      'from-blue-500 to-blue-600',
                      'from-emerald-500 to-emerald-600',
                      'from-violet-500 to-violet-600',
                      'from-amber-500 to-amber-600',
                      'from-rose-500 to-rose-600',
                      'from-cyan-500 to-cyan-600',
                    ];
                    const avatarGradient = colors[turno.id % colors.length];

                    return (
                      <tr key={turno.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group">
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarGradient} text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-sm`}>
                              {initials}
                            </div>
                            <span className="font-semibold text-gray-900 truncate max-w-[130px] text-sm">
                              {turno.paciente?.nombre} {turno.paciente?.apellido}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 text-gray-500 font-medium text-sm">{turno.servicio?.nombre || 'General'}</td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            turno.estado === 'Atendido' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60' :
                            turno.estado === 'Confirmado' || turno.estado === 'Confirmado por Whatsapp' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/60' :
                            turno.estado === 'Pendiente' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60' :
                            turno.estado === 'Ausente' ? 'bg-gray-900 text-white' :
                            'bg-red-50 text-red-700 ring-1 ring-red-200/60'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              turno.estado === 'Pendiente' ? 'bg-amber-500 animate-pulse-soft' : 'bg-current'
                            }`} />
                            {turno.estado}
                          </span>
                        </td>
                        <td className="py-3.5 text-gray-600 font-medium text-sm">
                          {new Date(turno.fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="py-3.5 text-gray-900 font-bold text-sm">{turno.hora_inicio}</td>
                        <td className="py-3.5 text-right">
                          {turno.estado === 'Pendiente' ? (
                            <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleUpdateStatus(turno.id, 'Confirmado')}
                                className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 hover:shadow-sm transition-all active:scale-95 ring-1 ring-emerald-200/60"
                                title="Confirmar"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(turno.id, 'Cancelado')}
                                className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 hover:shadow-sm transition-all active:scale-95 ring-1 ring-red-200/60"
                                title="Cancelar"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-300 italic">—</span>
                          )}
                        </td>
                      </tr>
                    );
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
