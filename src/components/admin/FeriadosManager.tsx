"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "../ui/Card"
import { Button } from "../ui/Button"
import { Calendar, Trash2, Plus, X } from "lucide-react"
import { feriadosApi, type Feriado } from "../../api/feriados"

export const FeriadosManager: React.FC = () => {
  const [feriados, setFeriados] = useState<Feriado[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ fecha: "", descripcion: "" })
  const [saving, setSaving] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    fetchFeriados()
  }, [selectedYear])

  const fetchFeriados = async () => {
    try {
      setLoading(true)
      const data = await feriadosApi.listar(selectedYear)
      setFeriados(data || [])
    } catch (error) {
      console.error("Error fetching holidays:", error)
      setFeriados([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      await feriadosApi.crear(formData)
      setShowModal(false)
      setFormData({ fecha: "", descripcion: "" })
      fetchFeriados()
    } catch (error: any) {
      alert(error.message || "Error al crear feriado")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este feriado?")) {
      try {
        await feriadosApi.eliminar(id)
        fetchFeriados()
      } catch (error) {
        console.error("Error deleting holiday:", error)
      }
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="bg-[#f0f2f5] min-h-screen p-4 sm:p-8 rounded-3xl font-sans space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Feriados</h1>
          <p className="text-gray-500 mt-1">Configura los días feriados donde no se agendarán turnos</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border-none bg-white rounded-full font-medium focus:ring-2 focus:ring-blue-500"
          >
            {[2025, 2026, 2027, 2028].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-2 bg-[#2563FF] text-white rounded-full font-medium hover:bg-blue-700 transition shadow-md shadow-blue-500/20">
            <Plus className="w-4 h-4" /> Agregar Feriado
          </button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">Cargando...</td>
                </tr>
              ) : feriados.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    No hay feriados cargados para {selectedYear}
                  </td>
                </tr>
              ) : (
                feriados.map((feriado) => (
                  <tr key={feriado.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{formatDate(feriado.fecha)}</div>
                          <div className="text-xs text-gray-500">{feriado.fecha}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{feriado.descripcion || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => handleDelete(feriado.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Crear Feriado */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Agregar Feriado</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                <input
                  type="date"
                  required
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input
                  type="text"
                  placeholder="Ej: Día de la Independencia"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Guardando..." : "Agregar Feriado"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
