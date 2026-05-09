"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { Profesional, Servicio } from "../../types"
import { serviciosApi } from "../../api/servicios"
import { User, Check } from "lucide-react"

interface ProfessionalSelectionProps {
  selectedService: Servicio | null
  selectedProfessional: Profesional | null
  onProfessionalSelect: (professional: Profesional) => void
  isAdmin?: boolean
}

export const ProfessionalSelection: React.FC<ProfessionalSelectionProps> = ({
  selectedService,
  selectedProfessional,
  onProfessionalSelect,
  isAdmin = false
}) => {
  const [professionals, setProfessionals] = useState<Profesional[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true)
      try {
        if (selectedService) {
          const response = await serviciosApi.obtenerProfesionales(selectedService.id)
          if (response.profesionales) {
            setProfessionals(response.profesionales.filter((prof: Profesional) => prof.estado === "Activo"))
          }
        }
      } catch (error) {
        console.error("Error fetching professionals:", error)
      } finally {
        setLoading(false)
      }
    }

    const fetchAllProfessionals = async () => {
      setLoading(true)
      try {
        const { profesionalesApi } = await import("../../api/profesionales")
        const response = await profesionalesApi.listar({ estado: "Activo", limit: 100 })
        setProfessionals(response.data)
      } catch (error) {
        console.error("Error fetching all professionals:", error)
      } finally {
        setLoading(false)
      }
    }

    if (selectedService) {
      fetchProfessionals()
    } else if (isAdmin) {
      fetchAllProfessionals()
    } else {
      setProfessionals([])
      setLoading(false)
    }
  }, [selectedService, isAdmin])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center bg-gray-50/50 p-8 rounded-[2.5rem] animate-pulse">
            <div className="w-32 h-32 rounded-full bg-gray-100 mb-6"></div>
            <div className="h-5 w-32 bg-gray-100 mb-2"></div>
            <div className="h-3 w-20 bg-gray-100"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {professionals.map((professional) => {
          const isSelected = selectedProfessional?.id === professional.id
          return (
            <div
              key={professional.id}
              onClick={() => onProfessionalSelect(professional)}
              className={`
                relative flex flex-col items-center p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer text-center
                ${isSelected
                  ? "border-[#026498] bg-blue-50/30 shadow-2xl shadow-blue-900/10 scale-105"
                  : "border-gray-50 bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1"
                }
              `}
            >
              {/* Avatar */}
              <div className={`
                relative w-24 h-24 sm:w-32 sm:h-32 rounded-full mb-4 sm:mb-6 p-1 border-2 transition-all duration-500
                ${isSelected ? "border-[#026498] rotate-6" : "border-gray-100 group-hover:rotate-6"}
              `}>
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 shadow-inner">
                  {professional.foto_url ? (
                    <img 
                      src={professional.foto_url} 
                      alt={`${professional.nombre} ${professional.apellido}`} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                      <User size={32} className="sm:w-[48px] sm:h-[48px]" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-8 h-8 sm:w-10 sm:h-10 bg-[#026498] text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-in zoom-in duration-300">
                    <Check size={14} className="sm:w-5 sm:h-5" strokeWidth={4} />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h4 className={`text-xl font-black leading-tight transition-colors ${isSelected ? "text-[#026498]" : "text-gray-900"} group-hover:text-[#026498]`}>
                  {professional.apellido} {professional.nombre}
                </h4>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">{professional.especialidad}</p>
              </div>
            </div>
          )
        })}
      </div>
      {professionals.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
          <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h4 className="text-lg font-black text-gray-900 mb-2">No se encontraron profesionales</h4>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {selectedService 
              ? "Este servicio no tiene profesionales asignados. Por favor, asigne profesionales al servicio desde la sección de Configuración."
              : "No hay profesionales activos disponibles."}
          </p>
        </div>
      )}
    </div>
  )
}
