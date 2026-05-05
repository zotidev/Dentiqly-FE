import { apiClient } from "../lib/api-client"
import type { ObraSocial } from "../types"

export const obrasSocialesApi = {
    async listar(): Promise<ObraSocial[]> {
        return apiClient.get<ObraSocial[]>("/obras-sociales")
    },
    async getAll(): Promise<ObraSocial[]> {
        return apiClient.get<ObraSocial[]>("/obras-sociales")
    },
    async crear(data: { nombre: string; plan?: string }): Promise<ObraSocial> {
        return apiClient.post<ObraSocial>("/obras-sociales", data)
    },
    async actualizar(id: number, data: { nombre: string; plan?: string }): Promise<ObraSocial> {
        return apiClient.put<ObraSocial>(`/obras-sociales/${id}`, data)
    },
    async eliminar(id: number): Promise<void> {
        return apiClient.delete(`/obras-sociales/${id}`)
    },
}
