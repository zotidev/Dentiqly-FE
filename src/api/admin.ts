import { apiClient } from "../lib/api-client"
import type { Profesional, Servicio, Turno, CrearProfesionalData, CrearServicioData, PaginatedResponse, AsignarServicioData } from "../types"
import type { CrearSubServicioData, SubServicio } from "../types/admin"

export const adminApi = {
  // Profesionales
  profesionales: {
    async listar(params?: { page?: number; limit?: number; search?: string; estado?: string }): Promise<
      PaginatedResponse<Profesional>
    > {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append("page", params.page.toString())
      if (params?.limit) queryParams.append("limit", params.limit.toString())
      if (params?.search) queryParams.append("search", params.search)
      if (params?.estado) queryParams.append("estado", params.estado)

      const endpoint = `/profesionales${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
      const response = await apiClient.get<{ profesionales: Profesional[]; pagination: any }>(endpoint)

      return {
        data: response.profesionales,
        pagination: response.pagination,
      }
    },

    async crear(data: CrearProfesionalData): Promise<Profesional> {
      return apiClient.post<Profesional>("/profesionales", data)
    },

    async actualizar(id: string | number, data: Partial<CrearProfesionalData>): Promise<Profesional> {
      return apiClient.put<Profesional>(`/profesionales/${id}`, data)
    },

    async eliminar(id: string | number): Promise<{ message: string }> {
      return apiClient.delete<{ message: string }>(`/profesionales/${id}`)
    },

    async obtenerServicios(id: string | number): Promise<{ servicios: Servicio[] }> {
      return apiClient.get<{ servicios: Servicio[] }>(`/profesionales/${id}/servicios`)
    },

    async asignarServicios(id: string | number, data: AsignarServicioData): Promise<{ message: string; servicios: Servicio[] }> {
      return apiClient.post<{ message: string; servicios: Servicio[] }>(`/profesionales/${id}/servicios`, data)
    },

    async removerServicio(id: string | number, servicioId: string | number): Promise<{ message: string }> {
      return apiClient.delete<{ message: string }>(`/profesionales/${id}/servicios/${servicioId}`)
    },
    async subirFoto(id: string | number, file: File): Promise<{ foto_url: string }> {
      const formData = new FormData()
      formData.append("foto", file)
      return apiClient.post<{ foto_url: string }>(`/profesionales/${id}/foto`, formData)
    },
  },

  // Servicios
  servicios: {
    async listar(params?: {
      page?: number
      limit?: number
      search?: string
      categoria?: string
      estado?: string
    }): Promise<PaginatedResponse<Servicio>> {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append("page", params.page.toString())
      if (params?.limit) queryParams.append("limit", params.limit.toString())
      if (params?.search) queryParams.append("search", params.search)
      if (params?.categoria) queryParams.append("categoria", params.categoria)
      if (params?.estado) queryParams.append("estado", params.estado)

      const endpoint = `/servicios${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
      const response = await apiClient.get<{ servicios: Servicio[]; pagination: any }>(endpoint)

      return {
        data: response.servicios,
        pagination: response.pagination,
      }
    },

    async crear(data: CrearServicioData): Promise<Servicio> {
      return apiClient.post<Servicio>("/servicios", data)
    },

    async actualizar(id: string | number, data: Partial<CrearServicioData>): Promise<Servicio> {
      return apiClient.put<Servicio>(`/servicios/${id}`, data)
    },

    async eliminar(id: string | number): Promise<{ message: string }> {
      return apiClient.delete<{ message: string }>(`/servicios/${id}`)
    },

    async obtenerSubservicios(id: string | number): Promise<PaginatedResponse<SubServicio>> {
      const response = await apiClient.get<{ subservicios: SubServicio[]; pagination: any }>(
        `/servicios/${id}/subservicios`,
      )
      return {
        data: response.subservicios,
        pagination: response.pagination,
      }
    },

    async obtenerProfesionales(id: string | number): Promise<{ profesionales: Profesional[] }> {
      return apiClient.get<{ profesionales: Profesional[] }>(`/servicios/${id}/profesionales`)
    },
  },

  // SubServicios
  subservicios: {
    async crear(data: CrearSubServicioData): Promise<SubServicio> {
      return apiClient.post<SubServicio>("/servicios/subservicios", data)
    },

    async actualizar(id: string | number, data: Partial<CrearSubServicioData>): Promise<SubServicio> {
      return apiClient.put<SubServicio>(`/servicios/subservicios/${id}`, data)
    },

    async eliminar(id: string | number): Promise<{ message: string }> {
      return apiClient.delete<{ message: string }>(`/servicios/subservicios/${id}`)
    },
  },

  // Turnos para calendario
  turnos: {
    async listarPorFecha(fechaInicio: string, fechaFin: string): Promise<PaginatedResponse<Turno>> {
      const queryParams = new URLSearchParams({
        fecha_desde: fechaInicio,
        fecha_hasta: fechaFin,
      })
      const response = await apiClient.get<{ turnos: Turno[]; pagination: any }>(`/turnos?${queryParams.toString()}`)
      return {
        data: response.turnos,
        pagination: response.pagination,
      }
    },
  },
}
