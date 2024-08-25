import { View, StyleSheet, Text, Image } from "react-native";
import React from "react";
import { Card } from "react-native-paper";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";
import Colors from "../configs/Colors";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import FontSize from "../configs/FontSize";
import { opacityColor } from "../utils/Utils";

const TeamUpdate = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  return (
    <View style={styles.container}>
      <Card
        style={[
          props.style,
          {
            width: "100%",
            height: 100,
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
              Team update @5pm
            </Text>
            <Text
              style={{
                fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                color: constThemeColor.outline,
                top: 5,
              }}
            >
              Staff Room
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom:heightPercentageToDP(2),
  },
  AvtarImage: {
    alignItems: "center",
    justifyContent: "center",
    left: "15%",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
  },
});
export default TeamUpdate;
