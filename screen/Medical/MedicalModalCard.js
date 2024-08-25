import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../configs/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";

const MedicalModalCard = ({
  UserEnclosureName,
  children,
  onPress,
  image,
  rightIcon,
  ...props
}) => {
  // fot taking reduxColors from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={reduxColors.cardContainer}>
        {image ? (
          <View
            style={reduxColors.imagebox}
            backgroundColor={props.backgroundColor}
          >
            <Image
              style={reduxColors.image}
              source={props.imagePath}
              resizeMode="cover"
            />
          </View>
        ) : null}

        <View style={reduxColors.contentContainer}>
          <View style={reduxColors.middleSection}>{children ?? null}</View>
          {rightIcon ? (
            <View>
              <View
                style={{
                  marginHorizontal: wp(3),
                  marginVertical: wp(4),
                }}
              >
                <AntDesign name="right" size={wp(5)} color="black" />
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    enclosureName: {
      margin: "2%",
      paddingLeft: "3%",
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
    },
    cardContainer: {
      borderBottomWidth: 1,
      borderColor: "#D9D9D9",

      borderRadius: wp("3%"),
      marginVertical: wp("1%"),

      flexDirection: "row",
      paddingHorizontal: 5,
      paddingVertical: 8,
    },
    contentContainer: {
      flexDirection: "row",
    },
    middleSection: {
      width: "80%",
      paddingLeft: wp(4),
      justifyContent: "center",
    },
    title: {
      fontSize: wp(4),
      fontWeight: "330",
      // marginBottom: 4,
      color: Colors.subtitle,
      // backgroundColor:'yellow',
      width: "100%",
    },
    subtitle: {
      fontSize: wp(14),
      color: Colors.subtitle,
      fontWeight: "400",
      fontStyle: "italic",
    },
    imagebox: {
      width: wp(11),
      height: hp(5),
      // backgroundColor: "#D9D9D9",
      marginTop: hp(2),
      padding: wp(1),
      alignItems: "center",
      borderRadius: wp(5),
    },
    image: {
      height: hp(4),
      // width:"100%",
      // marginTop: hp(0.5),
      // borderRadius: wp(1)
    },
    imageTwo: {
      width: 44,
      height: 44,
      borderRadius: 50,
      alignSelf: "center",
      marginRight: 10,
      marginLeft: 5,
    },
    rightSection: {
      justifyContent: "center",
      width: "35%",
      paddingRight: 30,
    },
    count: {
      fontSize: FontSize.Antz_Medium_Medium.fontSize,
      fontWeight: FontSize.Antz_Medium_Medium.fontWeight,
      alignSelf: "flex-end",
      color: Colors.count,
    },
  });

export default MedicalModalCard;
