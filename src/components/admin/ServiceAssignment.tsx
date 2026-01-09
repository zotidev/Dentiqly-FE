"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "../ui/Card"
import { Button } from "../ui/Button"
import { Briefcase, Plus, X, AlertCircle } from 'lucide-react'
import { adminApi } from "../../api/admin"
import type { Profesional, Servicio } from "../../types"

interface ServiceAssignmentProps {
  professional: Profesional
  onServicesUpdate?: (servicios: Servicio[]) => void
}

export const ServiceAssignment: React.FC<ServiceAssignmentProps> = ({ professional, onServicesUpdate }) => {
  const [assignedServices, setAssignedServices] = useState<Servicio[]>([])
  const [availableServices, setAvailableServices] = useState<Servicio[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([])

  useEffect(() => {
    fetchData()
  }, [professional.id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [servicesResponse, allServicesResponse] = await Promise.all([
        adminApi.profesionales.obtenerServicios(professional.id),
        adminApi.servicios.listar({ estado: "Activo" }),
      ])

      setAssignedServices(servicesResponse.servicios)

      const assignedIds = servicesResponse.servicios.map(s => s.id)
      const available = allServicesResponse.data.filter(s => !assignedIds.includes(s.id))
      setAvailableServices(available)
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddServices = async () => {
    if (selectedServiceIds.length === 0) return

    try {
      setSaving(true)
      const response = await adminApi.profesionales.asignarServicios(professional.id, {
        servicio_ids: selectedServiceIds,
      })

      setAssignedServices(response.servicios)
      onServicesUpdate?.(response.servicios)

      const assignedIds = response.servicios.map(s => s.id)
      const available = availableServices.filter(s => !assignedIds.includes(s.id))
      setAvailableServices(available)

      setSelectedServiceIds([])
      setShowAddModal(false)
      alert("Servicios asignados correctamente")
    } catch (error) {
      console.error("Error assigning services:", error)
      alert("Error al asignar servicios. Intente nuevamente.")
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveService = async (servicioId: number) => {
    if (!confirm("¿Estás seguro de que quieres remover este servicio?")) return

    try {
      await adminApi.profesionales.removerServicio(professional.id, servicioId)

      const removedService = assignedServices.find(s => s.id === servicioId)
      const newAssigned = assignedServices.filter(s => s.id !== servicioId)

      setAssignedServices(newAssigned)
      if (removedService) {
        setAvailableServices([...availableServices, removedService])
      }

      onServicesUpdate?.(newAssigned)
      alert("Servicio removido correctamente")
    } catch (error) {
      console.error("Error removing service:", error)
      alert("Error al remover servicio. Intente nuevamente.")
    }
  }

  const toggleServiceSelection = (servicioId: number) => {
    setSelectedServiceIds(prev =>
      prev.includes(servicioId)
        ? prev.filter(id => id !== servicioId)
        : [...prev, servicioId]
    )
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Servicios Asignados
            </h3>
            <p className="text-sm text-muted-foreground">
              {professional.nombre} {professional.apellido}
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} size="sm" disabled={availableServices.length === 0}>
            <Plus className="h-4 w-4 mr-2" />
            Asignar Servicios
          </Button>
        </div>

        {assignedServices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No hay servicios asignados</p>
            <p className="text-sm">Asigna servicios a este profesional para que pueda atenderlos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {assignedServices.map((servicio) => (
              <div
                key={servicio.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{servicio.nombre}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-muted-foreground">{servicio.categoria}</span>
                    <span className="text-sm text-muted-foreground">
                      ${Number(servicio.precio_base).toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {servicio.duracion_estimada} min
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveService(servicio.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal para agregar servicios */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Asignar Servicios</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Selecciona los servicios que este profesional puede atender
              </p>
            </div>

            <div className="p-6">
              {availableServices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay más servicios disponibles para asignar</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableServices.map((servicio) => (
                    <label
                      key={servicio.id}
                      className="flex items-center p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServiceIds.includes(servicio.id)}
                        onChange={() => toggleServiceSelection(servicio.id)}
                        className="rounded border-input mr-3"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{servicio.nombre}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground">{servicio.categoria}</span>
                          <span className="text-sm text-muted-foreground">
                            ${Number(servicio.precio_base).toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {servicio.duracion_estimada} min
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-border flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false)
                  setSelectedServiceIds([])
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddServices}
                disabled={selectedServiceIds.length === 0 || saving}
              >
                {saving ? "Asignando..." : `Asignar ${selectedServiceIds.length} servicio(s)`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
