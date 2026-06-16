import React from "react"
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native"
import Icon from "../ui/Icon"
import { Colors } from "../../constants/colors"
import { getColors, tw } from "../../theme/theme"
import { getCategoryIcon } from "../../utils/categoryIcons"

interface CategoryStripItem {
  id: number
  name: string
}

interface CategoryStripProps {
  categories: CategoryStripItem[]
  selectedCategoryId?: number | null
  isDarkMode?: boolean
  onSelect?: (categoryId: number | null) => void
}

/**
 * Horizontal category circle strip (lucide icons) for the Shop screen. Leads
 * with an "All" chip; the selected category renders filled.
 */
function CategoryStrip({
  categories,
  selectedCategoryId = null,
  isDarkMode = false,
  onSelect,
}: CategoryStripProps) {
  const t = getColors(isDarkMode)
  const idleBg = isDarkMode ? tw.slate[800] : tw.slate[100]

  const renderCircle = (
    key: string,
    label: string,
    iconName: string,
    active: boolean,
    onPress: () => void
  ) => (
    <Pressable key={key} style={styles.item} onPress={onPress}>
      <View
        style={[
          styles.circle,
          { backgroundColor: active ? Colors.sky : idleBg },
        ]}
      >
        <Icon
          name={iconName}
          size={24}
          color={active ? Colors.white : t.text}
        />
      </View>
      <Text
        style={[
          styles.label,
          { color: active ? Colors.sky : t.textSecondary },
          active && styles.labelActive,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  )

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      {renderCircle(
        "all",
        "All",
        "layout-grid",
        selectedCategoryId == null,
        () => onSelect?.(null)
      )}
      {categories.map((c) =>
        renderCircle(
          String(c.id),
          c.name,
          getCategoryIcon(c.name),
          selectedCategoryId === c.id,
          () => onSelect?.(c.id)
        )
      )}
    </ScrollView>
  )
}

export default React.memo(CategoryStrip)

const styles = StyleSheet.create({
  // RN's ScrollView base style is flexGrow:1; without this the horizontal strip
  // stretches vertically to fill the column and leaves a huge empty gap.
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 16,
  },
  item: {
    alignItems: "center",
    width: 64,
    gap: 6,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
  },
  labelActive: {
    fontWeight: "700",
  },
})
