/**
 * @React Imports
 */
import React, { useMemo, useCallback } from "react";
import { View } from "react-native";

/**
 * @Redux Imports
 */
import { useSelector } from "react-redux";

/**
 * @Third Party Imports
 */
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";

const CustomBackdrop = ({ animatedIndex, style, onPress, clickFirstDown }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [1, 0],
      [0.5, 0],
      Extrapolate.CLAMP
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: constThemeColor.neutralPrimary,
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return (
    <Animated.View style={containerStyle}>
      <TouchableOpacity
        style={{
          height: "100%",
          backgroundColor: constThemeColor.neutralPrimary,
        }}
        onPress={clickFirstDown}
      ></TouchableOpacity>
    </Animated.View>
  );
};

const BottomSheetForOutSIdeClickClose = React.forwardRef((props, ref) => {
  // variables
  const snapPoints = useMemo(() => ["90%", "90%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {}, []);

  const clickFirstDown = () => {
    if (ref?.current) {
      ref?.current?.close();
    }
  };
  return (
    <BottomSheetModal
      enableOverDrag={true}
      ref={ref}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onDismiss={props?.onDismiss}
      style={props?.style}
      enableDismissOnClose
      backdropComponent={(props) => (
        <CustomBackdrop
          {...props}
          onPress={handleSheetChanges}
          clickFirstDown={clickFirstDown}
        />
      )}
    >
      <View>{props.children}</View>
    </BottomSheetModal>
  );
});

export default BottomSheetForOutSIdeClickClose;
