import { View, TouchableOpacity, Text } from "react-native";
import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Menu } from "react-native-paper";
import { useState } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Colors from "../configs/Colors";
import { useSelector } from "react-redux";
import { log } from "react-native-reanimated";
import FontSize from "../configs/FontSize";

const ImageHeader = (props) => {
  const navigation = useNavigation();

  {
    /*
        author : Arnab
        date: 3.5.23
        desc: added for more function
      */
  }
  const [moreOptionVisible, setMoreOptionVisible] = useState(false);
  const [moreOptionData, setMoreOptionData] = useState(props.optionData ?? []);
  const gotoBack = () => navigation.goBack();
  const openMoreOption = () => setMoreOptionVisible(true);
  const closeMoreOption = () => setMoreOptionVisible(false);

  const optionPress = (item) => {
    setMoreOptionVisible(false);
    if (item.screen !== "") {
      navigation.navigate(item.screen, {
        item: props.itemDetails,
      });
    }
  };
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
   // fot taking styles from redux use this function 
   const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  //  const reduxColors = styles(constThemeColor);
  return (
    <>
      <View
        style={[
          props.style,
          {
            // padding: wp(1),
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 0,
          },
        ]}
      >
        <TouchableOpacity
          onPress={gotoBack}
          style={
            {
              // left: 12,
            }
          }
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={30}
            color={constThemeColor.onPrimary}
            onPress={gotoBack}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: FontSize.Antz_Major, color: constThemeColor.onPrimary }}>
          {props?.title?.length > 15
            ? props?.title?.slice(0, 15) + "..."
            : props?.title}
        </Text>
        {/*
                author : Arnab
                date: 3.5.23
                desc: added for more function
                */}
        <Menu
          visible={moreOptionVisible}
          onDismiss={closeMoreOption}
          anchor={
            <MaterialCommunityIcons
              name="dots-vertical"
              color={constThemeColor.onPrimary}

              onPress={openMoreOption}
              size={30}
            />
          }
          statusBarHeight={15}
        >
          {moreOptionData.map((item, index) => {
            return (
              <Menu.Item
                onPress={() => {
                  setMoreOptionVisible(false);
                  props.optionPress(item);
                }}
                title={item.option}
                key={index}
              />
            );
          })}
        </Menu>
      </View>
    </>
  );
};

export default ImageHeader;
