import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Colors } from '../constants/colors';
import { ReferralTree, ReferralUser } from '../services/referralService';

interface ReferralNetworkScreenProps {
  token?: string | null;
  onBack?: () => void;
  tree?: ReferralTree | null;
}

export default function ReferralNetworkScreen({ token, onBack, tree }: ReferralNetworkScreenProps) {
  const insets = useSafeAreaInsets();
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (tree) {
      // Attach children to root user
      if (!tree.root.children && tree.children) {
        (tree.root as any).children = tree.children;
        (tree.root as any).children_count = tree.children.length;
      }
    }
  }, [tree]);

  useEffect(() => {
    if (tree?.root && expandedNodes.size === 0) {
      setExpandedNodes(new Set([tree.root.id]));
    }
  }, [tree?.root?.id]);

  const toggleNode = (userId: number) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderUserCard = (user: ReferralUser, level: number = 0, isLast: boolean = true) => {
    const hasChildren = user.children && user.children.length > 0;
    const isExpanded = expandedNodes.has(user.id);

    return (
      <View key={user.id}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          {level > 0 && (
            <View style={[styles.treeLine, { marginLeft: level * 20 }]} />
          )}

          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={[
                styles.userCard,
                level === 0 && styles.rootCard,
              ]}
              onPress={hasChildren ? () => toggleNode(user.id) : undefined}
              activeOpacity={hasChildren ? 0.7 : 1}
            >
              <View style={styles.userCardContent}>
                <View style={styles.userCardHeader}>
                  <View style={styles.userAvatar}>
                    {user.avatar_url ? (
                      <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} />
                    ) : (
                      <Text style={styles.avatarInitial}>
                        {user.name.charAt(0).toUpperCase()}
                      </Text>
                    )}
                  </View>

                  <View style={styles.userInfo}>
                    <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
                    <Text style={styles.userUsername}>@{user.username}</Text>
                    <Text style={styles.joinDate}>{new Date(user.joined_at).toLocaleDateString()}</Text>
                  </View>

                  {hasChildren && (
                    <View style={styles.expandIcon}>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color={Colors.sky}
                      />
                    </View>
                  )}
                </View>

                <View style={styles.userStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{user.children_count || 0}</Text>
                    <Text style={styles.statLabel}>Direct</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>₱{user.total_earnings}</Text>
                    <Text style={styles.statLabel}>Earnings</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{user.total_pv}</Text>
                    <Text style={styles.statLabel}>PV</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {hasChildren && isExpanded && (
              <View style={styles.childrenContainer}>
                {user.children!.map((child, index) =>
                  renderUserCard(child, level + 1, index === user.children!.length - 1)
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (!tree) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.sky} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <LinearGradient
        colors={['rgba(14,165,233,0.18)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Referral Network</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Stats Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Network Overview</Text>
          </View>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{tree.summary.total_network}</Text>
              <Text style={styles.summaryLabel}>Total Referrals</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{tree.summary.direct_count}</Text>
              <Text style={styles.summaryLabel}>Direct</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>₱{tree.root.total_earnings}</Text>
              <Text style={styles.summaryLabel}>Earned</Text>
            </View>
          </View>
        </View>

        {/* Referral Tree Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Network</Text>
          </View>
          <View style={styles.treeContainer}>
            {renderUserCard(tree.root)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
  },

  section: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },

  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },

  summaryContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.sky,
    marginBottom: 4,
  },

  summaryLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 8,
    gap: 16,
    paddingBottom: 32,
  },

  treeContainer: {
    padding: 12,
    gap: 8,
  },

  treeLine: {
    width: 2,
    minHeight: 120,
    backgroundColor: '#cbd5e1',
    marginRight: 12,
    marginTop: 0,
  },

  userCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginBottom: 8,
  },

  rootCard: {
    backgroundColor: '#e0f2fe',
    borderColor: Colors.sky,
    borderWidth: 2,
  },

  userCardContent: {
    padding: 12,
  },

  userCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },

  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.sky,
    overflow: 'hidden',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.sky,
  },

  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },

  userUsername: {
    fontSize: 11,
    color: Colors.sky,
    fontWeight: '500',
  },

  joinDate: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },

  expandIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  userStats: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },

  statLabel: {
    fontSize: 9,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  childrenContainer: {
    marginTop: 4,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
