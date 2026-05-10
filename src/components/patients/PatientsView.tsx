"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "../ui/Card"
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
  Calendar,
  Mail,
  MapPin,
  ArrowUpDown,
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
  const [totalPatients, setTotalPatients] = useState(0)
  const [selectedPatient, setSelectedPatient] = useState<Paciente | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<"view" | "create" | "edit">("view")
  const [formData, setFormData] = useState<Partial<CrearPacienteData>>({})
  const [obrasSociales, setObrasSociales] = useState<ObraSocial[]>([])
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "detail">("list")
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
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
      setTotalPatients(response?.pagination?.total || response?.data?.length || 0)
    } catch (error) {
      console.error("Error fetching patients:", error)
      setPatients([])
      setTotalPages(1)
      setTotalPatients(0)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePatient = () => {
    setFormData({ condicion: "Activo", tipo_facturacion: "B" })
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
    if (!birthDate) return "—"
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, patientId: string) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingPhoto(true)
      const fd = new FormData()
      fd.append("foto", file)
      const updated = await apiClient.put<Paciente>(`/pacientes/${patientId}/foto`, fd)
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

  const getInitials = (nombre: string, apellido: string) => {
    return `${(nombre || "").charAt(0)}${(apellido || "").charAt(0)}`.toUpperCase()
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
    <div className="bg-[#f0f2f5] min-h-screen p-4 sm:p-8 rounded-3xl font-sans space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Pacientes</h1>
          <p className="text-gray-500 mt-1">Administra los pacientes registrados en el centro</p>
        </div>
        <button
          onClick={handleCreatePatient}
          className="flex items-center gap-2 px-6 py-2 bg-[#2563FF] text-white rounded-full font-medium hover:bg-blue-700 transition shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Nuevo Paciente
        </button>
      </div>

      {/* Barra de búsqueda + contador */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <Card className="flex-1 !py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, DNI, teléfono o email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 focus:outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </Card>
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm">
          <User className="h-4 w-4 text-[#2563FF]" />
          <span className="text-sm font-semibold text-gray-900">{totalPatients}</span>
          <span className="text-sm text-gray-400">pacientes en total</span>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    Paciente <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    Teléfono <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    Email <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    Documento <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    Edad / Sexo <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Estado
                </th>
                <th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
                        <div className="space-y-1">
                          <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                          <div className="h-2 w-20 bg-gray-100 rounded animate-pulse" />
                        </div>
                      </div>
                    </td>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                    <td className="px-5 py-4" />
                  </tr>
                ))
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <User className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-gray-500">No hay pacientes registrados</p>
                    <p className="text-sm mt-1">Comienza registrando tu primer paciente</p>
                  </td>
                </tr>
              ) : (
                patients.map((patient, idx) => (
                  <tr
                    key={patient.id}
                    className={`border-b border-gray-50 hover:bg-blue-50/40 transition-colors cursor-pointer ${idx === patients.length - 1 ? "border-b-0" : ""
                      }`}
                    onClick={() => handleViewPatient(patient)}
                  >
                    {/* Nombre + avatar */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          {getPhotoUrl(patient) ? (
                            <img
                              src={getPhotoUrl(patient)!}
                              alt={`${patient.nombre} ${patient.apellido}`}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#2563FF]/10 flex items-center justify-center text-[#2563FF] text-xs font-bold">
                              {getInitials(patient.nombre, patient.apellido)}
                            </div>
                          )}
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${patient.condicion === "Activo" ? "bg-green-500" : "bg-gray-300"
                              }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                            {patient.apellido}, {patient.nombre}
                          </p>
                          <p className="text-xs text-gray-400">{patient.obra_social?.nombre || "Sin obra social"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Teléfono */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 whitespace-nowrap">
                        <Phone className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
                        {patient.telefono || <span className="text-gray-300">—</span>}
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Mail className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">
                          {patient.email || <span className="text-gray-300">—</span>}
                        </span>
                      </div>
                    </td>

                    {/* Documento */}
                    <td className="px-5 py-3">
                      <div className="text-sm text-gray-600 whitespace-nowrap">
                        <span className="text-xs font-medium text-gray-400 mr-1">{patient.tipo_documento}</span>
                        {patient.numero_documento || <span className="text-gray-300">—</span>}
                      </div>
                    </td>

                    {/* Edad / Sexo */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 whitespace-nowrap">
                        <Calendar className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
                        {patient.fecha_nacimiento
                          ? `${calculateAge(patient.fecha_nacimiento)} años · ${patient.sexo || "—"}`
                          : <span className="text-gray-300">—</span>
                        }
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${patient.condicion === "Activo"
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-100 text-gray-500"
                          }`}
                      >
                        {patient.condicion || "Inactivo"}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-5 py-3">
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleEditPatient(patient)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#2563FF] hover:bg-blue-50 transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePatientClick(patient.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación dentro del bloque blanco */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              Página <span className="font-semibold text-gray-700">{currentPage}</span> de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Creación / Edición */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalMode === "create" ? "Nuevo Paciente" : "Editar Paciente"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                  <input
                    type="text"
                    required
                    value={formData.apellido || ""}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563FF] focus:border-transparent"
                    placeholder="Apellido del paciente"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre || ""}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563FF] focus:border-transparent"
                    placeholder="Nombre del paciente"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento *</label>
                  <select
                    required
                    value={formData.tipo_documento || ""}
                    onChange={(e) => setFormData({ ...formData, tipo_documento: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563FF] focus:border-transparent"
                  >
                    <option value="">Seleccionar</option>
                    <option value="DNI">DNI</option>
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="Cédula">Cédula</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Documento *</label>
                  <input
                    type="text"
                    required
                    value={formData.numero_documento || ""}
                    onChange={(e) => setFormData({ ...formData, numero_documento: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563FF] focus:border-transparent"
                    placeholder="Ej: 35.123.456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
                  <input
                    type="date"
                    required
                    value={formData.fecha_nacimiento || ""}
                    onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563FF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sexo *</label>
                  <select
                    required
                    value={formData.sexo || ""}
                    onChange={(e) => setFormData({ ...formData, sexo: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563FF] focus:border-transparent"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono || ""}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563FF] focus:border-transparent"
                    placeholder="Ej: +54 9 11 ..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563FF] focus:border-transparent"
                    placeholder="paciente@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Obra Social</label>
                  <select
                    value={formData.obra_social_id || ""}
                    onChange={(e) => setFormData({ ...formData, obra_social_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563FF] focus:border-transparent"
                  >
                    <option value="">Sin obra social</option>
                    {obrasSociales.map((os) => (
                      <option key={os.id} value={os.id}>
                        {os.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condición</label>
                  <select
                    value={formData.condicion || "Activo"}
                    onChange={(e) => setFormData({ ...formData, condicion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563FF] focus:border-transparent"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {modalMode === "create" ? "Crear" : "Actualizar"} Paciente
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        onConfirm={handleConfirmDeletePatient}
        title="Eliminar Paciente"
        message="¿Estás seguro de que deseas eliminar este paciente? Esta acción no se puede deshacer."
      />
    </div>
  )
}