import React from 'react'
import { Servicio, Profesional, CrearPacienteData } from '../../types'
import { dentalColors } from '../../config/colors'
import { 
  Calendar, 
  Clock, 
  User, 
  UserCheck, 
  Stethoscope, 
  CreditCard,
  ChevronRight,
  Info
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
        year: 'numeric',
        month: 'long',
        day: 'numeric'
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
    <div className={`flex items-start space-x-3 transition-all duration-300 ${active ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-2'}`}>
      <div className={`p-2 rounded-xl border transition-colors duration-300 ${active ? 'bg-white/20 border-white/30 text-white' : 'bg-white/5 border-white/10 text-blue-200'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-blue-100 text-[10px] uppercase tracking-widest font-bold mb-0.5 opacity-80">{label}</p>
        <p className={`font-semibold text-base leading-tight truncate ${active ? 'text-white' : 'text-blue-200'}`}>
          {value || '---'}
        </p>
        {subtitle && active && (
          <p className="text-blue-100/70 text-xs mt-1 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="bg-[#026498] rounded-3xl shadow-2xl shadow-blue-900/30 p-6 text-white overflow-hidden relative border border-white/10">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black flex items-center tracking-tight">
              <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-white" />
              </span>
              Tu Reserva
            </h3>
            {step < 5 && (
              <span className="text-[10px] bg-white/20 px-2 py-1 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">
                Paso {step} de 4
              </span>
            )}
          </div>

          <div className="space-y-7">
            {/* Tratamiento */}
            <SummaryItem 
              icon={Stethoscope}
              label="Tratamiento"
              value={service?.nombre || null}
              active={!!service}
              subtitle={service ? `${service.duracion_estimada} min` : undefined}
            />

            {/* Profesional */}
            <SummaryItem 
              icon={User}
              label="Profesional"
              value={professional ? `${professional.nombre} ${professional.apellido}` : null}
              active={!!professional}
              subtitle={professional?.especialidad}
            />

            {/* Fecha y Hora */}
            <SummaryItem 
              icon={Clock}
              label="Fecha y Hora"
              value={dateTime ? `${formatDateTime(dateTime).date}` : null}
              active={!!dateTime}
              subtitle={dateTime ? `${formatDateTime(dateTime).time} hs` : undefined}
            />

            {/* Paciente */}
            {(patientData || isAuthenticated) && (
              <SummaryItem 
                icon={UserCheck}
                label="Paciente"
                value={patientData ? `${patientData.nombre} ${patientData.apellido}` : 'Cargando...'}
                active={!!patientData}
                subtitle={patientData?.numero_documento ? `DNI: ${patientData.numero_documento}` : undefined}
              />
            )}
          </div>

          {/* Valor Total Indicator (Only when everything is selected) */}
          {service && dateTime && (
            <div className="mt-10 pt-6 border-t border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-[10px] uppercase tracking-widest font-bold opacity-80">Estado de reserva</p>
                  <p className="text-2xl font-black text-white mt-1">Pendiente</p>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Section Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 border border-gray-100 group hover:border-blue-100 transition-colors duration-300">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#026498] group-hover:bg-[#026498] group-hover:text-white transition-all duration-300">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">¿Necesitas ayuda?</h4>
            <p className="text-xs text-gray-500 font-medium">Llámanos o escríbenos</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <a href="tel:77115716" className="block text-xl font-black text-[#026498] text-center bg-gray-50 py-4 rounded-2xl border border-gray-100 hover:bg-blue-50 hover:border-blue-100 transition-all duration-200">
            7711-5716
          </a>
          <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">Atención Lun a Vie 9-20hs</p>
        </div>
      </div>
    </div>
  )
}