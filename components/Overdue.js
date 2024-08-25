import { View, StyleSheet, Text, Image } from "react-native";
import React from "react";
import { Card } from "react-native-paper";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";
import Colors from "../configs/Colors";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import svg_stethoscope from "../assets/stethoscope.svg";
import { SvgXml } from "react-native-svg";
import FontSize from "../configs/FontSize";
import { opacityColor } from "../utils/Utils";

const Overdue = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const ImageIcon = ({ path }) => {
    return (
      <>
        <SvgXml xml={path} width="24" height="22" style={styles.image} />
      </>
    );
  };
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
        <View
          style={[
            styles.cardContainer,
            {
              backgroundColor:constThemeColor.notes,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <View
            style={[
              styles.AvtarImage,
              {
                height: 45,
                width: 45,
                borderRadius: 25,
                backgroundColor: "#ff414a",
              },
            ]}
          >
            <ImageIcon path={svg_stethoscope} />
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
                fontSize:FontSize.Antz_Minor_Medium_title.fontSize,
                maxWidth: widthPercentageToDP("80%"),
                color: constThemeColor.onTertiaryContainer,
              }}
            >
              {`Overdue - Medical Checkup`}
            </Text>
            <Text
              style={{
                fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                color: constThemeColor.onTertiaryContainer,
                top: 5,
              }}
            >
              Due on June 22
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
    marginBottom: heightPercentageToDP(2),
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
export default Overdue;
