import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { TouchableOpacity } from "react-native";

const GenderByFilter = (tags) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <View style={reduxColors.container}>
      <View>
        {Object.keys(tags.tags).map((key) => (
          <View
            key={key}
            style={
              key == "male"
                ? reduxColors.malechip
                : key == "female"
                ? reduxColors.femalechip
                : key == "undetermined"
                ? reduxColors.undeterminedChip
                : key == "indeterminate"
                ? reduxColors.indeterminedChip
                : {}
            }
          >
            <Text
              style={
                key == "male"
                  ? reduxColors.malechipText
                  : key == "female"
                  ? reduxColors.femalechipText
                  : key == "undetermined"
                  ? reduxColors.undeterminedText
                  : key == "indeterminate"
                  ? reduxColors.indeterminedText
                  : {}
              }
            >
              {key == "male"
                ? `M - ${tags[key]}`
                : key == "female"
                ? `F - ${tags[key]}`
                : key == "undetermined"
                ? `UD - ${tags[key]}`
                : key == "indeterminate"
                ? `ID - ${tags[key]}`
                : null}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default GenderByFilter;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });
