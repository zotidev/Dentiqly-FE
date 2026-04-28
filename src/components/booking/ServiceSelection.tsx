"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { Servicio } from "../../types"
import { serviciosApi } from "../../api/servicios"
import { Clock, Plus } from "lucide-react"
import { ToothIcon, BracesIcon, ImplantIcon, SparklesIcon, CleanIcon, MassageIcon, LaserIcon, BeautyIcon } from "./DentalIcons"

interface ServiceSelectionProps {
  selectedService: Servicio | null
  onServiceSelect: (service: Servicio) => void
}

const getServiceIcon = (category: string, name: string) => {
  const cat = (category || "").toLowerCase()
  const n = name.toLowerCase()
  
  if (cat.includes("ortodoncia") || n.includes("brackets") || n.includes("ortodoncia")) return BracesIcon
  if (cat.includes("estética") || n.includes("blanqueamiento") || n.includes("estética")) return SparklesIcon
  if (cat.includes("implantes") || n.includes("implante") || n.includes("perno")) return ImplantIcon
  if (cat.includes("limpieza") || n.includes("limpieza") || n.includes("profilaxis")) return CleanIcon
  if (n.includes("cosmeto")) return BeautyIcon
  if (n.includes("depila")) return LaserIcon
  if (cat.includes("masaje") || n.includes("masaje") || cat.includes("otros")) return MassageIcon
  
  // Default for anything dental related
  return ToothIcon
}

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({ selectedService, onServiceSelect }) => {
  const [services, setServices] = useState<Servicio[]>([])
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[1, 2, 4].map((i) => (
          <div key={i} className="h-48 bg-gray-50 rounded-[2.5rem] animate-pulse"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {services.map((service) => {
          const Icon = getServiceIcon(service.categoria, service.nombre)
          const isSelected = selectedService?.id === service.id
          return (
            <div
              key={service.id}
              onClick={() => onServiceSelect(service)}
              className={`
                relative group p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full
                ${isSelected
                  ? "border-[#026498] bg-blue-50/30 shadow-2xl shadow-blue-900/10 scale-[1.02]"
                  : "border-gray-50 bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1"
                }
              `}
            >
              <div className={`
                w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-all duration-500
                ${isSelected ? "bg-[#026498] text-white rotate-6" : "bg-blue-50 text-[#026498]"}
              `}>
                <Icon size={24} className="sm:w-[28px] sm:h-[28px]" />
              </div>

              <div className="flex-1 space-y-2">
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isSelected ? "text-[#026498]/60" : "text-gray-400"}`}>
                  {service.categoria || "TRATAMIENTO"}
                </span>
                <h4 className={`text-lg font-black leading-tight ${isSelected ? "text-[#026498]" : "text-gray-900"} group-hover:text-[#026498] transition-colors`}>
                  {service.nombre}
                </h4>
                {service.descripcion && (
                  <p className="text-gray-400 text-xs leading-relaxed font-medium">
                    {service.descripcion}
                  </p>
                )}
              </div>

              <div className="mt-8 flex items-center gap-2 text-gray-400">
                <div className="p-1.5 rounded-lg bg-gray-100/50">
                  <Clock size={12} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{service.duracion_estimada} MIN</span>
              </div>

              {/* Selection Tick */}
              <div className={`
                absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500
                ${isSelected ? "bg-[#026498] text-white opacity-100" : "bg-gray-100 text-gray-300 opacity-0 group-hover:opacity-100"}
              `}>
                <Plus size={16} className={isSelected ? "rotate-45" : ""} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
