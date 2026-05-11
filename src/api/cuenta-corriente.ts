import { apiClient } from '../lib/api-client'
import type { MovimientoCuenta } from '../types'

interface RegistrarMovimientoData {
    fecha: string
    tipo: 'Ingreso' | 'Deuda' | 'Egreso'
    monto: number
    forma_pago?: string
    descripcion?: string
}

interface CuentaCorrienteResponse {
    movimientos: MovimientoCuenta[]
    resumen: {
        ingresos: number
        deudas: number
        saldo: number
    }
}

export const cuentaCorrienteApi = {
    getByPaciente: async (pacienteId: string): Promise<CuentaCorrienteResponse> => {
        return await apiClient.get<CuentaCorrienteResponse>(`/cuenta-corriente/${pacienteId}`)
    },

    registrar: async (pacienteId: string, data: RegistrarMovimientoData): Promise<MovimientoCuenta> => {
        return await apiClient.post<MovimientoCuenta>(`/cuenta-corriente/${pacienteId}`, data)
    },

    eliminar: async (id: number): Promise<void> => {
        await apiClient.delete(`/cuenta-corriente/${id}`)
    },

    getDeudores: async (): Promise<any[]> => {
        return await apiClient.get<any[]>('/cuenta-corriente/deudores')
    },

    getFlujoCaja: async (): Promise<{ movimientos: any[], balance: number }> => {
        return await apiClient.get<{ movimientos: any[], balance: number }>('/cuenta-corriente/caja')
    },

    registrarCaja: async (data: RegistrarMovimientoData & { pacienteId?: string }): Promise<MovimientoCuenta> => {
        return await apiClient.post<MovimientoCuenta>('/cuenta-corriente/caja', data)
    }
}

export const getDeudores = cuentaCorrienteApi.getDeudores
