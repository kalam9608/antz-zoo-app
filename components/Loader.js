import React, { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, Dimensions, Platform } from "react-native";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import { opacityColor } from "../utils/Utils";
import Constants from "../configs/Constants";

const loaderColor = [
  "red",
  "tomato",
  "orange",
  "yellow",
  "teal",
  "green",
  "cyan ",
  "royalblue",
  "blue",
  "purple",
  "pink",
  "red",
];

const Loader = ({ visible }) => {
  const [value, setValue] = useState(0);
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const [isModalVisible, setModalVisible] = useState(visible);

  const updateValue = useCallback(() => {
    setValue((v) => (v === 10 ? 0 : v + 1));
  }, []);

  useEffect(() => {
    // Clear interval if component unmounts
    const interval = setInterval(updateValue, 1000);
    return () => clearInterval(interval);
  }, [updateValue]);

  useEffect(() => {
    // Clear timeout if component unmounts or visible becomes false
    const timeoutId = setTimeout(() => {
      setModalVisible(visible);
    }, Constants.GLOBAL_LOADER_TIMEOUT_VALUE);

    return () => clearTimeout(timeoutId);
  }, [visible]);

  return (
    <>
      <Modal
        animationIn="pulse"
        animationOut="pulse"
        coverScreen={true}
        backdropColor={opacityColor(
          themeColors.neutralPrimary,
          Platform.OS === "android" ? 0.5 : 10
        )}
        isVisible={isModalVisible}
      >
        <ActivityIndicator size="large" color={loaderColor[value]} />
      </Modal>
    </>
  );
};

export default Loader;
