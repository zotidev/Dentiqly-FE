export const dentalColors = {
  primary: "#026498", // Azul principal del centro
  secondary: "#9d9d9d", // Gris secundario
  white: "#ffffff", // Blanco
  // Variaciones del color principal para diferentes usos
  primaryLight: "#0284c7", // Azul más claro para hover
  primaryDark: "#0c4a6e", // Azul más oscuro para estados activos
  // Grises adicionales para UI
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  gray700: "#374151",
  gray800: "#1f2937",
  gray900: "#111827",
  // Estados
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
} as const

export type DentalColor = keyof typeof dentalColors