// Aligned to the website's semantic palette (slate spine + sky accent). The
// theme.ts `getColors()` is the per-mode source of truth; these flat constants
// are the light-mode defaults used by call sites that don't thread isDarkMode.
export const Colors = {
  // Brand (marketing surfaces — unchanged)
  cream: "#faf8f5",
  forest: "#2c5f4f",
  forestDark: "#1e4236",
  brass: "#d4a574",
  brassLight: "#e8c4a0",
  // Primary action (sky-500 / sky-600)
  sky: "#0ea5e9",
  skyDark: "#0284c7",
  // Neutral — slate-based semantic text/borders (was brand #1a1a1a / #6b6b6b)
  text: "#0f172a", // slate-900
  textSecondary: "#334155", // slate-700
  white: "#ffffff",
  inputBorder: "#e2e8f0", // slate-200
  inputBackground: "#ffffff",
  error: "#ef4444", // red-500
}
