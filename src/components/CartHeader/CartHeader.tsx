import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Icon from "../ui/Icon"
import { Colors } from "../../constants/colors"
import { getColors } from "../../theme/theme"

interface CartHeaderProps {
  title?: string
  wishlistCount?: number
  isDarkMode?: boolean
  onBack?: () => void
  onWishlistPress?: () => void
}

/**
 * White back-screen header (back · title · wishlist) matching the app's
 * reference design language — replaces the old dark image-background header.
 */
function CartHeader({
  title = "My Cart",
  wishlistCount = 0,
  isDarkMode = false,
  onBack,
  onWishlistPress,
}: CartHeaderProps) {
  const insets = useSafeAreaInsets()
  const t = getColors(isDarkMode)

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: t.card,
          borderBottomColor: t.border,
          paddingTop: insets.top + 8,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={onBack}
        activeOpacity={0.7}
        hitSlop={8}
      >
        <Icon name="chevron-back-outline" size={24} color={t.text} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: t.text }]} numberOfLines={1}>
        {title}
      </Text>

      <TouchableOpacity
        style={styles.iconBtn}
        onPress={onWishlistPress}
        activeOpacity={0.7}
        hitSlop={8}
      >
        <Icon name="heart-outline" size={22} color={t.text} />
        {wishlistCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {wishlistCount > 99 ? "99+" : wishlistCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default React.memo(CartHeader)

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  iconBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginLeft: 4,
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: "800",
  },
})
