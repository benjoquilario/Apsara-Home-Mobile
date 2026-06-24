import { StyleSheet } from "react-native"
import { Colors } from "../constants/colors"
import { radius, shadow } from "../theme/theme"

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },

  // ── White header ──────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginLeft: 4,
  },

  content: { padding: 12, paddingBottom: 24 },

  // ── Card + section ────────────────────────────────────────────────────
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 6,
    ...shadow.sm,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginTop: 14,
    marginBottom: 8,
    marginLeft: 4,
  },

  // ── Row ───────────────────────────────────────────────────────────────
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  iconChip: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: "600" },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  rowValue: { fontSize: 13, fontWeight: "500" },

  // ── Profile card ──────────────────────────────────────────────────────
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
  },
  profileAvatar: { width: 56, height: 56, borderRadius: 28 },
  profileAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatarInitial: { fontSize: 22, fontWeight: "800" },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: "800", marginBottom: 2 },
  profileEmail: { fontSize: 13, fontWeight: "400" },

  // ── Payments ──────────────────────────────────────────────────────────
  paymentCard: { padding: 14 },
  paymentLabel: { fontSize: 14, fontWeight: "700", marginBottom: 6 },
  paymentMethods: { fontSize: 12.5, lineHeight: 19, fontWeight: "400" },

  // ── Logout ────────────────────────────────────────────────────────────
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginTop: 14,
  },

  versionFooter: { alignItems: "center", paddingVertical: 18 },
  versionText: { fontSize: 12, fontWeight: "500" },

  // ── Logout modal ──────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  modalMessage: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 24,
  },
  modalButtons: { width: "100%", gap: 10 },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: { borderWidth: 1.5 },
  cancelButtonText: { fontSize: 14, fontWeight: "600" },
  logoutConfirmButton: { backgroundColor: Colors.error },
  logoutConfirmText: { fontSize: 14, fontWeight: "600", color: Colors.white },
})

export default styles
