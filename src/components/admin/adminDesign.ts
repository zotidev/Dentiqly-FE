import type React from "react"

export const tokens = {
  blue: "#2563FF",
  blueHover: "#1E40AF",
  blueFaint: "#EEF3FF",
  navy: "#0B1023",

  grayText: "#4B5568",
  grayMuted: "#8A93A8",
  grayBorder: "#E2E0DB",
  grayBg: "#F5F0EA",
  grayRow: "#F5F0EA",
  rowHover: "#F0EBE4",
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

  violet: "#7C3AED",
  violetFaint: "#F3EEFF",

  grayDot: "#CBD5E1",
  grayPill: "#F1F5F9",
  grayPillTx: "#64748B",

  cardBorder: "#E8E0D6",
  cardBg: "#FFFFFF",
  pageBg: "#F5F0EA",
  sidebarBg: "#0B1023",

  avatarColors: [
    { bg: "#DBEAFE", color: "#2563FF" },
    { bg: "#D1FAE5", color: "#16A34A" },
    { bg: "#EDE9FE", color: "#7C3AED" },
    { bg: "#FEF3C7", color: "#B45309" },
    { bg: "#FFE4E6", color: "#DC2626" },
    { bg: "#CFFAFE", color: "#0D9488" },
  ],
}

export const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: tokens.grayMuted,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: 6,
}

export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: 13,
  border: `1px solid ${tokens.cardBorder}`,
  borderRadius: 12,
  outline: "none",
  color: tokens.navy,
  background: tokens.white,
  fontFamily: "Inter, -apple-system, sans-serif",
  transition: "all 0.15s",
}

export const pageWrapper: React.CSSProperties = {
  minHeight: "100vh",
  fontFamily: "Inter, -apple-system, sans-serif",
}

export const cardStyle: React.CSSProperties = {
  background: tokens.cardBg,
  borderRadius: 16,
  border: `1px solid ${tokens.cardBorder}60`,
  padding: "20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
}

export const tableHeaderStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: tokens.grayMuted,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  paddingBottom: 10,
  borderBottom: `1px solid ${tokens.cardBorder}40`,
}

export const tableRowStyle = (isEven: boolean): React.CSSProperties => ({
  borderBottom: `1px solid ${tokens.cardBorder}30`,
  transition: "background 0.15s",
})

export const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 20px",
  background: tokens.blue,
  color: tokens.white,
  border: "none",
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.15s",
  fontFamily: "Inter, -apple-system, sans-serif",
}

export const btnSecondary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 20px",
  background: tokens.white,
  color: tokens.grayText,
  border: `1px solid ${tokens.cardBorder}`,
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.15s",
  fontFamily: "Inter, -apple-system, sans-serif",
}

export const btnDanger: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 14px",
  background: tokens.redFaint,
  color: tokens.redText,
  border: `1px solid #FECACA`,
  borderRadius: 10,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.15s",
  fontFamily: "Inter, -apple-system, sans-serif",
}

export const modalOverlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
  padding: 16,
}

export const modalCard: React.CSSProperties = {
  background: tokens.white,
  borderRadius: 20,
  width: "100%",
  maxWidth: 520,
  maxHeight: "90vh",
  overflow: "auto",
  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
}

export const getInitials = (nombre: string, apellido: string) =>
  `${(nombre || "").charAt(0)}${(apellido || "").charAt(0)}`.toUpperCase()

export const getAvatarStyle = (id: string | number) => {
  const strId = String(id)
  const idx = strId.charCodeAt(strId.length - 1) % tokens.avatarColors.length
  return tokens.avatarColors[idx]
}

export const statusBadge = (estado: string): React.CSSProperties => {
  const map: Record<string, { bg: string; color: string }> = {
    Activo: { bg: tokens.greenFaint, color: tokens.greenText },
    Inactivo: { bg: tokens.redFaint, color: tokens.redText },
    Pendiente: { bg: tokens.orangeFaint, color: tokens.orangeText },
    Confirmado: { bg: tokens.blueFaint, color: tokens.blue },
    Atendido: { bg: tokens.greenFaint, color: tokens.greenText },
    Cancelado: { bg: tokens.redFaint, color: tokens.redText },
    Ausente: { bg: "#1F2937", color: "#FFFFFF" },
  }
  const s = map[estado] || { bg: tokens.grayRow, color: tokens.grayText }
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "3px 10px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    background: s.bg,
    color: s.color,
  }
}
