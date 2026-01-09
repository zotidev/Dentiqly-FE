"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "../ui/Button"
import type { Servicio } from "../../types"
import { serviciosApi } from "../../api/servicios"
import { Clock } from "lucide-react"

interface ServiceSelectionProps {
  selectedService: Servicio | null
  onServiceSelect: (service: Servicio) => void
}

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({ selectedService, onServiceSelect }) => {
  const [services, setServices] = useState<Servicio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      const response = await serviciosApi.listar({ estado: "Activo" })
      setServices(response.data)
    } catch (error) {
      console.error("Error loading services:", error)
      setError("Error al cargar los servicios")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">Seleccionar Servicio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={loadServices} variant="outline">
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Nuestros Tratamientos</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Selecciona el servicio que necesitas. Nuestros profesionales están capacitados para brindarte la mejor atención.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => onServiceSelect(service)}
            className={`
              relative group p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden
              ${selectedService?.id === service.id
                ? "border-[#026498] bg-blue-50/30 shadow-lg scale-[1.02]"
                : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-xl hover:-translate-y-1"
              }
            `}
          >
            <div className={`
              absolute top-0 right-0 p-3 rounded-bl-2xl transition-colors duration-300
              ${selectedService?.id === service.id ? "bg-[#026498] text-white" : "bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-[#026498]"}
            `}>
              {selectedService?.id === service.id ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </div>

            <div className="mb-6">
              <h4 className={`text-xl font-bold mb-2 ${selectedService?.id === service.id ? "text-[#026498]" : "text-gray-900"}`}>
                {service.nombre}
              </h4>
            </div>

            {service.descripcion && (
              <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-3">
                {service.descripcion}
              </p>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-500 font-medium">
                <Clock className="h-5 w-5 mr-2 text-[#026498]" />
                {service.duracion_estimada} minutos
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {service.categoria}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
