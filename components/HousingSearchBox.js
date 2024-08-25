import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import FontSize from '../configs/FontSize';
import Spacing from '../configs/Spacing';

const HousingSearchBox = ({
  placeholder,
  value,
  onChangeText,
  onClearPress,
  loading,
  maincontainerStyle
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const customStyles = styles(constThemeColor);

  return (
    <View style={[customStyles.mainContainer,maincontainerStyle]}>
      <View style={customStyles.searchBarInnerContainer}>
        <Ionicons
          name={'search'}
          size={20}
          color={constThemeColor.onPrimaryContainer}
        />
        <TextInput
          placeholder={placeholder ?? 'Search'}
          placeholderTextColor={constThemeColor.onPrimaryContainer}
          value={value}
          onChangeText={onChangeText}
          style={customStyles.searchInput}
        />
      </View>
      {loading ?
        <ActivityIndicator />
        : value?.length > 0 ? (
          <TouchableOpacity onPress={onClearPress}>
            <Ionicons
              name={'close'}
              size={20}
              color={constThemeColor.onPrimaryContainer}
            />
          </TouchableOpacity>
        ) : null}
    </View>
  );
};

export default HousingSearchBox;

const styles = (reduxColors) =>
  StyleSheet.create({
    mainContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: reduxColors.neutralPrimary + '0D',
      borderRadius: Spacing.small,
      paddingVertical: Spacing.small + Spacing.micro,
      marginVertical: Spacing.body,
      paddingRight: Spacing.body,
    },
    searchBarInnerContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.small,
    },
    searchInput: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onPrimaryContainer,
      marginHorizontal: Spacing.small,
      flex: 1,
    },
  });
