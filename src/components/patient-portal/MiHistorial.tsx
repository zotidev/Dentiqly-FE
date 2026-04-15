import React, { useState, useEffect } from "react"
import { patientPortalApi } from "../../api/patient-portal"
import { dentalColors } from "../../config/colors"
import { FileText, AlertCircle, Pill, Activity } from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export const MiHistorial: React.FC = () => {
  const [historial, setHistorial] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const perfil = await patientPortalApi.obtenerPerfil()
        setHistorial(perfil.historialClinico || [])
      } catch (error) {
        console.error("Error al cargar historial:", error)
      } finally {
        setLoading(false)
      }
    }
    cargarHistorial()
  }, [])

  const formatearFecha = (fecha: string) => {
    try {
      return format(parseISO(fecha), "d 'de' MMMM 'de' yyyy", { locale: es })
    } catch {
      return fecha
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
        Mi Historial Clinico
      </h1>

      {historial.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <FileText size={48} className="mx-auto mb-4" style={{ color: dentalColors.gray400 }} />
          <h3 className="text-lg font-medium mb-2" style={{ color: dentalColors.gray700 }}>
            No hay registros de historial clinico
          </h3>
          <p className="text-sm" style={{ color: dentalColors.gray600 }}>
            Tu historial clinico aparecera aqui despues de tus primeras consultas.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {historial.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold" style={{ color: dentalColors.gray800 }}>
                    {item.tipo || "Registro Clinico"}
                  </h3>
                  <p className="text-sm" style={{ color: dentalColors.gray600 }}>
                    {formatearFecha(item.createdAt)}
                  </p>
                </div>
              </div>

              {item.descripcion && (
                <p className="mb-4" style={{ color: dentalColors.gray700 }}>{item.descripcion}</p>
              )}

              {item.alergias && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 mb-3">
                  <AlertCircle size={18} className="text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700">Alergias</p>
                    <p className="text-sm text-red-600">{item.alergias}</p>
                  </div>
                </div>
              )}

              {item.medicamentos && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 mb-3">
                  <Pill size={18} className="text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-700">Medicamentos</p>
                    <p className="text-sm text-blue-600">{item.medicamentos}</p>
                  </div>
                </div>
              )}

              {item.antecedentes && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-purple-50">
                  <Activity size={18} className="text-purple-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-700">Antecedentes</p>
                    <p className="text-sm text-purple-600">{item.antecedentes}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
