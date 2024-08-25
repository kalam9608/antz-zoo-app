// Species custom card added if anyone use any listing of species use that card
// 1.icon =  image, svg
// 2. animal name
// 3. complete_name,
// 4. sex Data
// 5. animal count
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TouchableWithoutFeedback } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import SvgUri from "react-native-svg-uri";
import FontSize from "../configs/FontSize";
import { capitalize, shortenNumber } from "../utils/Utils";
import ImageComponent from "./ImageComponent";
import Spacing from "../configs/Spacing";
import BottomSheetModalStyles from "../configs/BottomSheetModalStyles";
import Background from "./BackgroundImage";
const SpeciesCustomCard = ({
  onPress,
  cardID,
  icon,
  animalName,
  complete_name,
  tags,
  count,
  ...props
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [imageType, setImageType] = useState(null);
  const stylesSheet = BottomSheetModalStyles.ShodowOpacity(constThemeColor);
  return (
    <TouchableWithoutFeedback>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={onPress}
        style={[
          reduxColors.cardContainer,
          props?.style,
          {
            cardID,
            elevation: stylesSheet.elevationShadow.elevation,
            shadowColor: stylesSheet.elevationShadow.shadowColor,
          },
        ]}
      >
        {/* <Background> */}
          <View
            style={{ display: "flex", flexDirection: "row", width: "100%" }}
          >
            <View style={{ marginRight: Spacing.body, alignSelf: "center" }}>
              <ImageComponent icon={icon} />
            </View>
            <View style={{ flex: 1 }}>
              <View>
                {complete_name ? (
                  <Text
                    style={[
                      reduxColors.title,
                      {
                        color: constThemeColor.onSurfaceVariant,
                        marginBottom: Spacing.micro,
                      },
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {capitalize(complete_name)}
                  </Text>
                ) : null}
              </View>
              <View>
                {animalName ? (
                  <Text
                    style={[
                      reduxColors.subtitle,
                      {
                        color: constThemeColor.onSurfaceVariant,
                        fontStyle: "italic",
                        marginBottom: Spacing.small,
                      },
                    ]}
                  >
                    {capitalize(animalName)}
                  </Text>
                ) : null}
              </View>
              {tags ? (
                <>
                  {/* <View style={{ height: 10 }}></View> */}
                  <View>
                    <View
                      style={reduxColors.tagsContainer}
                      onStartShouldSetResponder={() => true}
                    >
                      {Object.keys(tags).map((key) => {
                        if (tags[key] > 0) {
                          return (
                            <View
                              key={key}
                              style={
                                key == "male"
                                  ? reduxColors.malechip
                                  : key == "female"
                                  ? reduxColors.femalechip
                                  : key == "undetermined"
                                  ? reduxColors.undeterminedChip
                                  : key == "indeterminate"
                                  ? reduxColors.indeterminedChip
                                  : {}
                              }
                            >
                              <Text
                                style={
                                  key == "male"
                                    ? reduxColors.malechipText
                                    : key == "female"
                                    ? reduxColors.femalechipText
                                    : key == "undetermined"
                                    ? reduxColors.undeterminedText
                                    : key == "indeterminate"
                                    ? reduxColors.indeterminedText
                                    : {}
                                }
                              >
                                {key == "male"
                                  ? `M - ${tags[key]}`
                                  : key == "female"
                                  ? `F - ${tags[key]}`
                                  : key == "undetermined"
                                  ? `UD - ${tags[key]}`
                                  : key == "indeterminate"
                                  ? `ID - ${tags[key]}`
                                  : null}
                              </Text>
                            </View>
                          );
                        }
                      })}
                    </View>
                  </View>
                </>
              ) : null}
            </View>
            <View
              style={{
                alignContent: "center",
                justifyContent: "center",
                marginLeft: Spacing.body,
              }}
            >
              {count ? (
                <View
                  style={[
                    reduxColors.rightSection,
                    {
                      alignItems: "flex-end",
                    },
                  ]}
                >
                  <Text style={reduxColors.count}>{shortenNumber(count)}</Text>
                </View>
              ) : null}
            </View>
          </View>
        {/* </Background> */}
      </TouchableOpacity>
    </TouchableWithoutFeedback>
  );
};

export default SpeciesCustomCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    cardContainer: {
      borderRadius: 10,
      elevation: 1, // for shadow on Android
      shadowColor: reduxColors.neutralPrimary, // for shadow on iOS
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      flexDirection: "row",
      padding: Spacing.minor,
      backgroundColor: reduxColors.onPrimary,
      justifyContent: "space-between",
      marginVertical: Spacing.mini,
    },
    image: {
      width: 44,
      height: 44,
      borderRadius: 50,
      alignSelf: "center",
      marginRight: 10,
      marginLeft: 5,
    },
    title: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    subtitle: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    tagsContainer: {
      flexDirection: "row",
    },
    rightSection: {
      justifyContent: "center",
      fontSize: FontSize.Antz_Major,
    },
    rightIcon: {
      fontSize: FontSize.Antz_Major_Title.fontSize,
      fontWeight: FontSize.Antz_Major_Title.fontWeight,
      color: reduxColors.onSurface,
      marginRight: 10,
    },
    count: {
      fontSize: FontSize.Antz_Major_Title.fontSize,
      fontWeight: FontSize.Antz_Major_Title.fontWeight,
      color: reduxColors.onSurface,
      marginRight: 5,
    },
    tag: {
      backgroundColor: reduxColors.tagColor,
      borderRadius: 8,
      paddingHorizontal: 8,
      marginRight: 8,
    },

    malechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.secondaryContainer,
      marginRight: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    femalechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.errorContainer,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      marginHorizontal: widthPercentageToDP(0.5),
    },
    undeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.displaybgSecondary,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    indeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.displaybgSecondary,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    malechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onSecondaryContainer,
    },
    femalechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onErrorContainer,
    },
    undeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.error,
    },
    indeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
  });
