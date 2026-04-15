import React, { useState, useEffect } from "react"
import { patientPortalApi } from "../../api/patient-portal"
import { dentalColors } from "../../config/colors"
import { Clock, CheckCircle, XCircle } from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export const MisTratamientos: React.FC = () => {
  const [tratamientos, setTratamientos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarTratamientos = async () => {
      try {
        const perfil = await patientPortalApi.obtenerPerfil()
        setTratamientos(perfil.planesTratamiento || [])
      } catch (error) {
        console.error("Error al cargar tratamientos:", error)
      } finally {
        setLoading(false)
      }
    }
    cargarTratamientos()
  }, [])

  const formatearFecha = (fecha: string) => {
    try {
      return format(parseISO(fecha), "d 'de' MMM 'de' yyyy", { locale: es })
    } catch {
      return fecha
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Completado":
        return { icon: CheckCircle, class: "bg-emerald-100 text-emerald-700" }
      case "Cancelado":
        return { icon: XCircle, class: "bg-red-100 text-red-700" }
      default:
        return { icon: Clock, class: "bg-amber-100 text-amber-700" }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg" style={{ color: dentalColors.primary }}>Cargando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: dentalColors.gray800 }}>
        Mis Planes de Tratamiento
      </h1>

      {tratamientos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Clock size={48} className="mx-auto mb-4" style={{ color: dentalColors.gray400 }} />
          <h3 className="text-lg font-medium mb-2" style={{ color: dentalColors.gray700 }}>
            No hay planes de tratamiento
          </h3>
          <p className="text-sm" style={{ color: dentalColors.gray600 }}>
            Tu odontologo creara un plan de tratamiento cuando sea necesario.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tratamientos.map((plan) => {
            const badge = getEstadoBadge(plan.estado)
            const BadgeIcon = badge.icon

            return (
              <div key={plan.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: dentalColors.gray800 }}>
                      {plan.descripcion || "Plan de Tratamiento"}
                    </h3>
                    <p className="text-sm" style={{ color: dentalColors.gray600 }}>
                      Iniciado el {formatearFecha(plan.fecha_inicio || plan.createdAt)}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.class}`}>
                    <BadgeIcon size={14} />
                    {plan.estado}
                  </span>
                </div>

                {plan.diagnostico && (
                  <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: dentalColors.gray50 }}>
                    <p className="text-sm font-medium mb-1" style={{ color: dentalColors.gray600 }}>
                      Diagnostico
                    </p>
                    <p style={{ color: dentalColors.gray800 }}>{plan.diagnostico}</p>
                  </div>
                )}

                {plan.objetivo && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1" style={{ color: dentalColors.gray600 }}>
                      Objetivo
                    </p>
                    <p style={{ color: dentalColors.gray800 }}>{plan.objetivo}</p>
                  </div>
                )}

                {plan.observaciones && (
                  <div className="pt-4 border-t" style={{ borderColor: dentalColors.gray200 }}>
                    <p className="text-sm font-medium mb-1" style={{ color: dentalColors.gray600 }}>
                      Observaciones
                    </p>
                    <p className="text-sm" style={{ color: dentalColors.gray700 }}>{plan.observaciones}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
