/**
 * @React Imports
 */
import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
/**
 * @Expo Imports
 */
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";

/**
 * @Redux Imports
 */
import { useSelector } from "react-redux";
/**
 * @Third Party Imports
 */
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { SvgUri, SvgXml } from "react-native-svg";

/**
 * @Config Imports
 */
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import BottomSheetModalStyles from "../configs/BottomSheetModalStyles";
import Config from "../configs/Config";

const AddMedicalRecordCard = ({
  UserEnclosureName,
  children,
  onPress,
  image,
  rightIcon,
  buttonStyle,
  buttonColor,
  svgUri,
  svgXML,
  data,
  ...props
}) => {
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet = BottomSheetModalStyles.ShodowOpacity(constThemeColor);
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[reduxColors.cardContainer, buttonStyle]}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            // backgroundColor: "blue",
          }}
        >
          {image ? (
            <View style={reduxColors.imagebox}>
              <Image
                style={reduxColors.image}
                source={props.imagePath}
                resizeMode="stretch"
              />
            </View>
          ) : null}
          {svgXML ? (
            <View style={[reduxColors.imagebox]}>
              <SvgXml
                xml={props.svgXMLData}
                width="24"
                height="24"
                style={reduxColors.image}
              />
            </View>
          ) : props.attach ? (
            <View>
              <MaterialIcons
                name="attach-file"
                size={26}
                color={constThemeColor.onPrimaryContainer}
              />
            </View>
          ) : null}
          {svgUri ? (
            <View style={[reduxColors.imagebox]}>
              <SvgUri
                width="24"
                height="24"
                style={reduxColors.image}
                uri={
                  Config.BASE_APP_URL + "assets/class_images/default_animal.svg"
                }
              />
            </View>
          ) : null}
          <View style={reduxColors.middleSection}>{children ?? null}</View>
        </View>

        <View style={reduxColors.contentContainer}>
          {rightIcon ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginLeft: Spacing.body,
              }}
            >
              {data ? (
                <View>
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={constThemeColor.primary}
                  />
                </View>
              ) : (
                <View>
                  <Feather
                    name="plus-circle"
                    size={24}
                    color={constThemeColor.addPrimary}
                  />
                </View>
              )}
            </View>
          ) : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    cardContainer: {
      borderWidth: 1,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.surface,
      borderRadius: Spacing.small,
      marginVertical: Spacing.small,
      flexDirection: "row",
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.body,
      justifyContent: "space-between",
      alignItems: "center",
    },
    contentContainer: {
      flexDirection: "row",
    },
    middleSection: {
      marginLeft: Spacing.body,
      flex: 1,
      // backgroundColor: "green",
    },
    imagebox: {
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      width: 24,
      height: 24,
      color: reduxColors.onPrimaryContainer,
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default AddMedicalRecordCard;
