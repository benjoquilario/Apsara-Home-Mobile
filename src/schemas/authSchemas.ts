import { z } from "zod"

/* ------------------------------- Login ------------------------------- */

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Username or email is required."),
  password: z.string().min(1, "Password is required."),
})

export type LoginValues = z.infer<typeof loginSchema>

/* ------------------------------ Signup ------------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Each rule doubles as the live password-checklist label.
export const PASSWORD_RULES: Array<{ label: string; test: (v: string) => boolean }> = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "At least one uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "At least one lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "At least one number", test: (v) => /[0-9]/.test(v) },
  { label: "At least one special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
]

const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[a-z]/, "At least one lowercase letter")
  .regex(/[0-9]/, "At least one number")
  .regex(/[^A-Za-z0-9]/, "At least one special character")

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    mobileNumber: z
      .string()
      .refine((v) => v.replace(/\D/g, "").length === 11, "Use 11 digits only."),
    email: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || EMAIL_RE.test(v), "Enter a valid email address."),
    username: z
      .string()
      .trim()
      .min(1, "Username is required.")
      .regex(/^[a-zA-Z0-9]+$/, "Letters and numbers only, no spaces or symbols."),
    referralCode: z.string().trim().min(1, "Referral code or link is required."),
    password: passwordSchema,
    passwordConfirmation: z.string().min(1, "Please confirm your password."),
    acceptedTerms: z
      .boolean()
      .refine((v) => v === true, "Please agree to the Terms and Conditions."),
  })
  .refine((d) => d.password === d.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  })

export type SignupValues = z.infer<typeof signupSchema>

export const SIGNUP_DEFAULTS: SignupValues = {
  firstName: "",
  lastName: "",
  mobileNumber: "",
  email: "",
  username: "",
  referralCode: "",
  password: "",
  passwordConfirmation: "",
  acceptedTerms: false,
}

/* ------------------------- Referral signup --------------------------- */

// The referral flow shows these as a live checklist but (matching the original
// behavior) only enforces min-length + match. Note: no special-char rule.
export const REFERRAL_PASSWORD_RULES: Array<{
  label: string
  test: (v: string) => boolean
}> = [
  { label: "At least 8 chars", test: (v) => v.length >= 8 },
  { label: "At least one Uppercase", test: (v) => /[A-Z]/.test(v) },
  { label: "At least one Lowercase", test: (v) => /[a-z]/.test(v) },
  { label: "At least one Number", test: (v) => /\d/.test(v) },
]

export const referralSignupSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    mobileNumber: z
      .string()
      .refine((v) => v.replace(/\D/g, "").length === 11, "Use 11 digits only."),
    email: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || EMAIL_RE.test(v), "Enter a valid email address."),
    username: z
      .string()
      .trim()
      .min(1, "Username is required.")
      .regex(/^[a-zA-Z0-9]+$/, "Letters and numbers only, no spaces or symbols."),
    referralCode: z.string().trim().min(1, "Referral code is required."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    passwordConfirmation: z.string().min(1, "Please confirm your password."),
    acceptedTerms: z
      .boolean()
      .refine((v) => v === true, "Please agree to the Terms and Conditions."),
  })
  .refine((d) => d.password === d.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  })

export type ReferralSignupValues = z.infer<typeof referralSignupSchema>

/* ------------------------------- OTP --------------------------------- */

export const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{4,6}$/, "Enter the verification code."),
})

export type OtpValues = z.infer<typeof otpSchema>

// Registration OTP is exactly 4 digits.
export const registerOtpSchema = z.object({
  otp: z.string().regex(/^\d{4}$/, "Please enter the 4-digit code."),
})

export type RegisterOtpValues = z.infer<typeof registerOtpSchema>
