import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

const ButtonCom = ({
  title,
  onPress,
  buttonColor,
  titleColor,
  buttonStyle,
  textStyle,
  accessibilityLabel,
  accessibilityId
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      accessible= {true}
      accessibilityLabel={accessibilityLabel}
      accessibilityId={accessibilityId}
      style={
        [styles.container,
        buttonStyle,
        buttonColor,]
      }
      onPress={onPress} >
      <Text
        style={[textStyle,title,titleColor]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
 
export default ButtonCom;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  
});

