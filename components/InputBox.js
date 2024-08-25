//Update Native Base to Native Paper by - Anirban Pan
//Date - 10-03-2023
//Docs - follow the link "https://callstack.github.io/react-native-paper/4.0/text-input.html#error"

import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { TextInput, Text } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useState, useEffect } from "react";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { View } from "react-native-animatable";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";

const InputBox = ({
  mode,
  inputLabel,
  placeholder,
  onChange,
  value,
  defaultValue,
  edit = true,
  rightElement,
  rightElementToNavigate,
  multiline,
  leftElement,
  numberOfLines,
  style,
  isError,
  errors,
  onPress,
  disabled,
  DropDown,
  onFocus,
  menuFocus,
  pointerEvents,
  autoFocus,
  refs,
  onSubmitEditing,
  maxLength,
  secureText,
  placeholderTextColor,
  Necropcy,
  handleBlur,
  autoCapitalize,
  ...props
}) => {
  const [isActive, setIsActive] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [dropDown, setDropDown] = useState(true);
  // const [keyboardStatus, setKeyboardStatus] = useState("");

  const handleIconDropDown = () => {
    if (edit) {
      setDropDown(!dropDown);
      DropDown(true);
    }
  };

  const onExtendedFocus = () => {
    setIsActive(true);
    if (onFocus) {
      onFocus(true);
    }
  };

  const onExtendedBlur = () => {
    setIsActive(false);
    if (handleBlur) {
      handleBlur();
    }
  };

  let propsCustom = {
    mode: mode === undefined || mode === "" ? "outlined" : mode,
    inputLabel:
      inputLabel === undefined || inputLabel === "" ? "Label" : inputLabel,
    placeholder:
      placeholder === undefined || placeholder === ""
        ? "Placeholder"
        : placeholder,
    onChange: onChange === undefined ? () => {} : onChange,
    multiline: multiline === undefined || multiline === "" ? false : multiline,
    numberOfLines:
      numberOfLines === undefined || numberOfLines === "" ? 5 : numberOfLines,
    style: style === undefined || style === "" ? styles.inputContainer : style,
  };
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  //  const reduxColors = styles(constThemeColor);
  // const [borderColor, setBorderColor] = React.useState('transparent');
  // const handleTextChange = (value) => {
  //   setBorderColor(value ? 'transparent' : 'red');
  // };

  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        // onPress={rightElement ? handleIconDropDown : onFocus}
        onPress={rightElement ? handleIconDropDown : onFocus}
      >
        <View pointerEvents={rightElement ? "none" : "auto"}>
          <TextInput
            autoCapitalize={autoCapitalize}
            autoFocus={autoFocus}
            editable={edit ?? true}
            maxLength={maxLength}
            ref={refs}
            onSubmitEditing={onSubmitEditing}
            mode={propsCustom.mode}
            label={propsCustom.inputLabel}
            secureTextEntry={
              inputLabel == "Password" ? passwordShow : secureText
            }
            style={[
              propsCustom.style,
              {
                backgroundColor:
                  isActive == false && (value || Necropcy)
                    ? constThemeColor.displaybgPrimary
                    : isActive
                    ? constThemeColor.onPrimary
                    : constThemeColor.surface,
                // borderColor: value ? "red" : "transparent",
                // borderWidth: 1,
              },
            ]}
            placeholderTextColor={placeholderTextColor}
            // onFocus={rightElement ? handleIconDropDown : onFocus}
            // onBlur={handleBlur}
            onFocus={rightElement ? handleIconDropDown : onExtendedFocus}
            onBlur={onExtendedBlur}
            pointerEvents={pointerEvents}
            placeholder={propsCustom.placeholder}
            onChangeText={propsCustom.onChange}
            multiline={propsCustom.multiline}
            keyboardType={props.keyboardType}
            value={value}
            defaultValue={defaultValue}
            numberOfLines={propsCustom.numberOfLines}
            disabled={disabled}
            outlineColor={isError ? constThemeColor.error : null}
            outlineStyle={{ borderWidth: value || Necropcy ? 1 : 1 }} // Necropcy:-this is for Add Necropsy select organs input value
            activeOutlineColor={isError ? constThemeColor.error : null}
            showSoftInputOnFocus={rightElement ? false : true}
            caretHidden={rightElement ? true : false}
            right={
              inputLabel == "Password" ? (
                <TextInput.Icon
                  icon={(props) => (
                    <Pressable onPress={() => setPasswordShow(!passwordShow)}>
                      <MaterialCommunityIcons
                        {...props}
                        name={passwordShow ? "eye-off" : "eye"}
                        size={25}
                        style={{ color: "gray" }}
                      />
                    </Pressable>
                  )}
                />
              ) : props.renderRightIcon ? (
                <TextInput.Icon
                  // icon={rightElement}
                  icon={props.right}
                  // onPress={() => handleIconDropDown()}
                  // onSubmitEditing={onSubmitEditing}
                />
              ) : rightElement ? (
                <TextInput.Icon
                  icon={rightElement}
                  onPress={handleIconDropDown}
                />
              ) :rightElementToNavigate ? (
                <TextInput.Icon
                  icon={rightElementToNavigate}
                  // onPress={handleIconDropDown}
                />
              ) : null
            }
            left={
              props.left ? (
                <TextInput.Icon
                  marginLeft={widthPercentageToDP(1)}
                  size={widthPercentageToDP(10)}
                  // backgroundColor={"white"}
                  icon={() => props.left}
                />
              ) : null
            }
          />
        </View>
      </TouchableOpacity>
      {props.helpText && !errors ? (
        <Text
          style={{
            marginLeft: 5,
            marginTop: -6,
            fontSize: FontSize.Antz_Subtext_Regular.fontSize,
          }}
        >
          {props.helpText}
        </Text>
      ) : null}
      {isError ? (
        <Text
          style={{
            color: constThemeColor.error,
            marginLeft: 5,
            marginTop: -3,
            fontSize: FontSize.Antz_Subtext_Regular.fontSize,
          }}
        >
          {errors}
        </Text>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    position: "relative",
    zIndex: 0,
    marginVertical: 8,
    textAlign: "auto",
  },
});

export default InputBox;
