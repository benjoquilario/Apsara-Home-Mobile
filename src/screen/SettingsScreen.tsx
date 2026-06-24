// @ts-nocheck
import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  BackHandler,
  Modal,
  Pressable,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import Ionicons from "../components/ui/Icon"
import { Colors } from "../constants/colors"
import { Image } from "expo-image"
import styles from "../styles/SettingsScreen.styles"

interface User {
  name?: string
  avatar_url?: string
  email?: string
}

interface SettingsScreenProps {
  user?: User | null
  onBack: () => void
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
  onNavigateSecurity: () => void
  onEditProfile?: () => void
  onNavigateAboutUs?: () => void
  onNavigatePrivacyPolicy?: () => void
  onNavigateTermsAndConditions?: () => void
  onNavigateIncomeDisclaimer?: () => void
  onNavigateCookiePolicy?: () => void
  onNavigateRewardsAndCommissions?: () => void
  onNavigateContactUs?: () => void
  onNavigateOurBranches?: () => void
  onNavigateFAQs?: () => void
  onNavigateShippingInfo?: () => void
  onNavigateReturns?: () => void
  onLogout?: () => void
}

export default function SettingsScreen({
  user,
  onBack,
  isDarkMode,
  setIsDarkMode,
  onNavigateSecurity,
  onEditProfile,
  onNavigateAboutUs,
  onNavigatePrivacyPolicy,
  onNavigateTermsAndConditions,
  onNavigateIncomeDisclaimer,
  onNavigateCookiePolicy,
  onNavigateRewardsAndCommissions,
  onNavigateContactUs,
  onNavigateOurBranches,
  onNavigateFAQs,
  onNavigateShippingInfo,
  onNavigateReturns,
  onLogout,
}: SettingsScreenProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const insets = useSafeAreaInsets()

  const colors = {
    bg: isDarkMode ? "#0f172a" : "#f8fafc",
    containerBg: isDarkMode ? "#1f2937" : Colors.white,
    text: isDarkMode ? "#f8fafc" : Colors.text,
    textSec: isDarkMode ? "#94a3b8" : Colors.textSecondary,
    border: isDarkMode ? "#374151" : "#e5e7eb",
    borderLight: isDarkMode ? "#374151" : "#f1f5f9",
  }
  const softSky = isDarkMode ? "rgba(14,165,233,0.15)" : "#e0f2fe"

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      onBack()
      return true
    })
    return () => backHandler.remove()
  }, [onBack])

  // A single settings row (icon chip · label · right element / chevron).
  const renderRow = (icon, label, onPress, right, showBorder) => (
    <TouchableOpacity
      key={label}
      style={[
        styles.row,
        showBorder && {
          borderBottomWidth: 1,
          borderBottomColor: colors.borderLight,
        },
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={[styles.iconChip, { backgroundColor: softSky }]}>
        <Ionicons name={icon} size={18} color={Colors.sky} />
      </View>
      <Text style={[styles.rowLabel, { color: colors.text }]} numberOfLines={1}>
        {label}
      </Text>
      {right ?? (
        <Ionicons name="chevron-forward" size={18} color={colors.textSec} />
      )}
    </TouchableOpacity>
  )

  const renderSection = (title, items) => (
    <View key={title}>
      <Text style={[styles.sectionLabel, { color: colors.textSec }]}>
        {title}
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.containerBg, borderColor: colors.border },
        ]}
      >
        {items.map((it, i) =>
          renderRow(it.icon, it.label, it.onPress, undefined, i < items.length - 1)
        )}
      </View>
    </View>
  )

  const accountItems = [
    onEditProfile && {
      icon: "person-outline",
      label: "Profile",
      onPress: onEditProfile,
    },
    {
      icon: "shield-checkmark-outline",
      label: "Security",
      onPress: onNavigateSecurity,
    },
    { icon: "people-outline", label: "Community", onPress: undefined },
  ].filter(Boolean)

  const infoItems = [
    {
      icon: "information-circle-outline",
      label: "About us",
      onPress: onNavigateAboutUs,
    },
    {
      icon: "lock-closed-outline",
      label: "Privacy Policy",
      onPress: onNavigatePrivacyPolicy,
    },
    {
      icon: "document-text-outline",
      label: "Terms and Conditions",
      onPress: onNavigateTermsAndConditions,
    },
    {
      icon: "cash-outline",
      label: "Income Disclaimer",
      onPress: onNavigateIncomeDisclaimer,
    },
    {
      icon: "shield-outline",
      label: "Cookie Policy",
      onPress: onNavigateCookiePolicy,
    },
    {
      icon: "gift-outline",
      label: "Rewards and Commissions",
      onPress: onNavigateRewardsAndCommissions,
    },
  ]

  const supportItems = [
    {
      icon: "chatbubble-ellipses-outline",
      label: "Contact Us",
      onPress: onNavigateContactUs,
    },
    {
      icon: "location-outline",
      label: "Our Branches",
      onPress: onNavigateOurBranches,
    },
    { icon: "help-circle-outline", label: "FAQs", onPress: onNavigateFAQs },
    {
      icon: "cube-outline",
      label: "Shipping Info",
      onPress: onNavigateShippingInfo,
    },
    { icon: "refresh-outline", label: "Returns", onPress: onNavigateReturns },
  ]

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.bg }]}
        edges={[]}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.containerBg,
              borderBottomColor: colors.border,
              paddingTop: insets.top + 8,
            },
          ]}
        >
          <TouchableOpacity
            onPress={onBack}
            style={styles.headerIcon}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back-outline"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Settings
          </Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          style={[styles.scroll, { backgroundColor: colors.bg }]}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile card */}
          <TouchableOpacity
            style={[
              styles.card,
              styles.profileCard,
              {
                backgroundColor: colors.containerBg,
                borderColor: colors.border,
              },
            ]}
            onPress={onEditProfile}
            activeOpacity={onEditProfile ? 0.7 : 1}
            disabled={!onEditProfile}
          >
            {user?.avatar_url ? (
              <Image
                source={{ uri: user.avatar_url }}
                style={styles.profileAvatar}
                transition={200}
              />
            ) : (
              <View
                style={[
                  styles.profileAvatarPlaceholder,
                  { backgroundColor: softSky },
                ]}
              >
                <Text
                  style={[styles.profileAvatarInitial, { color: Colors.sky }]}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </Text>
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text
                style={[styles.profileName, { color: colors.text }]}
                numberOfLines={1}
              >
                {user?.name || "User"}
              </Text>
              <Text
                style={[styles.profileEmail, { color: colors.textSec }]}
                numberOfLines={1}
              >
                {user?.email || "No email"}
              </Text>
            </View>
            {onEditProfile && (
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSec}
              />
            )}
          </TouchableOpacity>

          {/* Appearance */}
          <Text style={[styles.sectionLabel, { color: colors.textSec }]}>
            APPEARANCE
          </Text>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.containerBg,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.row,
                { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
              ]}
            >
              <View style={[styles.iconChip, { backgroundColor: softSky }]}>
                <Ionicons name="moon-outline" size={18} color={Colors.sky} />
              </View>
              <Text style={[styles.rowLabel, { color: colors.text }]}>
                Dark Mode
              </Text>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: colors.borderLight, true: Colors.sky }}
                thumbColor="#fff"
              />
            </View>
            {renderRow(
              "globe-outline",
              "Language",
              undefined,
              <View style={styles.rowRight}>
                <Text style={[styles.rowValue, { color: colors.textSec }]}>
                  English
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textSec}
                />
              </View>,
              false
            )}
          </View>

          {renderSection("ACCOUNT", accountItems)}
          {renderSection("INFORMATION", infoItems)}
          {renderSection("SUPPORT", supportItems)}

          {/* Payments */}
          <Text style={[styles.sectionLabel, { color: colors.textSec }]}>
            PAYMENTS
          </Text>
          <View
            style={[
              styles.card,
              styles.paymentCard,
              {
                backgroundColor: colors.containerBg,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.paymentLabel, { color: colors.text }]}>
              We Accept
            </Text>
            <Text style={[styles.paymentMethods, { color: colors.textSec }]}>
              Credit/Debit Cards · E-Wallets · Bank Transfers · GCash · PayMaya ·
              and more
            </Text>
          </View>

          {/* Logout */}
          <TouchableOpacity
            style={[
              styles.card,
              styles.logoutRow,
              {
                backgroundColor: colors.containerBg,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setShowLogoutConfirm(true)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconChip,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(239,68,68,0.15)"
                    : "#fee2e2",
                },
              ]}
            >
              <Ionicons name="log-out-outline" size={18} color={Colors.error} />
            </View>
            <Text style={[styles.rowLabel, { color: Colors.error }]}>
              Logout
            </Text>
          </TouchableOpacity>

          <View style={styles.versionFooter}>
            <Text style={[styles.versionText, { color: colors.textSec }]}>
              AF Home v1.0.0
            </Text>
          </View>
        </ScrollView>

        {/* Logout Confirmation Modal */}
        <Modal
          visible={showLogoutConfirm}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLogoutConfirm(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowLogoutConfirm(false)}
          >
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colors.containerBg },
              ]}
            >
              <View
                style={[
                  styles.modalIconContainer,
                  { backgroundColor: isDarkMode ? "#7f1d1d" : "#fee2e2" },
                ]}
              >
                <Ionicons
                  name="log-out-outline"
                  size={32}
                  color={Colors.error}
                />
              </View>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Logout
              </Text>
              <Text style={[styles.modalMessage, { color: colors.textSec }]}>
                Are you sure you want to logout from your account?
              </Text>

              <View style={styles.modalButtons}>
                <Pressable
                  style={[
                    styles.modalButton,
                    styles.cancelButton,
                    { borderColor: colors.border },
                  ]}
                  onPress={() => setShowLogoutConfirm(false)}
                >
                  <Text
                    style={[styles.cancelButtonText, { color: colors.text }]}
                  >
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.modalButton, styles.logoutConfirmButton]}
                  onPress={() => {
                    setShowLogoutConfirm(false)
                    onLogout?.()
                  }}
                >
                  <Text style={styles.logoutConfirmText}>Logout</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </View>
  )
}
