"use client"

import type React from "react"
import { useState } from "react"
import {
  FileText,
  ChevronLeft,
  MoreVertical,
  Camera,
  Smile,
} from "lucide-react"
import { Button } from "../ui/Button"
import type { Paciente } from "../../types"
import { ClinicalHistorySection } from "./ClinicalHistorySection"
import { OdontogramSection } from "./OdontogramSection"
import { PrescriptionsSection } from "./PrescriptionsSection"
import { TreatmentPlansSection } from "./TreatmentPlansSection"
import { FilesSection } from "./FilesSection"
import { CuentaCorrienteSection } from "./CuentaCorrienteSection"
import { RemindersSection } from "./RemindersSection"
import { TurnosSection } from "./TurnosSection"

interface PatientDetailViewProps {
  patient: Paciente
  onBack: () => void
  onEdit: (patient: Paciente) => void
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>, patientId: string) => void
  uploadingPhoto: boolean
  getPhotoUrl: (patient: Paciente) => string | null
}

type TabType = "informacion" | "historia" | "odontograma" | "prescripciones" | "tratamientos" | "archivos" | "cuenta_corriente" | "recordatorios" | "turnos"

export const PatientDetailView: React.FC<PatientDetailViewProps> = ({
  patient,
  onBack,
  onEdit,
  onPhotoUpload,
  uploadingPhoto,
  getPhotoUrl,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("informacion")

  const tabs = [
    { id: "informacion" as TabType, label: "Información" },
    { id: "historia" as TabType, label: "Historia Clínica" },
    { id: "odontograma" as TabType, label: "Odontograma" },
    { id: "prescripciones" as TabType, label: "Prescripciones" },
    { id: "tratamientos" as TabType, label: "Tratamientos" },
    { id: "archivos" as TabType, label: "Archivos" },
    { id: "cuenta_corriente" as TabType, label: "Cuenta Corriente" },
    { id: "recordatorios" as TabType, label: "Recordatorios" },
    { id: "turnos" as TabType, label: "Turnos" },
  ]

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  // Helper para extraer un color a partir del nombre del paciente para avatares vacíos
  const getAvatarInitials = (name: string, lastName: string) => {
    return `${name?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  return (
    <div className="flex flex-col h-full bg-white min-h-[calc(100vh-3rem)] -m-3 lg:-m-6 p-6 lg:p-10">
      {/* Top Title Bar (simulating the global header context if needed, but keeping it integrated) */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">Paciente</h2>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[13px] font-medium mb-8">
        <span 
          className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
          onClick={onBack}
        >
          Lista de pacientes
        </span>
        <span className="text-gray-300">&rsaquo;</span>
        <span className="text-[#2563FF]">Detalle del paciente</span>
      </div>

      {/* Profile Header Block */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="flex items-start gap-5">
          <div className="relative group">
            {getPhotoUrl(patient) ? (
              <img
                src={getPhotoUrl(patient)!}
                alt={`${patient.nombre} ${patient.apellido}`}
                className="h-[88px] w-[88px] rounded-full object-cover border border-gray-100 shadow-sm"
              />
            ) : (
              <div className="h-[88px] w-[88px] rounded-full bg-[#E5EDFF] flex items-center justify-center border border-blue-100 shadow-sm">
                <span className="text-[#2563FF] text-2xl font-bold">
                  {getAvatarInitials(patient.nombre, patient.apellido)}
                </span>
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200">
              <Camera className="h-6 w-6 text-white" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPhotoUpload(e, patient.id)}
                disabled={uploadingPhoto}
              />
            </label>
            {uploadingPhoto && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
                <div className="h-5 w-5 border-2 border-[#2563FF] border-t-transparent animate-spin rounded-full" />
              </div>
            )}
          </div>

          <div className="pt-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">
              {patient.nombre} {patient.apellido}
            </h1>
            <div className="flex items-center">
              <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-sm hover:border-gray-300 transition-colors overflow-hidden">
                <div className="flex items-center px-3 py-2 text-[13px] text-gray-600 border-r border-gray-200">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="max-w-[200px] truncate">
                    {patient.informacion_adicional || "Sin notas u observaciones"}
                  </span>
                </div>
                <button 
                  onClick={() => onEdit(patient)}
                  className="px-4 py-2 text-[13px] font-semibold text-[#2563FF] hover:bg-blue-50 transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button className="bg-[#4361EE] hover:bg-[#3651d4] text-white font-medium rounded-lg px-5 py-2.5 h-auto text-[14px] shadow-sm transition-all">
            Agendar Turno
          </Button>
          <button className="h-[42px] w-[42px] flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar">
        <div className="flex gap-8 px-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-[14px] font-medium whitespace-nowrap border-b-2 transition-all ${
                  isActive 
                    ? "border-[#4361EE] text-[#4361EE]" 
                    : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === "informacion" && (
          <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
            {/* Minimalist Info Card to replace the heavy previous design */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Información Personal</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-[13px] text-gray-500">Documento</div>
                    <div className="col-span-2 text-[13px] font-medium text-gray-900">{patient.tipo_documento} {patient.numero_documento}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-[13px] text-gray-500">Nacimiento</div>
                    <div className="col-span-2 text-[13px] font-medium text-gray-900">
                      {patient.fecha_nacimiento ? new Date(patient.fecha_nacimiento).toLocaleDateString("es-ES") : "-"} 
                      <span className="text-gray-400 ml-1">({calculateAge(patient.fecha_nacimiento)} años)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-[13px] text-gray-500">Sexo</div>
                    <div className="col-span-2 text-[13px] font-medium text-gray-900">{patient.sexo}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-[13px] text-gray-500">Ocupación</div>
                    <div className="col-span-2 text-[13px] font-medium text-gray-900">{patient.ocupacion || "-"}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Contacto y Cobertura</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-[13px] text-gray-500">Teléfono</div>
                    <div className="col-span-2 text-[13px] font-medium text-gray-900">{patient.telefono || "-"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-[13px] text-gray-500">Email</div>
                    <div className="col-span-2 text-[13px] font-medium text-gray-900">{patient.email || "-"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-[13px] text-gray-500">Dirección</div>
                    <div className="col-span-2 text-[13px] font-medium text-gray-900">{patient.direccion || "-"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-[13px] text-gray-500">Obra Social</div>
                    <div className="col-span-2 text-[13px] font-medium text-gray-900">
                      {patient.obra_social_nombre_custom || patient.obraSocial?.nombre || "Particular"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-[13px] text-gray-500">Afiliado Nº</div>
                    <div className="col-span-2 text-[13px] font-medium text-gray-900">{patient.numero_afiliado || "-"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="animate-in fade-in duration-300">
          {activeTab === "historia" && <ClinicalHistorySection pacienteId={patient.id} />}
          {activeTab === "odontograma" && (
            <div className="w-full">
              {/* Service Toggle */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[15px] font-bold text-gray-900">Service</span>
                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                  <button className="px-5 py-1.5 bg-white text-gray-900 text-[13px] font-bold rounded-lg shadow-sm border border-gray-100">
                    Medical
                  </button>
                  <button className="px-5 py-1.5 text-gray-400 text-[13px] font-bold hover:text-gray-700 transition-colors">
                    Cosmetic
                  </button>
                </div>
              </div>

              {/* 2 Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Odontogram */}
                <div className="lg:col-span-5 border border-gray-100 rounded-[1.5rem] p-6 bg-white shadow-sm flex flex-col items-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-8">Odontogram</h3>
                  <div className="w-full overflow-hidden transform scale-90">
                    <OdontogramSection pacienteId={patient.id} />
                  </div>
                </div>

                {/* Right Column - Timeline */}
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="px-2 py-1 bg-[#F5F8FF] border border-[#E0E7FF] text-[#4361EE] text-xs font-bold rounded flex items-center gap-1">
                       <Smile className="w-3 h-3" /> 22
                    </div>
                    <h3 className="text-lg font-bold text-[#1e293b]">Maxillary Left Lateral Incisor</h3>
                  </div>

                  <div className="relative pl-6 border-l border-gray-200 space-y-10 ml-4">
                    {/* Timeline Item 1 */}
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-3 h-3 bg-gray-400 rounded-full ring-4 ring-white" />
                      <div className="grid grid-cols-5 gap-4 mb-3">
                        <div className="col-span-1">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">MEI</p>
                          <p className="text-lg font-bold text-gray-900 leading-none mt-1">03</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">CONDITON</p>
                          <p className="text-[13px] font-medium text-gray-900 mt-1">Caries</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">TREATMENT</p>
                          <p className="text-[13px] font-medium text-gray-900 mt-1">Tooth filling</p>
                        </div>
                        <div className="col-span-2 flex justify-between items-start">
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">DENTIST</p>
                            <p className="text-[13px] font-medium text-gray-900 mt-1">Drg Soap Mactavish</p>
                          </div>
                          <span className="text-[12px] font-bold text-emerald-500 flex items-center gap-1">
                            ✓ Done
                          </span>
                        </div>
                      </div>
                      <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl p-3 flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-[13px] text-gray-600">Advanced Decay</span>
                      </div>
                    </div>

                    {/* Timeline Item 2 */}
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-3 h-3 bg-[#64748B] rounded-full ring-4 ring-white" />
                      <div className="grid grid-cols-5 gap-4 mb-3">
                        <div className="col-span-1">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">APR</p>
                          <p className="text-lg font-bold text-gray-900 leading-none mt-1">12</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">CONDITON</p>
                          <p className="text-[13px] font-medium text-gray-900 mt-1">Caries</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">TREATMENT</p>
                          <p className="text-[13px] font-medium text-gray-900 mt-1">Tooth filling</p>
                        </div>
                        <div className="col-span-2 flex justify-between items-start">
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">DENTIST</p>
                            <p className="text-[13px] font-medium text-gray-900 mt-1">Drg Soap Mactavish</p>
                          </div>
                          <span className="text-[12px] font-bold text-amber-500 flex items-center gap-1">
                            ⏳ Pending
                          </span>
                        </div>
                      </div>
                      <div className="pl-6 border-l-2 border-[#4361EE] ml-2 mb-3">
                        <span className="text-[13px] text-gray-600 font-medium">Reason: Not enough time</span>
                      </div>
                      <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl p-3 flex items-start gap-2 ml-2">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-[13px] text-gray-600">Decay in pulp</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "prescripciones" && <PrescriptionsSection pacienteId={patient.id} />}
          {activeTab === "tratamientos" && <TreatmentPlansSection pacienteId={patient.id} />}
          {activeTab === "archivos" && <FilesSection pacienteId={patient.id} />}
          {activeTab === "cuenta_corriente" && <CuentaCorrienteSection pacienteId={patient.id} />}
          {activeTab === "recordatorios" && <RemindersSection pacienteId={patient.id} />}
          {activeTab === "turnos" && <TurnosSection pacienteId={patient.id} />}
        </div>
      </div>
    </div>
  )
}
