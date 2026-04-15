"use client"

import { useState, useEffect } from "react"
import { ServiceSelection } from "./ServiceSelection"
import { ProfessionalSelection } from "./ProfessionalSelection"
import { DateTimeSelection } from "./DateTimeSelection"
import { PatientForm } from "./PatientForm"
import { BookingSuccess } from "./BookingSuccess"
import type { Servicio, Profesional, CrearPacienteData } from "../../types"
import { turnosApi, pacientesApi } from "../../api"
import { patientPortalApi, getPatientToken } from "../../api/patient-portal"
import { Calendar, ChevronLeft } from "lucide-react"

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
          console.error("Error al obtener perfil:", e)
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


      // Debug: verificar qué servicio se está enviando
      console.log('=== DEBUG TURNO ===')
      console.log('Servicio seleccionado:', selectedService)
      console.log('Servicio ID:', selectedService.id)
      console.log('Servicio nombre:', selectedService.nombre)
      console.log('Servicio precio:', selectedService.precio_base)

      const turnoData = {
        paciente_id: pacienteId,
        profesional_id: selectedProfessional.id,
        servicio_id: selectedService.id,
        fecha: selectedDateTime.split('T')[0],
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        estado: "Pendiente",
        pago_confirmado: false,
      }

      console.log('Datos a enviar:', turnoData)

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

  return (
    <div className="min-h-screen bg-gray-50/50 py-2 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Branded Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/assets/odaf-logo.png"
              alt="ODAF Consultorio Odontológico"
              className="h-16 w-auto"
            />
          </div>

          {/* Social Media Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/5491140483693"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-green-600 transition-colors"
              title="WhatsApp"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/odaf_odontologia/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-600 transition-colors"
              title="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/estetic.lanus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
              title="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="mailto:odafodonto@gmail.com"
              className="text-gray-600 hover:text-red-600 transition-colors"
              title="Email"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              {/* Progress Bar */}
              <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full -z-10"></div>
                  <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-[#026498] rounded-full transition-all duration-500 ease-in-out -z-10`} style={{ width: `${((step - 1) / 3) * 100}%` }}></div>

                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex flex-col items-center group">
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-4
                          ${step >= s
                            ? "bg-[#026498] border-white text-white shadow-lg scale-110"
                            : "bg-white border-gray-200 text-gray-400"
                          }
                        `}
                      >
                        {s}
                      </div>
                      <span className={`mt-2 text-xs font-medium transition-colors duration-300 ${step >= s ? "text-[#026498]" : "text-gray-400"}`}>
                        {s === 1 ? "Servicio" : s === 2 ? "Profesional" : s === 3 ? "Fecha" : (isAuthenticated ? "Pago" : "Datos")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="p-8">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {step === 1 && <ServiceSelection onServiceSelect={handleServiceSelect} selectedService={selectedService} />}
                  {step === 2 && (
                    <ProfessionalSelection
                      selectedService={selectedService}
                      onProfessionalSelect={handleProfessionalSelect}
                      selectedProfessional={selectedProfessional}
                    />
                  )}
                  {step === 3 && selectedProfessional && (
                    <>
                      <DateTimeSelection
                        selectedService={selectedService}
                        selectedProfessional={selectedProfessional}
                        onDateTimeSelect={handleDateTimeSelect}
                        selectedDateTime={selectedDateTime}
                        mesActualBloqueado={mesActualBloqueado}
                      />

                      {/* Copago Information Banner */}
                      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-blue-900 mb-2">
                              ¿Necesitas ayuda para saber si tenés copagos o bonos?
                            </h4>
                            <div className="space-y-1 text-sm text-blue-800">
                              <p className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                                <span className="font-medium">WhatsApp:</span> 1140483693
                              </p>
                              <p className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="font-medium">Línea:</span> 77115716
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {step === 4 && (
                    <PatientForm
                      onPatientData={handlePatientSubmit}
                      loading={loading}
                      selectedService={selectedService}
                    />
                  )}

                  {/* Step 5: Payment Instructions */}
                  {step === 5 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Pago de Seña</h3>
                        <p className="text-gray-600">Para confirmar tu turno, debes transferir la seña</p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
                        <div className="text-center">
                          <p className="text-sm text-blue-700 mb-1">Monto a transferir</p>
                          <p className="text-4xl font-bold text-blue-900">${PAYMENT_INFO.amount.toLocaleString()}</p>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-4">
                            <p className="text-xs font-medium text-gray-600 mb-1">CVU</p>
                            <p className="text-lg font-mono text-gray-900 break-all">{PAYMENT_INFO.cvu}</p>
                          </div>
                          <div className="bg-white rounded-lg p-4">
                            <p className="text-xs font-medium text-gray-600 mb-1">Alias</p>
                            <p className="text-lg font-semibold text-gray-900">{PAYMENT_INFO.alias}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-800">Importante</p>
                            <p className="text-sm text-yellow-700 mt-1">
                              Después de realizar la transferencia, envía el comprobante por WhatsApp.
                              Tu turno quedará en estado "Pendiente" hasta que confirmemos el pago.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <a
                          href={`https://wa.me/${PAYMENT_INFO.whatsapp}?text=Hola, envío comprobante de pago de seña para turno`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          Enviar Comprobante por WhatsApp
                        </a>

                        <button
                          onClick={handleFinalSubmit}
                          disabled={loading}
                          className="bg-[#026498] hover:bg-[#025080] text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {loading ? 'Procesando...' : 'Finalizar Reserva'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center text-gray-500 hover:text-[#026498] font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Volver
                  </button>
                )}
                {step === 1 && <div />} {/* Spacer */}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <div className="bg-[#026498] rounded-2xl shadow-xl shadow-blue-900/20 p-6 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-black/10 rounded-full blur-2xl"></div>

                <h3 className="text-xl font-bold mb-6 flex items-center relative z-10">
                  <Calendar className="w-6 h-6 mr-2 opacity-80" />
                  Resumen
                </h3>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <div className="w-5 h-5" /> {/* Placeholder icon */}
                    </div>
                    <div>
                      <p className="text-blue-100 text-xs uppercase tracking-wider font-medium mb-1">Tratamiento</p>
                      <p className="font-semibold text-lg leading-tight">
                        {selectedService ? selectedService.nombre : "Selecciona un servicio"}
                      </p>
                    </div>
                  </div>

                  {isAuthenticated && patientData ? (
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <div className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-blue-100 text-xs uppercase tracking-wider font-medium mb-1">Paciente</p>
                        <p className="font-semibold text-lg leading-tight">
                          {patientData.nombre} {patientData.apellido}
                        </p>
                      </div>
                    </div>
                  ) : (
                  <div className={`flex items-start space-x-3 transition-opacity duration-300 ${step >= 2 ? "opacity-100" : "opacity-50"}`}>
                    <div className="p-2 bg-white/10 rounded-lg">
                      <div className="w-5 h-5" /> {/* Placeholder icon */}
                    </div>
                    <div>
                      <p className="text-blue-100 text-xs uppercase tracking-wider font-medium mb-1">Profesional</p>
                      <p className="font-semibold text-lg leading-tight">
                        {selectedProfessional
                          ? ` ${selectedProfessional.nombre} ${selectedProfessional.apellido}`
                          : "---"}
                      </p>
                    </div>
                  </div>
                  )}

                  <div className={`flex items-start space-x-3 transition-opacity duration-300 ${step >= 3 ? "opacity-100" : "opacity-50"}`}>
                    <div className="p-2 bg-white/10 rounded-lg">
                      <div className="w-5 h-5" /> {/* Placeholder icon */}
                    </div>
                    <div>
                      <p className="text-blue-100 text-xs uppercase tracking-wider font-medium mb-1">Fecha y Hora</p>
                      <p className="font-semibold text-lg leading-tight">
                        {selectedDateTime
                          ? new Date(selectedDateTime).toLocaleString("es-ES", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                          : "---"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">¿Necesitas ayuda?</h4>
                    <p className="text-sm text-gray-500">Llámanos directamente</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#026498] text-center bg-gray-50 py-3 rounded-xl border border-gray-100">
                  77115716
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}