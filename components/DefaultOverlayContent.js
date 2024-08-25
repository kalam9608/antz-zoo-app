//create by :gaurav shukla
//Date:5-05-2023


import { View, Text } from "react-native";
import ImageHeader from "./ImageHeader";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import AnimatedHeader from "./AnimatedHeader";
import Spacing from "../configs/Spacing";

const DefaultOverlayContent = (props) => {
    // fot taking styles from redux use this function 
    const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
    // const reduxColors = styles(constThemeColor);
  return (
    <>
      <View
        style={{
          // height: "100%",
          width: "100%",
          justifyContent: "space-between",
          backgroundColor: constThemeColor.onSecondaryContainer,
          paddingBottom: Spacing.minor,
        }}
      >
        <View>
          <AnimatedHeader hideMenu={props.hideMenu} />
        </View>
        {props.title ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginHorizontal: Spacing.major,
              marginTop: Spacing.minor,
            }}
          >
            <View
              style={{
                // minHeight: "38%",

                //marginBottom: wp(6),
                // marginLeft: wp(6),
                //justifyContent: "center",
                // backgroundColor: constThemeColor.neutralPrimary,
                //borderRadius: 10,
              }}
            >
              {(props?.preTitle) ? (<Text
                style={{
                  color: constThemeColor.onPrimary,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  paddingBottom: Spacing.micro,
                }}
              >
                {props?.preTitle}
              </Text>) : null}
              <Text
                style={{
                  color: constThemeColor.onPrimary,
                  fontWeight: FontSize.Antz_Major_Title.fontWeight,
                  fontSize: FontSize.Antz_Major_Title.fontSize,
                  paddingBottom: Spacing.micro,
                }}
              >
                {props.title}
              </Text>
              <Text
                style={{
                  color: constThemeColor.onPrimary,
                  fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                  fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                  fontStyle:'italic',
                }}
              >
                {props.subtitle}
              </Text>
            </View>
            {props.infoIcon ? (
            
              <View style={{alignSelf: 'center'}}>
              <View
                style={{
                  backgroundColor: constThemeColor.neutralPrimary,
                  height: 32,
                  width: 32,
                  justifyContent: "center",
                  alignItems: "center",
                  //alignSelf: "center",
                  borderRadius: 100,
                  //marginRight: 20,
                }}
              >
                <MaterialCommunityIcons
                  name="information-variant"
                  size={24}
                  color="white"
                />
              </View>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </>
  );
};

export default DefaultOverlayContent;
