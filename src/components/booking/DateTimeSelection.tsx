"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Profesional, Servicio } from "../../types"
import { profesionalesApi } from "../../api/profesionales"
import { Calendar, Clock } from "lucide-react"

interface DateTimeSelectionProps {
  selectedService: Servicio | null
  selectedProfessional: Profesional | null
  selectedDateTime: string | null
  onDateTimeSelect: (dateTime: string) => void
}

export const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  selectedService,
  selectedProfessional,
  selectedDateTime,
  onDateTimeSelect,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [professionalSchedule, setProfessionalSchedule] = useState<any>(null)

  // Cargar horarios del profesional cuando se selecciona
  useEffect(() => {
    const loadProfessionalSchedule = async () => {
      if (!selectedProfessional) {
        setProfessionalSchedule(null)
        return
      }

      try {
        const response = await profesionalesApi.obtenerHorarios(selectedProfessional.id)
        if (response.horarios) {
          setProfessionalSchedule(response.horarios)
        }
      } catch (error) {
        console.error('Error loading professional schedule:', error)
        // Si hay error, usar horarios por defecto
        setProfessionalSchedule(null)
      }
    }

    loadProfessionalSchedule()
  }, [selectedProfessional])

  // Generar próximos 14 días (incluyendo todos los días)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()

    // Generar los próximos 14 días sin excluir ninguno
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Generar fecha en formato YYYY-MM-DD usando hora local
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      dates.push(`${year}-${month}-${day}`)
    }

    return dates
  }

  // Verificar si un día está disponible según el horario del profesional
  const isDayAvailable = (dateString: string): boolean => {
    const date = new Date(dateString + "T00:00:00")
    const dayOfWeek = date.getDay() // 0 = domingo, 1 = lunes, ..., 6 = sábado

    // Si no tenemos el horario del profesional cargado, excluir solo domingos por defecto
    if (!professionalSchedule || Object.keys(professionalSchedule).length === 0) {
      return dayOfWeek !== 0
    }

    const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
    const dayName = dayNames[dayOfWeek]

    const daySchedule = professionalSchedule[dayName]

    // Si no existe la configuración del día o no está activo, no está disponible
    if (!daySchedule || !daySchedule.activo) {
      return false
    }

    // El día está activo en el horario del profesional
    return true
  }

  useEffect(() => {
    if (selectedDate && selectedProfessional) {
      checkAvailability()
    }
  }, [selectedDate, selectedProfessional])

  const checkAvailability = async () => {
    if (!selectedProfessional || !selectedDate) return

    setLoading(true)
    setError(null)

    try {
      const response = await profesionalesApi.obtenerHorariosDisponibles(selectedProfessional.id, selectedDate)

      if (response.disponible && response.horarios_disponibles) {
        setAvailableSlots(response.horarios_disponibles)
      } else {
        setAvailableSlots([])
        setError(response.mensaje || "No hay horarios disponibles para esta fecha")
      }
    } catch (error) {
      console.error("Error checking availability:", error)
      setAvailableSlots([])
      setError("Error al verificar disponibilidad. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleTimeSelect = (time: string) => {
    // Pass the local date string directly to avoid timezone conversion
    const dateTimeString = `${selectedDate}T${time}:00`
    onDateTimeSelect(dateTimeString)
  }

  const formatDate = (dateString: string) => {
    // Add T00:00:00 to prevent timezone conversion issues
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getDayName = (dateString: string) => {
    // Add T00:00:00 to prevent timezone conversion issues
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("es-ES", { weekday: "short" })
  }

  if (!selectedService || !selectedProfessional) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900">Seleccionar Fecha y Hora</h3>
        <p className="text-gray-500">Selecciona un servicio y profesional para ver las fechas disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Fecha y Hora</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Selecciona el momento ideal para tu consulta.
        </p>
      </div>

      <div className="space-y-10">
        {/* Selección de fecha */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-6 flex items-center text-lg">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 text-[#026498]">
              <Calendar className="h-5 w-5" />
            </div>
            Días Disponibles
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {getAvailableDates().map((date) => {
              const isSelected = selectedDate === date
              const isAvailable = isDayAvailable(date)
              // Add T00:00:00 to prevent timezone conversion issues
              const dateObj = new Date(date + "T00:00:00")
              return (
                <button
                  key={date}
                  onClick={() => isAvailable && setSelectedDate(date)}
                  disabled={!isAvailable}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
                    ${!isAvailable
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                      : isSelected
                        ? "bg-[#026498] text-white border-[#026498] shadow-lg scale-105"
                        : "bg-white text-gray-600 border-gray-100 hover:border-blue-200 hover:bg-blue-50"
                    }
                  `}
                >
                  <span className={`text-xs font-bold uppercase tracking-widest mb-2 ${!isAvailable
                    ? "text-gray-400 line-through"
                    : isSelected
                      ? "text-blue-200"
                      : "text-gray-400"
                    }`}>
                    {getDayName(date)}
                  </span>
                  <span className={`text-2xl font-extrabold ${!isAvailable ? "line-through" : ""}`}>
                    {dateObj.getDate()}
                  </span>
                  <span className={`text-xs mt-1 ${!isAvailable
                    ? "text-gray-400 line-through"
                    : isSelected
                      ? "text-blue-100"
                      : "text-gray-400"
                    }`}>
                    {dateObj.toLocaleString('default', { month: 'short' })}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Selección de hora */}
        {selectedDate && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h4 className="font-bold text-gray-900 mb-6 flex items-center text-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 text-[#026498]">
                <Clock className="h-5 w-5" />
              </div>
              Horarios para {formatDate(selectedDate)}
            </h4>

            {loading ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100">
                <Clock className="h-10 w-10 mx-auto mb-3 text-red-300" />
                <p className="text-red-600 font-bold text-lg">{error}</p>
                <p className="text-red-500 mt-2">Por favor, intenta con otra fecha</p>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {availableSlots.map((time) => {
                  const isSelected = selectedDateTime?.includes(time)
                  return (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`
                        py-3 px-4 rounded-xl font-bold text-lg transition-all duration-200
                        ${isSelected
                          ? "bg-[#026498] text-white shadow-lg scale-105"
                          : "bg-white text-gray-700 border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50"
                        }
                      `}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                <Clock className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-900 font-bold text-lg">No hay horarios disponibles</p>
                <p className="text-gray-500 mt-2">El profesional no atiende este día</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
