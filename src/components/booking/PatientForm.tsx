"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "../ui/Input"
import { Select } from "../ui/Select"
import type { CrearPacienteData, ObraSocial } from "../../types"
import { obrasSocialesApi } from "../../api/obras-sociales"
import { User, Heart, Shield, Phone, Mail, MapPin } from "lucide-react"

interface PatientFormProps {
  onPatientData: (data: CrearPacienteData) => void
  loading?: boolean
}

export const PatientForm: React.FC<PatientFormProps> = ({ onPatientData, loading = false }) => {
  const [obrasSociales, setObrasSociales] = useState<ObraSocial[]>([])
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
    obra_social_nombre_custom: "",
  })

  const COMMON_OBRAS_SOCIALES = [
    "Particular",
    "OSDE",
    "Swiss Medical",
    "Galeno",
    "Medicus",
    "Sancor Salud",
    "IOMA",
    "PAMI",
    "Omint",
    "Prevención Salud"
  ];

  const [errors, setErrors] = useState<Partial<Record<keyof CrearPacienteData, string>>>({})

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
    
    // Load cached patient data
    const cached = localStorage.getItem("dentiqly_patient_data")
    if (cached) {
      try {
        const parsedData = JSON.parse(cached)
        // No cargamos las observaciones anteriores
        setFormData(prev => ({ ...prev, ...parsedData, observaciones: "" }))
      } catch (e) {
        console.error("Error loading cached patient data:", e)
      }
    }
  }, [])

  // Save to cache whenever formData changes (except observaciones)
  useEffect(() => {
    const dataToCache = { ...formData }
    delete dataToCache.observaciones
    localStorage.setItem("dentiqly_patient_data", JSON.stringify(dataToCache))
  }, [formData])

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CrearPacienteData, string>> = {}
    if (!formData.nombre.trim()) newErrors.nombre = "Requerido"
    if (!formData.apellido.trim()) newErrors.apellido = "Requerido"
    if (!formData.numero_documento.trim()) newErrors.numero_documento = "Requerido"
    if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = "Requerido"
    if (!formData.telefono?.trim()) newErrors.telefono = "Requerido"
    if (!formData.email?.trim()) newErrors.email = "Requerido"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) onPatientData(formData)
  }

  const handleChange = (field: keyof CrearPacienteData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleObraSocialChange = (value: string) => {
    if (value === "OTRO") {
      setFormData(prev => ({ 
        ...prev, 
        obra_social_id: undefined, 
        obra_social_nombre_custom: "" 
      }))
    } else if (value.startsWith("ID:")) {
      const id = Number(value.replace("ID:", ""))
      setFormData(prev => ({ 
        ...prev, 
        obra_social_id: id, 
        obra_social_nombre_custom: undefined 
      }))
    } else {
      // Common one selected
      setFormData(prev => ({ 
        ...prev, 
        obra_social_id: undefined, 
        obra_social_nombre_custom: value 
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sección 1: Información Personal */}
      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-5">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-widest">
           <User className="text-[#2563FF]" size={16} />
           Información Personal
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Apellido *"
            value={formData.apellido}
            onChange={(e) => handleChange("apellido", e.target.value)}
            error={errors.apellido}
            placeholder="Tu apellido"
            className="bg-white"
          />
          <Input
            label="Nombre *"
            value={formData.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            error={errors.nombre}
            placeholder="Tu nombre"
            className="bg-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Select
            label="Tipo de Documento *"
            value={formData.tipo_documento}
            onChange={(e) => handleChange("tipo_documento", e.target.value)}
            options={[
              { value: "DNI", label: "DNI" },
              { value: "Pasaporte", label: "Pasaporte" },
              { value: "Cédula", label: "Cédula" },
            ]}
            className="bg-white"
          />
          <Input
            label="Número de Documento *"
            value={formData.numero_documento}
            onChange={(e) => handleChange("numero_documento", e.target.value)}
            error={errors.numero_documento}
            placeholder="12345678"
            className="bg-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Fecha de Nacimiento *"
            type="date"
            value={formData.fecha_nacimiento}
            onChange={(e) => handleChange("fecha_nacimiento", e.target.value)}
            error={errors.fecha_nacimiento}
            className="bg-white"
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
            className="bg-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative">
            <Mail className="absolute right-3 top-9 text-gray-400" size={16} />
            <Input
              label="E-mail *"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
              placeholder="ejemplo@mail.com"
              className="bg-white pr-10"
            />
          </div>
          <div className="relative">
            <Phone className="absolute right-3 top-9 text-gray-400" size={16} />
            <Input
              label="Teléfono *"
              type="tel"
              value={formData.telefono || ""}
              onChange={(e) => handleChange("telefono", e.target.value)}
              error={errors.telefono}
              placeholder="11 1234 5678"
              className="bg-white pr-10"
            />
          </div>
        </div>

        <div className="relative">
          <MapPin className="absolute right-3 top-9 text-gray-400" size={16} />
          <Input
            label="Dirección"
            value={formData.direccion || ""}
            onChange={(e) => handleChange("direccion", e.target.value)}
            placeholder="Calle 123, Ciudad"
            className="bg-white pr-10"
          />
        </div>
      </div>

      {/* Sección 2: Cobertura Médica */}
      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-5">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-widest">
           <Shield className="text-[#2563FF]" size={16} />
           Cobertura Médica
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Select
            label="Obra Social"
            value={
              formData.obra_social_id 
                ? `ID:${formData.obra_social_id}` 
                : (formData.obra_social_nombre_custom === "" || formData.obra_social_nombre_custom === undefined)
                  ? "" 
                  : COMMON_OBRAS_SOCIALES.includes(formData.obra_social_nombre_custom || "")
                    ? formData.obra_social_nombre_custom
                    : "OTRO"
            }
            onChange={(e) => handleObraSocialChange(e.target.value)}
            options={[
              { value: "", label: "Seleccione una opción" },
              ...obrasSociales.map((os) => ({ value: `ID:${os.id}`, label: os.nombre })),
              ...COMMON_OBRAS_SOCIALES.filter(name => !obrasSociales.some(os => os.nombre === name)).map(name => ({ value: name, label: name })),
              { value: "OTRO", label: "Otra (especificar)" }
            ]}
            className="bg-white"
          />
          
          {(formData.obra_social_id || (formData.obra_social_nombre_custom && COMMON_OBRAS_SOCIALES.includes(formData.obra_social_nombre_custom))) ? (
            <Input
              label="Número de Afiliado"
              value={formData.numero_afiliado || ""}
              onChange={(e) => handleChange("numero_afiliado", e.target.value)}
              placeholder="0000000000"
              className="bg-white"
            />
          ) : formData.obra_social_nombre_custom !== undefined && (
            <div className="animate-in fade-in zoom-in duration-300">
              <Input
                label="Especifique Obra Social *"
                value={formData.obra_social_nombre_custom || ""}
                onChange={(e) => handleChange("obra_social_nombre_custom", e.target.value)}
                placeholder="Nombre de su obra social"
                className="bg-white"
              />
            </div>
          )}
        </div>

        {(!formData.obra_social_id && formData.obra_social_nombre_custom !== undefined && !COMMON_OBRAS_SOCIALES.includes(formData.obra_social_nombre_custom || "") && formData.obra_social_nombre_custom !== undefined) && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <Input
              label="Número de Afiliado"
              value={formData.numero_afiliado || ""}
              onChange={(e) => handleChange("numero_afiliado", e.target.value)}
              placeholder="0000000000"
              className="bg-white"
            />
          </div>
        )}
      </div>

      {/* Sección 3: Emergencia y Otros */}
      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-5">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-widest">
           <Heart className="text-red-400" size={16} />
           Emergencia y Otros
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Contacto de Emergencia"
            value={formData.contacto_emergencia || ""}
            onChange={(e) => handleChange("contacto_emergencia", e.target.value)}
            placeholder="Nombre del contacto"
            className="bg-white"
          />
          <Input
            label="Teléfono de Emergencia"
            value={formData.telefono_emergencia || ""}
            onChange={(e) => handleChange("telefono_emergencia", e.target.value)}
            placeholder="11 1234 5678"
            className="bg-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">Motivo de consulta / Observaciones</label>
          <textarea
            value={formData.observaciones || ""}
            onChange={(e) => handleChange("observaciones", e.target.value)}
            rows={3}
            placeholder="Escribe aquí cualquier detalle relevante..."
            className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#2563FF]/20 focus:border-[#2563FF] resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 sm:h-14 bg-[#2563FF] text-white font-bold rounded-xl text-sm sm:text-base hover:bg-blue-700 transition-all uppercase tracking-widest disabled:opacity-50"
      >
        {loading ? "Cargando..." : "Confirmar Datos"}
      </button>
    </form>
  )
}
