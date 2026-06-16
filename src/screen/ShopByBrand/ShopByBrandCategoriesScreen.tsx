import React from "react"
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native"
import { Image } from "expo-image"
import Ionicons from "../../components/ui/Icon"
import { Colors } from "../../constants/colors"
import { getCategoryIcon } from "../../utils/categoryIcons"

interface Category {
  id: number
  name: string
  image?: string
  product_count?: number
}

interface ShopByBrandCategoriesScreenProps {
  categories: Category[]
  isDarkMode?: boolean
  onCategoryPress?: (categoryId: number) => void
  onShopNow?: () => void
}

const FEATURED_COLLECTIONS = [
  { name: "Space Saving", count: "150+ Items", icon: "cube-outline" },
  { name: "Home Office", count: "110+ Items", icon: "briefcase" },
  { name: "Modern Wood", count: "130+ Items", icon: "layers" },
  { name: "Best Sellers", count: "200+ Items", icon: "star" },
]

export default function ShopByBrandCategoriesScreen({
  categories,
  isDarkMode = false,
  onCategoryPress = () => {},
  onShopNow = () => {},
}: ShopByBrandCategoriesScreenProps) {
  const t = {
    text: isDarkMode ? "#f8fafc" : Colors.text,
    textSec: isDarkMode ? "#94a3b8" : Colors.textSecondary,
    card: isDarkMode ? "#1f2937" : Colors.white,
    border: isDarkMode ? "#374151" : "#e5e7eb",
    imageBg: isDarkMode ? "#0f172a" : "#f1f5f9",
    soft: isDarkMode ? "rgba(14,165,233,0.15)" : "#e0f2fe",
    voucherBg: isDarkMode ? "rgba(14,165,233,0.12)" : "#eff6ff",
  }

  if (!categories || categories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="folder-outline" size={48} color={t.textSec} />
        <Text style={[styles.emptyText, { color: t.textSec }]}>
          No categories found
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Shop by Category */}
      <Text style={[styles.sectionTitle, { color: t.text }]}>
        Shop by Category
      </Text>
      <View style={styles.grid}>
        {categories.map((category, index) => (
          <Pressable
            key={`category-${category.id || index}`}
            style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}
            onPress={() => onCategoryPress(category.id)}
          >
            <View style={[styles.cardImage, { backgroundColor: t.imageBg }]}>
              {category.image ? (
                <Image
                  source={{ uri: category.image }}
                  style={styles.cardImageInner}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <Ionicons
                  name={getCategoryIcon(category.name)}
                  size={26}
                  color={Colors.sky}
                />
              )}
            </View>
            <View style={styles.cardText}>
              <Text
                style={[styles.cardName, { color: t.text }]}
                numberOfLines={2}
              >
                {category.name}
              </Text>
              <Text style={[styles.cardCount, { color: t.textSec }]}>
                {category.product_count
                  ? `${category.product_count}+ Items`
                  : "View all"}
              </Text>
            </View>
            <View style={[styles.cardChevron, { backgroundColor: t.soft }]}>
              <Ionicons name="chevron-forward" size={14} color={Colors.sky} />
            </View>
          </Pressable>
        ))}
      </View>

      {/* Featured Collections */}
      <Text style={[styles.sectionTitle, { color: t.text }]}>
        Featured Collections
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.collectionsRow}
      >
        {FEATURED_COLLECTIONS.map((c) => (
          <Pressable
            key={c.name}
            style={[styles.collectionChip, { backgroundColor: t.card, borderColor: t.border }]}
            onPress={onShopNow}
          >
            <View style={[styles.collectionIcon, { backgroundColor: t.soft }]}>
              <Ionicons name={c.icon} size={16} color={Colors.sky} />
            </View>
            <View style={styles.collectionText}>
              <Text style={[styles.collectionName, { color: t.text }]} numberOfLines={1}>
                {c.name}
              </Text>
              <Text style={[styles.collectionCount, { color: t.textSec }]} numberOfLines={1}>
                {c.count}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Voucher banner */}
      <View style={[styles.voucher, { backgroundColor: t.voucherBg, borderColor: t.border }]}>
        <View style={styles.voucherIcon}>
          <Ionicons name="pricetag" size={18} color={Colors.white} />
        </View>
        <View style={styles.voucherText}>
          <Text style={[styles.voucherTitle, { color: Colors.sky }]} numberOfLines={1}>
            Enjoy 8% Off on Eligible Items
          </Text>
          <Text style={[styles.voucherSub, { color: t.textSec }]} numberOfLines={1}>
            Save more on your favorite furniture
          </Text>
        </View>
        <Pressable style={styles.voucherBtn} onPress={onShopNow}>
          <Text style={styles.voucherBtnText}>Shop Now</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginTop: 10,
    marginBottom: 12,
    marginLeft: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    width: "48.5%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImageInner: {
    width: "100%",
    height: "100%",
  },
  cardText: {
    flex: 1,
    justifyContent: "center",
  },
  cardName: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 17,
  },
  cardCount: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 3,
  },
  cardChevron: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  collectionsRow: {
    gap: 8,
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  collectionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  collectionIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  collectionText: {
    justifyContent: "center",
  },
  collectionName: {
    fontSize: 12.5,
    fontWeight: "700",
  },
  collectionCount: {
    fontSize: 10.5,
    fontWeight: "500",
    marginTop: 1,
  },
  voucher: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginTop: 16,
    marginHorizontal: 4,
  },
  voucherIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.sky,
    alignItems: "center",
    justifyContent: "center",
  },
  voucherText: {
    flex: 1,
  },
  voucherTitle: {
    fontSize: 13.5,
    fontWeight: "800",
  },
  voucherSub: {
    fontSize: 11.5,
    fontWeight: "500",
    marginTop: 2,
  },
  voucherBtn: {
    backgroundColor: Colors.sky,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  voucherBtnText: {
    color: Colors.white,
    fontSize: 12.5,
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "500",
  },
})
