import React from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  Linking,
  Clipboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { Colors } from '../../constants/colors';
import PrimaryButton from '../Button/PrimaryButton';
import OutlineButton from '../Button/OutlineButton';
import { ReferralTree } from '../../services/referralService';

interface AffiliateReferralModalProps {
  visible: boolean;
  onClose: () => void;
  userName?: string;
  username?: string;
  referralTree?: ReferralTree | null;
  isDarkMode?: boolean;
  onViewNetwork?: () => void;
}

export default function AffiliateReferralModal({
  visible,
  onClose,
  userName,
  username,
  referralTree,
  isDarkMode = false,
  onViewNetwork,
}: AffiliateReferralModalProps) {
  const insets = useSafeAreaInsets();
  const safeUsername = username || 'guest';
  const signupUrl = `https://afhome.ph/ref/${safeUsername}`;
  const shoppingUrl = `https://afhome.ph/shop?ref=${safeUsername}`;
  const totalNetwork = referralTree?.summary?.total_network ?? 0;
  const directCount = referralTree?.summary?.direct_count ?? 0;
  const earned = referralTree?.root?.total_earnings ?? 0;

  const colors = {
    bg: isDarkMode ? '#0f172a' : '#f8fbff',
    card: isDarkMode ? '#1e293b' : Colors.white,
    text: isDarkMode ? '#f8fafc' : Colors.text,
    textSec: isDarkMode ? '#94a3b8' : Colors.textSecondary,
    border: isDarkMode ? '#334155' : '#e5e7eb',
  };

  const handleCopy = (url: string) => {
    Clipboard.setString(url);
    Toast.show({
      type: 'success',
      text1: 'Link Copied',
      text2: 'Referral link copied to clipboard',
    });
  };

  const handleShare = async (url: string, type: 'signup' | 'shopping') => {
    const message =
      type === 'signup'
        ? `Join AF Home as my referral and start earning rewards: ${url}`
        : `Shop on AF Home using my affiliate link: ${url}`;

    await Share.share({ message, url });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.bg, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
          <LinearGradient
            colors={isDarkMode ? ['rgba(59,130,246,0.18)', 'rgba(15,23,42,0)'] : ['rgba(14,165,233,0.16)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.header, { borderBottomColor: colors.border }]}
          >
            <TouchableOpacity style={[styles.closeBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={onClose} activeOpacity={0.8}>
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={[styles.title, { color: colors.text }]}>Affiliate Referral</Text>
              <Text style={[styles.subtitle, { color: colors.textSec }]}>Share your links and grow your network</Text>
            </View>
            <View style={{ width: 36 }} />
          </LinearGradient>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.heroRow}>
                <View style={styles.heroBadge}>
                  <Ionicons name="people" size={18} color={Colors.white} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.heroLabel, { color: colors.textSec }]}>Welcome</Text>
                  <Text style={[styles.heroName, { color: colors.text }]} numberOfLines={1}>
                    {userName || 'Affiliate Partner'}
                  </Text>
                </View>
              </View>

              <View style={styles.statRow}>
                <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#0f172a' : '#eff6ff', borderColor: colors.border }]}>
                  <Text style={[styles.statValue, { color: colors.text }]}>{totalNetwork}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSec }]}>Total</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#0f172a' : '#fef3c7', borderColor: colors.border }]}>
                  <Text style={[styles.statValue, { color: colors.text }]}>{directCount}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSec }]}>Direct</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#0f172a' : '#dcfce7', borderColor: colors.border }]}>
                  <Text style={[styles.statValue, { color: colors.text }]}>₱{earned}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSec }]}>Earned</Text>
                </View>
              </View>
            </View>

            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: isDarkMode ? '#0c2340' : '#e0f2fe' }]}>
                  <Ionicons name="person-add" size={16} color={Colors.sky} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Invite Members</Text>
                  <Text style={[styles.sectionText, { color: colors.textSec }]}>Use this link when someone wants to register as your referral.</Text>
                </View>
              </View>

              <View style={styles.qrBlock}>
                <TouchableOpacity
                  style={[styles.qrBox, { backgroundColor: colors.bg, borderColor: colors.border }]}
                  onPress={() => Linking.openURL(signupUrl)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: `https://quickchart.io/qr?text=${encodeURIComponent(signupUrl)}&size=220` }}
                    style={styles.qrImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.qrTag}>Signup</Text>
                </TouchableOpacity>
                <View style={styles.qrInfo}>
                  <Text style={[styles.linkLabel, { color: colors.textSec }]}>Member signup link</Text>
                  <View style={[styles.linkBox, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                    <Text style={[styles.linkText, { color: Colors.sky }]} numberOfLines={2}>{signupUrl}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionRow}>
                <PrimaryButton title="Share" icon="share-social" onPress={() => handleShare(signupUrl, 'signup')} style={{ flex: 1 }} />
                <OutlineButton title="Copy Link" icon="copy-outline" onPress={() => handleCopy(signupUrl)} color={Colors.sky} style={{ flex: 1 }} />
              </View>
            </View>

            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: '#f0fdf4' }]}>
                  <Ionicons name="cart" size={16} color="#16a34a" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Share Shopping Link</Text>
                  <Text style={[styles.sectionText, { color: colors.textSec }]}>Customers can shop right away and your referral stays attached.</Text>
                </View>
              </View>

              <View style={styles.qrBlock}>
                <TouchableOpacity
                  style={[styles.qrBox, { backgroundColor: colors.bg, borderColor: colors.border }]}
                  onPress={() => Linking.openURL(shoppingUrl)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: `https://quickchart.io/qr?text=${encodeURIComponent(shoppingUrl)}&size=220` }}
                    style={styles.qrImage}
                    resizeMode="contain"
                  />
                  <Text style={[styles.qrTag, { backgroundColor: '#16a34a' }]}>Shopping</Text>
                </TouchableOpacity>
                <View style={styles.qrInfo}>
                  <Text style={[styles.linkLabel, { color: colors.textSec }]}>Shopping referral link</Text>
                  <View style={[styles.linkBox, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                    <Text style={[styles.linkText, { color: Colors.sky }]} numberOfLines={2}>{shoppingUrl}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionRow}>
                <PrimaryButton title="Share" icon="share-social" onPress={() => handleShare(shoppingUrl, 'shopping')} style={{ backgroundColor: '#16a34a', flex: 1 }} />
                <OutlineButton title="Copy Link" icon="copy-outline" onPress={() => handleCopy(shoppingUrl)} color="#16a34a" style={{ flex: 1 }} />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.networkBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
              activeOpacity={0.8}
              onPress={onViewNetwork}
            >
              <Ionicons name="people-outline" size={18} color={Colors.sky} />
              <Text style={[styles.networkBtnText, { color: colors.text }]}>View Referral Network</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSec} />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    gap: 14,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    gap: 12,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.sky,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroName: {
    fontSize: 18,
    fontWeight: '800',
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  sectionIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  sectionText: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  qrBlock: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  qrBox: {
    width: 110,
    minHeight: 132,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  qrImage: {
    width: 88,
    height: 88,
  },
  qrTag: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: '800',
    color: Colors.white,
    backgroundColor: Colors.sky,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  qrInfo: {
    flex: 1,
    gap: 8,
  },
  linkLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  linkBox: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  networkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  networkBtnText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
  },
});
