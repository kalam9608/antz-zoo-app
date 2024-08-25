import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import { Card } from "react-native-paper";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { ifEmptyValue } from "../utils/Utils";
import SvgUri from "react-native-svg-uri";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import { useState } from "react";
import Config from "../configs/Config";

const SpeciesCard = ({ imgUrl, title, subTitle, onPress }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const [imageUrl] = useState(
    imgUrl
      ? imgUrl
      : Config.BASE_APP_URL + "assets/class_images/default_animal.svg"
  );
  const [isSvg, setIsSvg] = useState();
  const reduxColors = styles(constThemeColor);


  const checkValidUrl = (url) => {
    //define some image formats
    var types = ["svg"];

    //split the url into parts that has dots before them
    var parts = url?.split(".");

    //get the last part onPress
    var extension = parts[parts?.length - 1];

    //check if the extension matches list
    if (types.indexOf(extension) !== -1) {
      return true;
    }
  };
  // useEffect(()=>{
  // const is_svg = checkValidUrl(imgUrl ?? Config.BASE_APP_URL + "assets/class_images/default_animal.svg");
  //   setIsSvg(is_svg)
  // },[imgUrl])
  return (
    <Card
      style={[
        {
          minHeight: 68,
          backgroundColor: constThemeColor.onPrimary,
          justifyContent: "center",
          borderRadius: 8,
          marginBottom: 12,
        },
      ]}
      onPress={onPress}
    >
      <View style={[reduxColors.cardContainer]}>
        <View style={reduxColors.AvtarImage}>
          {checkValidUrl(imgUrl) ? (
            <View style={reduxColors.imgStyle}>
              <SvgUri
                width="30"
                height="30"
                style={reduxColors.image}
                source={{
                  uri:
                    Config.BASE_APP_URL +
                    "assets/class_images/default_animal.svg",
                }}
              />
            </View>
          ) : (
            <Image
              source={{
                uri: imgUrl,
              }}
              style={{
                height: 44,
                width: 44,
                alignItems: "center",
                borderRadius: 22,
              }}
            />
          )}
        </View>

        <View style={reduxColors.textBox}>
          <Text style={reduxColors.title}>{ifEmptyValue(title)}</Text>
          <Text style={reduxColors.subTitle}>{ifEmptyValue(subTitle)}</Text>
        </View>
      </View>
    </Card>
  );
};

export default SpeciesCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    imgStyle: {
      backgroundColor: reduxColors.displaybgPrimary,
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },

    cardContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    AvtarImage: {
      paddingHorizontal: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    textBox: {
      flex: 1,
      justifyContent: "center",
      marginRight: 12,
      marginVertical: 12,
    },
    title: {
      color: reduxColors.onSurfaceVariant,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
    },
    subTitle: {
      color: reduxColors.onSurfaceVariant,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      paddingTop: 8,
    },
  });
