import React from 'react'
import { Servicio, Profesional, CrearPacienteData } from '../../types'
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Info,
  Phone
} from 'lucide-react'

interface BookingSummaryProps {
  service: Servicio | null
  professional: Profesional | null
  dateTime: string | null
  patientData: CrearPacienteData | null
  step: number
  isAuthenticated?: boolean
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  service,
  professional,
  dateTime,
  patientData,
  step,
  isAuthenticated = false
}) => {
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return {
      date: date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const SummaryItem = ({
    icon: Icon,
    label,
    value,
    active,
    subtitle
  }: {
    icon: any,
    label: string,
    value: string | null,
    active: boolean,
    subtitle?: string
  }) => (
    <div className={`flex items-start gap-4 transition-all duration-300 ${active ? 'opacity-100' : 'opacity-30'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${active ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/10 text-white/50'}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/60 text-[10px] font-black tracking-widest uppercase mb-0.5">{label}</p>
        <p className="font-bold text-white text-sm leading-tight truncate">
          {value || 'Selecciona un paso'}
        </p>
        {subtitle && active && (
          <p className="text-white/70 text-xs mt-1 font-medium italic">{subtitle}</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="bg-[#026498] rounded-3xl sm:rounded-[2.5rem] shadow-2xl shadow-blue-900/20 p-6 sm:p-8 text-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Calendar size={20} />
              Tu Reserva
            </h3>
            <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full font-black uppercase tracking-wider backdrop-blur-sm">
              PASO {step} DE 5
            </span>
          </div>

          {/* Mini Progress Bar */}
          <div className="mb-10 px-2">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-700"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-1 h-3 rounded-full transition-colors ${step >= i ? 'bg-white' : 'bg-white/20'}`}></div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <SummaryItem
              icon={Stethoscope}
              label="Tratamiento"
              value={service?.nombre || null}
              active={!!service}
              subtitle={service ? `${service.duracion_estimada} min` : undefined}
            />

            <SummaryItem
              icon={User}
              label="Profesional"
              value={professional ? `${professional.nombre} ${professional.apellido}` : null}
              active={!!professional}
              subtitle={professional?.especialidad}
            />

            <SummaryItem
              icon={Clock}
              label="Fecha y Hora"
              value={dateTime ? formatDateTime(dateTime).date : null}
              active={!!dateTime}
              subtitle={dateTime ? `${formatDateTime(dateTime).time} hs` : undefined}
            />

            <SummaryItem
              icon={User}
              label="Paciente"
              value={patientData ? `${patientData.nombre} ${patientData.apellido}` : (isAuthenticated ? 'Cargando...' : null)}
              active={!!patientData || isAuthenticated}
              subtitle={patientData?.numero_documento}
            />
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50/50 rounded-[2rem] p-8 border border-blue-100 flex flex-col items-center text-center group hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-blue-900/5">
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-[#026498] shadow-sm mb-4 group-hover:scale-110 transition-transform">
          <Info size={28} />
        </div>
        <h4 className="font-black text-gray-900 mb-1">¿Necesitas ayuda?</h4>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">escribinos</p>

        <a href="tel:77115716" className="w-full flex items-center justify-center gap-3 bg-[#026498] text-white py-4 rounded-xl font-black text-xl hover:bg-[#0c4a6e] transition-colors shadow-lg shadow-blue-900/10">
          <Phone size={20} />
          11 4048-3693
        </a>

        <p className="mt-6 text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
          Lun, Mar, Jue 9-12 / 14-18 <br />
          Mié 9-16 | Vie 10-16:30hs
        </p>
      </div>
    </div>
  )
}