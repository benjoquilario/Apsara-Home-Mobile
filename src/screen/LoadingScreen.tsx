import React from "react"
import { View, Text, ActivityIndicator,  } from "react-native"
import { Image } from "expo-image"
import { Colors } from "../constants/colors"
import styles from "../styles/LoadingScreen.styles"

export default function LoadingScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <Image
          source={{
          uri: "https://res.cloudinary.com/dc05ncs6l/image/upload/v1780969765/home_logo_zktlq8.png"
        }}
          style={styles.logo}
          contentFit="contain"
          transition={200}
        />
        <Text style={styles.title}>AF Home</Text>
      </View>
      <ActivityIndicator
        size="large"
        color={Colors.sky}
        style={styles.loader}
      />
    </View>
  )
}
