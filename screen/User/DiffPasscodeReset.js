import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  Dimensions,
  AppState,
  Keyboard,
} from "react-native";
import { TextInput } from "react-native";
import { Image } from "react-native";
import { Text, StyleSheet } from "react-native";
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../../components/Loader";
import { useRef } from "react";
import FontSize from "../../configs/FontSize";
import { Platform } from "react-native";
import {
  resetPasscode,
  resetPasscodeForDiffUser,
} from "../../services/staffManagement/addPersonalDetails";
import { setPassCode } from "../../redux/AuthSlice";
import { useToast } from "../../configs/ToastConfig";
const CELL_COUNT = 4;

const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;

let appWidth = width;

if (aspectRatio > 1.6) {
  appWidth = "100%";
} else {
  appWidth = "80%";
}

const DiffPasscodeReset = (props) => {
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const passcode = useSelector((state) => state.UserAuth.passcode);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  //   const userDetails = useSelector((state) => state.UserAuth.userDetails);
  const [userDetails, setUserdetails] = useState(
    props?.route?.params?.userDetails ?? {}
  );
  const [anotherUserResetPass, setAnotherUserResetPass] = useState(
    props?.route?.params?.resetPasscode ?? false
  );

  const [step, setStep] = useState(1);
  const [PassCode, setPasscode] = useState("");
  const [ConfPass, setConfPass] = useState("");
  const [CheckPass, setCheckPass] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(true);
  const ref3 = useRef();
  const ref = useBlurOnFulfill({ PassCode, cellCount: CELL_COUNT });
  const ref1 = useBlurOnFulfill({ ConfPass, cellCount: CELL_COUNT });
  const ref2 = useBlurOnFulfill({ CheckPass, cellCount: CELL_COUNT });
  const [passCodeProps, getPassCodeCellOnLayoutHandler] = useClearByFocusCell({
    value: PassCode,
    setValue: setPasscode,
  });
  const [confPassProps, getConfPassCellOnLayoutHandler] = useClearByFocusCell({
    value: ConfPass,
    setValue: setConfPass,
  });
  const [checkPassProps, getCheckPassCellOnLayoutHandler] = useClearByFocusCell(
    {
      value: CheckPass,
      setValue: setCheckPass,
    }
  );
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  // for keyboard opening issue ->shifted on another apk from floaing window and after some time again opens the zoo app then keyboard has been opened.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
      }

      if (nextAppState === "background" || nextAppState === "inactive") {
        if (Platform.OS === "ios") {
          Keyboard.dismiss();
        } else if (Platform.OS === "android") {
          Keyboard.dismiss();
        }
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });
    return () => {
      subscription.remove();
    };
  }, []);
  // for keyboard opening issue ->shifted on another apk from floaing window and after some time again opens the zoo app then keyboard has been opened.

  useEffect(() => {
    const dismissKeyboard = () => {
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Keyboard.dismiss();
      }
    };

    // Call dismissKeyboard when the component is mounted
    dismissKeyboard();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        dismissKeyboard();
      }

      if (nextAppState === "background" || nextAppState === "inactive") {
        dismissKeyboard();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const button = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0"];

  useEffect(() => {
    if (ConfPass.length) {
      setError({ ConfPass: "" });
    }
    setTimeout(() => {
      if (ConfPass.length == 4) {
        setStep(2);
      }
    }, 500);
  }, [ConfPass]);
  useEffect(() => {
    if (CheckPass.length) {
      setError({ CheckPass: "" });
    }
    if (CheckPass.length === 4) {
      if (CheckPass == ConfPass) {
        setTimeout(() => {
          onPassCheck();
          console.log("CheckPass and ConfPass are same");
        }, 500);
      } else {
        setTimeout(() => {
          setCheckPass("");
          setError({ CheckPass: "Passcode Mismatch" });
        }, 500);
      }
    }
  }, [CheckPass]);

  const onPassCheck = () => {
    var obj = {
      user_id: userDetails.user_id,
      old_passcode: "",
      new_passcode: CheckPass,
    };
    setIsLoading(true);
    resetPasscodeForDiffUser(obj)
      .then((res) => {
        if (res.success == true) {
          setError({
            PassCode: "",
            ConfPass: "",
            CheckPass: "",
          });
          successToast("success", res?.message);

          setError({
            PassCode: "",
            ConfPass: "",
            CheckPass: "",
          });
          navigation.goBack();
          setIsLoading(false);
        } else {
          errorToast(
            "error",
            res?.message?.new_passcode ?? "Something went wrong!!"
          );
        }
      })
      .catch((err) => {
        console.log(err);
        errorToast("error", "Oops! Something went wrong!!");
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
        setCheckPass("");
      });
  };

  const gotoReset = () => {
    setError({
      PassCode: "",
      ConfPass: "",
      CheckPass: "",
    });
    setPasscode("");
    setCheckPass("");
    setConfPass("");
    setStep(1);
  };

  const handleButtonPress = (value) => {
    if (step == 1) {
      if (ConfPass.length <= 3) {
        setConfPass(ConfPass + value);
      }
    } else if (step == 2) {
      if (CheckPass.length <= 3) {
        setCheckPass(CheckPass + value);
      }
    }
  };

  const handleFieldClick = () => {
    if (step == 1) {
      if (ConfPass.length > 0) {
        let updatedPassCode = ConfPass.slice(0, ConfPass.trim().length - 1);
        setConfPass(updatedPassCode);
      }
    } else if (step == 2) {
      let updatedPassCode = CheckPass.slice(0, CheckPass.trim().length - 1);
      setCheckPass(updatedPassCode);
    }
  };

  return (
    <View style={dynamicStyles.rootContainer}>
      <Ionicons
        name="arrow-back"
        size={30}
        color={constThemeColor.onPrimary}
        style={{ marginTop: 5, marginLeft: 5 }}
        onPress={() => navigation.goBack()}
      />
      <View style={dynamicStyles.root}>
        <Loader visible={isLoading} />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              alignItems: "center",
              marginTop: 70,
              marginBottom: 30,
            }}
          >
            <Image
              source={require("../../assets/Antz_logo_color.png")}
              style={{
                width: 106,
                height: 114,
                alignSelf: "center",
              }}
              alt="loading..."
            />

            <Text
              style={{
                marginTop: 30,
                fontSize: FontSize.Antz_Major_Medium.fontSize,
                fontWeight: FontSize.Antz_Major_Medium.fontWeight,
                color: constThemeColor.onTertiary,
              }}
            >
              {step == 1 ? "Enter 4 digit new passcode" : "Confirm Passcode"}
            </Text>
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                color: constThemeColor.onTertiary,
                marginTop: 10,
              }}
            >
              {userDetails.user_first_name + " " + userDetails.user_last_name}
            </Text>

            <View
              style={{
                marginTop: 20,
              }}
            >
              {step === 1 && (
                <View
                // style={{
                //   flexDirection: "row",
                //   justifyContent: "space-between",
                // }}
                >
                  <CodeField
                    ref={ref1}
                    {...confPassProps}
                    value={ConfPass}
                    onChangeText={(e) => handleButtonPress}
                    cellCount={CELL_COUNT}
                    rootStyle={dynamicStyles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    autoFocus={true}
                    showSoftInputOnFocus={false}
                    renderCell={({ index, symbol, isFocused }) => (
                      <TextInput
                        key={index}
                        style={[
                          error !== ""
                            ? dynamicStyles.cellConf
                            : dynamicStyles.cell,
                          isFocused && dynamicStyles.focusCell,
                          ConfPass.length > index && {
                            backgroundColor: constThemeColor.primaryContainer,
                          },
                        ]}
                        onLayout={getPassCodeCellOnLayoutHandler(index)}
                        editable={false}
                      >
                        {showPassword
                          ? ConfPass.length > index
                            ? ""
                            : isFocused
                            ? ""
                            : null
                          : symbol || (isFocused ? "" : null)}
                      </TextInput>
                    )}
                  />
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Minor_Medium.fontSize,
                      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                      color: constThemeColor.tertiary,
                      marginTop: 20,
                      alignSelf: "center",
                    }}
                  >
                    {error?.ConfPass}
                  </Text>
                </View>
              )}

              {step === 2 && (
                <View
                // style={{
                //   flexDirection: "row",
                //   justifyContent: "space-between",
                // }}
                >
                  <CodeField
                    ref={ref2}
                    {...checkPassProps}
                    value={CheckPass}
                    onChangeText={(e) => handleButtonPress}
                    cellCount={CELL_COUNT}
                    rootStyle={dynamicStyles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    autoFocus={true}
                    showSoftInputOnFocus={false}
                    renderCell={({ index, symbol, isFocused }) => (
                      <TextInput
                        key={index}
                        style={[
                          error !== ""
                            ? dynamicStyles.cellConf
                            : dynamicStyles.cell,
                          isFocused && dynamicStyles.focusCell,
                          CheckPass.length > index && {
                            backgroundColor: constThemeColor.primaryContainer,
                          },
                        ]}
                        onLayout={getPassCodeCellOnLayoutHandler(index)}
                        editable={false}
                      >
                        {showPassword
                          ? CheckPass.length > index
                            ? ""
                            : isFocused
                            ? ""
                            : // ""
                              null
                          : symbol || (isFocused ? "" : null)}
                      </TextInput>
                    )}
                  />
                  <View
                    style={{
                      height: 20,
                      marginBottom: heightPercentageToDP(2),
                      marginTop: heightPercentageToDP(1),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: FontSize.Antz_Minor_Medium.fontSize,
                        fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                        color: constThemeColor.tertiary,
                        textAlign: "center",
                      }}
                    >
                      {error?.CheckPass}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={dynamicStyles.keyboardContainer}>
          {button.map((i) => {
            return i == "" ? (
              <TouchableOpacity
                onPress={gotoReset}
                style={dynamicStyles.button1}
                key={i}
              >
                <MaterialCommunityIcons
                  name="lock-reset"
                  size={24}
                  color={constThemeColor.tertiary}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={i}
                style={dynamicStyles.button}
                onPress={() => handleButtonPress(i)}
              >
                <Text style={dynamicStyles.buttonText}>{i}</Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={dynamicStyles.button}
            onPress={() => handleFieldClick()}
          >
            <Ionicons
              name="backspace-outline"
              size={25}
              color={constThemeColor.onTertiary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DiffPasscodeReset;
const styles = (DarkModeReducer) =>
  StyleSheet.create({
    rootContainer: {
      flex: 1,
      backgroundColor: DarkModeReducer.onSecondaryContainer,
    },
    root: {
      flex: 1,
      width: appWidth,
      justifyContent: "space-between",
      alignSelf: "center",
    },
    codeFieldRoot: {
      width: widthPercentageToDP("50%"),
      alignSelf: "center",
    },
    cell: {
      width: 26,
      height: 26,
      fontSize: FontSize.Antz_Major_Medium.fontSize,
      fontWeight: FontSize.Antz_Major_Medium.fontWeight,
      borderWidth: 2,
      borderRadius: 13,
      borderColor: DarkModeReducer.primaryContainer,
      textAlign: "center",
    },
    cellConf: {
      width: 26,
      height: 26,
      fontSize: FontSize.Antz_Major_Medium.fontSize,
      fontWeight: FontSize.Antz_Major_Medium.fontWeight,
      borderWidth: 2,
      borderRadius: 13,
      borderColor: DarkModeReducer.primaryContainer,
      textAlign: "center",
    },
    focusCell: {
      borderColor: DarkModeReducer.secondary,
    },
    keyboardContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      backgroundColor: DarkModeReducer.onSecondaryContainer,
      justifyContent: "space-around",
      width: "100%",
      marginTop: 5,
      height: 320,
    },
    button: {
      width: "25%",
      height: "20%",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
      margin: 5,
    },
    button1: {
      width: "25%",
      height: "20%",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      borderRadius: 5,
      margin: 5,
    },
    buttonText: {
      fontSize: FontSize.Antz_Major_Medium.fontSize,
      fontWeight: FontSize.Antz_Major_Medium.fontWeight,
      color: DarkModeReducer.onTertiary,
    },
  });
