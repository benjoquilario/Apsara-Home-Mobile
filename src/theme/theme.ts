import { Platform, ViewStyle } from "react-native"

/**
 * Centralized design tokens for AF Home — the React Native equivalent of the
 * website's Tailwind theme. The neutral spine is the Slate scale; the primary
 * accent is Sky blue; brand layer is cream / forest / brass. Light is default,
 * dark is opt-in (driven by the `isDarkMode` prop the app already threads).
 *
 * Usage in a screen/component:
 *   import { getColors, spacing, radius, type, shadow, gradients } from "../theme/theme"
 *   const c = getColors(isDarkMode)
 *   ...style={{ backgroundColor: c.card, padding: spacing.lg, borderRadius: radius.lg }}
 */

// ---------------------------------------------------------------------------
// Raw palette (kept close to Tailwind's named scales)
// ---------------------------------------------------------------------------
export const palette = {
  white: "#ffffff",
  black: "#000000",

  // Slate (neutral spine)
  slate50: "#f8fafc",
  slate100: "#f1f5f9",
  slate200: "#e2e8f0",
  slate300: "#cbd5e1",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1e293b",
  slate900: "#0f172a",
  slate950: "#020617",

  // Sky (primary accent)
  sky400: "#38bdf8",
  sky500: "#0ea5e9",
  sky600: "#0284c7",
  sky700: "#0369a1",

  // Cyan / Teal (secondary accent)
  cyan400: "#22d3ee",
  cyan500: "#06b6d4",
  teal400: "#2dd4bf",
  teal500: "#14b8a6",
  teal600: "#0d9488",

  // Emerald (success)
  emerald50: "#ecfdf5",
  emerald400: "#34d399",
  emerald500: "#10b981",
  emerald600: "#059669",

  // Amber (warning)
  amber50: "#fffbeb",
  amber400: "#fbbf24",
  amber500: "#f59e0b",
  amber600: "#d97706",

  // Red / Rose (error / sale)
  red50: "#fef2f2",
  red400: "#f87171",
  red500: "#ef4444",
  red600: "#dc2626",
  rose500: "#f43f5e",

  // Violet / Indigo (premium)
  violet500: "#8b5cf6",
  violet600: "#7c3aed",
  indigo600: "#4f46e5",

  // Brand layer (marketing surfaces)
  cream: "#faf8f5",
  forest: "#2c5f4f",
  forestDark: "#1e4236",
  brass: "#d4a574",
  brassLight: "#e8c4a0",
}

// ---------------------------------------------------------------------------
// Full Tailwind scales — the website's complete swatch set (50–950), so the
// mobile side has the exact same shades available. The flat `palette` above is
// kept for existing call sites; `tw` is the canonical source going forward.
// Access: tw.sky[500], tw.slate[200], …
// ---------------------------------------------------------------------------
export const tw = {
  slate: { 50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1", 400: "#94a3b8", 500: "#64748b", 600: "#475569", 700: "#334155", 800: "#1e293b", 900: "#0f172a", 950: "#020617" },
  gray: { 50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db", 400: "#9ca3af", 500: "#6b7280", 600: "#4b5563", 700: "#374151", 800: "#1f2937", 900: "#111827", 950: "#030712" },
  sky: { 50: "#f0f9ff", 100: "#e0f2fe", 200: "#bae6fd", 300: "#7dd3fc", 400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1", 800: "#075985", 900: "#0c4a6e", 950: "#082f49" },
  emerald: { 50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b", 950: "#022c22" },
  red: { 50: "#fef2f2", 100: "#fee2e2", 200: "#fecaca", 300: "#fca5a5", 400: "#f87171", 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c", 800: "#991b1b", 900: "#7f1d1d", 950: "#450a0a" },
  amber: { 50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e", 900: "#78350f", 950: "#451a03" },
  rose: { 50: "#fff1f2", 100: "#ffe4e6", 200: "#fecdd3", 300: "#fda4af", 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c", 800: "#9f1239", 900: "#881337", 950: "#4c0519" },
  teal: { 50: "#f0fdfa", 100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4", 400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e", 800: "#115e59", 900: "#134e4a", 950: "#042f2e" },
  blue: { 50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a8a", 950: "#172554" },
  cyan: { 50: "#ecfeff", 100: "#cffafe", 200: "#a5f3fc", 300: "#67e8f9", 400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2", 700: "#0e7490", 800: "#155e75", 900: "#164e63", 950: "#083344" },
  indigo: { 50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc", 400: "#818cf8", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca", 800: "#3730a3", 900: "#312e81", 950: "#1e1b4b" },
  orange: { 50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa", 300: "#fdba74", 400: "#fb923c", 500: "#f97316", 600: "#ea580c", 700: "#c2410c", 800: "#9a3412", 900: "#7c2d12", 950: "#431407" },
  violet: { 50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6", 900: "#4c1d95", 950: "#2e1065" },
  purple: { 50: "#faf5ff", 100: "#f3e8ff", 200: "#e9d5ff", 300: "#d8b4fe", 400: "#c084fc", 500: "#a855f7", 600: "#9333ea", 700: "#7e22ce", 800: "#6b21a8", 900: "#581c87", 950: "#3b0764" },
  green: { 50: "#f0fdf4", 100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac", 400: "#4ade80", 500: "#22c55e", 600: "#16a34a", 700: "#15803d", 800: "#166534", 900: "#14532d", 950: "#052e16" },
  stone: { 50: "#fafaf9", 100: "#f5f5f4", 200: "#e7e5e4", 300: "#d6d3d1", 400: "#a8a29e", 500: "#78716c", 600: "#57534e", 700: "#44403c", 800: "#292524", 900: "#1c1917", 950: "#0c0a09" },
  fuchsia: { 400: "#e879f9", 500: "#d946ef" },
  pink: { 400: "#f472b6", 500: "#ec4899" },
  yellow: { 400: "#facc15", 500: "#eab308" },
  lime: { 400: "#a3e635", 500: "#84cc16" },
  zinc: { 400: "#a1a1aa", 500: "#71717a", 700: "#3f3f46", 800: "#27272a", 900: "#18181b" },
} as const

// Brand layer (marketing surfaces) + misc custom hex seen on the website.
export const brand = {
  cream: "#faf8f5",
  forest: "#2c5f4f",
  brass: "#d4a574",
  text: "#1a1a1a",
  textSecondary: "#6b6b6b",
  cream2: "#e8e5e1",
  cream3: "#f5f0e6",
  cream4: "#faf9f7",
  navy: "#163060",
  navyDeep: "#0f1f44",
  slateBlue: "#6d82ab",
  slateBlue2: "#8a9ec0",
  gold: "#c9a96e",
  goldDeep: "#a07830",
  goldDeep2: "#9c7420",
  royal: "#2457e7",
  royal2: "#2f5bd8",
  royal3: "#4f75dc",
  royalDeep: "#17398d",
  neutral: "#8a8a8a",
} as const

// ---------------------------------------------------------------------------
// Semantic colors — resolved per theme. Shape is identical light/dark so
// components can rely on every key existing.
// ---------------------------------------------------------------------------
export interface ThemeColors {
  // Surfaces
  bg: string // screen background
  bgSubtle: string // slightly raised page area / alt sections
  card: string // card / panel
  cardRaised: string // elevated card (modals, sheets)
  surface: string // chips, inputs, soft fills
  overlay: string // scrim behind modals

  // Text
  text: string
  textSecondary: string
  textMuted: string
  inverse: string // text on colored/primary backgrounds

  // Lines
  border: string
  borderStrong: string
  divider: string

  // Primary (sky)
  primary: string
  primaryDark: string
  primarySoft: string // tinted background for primary
  onPrimary: string

  // Secondary (emerald) + info (sky) accents
  secondary: string
  secondarySoft: string
  info: string
  infoSoft: string

  // Semantic
  success: string
  successSoft: string
  warning: string
  warningSoft: string
  danger: string
  dangerSoft: string

  // Order/status (charts + status chips)
  statusCompleted: string
  statusPending: string
  statusProcessing: string
  statusCancelled: string

  // Accents
  teal: string
  cyan: string
  violet: string
  amber: string

  // Brand
  forest: string
  brass: string
  cream: string

  // Misc
  star: string // rating gold
  skeleton: string
}

const light: ThemeColors = {
  bg: palette.white,
  bgSubtle: palette.slate50,
  card: palette.white,
  cardRaised: palette.white,
  surface: palette.slate100,
  overlay: "rgba(15, 23, 42, 0.55)",

  text: palette.slate900,
  textSecondary: palette.slate700, // slate-700 per website spec (was slate-500)
  textMuted: palette.slate500, // slate-500 per website spec (was slate-400)
  inverse: palette.white,

  border: palette.slate200,
  borderStrong: palette.slate300,
  divider: palette.slate100,

  primary: palette.sky500,
  primaryDark: palette.sky600,
  primarySoft: tw.sky[100], // #e0f2fe
  onPrimary: palette.white,

  secondary: tw.emerald[500],
  secondarySoft: tw.emerald[50],
  info: tw.sky[500],
  infoSoft: tw.sky[100],

  success: palette.emerald500,
  successSoft: palette.emerald50,
  warning: palette.amber500,
  warningSoft: palette.amber50,
  danger: palette.red500,
  dangerSoft: palette.red50,

  statusCompleted: tw.teal[500],
  statusPending: tw.amber[500],
  statusProcessing: tw.blue[500],
  statusCancelled: tw.orange[500],

  teal: palette.teal500,
  cyan: palette.cyan500,
  violet: palette.violet500,
  amber: palette.amber500,

  forest: palette.forest,
  brass: palette.brass,
  cream: palette.cream,

  star: palette.amber400,
  skeleton: palette.slate200,
}

const dark: ThemeColors = {
  bg: palette.slate900,
  bgSubtle: palette.slate900, // slate-900 base per website spec (was slate-950)
  card: palette.slate800,
  cardRaised: palette.slate800,
  surface: palette.slate700,
  overlay: "rgba(2, 6, 23, 0.7)",

  text: palette.slate100,
  textSecondary: palette.slate300, // slate-300 per website spec (was slate-400)
  textMuted: palette.slate400, // slate-400 per website spec (was slate-500)
  inverse: palette.white,

  border: palette.slate700,
  borderStrong: palette.slate600,
  divider: palette.slate800,

  primary: palette.sky400, // brighter accent in dark per website spec (was sky-500)
  primaryDark: palette.sky500,
  primarySoft: "rgba(14, 165, 233, 0.15)",
  onPrimary: palette.white,

  secondary: tw.emerald[400],
  secondarySoft: "rgba(16, 185, 129, 0.15)",
  info: tw.sky[400],
  infoSoft: "rgba(14, 165, 233, 0.15)",

  success: palette.emerald400,
  successSoft: "rgba(16, 185, 129, 0.15)",
  warning: palette.amber400,
  warningSoft: "rgba(245, 158, 11, 0.15)",
  danger: palette.red400,
  dangerSoft: "rgba(239, 68, 68, 0.15)",

  statusCompleted: tw.teal[400],
  statusPending: tw.amber[400],
  statusProcessing: tw.blue[400],
  statusCancelled: tw.orange[400],

  teal: palette.teal400,
  cyan: palette.cyan400,
  violet: palette.violet500,
  amber: palette.amber400,

  forest: palette.forest,
  brass: palette.brass,
  cream: palette.cream,

  star: palette.amber400,
  skeleton: palette.slate700,
}

/** Resolve the semantic color set for the current mode. */
export const getColors = (isDarkMode?: boolean): ThemeColors =>
  isDarkMode ? dark : light

export const themeColors = { light, dark }

// ---------------------------------------------------------------------------
// Spacing (4pt grid)
// ---------------------------------------------------------------------------
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 56,
}

// ---------------------------------------------------------------------------
// Radius
// ---------------------------------------------------------------------------
export const radius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  "2xl": 24,
  "3xl": 30,
  full: 9999,
}

// ---------------------------------------------------------------------------
// Typography — fontSize + lineHeight + weight presets. Spread into a Text
// style: <Text style={[type.h2, { color: c.text }]}>
// ---------------------------------------------------------------------------
export const type = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: "800" as const },
  h1: { fontSize: 24, lineHeight: 30, fontWeight: "800" as const },
  h2: { fontSize: 20, lineHeight: 26, fontWeight: "700" as const },
  h3: { fontSize: 17, lineHeight: 23, fontWeight: "700" as const },
  title: { fontSize: 15, lineHeight: 20, fontWeight: "700" as const },
  body: { fontSize: 14, lineHeight: 20, fontWeight: "400" as const },
  bodyStrong: { fontSize: 14, lineHeight: 20, fontWeight: "600" as const },
  bodySm: { fontSize: 13, lineHeight: 18, fontWeight: "400" as const },
  label: { fontSize: 12, lineHeight: 16, fontWeight: "600" as const },
  caption: { fontSize: 11, lineHeight: 14, fontWeight: "500" as const },
  overline: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "700" as const,
    letterSpacing: 0.6,
    textTransform: "uppercase" as const,
  },
  price: { fontSize: 20, lineHeight: 24, fontWeight: "800" as const },
  priceLg: { fontSize: 28, lineHeight: 32, fontWeight: "800" as const },
}

// ---------------------------------------------------------------------------
// Shadows — cross-platform elevation. Tinted slightly toward slate for a
// softer, more premium feel than pure black.
// ---------------------------------------------------------------------------
const SHADOW_COLOR = "#0f172a"

const makeShadow = (
  height: number,
  radiusPx: number,
  opacity: number,
  elevation: number
): ViewStyle =>
  Platform.OS === "android"
    ? { elevation, shadowColor: SHADOW_COLOR }
    : {
        shadowColor: SHADOW_COLOR,
        shadowOffset: { width: 0, height },
        shadowOpacity: opacity,
        shadowRadius: radiusPx,
      }

export const shadow = {
  none: {} as ViewStyle,
  sm: makeShadow(1, 3, 0.06, 2),
  md: makeShadow(3, 8, 0.08, 4),
  lg: makeShadow(8, 18, 0.12, 8),
  xl: makeShadow(14, 28, 0.16, 12),
}

// ---------------------------------------------------------------------------
// Signature gradients (sky→cyan hero/CTA, emerald→teal success, premium violet)
// Use with expo-linear-gradient: <LinearGradient colors={gradients.primary} .../>
// ---------------------------------------------------------------------------
export const gradients = {
  primary: [palette.sky500, palette.cyan500] as const,
  primarySoft: ["#e0f2fe", "#cffafe"] as const,
  // Deep sky → bright sky. The on-scheme hero/membership-card look, matching the
  // website's slate + sky blue identity (NOT the forest "brand" gradient, which
  // is for marketing surfaces only).
  membership: ["#0c4a6e", palette.sky600] as const,
  success: [palette.emerald400, palette.teal500] as const,
  premium: [palette.violet500, palette.indigo600] as const,
  sunset: [palette.amber400, palette.red500] as const,
  brand: [palette.forest, palette.forestDark] as const,
  brass: [palette.brass, palette.brassLight] as const,
  // Image scrims
  scrimBottom: ["transparent", "rgba(15,23,42,0.75)"] as const,
  scrimTop: ["rgba(15,23,42,0.55)", "transparent"] as const,
}

export const hairline = Platform.select({ ios: 0.5, default: 1 }) as number
