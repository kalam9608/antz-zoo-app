import { View, Text ,StyleSheet} from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { widthPercentageToDP } from "react-native-responsive-screen";
import FontSize from '../configs/FontSize';
import Spacing from '../configs/Spacing';

const GenderChipComponents = ({chipType}) => {
    const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
    const reduxColors = styles(constThemeColor);
    
  return (
    <>
      {chipType ? (
              <View
                style={reduxColors.tagsContainer}
                onStartShouldSetResponder={() => true}
              >
                <View
                  style={
                    chipType == "male"
                      ? reduxColors.malechip
                      : chipType == "female"
                      ? reduxColors.femalechip
                      : chipType == "undetermined"
                      ? reduxColors.undeterminedChip
                      : chipType == "indeterminate"
                      ? reduxColors.indeterminedChip
                      : {}
                  }
                >
                  <Text
                    style={
                      chipType == "male"
                        ? reduxColors.malechipText
                        : chipType == "female"
                        ? reduxColors.femalechipText
                        : chipType == "undetermined"
                        ? reduxColors.undeterminedText
                        : chipType == "indeterminate"
                        ? reduxColors.indeterminedText
                        : {}
                    }
                  >
                    {chipType == "male"
                      ? `M`
                      : chipType == "female"
                      ? `F`
                      : chipType == "undetermined"
                      ? `UD`
                      : chipType == "indeterminate"
                      ? `ID`
                      : null}
                  </Text>
                </View>
              </View>
            ) : null}
    </>
  )
}

export default GenderChipComponents
const styles = (reduxColors) =>
  StyleSheet.create({
    tagsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: Spacing.mini,
    },

    malechip: {
      paddingHorizontal: Spacing.mini,
      paddingVertical: Spacing.micro,
      borderRadius: Spacing.mini,
      backgroundColor: reduxColors.secondaryContainer,
      marginRight: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    femalechip: {
      paddingHorizontal: Spacing.mini,
      paddingVertical: Spacing.micro,
      borderRadius: Spacing.mini,
      backgroundColor: reduxColors.errorContainer,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      marginHorizontal: widthPercentageToDP(0.5),
    },
    undeterminedChip: {
      paddingHorizontal: Spacing.mini,
      paddingVertical: Spacing.micro,
      borderRadius: Spacing.mini,
      backgroundColor: reduxColors.displaybgSecondary,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    indeterminedChip: {
      paddingHorizontal: Spacing.mini,
      paddingVertical: Spacing.micro,
      borderRadius: Spacing.mini,
      backgroundColor: reduxColors.displaybgSecondary,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    malechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onSecondaryContainer,
    },
    femalechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onErrorContainer,
    },
    undeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.error,
    },
    indeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onSurfaceVariant,
    },
  });