import React, { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Plus } from 'lucide-react'
import { turnosApi, profesionalesApi, pacientesApi, serviciosApi } from '../../api'
import type { Profesional, Paciente, Servicio } from '../../types'

interface AdminAppointmentModalProps {
    onClose: () => void
    onCreate: () => void
    initialData?: Partial<{
        fecha: string
        hora_inicio: string
        hora_fin: string
        profesional_id: number
        sobre_turno: boolean
    }>
}

export const AdminAppointmentModal: React.FC<AdminAppointmentModalProps> = ({ onClose, onCreate, initialData }) => {
    const [formData, setFormData] = useState({
        paciente_id: '',
        profesional_id: initialData?.profesional_id || 0,
        servicio_id: 0,
        fecha: initialData?.fecha || new Date().toISOString().split('T')[0],
        hora_inicio: initialData?.hora_inicio || '10:00',
        hora_fin: initialData?.hora_fin || '10:30',
        estado: 'Confirmado',
        observaciones: '',
        sobre_turno: initialData?.sobre_turno || false
    })

    const [loading, setLoading] = useState(false)
    const [profesionales, setProfesionales] = useState<Profesional[]>([])
    const [pacientes, setPacientes] = useState<Paciente[]>([])
    const [servicios, setServicios] = useState<Servicio[]>([])
    const [searchPaciente, setSearchPaciente] = useState('')

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [profesionalesRes, pacientesRes, serviciosRes] = await Promise.all([
                    profesionalesApi.listar({ limit: 100, estado: 'Activo' }),
                    pacientesApi.listar({ limit: 50 }),
                    serviciosApi.listar()
                ])
                setProfesionales(profesionalesRes.data || [])
                setPacientes(pacientesRes.data || [])
                setServicios(serviciosRes.data || [])
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchInitialData()
    }, [])

    useEffect(() => {
        const fetchPacientes = async () => {
            if (searchPaciente.length > 2) {
                try {
                    const response = await pacientesApi.listar({ search: searchPaciente, limit: 10 });
                    setPacientes(response.data || [])
                } catch (error) {
                    console.error('Error fetching patients:', error)
                }
            }
        }
        const delayDebounceFn = setTimeout(() => {
            fetchPacientes()
        }, 500)
        return () => clearTimeout(delayDebounceFn)
    }, [searchPaciente])

    // Update end time based on selected service duration
    useEffect(() => {
        if (formData.servicio_id && formData.hora_inicio) {
            const servicio = servicios.find(s => s.id === formData.servicio_id)
            if (servicio) {
                const duration = servicio.duracion_estimada || 30
                const [hours, minutes] = formData.hora_inicio.split(':').map(Number)
                const date = new Date()
                date.setHours(hours, minutes + duration, 0)
                const endHours = String(date.getHours()).padStart(2, '0')
                const endMinutes = String(date.getMinutes()).padStart(2, '0')
                setFormData(prev => ({ ...prev, hora_fin: `${endHours}:${endMinutes}` }))
            }
        }
    }, [formData.servicio_id, formData.hora_inicio, servicios])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        
        if (!formData.paciente_id || !formData.profesional_id || !formData.servicio_id) {
            alert('Por favor complete todos los campos requeridos.')
            setLoading(false)
            return
        }

        try {
            await turnosApi.crear({
                paciente_id: formData.paciente_id,
                profesional_id: formData.profesional_id,
                servicio_id: formData.servicio_id,
                fecha: formData.fecha,
                hora_inicio: formData.hora_inicio,
                hora_fin: formData.hora_fin,
                estado: formData.estado,
                observaciones: formData.observaciones,
                sobre_turno: formData.sobre_turno
            })
            onCreate()
            onClose()
        } catch (error: any) {
            console.error('Error creating appointment:', error)
            const errorMessage = error.response?.data?.error || 'Error al crear el turno. Verifique solapamientos o habilitar Sobre Turno.'
            alert(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-500">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 my-8 relative animate-in fade-in zoom-in-95 duration-300">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <Plus className="w-6 h-6 rotate-45" />
                </button>

                <h3 className="text-2xl font-black mb-6 text-[#026498] flex items-center tracking-tight">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mr-3 text-[#026498]">
                        <Plus className="w-6 h-6" />
                    </div>
                    Agregar Sobreturno
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 space-y-4">
                            <div className="relative">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Paciente *</label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Buscar por DNI, nombre o apellido..."
                                        value={searchPaciente}
                                        onChange={(e) => {
                                            setSearchPaciente(e.target.value);
                                            // Invalida la selección si el usuario borra o cambia el texto
                                            setFormData({ ...formData, paciente_id: '' });
                                        }}
                                        onFocus={() => {
                                            if (searchPaciente.length > 2) {
                                                // Trigger search if focus and has text
                                            }
                                        }}
                                        className="h-12 pr-10"
                                        required
                                    />
                                    {formData.paciente_id && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" title="Paciente seleccionado" />
                                        </div>
                                    )}
                                </div>

                                {searchPaciente.length > 2 && !formData.paciente_id && pacientes.length > 0 && (
                                    <div className="absolute z-[60] w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                        {pacientes.map((paciente) => (
                                            <div
                                                key={paciente.id}
                                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none transition-colors"
                                                onClick={() => {
                                                    setFormData({ ...formData, paciente_id: paciente.id });
                                                    setSearchPaciente(`${paciente.numero_documento} - ${paciente.apellido}, ${paciente.nombre}`);
                                                }}
                                            >
                                                <div className="text-sm font-bold text-gray-900">
                                                    {paciente.apellido}, {paciente.nombre}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    DNI: {paciente.numero_documento}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {searchPaciente.length > 2 && !formData.paciente_id && pacientes.length === 0 && (
                                    <div className="absolute z-[60] w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-4 text-center text-sm text-gray-500">
                                        No se encontraron pacientes
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Profesional</label>
                                    <select
                                        value={formData.profesional_id || ''}
                                        onChange={(e) => setFormData({ ...formData, profesional_id: parseInt(e.target.value) })}
                                        className="w-full border border-gray-200 rounded-xl p-3 h-12 bg-white text-sm focus:ring-2 focus:ring-[#026498] focus:border-transparent outline-none transition-all"
                                        required
                                    >
                                        <option value="">Seleccionar profesional</option>
                                        {profesionales.map((prof) => (
                                            <option key={prof.id} value={prof.id}>
                                                {prof.apellido}, {prof.nombre} - {prof.especialidad}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Servicio</label>
                                    <select
                                        value={formData.servicio_id || ''}
                                        onChange={(e) => setFormData({ ...formData, servicio_id: parseInt(e.target.value) })}
                                        className="w-full border border-gray-200 rounded-xl p-3 h-12 bg-white text-sm focus:ring-2 focus:ring-[#026498] focus:border-transparent outline-none transition-all"
                                        required
                                    >
                                        <option value="">Seleccionar servicio</option>
                                        {servicios.map((serv) => (
                                            <option key={serv.id} value={serv.id}>
                                                {serv.nombre} ({serv.duracion_estimada} min)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-blue-50/30 p-5 rounded-2xl border border-blue-50">
                            <div className="sm:col-span-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-[#026498] mb-2">Fecha</label>
                                <Input
                                    type="date"
                                    value={formData.fecha}
                                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                    required
                                    className="h-11 border-blue-100"
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-[#026498] mb-2">Inicio</label>
                                <Input
                                    type="time"
                                    value={formData.hora_inicio}
                                    onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                                    required
                                    className="h-11 border-blue-100"
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-[#026498] mb-2">Fin</label>
                                <Input
                                    type="time"
                                    value={formData.hora_fin}
                                    onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                                    required
                                    className="h-11 border-blue-100"
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl flex items-center animate-pulse-subtle">
                            <input
                                type="checkbox"
                                id="sobre_turno"
                                checked={formData.sobre_turno}
                                onChange={(e) => setFormData({ ...formData, sobre_turno: e.target.checked })}
                                className="mr-4 w-6 h-6 text-red-600 rounded-lg focus:ring-red-500 border-red-200 transition-all cursor-pointer"
                            />
                            <label htmlFor="sobre_turno" className="text-sm font-black text-red-900 cursor-pointer flex-1">
                                Ignorar Reglas / Forzar (Sobre Turno)
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Estado</label>
                                <select
                                    value={formData.estado}
                                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl p-3 h-12 bg-white text-sm focus:ring-2 focus:ring-[#026498] focus:border-transparent outline-none transition-all"
                                >
                                    <option value="Confirmado">Confirmado</option>
                                    <option value="Creado">Creado</option>
                                    <option value="En sala de espera">En sala de espera</option>
                                    <option value="Atendido">Atendido</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Observaciones</label>
                                <textarea
                                    value={formData.observaciones}
                                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl p-3 h-12 bg-white text-sm focus:ring-2 focus:ring-[#026498] focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Notas adicionales..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl font-bold"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading} 
                            className="flex-1 h-12 rounded-xl bg-[#026498] text-white font-black shadow-lg shadow-blue-900/10 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                            {loading ? 'Guardando...' : 'Agregar Sobreturno'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
