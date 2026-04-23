"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Profesional, Servicio } from "../../types"
import { profesionalesApi } from "../../api/profesionales"
import { feriadosApi } from "../../api/feriados"
import { Calendar, Clock } from "lucide-react"

interface DateTimeSelectionProps {
  selectedService: Servicio | null
  selectedProfessional: Profesional | null
  selectedDateTime: string | null
  onDateTimeSelect: (dateTime: string) => void
  mesActualBloqueado?: boolean
}

export const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  selectedService,
  selectedProfessional,
  selectedDateTime,
  onDateTimeSelect,
  mesActualBloqueado = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [professionalSchedule, setProfessionalSchedule] = useState<any>(null)
  const [holidays, setHolidays] = useState<string[]>([])

  // Cargar feriados
  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const response = await feriadosApi.listar()
        const holidayDates = response.map(f => f.fecha.split('T')[0])
        setHolidays(holidayDates)
      } catch (e) {
        console.error('Error loading holidays:', e)
      }
    }
    loadHolidays()
  }, [])

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

  // Generar próximos 60 días (incluyendo todos los días)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth() + 1

    // Si el mes actual está bloqueado, comenzar desde el próximo mes
    let startOffset = 1
    if (mesActualBloqueado) {
      // Encontrar el primer día del próximo mes
      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1
      const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear
      const firstDayNextMonth = new Date(`${nextMonthYear}-${String(nextMonth).padStart(2, '0')}-01`)
      startOffset = Math.ceil((firstDayNextMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    }

    // Generar los próximos 60 días starting from startOffset
    for (let i = startOffset; i <= startOffset + 60; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      const dateYear = date.getFullYear()
      const dateMonth = date.getMonth() + 1
      const monthKey = `${dateYear}-${String(dateMonth).padStart(2, '0')}`

      dates.push(`${monthKey}-${String(date.getDate()).padStart(2, '0')}`)
    }

    return dates
  }

  // Verificar si un día está disponible según el horario del profesional
  const isDayAvailable = (dateString: string): boolean => {
    // 1. Verificar si es feriado
    if (holidays.includes(dateString)) {
      return false
    }

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

    // Verificar si es quincenal
    if (daySchedule.frecuencia === "quincenal") {
      const refDate = new Date("2024-01-01T00:00:00") // Lunes 1 de Enero 2024 (Referencia fija)
      const targetDate = new Date(dateString + "T00:00:00")
      const diffInMs = targetDate.getTime() - refDate.getTime()
      const diffInWeeks = Math.floor(diffInMs / (7 * 24 * 60 * 60 * 1000))
      const semanaActual = Math.abs(diffInWeeks % 2) // 0 o 1
      
      const semanaInicio = daySchedule.semana_inicio || 0 // 0 = Semana 1, 1 = Semana 2

      if (semanaActual !== semanaInicio) {
        return false
      }
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
