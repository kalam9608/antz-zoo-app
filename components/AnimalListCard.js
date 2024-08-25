// Name: Ganesh Aher
// Date:24 April
// work: Design FlatListCard component

/**
 * @React Imports
 */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

/**
 * @Expo Imports
 */
import { AntDesign } from "@expo/vector-icons";

/**
 * @Redux Imports
 */
import { useSelector } from "react-redux";

/**
 * @Third Party Imports
 */
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
/**
 * @Config Imports
 */
import FontSize from "../configs/FontSize";

const AnimalListCard = ({
  UserEnclosureName,
  title,
  subtitle,
  onPress,
  checkbox,

  color,
  fontSize,
  fontWeight,

  tags,
  sectionData,
  sectionfontSize,
  sectionfontWeight,
  enclosurefontSize,
  enclosurefontWeight,
  ...props
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={reduxColors.cardContainer}>
        <View style={reduxColors.image}>
          <Image source={require("../assets/antz.png")} resizeMode="cover" />
        </View>
        <View style={reduxColors.contentContainer}>
          <View style={reduxColors.middleSection}>
            {props.titleName ? (
              <Text style={reduxColors.titleName}>{props.titleName}</Text>
            ) : null}
            {title ? (
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={reduxColors.title}>
                  {props.titleNames}
                  {title}
                </Text>
                {/* {chips} */}
              </View>
            ) : null}

            <View
              style={{ flexDirection: "row", width: widthPercentageToDP(60) }}
            >
              {subtitle ? (
                <Text
                  style={[
                    title ? reduxColors.subtitle : reduxColors.title,
                    { fontWeight: fontWeight },
                    { fontSize: fontSize },
                  ]}
                >
                  {subtitle}
                </Text>
              ) : null}

              {tags == "typesTag" ? (
                <View style={reduxColors.mainTag}>
                  <View style={reduxColors.tagscontainerM}>
                    <Text
                      style={{
                        color: constThemeColor.onPrimary,
                        fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                        fontSize: FontSize?.Antz_Small,
                        lineHeight: 12,
                        textAlign: "center",
                      }}
                    >
                      M
                    </Text>
                  </View>

                  <View style={reduxColors.tagscontainerB}>
                    <Text
                      style={{
                        color: constThemeColor.onPrimary,
                        fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                        fontSize: FontSize?.Antz_Small,
                        lineHeight: 12,
                        textAlign: "center",
                      }}
                    >
                      B
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          </View>

          <View style={reduxColors.enclosure}>
            <Text
              style={[
                reduxColors.enclosureName,
                { fontSize: enclosurefontSize },
                { fontWeight: enclosurefontWeight },
              ]}
            >
              {UserEnclosureName}
            </Text>
          </View>

          {sectionData == "section" ? (
            <View style={reduxColors.enclosure}>
              <Text
                style={[
                  reduxColors.enclosureName,
                  { fontSize: sectionfontSize },
                  { fontWeight: sectionfontWeight },
                ]}
              >
                section Name:
              </Text>
            </View>
          ) : null}
        </View>
        <View style={reduxColors.rightSection}>
          <View
            style={{
              marginHorizontal: widthPercentageToDP(5),
              marginVertical: widthPercentageToDP(6.5),
            }}
          >
            <AntDesign name="right" size={14} color="black" />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    enclosureName: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      marginTop: "-2%",
      width: widthPercentageToDP("60%"),
    },
    cardContainer: {
      backgroundColor: reduxColors.onSecondary,
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
    rightSection: {
      justifyContent: "center",
    },
    image: {
      width: 44,
      height: 44,
      borderRadius: 50,
      marginRight: 10,
      marginLeft: 5,
      alignSelf: "center",
      justifyContent: "center",
    },

    middleSection: {
      width: "70%",
      justifyContent: "center",
    },
    titleName: {
      fontWeight:FontSize.Antz_Minor_Regular.fontWeight,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      lineHeight: 17,
    },
    title: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight:FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
      width: "100%",
      alignItems: "center",
    },
    subtitle: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      color: reduxColors.onSurfaceVariant,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      height: heightPercentageToDP(4),

      paddingTop: heightPercentageToDP(0.5),
    },
    mainTag: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: widthPercentageToDP(20),
      height: heightPercentageToDP(4),
    },
    tagscontainerM: {
      width: widthPercentageToDP(8),
      height: heightPercentageToDP(4),
      backgroundColor:reduxColors.surfaceVariant,
      borderRadius: 5,

      marginLeft: widthPercentageToDP(1.2),
      justifyContent: "center",
    },
    tagscontainerB: {
      width: widthPercentageToDP(8),
      height: heightPercentageToDP(4),
      backgroundColor: reduxColors.secondary,
      borderRadius: 5,

      justifyContent: "center",
    },
  });

export default AnimalListCard;
