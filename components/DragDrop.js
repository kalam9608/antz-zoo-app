import React from "react";
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
const DragDrop = ({
    children,
    onDrag,
    onDrop
}) => {
    const x = useSharedValue(0);
    const y = useSharedValue(0);

    const drag = useAnimatedGestureHandler({
        onStart: (_, context) => {
            context.x = x.value;
            context.y = y.value;
        },
        onActive: (event, context) => {
            x.value = event.translationX + context.x;
            y.value = event.translationY + context.y;
            if (onDrag) {
                runOnJS(onDrag)(x.value, y.value);
            }
        },
        onEnd: (event) => {
            if (onDrop) {
                runOnJS(onDrop)(event.absoluteX, event.absoluteY);
            }
        }
    });

    return (
        <PanGestureHandler onGestureEvent={drag}>
            <Animated.View style={[
                { zIndex: 2 },
                useAnimatedStyle(() => {
                    return {
                        transform: [
                            { translateX: x.value },
                            { translateY: y.value }
                        ]
                    }
                })
            ]}>
                {children}
            </Animated.View>
        </PanGestureHandler>
    );
};

export default DragDrop;