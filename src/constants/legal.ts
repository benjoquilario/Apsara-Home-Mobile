// Live legal pages shown in the in-app WebView during auth flows.
export const LEGAL_URLS = {
  terms: "https://afhome.ph/terms-and-conditions",
  privacy: "https://afhome.ph/privacy-policy",
} as const

export type LegalDoc = keyof typeof LEGAL_URLS

export const LEGAL_TITLES: Record<LegalDoc, string> = {
  terms: "Terms and Conditions",
  privacy: "Privacy Policy",
}
