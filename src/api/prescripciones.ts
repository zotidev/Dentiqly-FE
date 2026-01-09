import { apiClient } from "../lib/api-client"
import type { Prescripcion, CrearPrescripcionData } from "../types"

export const prescripcionesApi = {
  listar: async (pacienteId: number): Promise<Prescripcion[]> => {
    return apiClient.get<Prescripcion[]>(`/prescripciones?paciente_id=${pacienteId}`)
  },

  obtener: async (id: number): Promise<Prescripcion> => {
    return apiClient.get<Prescripcion>(`/prescripciones/${id}`)
  },

  crear: async (data: CrearPrescripcionData): Promise<Prescripcion> => {
    return apiClient.post<Prescripcion>("/prescripciones", data)
  },

  actualizar: async (id: number, data: Partial<CrearPrescripcionData>): Promise<Prescripcion> => {
    return apiClient.put<Prescripcion>(`/prescripciones/${id}`, data)
  },

  eliminar: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/prescripciones/${id}`)
  },
}
