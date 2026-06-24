import { StyleSheet } from "react-native"
import { Colors } from "../constants/colors"

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingBottom: 14,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 20, fontWeight: "800", letterSpacing: -0.3 },
  content: { padding: 12, gap: 10, paddingBottom: 30 },
  card: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 6 },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  rankBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: { color: Colors.white, fontSize: 11, fontWeight: "800" },
  badgeImage: {
    width: 44,
    height: 44,
  },
  tierName: { fontSize: 15, fontWeight: "800" },
  rankLabel: { fontSize: 11, fontWeight: "600", marginTop: 1 },
  statePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statePillText: { fontSize: 10.5, fontWeight: "800" },
  reqGrid: {
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 4,
    gap: 8,
  },
  reqRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reqLabel: { fontSize: 12.5, fontWeight: "500" },
  reqValue: { fontSize: 12.5, fontWeight: "700" },
})

export default styles
