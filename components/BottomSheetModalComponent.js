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

const CustomBackdrop = ({ animatedIndex, style, onPress }) => {
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

  return <Animated.View style={containerStyle} />;
};

const BottomSheetModalComponent = React.forwardRef((props, ref) => {
  // variables
  const snapPoints = useMemo(() => ["90%", "90%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => { }, []);

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
        <CustomBackdrop {...props} onPress={handleSheetChanges} />
      )}
    >
      <View>{props.children}</View>
    </BottomSheetModal>
  );
});

export default BottomSheetModalComponent;
