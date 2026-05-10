"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../ui/Button"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User,
  Phone,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Calendar,
} from "lucide-react"
import { pacientesApi, obrasSocialesApi } from "../../api"
import { apiClient } from "../../lib/api-client"
import { ConfirmationModal } from "../ui/ConfirmationModal"
import type { Paciente, CrearPacienteData, ObraSocial } from "../../types"
import { PatientDetailView } from "./PatientDetailView"

export const PatientsView: React.FC = () => {
  const [patients, setPatients] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedPatient, setSelectedPatient] = useState<Paciente | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<"view" | "create" | "edit">("view")
  const [formData, setFormData] = useState<Partial<CrearPacienteData>>({})
  const [obrasSociales, setObrasSociales] = useState<ObraSocial[]>([])
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "detail">("list")
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  })

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

  useEffect(() => {
    fetchPatients()
    fetchObrasSociales()
  }, [currentPage, searchTerm])

  const fetchObrasSociales = async () => {
    try {
      const response = await obrasSocialesApi.listar()
      setObrasSociales(response || [])
    } catch (error) {
      console.error("Error fetching health insurances:", error)
    }
  }

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await pacientesApi.listar({
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
      })
      setPatients(response?.data || [])
      setTotalPages(response?.pagination?.totalPages || 1)
    } catch (error) {
      console.error("Error fetching patients:", error)
      setPatients([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePatient = () => {
    setFormData({
      condicion: "Activo",
      tipo_facturacion: "B",
    })
    setModalMode("create")
    setShowModal(true)
  }

  const handleEditPatient = (patient: Paciente) => {
    setSelectedPatient(patient)
    setFormData(patient)
    setModalMode("edit")
    setShowModal(true)
  }

  const handleViewPatient = (patient: Paciente) => {
    setSelectedPatient(patient)
    setViewMode("detail")
  }

  const handleDeletePatientClick = (id: string) => {
    setConfirmDelete({ isOpen: true, id })
  }

  const handleConfirmDeletePatient = async () => {
    if (!confirmDelete.id) return

    try {
      await pacientesApi.eliminar(confirmDelete.id)
      fetchPatients()
      setConfirmDelete({ isOpen: false, id: null })
    } catch (error) {
      console.error("Error deleting patient:", error)
      alert("Error al eliminar el paciente")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (modalMode === "create") {
        await pacientesApi.crear(formData as CrearPacienteData)
      } else if (modalMode === "edit" && selectedPatient) {
        await pacientesApi.actualizar(selectedPatient.id, formData)
      }
      setShowModal(false)
      fetchPatients()
    } catch (error) {
      console.error("Error saving patient:", error)
    }
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, patientId: string) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingPhoto(true)
      const formData = new FormData()
      formData.append("foto", file)
      const updated = await apiClient.put<Paciente>(`/pacientes/${patientId}/foto`, formData)
      if (selectedPatient && selectedPatient.id === patientId) {
        setSelectedPatient({ ...selectedPatient, foto_url: updated.foto_url })
      }
      fetchPatients()
    } catch (error) {
      console.error("Error uploading photo:", error)
      alert("Error al subir la foto")
    } finally {
      setUploadingPhoto(false)
    }
  }

  const getPhotoUrl = (patient: Paciente) => {
    if (!patient.foto_url) return null
    if (patient.foto_url.startsWith("http")) return patient.foto_url
    const baseUrl = API_BASE_URL.replace(/\/api$/, "")
    return `${baseUrl}/${patient.foto_url.replace(/^src\//, "")}`
  }

  if (viewMode === "detail" && selectedPatient) {
    return (
      <PatientDetailView
        patient={selectedPatient}
        onBack={() => setViewMode("list")}
        onEdit={(p) => {
          setSelectedPatient(p)
          setFormData(p)
          setModalMode("edit")
          setShowModal(true)
        }}
        onPhotoUpload={handlePhotoUpload}
        uploadingPhoto={uploadingPhoto}
        getPhotoUrl={getPhotoUrl}
      />
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#0A0F2D] tracking-tight">Pacientes</h2>
          <p className="text-gray-500 font-medium">Gestiona tu base de pacientes con un diseño moderno y eficiente</p>
        </div>
        <Button 
          onClick={handleCreatePatient}
          className="bg-[#2563FF] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" />
          Registrar Paciente
        </Button>
      </div>

      {/* Bento Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-2 col-span-3 shadow-sm rounded-2xl bg-white flex items-center">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
            <input
              type="text"
              placeholder="Buscar por nombre, DNI, teléfono..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-gray-300 text-gray-700"
            />
          </div>
        </div>
        <div className="p-2 shadow-sm rounded-2xl bg-[#0A0F2D] text-white flex items-center justify-center min-h-[60px]">
          <span className="text-xs font-black uppercase tracking-widest text-blue-400 mr-2">Total</span>
          <span className="text-xl font-black">{patients.length}</span>
        </div>
      </div>

      {/* Patients Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : !patients || patients.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
          <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron pacientes</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Prueba con otros términos de búsqueda o registra un nuevo paciente ahora mismo.</p>
          <Button onClick={handleCreatePatient} variant="outline" className="rounded-2xl border-gray-200">
            Registrar Paciente
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {patients.map((patient) => (
            <div 
              key={patient.id} 
              className="group relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] bg-white cursor-pointer hover:-translate-y-1 p-6"
              onClick={() => handleViewPatient(patient)}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  {getPhotoUrl(patient) ? (
                    <img
                      src={getPhotoUrl(patient)!}
                      alt={`${patient.nombre} ${patient.apellido}`}
                      className="h-16 w-16 rounded-2xl object-cover border-2 border-gray-50 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center border-2 border-gray-50 group-hover:bg-blue-100 transition-colors">
                      <User className="h-8 w-8 text-blue-300 group-hover:text-blue-500" />
                    </div>
                  )}
                  <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${patient.condicion === 'Activo' ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEditPatient(patient); }}
                    className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-blue-600 transition-all"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeletePatientClick(patient.id); }}
                    className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-[#2563FF] transition-colors truncate">
                  {patient.apellido}, {patient.nombre}
                </h3>
                <p className="text-sm text-gray-400 font-medium mb-4">{patient.tipo_documento}: {patient.numero_documento}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-50">
                <div className="flex items-center text-xs text-gray-500 font-medium">
                  <Phone className="h-3 w-3 mr-2 text-gray-300" />
                  {patient.telefono || "Sin teléfono"}
                </div>
                <div className="flex items-center text-xs text-gray-500 font-medium">
                  <Calendar className="h-3 w-3 mr-2 text-gray-300" />
                  {calculateAge(patient.fecha_nacimiento)} años · {patient.sexo}
                </div>
              </div>

              {/* Decorative bento background */}
              <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-blue-50/50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors -z-10" />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {patients && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-50 mt-8">
          <p className="text-sm font-bold text-gray-500">
            Página <span className="text-[#0A0F2D]">{currentPage}</span> de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl border-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal para Creación/Edición */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0A0F2D]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/20">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-[#0A0F2D] tracking-tight">
                {modalMode === "create" ? "Registrar Nuevo Paciente" : "Actualizar Información"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-gray-200 transition-all text-gray-400 hover:text-gray-900 group">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Apellido *</label>
                    <input
                      type="text"
                      required
                      value={formData.apellido || ""}
                      onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                      className="w-full px-5 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-medium"
                      placeholder="Apellido del paciente"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nombre *</label>
                    <input
                      type="text"
                      required
                      value={formData.nombre || ""}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-5 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-medium"
                      placeholder="Nombre del paciente"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de Documento *</label>
                    <select
                      required
                      value={formData.tipo_documento || ""}
                      onChange={(e) => setFormData({ ...formData, tipo_documento: e.target.value as any })}
                      className="w-full px-5 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-medium appearance-none"
                    >
                      <option value="">Seleccionar</option>
                      <option value="DNI">DNI</option>
                      <option value="Pasaporte">Pasaporte</option>
                      <option value="Cédula">Cédula</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Número de Documento *</label>
                    <input
                      type="text"
                      required
                      value={formData.numero_documento || ""}
                      onChange={(e) => setFormData({ ...formData, numero_documento: e.target.value })}
                      className="w-full px-5 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-medium"
                      placeholder="Ej: 35.123.456"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Fecha de Nacimiento *</label>
                    <input
                      type="date"
                      required
                      value={formData.fecha_nacimiento || ""}
                      onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                      className="w-full px-5 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Sexo *</label>
                    <select
                      required
                      value={formData.sexo || ""}
                      onChange={(e) => setFormData({ ...formData, sexo: e.target.value as any })}
                      className="w-full px-5 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-medium appearance-none"
                    >
                      <option value="">Seleccionar</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.telefono || ""}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full px-5 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-medium"
                      placeholder="Ej: +54 9 11 ..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-5 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-medium"
                      placeholder="paciente@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-8 border-t border-gray-100">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="rounded-2xl px-8 border-gray-200">
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-[#2563FF] hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-2xl shadow-lg shadow-blue-500/20 transition-all">
                    {modalMode === "create" ? "Registrar Paciente" : "Guardar Cambios"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        onConfirm={handleConfirmDeletePatient}
        title="¿Eliminar Paciente?"
        description="Esta acción es irreversible y se eliminará todo el historial médico relacionado."
        confirmText="Sí, Eliminar"
        cancelText="No, Mantener"
        variant="danger"
      />
    </div>
  )
}
