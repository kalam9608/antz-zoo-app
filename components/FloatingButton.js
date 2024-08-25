import React from "react";
import { FAB, Provider as PaperProvider } from "react-native-paper";
import {  StyleSheet, SafeAreaView, } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from "react-redux";
import { View } from "react-native";

export default function FloatingButton({ onPress, icon}) {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  return (
      <View style={styles.MainContainer}>
        <LinearGradient
          colors={[constThemeColor.secondary, '#37BD68']}
          style={styles.fabWrapper}
          start={[0, 0]} 
          end={[1, 0]}
        />
        <FAB
          style={styles.fabStyle}
          animated={true}
          disabled={false}
          visible={true}
          accessible={true} 
          accessibilityLabel={'floatingAdd'}
          accessibilityId="floatingAdd"
          loading={false}
          icon={icon}
          onPress={onPress}
          color={constThemeColor.onPrimary}
          shadowColor={constThemeColor.elevation.level0}
          
        />
      </View>
  );
}

const styles = StyleSheet.create({

  fabWrapper: {
    position: "absolute",
    margin: 25,
    right: 0,
    bottom: 0,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    elevation: 6
  },
  fabStyle: {
    position: "absolute",
    margin: 25,
    right: 0,
    bottom: 0,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'transparent',
    // elevation: 8
  },
});
