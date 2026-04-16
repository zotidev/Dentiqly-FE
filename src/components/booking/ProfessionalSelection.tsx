"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { Profesional, Servicio } from "../../types"
import { profesionalesApi } from "../../api/profesionales"
import { serviciosApi } from "../../api/servicios"
import { User, Award } from "lucide-react"

interface ProfessionalSelectionProps {
  selectedService: Servicio | null
  selectedProfessional: Profesional | null
  onProfessionalSelect: (professional: Profesional) => void
}

export const ProfessionalSelection: React.FC<ProfessionalSelectionProps> = ({
  selectedService,
  selectedProfessional,
  onProfessionalSelect,
}) => {
  const [professionals, setProfessionals] = useState<Profesional[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true)
      try {
        let activeProfessionals: Profesional[] = []

        if (selectedService) {
          // Fetch professionals for the specific service
          const response = await serviciosApi.obtenerProfesionales(selectedService.id)
          if (response.profesionales) {
            activeProfessionals = response.profesionales.filter((prof: Profesional) => prof.estado === "Activo")
          }
        } else {
          // Fallback: fetch all active professionals (though this case might be rare if service is required)
          const response = await profesionalesApi.listar()
          if (response.data) {
            activeProfessionals = response.data.filter((prof) => prof.estado === "Activo")
          }
        }
        setProfessionals(activeProfessionals)
      } catch (error) {
        console.error("Error fetching professionals:", error)
      } finally {
        setLoading(false)
      }
    }

    if (selectedService) {
      fetchProfessionals()
    } else {
      setProfessionals([])
      setLoading(false)
    }
  }, [selectedService])

  if (!selectedService) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900">Seleccionar Profesional</h3>
        <p className="text-gray-500">Primero selecciona un servicio para ver los profesionales disponibles</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">Seleccionar Profesional</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Elige tu Especialista</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Contamos con un equipo de expertos dedicados a tu salud dental.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {professionals.map((professional) => (
          <div
            key={professional.id}
            onClick={() => onProfessionalSelect(professional)}
            className={`
              relative group flex items-center p-8 rounded-[2rem] border-2 transition-all duration-500 cursor-pointer overflow-hidden
              ${selectedProfessional?.id === professional.id
                ? "border-[#026498] bg-blue-50/40 shadow-2xl shadow-blue-900/10 scale-[1.02]"
                : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2"
              }
            `}
          >
            {/* Avatar Section */}
            <div className={`
              relative w-24 h-24 rounded-3xl flex items-center justify-center mr-8 shadow-2xl transition-all duration-500 overflow-hidden
              ${selectedProfessional?.id === professional.id ? "bg-[#026498] text-white rotate-6" : "bg-gray-50 text-gray-400 group-hover:rotate-6"}
            `}>
              {/* Decorative background in avatar */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
              <User className={`w-12 h-12 relative z-10 transition-transform duration-500 ${selectedProfessional?.id === professional.id ? "scale-110" : "group-hover:scale-110"}`} />
            </div>

            <div className="flex-1 min-w-0 pr-8">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ${selectedProfessional?.id === professional.id ? "text-[#026498]/60" : "text-gray-400"}`}>
                Especialista
              </span>
              <h4 className={`text-2xl font-black mb-2 truncate leading-tight ${selectedProfessional?.id === professional.id ? "text-[#026498]" : "text-gray-900"}`}>
                {professional.nombre} {professional.apellido}
              </h4>
              <div className="flex items-center text-sm font-bold text-gray-500">
                <Award className="h-4 w-4 mr-2 text-[#026498]" />
                <span className="truncate">{professional.especialidad}</span>
              </div>
            </div>

            {/* Selection Tick */}
            <div className={`
              absolute top-0 right-0 p-5 rounded-bl-[1.5rem] transition-all duration-500
              ${selectedProfessional?.id === professional.id ? "bg-[#026498] text-white" : "bg-transparent text-transparent"}
            `}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Subtle background decoration */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl transition-opacity duration-500 ${selectedProfessional?.id === professional.id ? "bg-blue-200/20 opacity-100" : "opacity-0"}`} />
          </div>
        ))}
      </div>

    </div>
  )
}
