"use client"

import React, { useState, useEffect } from "react"
import { tokens as sharedTokens, labelStyle as sharedLabelStyle, inputStyle as sharedInputStyle, pageWrapper } from './adminDesign'
import { configuracionApi, Setting } from "../../api/configuracion"
import {
  Save,
  Building2,
  CreditCard,
  Loader2,
  MessageSquare,
  MapPin,
} from "lucide-react"
import { useToast } from "../../hooks/use-toast"

/* ─── Dentiqly design tokens ─────────────────────────────────────────── */
const tokens = sharedTokens

/* ─── Label styles ────────────────────────────────────────────────────── */
const labelStyle = sharedLabelStyle

const inputStyle = sharedInputStyle

export const SettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"general" | "banking">("general")
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
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
      
      const bankFields: any = { ...bankData }
      const generalFields: any = { ...generalData }
      
      data.forEach(s => {
        if (s.clave in bankFields) bankFields[s.clave] = s.valor
        if (s.clave in generalFields) generalFields[s.clave] = s.valor
      })
      setBankData(bankFields)
      setGeneralData(generalFields)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveGeneralData = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      let mapsUrl = generalData.clinic_google_maps.trim()
      if (mapsUrl.includes('<iframe')) {
        const match = mapsUrl.match(/src="([^"]+)"/)
        if (match && match[1]) mapsUrl = match[1]
      } else {
        const urlMatch = mapsUrl.match(/https:\/\/www\.google\.com\/maps\/embed\?[^ \n\r\t"]+/)
        if (urlMatch) mapsUrl = urlMatch[0]
      }
      
      const updatedData = { ...generalData, clinic_google_maps: mapsUrl }
      const entries = Object.entries(updatedData)
      for (const [key, value] of entries) {
        await configuracionApi.crear({ clave: key, valor: value, tipo: "string", categoria: "general" })
      }
      toast({ title: "Éxito", description: "Configuración general actualizada" })
      fetchSettings()
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron guardar los cambios.", variant: "destructive" })
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
        await configuracionApi.crear({ clave: key, valor: value, tipo: "string", categoria: "banking" })
      }
      toast({ title: "Éxito", description: "Datos bancarios actualizados" })
      fetchSettings()
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron guardar los cambios.", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 0", gap: 12 }}>
        <Loader2 className="animate-spin" color={tokens.blue} size={32} />
        <p style={{ fontSize: 14, color: tokens.grayMuted, fontWeight: 500 }}>Cargando configuración…</p>
      </div>
    )
  }

  return (
    <div style={pageWrapper}>
      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: tokens.navy, letterSpacing: "-0.3px", margin: 0 }}>
            Configuración del Sistema
          </h1>
          <p style={{ fontSize: 13, color: tokens.grayMuted, marginTop: 3, fontWeight: 400 }}>
            Personalizá los detalles de tu clínica y las preferencias de reserva
          </p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, background: tokens.grayRow, padding: 4, borderRadius: 12, width: "fit-content" }}>
        {[
          { id: "general", label: "General", icon: Building2 },
          { id: "banking", label: "Pagos y Cuentas", icon: CreditCard },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 9,
              border: "none", background: activeTab === tab.id ? tokens.white : "transparent",
              color: activeTab === tab.id ? tokens.blue : tokens.grayMuted,
              fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 500, cursor: "pointer",
              boxShadow: activeTab === tab.id ? "0 2px 8px rgba(0,0,0,0.04)" : "none",
              transition: "all 0.15s", fontFamily: "Inter, -apple-system, sans-serif"
            }}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content Card ── */}
      <div style={{ background: tokens.white, borderRadius: 16, border: `0.5px solid ${tokens.grayBorder}`, overflow: "hidden" }}>
        {activeTab === "general" && (
          <form onSubmit={handleSaveGeneralData} style={{ padding: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: tokens.navy, margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: 8 }}>
                  <Building2 size={16} color={tokens.blue} /> Información Básica
                </h3>
                <div>
                  <label style={labelStyle}>Nombre de la Clínica</label>
                  <input type="text" value={generalData.clinic_name} onChange={e => setGeneralData({...generalData, clinic_name: e.target.value})} style={inputStyle} placeholder="Ej: Dental Center" />
                </div>
                <div>
                  <label style={labelStyle}>Dirección Principal</label>
                  <input type="text" value={generalData.clinic_address} onChange={e => setGeneralData({...generalData, clinic_address: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Teléfono de Contacto</label>
                  <input type="text" value={generalData.clinic_phone} onChange={e => setGeneralData({...generalData, clinic_phone: e.target.value})} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: tokens.navy, margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: 8 }}>
                  <MapPin size={16} color={tokens.blue} /> Ubicación Digital
                </h3>
                <div>
                  <label style={labelStyle}>Google Maps Embed URL</label>
                  <textarea 
                    value={generalData.clinic_google_maps} 
                    onChange={e => setGeneralData({...generalData, clinic_google_maps: e.target.value})} 
                    style={{ ...inputStyle, height: 100, resize: "none", fontSize: 11, fontFamily: "monospace" }} 
                    placeholder="Pega el link de 'Insertar mapa'..."
                  />
                  <p style={{ fontSize: 11, color: tokens.grayMuted, marginTop: 8 }}>Este mapa se mostrará en el pie de página de las reservas.</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 40, paddingTop: 24, borderTop: `0.5px solid ${tokens.grayRow}`, display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit" disabled={saving}
                style={{
                  display: "flex", alignItems: "center", gap: 8, background: tokens.blue, color: tokens.white,
                  border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", transition: "background 0.15s", opacity: saving ? 0.7 : 1
                }}
                onMouseEnter={e => { if(!saving) e.currentTarget.style.background = tokens.blueHover }}
                onMouseLeave={e => { if(!saving) e.currentTarget.style.background = tokens.blue }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Guardar Configuración
              </button>
            </div>
          </form>
        )}

        {activeTab === "banking" && (
          <form onSubmit={handleSaveBankData} style={{ padding: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: tokens.navy, margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: 8 }}>
                  <CreditCard size={16} color={tokens.blue} /> Datos de Transferencia
                </h3>
                <div>
                  <label style={labelStyle}>Entidad Bancaria</label>
                  <input type="text" value={bankData.bank_name} onChange={e => setBankData({...bankData, bank_name: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Titular de Cuenta</label>
                  <input type="text" value={bankData.bank_account_holder} onChange={e => setBankData({...bankData, bank_account_holder: e.target.value})} style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>CBU / CVU</label>
                    <input type="text" value={bankData.bank_cbu} onChange={e => setBankData({...bankData, bank_cbu: e.target.value})} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Alias</label>
                    <input type="text" value={bankData.bank_alias} onChange={e => setBankData({...bankData, bank_alias: e.target.value})} style={inputStyle} />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: tokens.navy, margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: 8 }}>
                  <MessageSquare size={16} color={tokens.green} /> WhatsApp de Comprobantes
                </h3>
                <div>
                  <label style={labelStyle}>Número de WhatsApp</label>
                  <input type="text" value={bankData.bank_whatsapp} onChange={e => setBankData({...bankData, bank_whatsapp: e.target.value})} style={inputStyle} placeholder="54911..." />
                  <div style={{ marginTop: 20, padding: 16, background: tokens.blueFaint, borderRadius: 12, border: `0.5px solid ${tokens.blue}22` }}>
                    <p style={{ fontSize: 12, color: tokens.navy, fontWeight: 600, margin: "0 0 4px 0" }}>Importante</p>
                    <p style={{ fontSize: 11.5, color: tokens.grayText, margin: 0, lineHeight: 1.5 }}>
                      Estos datos bancarios se presentarán al finalizar una reserva online para que el paciente envíe el comprobante de seña.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 40, paddingTop: 24, borderTop: `0.5px solid ${tokens.grayRow}`, display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit" disabled={saving}
                style={{
                  display: "flex", alignItems: "center", gap: 8, background: tokens.blue, color: tokens.white,
                  border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", transition: "background 0.15s", opacity: saving ? 0.7 : 1
                }}
                onMouseEnter={e => { if(!saving) e.currentTarget.style.background = tokens.blueHover }}
                onMouseLeave={e => { if(!saving) e.currentTarget.style.background = tokens.blue }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Actualizar Datos de Pago
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}

