import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Colors from "../configs/Colors";
import { widthPercentageToDP } from "react-native-responsive-screen";
import FontSize from "../configs/FontSize";
import { useSelector } from "react-redux";

const Card = ({ title, subtitle, extra, onPress, valueletter }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={reduxColors.cardContainer}>
        <View style={reduxColors.roundboxContainer}>
          <Text style={reduxColors.numberText}>{valueletter}</Text>
        </View>
        <View style={reduxColors.contentContainer}>
          <View style={reduxColors.middleSection}>
            {title ? <Text style={reduxColors.title}>{title}</Text> : null}
            {subtitle ? (
              <Text style={title ? reduxColors.subtitle : reduxColors.title}>
                {subtitle}
              </Text>
            ) : null}
            {extra ?? null}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    cardContainer: {
      backgroundColor: reduxColors.surface,
      borderRadius: widthPercentageToDP("2%"),
      marginVertical: widthPercentageToDP("2%"),

      elevation: 2, // for shadow on Android
      shadowColor: reduxColors.shadow, // for shadow on iOS
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      flexDirection: "row",
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    roundboxContainer: {
      width: 44,
      height: 44,
      borderRadius: 50,
      alignSelf: "center",
      backgroundColor: reduxColors.primary,
      justifyContent: "center",
    },
    numberText: {
      textAlign: "center",
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      color: reduxColors.onSurFace,
    },
    contentContainer: {
      flexDirection: "row",
    },
    middleSection: {
      width: "95%",
      paddingLeft: 10,
      justifyContent: "center",
    },
    title: {
      fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
      fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
      lineHeight: 19,
      color: reduxColors.onSurfaceVariant,
    },
    subtitle: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      color: reduxColors.onSurfaceVariant,
      marginBottom: 8,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      fontStyle: "italic",
    },
  });

export default Card;
