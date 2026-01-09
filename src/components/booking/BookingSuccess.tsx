"use client"

import type React from "react"
import { Card } from "../ui/Card"
import { Button } from "../ui/Button"
import { CheckCircle, Calendar, User, Phone, Mail } from "lucide-react"

interface BookingSuccessProps {
  appointmentData: {
    service: string
    professional: string
    dateTime: string
    patientName: string
    patientPhone: string
    patientEmail: string
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
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">¡Cita Confirmada!</h2>

          <p className="text-muted-foreground mb-6">
            Tu cita ha sido agendada exitosamente. Recibirás un email de confirmación en breve.
          </p>

          {/* Detalles de la cita */}
          <div className="bg-muted/50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-foreground mb-4">Detalles de tu Cita</h3>

            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-medium text-foreground capitalize">{date}</p>
                  <p className="text-sm text-muted-foreground">a las {time}hs</p>
                </div>
              </div>

              <div className="flex items-center">
                <User className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-medium text-foreground">{appointmentData.professional}</p>
                  <p className="text-sm text-muted-foreground">{appointmentData.service}</p>
                </div>
              </div>

              <div className="flex items-center">
                <User className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-medium text-foreground">{appointmentData.patientName}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-3 w-3 mr-1" />
                      {appointmentData.patientPhone}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-3 w-3 mr-1" />
                      {appointmentData.patientEmail}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información importante */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-foreground mb-2">Información Importante</h4>
            <ul className="text-sm text-muted-foreground text-left space-y-1">
              <li>• Llega 15 minutos antes de tu cita</li>
              <li>• Trae tu documento de identidad</li>
              <li>• Si tienes obra social, trae tu tarjeta</li>
              <li>• Para cancelar o reprogramar, contactanos con 24hs de anticipación</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={onNewBooking} className="flex-1 bg-transparent">
              Agendar Nueva Cita
            </Button>
            <Button onClick={() => window.print()} className="flex-1">
              Imprimir Confirmación
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
