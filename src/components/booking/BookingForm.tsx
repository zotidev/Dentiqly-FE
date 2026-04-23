"use client"

import React, { useState, useEffect } from "react"
import { ServiceSelection } from "./ServiceSelection"
import { ProfessionalSelection } from "./ProfessionalSelection"
import { DateTimeSelection } from "./DateTimeSelection"
import { PatientForm } from "./PatientForm"
import { BookingSuccess } from "./BookingSuccess"
import { BookingSummary } from "./BookingSummary"
import type { Servicio, Profesional, CrearPacienteData } from "../../types"
import { turnosApi, pacientesApi } from "../../api"
import { patientPortalApi, getPatientToken } from "../../api/patient-portal"
import { 
  Calendar, 
  ChevronLeft, 
  Info,
} from "lucide-react"

// Payment configuration
const PAYMENT_INFO = {
  amount: 5000,
  cvu: "0000003100099225468937",
  alias: "melo2025",
  whatsapp: "5491140483693"
}

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
            
            // Verificar si tiene turno en el mes actual
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
          console.error("Error al obtener perfil (token posible expirado):", e)
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
      setStep(5) // Skip patient form, go directly to payment
    } else {
      setStep(4)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handlePatientSubmit = (data: CrearPacienteData) => {
    setPatientData(data)
    setStep(5) // Move to payment step
  }

  const handleFinalSubmit = async () => {
    if (!selectedService || !selectedProfessional || !selectedDateTime || !patientData) return

    setLoading(true)
    try {
      let pacienteId: string

      // First, try to find existing patient by document number
      const existingPatient = await pacientesApi.buscarPorDocumento(patientData.numero_documento)

      if (existingPatient) {
        pacienteId = existingPatient.id
      } else {
        const newPatient = await pacientesApi.crear(patientData)
        pacienteId = newPatient.id
      }

      // Calculate end time
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
      setStep(6)
    } catch (error: any) {
      console.error("Error creating appointment:", error)
      if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else if (error.response?.data?.error) {
        alert(error.response.data.error)
      } else {
        alert("Error al crear el turno. Por favor, intente nuevamente.")
      }
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

  const progressSteps = [
    { id: 1, name: "Servicio" },
    { id: 2, name: "Profesional" },
    { id: 3, name: "Fecha" },
    { id: 4, name: isAuthenticated ? "Reserva" : "Datos" },
    { id: 5, name: "Pago" }
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-100 selection:text-[#026498]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white overflow-hidden">
              {/* Refined Progress Bar */}
              <div className="bg-gray-50/50 px-10 py-8 border-b border-gray-100">
                <div className="flex items-center justify-between relative max-w-2xl mx-auto">
                  <div className="absolute left-0 top-[1.25rem] w-full h-1 bg-gray-200 rounded-full"></div>
                  <div 
                    className="absolute left-0 top-[1.25rem] h-1 bg-[#026498] rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(2,100,152,0.3)]" 
                    style={{ width: `${Math.min(((step - 1) / (progressSteps.length - 1)) * 100, 100)}%` }}
                  ></div>

                  {progressSteps.map((s) => (
                    <div key={s.id} className="flex flex-col items-center relative z-10 group">
                      <div
                        className={`
                          w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500 border-4
                          ${step > s.id
                            ? "bg-[#026498] border-white text-white shadow-lg rotate-[360deg]"
                            : step === s.id
                              ? "bg-white border-[#026498] text-[#026498] shadow-xl scale-110"
                              : "bg-white border-gray-100 text-gray-300"
                          }
                        `}
                      >
                        {step > s.id ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : s.id}
                      </div>
                      <span className={`mt-3 text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${step >= s.id ? "text-[#026498]" : "text-gray-300"}`}>
                        {s.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content with Animation Container */}
              <div className="p-10 min-h-[500px]">
                <div key={step} className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
                  {step === 1 && <ServiceSelection onServiceSelect={handleServiceSelect} selectedService={selectedService} />}
                  {step === 2 && (
                    <ProfessionalSelection
                      selectedService={selectedService}
                      onProfessionalSelect={handleProfessionalSelect}
                      selectedProfessional={selectedProfessional}
                    />
                  )}
                  {step === 3 && selectedProfessional && (
                    <div className="space-y-8">
                      <DateTimeSelection
                        selectedService={selectedService}
                        selectedProfessional={selectedProfessional}
                        onDateTimeSelect={handleDateTimeSelect}
                        selectedDateTime={selectedDateTime}
                        mesActualBloqueado={mesActualBloqueado}
                      />
                      <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#026498] shadow-sm flex-shrink-0">
                          <Info className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 mb-1">Dudas sobre copagos o bonos?</p>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            Contáctanos al <span className="font-bold text-[#026498]">11 4048-3693</span> (WhatsApp) o al <span className="font-bold text-[#026498]">7711-5716</span> (Línea) para asesorarte.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {step === 4 && (
                    <PatientForm
                      onPatientData={handlePatientSubmit}
                      loading={loading}
                      selectedService={selectedService}
                    />
                  )}

                  {step === 5 && (
                    <div className="space-y-10">
                      <div className="text-center">
                        <div className="relative inline-block">
                          <div className="absolute -inset-2 bg-blue-400 rounded-full blur opacity-20 animate-pulse"></div>
                          <div className="relative w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-10 h-10 text-[#026498]" />
                          </div>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Confirmar Reserva</h3>
                        <p className="text-gray-500 max-w-md mx-auto">Revisa los datos de tu reserva antes de finalizar.</p>
                      </div>

                      <div className="bg-[#026498] rounded-[2rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-blue-900/20">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125"></div>
                        
                        <div className="relative z-10 text-center">
                          <p className="text-blue-200 text-xs font-black uppercase tracking-[0.2em] mb-3">Turno Solicitado</p>
                          <p className="text-3xl font-black">{selectedService.nombre}</p>
                          <p className="text-blue-100 mt-2 font-medium">{selectedProfessional.nombre} {selectedProfessional.apellido}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={handleFinalSubmit}
                          disabled={loading}
                          className="flex-1 bg-[#026498] hover:bg-[#025080] text-white font-black px-8 py-5 rounded-[1.5rem] transition-all duration-300 shadow-lg shadow-blue-900/10 disabled:opacity-50 hover:-translate-y-1 text-xl"
                        >
                          {loading ? 'Procesando...' : 'Finalizar Turno'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-[#026498] font-black transition-all duration-300 px-6 py-3 rounded-2xl hover:bg-white hover:shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="text-[11px] uppercase tracking-widest">Volver</span>
                  </button>
                )}
                {step === 1 && <div />}
                
                <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Conexión Segura SSL
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="sticky top-8">
              <BookingSummary
                service={selectedService}
                professional={selectedProfessional}
                dateTime={selectedDateTime}
                patientData={patientData}
                step={step}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}