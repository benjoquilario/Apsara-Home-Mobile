import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface LeaderboardEntry {
  rank: number;
  name: string;
  handle: string;
  earnings: number;
  avatar: string;
}

const TOP_EARNERS: LeaderboardEntry[] = [
  { rank: 1, name: 'Jordyn Kenter', handle: '@jordynkenter', earnings: 96239, avatar: '👨‍💼' },
  { rank: 2, name: 'Alana Bator', handle: '@alanabator', earnings: 84787, avatar: '👩‍🦰' },
  { rank: 3, name: 'Carl Oliver', handle: '@carloliver', earnings: 82139, avatar: '👨‍🦱' },
  { rank: 4, name: 'Davis Curtis', handle: '@daviscurtis', earnings: 80857, avatar: '👨‍💻' },
  { rank: 5, name: 'Isona Othid', handle: '@isonaothid', earnings: 76128, avatar: '👩‍🔬' },
  { rank: 6, name: 'Makenna George', handle: '@makeanna', earnings: 71667, avatar: '👩‍💼' },
  { rank: 7, name: 'Kianna Batista', handle: '@kiannabatista', earnings: 68439, avatar: '👩‍🎤' },
  { rank: 8, name: 'Maxith Cullep', handle: '@maxith', earnings: 66981, avatar: '👨‍🏫' },
  { rank: 9, name: 'Zain Dias', handle: '@zaindias', earnings: 50546, avatar: '👨‍🎨' },
];

const MEDAL_COLORS: Record<number, string> = {
  1: '#FFD700',
  2: '#C0C0C0',
  3: '#CD7F32',
};

const getMedalIcon = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
};

export default function LeaderboardScreen({
  isDarkMode = false,
  onClose,
}: {
  isDarkMode?: boolean;
  onClose?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [activeScope, setActiveScope] = useState<'team' | 'local' | 'global'>('team');
  const [activeMetric, setActiveMetric] = useState<'earnings' | 'referrals'>('earnings');

  const colors = {
    bg: isDarkMode ? '#0f172a' : '#f5f5f5',
    headerBg: isDarkMode ? '#16213e' : Colors.white,
    text: isDarkMode ? '#f8fafc' : Colors.text,
    textSec: isDarkMode ? '#94a3b8' : Colors.textSecondary,
    border: isDarkMode ? '#374151' : '#e5e7eb',
    accentGreen: '#4ade80',
  };

  // Sample data - earnings based
  const earningsData = TOP_EARNERS;

  // Sample data - referrals based (different order)
  const referralsData = [
    { rank: 1, name: 'Alana Bator', handle: '@alanabator', earnings: 45, avatar: '👩‍🦰' },
    { rank: 2, name: 'Jordyn Kenter', handle: '@jordynkenter', earnings: 38, avatar: '👨‍💼' },
    { rank: 3, name: 'Carl Oliver', handle: '@carloliver', earnings: 35, avatar: '👨‍🦱' },
    { rank: 4, name: 'Makenna George', handle: '@makeanna', earnings: 28, avatar: '👩‍💼' },
    { rank: 5, name: 'Davis Curtis', handle: '@daviscurtis', earnings: 25, avatar: '👨‍💻' },
    { rank: 6, name: 'Isona Othid', handle: '@isonaothid', earnings: 22, avatar: '👩‍🔬' },
    { rank: 7, name: 'Kianna Batista', handle: '@kiannabatista', earnings: 20, avatar: '👩‍🎤' },
    { rank: 8, name: 'Maxith Cullep', handle: '@maxith', earnings: 18, avatar: '👨‍🏫' },
    { rank: 9, name: 'Zain Dias', handle: '@zaindias', earnings: 12, avatar: '👨‍🎨' },
  ];

  const displayData = activeMetric === 'earnings' ? earningsData : referralsData;
  const topThree = displayData.slice(0, 3);
  const restRankings = displayData.slice(3);


  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header with Background */}
      <ImageBackground
        source={require('../../assets/profile_bg.png')}
        style={[styles.headerBackground]}
        resizeMode="cover"
      >
        <View style={[styles.headerContent, { paddingTop: insets.top }]}>
          <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Leaderboard</Text>
          <TouchableOpacity style={styles.menuBtn}>
            <Ionicons name="menu" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Scope Tabs - Hidden For Now */}
      {false && (
        <View style={[styles.scopeTabContainer, { backgroundColor: colors.headerBg, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.scopeTabButton, activeScope === 'team' && styles.scopeTabButtonActive]}
            onPress={() => setActiveScope('team')}
            activeOpacity={0.7}
          >
            <Text style={[styles.scopeTabButtonText, { color: activeScope === 'team' ? Colors.white : colors.text }]}>
              Team
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.scopeTabButton, activeScope === 'local' && styles.scopeTabButtonActive]}
            onPress={() => setActiveScope('local')}
            activeOpacity={0.7}
          >
            <Text style={[styles.scopeTabButtonText, { color: activeScope === 'local' ? Colors.white : colors.text }]}>
              Local
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.scopeTabButton, activeScope === 'global' && styles.scopeTabButtonActive]}
            onPress={() => setActiveScope('global')}
            activeOpacity={0.7}
          >
            <Text style={[styles.scopeTabButtonText, { color: activeScope === 'global' ? Colors.white : colors.text }]}>
              Global
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top 3 Rankings */}
        <View style={styles.topThreeContainer}>
          {/* 2nd Place - Left */}
          <View style={styles.topCardWrapper}>
            <View style={styles.topCardBorder}>
              <LinearGradient colors={['rgba(232, 232, 232, 0)', 'rgba(192, 192, 192, 0.5)', '#808080']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={[styles.topCard, styles.topCardSecond]}>
              </LinearGradient>
            </View>
            <Text style={[styles.topCardName, styles.topCardNameLarge, { color: colors.text }]}>
              {topThree[1].name.split(' ')[0]}
            </Text>
            <Text style={[styles.topCardEarnings, styles.topCardEarningsLarge, { color: colors.text }]}>
              ₱{topThree[1].earnings.toLocaleString()}
            </Text>
          </View>

          {/* 1st Place - Center */}
          <View style={styles.topCardWrapper}>
            <View style={styles.topCardBorder}>
              <LinearGradient colors={['rgba(255, 244, 176, 0)', 'rgba(255, 215, 0, 0.5)', '#B8860B']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={[styles.topCard, styles.topCardFirst]}>
              </LinearGradient>
            </View>
            <Text style={[styles.topCardName, styles.topCardNameLarge, { color: colors.text }]}>
              {topThree[0].name.split(' ')[0]}
            </Text>
            <Text style={[styles.topCardEarnings, styles.topCardEarningsLarge, { color: colors.text }]}>
              ₱{topThree[0].earnings.toLocaleString()}
            </Text>
          </View>

          {/* 3rd Place - Right */}
          <View style={styles.topCardWrapper}>
            <View style={styles.topCardBorder}>
              <LinearGradient colors={['rgba(230, 161, 92, 0)', 'rgba(205, 127, 50, 0.5)', '#6B4423']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={[styles.topCard, styles.topCardThird]}>
              </LinearGradient>
            </View>
            <Text style={[styles.topCardName, styles.topCardNameLarge, { color: colors.text }]}>
              {topThree[2].name.split(' ')[0]}
            </Text>
            <Text style={[styles.topCardEarnings, styles.topCardEarningsLarge, { color: colors.text }]}>
              ₱{topThree[2].earnings.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Rest of Rankings */}
        <View style={[styles.rankingsSection, { backgroundColor: colors.headerBg, borderColor: colors.border }]}>
          <View style={[styles.sectionHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              ✨ Top Ranking ✨
            </Text>
          </View>

          {restRankings.map((entry) => (
            <View key={entry.rank} style={[styles.rankingItem, { borderBottomColor: colors.border }]}>
              <View style={styles.rankingItemLeft}>
                <View style={[styles.rankingAvatar, { backgroundColor: colors.border }]}>
                  <Text style={styles.rankingAvatarEmoji}>{entry.avatar}</Text>
                </View>
                <View style={styles.rankingInfo}>
                  <Text style={[styles.rankingName, { color: colors.text }]}>{entry.name}</Text>
                  <Text style={[styles.rankingEarnings, { color: colors.accentGreen }]}>
                    ▲ {activeMetric === 'earnings' ? `₱${entry.earnings.toLocaleString()}` : `${entry.earnings} Referrals`}
                  </Text>
                </View>
              </View>
              <View style={[styles.rankingBadgeContainer]}>
                <View style={[styles.rankingBadge, { backgroundColor: MEDAL_COLORS[entry.rank] || colors.border }]}>
                  <Text style={[styles.rankingMedalEmoji]}>
                    {getMedalIcon(entry.rank) || `#${entry.rank}`}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // ── Header ──
  headerBackground: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 90,
  },
  headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 44,
  },

  // ── Scope Tabs ──
  scopeTabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  scopeTabButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scopeTabButtonActive: {
    backgroundColor: '#ef4444',
  },
  scopeTabButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Metric Tabs ──
  metricTabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  metricTabButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricTabButtonActive: {
    borderColor: Colors.sky,
  },
  metricTabButtonText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // ── Content ──
  scrollContent: {
    flex: 1,
    padding: 8,
    paddingBottom: 16,
  },

  // ── Top 3 ──
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 16,
    paddingHorizontal: 8,
    paddingVertical: 12,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 12,
  },
  topCardWrapper: {
    alignItems: 'center',
    gap: 4,
  },
  topCardBorder: {
    borderRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 0,
    borderBottomWidth: 1,
    overflow: 'hidden',
    borderColor: '#e5e7eb',
  },
  topCard: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  topCardFirst: {
    flex: 0,
    width: 120,
    height: 240,
    zIndex: 10,
    justifyContent: 'center',
  },
  topCardSecond: {
    flex: 0,
    width: 110,
    height: 200,
    justifyContent: 'center',
  },
  topCardThird: {
    flex: 0,
    width: 110,
    height: 200,
    justifyContent: 'center',
  },
  medalBadge: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  medalBadgeFirst: {
    top: 12,
  },
  medalBadgeSecond: {
    top: 12,
  },
  medalBadgeThird: {
    top: 12,
  },
  medalEmoji: {
    fontSize: 32,
  },
  medalEmojiLarge: {
    fontSize: 40,
  },
  topCardAvatar: {
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  topCardAvatarSmall: {
    width: 60,
    height: 60,
  },
  topCardAvatarLarge: {
    width: 80,
    height: 80,
  },
  topCardAvatarExtraLarge: {
    width: 100,
    height: 100,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  avatarEmojiSmall: {
    fontSize: 28,
  },
  avatarEmojiLarge: {
    fontSize: 40,
  },
  avatarEmojiExtraLarge: {
    fontSize: 50,
  },
  topCardName: {
    fontWeight: '600',
  },
  topCardNameSmall: {
    fontSize: 12,
  },
  topCardNameLarge: {
    fontSize: 15,
    fontWeight: '700',
  },
  topCardEarnings: {
    fontWeight: '700',
  },
  topCardEarningsSmall: {
    fontSize: 12,
  },
  topCardEarningsLarge: {
    fontSize: 15,
    fontWeight: '800',
  },
  rankBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rankBadgeLarge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  rankBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
  },
  rankBadgeTextLarge: {
    fontSize: 12,
  },

  // ── Rankings Section ──
  rankingsSection: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 12,
    width: '100%',
    alignSelf: 'center',
  },
  sectionHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ── Ranking Items ──
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  rankingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rankingAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankingAvatarEmoji: {
    fontSize: 22,
  },
  rankingInfo: {
    gap: 2,
    flex: 1,
  },
  rankingName: {
    fontSize: 12,
    fontWeight: '600',
  },
  rankingEarnings: {
    fontSize: 11,
    fontWeight: '600',
  },
  rankingBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankingBadgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankingMedalEmoji: {
    fontSize: 20,
    fontWeight: '700',
  },
  rankingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
