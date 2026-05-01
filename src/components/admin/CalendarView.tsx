import React, { useState, useEffect } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { dentalColors } from '../../config/colors'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Briefcase,
  Phone,
  Mail,
  List,
  LayoutGrid,
  Plus
} from 'lucide-react'
import { turnosApi } from '../../api'
import type { Turno, Profesional } from '../../types'
import { EditAppointmentModal } from './EditAppointmentModal'
import { AdminAppointmentModal } from './AdminAppointmentModal'
import { AdminBookingModal } from './AdminBookingModal'
import { profesionalesApi } from '../../api/profesionales'

type ViewType = 'day' | 'week' | 'month'

// Status colors mapping
const STATUS_COLORS = {
  'Creado': '#3B82F6', // Blue
  'Esperando confirmación': '#EAB308', // Yellow
  'Confirmado por email': '#22C55E', // Green
  'Confirmado por SMS': '#22C55E', // Green
  'Confirmado por Whatsapp': '#22C55E', // Green
  'En sala de espera': '#A855F7', // Purple
  'Atendiéndose': '#EC4899', // Pink
  'Atendido': '#06B6D4', // Cyan
  'Cancelado': '#EF4444', // Red
  'Ausente': '#000000', // Black
} as const

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<Turno[]>([])
  const [professionals, setProfessionals] = useState<Profesional[]>([])
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<number | null>(null)

  const [selectedAppointment, setSelectedAppointment] = useState<Turno | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showNewModal, setShowNewModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [viewType, setViewType] = useState<ViewType>('month')

  useEffect(() => {
    fetchAppointments()
    fetchProfessionals()
  }, [currentDate])

  const fetchProfessionals = async () => {
    try {
      const response = await profesionalesApi.listar({ estado: 'Activo' })
      setProfessionals(response.data)
    } catch (error) {
      console.error('Error fetching professionals:', error)
    }
  }

  const fetchAppointments = async () => {
    try {
      const response = await turnosApi.listar({ limit: 1000 })
      if (response.data) {
        setAppointments(response.data)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true })
    }

    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false })
    }

    return days
  }

  const getWeekDays = (date: Date) => {
    const days = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }

    return days
  }

  const handleQuickConfirm = async (id: number) => {
    try {
      await turnosApi.confirmarPago(id, true)
      alert('Pago confirmado exitosamente')
      fetchAppointments() // Refresh appointments
    } catch (error) {
      console.error('Error confirming payment:', error)
      alert('Error al confirmar el pago')
    }
  }

  const handleDeleteAppointment = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este turno? Esta acción no se puede deshacer.')) {
      try {
        await turnosApi.eliminar(id)
        setSelectedAppointment(null)
        fetchAppointments()
        alert('Turno eliminado correctamente')
      } catch (error) {
        console.error('Error deleting appointment:', error)
        alert('Error al eliminar el turno')
      }
    }
  }

  const getAppointmentsForDate = (date: Date) => {
    // Use local date components to avoid timezone shifts
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`

    let filtered = appointments.filter(appointment => {
      if (!appointment.fecha) return false
      return appointment.fecha === dateString
    })

    // Filter by selected professional if one is selected
    if (selectedProfessionalId !== null) {
      filtered = filtered.filter(appointment =>
        appointment.profesional_id === selectedProfessionalId
      )
    }

    return filtered.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
  }

  const navigate = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (viewType === 'day') {
        newDate.setDate(prev.getDate() + (direction === 'prev' ? -1 : 1))
      } else if (viewType === 'week') {
        newDate.setDate(prev.getDate() + (direction === 'prev' ? -7 : 7))
      } else {
        newDate.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1))
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getStatusColor = (estado: string) => {
    return STATUS_COLORS[estado as keyof typeof STATUS_COLORS] || dentalColors.gray400
  }

  const getViewTitle = () => {
    if (viewType === 'day') {
      return currentDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } else if (viewType === 'week') {
      const weekDays = getWeekDays(currentDate)
      const start = weekDays[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
      const end = weekDays[6].toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
      return `${start} - ${end}`
    } else {
      return currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    }
  }

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate)

    return (
      <Card className="p-6">
        <div className="space-y-4">
          {dayAppointments.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No hay turnos programados para este día</p>
            </div>
          ) : (
            dayAppointments.map((appointment) => {
              const statusColor = getStatusColor(appointment.estado)
              return (
                <div
                  key={appointment.id}
                  onClick={() => setSelectedAppointment(appointment)}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  style={{ borderLeft: `4px solid ${statusColor}` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center text-lg font-semibold">
                          <Clock className="h-5 w-5 mr-2 text-gray-500" />
                          {appointment.hora_inicio} - {appointment.hora_fin}
                        </div>
                        <span
                          className="px-2 py-1 text-xs font-semibold rounded-full"
                          style={{
                            backgroundColor: `${statusColor}20`,
                            color: statusColor
                          }}
                        >
                          {appointment.estado}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-center text-gray-700">
                          <User className="h-4 w-4 mr-2" />
                          <span className="font-medium">
                            {appointment.paciente?.nombre} {appointment.paciente?.apellido}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Briefcase className="h-4 w-4 mr-2" />
                          {appointment.servicio?.nombre}
                        </div>

                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          {appointment.profesional?.nombre} {appointment.profesional?.apellido}
                        </div>
                      </div>

                      {/* Quick Confirm Button */}
                      {appointment.estado === 'Pendiente' && !appointment.pago_confirmado && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleQuickConfirm(appointment.id)
                          }}
                          className="ml-4 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors flex items-center gap-1"
                          title="Confirmar pago"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Confirmar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Card>
    )
  }

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate)

    return (
      <Card>
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {weekDays.map((day, index) => {
            const dayAppointments = getAppointmentsForDate(day)
            const isToday = day.toDateString() === new Date().toDateString()

            return (
              <div key={index} className="bg-white min-h-[400px] p-3">
                <div className={`text-center mb-3 ${isToday ? 'text-blue-600 font-bold' : 'text-gray-700'}`}>
                  <div className="text-xs font-medium uppercase">
                    {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                  </div>
                  <div className={`text-2xl ${isToday ? 'bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mt-1' : ''}`}>
                    {day.getDate()}
                  </div>
                </div>

                <div className="space-y-2">
                  {dayAppointments.map((appointment) => {
                    const statusColor = getStatusColor(appointment.estado)
                    return (
                      <div
                        key={appointment.id}
                        onClick={() => setSelectedAppointment(appointment)}
                        className="p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: `${statusColor}20`,
                          borderLeft: `3px solid ${statusColor}`
                        }}
                      >
                        <div className="font-medium">{appointment.hora_inicio}</div>
                        <div className="truncate opacity-75">
                          {appointment.paciente?.nombre} {appointment.paciente?.apellido}
                        </div>
                        <div className="truncate text-xs opacity-60">
                          {appointment.servicio?.nombre}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    )
  }

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate)

    return (
      <Card>
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} className={`bg-[${dentalColors.gray100}] p-3 text-center`}>
              <span className={`text-sm font-semibold text-[${dentalColors.gray700}]`}>
                {day}
              </span>
            </div>
          ))}

          {days.map((day, index) => {
            const dayAppointments = getAppointmentsForDate(day.date)
            const isToday = day.date.toDateString() === new Date().toDateString()

            return (
              <div
                key={index}
                className={`bg-white min-h-[120px] p-2 ${!day.isCurrentMonth ? 'opacity-50' : ''
                  }`}
              >
                <div className={`text-sm font-medium mb-2 ${isToday
                  ? `text-[${dentalColors.primary}] font-bold`
                  : day.isCurrentMonth
                    ? `text-[${dentalColors.gray900}]`
                    : `text-[${dentalColors.gray400}]`
                  }`}>
                  {day.date.getDate()}
                </div>

                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map((appointment) => {
                    const statusColor = getStatusColor(appointment.estado)
                    return (
                      <div
                        key={appointment.id}
                        onClick={() => setSelectedAppointment(appointment)}
                        className="p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: `${statusColor}20`,
                          borderLeft: `3px solid ${statusColor}`
                        }}
                      >
                        <div className="font-medium truncate">
                          {appointment.hora_inicio}
                        </div>
                        <div className="truncate opacity-75">
                          {appointment.paciente?.nombre} {appointment.paciente?.apellido}
                        </div>
                      </div>
                    )
                  })}

                  {dayAppointments.length > 3 && (
                    <div className={`text-xs text-[${dentalColors.gray500}] text-center py-1`}>
                      +{dayAppointments.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold text-[${dentalColors.gray900}] capitalize`}>
            {getViewTitle()}
          </h2>
          <p className={`text-[${dentalColors.gray600}]`}>
            Gestiona los turnos del centro odontológico
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewType === 'day' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewType('day')}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Día</span>
            </Button>
            <Button
              variant={viewType === 'week' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewType('week')}
              className="rounded-none border-x"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Semana</span>
            </Button>
            <Button
              variant={viewType === 'month' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewType('month')}
              className="rounded-l-none"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Mes</span>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowBookingModal(true)}
              size="sm"
              variant="outline"
              className="border-[#026498] text-[#026498] hover:bg-blue-50"
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Agregar turno</span>
            </Button>
            <Button
              onClick={() => setShowNewModal(true)}
              size="sm"
              className="bg-[#026498]"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Agregar sobreturno</span>
            </Button>
            {/* Professional Filter */}
            <select
              value={selectedProfessionalId ?? ''}
              onChange={(e) => setSelectedProfessionalId(e.target.value ? Number(e.target.value) : null)}
              className="px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Todos los profesionales</option>
              {professionals.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.nombre} {prof.apellido}
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigate('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Hoy
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Color Legend */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-gray-700 mr-2">Estado del turno:</span>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-600">
                {status}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {viewType === 'day' && renderDayView()}
      {viewType === 'week' && renderWeekView()}
      {viewType === 'month' && renderMonthView()}

      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className={`px-6 py-4 border-b border-[${dentalColors.gray200}]`}>
              <h3 className={`text-lg font-semibold text-[${dentalColors.gray900}]`}>
                Detalles del Turno
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium text-[${dentalColors.gray600}]`}>Estado</span>
                <span
                  className="px-2 py-1 text-xs font-semibold rounded-full"
                  style={{
                    backgroundColor: `${getStatusColor(selectedAppointment.estado)}20`,
                    color: getStatusColor(selectedAppointment.estado)
                  }}
                >
                  {selectedAppointment.estado}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <CalendarIcon className={`h-4 w-4 text-[${dentalColors.gray400}] mr-3`} />
                  <div>
                    <p className={`font-medium text-[${dentalColors.gray900}]`}>
                      {new Date(selectedAppointment.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className={`text-sm text-[${dentalColors.gray600}]`}>
                      {selectedAppointment.hora_inicio} - {selectedAppointment.hora_fin}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <User className={`h-4 w-4 text-[${dentalColors.gray400}] mr-3`} />
                  <div>
                    <p className={`font-medium text-[${dentalColors.gray900}]`}>
                      {selectedAppointment.paciente?.nombre} {selectedAppointment.paciente?.apellido}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      {selectedAppointment.paciente?.telefono && (
                        <div className={`flex items-center text-sm text-[${dentalColors.gray600}]`}>
                          <Phone className="h-3 w-3 mr-1" />
                          {selectedAppointment.paciente.telefono}
                        </div>
                      )}
                      {selectedAppointment.paciente?.email && (
                        <div className={`flex items-center text-sm text-[${dentalColors.gray600}]`}>
                          <Mail className="h-3 w-3 mr-1" />
                          {selectedAppointment.paciente.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <User className={`h-4 w-4 text-[${dentalColors.gray400}] mr-3`} />
                  <div>
                    <p className={`font-medium text-[${dentalColors.gray900}]`}>
                      {selectedAppointment.profesional?.nombre} {selectedAppointment.profesional?.apellido}
                    </p>
                    <p className={`text-sm text-[${dentalColors.gray600}]`}>
                      {selectedAppointment.profesional?.especialidad}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Briefcase className={`h-4 w-4 text-[${dentalColors.gray400}] mr-3`} />
                  <div>
                    <p className={`font-medium text-[${dentalColors.gray900}]`}>
                      {selectedAppointment.servicio?.nombre}
                    </p>
                    <div className={`flex items-center text-sm text-[${dentalColors.primary}] font-semibold mt-1`}>
                      ${selectedAppointment.servicio?.precio_base}
                    </div>
                  </div>
                </div>

                {selectedAppointment.observaciones && (
                  <div>
                    <p className={`text-sm font-medium text-[${dentalColors.gray700}] mb-1`}>
                      Notas:
                    </p>
                    <p className={`text-sm text-[${dentalColors.gray600}] bg-[${dentalColors.gray50}] p-2 rounded`}>
                      {selectedAppointment.observaciones}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDeleteAppointment(selectedAppointment.id)}>
                  Eliminar Turno
                </Button>
                <div className="flex-1" />
                <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                  Cerrar
                </Button>
                <Button onClick={() => setShowEditModal(true)}>
                  Editar Turno
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditModal && selectedAppointment && (
        <EditAppointmentModal
          appointment={selectedAppointment}
          onClose={() => setShowEditModal(false)}
          onUpdate={() => {
            fetchAppointments()
            setSelectedAppointment(null)
            setShowEditModal(false)
          }}
        />
      )}
      
      {showNewModal && (
        <AdminAppointmentModal
          onClose={() => setShowNewModal(false)}
          onCreate={() => {
            fetchAppointments()
            setShowNewModal(false)
            alert('Turno creado exitosamente')
          }}
        />
      )}

      {showBookingModal && (
        <AdminBookingModal
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            fetchAppointments()
            setShowBookingModal(false)
            alert('Turno agendado exitosamente')
          }}
        />
      )}
    </div>
  )
}