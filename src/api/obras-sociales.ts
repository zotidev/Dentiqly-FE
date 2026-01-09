import { apiClient } from "../lib/api-client"
import type { ObraSocial } from "../types"

export const obrasSocialesApi = {
    async listar(): Promise<ObraSocial[]> {
        return apiClient.get<ObraSocial[]>("/obras-sociales")
    },
    async getAll(): Promise<ObraSocial[]> {
        return apiClient.get<ObraSocial[]>("/obras-sociales")
    },
}
