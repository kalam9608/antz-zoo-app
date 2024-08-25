import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";

import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";

const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcons);

const ActionBtn = ({
  iconSize,
  titleFontSize,
  titleFontWeight,
  onPress,
  title,
  backgroundColor,
  borderColor,
  containerStyle,
  textStyle,
}) => {
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const buttonHeight = 48; /// this defines the length of green background of animation
  const buttonWidth = widthPercentageToDP(80);
  const buttonPadding = Spacing.minor;
  const SWIPEABLE_DIMENSIONS = buttonHeight - 2 * buttonPadding;
  const H_WAVE_RANGE = SWIPEABLE_DIMENSIONS + 2 * buttonPadding;
  const H_SWIPE_RANGE = buttonWidth - 2 * buttonPadding - SWIPEABLE_DIMENSIONS;
  const style = animatedButton(themeColors);

  const InterpolateXInput = [0, H_SWIPE_RANGE]; /// array of input to provide interpolate function
  const X = useSharedValue(0);
  const IconX = useSharedValue(0);
  const [toggled, setToggled] = useState(false);
  const OFFSET = 4;
  const TIME = 800;
  const DELAY = 200;
  const shakeAnimation = withDelay(
    DELAY,
    withSequence(
      // start from -OFFSET
      withTiming(-OFFSET, { duration: TIME / 2 }),
      // shake between -OFFSET and OFFSET infinite times
      withRepeat(withTiming(OFFSET, { duration: TIME }), -1, true),
      // go back to 0 at the end
      withTiming(0, { duration: TIME / 2 })
    )
  );

  useEffect(() => {
    IconX.value = shakeAnimation;
  }, []);

  const handleComplete = (isToggled) => {
    if (isToggled == true && toggled == false) {
      setToggled(isToggled);
      onPress();
      setTimeout(() => {
        X.value = withSpring(0);
        setToggled(false);
      }, 1000);
    }
  };
  useEffect(() => {
    return () => {
      clearTimeout();
    };
  }, []);

  const animatedGestureHandler = useAnimatedGestureHandler({
    onActive: (e, ctx) => {
      const newValue = e.translationX;

      if (ctx.completed) {
        newValue = H_SWIPE_RANGE + e.translationX;
      } else {
        newValue = e.translationX;
      }

      if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
        X.value = e.translationX;
      }
    },

    onStart: (_, ctx) => {
      ctx.completed = toggled;
    },
    onEnd: () => {
      if (X.value < buttonWidth / 2 - SWIPEABLE_DIMENSIONS / 2) {
        X.value = withSpring(0);
        runOnJS(handleComplete)(false);
      } else if (X.value > buttonWidth / 2 - SWIPEABLE_DIMENSIONS / 2) {
        X.value = withSpring(H_SWIPE_RANGE);
        runOnJS(handleComplete)(true);
      }
    },
  });

  const AnimatedStyles = {
    iconShake: useAnimatedStyle(() => {
      return { transform: [{ translateX: IconX.value }] };
    }),

    swipeable: useAnimatedStyle(() => {
      const opacity = interpolate(
        X.value,
        [0, H_SWIPE_RANGE],
        [1, 0],
        Extrapolate.CLAMP
      );
      return {
        opacity,
        transform: [{ translateX: X.value }],
      };
    }),
    colorWave: useAnimatedStyle(() => {
      return {
        width: H_WAVE_RANGE + X.value,
        opacity: interpolate(X.value, InterpolateXInput, [0, 1]),
      };
    }),
  };

  return (
    <View
      style={[
        {
          borderColor: borderColor
            ? borderColor
            : backgroundColor
            ? backgroundColor
            : themeColors.onPrimaryContainer,
          width: widthPercentageToDP(80),
          borderRadius: Spacing.body,
          paddingHorizontal: Spacing.body,
          backgroundColor: backgroundColor
            ? backgroundColor
            : themeColors.onPrimaryContainer,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: Spacing.small,
        },
        style.containerButton,
        { ...containerStyle },
      ]}
    >
      <Animated.View
        style={[style.colorWave, AnimatedStyles.colorWave]}
      ></Animated.View>
      <PanGestureHandler onGestureEvent={animatedGestureHandler}>
        <Animated.View style={[style.swipeable, AnimatedStyles.swipeable]}>
          <AnimatedIcon
            name={"double-arrow"}
            color={themeColors.onPrimary}
            size={iconSize ? iconSize : 28}
            style={[AnimatedStyles.iconShake,{paddingLeft: 8}]}
          />
          {/* <LottieView
            ref={animationRef}
            autoSize
            style={{
              width: 60,
              height: 60,
            }}
            autoPlay
            // duration={3000}
            source={require("../../assets/arrow_animation.json")}
          /> */}
        </Animated.View>
      </PanGestureHandler>
      <Animated.Text
        style={[
          {
            color: themeColors.onPrimary,
            fontSize: titleFontSize
              ? titleFontSize
              : FontSize.Antz_Medium_Medium.fontSize,
            fontWeight: titleFontWeight
              ? titleFontWeight
              : FontSize.Antz_Major_Medium.fontWeight,
          },
          style.swipeText,
          AnimatedStyles.swipeText,
          { ...textStyle },
        ]}
      >
        {title ? title : "Status"}
      </Animated.Text>
    </View>
  );
};
export default ActionBtn;
const animatedButton = (reduxColors) =>
  StyleSheet.create({
    containerButton: {
      borderWidth: 1,
      height: 56,
      width: widthPercentageToDP(85),
      borderRadius: 50,
      // paddingVertical: Spacing.minor,
      paddingHorizontal: Spacing.body,
      alignSelf: "center",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      alignContent: "center",
      justifyContent: "flex-end",
      marginVertical: Spacing.small,
      marginHorizontal: Spacing.body,
      backgroundColor: reduxColors.onPrimaryContainer,
    },
    swipeable: {
      height: 45,
      width: 45,
      position: "absolute",
      left: Spacing.small-2,
      zIndex: 2,
      backgroundColor: reduxColors.primary,
      justifyContent: "center",
      borderRadius:  50
    },
    swipeText: {
      paddingRight: Spacing.body,
      color: '#fff',
      zIndex: 2,
    },
    colorWave: {
      position: "absolute",
      left: -1,
      height: 56,
      borderWidth: 1,
      borderColor: reduxColors.primary,
      width: widthPercentageToDP(90),
      borderRadius: 50,
      paddingVertical: Spacing.minor,
      paddingHorizontal: Spacing.body,
      alignSelf: "center",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      alignContent: "center",
      justifyContent: "space-between",
      backgroundColor: reduxColors.primary,
    },
  });