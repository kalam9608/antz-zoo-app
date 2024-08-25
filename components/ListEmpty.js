import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import FontSize from "../configs/FontSize";
import Constants from "../configs/Constants";

// Images variables
var images = [
  `${require("../assets/no_data_cat.png")}`,
  `${require("../assets/no_data_elephant.png")}`,
  `${require("../assets/no_data_lion.png")}`,
  `${require("../assets/no_data_monkey.png")}`,
];

// get random index
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  const value = Math.floor(Math.random() * (max - min + 1)) + min;
  return value;
}

let randomIndex = getRandomInt(0, images.length - 1);
let randomImage = images[randomIndex];

const ListEmpty = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (props?.visible) {
      randomIndex = getRandomInt(0, images.length - 1);
      randomImage = images[randomIndex];
      setIsLoading(true);
    }
  }, [props?.visible]);

  useEffect(() => {
    if (isLoading == true) {
      setTimeout(() => {
        setIsLoading(false);
      }, Constants.GLOBAL_LOADER_TIMEOUT_VALUE + 700);
    }
  }, [isLoading]);

  // Prevents the ListEmpty component from being shown for 1 second
  // earlier than necessary due to the artificial 1-second delay in the Loader component
  if (isLoading) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: props.backgroundColor,
        },
      ]}
    >
      {props.visible ? null : (
        <>
          {randomImage && (
            <Image
              source={randomImage}
              resizeMode="contain"
              style={styles.imageStyle}
            />
          )}
        </>
      )}
    </View>
  );
};
export default ListEmpty;

const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    height: heightPercentageToDP(50),
    // height: "50%",
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyle: {
    width: 150,
    height: 150,
  },
  textStyle: {
    fontSize: FontSize.Antz_Minor_Title.fontSize,
    opacity: 0.9,
    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
  },
});
