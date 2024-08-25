import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import SvgUri from "react-native-svg-uri";
import Configs from "../configs/Config";
import { capitalize, shortenNumber } from "../utils/Utils";
import { useSelector } from "react-redux";
import Colors from "../configs/Colors";
import FontSize from "../configs/FontSize";
import BottomSheetModalStyles from "../configs/BottomSheetModalStyles";
import Background from "./BackgroundImage";

const InsightAnimalCard = ({ ...props }) => {
  const navigation = useNavigation();
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  // const cardHeight = heightPercentageToDP(22);
  // const cardWidth = widthPercentageToDP(29);
  // const cardIcon = cardHeight * 0.4;

  const cardSpacing = 6;
  const cardWidth =
    (props.deviceWidth - (props.numColumns * 2 - 2) * cardSpacing - 32) /
    props.numColumns;
  const cardIcon = cardWidth * 0.4;

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  // const DynamicStyles = styles(constThemeColor);

  if (!props.showClassHierchy) {
    return null;
  }
  const stylesSheet = BottomSheetModalStyles.ShodowOpacity(constThemeColor);
  return (
    <View
      style={[
        // Platform.OS === "android" ? styles.main : styles.mainios,
        styles.main,
        {
          backgroundColor: constThemeColor.onPrimary,
          width: cardWidth,
          elevation: stylesSheet.elevationShadow.elevation,
          shadowColor: stylesSheet.elevationShadow.shadowColor,
        },
      ]}
    >
      {/* <Background> */}
      <TouchableOpacity activeOpacity={0.5} onPress={props.onPress}>
        <View
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              // backgroundColor: "red",
            }}
          >
            <SvgUri
              width={cardIcon}
              height={cardIcon}
              source={{
                uri: Configs.BASE_APP_URL + props.classData.default_icon,
              }}
            />
          </View>
          <View style={{ marginTop: 15 }}>
            <Text
              style={[
                styles.firstNum,
                { color: isSwitchOn ? Colors.white : Colors.insightStatslabel },
              ]}
            >
              {shortenNumber(props?.classData?.animal_count ?? 0)}
            </Text>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[
                  styles.textStyle,
                  {
                    color: isSwitchOn ? Colors.white : Colors.insightStatslabel,
                    flex: 1,
                  },
                ]}
              >
                {props.classData.complete_name
                  ? capitalize(props.classData.complete_name)
                  : "NA"}
              </Text>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[
                  styles.textStyle1,
                  {
                    color: isSwitchOn ? Colors.white : Colors.insightStatslabel,
                  },
                ]}
              >
                {props.classData.common_name
                  ? capitalize(props.classData.common_name)
                  : "NA"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {/* </Background> */}
    </View>
  );
};

export default InsightAnimalCard;

const styles = StyleSheet.create({
  // main: {
  //   margin: wp(1.5),
  //   paddingVertical: heightPercentageToDP(1.5),
  //   paddingHorizontal: heightPercentageToDP(2),
  //   borderRadius: wp(3),
  //   width: wp(43.5),
  // },
  // mainios: {
  //   margin: wp(1.5),
  //   paddingVertical: heightPercentageToDP(1.5),
  //   paddingHorizontal: heightPercentageToDP(2),
  //   borderRadius: wp(3),
  //   width: wp(43.4),
  // },

  main: {
    paddingVertical: 15,
    borderRadius: 10,
    margin: 6,
  },
  firstNum: {
    fontSize: FontSize.Antz_Major_Title_btn.fontSize,
    fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
    textAlign: "center",
  },
  textStyle: {
    fontSize: FontSize.Antz_Minor_Medium.fontSize,
    fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
    flexWrap: "wrap",
    textAlign: "center",
    marginTop: 5,
  },
  textStyle1: {
    fontSize: FontSize.Antz_Subtext_Regular.fontSize,
    fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
    flexWrap: "wrap",
    textAlign: "center",
    marginTop: 5,
  },
});
