import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import Spacing from "../configs/Spacing";

const AnimalImageViewer = ({ item }) => {
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  return (
    <>
      <View style={{ borderWidth: 0.5, borderColor: themeColors?.outline, borderTopLeftRadius: Spacing.small, borderTopRightRadius: Spacing.small }}>
        <Image
          source={{ uri: item?.url }}
          // source={{uri: "https://as1.ftcdn.net/v2/jpg/01/03/31/48/1000_F_103314840_pSOFixTmp0m48TfBFoYPw0pOpoaKebwJ.jpg"}}
          style={{
            height: heightPercentageToDP(15),
            width: widthPercentageToDP(45),
            borderTopLeftRadius:Spacing.small,
            borderTopRightRadius:Spacing.small
          }}
        />
        <Text
          style={{
            backgroundColor: themeColors?.surface,
            paddingHorizontal: Spacing.mini,
            paddingVertical: Spacing.small,
            width: widthPercentageToDP(45),
            color: themeColors?.onSurfaceVariant
          }}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {item?.filename}
        </Text>
      </View>
    </>
  );
};

export default AnimalImageViewer;
