"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Profesional, Servicio } from "../../types"
import { profesionalesApi } from "../../api/profesionales"
import { feriadosApi } from "../../api/feriados"
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react"

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
  const [viewDate, setViewDate] = useState(new Date())

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

  useEffect(() => {
    const loadProfessionalSchedule = async () => {
      if (!selectedProfessional) return
      try {
        const response = await profesionalesApi.obtenerHorarios(selectedProfessional.id)
        if (response.horarios) setProfessionalSchedule(response.horarios)
      } catch (error) {
        console.error('Error loading schedule:', error)
      }
    }
    loadProfessionalSchedule()
  }, [selectedProfessional])

  const isDayAvailable = (dateString: string): boolean => {
    if (holidays.includes(dateString)) return false
    const date = new Date(dateString + "T00:00:00")
    const today = new Date()
    today.setHours(0,0,0,0)
    if (date < today) return false

    const dayOfWeek = date.getDay()
    if (!professionalSchedule) return dayOfWeek !== 0
    const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
    const daySchedule = professionalSchedule[dayNames[dayOfWeek]]
    if (!daySchedule || !daySchedule.activo) return false

    if (daySchedule.frecuencia === "quincenal") {
      const refDate = new Date("2024-01-01T00:00:00")
      const diffInWeeks = Math.floor((date.getTime() - refDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
      if (Math.abs(diffInWeeks % 2) !== (daySchedule.semana_inicio || 0)) return false
    }
    return true
  }

  useEffect(() => {
    if (selectedDate && selectedProfessional) checkAvailability()
  }, [selectedDate, selectedProfessional])

  const checkAvailability = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await profesionalesApi.obtenerHorariosDisponibles(selectedProfessional!.id, selectedDate)
      if (response.disponible && response.horarios_disponibles) setAvailableSlots(response.horarios_disponibles)
      else setError(response.mensaje || "No hay horarios disponibles")
    } catch (e) {
      setError("Error al cargar horarios")
    } finally {
      setLoading(false)
    }
  }

  const renderCalendar = () => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []

    // Adjust firstDay (0 for Sunday)
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setViewDate(new Date(year, month - 1))} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={20} />
          </button>
          <h4 className="font-black text-gray-900 capitalize">
            {viewDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
          </h4>
          <button onClick={() => setViewDate(new Date(year, month + 1))} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-gray-300 py-2">{d}</div>
          ))}
          {days.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const available = isDayAvailable(dateStr)
            const isSelected = selectedDate === dateStr
            return (
              <button
                key={i}
                disabled={!available}
                onClick={() => setSelectedDate(dateStr)}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
                  ${isSelected ? "bg-[#026498] text-white shadow-lg scale-110" : available ? "text-gray-700 hover:bg-blue-50 hover:text-[#026498]" : "text-gray-200 cursor-not-allowed"}
                `}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <div>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#026498] text-white flex items-center justify-center font-black">3</div>
          <h2 className="text-2xl font-black text-[#026498]">Elige la fecha y hora</h2>
        </div>
        <p className="text-gray-500 font-medium ml-14">Selecciona el día y horario que prefieras.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Calendar Column */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <CalendarIcon className="text-[#026498]" size={20} />
            <h3 className="font-black text-gray-900">Fecha y Hora</h3>
          </div>
          {renderCalendar()}
        </div>

        {/* Time Slots Column */}
        <div className="space-y-6">
          <h3 className="font-black text-gray-900 flex items-center gap-3">
            <Clock className="text-[#026498]" size={20} />
            Horarios disponibles
          </h3>
          
          {selectedDate ? (
            loading ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {availableSlots.map(time => (
                  <button
                    key={time}
                    onClick={() => onDateTimeSelect(`${selectedDate}T${time}:00`)}
                    className={`
                      py-4 rounded-xl font-bold transition-all border-2
                      ${selectedDateTime?.includes(time) ? "bg-[#026498] text-white border-[#026498] shadow-lg" : "bg-white text-gray-600 border-gray-100 hover:border-blue-100 hover:text-[#026498]"}
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )
          ) : (
            <div className="p-12 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
              <Clock className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-400 font-bold text-sm">Selecciona una fecha para ver horarios</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
