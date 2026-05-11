"use client"

import React, { useState, useEffect } from "react"
import { configuracionApi, Setting } from "../../api/configuracion"
import { 
  Save, 
  Building2, 
  CreditCard, 
  Info, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  Globe,
  Settings as SettingsIcon,
  MessageSquare
} from "lucide-react"
import { useToast } from "../../hooks/use-toast"

export const SettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"general" | "banking" | "booking">("general")
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  // Form states
  const [bankData, setBankData] = useState({
    bank_name: "",
    bank_account_holder: "",
    bank_cbu: "",
    bank_alias: "",
    bank_whatsapp: ""
  })

  const [generalData, setGeneralData] = useState({
    clinic_name: "",
    clinic_address: "",
    clinic_phone: "",
    clinic_google_maps: ""
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const data = await configuracionApi.listar()
      setSettings(data)
      
      // Map existing settings to form states
      const bankFields: any = { ...bankData }
      const generalFields: any = { ...generalData }
      
      data.forEach(s => {
        if (s.clave in bankFields) {
          bankFields[s.clave] = s.valor
        }
        if (s.clave in generalFields) {
          generalFields[s.clave] = s.valor
        }
      })
      setBankData(bankFields)
      setGeneralData(generalFields)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las configuraciones",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveGeneralData = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Process Google Maps link: extract URL if it's inside an <iframe> or if it's mixed with text
      let mapsUrl = generalData.clinic_google_maps.trim()
      
      if (mapsUrl.includes('<iframe')) {
        const match = mapsUrl.match(/src="([^"]+)"/)
        if (match && match[1]) mapsUrl = match[1]
      } else {
        const urlMatch = mapsUrl.match(/https:\/\/www\.google\.com\/maps\/embed\?[^ \n\r\t"]+/)
        if (urlMatch) mapsUrl = urlMatch[0]
      }
      
      setGeneralData(prev => ({ ...prev, clinic_google_maps: mapsUrl }))

      // Save fields using the new upsert-enabled 'crear' endpoint
      const entries = Object.entries({ ...generalData, clinic_google_maps: mapsUrl })
      for (const [key, value] of entries) {
        await configuracionApi.crear({
          clave: key,
          valor: value,
          tipo: "string",
          categoria: "general"
        })
      }

      toast({ title: "Éxito", description: "Configuración general actualizada" })
      fetchSettings()
    } catch (error: any) {
      console.error("Error saving general data:", error)
      toast({ 
        title: "Error al guardar", 
        description: error.response?.data?.error || "No se pudieron guardar los cambios.", 
        variant: "destructive" 
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveBankData = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const entries = Object.entries(bankData)
      for (const [key, value] of entries) {
        await configuracionApi.crear({
          clave: key,
          valor: value,
          tipo: "string",
          categoria: "banking"
        })
      }
      toast({ title: "Éxito", description: "Datos bancarios actualizados" })
      fetchSettings()
    } catch (error: any) {
      console.error("Error saving bank data:", error)
      toast({ 
        title: "Error al guardar", 
        description: error.response?.data?.error || "No se pudieron guardar los cambios.", 
        variant: "destructive" 
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563FF]" />
        <p className="text-gray-500 font-medium">Cargando configuraciones...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Configuración</h2>
          <p className="text-gray-500 font-medium mt-1">Gestiona los detalles de tu clínica y portal de reservas</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        {[
          { id: "general", label: "General", icon: Building2 },
          { id: "banking", label: "Datos Bancarios", icon: CreditCard },
          { id: "booking", label: "Reserva Pública", icon: Globe }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id 
                ? "bg-white text-[#2563FF] shadow-sm shadow-black/5" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {activeTab === "general" && (
          <form onSubmit={handleSaveGeneralData} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#2563FF]">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Building2 size={18} />
                  </div>
                  <h3 className="font-bold text-gray-900">Información de la Clínica</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nombre de la Clínica</label>
                    <input
                      type="text"
                      placeholder="Ej: Clínica Dental Smile"
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#2563FF] transition-all font-medium"
                      value={generalData.clinic_name}
                      onChange={e => setGeneralData({ ...generalData, clinic_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Dirección</label>
                    <input
                      type="text"
                      placeholder="Calle 123, Ciudad"
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#2563FF] transition-all font-medium"
                      value={generalData.clinic_address}
                      onChange={e => setGeneralData({ ...generalData, clinic_address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Teléfono de Contacto</label>
                    <input
                      type="text"
                      placeholder="Ej: +54 11 0000 0000"
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#2563FF] transition-all font-medium"
                      value={generalData.clinic_phone}
                      onChange={e => setGeneralData({ ...generalData, clinic_phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-red-500">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <Globe size={18} />
                  </div>
                  <h3 className="font-bold text-gray-900">Ubicación y Mapas</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Link de Google Maps (Embed)</label>
                    <textarea
                      placeholder="Pega el link de 'Insertar mapa' de Google Maps aquí"
                      rows={4}
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#2563FF] transition-all font-mono text-xs"
                      value={generalData.clinic_google_maps}
                      onChange={e => setGeneralData({ ...generalData, clinic_google_maps: e.target.value })}
                    />
                    <p className="text-[10px] text-gray-400 font-medium mt-2">
                      Para obtener este link: Google Maps {"->"} Compartir {"->"} Insertar un mapa {"->"} Copiar el contenido del 'src' entre las comillas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#2563FF] text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {activeTab === "banking" && (
          <form onSubmit={handleSaveBankData} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#2563FF]">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Info size={18} />
                  </div>
                  <h3 className="font-bold text-gray-900">Información para Pagos</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nombre del Banco</label>
                    <input
                      type="text"
                      placeholder="Ej: Banco Galicia"
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#2563FF] transition-all font-medium"
                      value={bankData.bank_name}
                      onChange={e => setBankData({ ...bankData, bank_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Titular de la Cuenta</label>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#2563FF] transition-all font-medium"
                      value={bankData.bank_account_holder}
                      onChange={e => setBankData({ ...bankData, bank_account_holder: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">CBU / CVU</label>
                    <input
                      type="text"
                      placeholder="22 dígitos"
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#2563FF] transition-all font-mono font-bold"
                      value={bankData.bank_cbu}
                      onChange={e => setBankData({ ...bankData, bank_cbu: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Alias</label>
                    <input
                      type="text"
                      placeholder="Ej: mi.clinica.alias"
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#2563FF] transition-all font-mono font-bold"
                      value={bankData.bank_alias}
                      onChange={e => setBankData({ ...bankData, bank_alias: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-green-500">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <MessageSquare size={18} />
                  </div>
                  <h3 className="font-bold text-gray-900">Validación de Comprobantes</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">WhatsApp para Comprobantes</label>
                    <input
                      type="text"
                      placeholder="Ej: 5491100000000"
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#2563FF] transition-all font-medium"
                      value={bankData.bank_whatsapp}
                      onChange={e => setBankData({ ...bankData, bank_whatsapp: e.target.value })}
                    />
                    <p className="text-[10px] text-gray-400 font-medium mt-2">
                      Este número se usará para que los pacientes envíen el comprobante de transferencia por WhatsApp.
                    </p>
                  </div>

                  <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
                    <div className="p-2 bg-white rounded-xl h-fit border border-blue-100">
                      <CreditCard className="text-[#2563FF]" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 text-sm mb-1">Visualización en Reserva</h4>
                      <p className="text-xs text-blue-800/70 leading-relaxed">
                        Estos datos se mostrarán en el último paso del proceso de reserva pública para que tus pacientes puedan realizar la transferencia de la seña.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#2563FF] text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {activeTab === "booking" && (
          <div className="p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto text-gray-400">
              <Globe size={32} />
            </div>
            <h3 className="font-bold text-gray-900">Configuración de Reserva</h3>
            <p className="text-gray-500 max-w-sm mx-auto text-sm">
              Próximamente podrás activar/desactivar la reserva pública, requerir seña obligatoria y más.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
