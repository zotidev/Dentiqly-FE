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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {professionals.map((professional) => (
          <div
            key={professional.id}
            onClick={() => onProfessionalSelect(professional)}
            className={`
              flex items-center p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
              ${selectedProfessional?.id === professional.id
                ? "border-[#026498] bg-blue-50/30 shadow-lg scale-[1.02]"
                : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-xl hover:-translate-y-1"
              }
            `}
          >
            <div className={`
              w-20 h-20 rounded-full flex items-center justify-center mr-6 shadow-md border-4
              ${selectedProfessional?.id === professional.id ? "bg-[#026498] text-white border-blue-200" : "bg-gray-50 text-gray-400 border-white"}
            `}>
              <User className="h-10 w-10" />
            </div>

            <div className="flex-1">
              <h4 className={`font-bold text-xl mb-1 ${selectedProfessional?.id === professional.id ? "text-[#026498]" : "text-gray-900"}`}>
                {professional.nombre} {professional.apellido}
              </h4>
              <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
                <Award className="h-4 w-4 mr-1.5 text-[#026498]" />
                {professional.especialidad}
              </div>
              <div className={`
                text-xs font-semibold px-3 py-1 rounded-full inline-block
                ${selectedProfessional?.id === professional.id ? "bg-blue-100 text-[#026498]" : "bg-gray-100 text-gray-500"}
              `}>
                Disponible
              </div>
            </div>

            {selectedProfessional?.id === professional.id && (
              <div className="ml-4 text-[#026498]">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
