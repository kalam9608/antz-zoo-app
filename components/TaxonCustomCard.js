import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";

import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import { Checkbox } from "react-native-paper";

const TaxonCustomCard = ({
  pictureUri,
  title,
  className,
  orderName,
  scientificName,
  showCancelButton,
  onCancelPress,
  containerStyle,
  showCheckBox,
  isSelected,
  onPress,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[dynamicStyles.speciesCardContainer, containerStyle]}>
      <Image
        source={{ uri: pictureUri }}
        contentFit={'contain'}
        style={dynamicStyles.speciesImage}
      />
      <View style={dynamicStyles.speciesCardTitleContainer}>
        <Text style={dynamicStyles.speciesCardTitleText}>{title}</Text>
        {scientificName ? <Text style={dynamicStyles.speciesCardSubTitleText}>{scientificName}</Text> : null}
        {className ? <Text style={dynamicStyles.speciesCardOtherTitleText}>{`Class: ${className}`}</Text> : null}
        {orderName ? <Text style={dynamicStyles.speciesCardOtherTitleText}>{`Order: ${orderName}`}</Text> : null}
      </View>
      {showCancelButton ?
        <TouchableOpacity onPress={onCancelPress}>
          <Image
            source={require('../assets/cancel_circle.png')}
            contentFit={'contain'}
            style={dynamicStyles.cancelIcon}
          />
        </TouchableOpacity>
        : null}
      {showCheckBox ?
        <Checkbox
          status={isSelected ? "checked" : "unchecked"}
        /> : null}
    </TouchableOpacity>
  )
};

export default TaxonCustomCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    speciesCardContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.body,
      backgroundColor: reduxColors.onError,
      shadowColor: reduxColors.neutralPrimary,
      shadowOpacity: 0.1,
      shadowOffset: {
        height: -1,
        width: 0
      },
      shadowRadius: 0,
      marginBottom: Spacing.mini,
    },
    speciesImage: {
      height: 44,
      width: 44,
      borderRadius: 50
    },
    speciesCardTitleContainer: {
      flex: 1,
      paddingHorizontal: Spacing.body,
    },
    cancelIcon: {
      height: 24,
      width: 24,
    },
    speciesCardTitleText: {
      ...FontSize.Antz_Minor_Title,
      color: reduxColors.onSurfaceVariant,
      marginBottom: Spacing.micro,
    },
    speciesCardSubTitleText: {
      ...FontSize.Antz_Subtext_Regular,
      fontStyle: 'italic',
      color: reduxColors.onSurfaceVariant,
    },
    speciesCardOtherTitleText: {
      ...FontSize.Antz_Body_Regular,
      color: reduxColors.onSurfaceVariant,
    },
  });