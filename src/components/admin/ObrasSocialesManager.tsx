import React, { useState, useEffect } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  X,
  Search,
  Check,
} from 'lucide-react'
import { obrasSocialesApi } from '../../api/obras-sociales'
import { ConfirmationModal } from '../ui/ConfirmationModal'
import type { ObraSocial } from '../../types'

export const ObrasSocialesManager: React.FC = () => {
  const [obrasSociales, setObrasSociales] = useState<ObraSocial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ nombre: '', plan: '' })
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  })

  useEffect(() => {
    fetchObrasSociales()
  }, [])

  const fetchObrasSociales = async () => {
    try {
      setLoading(true)
      const data = await obrasSocialesApi.listar()
      setObrasSociales(data || [])
    } catch (error) {
      console.error('Error fetching obras sociales:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingId(null)
    setFormData({ nombre: '', plan: '' })
    setShowModal(true)
  }

  const handleEdit = (os: ObraSocial) => {
    setEditingId(os.id)
    setFormData({ nombre: os.nombre, plan: '' })
    setShowModal(true)
  }

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setConfirmDelete({ isOpen: true, id })
  }

  const handleConfirmDelete = async () => {
    if (!confirmDelete.id) return

    try {
      await obrasSocialesApi.eliminar(confirmDelete.id)
      fetchObrasSociales()
    } catch (error) {
      console.error('Error deleting obra social:', error)
      alert('Error al eliminar la obra social. Puede que tenga pacientes asociados.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nombre.trim()) return

    try {
      setSaving(true)
      if (editingId) {
        await obrasSocialesApi.actualizar(editingId, formData)
      } else {
        await obrasSocialesApi.crear(formData)
      }
      setShowModal(false)
      fetchObrasSociales()
    } catch (error) {
      console.error('Error saving obra social:', error)
      alert('Error al guardar la obra social')
    } finally {
      setSaving(false)
    }
  }

  const filtered = obrasSociales.filter((os) =>
    os.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#026498]" />
            Obras Sociales
          </h2>
          <p className="text-gray-600">Gestiona las obras sociales disponibles para los pacientes</p>
        </div>
        <Button onClick={handleCreate} className="bg-[#026498]">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Obra Social
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar obra social..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm
                      ? 'No se encontraron obras sociales con ese nombre'
                      : 'No hay obras sociales registradas'}
                  </td>
                </tr>
              ) : (
                filtered.map((os) => (
                  <tr key={os.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-[#026498]" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {os.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      #{os.id}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(os)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleDeleteClick(e, os.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t bg-gray-50 text-sm text-gray-600">
          Total: {filtered.length} obra{filtered.length !== 1 ? 's' : ''} social{filtered.length !== 1 ? 'es' : ''}
        </div>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Editar Obra Social' : 'Nueva Obra Social'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Obra Social *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: OSDE, Swiss Medical..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan (opcional)
                </label>
                <input
                  type="text"
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  placeholder="Ej: Plan 210, Plan 310..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving} className="bg-[#026498]">
                  <Check className="h-4 w-4 mr-2" />
                  {saving ? 'Guardando...' : editingId ? 'Guardar Cambios' : 'Crear'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Eliminar Obra Social"
        message="¿Estás seguro de eliminar esta obra social? Los pacientes asociados perderán esta asignación. Esta acción no se puede deshacer."
      />
    </div>
  )
}
