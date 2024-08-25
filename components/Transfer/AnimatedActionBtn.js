import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';

import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Spacing from '../../configs/Spacing';
import FontSize from '../../configs/FontSize';

const AnimatedActionBtn = ({
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
  const buttonHeight = 44;
  const buttonWidth = widthPercentageToDP(90);
  const buttonPadding = 10;
  const SWIPEABLE_DIMENSIONS = buttonHeight - 2 * buttonPadding;
  const H_WAVE_RANGE = SWIPEABLE_DIMENSIONS + 2 * buttonPadding;
  const H_SWIPE_RANGE = buttonWidth - 2 * buttonPadding - SWIPEABLE_DIMENSIONS;
  const style = animatedButton(themeColors);

  const InterpolateXInput = [0, H_SWIPE_RANGE]; /// array of input to provide interpolate function
  const X = useSharedValue(0);
  const [toggled, setToggled] = useState(false);

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
        style.containerButton,
        { ...containerStyle },
        {
          borderColor: borderColor
            ? borderColor
            : backgroundColor
            ? backgroundColor
            : themeColors.onPrimaryContainer,
          width: widthPercentageToDP(90),
          borderRadius: Spacing.body,
          paddingVertical: Spacing.minor,
          paddingHorizontal: Spacing.body,
          backgroundColor: backgroundColor
            ? backgroundColor
            : themeColors.onPrimaryContainer,
          // flexDirection: 'row',
          // alignItems: 'center',
          // justifyContent: 'space-between',
          marginVertical: Spacing.small,
        },
      ]}
    >
      <Animated.View
        style={[style.colorWave, AnimatedStyles.colorWave]}
      ></Animated.View>
      <PanGestureHandler onGestureEvent={animatedGestureHandler}>
        <Animated.View style={[style.swipeable, AnimatedStyles.swipeable]}>
          <MaterialIcons
            name={'double-arrow'}
            color={themeColors.onPrimary}
            size={iconSize ? iconSize : 24}
            style={{}}
          />
        </Animated.View>
      </PanGestureHandler>
      <Animated.Text
        style={[
          style.swipeText,
          AnimatedStyles.swipeText,
          {
            color: themeColors.onPrimary,
            fontSize: titleFontSize
              ? titleFontSize
              : FontSize.Antz_Body_Medium.fontSize,
            fontWeight: titleFontWeight
              ? titleFontWeight
              : FontSize.Antz_Body_Medium.fontWeight,
          },
          { ...textStyle },
        ]}
      >
        {title ? title : 'Status'}
      </Animated.Text>
    </View>
  );
};
export default AnimatedActionBtn;
const animatedButton = (reduxColors) =>
  StyleSheet.create({
    containerButton: {
      borderWidth: 1,
      height: 60,
      width: widthPercentageToDP(90),
      borderRadius: Spacing.body,
      paddingVertical: Spacing.minor,
      paddingHorizontal: Spacing.body,
      alignSelf: 'center',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'flex-end',
      marginVertical: Spacing.small,
      marginHorizontal: Spacing.body,
      backgroundColor: reduxColors.onPrimaryContainer,
    },
    swipeable: {
      height: 60,
      width: 24,
      position: 'absolute',
      left: Spacing.minor,
      zIndex: 2,
      justifyContent: 'center',
    },
    swipeText: {
      // fontSize: 18,
      // paddingLeft: 14,
      // fontWeight: 'bold',
      // color: '#fff',
      // zIndex: 2,
    },
    colorWave: {
      position: 'absolute',
      left: -1,
      height: 60,
      borderWidth: 1,
      borderColor: reduxColors.primary,
      width: widthPercentageToDP(90),
      borderRadius: Spacing.body,
      paddingVertical: Spacing.minor,
      paddingHorizontal: Spacing.body,
      alignSelf: 'center',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'space-between',
      backgroundColor: reduxColors.primary,
    },
  });
