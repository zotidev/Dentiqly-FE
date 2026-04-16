"use client"

import React from "react"
import { Link } from "react-router-dom"
import { CheckCircle, Calendar, User, Phone, Mail, UserCircle, Key, Printer, ArrowRight, Stethoscope } from "lucide-react"

interface BookingSuccessProps {
  appointmentData: {
    service: string
    professional: string
    dateTime: string
    patientName: string
    patientPhone: string
    patientEmail: string
    patientDni?: string
  }
  onNewBooking: () => void
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({ appointmentData, onNewBooking }) => {
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return {
      date: date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const { date, time } = formatDateTime(appointmentData.dateTime)

  return (
    <div className="max-w-3xl mx-auto py-10 animate-in fade-in zoom-in duration-700">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-white overflow-hidden">
        <div className="bg-[#026498] p-12 text-center text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-[2rem] mb-6 backdrop-blur-sm border border-white/20 animate-bounce-subtle">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-black mb-4 tracking-tight">¡Turno Reservado!</h2>
            <p className="text-blue-100 text-lg font-medium max-w-md mx-auto opacity-90">
              Tu cita ha sido agendada con éxito. Te enviamos un email con todos los detalles.
            </p>
          </div>
        </div>

        <div className="p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Detalles de la cita */}
            <div className="space-y-8">
              <h3 className="text-xl font-black text-gray-900 flex items-center mb-6">
                <span className="w-1.5 h-6 bg-[#026498] rounded-full mr-3"></span>
                Detalles de tu Cita
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#026498] flex-shrink-0">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Fecha y Hora</p>
                    <p className="font-bold text-gray-900 text-lg capitalize">{date}</p>
                    <p className="text-[#026498] font-black">{time} hs</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#026498] flex-shrink-0">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Profesional</p>
                    <p className="font-bold text-gray-900 text-lg">{appointmentData.professional}</p>
                    <div className="flex items-center text-gray-500 font-medium text-sm mt-1">
                      <Stethoscope className="h-3.5 w-3.5 mr-1.5 text-[#026498]" />
                      {appointmentData.service}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#026498] flex-shrink-0">
                    <UserCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Paciente</p>
                    <p className="font-bold text-gray-900 text-lg">{appointmentData.patientName}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <div className="flex items-center text-xs text-gray-500 font-bold">
                        <Phone className="h-3.5 w-3.5 mr-1.5 text-[#026498]" />
                        {appointmentData.patientPhone}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 font-bold">
                        <Mail className="h-3.5 w-3.5 mr-1.5 text-[#026498]" />
                        {appointmentData.patientEmail}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Acceso al Portal */}
            <div className="space-y-8">
              <h3 className="text-xl font-black text-gray-900 flex items-center mb-6">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span>
                Gestiona tu Turno
              </h3>

              <div className="bg-emerald-50/50 rounded-[2rem] p-8 border border-emerald-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl transition-transform duration-500 group-hover:scale-150"></div>
                
                <p className="text-sm font-medium text-gray-600 mb-6 leading-relaxed">
                  Ya podés gestionar tus turnos desde el portal. Usá tu <span className="font-black text-emerald-700">DNI</span> como contraseña.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="bg-white px-5 py-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Usuario / Email</p>
                      <p className="font-bold text-gray-800 text-sm">{appointmentData.patientEmail}</p>
                    </div>
                    <Mail className="h-5 w-5 text-emerald-200" />
                  </div>
                  <div className="bg-white px-5 py-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Contraseña</p>
                      <p className="font-bold text-gray-800 text-sm">{appointmentData.patientDni || "Tu número de DNI"}</p>
                    </div>
                    <Key className="h-5 w-5 text-emerald-200" />
                  </div>
                </div>

                <Link
                  to="/paciente/dashboard"
                  className="group/btn relative flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-900/10 hover:-translate-y-1"
                >
                  Acceder a Mi Portal
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-10 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
            <button
              onClick={onNewBooking}
              className="flex-1 px-8 py-5 rounded-[1.5rem] font-black text-gray-500 bg-gray-50 hover:bg-white hover:text-[#026498] hover:shadow-xl hover:shadow-gray-200 transition-all duration-300 border-2 border-transparent hover:border-blue-100 uppercase tracking-widest text-xs"
            >
              Agendar Nueva Cita
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-[1.5rem] font-black text-white bg-[#026498] hover:bg-[#0c4a6e] shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-xs"
            >
              <Printer className="h-5 w-5" />
              Imprimir Comprobante
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
