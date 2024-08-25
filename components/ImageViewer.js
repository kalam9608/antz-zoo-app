{
  /*
@author -   Arnab Gupta
date -      1.8.23
params -    data = [],  //for image array format{id: id, url : url}
            imageClose=()=>{}, //function for remove image
            horizontal= true/false //show like horizontal true or false
*/
}

// React import
import React, { useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";

// Third party importscccc
import {
  ImageWrapper,
  ImageViewer as Viewer,
} from "react-native-reanimated-viewer";
import { Entypo } from "@expo/vector-icons";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

// Fontsize import
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";

const ImageViewer = ({
  data,
  imageClose,
  horizontal,
  width,
  imgWidth,
  imgHeight,
  fileName,
  imageLongPress,
  isLongPress,
  deleteButton,
  imageDelete
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const imageRef = useRef(null);
  const timerRef = useRef(null);

  const handleLongPress = (imageData) => {
    clearTimeout(timerRef.current);
    if (isLongPress) {
      imageLongPress(imageData);
    }
  };

  const handlePressIn = (imageData) => {
    timerRef.current = setTimeout(() => {
      handleLongPress(imageData);
    }, 500);
  };

  const handlePressOut = () => {
    clearTimeout(timerRef.current);
  };

  const RenderMap = () => {
    return (
      <>
        {data.map((el, index) => (
          <View
            style={{
              width: width ?? 300,
              borderWidth: 0.5,
              borderColor: constThemeColor.outlineVariant,
              marginVertical: Spacing.mini,
              marginHorizontal: Spacing.small,
              marginLeft: 0,
            }}
          >
            <TouchableOpacity onPressIn={() => handlePressIn(el)} onPressOut={handlePressOut}>
              <ImageWrapper
                key={el.id}
                viewerRef={imageRef}
                index={index}
                source={{
                  uri: el.url ? el.url : el.uri,
                }}
              >
                <Image
                  source={{
                    uri: el.url ? el?.url : el.uri,
                  }}
                  style={{
                    width: imgWidth ?? 298,
                    height: imgHeight ?? 150,
                  }}
                />
              </ImageWrapper>
            </TouchableOpacity>
            {imageClose || fileName ? (
              <View style={reduxColors.imgNameStyle}>
                <Text style={reduxColors.imageName}>
                  {el.name ? el.name.slice(-12) : el.url.slice(-12)}
                </Text>
                {imageClose ? (
                  <TouchableOpacity onPress={() => imageClose(el)}>
                    <Entypo
                      name="cross"
                      size={20}
                      color={constThemeColor.onSurfaceVariant}
                    />
                  </TouchableOpacity>
                ) : null}
                {deleteButton && el?.delete_access ? (
                  <TouchableOpacity onPress={() => imageDelete(el)}>
                    <Entypo
                      name="cross"
                      size={20}
                      color={constThemeColor.onSurfaceVariant}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}
          </View>
        ))}
      </>
    );
  };

  if (horizontal) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <RenderMap />
        <Viewer
          ref={imageRef}
          data={data.map((el) => ({
            key: `key-${el.id}`,
            source: { uri: el.url ? el?.url : el.uri },
          }))}
        />
      </ScrollView>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          marginVertical: 14,
          justifyContent: "space-between",
        }}
      >
        <RenderMap />
        <Viewer
          ref={imageRef}
          data={data.map((el) => ({
            key: `key-${el.id}`,
            source: { uri: el.url ? el?.url : el.uri },
          }))}
        />
      </View>
    );
  }
};

export default React.memo(ImageViewer);

const styles = (reduxColors) =>
  StyleSheet.create({
    imgNameStyle: {
      // borderTopWidth: widthPercentageToDP(0.225),
      // borderTopColor: reduxColors.outlineVariant,
      width: "100%",
      minHeight: heightPercentageToDP(4.5),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: Spacing.small,
      backgroundColor: reduxColors?.background,
    },
    imageName: {
      fontSize: FontSize.Antz_Small.fontSize,
      fontWeight: FontSize.Antz_Small.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
  });
