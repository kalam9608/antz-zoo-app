import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Pressable,
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
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {
  Generatepasscode,
  checkPasscode,
  manageDeviceLog,
} from "../../services/staffManagement/addPersonalDetails";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { clearAsyncData } from "../../utils/AsyncStorageHelper";
import { setPassCode, setSignOut } from "../../redux/AuthSlice";
import Loader from "../../components/Loader";
import { log } from "react-native-reanimated";
import { useRef } from "react";
import FontSize from "../../configs/FontSize";
import { Platform } from "react-native";
import { useToast } from "../../configs/ToastConfig";
import Spacing from "../../configs/Spacing";
import { getDeviceData, getDeviceInformation } from "../../utils/Utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CELL_COUNT = 4;

const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;

let appWidth = width;

if (aspectRatio > 1.6) {
  appWidth = "100%";
} else {
  appWidth = "80%";
}

const PassCode = () => {
  const [inputValue, setInputValue] = useState("");

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.UserAuth.userDetails);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [step, setStep] = useState(1);
  const [PassCode, setPasscode] = useState("");
  const [ConfPass, setConfPass] = useState("");
  const [CheckPass, setCheckPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSingle, setShowsingle] = useState(
    userDetails?.isPasscodeExist ?? false
  );
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  //  userDetails.isPasscodeExist??
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [showPassword1, setShowPassword1] = useState(true);
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
  const { showToast } = useToast();
  // for keyboard opening issue ->shifted on another apk from floaing window and after some time again opens the zoo app then keyboard has been opened.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState == "active"
      ) {
        Keyboard.dismiss();
      }

      if (nextAppState == "background" || nextAppState == "inactive") {
        if (Platform.OS == "ios") {
          Keyboard.dismiss();
        } else if (Platform.OS == "android") {
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
    if (!showSingle) {
      if (PassCode.length == 4) {
        setTimeout(() => {
          setStep(2);
          // if (ref1.current) {
          // ref1.current.focus();
          // }
        }, 500);
      } else {
        // ref.current.focus();
      }
    }
  }, [PassCode, ConfPass]);

  useEffect(() => {
    if (ConfPass.length > 0) {
      setError("");
    }
    if (PassCode.length === 4 && ConfPass.length === 4) {
      if (PassCode === ConfPass) {
        setError("");
        onSubmit();
      } else {
        setTimeout(() => {
          setError("Passcode mismatch");
          setConfPass("");
        }, 500);
      }
    }
  }, [PassCode, ConfPass]);

  useEffect(() => {
    if (CheckPass.length > 0) {
      setError("");
    }
    if (CheckPass.length === 4) {
      setError("");
      onPassCheck();
    }
  }, [CheckPass]);

  const togglePasswordVisibility = () => {
    setShowPassword1((prevState) => !prevState);
  };

  const handleInputChange = (input) => {
    const pattern = /^\d*$/;
    if (pattern.test(input)) {
      setCheckPass(input);
    }
  };
  const handleInputChange1 = (input) => {
    const pattern = /^\d*$/;
    if (pattern.test(input)) {
      setPasscode(input);
    }
  };
  const handleInputChange2 = (input) => {
    const pattern = /^\d*$/;
    if (pattern.test(input)) {
      setConfPass(input);
    }
  };
  const getBackGroundNotificationTouched = async () => {
    try {
      const isPressed = await AsyncStorage.getItem("isBackNotificationPressed");
      const screenName = await AsyncStorage.getItem(
        "notificationPressedScreenName"
      );
      if (isPressed == "true") {
        await AsyncStorage.removeItem("isBackNotificationPressed");
        const screenParams = await AsyncStorage.getItem(
          "notificationPressedScreenParams"
        );

        await AsyncStorage.removeItem("notificationPressedScreenName");
        await AsyncStorage.removeItem("notificationPressedScreenParams");
        if (screenName !== null && screenParams !== null) {
          navigation.navigate(JSON.parse(screenName), JSON.parse(screenParams));
        } else if (screenName == "animal_movement") {
          navigation.navigate("ApprovalTask");
        }
      }
    } catch (error) {
      console.log("notification not pressed..", error);
    }
  };
  const onPassCheck = () => {
    var obj = {
      pass_code: CheckPass,
    };
    setIsLoading(true);
    checkPasscode(obj)
      .then((res) => {
        if (res.success == true) {
          setError("");
          dispatch(setPassCode(CheckPass));
          getBackGroundNotificationTouched();
        } else {
          setError("Passcode mismatch");
        }
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
        showToast("error", "Oops! Something went wrong!!");
      })
      .finally(() => {
        setIsLoading(false);
        setCheckPass("");
      });
  };

  const onSubmit = () => {
    var obj = {
      pass_code: ConfPass,
    };
    setIsLoading(true);
    Generatepasscode(obj)
      .then((res) => {
        if (res.success == true) {
          dispatch(setPassCode(ConfPass));
        }
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
        showToast("error", "Oops! Something went wrong!!");
      })
      .finally(() => {
        setIsLoading(false);
        setPasscode("");
        setConfPass("");
      });
  };

  const gotoLogout = async () => {
    setIsLoading(true);
    const data = await getDeviceInformation();
    let obj = {
      user_id: userDetails?.user_id,
      user_name: userDetails?.user_name,
      zoo_id: zooID,
      type: "logout",
      device_details: data.device,
      device_id: data.device_id,
      lat: data.lat,
      long: data.long,
    };
    manageDeviceLog(obj)
      .then((token) => {
        clearAsyncData("@antz_user_device_token");
        clearAsyncData("@antz_user_data");
        clearAsyncData("@antz_user_token");
        clearAsyncData("@antz_selected_site");
        dispatch(setSignOut());
        dispatch(setPassCode(null));
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        showToast("error", "Something went wrong!, Please try again!!");
      })
      .finally(() => setIsLoading(false));
  };
  const handleButtonPress = (value) => {
    if (!showSingle) {
      if (step == 1) {
        if (PassCode.length <= 3) {
          setPasscode(PassCode + value);
        }
      } else {
        if (ConfPass.length <= 3) {
          setConfPass(ConfPass + value);
        }
      }
    } else {
      if (CheckPass.length <= 3) {
        setCheckPass(CheckPass + value);
      }
    }
  };

  const handleFieldClick = () => {
    if (!showSingle) {
      if (step == 1) {
        if (PassCode.length > 0) {
          let updatedPassCode = PassCode.slice(0, PassCode.trim().length - 1);
          setPasscode(updatedPassCode);
        }
      } else {
        if (ConfPass.length > 0) {
          let updatedPassCode = ConfPass.slice(0, ConfPass.length - 1);
          setConfPass(updatedPassCode);
        }
      }
    } else {
      if (CheckPass.length > 0) {
        let updatedPassCode = CheckPass.slice(0, CheckPass.length - 1);
        setCheckPass(updatedPassCode);
      }
    }
  };

  return (
    <View style={dynamicStyles.rootContainer}>
      <View
        style={{
          alignItems: "flex-end",
          paddingTop: Spacing.major + Spacing.major,
          paddingRight: Spacing.major,
        }}
      >
        <TouchableOpacity onPress={gotoLogout}>
          <AntDesign name="logout" size={22} color={constThemeColor.tertiary} />
        </TouchableOpacity>
      </View>
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
              {!showSingle && step === 1
                ? "New Passcode"
                : step == 2
                ? "Confirm Passcode"
                : "Enter 4 digit passcode"}
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

            {!showSingle ? (
              <View
                style={{
                  marginTop: 25,
                }}
              >
                {step === 1 && (
                  <>
                    <CodeField
                      ref={ref}
                      {...passCodeProps}
                      value={PassCode}
                      onChangeText={(e) => handleButtonPress}
                      cellCount={CELL_COUNT}
                      rootStyle={dynamicStyles.codeFieldRoot}
                      keyboardType="number-pad"
                      textContentType="oneTimeCode"
                      autoFocus={false}
                      showSoftInputOnFocus={false}
                      renderCell={({ index, symbol, isFocused }) => (
                        <TextInput
                          key={index}
                          autoFocus={false}
                          style={[
                            error !== ""
                              ? dynamicStyles.cellConf
                              : dynamicStyles.cell,
                            isFocused && dynamicStyles.focusCell,
                            PassCode.length > index && {
                              backgroundColor: constThemeColor.primaryContainer,
                            },
                          ]}
                          onLayout={getPassCodeCellOnLayoutHandler(index)}
                          editable={false}
                        >
                          {showPassword
                            ? PassCode.length > index
                              ? ""
                              : isFocused
                              ? ""
                              : null
                            : symbol || (isFocused ? "" : null)}
                        </TextInput>
                      )}
                    />
                  </>
                )}
                {step === 2 && (
                  <>
                    <View
                      style={{
                        marginTop: 5,
                      }}
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
                        autoFocus={false}
                        showSoftInputOnFocus={false}
                        renderCell={({ index, symbol, isFocused }) => (
                          <TextInput
                            key={index}
                            autoFocus={false}
                            style={[
                              error !== ""
                                ? dynamicStyles.cellConf
                                : dynamicStyles.cell,
                              isFocused && dynamicStyles.focusCell,
                              ConfPass.length > index && {
                                backgroundColor:
                                  constThemeColor.primaryContainer,
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
                    </View>
                  </>
                )}
                <View
                  style={{ height: 100, margin: heightPercentageToDP(1.4) }}
                >
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Minor_Medium.fontSize,
                      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                      color: constThemeColor.tertiary,
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </Text>
                </View>
              </View>
            ) : null}

            {showSingle ? (
              <View
                style={{
                  marginTop: 25,
                }}
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
                  autoFocus={false}
                  showSoftInputOnFocus={false}
                  renderCell={({ index, symbol, isFocused }) => (
                    <TextInput
                      key={index}
                      autoFocus={false}
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
                <View style={{ height: 100, margin: heightPercentageToDP(1) }}>
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Minor_Medium.fontSize,
                      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                      color: constThemeColor.tertiary,
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>

        <View style={dynamicStyles.keyboardContainer}>
          {button.map((i) => {
            return i == "" ? (
              <View
                // onPress={gotoLogout}
                style={dynamicStyles.button1}
                key={i}
              >
                {/* <AntDesign
                  name="logout"
                  size={22}
                  color={constThemeColor.tertiary}
                /> */}
              </View>
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

export default PassCode;
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
