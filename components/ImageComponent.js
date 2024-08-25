// This component will check that image svg or jpeg you have to pass ths icon from where you import

// import { Image, StyleSheet, Text, View } from 'react-native'
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import SvgUri from "react-native-svg-uri";
import { useSelector } from "react-redux";
import { opacityColor } from "../utils/Utils";

const ImageComponent = ({ icon }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [imageType, setImageType] = useState(null);

  useEffect(() => {
    // Check the image type based on the file extension
    const fileExtension = icon?.split(".").pop().toLowerCase();
    if (fileExtension === "svg") {
      setImageType("svg");
    } else {
      // Other image types can be handled here if needed
      setImageType(null);
    }
  }, [icon]);

  return (
    <>
      {imageType === "svg" ? (
        <View
          style={[
            reduxColors.imageSvg,
            {
              backgroundColor: opacityColor(constThemeColor.neutralPrimary, 10),
            },
          ]}
        >
          <Image
            style={{ width: 30, height: 30, alignSelf: "center" }}
            source={{ uri: icon }}
            // placeholder={blurhash}
            contentFit="contain"
            transition={300}
          />
        </View>
      ) : (
        <View style={reduxColors.image}>
          <Image
            style={reduxColors.image}
            source={{ uri: icon }}
            // placeholder={blurhash}
            contentFit="contain"
            transition={300}
          />
        </View>
      )}
    </>
  );
};

export default ImageComponent;

const styles = (reduxColors) =>
  StyleSheet.create({
    image: {
      width: 50,
      height: 50,
      borderRadius: 50,
      alignSelf: "center",
      backgroundColor: reduxColors.neutral10,
    },
    imageSvg: {
      width: 50,
      height: 50,
      borderRadius: 50,
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: reduxColors.neutral10,
    },
  });
