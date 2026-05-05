import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  Animated,
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { Colors } from '../constants/colors';
import Toast from 'react-native-toast-message';

interface CartItem {
  crt_id: number;
  crt_customer_id: number;
  crt_product_id: number;
  crt_variant_id: number | null;
  crt_quantity: number;
  crt_selected_color: string | null;
  crt_selected_size: string | null;
  crt_selected_type: string | null;
  crt_unit_price: string;
  crt_total_price: string;
  crt_status: string;
  crt_created_at: string;
  crt_updated_at: string;
  product_name: string;
  product_image: string;
  product_price_srp: string;
  product_price_dp: string;
  product_price_member: string;
  product_prodpv: string;
  brand_name: string;
}

interface CartScreenProps {
  token?: string | null;
  onCheckout?: () => void;
  onBack?: () => void;
}

export default function CartScreen({ token, onCheckout, onBack }: CartScreenProps) {
  const insets = useSafeAreaInsets();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [updatingQuantity, setUpdatingQuantity] = useState<number | null>(null);
  const [removingItem, setRemovingItem] = useState<number | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack?.();
      return true;
    });

    return () => sub.remove();
  }, [onBack]);

  const fetchCart = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API_CONFIG.BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data.cart_items || []);
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load cart',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCart();
    setRefreshing(false);
  };

  const handleSelectItem = (crtId: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(crtId)) {
      newSelected.delete(crtId);
    } else {
      newSelected.add(crtId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set(cartItems.map(item => item.crt_id));
      setSelectedItems(allIds);
    }
  };

  const handleUpdateQuantity = async (crtId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setUpdatingQuantity(crtId);
      await axios.patch(
        `${API_CONFIG.BASE_URL}/cart/${crtId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems(cartItems.map(item =>
        item.crt_id === crtId
          ? {
              ...item,
              crt_quantity: newQuantity,
              crt_total_price: (parseFloat(item.crt_unit_price) * newQuantity).toString(),
            }
          : item
      ));
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update quantity',
      });
    } finally {
      setUpdatingQuantity(null);
    }
  };

  const handleRemoveItem = async (crtId: number) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item from cart?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Remove',
        onPress: async () => {
          try {
            setRemovingItem(crtId);
            await axios.delete(`${API_CONFIG.BASE_URL}/cart/${crtId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            setCartItems(cartItems.filter(item => item.crt_id !== crtId));
            setSelectedItems(prev => {
              const newSet = new Set(prev);
              newSet.delete(crtId);
              return newSet;
            });

            Toast.show({
              type: 'success',
              text1: 'Removed',
              text2: 'Item removed from cart',
            });
          } catch (error: any) {
            console.error('Error removing item:', error);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Failed to remove item',
            });
          } finally {
            setRemovingItem(null);
          }
        },
      },
    ]);
  };

  const getSelectedTotal = () => {
    return Array.from(selectedItems).reduce((total, crtId) => {
      const item = cartItems.find(c => c.crt_id === crtId);
      return total + (item ? parseFloat(item.crt_total_price) : 0);
    }, 0);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const scaleAnim = new Animated.Value(1);
    const discount = Math.round(
      ((parseFloat(item.product_price_srp) - parseFloat(item.crt_unit_price)) / parseFloat(item.product_price_srp)) * 100
    );
    const hasVariants = !!(item.crt_selected_color || item.crt_selected_size || item.crt_selected_type);

    return (
      <View style={[styles.cartItemContainer, selectedItems.has(item.crt_id) && styles.containerSelected]}>
        {discount > 0 && (
          <LinearGradient
            colors={['transparent', Colors.sky + '15']}
            style={styles.containerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        )}
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => handleSelectItem(item.crt_id)}
          activeOpacity={0.7}
        >
          <Animated.View style={[styles.checkboxBox, selectedItems.has(item.crt_id) && styles.checkboxBoxChecked, { transform: [{ scale: scaleAnim }] }]}>
            {selectedItems.has(item.crt_id) && <Ionicons name="checkmark" size={14} color={Colors.white} />}
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.contentWrapper}>
          {/* Image Container */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.product_image }}
              style={styles.productImage}
              resizeMode="cover"
            />
            {discount > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discount}%</Text>
              </View>
            )}
          </View>

          {/* Details Container */}
          <View style={styles.detailsContainer}>
            {/* Brand & Name */}
            <View>
              <Text style={styles.brand} numberOfLines={1}>{item.brand_name}</Text>
              <Text style={styles.productName} numberOfLines={2}>{item.product_name}</Text>
            </View>

            {/* Variants Display */}
            {hasVariants && (
              <View style={styles.variantContainer}>
                {item.crt_selected_color && (
                  <Text style={styles.variantText}>
                    <Ionicons name="color-palette" size={10} color={Colors.sky} /> {item.crt_selected_color}
                  </Text>
                )}
                {item.crt_selected_size && (
                  <Text style={styles.variantText}>
                    <Ionicons name="resize" size={10} color={Colors.sky} /> {item.crt_selected_size}
                  </Text>
                )}
                {item.crt_selected_type && (
                  <Text style={styles.variantText}>
                    <Ionicons name="cube" size={10} color={Colors.sky} /> {item.crt_selected_type}
                  </Text>
                )}
              </View>
            )}

            {/* Price Row */}
            <View style={styles.priceRow}>
              <Text style={styles.memberPrice}>₱{parseFloat(item.crt_unit_price).toLocaleString()}</Text>
              {parseFloat(item.product_price_srp) > parseFloat(item.crt_unit_price) && (
                <Text style={styles.srpPrice}>₱{parseFloat(item.product_price_srp).toLocaleString()}</Text>
              )}
            </View>

            {/* Badge Row */}
            <View style={styles.badgeRow}>
              <LinearGradient
                colors={[Colors.sky, Colors.skyDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.pvBadge}
              >
                <Ionicons name="trending-up" size={9} color={Colors.white} />
                <Text style={styles.pvText}>{parseFloat(item.product_prodpv).toLocaleString()} PV</Text>
              </LinearGradient>
            </View>

            {/* Quantity & Total */}
            <View style={styles.quantityTotalRow}>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={[styles.quantityBtn, updatingQuantity === item.crt_id && { opacity: 0.6 }]}
                  onPress={() => handleUpdateQuantity(item.crt_id, item.crt_quantity - 1)}
                  disabled={updatingQuantity === item.crt_id}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={12} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.crt_quantity}</Text>
                <TouchableOpacity
                  style={[styles.quantityBtn, updatingQuantity === item.crt_id && { opacity: 0.6 }]}
                  onPress={() => handleUpdateQuantity(item.crt_id, item.crt_quantity + 1)}
                  disabled={updatingQuantity === item.crt_id}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={12} color={Colors.text} />
                </TouchableOpacity>
              </View>

              <Text style={styles.totalPrice}>₱{parseFloat(item.crt_total_price).toLocaleString()}</Text>

              <TouchableOpacity
                style={[styles.removeBtn, removingItem === item.crt_id && { opacity: 0.6 }]}
                onPress={() => handleRemoveItem(item.crt_id)}
                disabled={removingItem === item.crt_id}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={14} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.sky} />
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={[styles.emptyContainer, { paddingTop: insets.top }]}>
        <Ionicons name="cart-outline" size={64} color={Colors.textSecondary} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Add items to get started shopping</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Select All */}
      <View style={styles.selectAllContainer}>
        <TouchableOpacity
          style={styles.selectAllBtn}
          onPress={handleSelectAll}
          activeOpacity={0.7}
        >
          <View style={[styles.selectAllCheckbox, selectedItems.size > 0 && styles.selectAllCheckboxChecked]}>
            {selectedItems.size > 0 && (
              <Ionicons name="checkmark" size={14} color={Colors.white} />
            )}
          </View>
          <Text style={[styles.selectAllText, selectedItems.size > 0 && styles.selectAllTextActive]}>
            {selectedItems.size > 0 ? `${selectedItems.size} selected` : 'Select All'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.crt_id.toString()}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.sky]}
            tintColor={Colors.sky}
          />
        }
      />

      {/* Footer */}
      {selectedItems.size > 0 && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.totalSection}>
            <View>
              <Text style={styles.totalLabel}>Total ({selectedItems.size}):</Text>
              <Text style={styles.totalPrice}>₱{getSelectedTotal().toLocaleString()}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={onCheckout}
            activeOpacity={0.7}
          >
            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  selectAllContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectAllCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectAllCheckboxChecked: {
    backgroundColor: Colors.sky,
    borderColor: Colors.sky,
  },
  selectAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  selectAllTextActive: {
    color: Colors.sky,
    fontWeight: '700',
  },
  listContent: {
    backgroundColor: Colors.white,
  },
  cartItemContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 10,
    alignItems: 'flex-start',
    position: 'relative',
  },
  containerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  containerSelected: {
    backgroundColor: '#f0f7ff',
  },
  checkbox: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: Colors.sky,
    borderColor: Colors.sky,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    zIndex: 1,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    flexShrink: 0,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  detailsContainer: {
    flex: 1,
    gap: 5,
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 16,
  },
  variantContainer: {
    gap: 2,
    marginTop: 2,
  },
  variantText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.sky,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  memberPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  srpPrice: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginTop: 2,
    flexWrap: 'wrap',
  },
  pvBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pvText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.2,
  },
  quantityTotalRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quantityBtn: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  quantityText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
    minWidth: 28,
    textAlign: 'center',
  },
  totalPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.sky,
    minWidth: 60,
    textAlign: 'right',
  },
  removeBtn: {
    padding: 4,
  },
  footer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  checkoutBtn: {
    backgroundColor: Colors.sky,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
