import { View, StyleSheet, Text, Image } from "react-native";
import React, { useState } from "react";
import { Card } from "react-native-paper";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";
import Colors from "../configs/Colors";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import FontSize from "../configs/FontSize";
import { useNavigation } from "@react-navigation/native";
import { opacityColor } from "../utils/Utils";

const NewAnimalAddedStats = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const fontSizeInPixels = FontSize.Antz_Minor_Regular.fontSize;
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Card
        style={[
          props.style,
          {
            width: "100%",
            height: heightPercentageToDP(10),
            backgroundColor: constThemeColor.onPrimary,
            shadowColor:opacityColor(constThemeColor.neutralPrimary,15)
          },
        ]}
        elevation={0.5}
      >
        <View style={[styles.cardContainer, {}]}>
          <View style={[styles.AvtarImage, {}]}>
            <Avatar.Image size={54} source={require("../assets/parrot.jpeg")} />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              left: "25%",
            }}
          >
            <Text
              style={{
                fontWeight: FontSize.Antz_Minor_Medium_title.fontWeight,
                fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
                maxWidth: widthPercentageToDP("45%"),
                color: constThemeColor.onPrimaryContainer,
              }}
            >
              New Lemur added
            </Text>
            <Text
              style={{
                fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                color: constThemeColor.outline,
                top: 5,
              }}
            >
              5 mins ago
            </Text>
          </View>
            <Image
              style={styles.imageStyle}
              source={require("../assets/media.png")}
            />
        </View>
      </Card>
     
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: heightPercentageToDP(2),
  },
  AvtarImage: {
    alignItems: "center",
    justifyContent: "center",
    left: "15%",
  },
  imageStyle: {
    height: heightPercentageToDP(10),
    width: widthPercentageToDP(20),
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
});
export default NewAnimalAddedStats;