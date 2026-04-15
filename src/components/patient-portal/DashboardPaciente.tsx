import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { patientPortalApi, PacienteProfile } from "../../api/patient-portal"
import { dentalColors } from "../../config/colors"
import { Calendar, Clock, CheckCircle, XCircle, User, ArrowRight } from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export const DashboardPaciente: React.FC = () => {
  const [perfil, setPerfil] = useState<PacienteProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const data = await patientPortalApi.obtenerPerfil()
        setPerfil(data)
      } catch (error) {
        console.error("Error al cargar perfil:", error)
      } finally {
        setLoading(false)
      }
    }
    cargarPerfil()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg" style={{ color: dentalColors.primary }}>Cargando...</div>
      </div>
    )
  }

  if (!perfil) return null

  const { paciente, proximoTurno, estadisticas } = perfil

  const formatearFecha = (fecha: string) => {
    try {
      return format(parseISO(fecha), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
    } catch {
      return fecha
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: dentalColors.gray800 }}>
          Hola, {paciente.nombre} {paciente.apellido}
        </h1>
      </div>

      {proximoTurno && (
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: dentalColors.primary }}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2" style={{ color: dentalColors.primary }}>
                Proximo Turno
              </h2>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Calendar size={18} style={{ color: dentalColors.primary }} />
                  <span className="font-medium">{formatearFecha(proximoTurno.fecha)}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={18} style={{ color: dentalColors.primary }} />
                  <span>{proximoTurno.hora_inicio} - {proximoTurno.hora_fin}</span>
                </p>
                <p className="text-gray-600">
                  {proximoTurno.profesional?.nombre} {proximoTurno.profesional?.apellido}
                  {proximoTurno.profesional?.especialidad && (
                    <span className="text-sm"> - {proximoTurno.profesional.especialidad}</span>
                  )}
                </p>
                <p className="text-sm" style={{ color: dentalColors.gray600 }}>
                  {proximoTurno.servicio?.nombre}
                </p>
              </div>
            </div>
            <Link
              to={`/paciente/turnos/${proximoTurno.id}`}
              className="flex items-center gap-1 text-sm font-medium"
              style={{ color: dentalColors.primary }}
            >
              Ver detalle <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {!proximoTurno && (
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Calendar size={48} className="mx-auto mb-4" style={{ color: dentalColors.gray400 }} />
          <h3 className="text-lg font-medium mb-2" style={{ color: dentalColors.gray700 }}>
            No tenes turnos proximos
          </h3>
          <Link
            to="/"
            className="inline-block mt-4 px-6 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: dentalColors.primary }}
          >
            Reservar Turno
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          label="Total Turnos"
          value={estadisticas.totalTurnos}
          color={dentalColors.primary}
        />
        <StatCard
          icon={CheckCircle}
          label="Completados"
          value={estadisticas.turnosCompletados}
          color="#10B981"
        />
        <StatCard
          icon={Clock}
          label="Pendientes"
          value={estadisticas.turnosPendientes}
          color="#F59E0B"
        />
        <StatCard
          icon={XCircle}
          label="Cancelados"
          value={estadisticas.turnosCancelados}
          color="#EF4444"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4" style={{ color: dentalColors.gray800 }}>
          Acceso Rapido
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction to="/paciente/turnos" label="Ver Turnos" icon={Calendar} />
          <QuickAction to="/paciente/mis-datos" label="Mis Datos" icon={User} />
          <QuickAction to="/paciente/historial" label="Historial" icon={CheckCircle} />
          <QuickAction to="/paciente/tratamientos" label="Tratamientos" icon={Clock} />
        </div>
      </div>
    </div>
  )
}

const StatCard: React.FC<{ icon: any; label: string; value: number; color: string }> = ({
  icon: Icon,
  label,
  value,
  color,
}) => (
  <div className="bg-white rounded-xl shadow-md p-4">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
        <Icon size={24} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color }}>{value}</p>
        <p className="text-sm" style={{ color: dentalColors.gray600 }}>{label}</p>
      </div>
    </div>
  </div>
)

const QuickAction: React.FC<{ to: string; label: string; icon: any }> = ({ to, label, icon: Icon }) => (
  <Link
    to={to}
    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed transition-colors hover:border-solid"
    style={{ borderColor: dentalColors.gray200 }}
  >
    <Icon size={24} style={{ color: dentalColors.primary }} />
    <span className="text-sm font-medium" style={{ color: dentalColors.gray700 }}>{label}</span>
  </Link>
)
