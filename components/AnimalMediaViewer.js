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
  Image,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";

// Third party imports
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
import ListEmpty from "./ListEmpty";

const AnimalMediaViewer = ({
  data,
  imageFooterLoader,
  loadmoreImageData,
  width,
  imgWidth,
  imgHeight,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const imageRef = useRef(null);

  const RenderMap = ({ item, index }) => {
    return (
      <View
        style={{
          borderWidth: 0.5,
          borderColor: constThemeColor?.outline,
          borderTopLeftRadius: Spacing.small,
          borderTopRightRadius: Spacing.small,
          marginHorizontal: Spacing.small,
        }}
      >
        <ImageWrapper
          key={item.id}
          viewerRef={imageRef}
          index={index}
          source={{
            // uri: item.url ? item.url : item.uri,
            uri: "https://as1.ftcdn.net/v2/jpg/01/03/31/48/1000_F_103314840_pSOFixTmp0m48TfBFoYPw0pOpoaKebwJ.jpg",
          }}
        >
          <Image
            source={{
              // uri: item.url ? item?.url : item.uri,
              uri: "https://as1.ftcdn.net/v2/jpg/01/03/31/48/1000_F_103314840_pSOFixTmp0m48TfBFoYPw0pOpoaKebwJ.jpg",
            }}
            style={{
              height: heightPercentageToDP(15),
              width: widthPercentageToDP(45),
              borderTopLeftRadius: Spacing.small,
              borderTopRightRadius: Spacing.small,
            }}
          />
        </ImageWrapper>
        <View style={reduxColors.imgNameStyle}>
          <Text
            style={{
              backgroundColor: constThemeColor?.surface,
              paddingHorizontal: Spacing.mini,
              paddingVertical: Spacing.small,
              width: widthPercentageToDP(45),
              color: constThemeColor?.onSurfaceVariant,
            }}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {item.filename ? item.filename.slice(-12) : item.url.slice(-12)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ marginHorizontal: Spacing.minor, marginTop: Spacing.body }}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index?.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 10,
        }}
        // style={{ flex: 1 }}
        renderItem={RenderMap}
        ListEmptyComponent={<ListEmpty label={"No images found!"} />}
        onEndReached={loadmoreImageData}
        ListFooterComponent={imageFooterLoader}
        onEndReachedThreshold={0.4}
      />
      <Viewer
        ref={imageRef}
        data={data.map((item) => ({
          key: `key-${item.id}`,
          // source: { uri: item.url ? item?.url : item.uri },
          source: { uri: "https://as1.ftcdn.net/v2/jpg/01/03/31/48/1000_F_103314840_pSOFixTmp0m48TfBFoYPw0pOpoaKebwJ.jpg" },
        }))}
      />
    </View>

    // <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    //   <RenderMap />
    // </ScrollView>
  );
};

export default AnimalMediaViewer;

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
