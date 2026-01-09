import React from 'react'
import { Card } from '../ui/Card'
import { Servicio, Profesional, CrearPacienteData } from '../../types'
import { dentalColors } from '../../config/colors'
import { Calendar, Clock, User, Award, DollarSign, FileText } from 'lucide-react'

interface BookingSummaryProps {
  service: Servicio | null
  professional: Profesional | null
  dateTime: string | null
  patientData: CrearPacienteData | null
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  service,
  professional,
  dateTime,
  patientData
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

  if (!service && !professional && !dateTime && !patientData) {
    return (
      <Card title="Resumen de tu Cita">
        <div className={`text-center py-8 text-[${dentalColors.gray500}]`}>
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Completa los pasos para ver el resumen de tu cita</p>
        </div>
      </Card>
    )
  }

  return (
    <Card title="Resumen de tu Cita" subtitle="Revisa los detalles antes de confirmar">
      <div className="space-y-4">
        {/* Servicio */}
        {service && (
          <div className={`p-4 bg-[${dentalColors.gray50}] rounded-lg`}>
            <h4 className={`font-semibold text-[${dentalColors.gray900}] mb-2 flex items-center`}>
              <FileText className="h-4 w-4 mr-2" />
              Servicio
            </h4>
            <p className={`text-[${dentalColors.gray700}] font-medium`}>{service.nombre}</p>
            {service.descripcion && (
              <p className={`text-sm text-[${dentalColors.gray600}] mt-1`}>{service.descripcion}</p>
            )}
            <div className="flex items-center justify-between mt-3">
              <div className={`flex items-center text-sm text-[${dentalColors.gray600}]`}>
                <Clock className="h-4 w-4 mr-1" />
                {service.duracion_minutos} minutos
              </div>
              <div className={`flex items-center text-[${dentalColors.primary}] font-semibold`}>
                <DollarSign className="h-4 w-4 mr-1" />
                ${service.precio}
              </div>
            </div>
          </div>
        )}

        {/* Profesional */}
        {professional && (
          <div className={`p-4 bg-[${dentalColors.gray50}] rounded-lg`}>
            <h4 className={`font-semibold text-[${dentalColors.gray900}] mb-2 flex items-center`}>
              <User className="h-4 w-4 mr-2" />
              Profesional
            </h4>
            <p className={`text-[${dentalColors.gray700}] font-medium`}>
              {professional.nombre} {professional.apellido}
            </p>
            <div className={`flex items-center text-sm text-[${dentalColors.gray600}] mt-1`}>
              <Award className="h-4 w-4 mr-1" />
              {professional.especialidad}
            </div>
          </div>
        )}

        {/* Fecha y Hora */}
        {dateTime && (
          <div className={`p-4 bg-[${dentalColors.gray50}] rounded-lg`}>
            <h4 className={`font-semibold text-[${dentalColors.gray900}] mb-2 flex items-center`}>
              <Calendar className="h-4 w-4 mr-2" />
              Fecha y Hora
            </h4>
            <p className={`text-[${dentalColors.gray700}] font-medium capitalize`}>
              {formatDateTime(dateTime).date}
            </p>
            <p className={`text-[${dentalColors.primary}] font-semibold mt-1`}>
              {formatDateTime(dateTime).time}hs
            </p>
          </div>
        )}

        {/* Datos del paciente */}
        {patientData && (
          <div className={`p-4 bg-[${dentalColors.gray50}] rounded-lg`}>
            <h4 className={`font-semibold text-[${dentalColors.gray900}] mb-3 flex items-center`}>
              <User className="h-4 w-4 mr-2" />
              Datos del Paciente
            </h4>
            <div className="space-y-2">
              <p className={`text-[${dentalColors.gray700}]`}>
                <span className="font-medium">{patientData.nombre} {patientData.apellido}</span>
              </p>
              <p className={`text-sm text-[${dentalColors.gray600}]`}>
                {patientData.tipo_documento}: {patientData.numero_documento}
              </p>
              {patientData.telefono && (
                <div className={`flex items-center text-sm text-[${dentalColors.gray600}]`}>
                  <Phone className="h-4 w-4 mr-1" />
                  {patientData.telefono}
                </div>
              )}
              {patientData.email && (
                <div className={`flex items-center text-sm text-[${dentalColors.gray600}]`}>
                  <Mail className="h-4 w-4 mr-1" />
                  {patientData.email}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}