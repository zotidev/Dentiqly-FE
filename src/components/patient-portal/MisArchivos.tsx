import React, { useState, useEffect } from "react"
import { patientPortalApi } from "../../api/patient-portal"
import { dentalColors } from "../../config/colors"
import { Folder, Download, FileText, Image, File } from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export const MisArchivos: React.FC = () => {
  const [archivos, setArchivos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarArchivos = async () => {
      try {
        const perfil = await patientPortalApi.obtenerPerfil()
        setArchivos(perfil.archivos || [])
      } catch (error) {
        console.error("Error al cargar archivos:", error)
      } finally {
        setLoading(false)
      }
    }
    cargarArchivos()
  }, [])

  const formatearFecha = (fecha: string) => {
    try {
      return format(parseISO(fecha), "d 'de' MMM 'de' yyyy", { locale: es })
    } catch {
      return fecha
    }
  }

  const getFileIcon = (tipo: string) => {
    if (tipo?.includes("pdf")) return FileText
    if (tipo?.includes("image")) return Image
    return File
  }

  const getFileColor = (tipo: string) => {
    if (tipo?.includes("pdf")) return "#EF4444"
    if (tipo?.includes("image")) return "#10B981"
    return "#6B7280"
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
        Mis Archivos
      </h1>

      {archivos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Folder size={48} className="mx-auto mb-4" style={{ color: dentalColors.gray400 }} />
          <h3 className="text-lg font-medium mb-2" style={{ color: dentalColors.gray700 }}>
            No hay archivos cargados
          </h3>
          <p className="text-sm" style={{ color: dentalColors.gray600 }}>
            Los documentos de tus consultas apareceran aqui.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {archivos.map((archivo) => {
            const FileIcon = getFileIcon(archivo.tipo)
            const iconColor = getFileColor(archivo.tipo)

            return (
              <div
                key={archivo.id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${iconColor}15` }}
                  >
                    <FileIcon size={24} style={{ color: iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" style={{ color: dentalColors.gray800 }}>
                      {archivo.nombre || "Archivo"}
                    </p>
                    <p className="text-sm" style={{ color: dentalColors.gray600 }}>
                      {formatearFecha(archivo.createdAt)}
                    </p>
                  </div>
                </div>

                {archivo.url && (
                  <a
                    href={archivo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50"
                    style={{ borderColor: dentalColors.gray300, color: dentalColors.gray700 }}
                  >
                    <Download size={16} />
                    Descargar
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
