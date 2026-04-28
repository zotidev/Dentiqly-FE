"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "../ui/Card"
import { Button } from "../ui/Button"
import { Plus, Save, X, Calendar, Trash2, Eye } from "lucide-react"
import { odontogramasApi } from "../../api/odontogramas"
import type { DientesData, DatosDiente } from "../../api/odontogramas"
import type { Odontograma, CrearOdontogramaData } from "../../types"
import {
  getDienteImageSrc,
} from "../../utils/dienteImages"

interface OdontogramSectionProps {
  pacienteId: string | number
}

const DIENTES_SUPERIORES = [
  "1.8", "1.7", "1.6", "1.5", "1.4", "1.3", "1.2", "1.1",
  "2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8"
]

const DIENTES_INFERIORES = [
  "4.8", "4.7", "4.6", "4.5", "4.4", "4.3", "4.2", "4.1",
  "3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8"
]

// Tratamientos disponibles
const TRATAMIENTOS = [
  { value: "corona", label: "Corona" },
  { value: "implante", label: "Implante" },
  { value: "ausente", label: "Ausente" },
  { value: "extraccion", label: "Extracción" },
  { value: "aparato_ortodontico_fijo", label: "Aparato ortodóntico fijo" },
  { value: "aparato_ortodontico_removible", label: "Aparato ortodóntico removible" },
  { value: "puente", label: "Puente" },
  { value: "poste", label: "Poste" },
  { value: "tratamiento_endodontico", label: "Tratamiento endodóntico (conducto)" },
  { value: "perno", label: "Perno" },
  { value: "protesis_total_removible", label: "Prótesis total removible" },
  { value: "protesis_parcial_removible", label: "Prótesis parcial removible" },
  { value: "fractura", label: "Fractura" },
  { value: "resto_radicular", label: "Resto radicular" },
  { value: "caries", label: "Caries" },
  { value: "intrusion", label: "Intrusión" },
  { value: "extrusion", label: "Extrusión" },
  { value: "giroversion_antihoraria", label: "Giroversión antihoraria" },
  { value: "giroversion_horaria", label: "Giroversión horaria" },
  { value: "migracion_derecha", label: "Migración derecha" },
  { value: "migracion_izquierda", label: "Migración izquierda" },
  { value: "incrustacion", label: "Incrustación" },
  { value: "restauracion", label: "Restauración" },
  { value: "sellador", label: "Sellador" },
  { value: "carilla", label: "Carilla" },
  { value: "superficie_desgastada", label: "Superficie desgastada" },
  { value: "diastema", label: "Diastema" },
  { value: "supernumerario", label: "Supernumerario" },
]

type EstadoTipo = "buen_estado" | "mal_estado"

const ESTADO_COLORS: Record<EstadoTipo, string> = {
  buen_estado: "#2563EB",  // Blue
  mal_estado: "#DC2626",   // Red
}

export const OdontogramSection: React.FC<OdontogramSectionProps> = ({ pacienteId }) => {
  const [odontogramas, setOdontogramas] = useState<Odontograma[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("view")
  const [selectedOdontograma, setSelectedOdontograma] = useState<Odontograma | null>(null)
  const [dientesData, setDientesData] = useState<DientesData>({})
  const [observaciones, setObservaciones] = useState("")
  const [tipo, setTipo] = useState<"Inicial" | "Control" | "Tratamiento">("Inicial")
  const [profesionalActual] = useState(1)

  // New: treatment-based workflow
  const [selectedTratamiento, setSelectedTratamiento] = useState<string>("")
  const [selectedEstado, setSelectedEstado] = useState<EstadoTipo>("mal_estado")
  const [isBorrarMode, setIsBorrarMode] = useState(false)

  useEffect(() => {
    fetchOdontogramas()
  }, [pacienteId])

  const fetchOdontogramas = async () => {
    try {
      setLoading(true)
      const data = await odontogramasApi.listar(pacienteId)
      setOdontogramas(data)
    } catch (error) {
      console.error("Error fetching odontogramas:", error)
    } finally {
      setLoading(false)
    }
  }

  const inicializarDientesVacios = async () => {
    try {
      const response = await odontogramasApi.inicializar()
      setDientesData(response.dientes_data)
    } catch (error) {
      console.error("Error inicializando dientes:", error)
      const todosLosDientes = [...DIENTES_SUPERIORES, ...DIENTES_INFERIORES]
      const dientesVacios: DientesData = {}
      todosLosDientes.forEach((diente) => {
        dientesVacios[diente] = {
          estado: "sano",
          superficies: { oclusal: "sano", vestibular: "sano", lingual: "sano", mesial: "sano", distal: "sano" },
          notas: "",
        }
      })
      setDientesData(dientesVacios)
    }
  }

  const handleCreate = () => {
    inicializarDientesVacios()
    setObservaciones("")
    setTipo("Inicial")
    setSelectedTratamiento("")
    setSelectedEstado("mal_estado")
    setIsBorrarMode(false)
    setModalMode("create")
    setShowModal(true)
  }

  const handleEdit = (odontograma: Odontograma) => {
    setSelectedOdontograma(odontograma)
    setDientesData(odontograma.dientes_data)
    setObservaciones(odontograma.observaciones || "")
    setTipo(odontograma.tipo)
    setSelectedTratamiento("")
    setSelectedEstado("mal_estado")
    setIsBorrarMode(false)
    setModalMode("edit")
    setShowModal(true)
  }

  const handleView = (odontograma: Odontograma) => {
    setSelectedOdontograma(odontograma)
    setDientesData(odontograma.dientes_data)
    setObservaciones(odontograma.observaciones || "")
    setTipo(odontograma.tipo)
    setModalMode("view")
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este odontograma?")) {
      try {
        await odontogramasApi.eliminar(id as any)
        fetchOdontogramas()
      } catch (error) {
        console.error("Error deleting odontograma:", error)
      }
    }
  }

  // Click on a surface square of a tooth
  const handleSuperficieClick = (numeroDiente: string, superficie: string) => {
    if (modalMode === "view") return

    if (isBorrarMode) {
      // Borrar: reset this surface to sano
      setDientesData((prev) => {
        const currentData = prev[numeroDiente] || {
          estado: "sano",
          superficies: { oclusal: "sano", vestibular: "sano", lingual: "sano", mesial: "sano", distal: "sano" },
          notas: "",
        }
        const newSuperficies = { ...currentData.superficies, [superficie]: "sano" }
        const allSano = Object.values(newSuperficies).every(s => s === "sano")
        return {
          ...prev,
          [numeroDiente]: {
            ...currentData,
            estado: allSano ? "sano" : currentData.estado,
            superficies: newSuperficies,
            tratamientos: {
              ...(currentData as any).tratamientos,
              [superficie]: undefined,
            }
          },
        }
      })
      return
    }

    if (!selectedTratamiento) return

    setDientesData((prev) => {
      const currentData = prev[numeroDiente] || {
        estado: "sano",
        superficies: { oclusal: "sano", vestibular: "sano", lingual: "sano", mesial: "sano", distal: "sano" },
        notas: "",
      }
      const newSuperficies = { ...currentData.superficies, [superficie]: selectedEstado }
      return {
        ...prev,
        [numeroDiente]: {
          ...currentData,
          estado: selectedEstado,
          superficies: newSuperficies,
          tratamientos: {
            ...(currentData as any).tratamientos,
            [superficie]: { tratamiento: selectedTratamiento, estado: selectedEstado },
          }
        },
      }
    })
  }

  const handleSubmit = async () => {
    try {
      const dataToSend: CrearOdontogramaData = {
        paciente_id: pacienteId,
        profesional_id: profesionalActual,
        fecha: new Date().toISOString().split("T")[0],
        dientes_data: dientesData,
        observaciones: observaciones,
        tipo: tipo,
      }

      if (modalMode === "create") {
        await odontogramasApi.crear(dataToSend)
      } else if (modalMode === "edit" && selectedOdontograma) {
        await odontogramasApi.actualizar(selectedOdontograma.id, dataToSend)
      }

      setShowModal(false)
      fetchOdontogramas()
    } catch (error) {
      console.error("Error saving odontograma:", error)
      alert("Error al guardar el odontograma")
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Cargando odontogramas...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Odontogramas</h3>
        <Button onClick={handleCreate} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Odontograma
        </Button>
      </div>

      {odontogramas.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          <p>No hay odontogramas registrados</p>
          <Button onClick={handleCreate} variant="outline" className="mt-4">
            Crear primer odontograma
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {odontogramas.map((odontograma) => (
            <Card key={odontograma.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1 cursor-pointer" onClick={() => handleView(odontograma)}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(odontograma.fecha).toLocaleDateString("es-ES")}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {odontograma.tipo}
                    </span>
                  </div>
                  {odontograma.observaciones && (
                    <p className="text-sm text-gray-600 line-clamp-2">{odontograma.observaciones}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleView(odontograma)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(odontograma)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(odontograma.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-[1400px] w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center z-10">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {modalMode === "view" ? "Ver Odontograma" : modalMode === "create" ? "Nuevo Odontograma" : "Editar Odontograma"}
                  </h3>
                  {selectedOdontograma && (
                    <p className="text-sm text-gray-500">
                      {new Date(selectedOdontograma.fecha).toLocaleDateString("es-ES")}
                    </p>
                  )}
                </div>
                {modalMode !== "view" && (
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as any)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="Inicial">Inicial</option>
                    <option value="Control">Control</option>
                    <option value="Tratamiento">Tratamiento</option>
                  </select>
                )}
              </div>
              <div className="flex gap-2">
                {modalMode !== "view" && (
                  <Button onClick={handleSubmit} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                )}
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Toolbar - treatment selector like old system */}
            {modalMode !== "view" && (
              <div className="sticky top-[73px] bg-gray-50 px-6 py-3 border-b flex items-center gap-3 flex-wrap z-10">
                {/* BORRAR toggle */}
                <button
                  onClick={() => setIsBorrarMode(!isBorrarMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                    isBorrarMode
                      ? "bg-gray-800 text-white border-gray-800"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-sm ${isBorrarMode ? "bg-white" : "bg-gray-800"}`} />
                  BORRAR
                </button>

                {/* Treatment selector */}
                <select
                  value={selectedTratamiento}
                  onChange={(e) => {
                    setSelectedTratamiento(e.target.value)
                    if (e.target.value) setIsBorrarMode(false)
                  }}
                  className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="">-- Seleccionar tratamiento --</option>
                  {TRATAMIENTOS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>

                {selectedTratamiento && (
                  <button
                    onClick={() => setSelectedTratamiento("")}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                )}

                {/* Estado toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedEstado("buen_estado")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                      selectedEstado === "buen_estado"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-sm ${selectedEstado === "buen_estado" ? "bg-white" : "bg-blue-600"}`} />
                    Buen estado
                  </button>
                  <button
                    onClick={() => setSelectedEstado("mal_estado")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                      selectedEstado === "mal_estado"
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-red-400"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-sm ${selectedEstado === "mal_estado" ? "bg-white" : "bg-red-600"}`} />
                    Mal estado
                  </button>
                </div>

                {/* Active treatment indicator */}
                {selectedTratamiento && (
                  <span className="text-xs text-gray-500 italic">
                    Click en los cuadrados del diente para aplicar
                  </span>
                )}
              </div>
            )}

            {/* Dental chart */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                {/* Upper teeth */}
                <div className="mb-4">
                  <div className="flex justify-center gap-1">
                    {DIENTES_SUPERIORES.map((num) => (
                      <DienteVisual
                        key={num}
                        numero={num}
                        datos={dientesData[num]}
                        esSuperior={true}
                        isReadOnly={modalMode === "view"}
                        onSuperficieClick={(superficie) => handleSuperficieClick(num, superficie)}
                        isBorrarMode={isBorrarMode}
                        hasActiveTratamiento={!!selectedTratamiento || isBorrarMode}
                      />
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="relative h-8 mb-4">
                  <div className="absolute top-1/2 left-0 right-0 border-t-2 border-gray-400" />
                </div>

                {/* Lower teeth */}
                <div>
                  <div className="flex justify-center gap-1">
                    {DIENTES_INFERIORES.map((num) => (
                      <DienteVisual
                        key={num}
                        numero={num}
                        datos={dientesData[num]}
                        esSuperior={false}
                        isReadOnly={modalMode === "view"}
                        onSuperficieClick={(superficie) => handleSuperficieClick(num, superficie)}
                        isBorrarMode={isBorrarMode}
                        hasActiveTratamiento={!!selectedTratamiento || isBorrarMode}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones Generales</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  disabled={modalMode === "view"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  rows={3}
                  placeholder="Observaciones generales del odontograma..."
                />
              </div>

              {/* Legend */}
              <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
                <h4 className="text-sm font-semibold mb-2 text-gray-700">Leyenda</h4>
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded border-2" style={{ backgroundColor: ESTADO_COLORS.buen_estado }} />
                    <span>Buen estado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded border-2" style={{ backgroundColor: ESTADO_COLORS.mal_estado }} />
                    <span>Mal estado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded border-2 bg-white border-gray-300" />
                    <span>Sin tratamiento</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Diente Visual Component ───────────────────────────────────────────
interface DienteVisualProps {
  numero: string
  datos?: DatosDiente
  esSuperior: boolean
  isReadOnly: boolean
  onSuperficieClick: (superficie: string) => void
  isBorrarMode: boolean
  hasActiveTratamiento: boolean
}

const DienteVisual: React.FC<DienteVisualProps> = ({
  numero,
  datos,
  esSuperior,
  isReadOnly,
  onSuperficieClick,
  isBorrarMode,
  hasActiveTratamiento,
}) => {
  const [imgError, setImgError] = useState(false)
  const imageSrc = getDienteImageSrc(numero)

  const getSuperficieColor = (superficie: string): string => {
    const estado = datos?.superficies?.[superficie as keyof typeof datos.superficies]
    if (!estado || estado === "sano") return "#F3F4F6"
    if (estado === "buen_estado") return ESTADO_COLORS.buen_estado
    if (estado === "mal_estado") return ESTADO_COLORS.mal_estado
    // Legacy color mapping for old data
    const legacyColors: Record<string, string> = {
      caries: "#DC2626", obturado: "#2563EB", extraido: "#1F2937",
      ausente: "#9CA3AF", protesis: "#A855F7", corona: "#EAB308",
      endodoncia: "#EC4899", fractura: "#F97316",
    }
    return legacyColors[estado] || "#9CA3AF"
  }

  const getSuperficieBorder = (superficie: string): string => {
    const estado = datos?.superficies?.[superficie as keyof typeof datos.superficies]
    if (!estado || estado === "sano") return "#D1D5DB"
    if (estado === "buen_estado") return "#1D4ED8"
    if (estado === "mal_estado") return "#B91C1C"
    return "#6B7280"
  }

  const canClick = !isReadOnly && hasActiveTratamiento
  const cursorClass = canClick ? "cursor-pointer" : isReadOnly ? "cursor-default" : "cursor-default"

  const renderSuperficieSquare = (superficie: string, position: string) => {
    const bgColor = getSuperficieColor(superficie)
    const borderColor = getSuperficieBorder(superficie)
    const tratamientoInfo = (datos as any)?.tratamientos?.[superficie]

    return (
      <div
        onClick={(e) => {
          e.stopPropagation()
          if (canClick) onSuperficieClick(superficie)
        }}
        style={{ backgroundColor: bgColor, borderColor }}
        className={`border transition-all ${position} ${
          canClick ? "hover:opacity-75 hover:scale-110 cursor-pointer" : ""
        }`}
        title={
          tratamientoInfo
            ? `${TRATAMIENTOS.find(t => t.value === tratamientoInfo.tratamiento)?.label || tratamientoInfo.tratamiento} - ${
                tratamientoInfo.estado === "buen_estado" ? "Buen estado" : "Mal estado"
              }`
            : superficie
        }
      />
    )
  }

  // The 5 surface squares layout: top, left, center, right, bottom
  const renderSurfaceGrid = () => (
    <div className="grid grid-cols-3 grid-rows-3 gap-px w-[52px] h-[52px]">
      <div className="bg-transparent" />
      {renderSuperficieSquare("vestibular", "")}
      <div className="bg-transparent" />

      {renderSuperficieSquare("mesial", "")}
      {renderSuperficieSquare("oclusal", "border-2")}
      {renderSuperficieSquare("distal", "")}

      <div className="bg-transparent" />
      {renderSuperficieSquare("lingual", "")}
      <div className="bg-transparent" />
    </div>
  )

  const renderToothImage = () => (
    <div className="w-12 h-16 relative flex items-center justify-center">
      {imageSrc && !imgError ? (
        <img
          src={imageSrc}
          alt={`Diente ${numero}`}
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
          style={{ filter: datos?.estado !== "sano" && datos?.estado ? "opacity(0.7)" : "none" }}
        />
      ) : (
        <svg viewBox="0 0 48 64" className="w-full h-full" style={{ opacity: datos?.estado !== "sano" && datos?.estado ? 0.5 : 1 }}>
          {esSuperior ? (
            <>
              <path d="M 16 28 L 24 8 L 32 28 Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5" />
              <rect x="12" y="28" width="24" height="28" rx="4" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5" />
            </>
          ) : (
            <>
              <rect x="12" y="8" width="24" height="28" rx="4" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5" />
              <path d="M 16 36 L 24 56 L 32 36 Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5" />
            </>
          )}
        </svg>
      )}
    </div>
  )

  return (
    <div className={`relative flex flex-col items-center ${cursorClass}`}>
      {esSuperior ? (
        <>
          {renderToothImage()}
          <div className="text-center text-[10px] font-semibold text-gray-700 my-0.5">{numero}</div>
          {renderSurfaceGrid()}
        </>
      ) : (
        <>
          {renderSurfaceGrid()}
          <div className="text-center text-[10px] font-semibold text-gray-700 my-0.5">{numero}</div>
          {renderToothImage()}
        </>
      )}
    </div>
  )
}