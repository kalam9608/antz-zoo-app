import React, { Children } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Card } from "react-native-paper";
import { useSelector } from "react-redux";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Spacing from "../../../configs/Spacing";

const CardTwo = ({ children, onPress, backgroundColor, elevation, stylesData }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  return (
    <>
      <Card
        style={[
          styles.container,
          {
            backgroundColor: backgroundColor
              ? backgroundColor
              : constThemeColor?.onSecondary,
          },
          stylesData
        ]}
        onPress={onPress}
        elevation={elevation}
      >
        <Card.Content>{children}</Card.Content>
      </Card>
    </>
  );
};

const style = (reduxColor) =>
  StyleSheet.create({
    container: {
      marginVertical: Spacing.body,
    },
  });

CardTwo.defaultProps = {
  elevation: 1,
};

export default CardTwo;
