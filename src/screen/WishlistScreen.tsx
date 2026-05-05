import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { API_CONFIG } from '../config/api';
import ItemList from '../components/Items/ItemList';
import SelectedItemsModal from '../components/Items/SelectedItemsModal';

interface WishlistItem {
  wishlist_id: number;
  product_id: number;
  date_added: string;
  product: {
    id: number;
    name: string;
    brand: string;
    image: string;
    priceSrp: number;
    priceMember: number;
    avgRating: number;
    qty: number;
    prodpv: number;
  };
}

interface WishlistScreenProps {
  token?: string | null;
  wishlistItems: WishlistItem[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onProductPress?: (id: number) => void;
}

export default function WishlistScreen({ token, wishlistItems, loading, refreshing, onRefresh, onProductPress }: WishlistScreenProps) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(wishlistItems);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [sortOrder, setSortOrder] = useState<'new' | 'old'>('new');
  const [discountFilter, setDiscountFilter] = useState<'all' | 'discount'>('all');
  const [showModal, setShowModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    setWishlist(wishlistItems);
  }, [wishlistItems]);

  const handleSelectItem = (wishlistId: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(wishlistId)) {
      newSelected.delete(wishlistId);
    } else {
      newSelected.add(wishlistId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === wishlist.length) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set(wishlist.map(item => item.wishlist_id));
      setSelectedItems(allIds);
    }
  };

  const getSortedWishlist = () => {
    let filtered = wishlist;

    // Filter by discount
    if (discountFilter === 'discount') {
      filtered = filtered.filter(item => {
        const discount = Math.round(
          ((item.product.priceSrp - item.product.priceMember) / item.product.priceSrp) * 100
        );
        return discount > 0;
      });
    }

    // Sort by date
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date_added).getTime();
      const dateB = new Date(b.date_added).getTime();
      return sortOrder === 'new' ? dateB - dateA : dateA - dateB;
    });
  };

  const getSelectedTotal = () => {
    return Array.from(selectedItems).reduce((total, wishlistId) => {
      const item = wishlist.find(w => w.wishlist_id === wishlistId);
      return total + (item ? item.product.priceMember : 0);
    }, 0);
  };

  const getSelectedItemsForModal = () => {
    return Array.from(selectedItems)
      .map(wishlistId => wishlist.find(w => w.wishlist_id === wishlistId))
      .filter((item): item is WishlistItem => item !== undefined);
  };

  const handleAddSelectedToCart = async () => {
    if (!token) return;

    try {
      setAddingToCart(true);
      const selectedItemsList = getSelectedItemsForModal();

      // Add each selected item to cart via /wishlist endpoint
      await Promise.all(
        selectedItemsList.map(item =>
          axios.post(
            `${API_CONFIG.BASE_URL}/wishlist`,
            { product_id: item.product.id },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      Toast.show({
        type: 'success',
        text1: 'Added to Cart',
        text2: `${selectedItemsList.length} items added to cart`,
      });

      setShowModal(false);
      setSelectedItems(new Set());
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add items to cart',
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const removeFromWishlist = async (wishlistId: number) => {
    try {
      const wishlistItem = wishlist.find(item => item.wishlist_id === wishlistId);
      const productId = wishlistItem?.product.id;

      // Call DELETE API to remove from wishlist
      if (token && productId) {
        await axios.delete(`${API_CONFIG.BASE_URL}/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Update local state
      setWishlist(wishlist.filter((item) => item.wishlist_id !== wishlistId));
      setWishlistCount(prev => Math.max(0, prev - 1));

      Toast.show({
        type: 'success',
        text1: 'Removed',
        text2: 'Item removed from wishlist',
      });
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to remove item',
      });
    }
  };

  const renderWishlistItem = ({ item }: { item: WishlistItem }) => (
    <ItemList
      wishlist_id={item.wishlist_id}
      product_id={item.product_id}
      product={item.product}
      isSelected={selectedItems.has(item.wishlist_id)}
      onProductPress={onProductPress}
      onRemove={removeFromWishlist}
      onSelect={handleSelectItem}
      onAddToCart={() => {
        Toast.show({
          type: 'success',
          text1: 'Added to Cart',
          text2: 'Item added to your cart',
        });
      }}
    />
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.sky} />
      </View>
    );
  }

  if (wishlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={64} color={Colors.textSecondary} />
        <Text style={styles.emptyTitle}>No items in your wishlist</Text>
        <Text style={styles.emptySubtitle}>Add items to your wishlist to save them for later</Text>
      </View>
    );
  }

  const sortedWishlist = getSortedWishlist();

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
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

          <View style={styles.filterSection}>
            <TouchableOpacity
              style={[styles.filterBtn, sortOrder === 'new' && styles.filterBtnActive]}
              onPress={() => setSortOrder('new')}
            >
              <Text style={[styles.filterText, sortOrder === 'new' && styles.filterTextActive]}>New</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterBtn, sortOrder === 'old' && styles.filterBtnActive]}
              onPress={() => setSortOrder('old')}
            >
              <Text style={[styles.filterText, sortOrder === 'old' && styles.filterTextActive]}>Old</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterBtn, discountFilter === 'discount' && styles.filterBtnActive]}
              onPress={() => setDiscountFilter(discountFilter === 'discount' ? 'all' : 'discount')}
            >
              <Text style={[styles.filterText, discountFilter === 'discount' && styles.filterTextActive]}>On Sale</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={sortedWishlist}
        renderItem={renderWishlistItem}
        keyExtractor={(item) => item.wishlist_id.toString()}
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

      {selectedItems.size > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total ({selectedItems.size}):</Text>
            <Text style={styles.totalPrice}>₱{getSelectedTotal().toLocaleString()}</Text>
          </View>
          <TouchableOpacity
            style={[styles.checkoutBtn, addingToCart && { opacity: 0.6 }]}
            onPress={() => setShowModal(true)}
            disabled={addingToCart}
          >
            <Text style={styles.checkoutBtnText}>Add Selected to Cart</Text>
          </TouchableOpacity>
        </View>
      )}

      <SelectedItemsModal
        visible={showModal}
        selectedItems={getSelectedItemsForModal()}
        selectedCount={selectedItems.size}
        totalPrice={getSelectedTotal()}
        onClose={() => setShowModal(false)}
        onAddToCart={handleAddSelectedToCart}
        loading={addingToCart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
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
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 4,
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
  filterSection: {
    flexDirection: 'row',
    gap: 6,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    borderWidth: 0,
  },
  filterBtnActive: {
    backgroundColor: Colors.sky,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
  },
  filterTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  listContent: {
    backgroundColor: Colors.white,
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
    alignItems: 'center',
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
