import { StyleSheet, TouchableOpacity } from "react-native";
import { Bubble } from "react-native-gifted-chat";
import { useSelector } from "react-redux";

const RenderBubble = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const { currentMessage } = props;

  return (
    <>
      {/* <TouchableOpacity
        style={{ width:'98%'}}
        onLongPress={() => props.onLongPress(props.context, props.currentMessage)}
      > */}
        <Bubble
          {...props}
          renderTime={() => {
            return null;
          }}
          wrapperStyle={{
            right: {
              backgroundColor: currentMessage?.isSelected ? constThemeColor?.lightBlack : constThemeColor?.primary,
              borderTopRightRadius: 15,
              borderBottomRightRadius: 15,
            },
            left: {
              backgroundColor: currentMessage?.isSelected ? constThemeColor?.lightBlack : constThemeColor?.lightGrey,
              borderTopLeftRadius: 15,
              borderBottomLeftRadius: 15,
            },
          }}
          containerStyle={{
            left: {
              // backgroundColor: currentMessage?.isSelected
              //   ? constThemeColor?.lightBlack
              //   : null,
              marginVertical: 3,
              borderTopLeftRadius: 15,
              borderBottomLeftRadius: currentMessage?.isSelected ? 15 : null,
            },
            right: {
              // backgroundColor: currentMessage?.isSelected
              //   ? constThemeColor?.lightBlack
              //   : null,
              marginVertical: 3,
              borderTopRightRadius: 15,
              borderBottomRightRadius: currentMessage?.isSelected ? 15 : null,
              width: "100%",
            },
          }}
          containerToPreviousStyle={{
            right: { borderTopRightRadius: 15 },
            left: { borderTopLeftRadius: 15 },
          }}
          containerToNextStyle={{
            right: { borderTopRightRadius: 15 },
            left: { borderTopLeftRadius: 15 },
          }}
          textStyle={{
            right: {
              color: constThemeColor?.onPrimary,
            },
          }}
        />
      {/* </TouchableOpacity> */}
    </>
  );
};

const style = (reduxColors) => StyleSheet.create({});

export default RenderBubble;
