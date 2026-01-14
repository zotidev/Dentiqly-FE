"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "../ui/Card"
import { Button } from "../ui/Button"
import { Plus, Save, X, Calendar, Trash2, Eye, BarChart3, Trash } from "lucide-react"
import { odontogramasApi } from "../../api/odontogramas"
import type { DientesData, DatosDiente } from "../../api/odontogramas"
import type { Odontograma, CrearOdontogramaData } from "../../types"
import {
  getDienteImageSrc,
  //esDienteSuperior
}
  from "../../utils/dienteImages"

interface OdontogramSectionProps {
  pacienteId: number
}

// Definición de dientes por cuadrante (notación FDI)
const DIENTES_SUPERIORES = [
  "1.8", "1.7", "1.6", "1.5", "1.4", "1.3", "1.2", "1.1",
  "2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8"
]

const DIENTES_INFERIORES = [
  "4.8", "4.7", "4.6", "4.5", "4.4", "4.3", "4.2", "4.1",
  "3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8"
]

const ESTADOS_DIENTE = [
  { value: "sano", label: "Sano", color: "#FFFFFF", borderColor: "#D1D5DB" },
  { value: "caries", label: "Caries", color: "#EF4444", borderColor: "#DC2626" },
  { value: "obturado", label: "Obturado", color: "#3B82F6", borderColor: "#2563EB" },
  { value: "extraido", label: "Extraído", color: "#1F2937", borderColor: "#111827" },
  { value: "ausente", label: "Ausente", color: "#9CA3AF", borderColor: "#6B7280" },
  { value: "protesis", label: "Prótesis", color: "#A855F7", borderColor: "#9333EA" },
  { value: "corona", label: "Corona", color: "#EAB308", borderColor: "#CA8A04" },
  { value: "endodoncia", label: "Endodoncia", color: "#EC4899", borderColor: "#DB2777" },
  { value: "fractura", label: "Fractura", color: "#F97316", borderColor: "#EA580C" },
]



export const OdontogramSection: React.FC<OdontogramSectionProps> = ({ pacienteId }) => {
  const [odontogramas, setOdontogramas] = useState<Odontograma[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("view")
  const [selectedOdontograma, setSelectedOdontograma] = useState<Odontograma | null>(null)
  const [dientesData, setDientesData] = useState<DientesData>({})
  const [selectedDiente, setSelectedDiente] = useState<string | null>(null)
  const [observaciones, setObservaciones] = useState("")
  const [tipo, setTipo] = useState<"Inicial" | "Control" | "Tratamiento">("Inicial")
  const [showEstadisticas, setShowEstadisticas] = useState(false)
  const [profesionalActual] = useState(1)
  const [superficieMode, setSuperficieMode] = useState(false) // Modo de selección por superficie
  const [selectedSuperficies, setSelectedSuperficies] = useState<string[]>([]) // Superficies seleccionadas

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
          superficies: {
            oclusal: "sano",
            vestibular: "sano",
            lingual: "sano",
            mesial: "sano",
            distal: "sano",
          },
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
    setSelectedDiente(null)
    setModalMode("create")
    setShowModal(true)
  }

  const handleEdit = (odontograma: Odontograma) => {
    setSelectedOdontograma(odontograma)
    setDientesData(odontograma.dientes_data)
    setObservaciones(odontograma.observaciones || "")
    setTipo(odontograma.tipo)
    setSelectedDiente(null)
    setModalMode("edit")
    setShowModal(true)
  }

  const handleView = (odontograma: Odontograma) => {
    setSelectedOdontograma(odontograma)
    setDientesData(odontograma.dientes_data)
    setObservaciones(odontograma.observaciones || "")
    setTipo(odontograma.tipo)
    setSelectedDiente(null)
    setModalMode("view")
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este odontograma?")) {
      try {
        await odontogramasApi.eliminar(Number(id))
        fetchOdontogramas()
      } catch (error) {
        console.error("Error deleting odontograma:", error)
      }
    }
  }

  const handleDienteClick = (numeroDiente: string) => {
    if (modalMode === "view") return
    setSelectedDiente(numeroDiente)
    setSelectedSuperficies([]) // Reset superficie selection when clicking new tooth
  }

  const handleEstadoChange = (estado: string) => {
    if (!selectedDiente || modalMode === "view") return

    if (selectedSuperficies.length > 0) {
      // Aplicar tratamiento solo a superficies seleccionadas
      setDientesData((prev) => {
        const currentData = prev[selectedDiente] || {
          estado: "sano",
          superficies: {
            oclusal: "sano",
            vestibular: "sano",
            lingual: "sano",
            mesial: "sano",
            distal: "sano",
          },
          notas: "",
        }

        const newSuperficies = { ...currentData.superficies }
        selectedSuperficies.forEach((superficie) => {
          newSuperficies[superficie as keyof typeof newSuperficies] = estado
        })

        // Determinar el estado general del diente basado en las superficies
        const estadosSuperficies = Object.values(newSuperficies)
        const todasSanas = estadosSuperficies.every(s => s === "sano")
        const estadoGeneral = todasSanas ? "sano" : estado

        return {
          ...prev,
          [selectedDiente]: {
            ...currentData,
            estado: estadoGeneral,
            superficies: newSuperficies,
          },
        }
      })
    } else {
      // Modo diente completo (comportamiento original)
      setDientesData((prev) => ({
        ...prev,
        [selectedDiente]: {
          ...prev[selectedDiente],
          estado: estado,
          superficies: {
            oclusal: estado,
            vestibular: estado,
            lingual: estado,
            mesial: estado,
            distal: estado,
          },
        },
      }))
    }
  }

  const handleBorrarDiente = () => {
    if (!selectedDiente || modalMode === "view") return

    setDientesData((prev) => ({
      ...prev,
      [selectedDiente]: {
        estado: "sano",
        superficies: {
          oclusal: "sano",
          vestibular: "sano",
          lingual: "sano",
          mesial: "sano",
          distal: "sano",
        },
        notas: "",
      },
    }))
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
        await odontogramasApi.actualizar(Number(selectedOdontograma.id), dataToSend)
      }

      setShowModal(false)
      fetchOdontogramas()
    } catch (error) {
      console.error("Error saving odontograma:", error)
      alert("Error al guardar el odontograma")
    }
  }

  const calcularEstadisticas = () => {
    const stats = {
      total: 32,
      sanos: 0,
      con_caries: 0,
      obturados: 0,
      extraidos: 0,
      ausentes: 0,
      otros: 0,
    }

    Object.values(dientesData).forEach((diente) => {
      switch (diente.estado) {
        case "sano":
          stats.sanos++
          break
        case "caries":
          stats.con_caries++
          break
        case "obturado":
          stats.obturados++
          break
        case "extraido":
          stats.extraidos++
          break
        case "ausente":
          stats.ausentes++
          break
        default:
          stats.otros++
      }
    })

    return stats
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
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
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
                  <div className="flex items-center gap-2">
                    <select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value as any)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="Inicial">Inicial</option>
                      <option value="Control">Control</option>
                      <option value="Tratamiento">Tratamiento</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {modalMode !== "view" && (
                  <>
                    <Button onClick={() => setShowEstadisticas(!showEstadisticas)} variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Estadísticas
                    </Button>
                    <Button onClick={handleSubmit} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                  </>
                )}
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {showEstadisticas && (
                <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
                  <h4 className="font-semibold mb-3 text-blue-900">Estadísticas del Odontograma</h4>
                  <div className="grid grid-cols-7 gap-4 text-center">
                    {Object.entries(calcularEstadisticas()).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-2xl font-bold text-blue-600">{value}</p>
                        <p className="text-xs text-gray-600 capitalize">{key.replace("_", " ")}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                <div className="mb-8">
                  <div className="flex justify-center gap-2 mb-2">
                    {DIENTES_SUPERIORES.map((num) => (
                      <DienteVisual
                        key={num}
                        numero={num}
                        datos={dientesData[num]}
                        isSelected={selectedDiente === num}
                        onClick={() => handleDienteClick(num)}
                        isReadOnly={modalMode === "view"}
                        esSuperior={true}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative h-16 mb-8">
                  <div className="absolute top-1/2 left-0 right-0 border-t-2 border-gray-400"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-white px-4 py-2 border-2 border-gray-400 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Línea Media</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-center gap-2">
                    {DIENTES_INFERIORES.map((num) => (
                      <DienteVisual
                        key={num}
                        numero={num}
                        datos={dientesData[num]}
                        isSelected={selectedDiente === num}
                        onClick={() => handleDienteClick(num)}
                        isReadOnly={modalMode === "view"}
                        esSuperior={false}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {selectedDiente && modalMode !== "view" && (
                <Card className="mt-6 p-4 bg-blue-50 border-2 border-blue-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-blue-900">Diente {selectedDiente} seleccionado</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBorrarDiente}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Limpiar
                    </Button>
                  </div>


                  <div className="space-y-4">
                    {/* Selección de Superficies */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Modo de Selección</label>
                        <button
                          onClick={() => {
                            setSuperficieMode(!superficieMode)
                            setSelectedSuperficies([])
                          }}
                          className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${superficieMode
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-700"
                            }`}
                        >
                          {superficieMode ? "Por Superficie" : "Diente Completo"}
                        </button>
                      </div>

                      {superficieMode && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <p className="text-xs text-purple-900 mb-2 font-medium">Selecciona las superficies a tratar:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { key: "oclusal", label: "Oclusal (O)" },
                              { key: "vestibular", label: "Vestibular (V)" },
                              { key: "lingual", label: "Lingual/Palatino (L/P)" },
                              { key: "mesial", label: "Mesial (M)" },
                              { key: "distal", label: "Distal (D)" },
                            ].map((superficie) => (
                              <label
                                key={superficie.key}
                                className="flex items-center gap-2 cursor-pointer hover:bg-purple-100 p-2 rounded"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedSuperficies.includes(superficie.key)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedSuperficies([...selectedSuperficies, superficie.key])
                                    } else {
                                      setSelectedSuperficies(selectedSuperficies.filter(s => s !== superficie.key))
                                    }
                                  }}
                                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-700">{superficie.label}</span>
                              </label>
                            ))}
                          </div>
                          {selectedSuperficies.length > 0 && (
                            <p className="mt-2 text-xs text-purple-700">
                              {selectedSuperficies.length} superficie{selectedSuperficies.length > 1 ? 's' : ''} seleccionada{selectedSuperficies.length > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado del Diente</label>
                      <div className="grid grid-cols-3 gap-2">
                        {ESTADOS_DIENTE.map((estado) => (
                          <button
                            key={estado.value}
                            onClick={() => handleEstadoChange(estado.value)}
                            style={{
                              backgroundColor: estado.color,
                              borderColor: estado.borderColor,
                              color: estado.value === "sano" ? "#374151" : "#FFFFFF"
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${dientesData[selectedDiente]?.estado === estado.value
                              ? "ring-4 ring-blue-300 scale-105"
                              : "hover:scale-105"
                              }`}
                          >
                            {estado.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notas del Diente</label>
                      <textarea
                        value={dientesData[selectedDiente]?.notas || ""}
                        onChange={(e) => {
                          setDientesData((prev) => ({
                            ...prev,
                            [selectedDiente]: {
                              ...prev[selectedDiente],
                              notas: e.target.value,
                            },
                          }))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        rows={2}
                        placeholder="Observaciones específicas del diente..."
                      />
                    </div>
                  </div>
                </Card>
              )}

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

              <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
                <h4 className="text-sm font-semibold mb-3 text-gray-700">Leyenda de Estados</h4>
                <div className="grid grid-cols-3 gap-3">
                  {ESTADOS_DIENTE.map((estado) => (
                    <div key={estado.value} className="flex items-center gap-2">
                      <div
                        style={{
                          backgroundColor: estado.color,
                          borderColor: estado.borderColor
                        }}
                        className="w-8 h-8 rounded border-2"
                      ></div>
                      <span className="text-sm text-gray-700 font-medium">{estado.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface DienteVisualProps {
  numero: string
  datos?: DatosDiente
  isSelected: boolean
  onClick: () => void
  isReadOnly: boolean
  esSuperior: boolean
}

const DienteVisual: React.FC<DienteVisualProps> = ({
  numero,
  datos,
  isSelected,
  onClick,
  isReadOnly,
  esSuperior,
}) => {
  const [imgError, setImgError] = useState(false)

  const getEstadoConfig = (estado: string) => {
    return ESTADOS_DIENTE.find((e) => e.value === estado) || ESTADOS_DIENTE[0]
  }

  const estadoConfig = getEstadoConfig(datos?.estado || "sano")
  const imageSrc = getDienteImageSrc(numero)

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer transition-all flex flex-col items-center ${isSelected ? "ring-4 ring-blue-500 rounded-lg scale-110 z-10" : ""
        } ${isReadOnly ? "cursor-default" : "hover:scale-105"}`}
    >
      {esSuperior ? (
        <>
          <div className="text-center text-xs font-semibold text-gray-700 mb-1">
            {numero}
          </div>

          <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-14 h-14">
            <div className="bg-gray-200 rounded-tl"></div>
            {/* Vestibular (arriba centro) */}
            <div
              style={{
                backgroundColor: datos?.superficies?.vestibular
                  ? getEstadoConfig(datos.superficies.vestibular).color
                  : "#F3F4F6",
                borderColor: datos?.superficies?.vestibular
                  ? getEstadoConfig(datos.superficies.vestibular).borderColor
                  : "#D1D5DB"
              }}
              className="border"
            ></div>
            <div className="bg-gray-200 rounded-tr"></div>

            {/* Mesial (centro izquierda) */}
            <div
              style={{
                backgroundColor: datos?.superficies?.mesial
                  ? getEstadoConfig(datos.superficies.mesial).color
                  : "#F3F4F6",
                borderColor: datos?.superficies?.mesial
                  ? getEstadoConfig(datos.superficies.mesial).borderColor
                  : "#D1D5DB"
              }}
              className="border"
            ></div>
            {/* Oclusal (centro) */}
            <div
              style={{
                backgroundColor: datos?.superficies?.oclusal
                  ? getEstadoConfig(datos.superficies.oclusal).color
                  : "#FFFFFF",
                borderColor: datos?.superficies?.oclusal
                  ? getEstadoConfig(datos.superficies.oclusal).borderColor
                  : "#D1D5DB"
              }}
              className="border-2 flex items-center justify-center"
            >
              {datos?.notas && <span className="text-xs">📝</span>}
            </div>
            {/* Distal (centro derecha) */}
            <div
              style={{
                backgroundColor: datos?.superficies?.distal
                  ? getEstadoConfig(datos.superficies.distal).color
                  : "#F3F4F6",
                borderColor: datos?.superficies?.distal
                  ? getEstadoConfig(datos.superficies.distal).borderColor
                  : "#D1D5DB"
              }}
              className="border"
            ></div>

            <div className="bg-gray-200 rounded-bl"></div>
            {/* Lingual (abajo centro) */}
            <div
              style={{
                backgroundColor: datos?.superficies?.lingual
                  ? getEstadoConfig(datos.superficies.lingual).color
                  : "#F3F4F6",
                borderColor: datos?.superficies?.lingual
                  ? getEstadoConfig(datos.superficies.lingual).borderColor
                  : "#D1D5DB"
              }}
              className="border"
            ></div>
            <div className="bg-gray-200 rounded-br"></div>
          </div>

          <div className="flex justify-center mt-1">
            <div className="w-12 h-16 relative">
              {imageSrc && !imgError ? (
                <img
                  src={imageSrc}
                  alt={`Diente ${numero}`}
                  className="w-full h-full object-contain"
                  onError={() => setImgError(true)}
                  style={{
                    filter: datos?.estado !== "sano" ? "opacity(0.7)" : "none"
                  }}
                />
              ) : (
                <svg
                  viewBox="0 0 48 64"
                  className="w-full h-full"
                  style={{
                    opacity: datos?.estado !== "sano" ? 0.5 : 1
                  }}
                >
                  <path
                    d="M 16 28 L 24 8 L 32 28 Z"
                    fill={estadoConfig.color}
                    stroke={estadoConfig.borderColor}
                    strokeWidth="1.5"
                  />
                  <rect
                    x="12" y="28" width="24" height="28" rx="4"
                    fill={estadoConfig.color}
                    stroke={estadoConfig.borderColor}
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center mb-1">
            <div className="w-12 h-16 relative">
              {imageSrc && !imgError ? (
                <img
                  src={imageSrc}
                  alt={`Diente ${numero}`}
                  className="w-full h-full object-contain"
                  onError={() => setImgError(true)}
                  style={{
                    filter: datos?.estado !== "sano" ? "opacity(0.7)" : "none"
                  }}
                />
              ) : (
                <svg
                  viewBox="0 0 48 64"
                  className="w-full h-full"
                  style={{
                    opacity: datos?.estado !== "sano" ? 0.5 : 1
                  }}
                >
                  <rect
                    x="12" y="8" width="24" height="28" rx="4"
                    fill={estadoConfig.color}
                    stroke={estadoConfig.borderColor}
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 16 36 L 24 56 L 32 36 Z"
                    fill={estadoConfig.color}
                    stroke={estadoConfig.borderColor}
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </div>
          </div>


          <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-14 h-14">
            <div className="bg-gray-200 rounded-tl"></div>
            {/* Vestibular (arriba centro) */}
            <div
              style={{
                backgroundColor: datos?.superficies?.vestibular
                  ? getEstadoConfig(datos.superficies.vestibular).color
                  : "#F3F4F6",
                borderColor: datos?.superficies?.vestibular
                  ? getEstadoConfig(datos.superficies.vestibular).borderColor
                  : "#D1D5DB"
              }}
              className="border"
            ></div>
            <div className="bg-gray-200 rounded-tr"></div>

            {/* Mesial (centro izquierda) */}
            <div
              style={{
                backgroundColor: datos?.superficies?.mesial
                  ? getEstadoConfig(datos.superficies.mesial).color
                  : "#F3F4F6",
                borderColor: datos?.superficies?.mesial
                  ? getEstadoConfig(datos.superficies.mesial).borderColor
                  : "#D1D5DB"
              }}
              className="border"
            ></div>
            {/* Oclusal (centro) */}
            <div
              style={{
                backgroundColor: datos?.superficies?.oclusal
                  ? getEstadoConfig(datos.superficies.oclusal).color
                  : "#FFFFFF",
                borderColor: datos?.superficies?.oclusal
                  ? getEstadoConfig(datos.superficies.oclusal).borderColor
                  : "#D1D5DB"
              }}
              className="border-2 flex items-center justify-center"
            >
              {datos?.notas && <span className="text-xs">📝</span>}
            </div>
            {/* Distal (centro derecha) */}
            <div
              style={{
                backgroundColor: datos?.superficies?.distal
                  ? getEstadoConfig(datos.superficies.distal).color
                  : "#F3F4F6",
                borderColor: datos?.superficies?.distal
                  ? getEstadoConfig(datos.superficies.distal).borderColor
                  : "#D1D5DB"
              }}
              className="border"
            ></div>

            <div className="bg-gray-200 rounded-bl"></div>
            {/* Lingual (abajo centro) */}
            <div
              style={{
                backgroundColor: datos?.superficies?.lingual
                  ? getEstadoConfig(datos.superficies.lingual).color
                  : "#F3F4F6",
                borderColor: datos?.superficies?.lingual
                  ? getEstadoConfig(datos.superficies.lingual).borderColor
                  : "#D1D5DB"
              }}
              className="border"
            ></div>
            <div className="bg-gray-200 rounded-br"></div>
          </div>

          <div className="text-center text-xs font-semibold text-gray-700 mt-1">
            {numero}
          </div>
        </>
      )}
    </div>
  )
}