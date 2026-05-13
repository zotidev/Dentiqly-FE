export const dentalColors = {
  primary: "var(--brand-primary, #2563FF)", // Electric Blue
  secondary: "var(--brand-secondary, #2563FF)", // Soft Cyan (Now Blue)
  white: "#FFFFFF", // Pure White
  // Variaciones del color principal para diferentes usos
  primaryLight: "#5A8BFF", // Azul más claro para hover
  primaryDark: "#1D4ED8", // Azul más oscuro para estados activos
  // Grises adicionales para UI
  gray50: "#F4F7FB", // Soft Gray
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#5C6B7B", // Neutral Text
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#0A0F2D", // Dark Navy
  // Estados
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
} as const

export type DentalColor = keyof typeof dentalColors
