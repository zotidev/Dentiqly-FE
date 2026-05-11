import { apiClient } from "../lib/api-client"

export const sucursalesApi = {
  listar: async () => {
    return apiClient.get("/sucursales")
  },
  obtenerPorId: async (id: string) => {
    return apiClient.get(`/sucursales/${id}`)
  },
  crear: async (data: any) => {
    return apiClient.post("/sucursales", data)
  },
  actualizar: async (id: string, data: any) => {
    return apiClient.put(`/sucursales/${id}`, data)
  },
  eliminar: async (id: string) => {
    return apiClient.delete(`/sucursales/${id}`)
  },
}
