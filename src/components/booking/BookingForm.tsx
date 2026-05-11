"use client"

import React, { useState, useEffect } from "react"
import { ServiceSelection } from "./ServiceSelection"
import { ProfessionalSelection } from "./ProfessionalSelection"
import { DateTimeSelection } from "./DateTimeSelection"
import { PatientForm } from "./PatientForm"
import { PaymentStep } from "./PaymentStep"
import { BookingSuccess } from "./BookingSuccess"
import { BookingSummary } from "./BookingSummary"
import type { Servicio, Profesional, CrearPacienteData } from "../../types"
import { turnosApi, pacientesApi } from "../../api"
import { patientPortalApi, getPatientToken } from "../../api/patient-portal"
import { Check, ArrowLeft } from "lucide-react"

export const BookingForm: React.FC = () => {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Servicio | null>(null)
  const [selectedProfessional, setSelectedProfessional] = useState<Profesional | null>(null)
  const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null)
  const [patientData, setPatientData] = useState<CrearPacienteData | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState<number | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mesActualBloqueado, setMesActualBloqueado] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const token = getPatientToken()
      if (token) {
        try {
          const perfil = await patientPortalApi.obtenerPerfil()
          if (perfil.paciente) {
            setIsAuthenticated(true)
            const paciente = perfil.paciente
            setPatientData({
              nombre: paciente.nombre,
              apellido: paciente.apellido,
              tipo_documento: paciente.tipo_documento,
              numero_documento: paciente.numero_documento,
              fecha_nacimiento: paciente.fecha_nacimiento,
              sexo: paciente.sexo,
              email: paciente.email,
              telefono: paciente.telefono,
              direccion: paciente.direccion || "",
              observaciones: "",
            })
            
            const turnos = await patientPortalApi.obtenerMisTurnos()
            const today = new Date()
            const currentMonth = today.getMonth()
            const currentYear = today.getFullYear()
            const tieneTurnoEsteMes = turnos.some((t: any) => {
              const fechaTurno = new Date(t.fecha)
              return fechaTurno.getMonth() === currentMonth && 
                     fechaTurno.getFullYear() === currentYear &&
                     t.estado !== 'Cancelado'
            })
            setMesActualBloqueado(tieneTurnoEsteMes)
          }
        } catch (e) {
          console.error("Error al obtener perfil:", e)
          localStorage.removeItem("patientToken")
          setIsAuthenticated(false)
        }
      }
    }
    checkAuth()
  }, [])

  const handleServiceSelect = (service: Servicio) => {
    setSelectedService(service)
    setStep(2)
  }

  const handleProfessionalSelect = (professional: Profesional) => {
    setSelectedProfessional(professional)
    setStep(3)
  }

  const handleDateTimeSelect = (dateTime: string) => {
    setSelectedDateTime(dateTime)
    if (isAuthenticated && patientData) {
      setStep(5)
    } else {
      setStep(4)
    }
  }

  const handlePatientSubmit = (data: CrearPacienteData) => {
    setPatientData(data)
    setStep(5)
  }

  const handleFinalSubmit = async () => {
    if (!selectedService || !selectedProfessional || !selectedDateTime || !patientData) return

    setLoading(true)
    try {
      let pacienteId: string
      const existingPatient = await pacientesApi.buscarPorDocumento(patientData.numero_documento)

      if (existingPatient) {
        pacienteId = existingPatient.id
      } else {
        const newPatient = await pacientesApi.crear(patientData)
        pacienteId = newPatient.id
      }

      const horaInicio = selectedDateTime.split('T')[1].substring(0, 5)
      const [hours, minutes] = horaInicio.split(':').map(Number)
      const startMinutes = hours * 60 + minutes
      const endMinutes = startMinutes + (selectedService.duracion_estimada || 30)
      const endHours = Math.floor(endMinutes / 60)
      const endMins = endMinutes % 60
      const horaFin = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`

      const turnoResponse = await turnosApi.crear({
        paciente_id: pacienteId,
        profesional_id: selectedProfessional.id,
        servicio_id: selectedService.id,
        fecha: selectedDateTime.split('T')[0],
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        estado: "Pendiente",
        pago_confirmado: false,
      })

      setBookingId(turnoResponse.id)
      setBookingSuccess(true)
    } catch (error: any) {
      console.error("Error creating appointment:", error)
      alert("Error al crear el turno. Por favor, intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const resetBooking = () => {
    setStep(1)
    setSelectedService(null)
    setSelectedProfessional(null)
    setSelectedDateTime(null)
    setBookingSuccess(false)
    setBookingId(null)
  }

  if (bookingSuccess && selectedService && selectedProfessional && selectedDateTime) {
    return (
      <BookingSuccess
        appointmentData={{
          service: selectedService.nombre,
          professional: `${selectedProfessional.nombre} ${selectedProfessional.apellido}`,
          dateTime: selectedDateTime,
          patientName: patientData ? `${patientData.nombre} ${patientData.apellido}` : "",
          patientPhone: patientData?.telefono || "",
          patientEmail: patientData?.email || "",
          patientDni: patientData?.numero_documento || "",
        }}
        onNewBooking={resetBooking}
      />
    )
  }

  const formatDateTimeSummary = (dt: string) => {
    const d = new Date(dt)
    return `${d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}, ${d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}hs`
  }

  const getStepSummary = (stepIndex: number) => {
    switch (stepIndex) {
      case 1: return selectedService?.nombre || "Seleccionar"
      case 2: return selectedProfessional ? `${selectedProfessional.nombre} ${selectedProfessional.apellido}` : "Seleccionar"
      case 3: return selectedDateTime ? formatDateTimeSummary(selectedDateTime) : "Seleccionar"
      case 4: return patientData ? `${patientData.nombre} ${patientData.apellido}` : "Completar datos"
      case 5: return "Pendiente"
      default: return ""
    }
  }

  const stepTitles = [
    "SELECCIÓN DE SERVICIO",
    "SELECCIÓN DE PROFESIONAL",
    "FECHA Y HORA",
    "DATOS PERSONALES",
    "PAGO DE SEÑA"
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-blue-100 selection:text-[#026498]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content: Accordion Steps */}
          <div className="lg:col-span-8 space-y-4">
            {stepTitles.map((title, index) => {
              const stepNumber = index + 1
              const isCompleted = step > stepNumber
              const isActive = step === stepNumber
              const isFuture = step < stepNumber

              return (
                <div 
                  key={stepNumber}
                  className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 ${
                    isActive ? "border-[#2563FF] shadow-lg shadow-[#2563FF]/10" : 
                    isCompleted ? "border-gray-200 hover:border-blue-300 cursor-pointer" : "border-gray-100 opacity-60"
                  }`}
                  onClick={() => {
                    if (isCompleted) setStep(stepNumber)
                  }}
                >
                  {/* Step Header */}
                  <div className={`p-5 sm:p-6 flex items-center justify-between ${isActive ? "border-b border-gray-100" : ""}`}>
                    <div className="flex items-center gap-4">
                      {isCompleted ? (
                        <div className="w-8 h-8 rounded-full bg-[#2563FF] text-white flex items-center justify-center">
                          <Check size={16} strokeWidth={3} />
                        </div>
                      ) : isActive ? (
                        <div className="w-8 h-8 rounded-full bg-[#2563FF] text-white flex items-center justify-center font-bold text-sm">
                          {stepNumber}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-sm">
                          {stepNumber}
                        </div>
                      )}
                      <h3 className={`font-bold text-sm sm:text-base tracking-wide ${isActive || isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                        {title}
                      </h3>
                    </div>
                    {isCompleted && !isActive && (
                      <span className="text-sm font-bold text-[#2563FF]">
                        {getStepSummary(stepNumber)}
                      </span>
                    )}
                  </div>

                  {/* Step Content (Expanded) */}
                  {isActive && (
                    <div className="p-5 sm:p-8 animate-in slide-in-from-top-4 duration-500">
                      {step === 1 && <ServiceSelection onServiceSelect={handleServiceSelect} selectedService={selectedService} />}
                      {step === 2 && (
                        <ProfessionalSelection
                          selectedService={selectedService}
                          onProfessionalSelect={handleProfessionalSelect}
                          selectedProfessional={selectedProfessional}
                        />
                      )}
                      {step === 3 && selectedProfessional && (
                        <DateTimeSelection
                          selectedService={selectedService}
                          selectedProfessional={selectedProfessional}
                          onDateTimeSelect={handleDateTimeSelect}
                          selectedDateTime={selectedDateTime}
                          mesActualBloqueado={mesActualBloqueado}
                        />
                      )}
                      {step === 4 && (
                        <PatientForm
                          onPatientData={handlePatientSubmit}
                          loading={loading}
                        />
                      )}
                      {step === 5 && selectedService && selectedProfessional && selectedDateTime && patientData && (
                        <PaymentStep
                          service={selectedService}
                          professional={selectedProfessional}
                          dateTime={selectedDateTime}
                          patientData={patientData}
                          loading={loading}
                          onConfirm={handleFinalSubmit}
                        />
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
            <BookingSummary />
          </div>
        </div>
      </div>
    </div>
  )
}