"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "../ui/Button"
import type { Servicio } from "../../types"
import { serviciosApi } from "../../api/servicios"
import { Clock, ChevronLeft } from "lucide-react"

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => onServiceSelect(service)}
            className={`
              relative group p-10 rounded-[2rem] border-2 transition-all duration-500 cursor-pointer overflow-hidden
              ${selectedService?.id === service.id
                ? "border-[#026498] bg-blue-50/40 shadow-2xl shadow-blue-900/10 scale-[1.02]"
                : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2"
              }
            `}
          >
            {/* Selection Indicator */}
            <div className={`
              absolute top-0 right-0 p-5 rounded-bl-[1.5rem] transition-all duration-500
              ${selectedService?.id === service.id ? "bg-[#026498] text-white" : "bg-gray-50 text-gray-300 group-hover:bg-blue-100 group-hover:text-[#026498]"}
            `}>
              {selectedService?.id === service.id ? (
                <svg className="w-6 h-6 animate-in zoom-in duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </div>

            <div className="mb-6">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ${selectedService?.id === service.id ? "text-[#026498]/60" : "text-gray-400"}`}>
                {service.categoria || "Tratamiento"}
              </span>
              <h4 className={`text-2xl font-black mb-3 leading-tight ${selectedService?.id === service.id ? "text-[#026498]" : "text-gray-900"}`}>
                {service.nombre}
              </h4>
            </div>

            {service.descripcion && (
              <p className="text-gray-500 text-sm mb-8 leading-relaxed line-clamp-2">
                {service.descripcion}
              </p>
            )}

            <div className="flex items-center justify-between pt-8 border-t border-dashed border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#026498]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Duración</p>
                  <p className="text-sm font-black text-gray-900">{service.duracion_estimada} min</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${selectedService?.id === service.id ? "bg-[#026498] text-white" : "bg-gray-50 text-gray-300"}`}>
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                </div>
              </div>
            </div>

            {/* Subtle background decoration */}
            <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl transition-opacity duration-500 ${selectedService?.id === service.id ? "bg-blue-200/20 opacity-100" : "opacity-0"}`} />
          </div>
        ))}
      </div>

    </div>
  )
}
