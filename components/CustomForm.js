import { View, Text, ScrollView, Animated } from "react-native";
import React, { useState } from "react";
import styles from "../configs/Styles";
import Header from "./Header";
import { useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Colors from "../configs/Colors";
import { heightPercentageToDP } from "react-native-responsive-screen";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import SubmitBtn from "./SubmitBtn";
import DeleteBtn from "./DeleteBtn";

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 70;
const TITLE_MIN_HEIGHT = 40;
const CustomForm = ({ onPress, marginLeft, back, ...props }) => {
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  const [scrollY] = useState(new Animated.Value(0));
  const [shiftHeader, setShiftHeader] = useState(false);

  const headerTitleBottom = scrollY.interpolate({
    inputRange: [
      0,
      HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
      HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT + 5 + TITLE_MIN_HEIGHT,
      HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT + 5 + TITLE_MIN_HEIGHT + 26,
    ],
    outputRange: [-20, -10, -20, 0],
    extrapolate: "clamp",
  });
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  //  const reduxColors = styles(constThemeColor);
  return (
    <View style={{ flex: 1 }}>
      {props.header ? (
        <Header
          onPress={onPress}
          noIcon={false}
          back={back}
          marginLeft={marginLeft}
          deletes={true}
        />
      ) : null}
      {shiftHeader ? (
        <Animated.View
          style={{
            position: "absolute",
            left: "25%",
            right: "25%",
            height: 60,
            alignItems: "center",
            marginTop: -30,
            width: "50%",
            justifyContent: "center",
          }}
        >
          {props.title ? (
            <Animated.View
              style={{
                position: "absolute",
                bottom: headerTitleBottom,
                top: 50,
              }}
            >
              <Text
                style={{
                  fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
                  fontWeight: FontSize.Antz_Minor_Medium_title.fontWeight,
                  color: constThemeColor.neutralPrimary,
                }}
              >
                {props.title}
              </Text>
            </Animated.View>
          ) : null}
        </Animated.View>
      ) : null}

      <View
        style={{
          flex: 1,
          backgroundColor: constThemeColor.onPrimary,
        }}
      >
        <KeyboardAwareScrollView
          nestedScrollEnabled={true}
          scrollEventThrottle={16}
          onScroll={function (event) {
            let currentOffset = event.nativeEvent.contentOffset.y;
            let direction =
              currentOffset > heightPercentageToDP(10) ? true : false;
            setShiftHeader(direction);
            Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              {
                useNativeDriver: false,
              }
            );
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: constThemeColor.onPrimary,
              paddingHorizontal: Spacing.major,
            }}
          >
            <Text
              style={{
                fontSize: FontSize.Antz_Major_Regular.fontSize,
                fontWeight: FontSize.Antz_Major_Regular.fontWeight,
                color: constThemeColor.neutralPrimary,
              }}
            >
              {!shiftHeader ? props.title : null}
            </Text>
          </View>
          <View
            style={[
              styles.body,
              {
                backgroundColor: constThemeColor.onPrimary,
                paddingHorizontal: Spacing.major,
                paddingVertical: 0,
              },
            ]}
          >
            <View isRequired>{props.children}</View>
            {props.deletes ? null : (
              <View
                style={{
                  backgroundColor: constThemeColor.onPrimary,
                  paddingVertical: heightPercentageToDP(1.5),
                  paddingBottom: props.paddingBottom ? props.paddingBottom : 0,
                  marginBottom:props.margin_Bottom?props.margin_Bottom:0,
                }}
              >
                <SubmitBtn
                  isButtonDisabled={props?.isButtonDisabled}
                  onPress={onPress}
                  horizontalPadding={0}
                />
              </View>
            )}
            {props.isGroup ? (
              <View
                style={{
                  backgroundColor: constThemeColor.onPrimary,
                  paddingVertical: heightPercentageToDP(1.5),
                  paddingBottom: props.paddingBottom ? props.paddingBottom : 0,
                  marginBottom:props.margin_Bottom?props.margin_Bottom:0,
                }}
              >
                <SubmitBtn
                  isButtonDisabled={props?.isButtonDisabled}
                  onPress={onPress}
                  horizontalPadding={0}
                />
              </View>
            ):null}

            {props.deleteButton && (
              <DeleteBtn
                onPress={props.deleteButton}
                Title={props.deleteTitle}
                firstTitle={props.firstTitle}
              />
            )}
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default CustomForm;
