"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Input } from "../ui/Input"
import { Select } from "../ui/Select"
import { Button } from "../ui/Button"
import type { CrearPacienteData, Servicio, ObraSocial } from "../../types"
import { obrasSocialesApi, copagosApi } from "../../api"

interface PatientFormProps {
  onPatientData: (data: CrearPacienteData) => void
  loading?: boolean
  selectedService: Servicio | null
}

export const PatientForm: React.FC<PatientFormProps> = ({ onPatientData, loading = false, selectedService }) => {
  const [obrasSociales, setObrasSociales] = useState<ObraSocial[]>([])
  const [copago, setCopago] = useState<{ monto: number; mensaje?: string } | null>(null)
  const [formData, setFormData] = useState<CrearPacienteData>({
    apellido: "",
    nombre: "",
    tipo_documento: "DNI",
    numero_documento: "",
    fecha_nacimiento: "",
    sexo: "Masculino",
    telefono: "",
    email: "",
    direccion: "",
    obra_social_id: undefined,
    numero_afiliado: "",
    contacto_emergencia: "",
    telefono_emergencia: "",
    observaciones: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CrearPacienteData, string>>>({})

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CrearPacienteData, string>> = {}

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es requerido"
    if (!formData.numero_documento.trim()) newErrors.numero_documento = "El número de documento es requerido"
    if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = "La fecha de nacimiento es requerida"
    if (!formData.telefono?.trim()) newErrors.telefono = "El teléfono es requerido"
    if (!formData.email?.trim()) newErrors.email = "El email es requerido"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "El email no es válido"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onPatientData(formData)
    }
  }

  useEffect(() => {
    const fetchObrasSociales = async () => {
      try {
        const data = await obrasSocialesApi.listar()
        setObrasSociales(data)
      } catch (error) {
        console.error("Error fetching obras sociales:", error)
      }
    }
    fetchObrasSociales()
  }, [])

  useEffect(() => {
    const fetchCopago = async () => {
      if (formData.obra_social_id && selectedService) {
        try {
          const data = await copagosApi.obtener(selectedService.id, formData.obra_social_id)
          // @ts-ignore
          setCopago(data)
        } catch (error) {
          console.error("Error fetching copago:", error)
          setCopago(null)
        }
      } else {
        setCopago(null)
      }
    }
    fetchCopago()
  }, [formData.obra_social_id, selectedService])

  const handleChange = (field: keyof CrearPacienteData, value: string | number) => {
    setFormData((prev: CrearPacienteData) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: Partial<Record<keyof CrearPacienteData, string>>) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Tus Datos</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Completa el formulario para confirmar tu turno.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Datos personales */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 text-[#026498]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            Información Personal
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Input
              label="Nombre *"
              type="text"
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              error={errors.nombre}
              placeholder="Tu nombre"
              className="h-12"
            />
            <Input
              label="Apellido *"
              type="text"
              value={formData.apellido}
              onChange={(e) => handleChange("apellido", e.target.value)}
              error={errors.apellido}
              placeholder="Tu apellido"
              className="h-12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Select
              label="Tipo de Documento *"
              value={formData.tipo_documento}
              onChange={(e) => handleChange("tipo_documento", e.target.value)}
              options={[
                { value: "DNI", label: "DNI" },
                { value: "Pasaporte", label: "Pasaporte" },
                { value: "Cédula", label: "Cédula" },
              ]}
              className="h-12"
            />
            <div className="md:col-span-2">
              <Input
                label="Número de Documento *"
                type="text"
                value={formData.numero_documento}
                onChange={(e) => handleChange("numero_documento", e.target.value)}
                error={errors.numero_documento}
                placeholder="12345678"
                className="h-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Fecha de Nacimiento *"
              type="date"
              value={formData.fecha_nacimiento}
              onChange={(e) => handleChange("fecha_nacimiento", e.target.value)}
              error={errors.fecha_nacimiento}
              className="h-12"
            />
            <Select
              label="Sexo *"
              value={formData.sexo || "Masculino"}
              onChange={(e) => handleChange("sexo", e.target.value)}
              options={[
                { value: "Masculino", label: "Masculino" },
                { value: "Femenino", label: "Femenino" },
                { value: "Otro", label: "Otro" },
              ]}
              className="h-12"
            />
          </div>
        </div>

        {/* Motivo de la solicitud */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <label className="block text-sm font-bold text-gray-700 mb-2">Motivo de la solicitud de turno</label>
          <textarea
            rows={4}
            value={formData.observaciones || ""}
            onChange={(e) => handleChange("observaciones", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#026498] focus:border-transparent hover:border-blue-300 bg-gray-50 focus:bg-white resize-none"
            placeholder="Describa brevemente el motivo de su consulta..."
          />
        </div>

        {/* Contacto */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 text-[#026498]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            Contacto
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Input
              label="Teléfono *"
              type="tel"
              value={formData.telefono || ""}
              onChange={(e) => handleChange("telefono", e.target.value)}
              error={errors.telefono}
              placeholder="+54 11 1234-5678"
              className="h-12"
            />
            <Input
              label="Email *"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
              placeholder="tu@email.com"
              className="h-12"
            />
          </div>

          <Input
            label="Dirección"
            type="text"
            value={formData.direccion || ""}
            onChange={(e) => handleChange("direccion", e.target.value)}
            placeholder="Calle 123, Ciudad"
            className="h-12"
          />
        </div>

        {/* Obra social */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 text-[#026498]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            Cobertura Médica
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Obra Social"
              value={formData.obra_social_id?.toString() || ""}
              onChange={(e) => handleChange("obra_social_id", Number(e.target.value))}
              options={[
                { value: "", label: "Seleccione una obra social" },
                ...obrasSociales.map((os: ObraSocial) => ({ value: os.id.toString(), label: os.nombre })),
              ]}
              className="h-12"
            />
            <Input
              label="Número de Afiliado"
              type="text"
              value={formData.numero_afiliado || ""}
              onChange={(e) => handleChange("numero_afiliado", e.target.value)}
              placeholder="123456789"
              className="h-12"
            />
          </div>
        </div>

        {/* Contacto de emergencia */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 text-[#026498]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            Contacto de Emergencia
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre del Contacto"
              type="text"
              value={formData.contacto_emergencia || ""}
              onChange={(e) => handleChange("contacto_emergencia", e.target.value)}
              placeholder="Nombre del contacto"
              className="h-12"
            />
            <Input
              label="Teléfono de Emergencia"
              type="tel"
              value={formData.telefono_emergencia || ""}
              onChange={(e) => handleChange("telefono_emergencia", e.target.value)}
              placeholder="+54 11 1234-5678"
              className="h-12"
            />
          </div>
        </div>



        <div className="pt-6">
          <Button
            type="submit"
            loading={loading}
            className="w-full h-14 text-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 bg-[#026498] hover:bg-[#0c4a6e] rounded-xl"
          >
            Confirmar Cita
          </Button>
        </div>
      </form>
    </div>
  )
}
