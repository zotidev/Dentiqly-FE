import { apiClient } from "../lib/api-client"
import type { Copago } from "../types"

export const copagosApi = {
    async obtener(servicio_id: number, obra_social_id: number): Promise<Copago | { monto: number; mensaje: string }> {
        return apiClient.get<Copago | { monto: number; mensaje: string }>(
            `/copagos?servicio_id=${servicio_id}&obra_social_id=${obra_social_id}`,
        )
    },
}
