"use client"

import React, { useState, useEffect } from 'react'
import {
  Bell,
  Send,
  Clock,
  Calendar,
  User,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Mail,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Settings,
  Save,
  X,
  Info,
  ArrowUpDown,
  MailWarning
} from 'lucide-react'
import { turnosApi, recordatoriosApi } from '../../api'
import type { Turno } from '../../types'

/* ─── Dentiqly design tokens ─────────────────────────────────────────── */
const tokens = {
  blue: "#2563FF",
  blueHover: "#1E40AF",
  blueFaint: "#EEF3FF",
  navy: "#0B1023",
  grayText: "#4B5568",
  grayMuted: "#8A93A8",
  grayBorder: "#E2E6EF",
  grayBg: "#F5F7FA",
  grayRow: "#F0F2F7",
  rowHover: "#F5F8FF",
  white: "#FFFFFF",

  green: "#22C55E",
  greenFaint: "#EDFAF4",
  greenText: "#15803D",

  red: "#EF4444",
  redFaint: "#FEF2F2",
  redText: "#B91C1C",

  orange: "#F59E0B",
  orangeFaint: "#FFF7ED",
  orangeText: "#92400E",
}

export const RemindersView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState<number | null>(null)
  const [sendingAll, setSendingAll] = useState(false)
  const [sentIds, setSentIds] = useState<Set<number>>(new Set())
  const [errorIds, setErrorIds] = useState<Set<number>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [massResult, setMassResult] = useState<{ enviados: number; errores: number; total: number } | null>(null)

  // Template editor
  const [showTemplateEditor, setShowTemplateEditor] = useState(false)
  const [templateText, setTemplateText] = useState('')
  const [savedTemplate, setSavedTemplate] = useState('')
  const [savingTemplate, setSavingTemplate] = useState(false)
  const [templateLoaded, setTemplateLoaded] = useState(false)

  // Preview modal
  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [previewTurnoId, setPreviewTurnoId] = useState<number | null>(null)

  useEffect(() => {
    fetchTurnos()
    setSentIds(new Set())
    setErrorIds(new Set())
    setMassResult(null)
  }, [selectedDate])

  useEffect(() => {
    if (!templateLoaded) {
      loadTemplate()
    }
  }, [])

  const loadTemplate = async () => {
    try {
      const result = await recordatoriosApi.obtenerTemplate()
      setTemplateText(result.template || '')
      setSavedTemplate(result.template || '')
      setTemplateLoaded(true)
    } catch (error) {
      console.error('Error loading template:', error)
      setTemplateLoaded(true)
    }
  }

  const fetchTurnos = async () => {
    try {
      setLoading(true)
      const response = await turnosApi.listar({
        fecha_desde: selectedDate,
        fecha_hasta: selectedDate,
        limit: 200,
      })
      const turnosFecha = (response.data || []).filter(
        (t: Turno) => t.fecha === selectedDate && ['Pendiente', 'Confirmado', 'Creado', 'Confirmado por email', 'Confirmado por SMS', 'Confirmado por Whatsapp'].includes(t.estado)
      )
      turnosFecha.sort((a: Turno, b: Turno) => a.hora_inicio.localeCompare(b.hora_inicio))
      setTurnos(turnosFecha)
    } catch (error) {
      console.error('Error fetching turnos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendReminder = async (turnoId: number) => {
    try {
      setSendingId(turnoId)
      setErrorIds((prev) => {
        const next = new Set(prev)
        next.delete(turnoId)
        return next
      })
      await recordatoriosApi.enviar(turnoId)
      setSentIds((prev) => new Set(prev).add(turnoId))
    } catch (error) {
      console.error('Error sending reminder:', error)
      setErrorIds((prev) => new Set(prev).add(turnoId))
    } finally {
      setSendingId(null)
    }
  }

  const handleSendAll = async () => {
    if (!window.confirm(`¿Enviar recordatorio a todos los pacientes con turno el ${formatDateStr(selectedDate)}?`)) return
    try {
      setSendingAll(true)
      const result = await recordatoriosApi.enviarMasivo(selectedDate)
      setMassResult(result)
      const allIds = new Set(turnos.map(t => t.id))
      setSentIds(allIds)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al enviar recordatorios masivos')
    } finally {
      setSendingAll(false)
    }
  }

  const handleSaveTemplate = async () => {
    try {
      setSavingTemplate(true)
      await recordatoriosApi.guardarTemplate(templateText)
      setSavedTemplate(templateText)
      alert('Mensaje guardado correctamente')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSavingTemplate(false)
    }
  }

  const handlePreview = async (turnoId?: number) => {
    try {
      setLoadingPreview(true)
      setShowPreview(true)
      setPreviewTurnoId(turnoId || null)
      const result = await recordatoriosApi.preview({
        turno_id: turnoId,
        custom_template: templateText || undefined,
      })
      setPreviewHtml(result.html)
    } catch (error) {
      console.error('Error preview:', error)
      setPreviewHtml('<p style="color:red;text-align:center;padding:40px;">Error al cargar la vista previa</p>')
    } finally {
      setLoadingPreview(false)
    }
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const date = new Date(selectedDate + 'T00:00:00')
    date.setDate(date.getDate() + (direction === 'prev' ? -1 : 1))
    setSelectedDate(date.toISOString().split('T')[0])
  }

  const formatDateStr = (fecha: string) => {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const filteredTurnos = turnos.filter((turno) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    const pName = `${turno.paciente?.apellido || ''} ${turno.paciente?.nombre || ''}`.toLowerCase()
    const prName = `${turno.profesional?.nombre || ''} ${turno.profesional?.apellido || ''}`.toLowerCase()
    return pName.includes(term) || prName.includes(term)
  })

  const turnosWithEmail = turnos.filter(t => t.paciente?.email)

  const pageStyle: React.CSSProperties = {
    background: tokens.grayBg,
    minHeight: "100vh",
    padding: "28px 32px",
    fontFamily: "Poppins, -apple-system, sans-serif",
  }

  return (
    <div style={pageStyle}>
      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: tokens.navy, letterSpacing: "-0.3px", margin: 0 }}>
            Recordatorios
          </h1>
          <p style={{ fontSize: 13, color: tokens.grayMuted, marginTop: 3, fontWeight: 400 }}>
            Automatizá el envío de emails de recordatorio para minimizar el ausentismo
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setShowTemplateEditor(!showTemplateEditor)}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: showTemplateEditor ? tokens.blueFaint : tokens.white,
              color: showTemplateEditor ? tokens.blue : tokens.grayText,
              border: showTemplateEditor ? `0.5px solid ${tokens.blue}` : `0.5px solid ${tokens.grayBorder}`,
              borderRadius: 10, padding: "9px 18px",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              fontFamily: "Poppins, -apple-system, sans-serif",
              transition: "all 0.15s",
            }}
          >
            <Settings size={15} />
            Configurar Mensaje
          </button>
          <button
            onClick={handleSendAll}
            disabled={sendingAll || turnosWithEmail.length === 0}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: tokens.blue, color: tokens.white,
              border: "none", borderRadius: 10, padding: "9px 18px",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              fontFamily: "Poppins, -apple-system, sans-serif",
              transition: "background 0.15s",
              opacity: (sendingAll || turnosWithEmail.length === 0) ? 0.6 : 1
            }}
            onMouseEnter={e => { if(!sendingAll && turnosWithEmail.length > 0) e.currentTarget.style.background = tokens.blueHover }}
            onMouseLeave={e => { if(!sendingAll && turnosWithEmail.length > 0) e.currentTarget.style.background = tokens.blue }}
          >
            <Send size={15} />
            {sendingAll ? 'Enviando...' : `Enviar a todos (${turnosWithEmail.length})`}
          </button>
        </div>
      </div>

      {/* ── Template Editor Card ── */}
      {showTemplateEditor && (
        <div style={{
          background: tokens.white, borderRadius: 14, border: `0.5px solid ${tokens.blue}44`,
          padding: 24, marginBottom: 24, boxShadow: "0 8px 32px rgba(37,99,255,0.04)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: tokens.navy, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Mail size={16} color={tokens.blue} /> Personalización del Mensaje
            </h3>
            <button onClick={() => setShowTemplateEditor(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: tokens.grayMuted }}><X size={18} /></button>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <textarea
                value={templateText}
                onChange={e => setTemplateText(e.target.value)}
                placeholder="Ej: Te recordamos que tenés un turno el {fecha}..."
                style={{
                  width: "100%", height: 100, padding: 12, borderRadius: 10,
                  border: `0.5px solid ${tokens.grayBorder}`, fontSize: 13,
                  fontFamily: "Poppins, -apple-system, sans-serif", outline: "none", resize: "none"
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
                <button onClick={() => handlePreview()} style={{ padding: "7px 14px", borderRadius: 8, border: `0.5px solid ${tokens.grayBorder}`, background: tokens.white, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Eye size={14} /> Vista Previa</button>
                <button onClick={handleSaveTemplate} disabled={savingTemplate} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: tokens.blue, color: tokens.white, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Save size={14} /> {savingTemplate ? 'Guardando...' : 'Guardar Mensaje'}</button>
              </div>
            </div>
            <div style={{ width: 220, background: tokens.grayBg, borderRadius: 12, padding: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: tokens.grayMuted, textTransform: "uppercase", marginBottom: 8, letterSpacing: 0.4 }}>Variables</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {['nombre', 'apellido', 'fecha', 'hora_inicio', 'profesional', 'servicio'].map(v => (
                  <span key={v} style={{ fontSize: 10, background: tokens.white, border: `0.5px solid ${tokens.grayBorder}`, padding: "2px 6px", borderRadius: 4, color: tokens.navy, fontWeight: 500 }}>{`{${v}}`}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Controls ── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center" }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", gap: 10,
            background: tokens.white, border: `0.5px solid ${tokens.grayBorder}`,
            borderRadius: 10, padding: "0 14px", height: 40,
          }}>
            <Search size={15} color={tokens.grayMuted} />
            <input
              type="text"
              placeholder="Buscar por paciente o profesional…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                border: "none", outline: "none", background: "transparent",
                fontSize: 13, color: tokens.navy, flex: 1,
                fontFamily: "Poppins, -apple-system, sans-serif",
              }}
            />
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 3, background: tokens.white, border: `0.5px solid ${tokens.grayBorder}`, borderRadius: 10, padding: "3px" }}>
            <button onClick={() => navigateDate('prev')} style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: tokens.grayMuted }} onMouseEnter={e => e.currentTarget.style.background = tokens.grayBg} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><ChevronLeft size={16} /></button>
            <div style={{ position: "relative", padding: "0 8px" }}>
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ border: "none", outline: "none", fontSize: 13, fontWeight: 600, color: tokens.navy, fontFamily: "Poppins, -apple-system, sans-serif", cursor: "pointer" }} />
            </div>
            <button onClick={() => navigateDate('next')} style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: tokens.grayMuted }} onMouseEnter={e => e.currentTarget.style.background = tokens.grayBg} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><ChevronRight size={16} /></button>
          </div>
      </div>

      {/* ── Stats / Result Banner ── */}
      {massResult && (
        <div style={{ background: tokens.greenFaint, padding: "12px 18px", borderRadius: 12, border: `0.5px solid ${tokens.green}33`, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircle size={18} color={tokens.green} />
          <p style={{ fontSize: 13, color: tokens.greenText, margin: 0, fontWeight: 500 }}>
            Resultados del envío: {massResult.enviados} exitosos, {massResult.errores} fallidos. Total: {massResult.total}
          </p>
        </div>
      )}

      {/* ── Table card ── */}
      <div style={{
        background: tokens.white, borderRadius: 14,
        border: `0.5px solid ${tokens.grayBorder}`, overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `0.5px solid ${tokens.grayBorder}` }}>
                {[
                  { label: "Paciente", sortable: true },
                  { label: "Horario", sortable: true },
                  { label: "Profesional / Servicio", sortable: true },
                  { label: "Canal de Envío", sortable: false },
                  { label: "Estado", sortable: false },
                  { label: "", sortable: false },
                ].map((col, i) => (
                  <th key={i} style={{
                    textAlign: "left", padding: "12px 16px",
                    fontSize: 11, fontWeight: 600, color: tokens.grayMuted,
                    textTransform: "uppercase", letterSpacing: "0.6px", whiteSpace: "nowrap",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {col.label}
                      {col.sortable && <ArrowUpDown size={11} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: `0.5px solid ${tokens.grayRow}` }}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} style={{ padding: "14px 16px" }}><div style={{ width: 100, height: 11, borderRadius: 5, background: tokens.grayRow, animation: "pulse 1.5s infinite" }} /></td>
                    ))}
                  </tr>
                ))
              ) : filteredTurnos.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "56px 0" }}>
                    <Bell size={36} color={tokens.grayBorder} style={{ margin: "0 auto 12px", display: "block" }} />
                    <p style={{ fontSize: 14, fontWeight: 500, color: tokens.grayMuted }}>No hay turnos para {formatDateStr(selectedDate)}</p>
                  </td>
                </tr>
              ) : (
                filteredTurnos.map((t, idx) => {
                  const isSent = sentIds.has(t.id)
                  const isSending = sendingId === t.id
                  const hasError = errorIds.has(t.id)
                  const hasEmail = !!t.paciente?.email
                  const isLast = idx === filteredTurnos.length - 1
                  
                  return (
                    <tr
                      key={t.id}
                      style={{ borderBottom: isLast ? "none" : `0.5px solid ${tokens.grayRow}`, transition: "background 0.12s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = tokens.rowHover)}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Paciente */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: tokens.blueFaint, color: tokens.blue,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 700
                          }}>
                            {(t.paciente?.nombre || "").charAt(0)}{(t.paciente?.apellido || "").charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontSize: 13.5, fontWeight: 600, color: tokens.navy, margin: 0 }}>
                              {t.paciente?.apellido}, {t.paciente?.nombre}
                            </p>
                            {!hasEmail && <span style={{ fontSize: 10, color: tokens.redText, fontWeight: 600 }}>SIN EMAIL</span>}
                          </div>
                        </div>
                      </td>

                      {/* Horario */}
                      <td style={{ padding: "11px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: tokens.grayText }}>
                          <Clock size={12} color={tokens.grayMuted} />
                          {t.hora_inicio} hs
                        </div>
                      </td>

                      {/* Profesional / Servicio */}
                      <td style={{ padding: "11px 16px" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: 13, color: tokens.navy, fontWeight: 500 }}>{t.profesional?.nombre} {t.profesional?.apellido}</span>
                          <span style={{ fontSize: 11, color: tokens.grayMuted }}>{t.servicio?.nombre}</span>
                        </div>
                      </td>

                      {/* Canal */}
                      <td style={{ padding: "11px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: tokens.grayText }}>
                          <Mail size={12} color={tokens.blue} />
                          {t.paciente?.email || '—'}
                        </div>
                      </td>

                      {/* Estado Envío */}
                      <td style={{ padding: "11px 16px" }}>
                        {isSent ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: tokens.greenFaint, color: tokens.greenText }}>
                            <CheckCircle size={10} /> ENVIADO
                          </span>
                        ) : hasError ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: tokens.redFaint, color: tokens.redText }}>
                            <AlertCircle size={10} /> ERROR
                          </span>
                        ) : !hasEmail ? (
                          <span style={{ fontSize: 11, fontWeight: 600, color: tokens.grayMuted }}>N/A</span>
                        ) : (
                          <span style={{ fontSize: 11, fontWeight: 600, color: tokens.blue }}>PENDIENTE</span>
                        )}
                      </td>

                      {/* Action */}
                      <td style={{ padding: "11px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
                          {hasEmail && !isSent && (
                            <button onClick={() => handlePreview(t.id)} title="Previsualizar" style={{ width: 30, height: 30, borderRadius: 7, border: "none", background: "transparent", cursor: "pointer", color: tokens.grayMuted }} onMouseEnter={e => e.currentTarget.style.background = tokens.grayBg} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><Eye size={14} /></button>
                          )}
                          {hasEmail && !isSent && (
                            <button
                              onClick={() => handleSendReminder(t.id)}
                              disabled={isSending}
                              style={{
                                padding: "6px 12px", borderRadius: 8, border: "none",
                                background: tokens.blue, color: tokens.white,
                                fontSize: 11, fontWeight: 600, cursor: "pointer",
                                opacity: isSending ? 0.6 : 1
                              }}
                            >
                              {isSending ? '...' : 'ENVIAR'}
                            </button>
                          )}
                          {hasError && (
                            <button onClick={() => handleSendReminder(t.id)} style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: tokens.red, color: tokens.white, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>REINTENTAR</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(11,16,35,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, padding: 16, backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: tokens.white, borderRadius: 16,
            maxWidth: 640, width: "100%", maxHeight: "90vh", overflow: "hidden",
            boxShadow: "0 24px 48px rgba(11,16,35,0.12)",
            display: "flex", flexDirection: "column"
          }}>
            <div style={{ padding: "18px 24px", borderBottom: `0.5px solid ${tokens.grayBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: tokens.navy, margin: 0 }}>Vista Previa de Email</h3>
              <button onClick={() => setShowPreview(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: tokens.grayMuted }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
              {loadingPreview ? (
                <div style={{ padding: "100px 0", textAlign: "center", color: tokens.grayMuted }}>Cargando previsualización...</div>
              ) : (
                <div style={{ border: `0.5px solid ${tokens.grayBorder}`, borderRadius: 8, overflow: "hidden" }}>
                  <iframe srcDoc={previewHtml} title="Email Preview" style={{ width: "100%", height: 500, border: "none" }} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
