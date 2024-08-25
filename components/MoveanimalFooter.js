// created By: Wasim Akram
// created At: 10/05/2023

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";

const MoveanimalFooter = (props) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  return (
    <View style={styles.container}>
      <LinearGradient colors={[constThemeColor?.addBackground, constThemeColor?.primaryContainer]}>
        <View style={styles.mainBox}>
          <TouchableOpacity
            style={styles.firstbutton}
            onPress={() => navigation.goBack()}
          >
            {/* <View style={styles.firstbutton}> */}
              <Text style={styles.buttonText}>Cancel</Text>
            {/* </View> */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondbutton} onPress={props.onPress}>
            {/* <View style={styles.secondbutton}> */}
              <Text style={styles.buttonText}>
                {props?.type ?? "Move it here"}
              </Text>
            {/* </View> */}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default MoveanimalFooter;
const style = (reduxColors) => StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  mainBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: reduxColors?.onSecondary,
    height: heightPercentageToDP(12),
    width: widthPercentageToDP(100),
  },

  firstbutton: {
    height: heightPercentageToDP(5),
    width: widthPercentageToDP(20),
    backgroundColor: reduxColors?.outline,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: widthPercentageToDP(2),
  },
  secondbutton: {
    height: heightPercentageToDP(5),
    width: widthPercentageToDP(30),
    backgroundColor: reduxColors?.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText:{
    color: reduxColors?.onSecondary, 
    fontSize:FontSize.Antz_Minor_Title.fontSize, 
    fontWeight:FontSize.Antz_Minor_Title.fontWeight
  }
});
