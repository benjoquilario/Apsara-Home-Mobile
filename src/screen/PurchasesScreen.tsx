import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { API_CONFIG } from '../config/api';
import Toast from 'react-native-toast-message';

interface OrderItem {
  id: number;
  product_id: number;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  selected_color?: string;
  selected_size?: string;
  selected_type?: string;
}

interface Order {
  id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  created_at: string;
  total_amount: number;
  shipping_fee: number;
  payment_method: string;
  tracking_number?: string;
  items: OrderItem[];
}

interface PurchasesScreenProps {
  token?: string | null;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered';
  isDarkMode?: boolean;
  onBack?: () => void;
  onProceedToPayment?: (order: Order) => void;
  onProductPress?: (productId: number) => void;
}

const STATUS_CONFIG = {
  pending: {
    icon: 'time-outline',
    color: '#ef4444',
    label: 'Pending',
    description: 'Awaiting payment confirmation',
  },
  processing: {
    icon: 'hourglass-outline',
    color: '#f59e0b',
    label: 'Processing',
    description: 'Order is being prepared',
  },
  shipped: {
    icon: 'car-outline',
    color: '#3b82f6',
    label: 'Shipped',
    description: 'On the way to you',
  },
  delivered: {
    icon: 'checkmark-circle-outline',
    color: '#10b981',
    label: 'Delivered',
    description: 'Order completed',
  },
};

export default function PurchasesScreen({
  token,
  status = 'pending',
  isDarkMode = false,
  onBack,
  onProceedToPayment,
  onProductPress,
}: PurchasesScreenProps) {
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [timeLeft, setTimeLeft] = useState<Record<number, string>>({});

  const colors = {
    bg: isDarkMode ? '#0f172a' : '#f0f9ff',
    containerBg: isDarkMode ? '#1f2937' : Colors.white,
    text: isDarkMode ? '#f8fafc' : Colors.text,
    textSec: isDarkMode ? '#94a3b8' : Colors.textSecondary,
    border: isDarkMode ? '#374151' : '#e5e7eb',
    borderLight: isDarkMode ? '#475569' : '#f1f5f9',
  };

  const fetchOrders = async (showLoading = true) => {
    if (!token) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Authentication required',
      });
      return;
    }

    if (showLoading) setLoading(true);
    try {
      console.log('[PurchasesScreen] Fetching orders with status:', status);
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/orders/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('[PurchasesScreen] All orders fetched:', response.data);

      // Filter orders by selected status
      const allOrders = response.data?.orders || [];
      const filteredOrders = allOrders.filter((order: Order) => order.status === status);

      console.log('[PurchasesScreen] Filtered orders for status', status, ':', filteredOrders);
      setOrders(filteredOrders);
    } catch (error: any) {
      console.error('[PurchasesScreen] Error fetching orders:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to load orders',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, status]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: Record<number, string> = {};
      orders.forEach(order => {
        const createdTime = new Date(order.created_at).getTime();
        const expiryTime = createdTime + 24 * 60 * 60 * 1000; // 24 hours
        const now = new Date().getTime();
        const diff = expiryTime - now;

        if (diff <= 0) {
          newTimeLeft[order.id] = 'Expired';
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          newTimeLeft[order.id] = `${hours}h ${minutes}m ${seconds}s`;
        }
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [orders]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders(false);
  };

  const handleProceedToPayment = async (order: Order) => {
    if (!token) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Authentication required',
      });
      return;
    }

    try {
      const paymentPayload = {
        amount: order.total_amount,
        description: `Order #${order.order_number}`,
        payment_method: order.payment_method.toLowerCase(),
        payment_mode: 'test',
        source_label: 'Mobile App',
        source_slug: 'mobile',
        source_url: 'https://afhome.ph',
        customer: {
          name: '',
          email: '',
          phone: '',
          address: '',
        },
        order: {
          product_name: order.items.map(item => item.name).join(', '),
          product_id: order.items[0]?.product_id || 0,
          quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: order.total_amount - order.shipping_fee,
          handling_fee: order.shipping_fee,
        },
      };

      console.log('[PurchasesScreen] Payment payload prepared:', {
        amount: order.total_amount,
        orderNumber: order.order_number,
      });

      console.log('[PurchasesScreen] Calling API: /payments/checkout-session');
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/payments/checkout-session`,
        paymentPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('[PurchasesScreen] API response received:', {
        hasCheckoutUrl: !!response.data?.checkout_url,
        statusCode: response.status,
      });

      if (response.data?.checkout_url) {
        Toast.show({
          type: 'success',
          text1: 'Redirecting to Payment',
          text2: 'Opening PayMongo checkout...',
        });
        onProceedToPayment?.(order);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No checkout URL received from server',
        });
      }
    } catch (error: any) {
      console.error('[PurchasesScreen] Payment error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to proceed to payment',
      });
    }
  };

  const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <LinearGradient
        colors={isDarkMode ? ['rgba(59,130,246,0.15)', 'rgba(31,41,55,0)'] : ['rgba(14,165,233,0.18)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.header, { paddingTop: insets.top, backgroundColor: isDarkMode ? '#1f2937' : Colors.white }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="chevron-back-outline" size={24} color={isDarkMode ? '#e5e7eb' : Colors.text} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerGreeting, { color: isDarkMode ? '#f8fafc' : Colors.text }]}>
              {statusConfig.label}
            </Text>
            <Text style={[styles.headerSubtitle, { color: isDarkMode ? '#9ca3af' : Colors.textSecondary }]}>
              {statusConfig.description}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.sky} />
          <Text style={[styles.loadingText, { color: colors.textSec }]}>Loading orders...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="inbox-outline" size={64} color={colors.textSec} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Orders</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSec }]}>
            You don't have any {statusConfig.label.toLowerCase()} orders yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: order }) => (
            <View style={[styles.orderCard, { backgroundColor: colors.containerBg, borderColor: colors.border }]}>
              {/* Order Header */}
              <View style={[styles.orderHeader, { borderBottomColor: colors.border }]}>
                <View>
                  <Text style={[styles.orderNumber, { color: colors.text }]}>
                    Order #{order.order_number}
                  </Text>
                  <Text style={[styles.orderDate, { color: colors.textSec }]}>
                    {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${statusConfig.color}20` }]}>
                  <Ionicons name={statusConfig.icon as any} size={16} color={statusConfig.color} />
                  <Text style={[styles.statusText, { color: statusConfig.color }]}>
                    {statusConfig.label}
                  </Text>
                </View>
              </View>

              {/* Order Items */}
              <View style={[styles.itemsContainer, { borderBottomColor: colors.border }]}>
                {order.items.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.itemRow,
                      index !== order.items.length - 1 && { borderBottomColor: colors.border },
                    ]}
                    onPress={() => onProductPress?.(item.product_id)}
                    activeOpacity={0.7}
                  >
                    {item.image && (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.itemImage}
                        resizeMode="contain"
                      />
                    )}
                    <View style={styles.itemInfo}>
                      <View style={styles.itemNameRow}>
                        <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
                          {item.name}
                        </Text>
                        <Ionicons name="chevron-forward" size={14} color={colors.textSec} />
                      </View>
                      <View>
                        <Text style={[styles.itemQty, { color: colors.textSec }]}>
                          Qty: {item.quantity}
                        </Text>
                        {(item.selected_color || item.selected_size || item.selected_type) && (
                          <Text style={[styles.itemVariant, { color: colors.textSec }]}>
                            {[item.selected_color, item.selected_size, item.selected_type].filter(Boolean).join(', ')}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Text style={[styles.itemPrice, { color: Colors.sky }]}>
                      ₱{(item.price * item.quantity).toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Shipping Fee */}
              {order.shipping_fee > 0 && (
                <View style={[styles.shippingFeeRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.shippingLabel, { color: colors.textSec }]}>Shipping Fee</Text>
                  <Text style={[styles.shippingPrice, { color: colors.text }]}>
                    ₱{order.shipping_fee.toLocaleString()}
                  </Text>
                </View>
              )}

              {/* Order Total */}
              <View style={styles.orderFooter}>
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: colors.textSec }]}>Total Amount</Text>
                  <Text style={[styles.totalPrice, { color: Colors.sky }]}>
                    ₱{order.total_amount.toLocaleString()}
                  </Text>
                </View>

                {/* Payment Method */}
                <View style={styles.paymentMethodRow}>
                  <Text style={[styles.paymentMethodLabel, { color: colors.textSec }]}>
                    Payment: {order.payment_method}
                  </Text>
                </View>

                {/* Proceed to Payment Section */}
                {status === 'pending' && (
                  <View style={styles.paymentSection}>
                    {/* Payment Countdown */}
                    <View style={styles.paymentTimerRow}>
                      <Ionicons name={timeLeft[order.id] === 'Expired' ? 'alert-circle' : 'time'} size={14} color={timeLeft[order.id] === 'Expired' ? Colors.error : Colors.sky} />
                      <View style={styles.paymentTimerText}>
                        <Text style={[styles.paymentTimerLabel, { color: colors.textSec }]}>
                          Pay Until
                        </Text>
                        <Text style={[styles.paymentTimerValue, { color: timeLeft[order.id] === 'Expired' ? Colors.error : Colors.sky }]}>
                          {timeLeft[order.id] || 'Loading...'}
                        </Text>
                      </View>
                    </View>

                    {/* Proceed to Payment Button */}
                    <TouchableOpacity
                      style={styles.paymentBtn}
                      onPress={() => handleProceedToPayment(order)}
                    >
                      <Ionicons name="card" size={16} color={Colors.white} />
                      <Text style={styles.paymentBtnText}>Proceed to Payment</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 12, paddingBottom: 80 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.sky}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: -10,
    marginRight: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  headerGreeting: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  orderCard: {
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    marginVertical: 6,
    borderWidth: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 11,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  itemsContainer: {
    borderBottomWidth: 1,
    paddingBottom: 12,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 0,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  itemInfo: {
    flex: 1,
  },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 2,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemQty: {
    fontSize: 11,
  },
  itemVariant: {
    fontSize: 10,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
  },
  shippingFeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  shippingLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  shippingPrice: {
    fontSize: 12,
    fontWeight: '600',
  },
  paymentMethodRow: {
    marginTop: 8,
    paddingTop: 8,
  },
  paymentMethodLabel: {
    fontSize: 11,
  },
  orderFooter: {
    gap: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '800',
  },
  paymentBtn: {
    backgroundColor: Colors.sky,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 0,
  },
  paymentBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  paymentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  paymentTimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  paymentTimerText: {
    flex: 1,
  },
  paymentTimerLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  paymentTimerValue: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
});
