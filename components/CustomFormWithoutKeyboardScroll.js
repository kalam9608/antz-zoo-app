import { View, Text, ScrollView, SafeAreaView, Animated } from "react-native";
import React, { useState } from "react";
import styles from "../configs/Styles";
import Header from "./Header";
import { useSelector } from "react-redux";
import { heightPercentageToDP } from "react-native-responsive-screen";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import SubmitBtn from "./SubmitBtn";
import DeleteBtn from "./DeleteBtn";

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 70;
const TITLE_MIN_HEIGHT = 40;
const CustomFormWithoutKeyboardScroll = ({ onPress, ...props }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);

  const [scrollY] = useState(new Animated.Value(0));
  const [shiftHeader, setShiftHeader] = useState(false);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerZindex = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT, 120],
    outputRange: [0, 0, 1000],
    extrapolate: "clamp",
  });

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

  return (
    <View style={{ flex: 1 }}>
      {props.header ? (
        <Header onPress={onPress} noIcon={false} deletes={true} />
      ) : null}
      {shiftHeader ? (
        <Animated.View
          style={{
            position: "absolute",
            top: -20,
            left: 0,
            right: 0,
            height: 60,
            alignItems: "center",
            marginTop: -20,
          }}
        >
          {props.title ? (
            <Animated.View
              style={{
                position: "absolute",
                bottom: headerTitleBottom,
                top: 60,
              }}
            >
              <Text
                style={{
                  fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
                  fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                }}
              >
                {props.title}
              </Text>
            </Animated.View>
          ) : null}
        </Animated.View>
      ) : null}

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: constThemeColor.onPrimary,
        }}
        scrollEventThrottle={16}
        onScroll={function (event) {
          let currentOffset = event.nativeEvent.contentOffset.y;
          let direction =
            currentOffset > heightPercentageToDP(15) ? true : false;
          setShiftHeader(direction);
          Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          });
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ backgroundColor: "white" }}>
          <Text
            style={{
              fontSize: FontSize.Antz_Major_Title.fontSize,
              paddingHorizontal: Spacing.major,
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
              paddingTop: 3,
            },
          ]}
        >
          <View isRequired>{props.children}</View>
        </View>
      </ScrollView>
      {props.deletes ? null : (
        <View
          style={{
            backgroundColor: constThemeColor.onPrimary,
            paddingVertical: heightPercentageToDP(1.5),
          }}
        >
          <SubmitBtn onPress={onPress} />
        </View>
      )}
      {props.deleteButton && (
        <View
          style={{
            backgroundColor: constThemeColor.onPrimary,
            paddingHorizontal: Spacing.minor,
            paddingVertical: 0,
          }}
        >
          <DeleteBtn
            onPress={props.deleteButton}
            Title={props.deleteTitle}
            firstTitle={props.firstTitle}
          />
        </View>
      )}
    </View>
  );
};

export default CustomFormWithoutKeyboardScroll;
