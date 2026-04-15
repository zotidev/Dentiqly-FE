import React, { useState, useEffect } from "react"
import { patientPortalApi, PacienteProfile } from "../../api/patient-portal"
import { dentalColors } from "../../config/colors"
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Heart } from "lucide-react"

export const MisDatos: React.FC = () => {
  const [perfil, setPerfil] = useState<PacienteProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const data = await patientPortalApi.obtenerPerfil()
        setPerfil(data)
      } catch (error) {
        console.error("Error al cargar perfil:", error)
      } finally {
        setLoading(false)
      }
    }
    cargarPerfil()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg" style={{ color: dentalColors.primary }}>Cargando...</div>
      </div>
    )
  }

  if (!perfil) return null

  const { paciente } = perfil

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-"
    try {
      return new Date(dateStr).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  const DataRow: React.FC<{ icon: any; label: string; value: string | null }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4 py-3 border-b" style={{ borderColor: dentalColors.gray100 }}>
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${dentalColors.primary}15` }}>
        <Icon size={20} style={{ color: dentalColors.primary }} />
      </div>
      <div className="flex-1">
        <p className="text-sm" style={{ color: dentalColors.gray600 }}>{label}</p>
        <p className="font-medium" style={{ color: dentalColors.gray800 }}>{value || "-"}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: dentalColors.gray800 }}>
        Mis Datos Personales
      </h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-4 mb-6 pb-4 border-b" style={{ borderColor: dentalColors.gray200 }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
            style={{ backgroundColor: dentalColors.primary }}
          >
            {paciente.nombre?.charAt(0)}
            {paciente.apellido?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: dentalColors.gray800 }}>
              {paciente.nombre} {paciente.apellido}
            </h2>
            <p className="text-sm" style={{ color: dentalColors.gray600 }}>
              Paciente desde {formatDate(paciente.fecha_nacimiento)}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <DataRow
            icon={User}
            label="Tipo de Documento"
            value={paciente.tipo_documento}
          />
          <DataRow
            icon={CreditCard}
            label="Numero de Documento"
            value={paciente.numero_documento}
          />
          <DataRow
            icon={Calendar}
            label="Fecha de Nacimiento"
            value={formatDate(paciente.fecha_nacimiento)}
          />
          <DataRow
            icon={User}
            label="Sexo"
            value={paciente.sexo}
          />
          <DataRow
            icon={Mail}
            label="Email"
            value={paciente.email}
          />
          <DataRow
            icon={Phone}
            label="Telefono"
            value={paciente.telefono}
          />
          <DataRow
            icon={MapPin}
            label="Direccion"
            value={paciente.direccion}
          />
          <DataRow
            icon={Heart}
            label="Obra Social"
            value={paciente.obraSocial}
          />
        </div>
      </div>

      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
        <p className="text-sm" style={{ color: "#92400E" }}>
          Para modificar tus datos personales, por favor contacta con nosotros.
        </p>
      </div>
    </div>
  )
}
