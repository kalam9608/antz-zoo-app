import { View, StyleSheet, Text } from "react-native";
import React from "react";
import { SvgUri } from "react-native-svg";
import { useSelector } from "react-redux";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import Spacing from "../../configs/Spacing";
import Config from "../../configs/Config";

const RequestBy = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  return (
    <>
      <View onPress={props.onPress}>
        <View
          style={{
            flexDirection: "row",
            minHeight: 80,
            
           
            borderBottomColor: props?.borderBottomColor ?? null,
            borderBottomWidth: props?.borderBottomWidth ?? 0,
            alignItems: "center",
            padding: Spacing.minor,
        paddingVertical: Spacing.mini
          }}
        >
          <View style={styles.image}>
            <SvgUri
              width={32}
              height={32}
              uri={
                Config.BASE_APP_URL + "assets/class_images/default_animal.svg"
              }
            />
          </View>
          <View
            style={[
              {
                flex: 1,
                width: "100%"
              },
            ]}
          >
            <View style={{  
              }}>
              {props.middleSection}
            </View>
          </View>
          <View
            style={{
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            {props.rightSectoon}
          </View>
        </View>
      </View>
    </>
  );
};
const style = (reduxColors) => StyleSheet.create({
  image: {
    width: 44,
    height: 44,
    borderRadius: 50,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: reduxColors.surfaceVariant,
    marginRight:12
  },
});
export default RequestBy;
