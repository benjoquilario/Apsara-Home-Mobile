import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Icon from "../ui/Icon"
import { Colors } from "../../constants/colors"
import { getColors, tw } from "../../theme/theme"

interface ShopHeaderProps {
  cartCount?: number
  wishlistCount?: number
  isDarkMode?: boolean
  filterActive?: boolean
  onSearchPress?: () => void
  onCartPress?: () => void
  onWishlistPress?: () => void
  onFilterPress?: () => void
}

/**
 * Shop top bar — "Shop" title + wishlist/cart actions, then a search field with
 * a filter toggle. Distinct from the gradient AppHeader; matches the redesigned
 * Shop layout.
 */
function ShopHeader({
  isDarkMode = false,
  filterActive = false,
  onSearchPress,
  onFilterPress,
}: ShopHeaderProps) {
  const insets = useSafeAreaInsets()
  const t = getColors(isDarkMode)
  const colors = {
    bg: t.card,
    text: t.text,
    textSec: t.textSecondary,
    border: t.border,
    searchBg: isDarkMode ? tw.slate[900] : tw.slate[100],
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg, paddingTop: insets.top + 8 },
      ]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.title, { color: colors.text }]}>Shop</Text>
      </View>

      <View style={styles.searchRow}>
        <TouchableOpacity
          style={[styles.searchField, { backgroundColor: colors.searchBg }]}
          activeOpacity={0.7}
          onPress={onSearchPress}
        >
          <Icon name="search" size={18} color={colors.textSec} />
          <Text
            style={[styles.searchPlaceholder, { color: colors.textSec }]}
            numberOfLines={1}
          >
            Search for products, brands...
          </Text>
          <TouchableOpacity
            onPress={onFilterPress}
            hitSlop={8}
            style={[
              styles.filterBtn,
              filterActive && { backgroundColor: Colors.sky },
            ]}
          >
            <Icon
              name="options-outline"
              size={18}
              color={filterActive ? Colors.white : colors.textSec}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default React.memo(ShopHeader)

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
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
  searchRow: {
    marginTop: 12,
  },
  searchField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 46,
    borderRadius: 14,
    paddingLeft: 14,
    paddingRight: 6,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
  },
  filterBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
})
