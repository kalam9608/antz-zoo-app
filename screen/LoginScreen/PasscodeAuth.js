import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
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
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { clearAsyncData } from "../../utils/AsyncStorageHelper";
import { setPassCode, setSignOut } from "../../redux/AuthSlice";
import Loader from "../../components/Loader";
import { errorToast } from "../../utils/Alert";
import FontSize from "../../configs/FontSize";
import { useToast } from "../../configs/ToastConfig";
import { getDeviceData, getDeviceInformation } from "../../utils/Utils";
const CELL_COUNT = 4;

const PasscodeAuth = () => {
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
    userDetails.isPasscodeExist ?? false
  );
  //  userDetails.isPasscodeExist??
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [showPassword1, setShowPassword1] = useState(true);

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
  const { showToast } = useToast();
  useEffect(() => {
    if (!showSingle) {
      if (PassCode.length == 4) {
        setStep(2);
        if (ref1.current) {
          ref1.current.focus();
        }
      } else {
        ref.current.focus();
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
        setError("Passcode mismatch");
        setConfPass("");
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
        } else {
          // alert("Enter valid passcode");
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
      })
      .catch(() =>
        showToast("error", "Something went wrong!, Please try again!!")
      )
      .finally(() => setIsLoading(false));
  };

  const handleButtonPress = (value) => {
    setInputValue(inputValue + value);
  };

  return (
    <View style={styles.root}>
      <Loader visible={isLoading} />
      <KeyboardAwareScrollView>
        <View
          style={{
            alignItems: "center",
            marginBottom: "10%",
            marginTop: "10%",
          }}
        >
          <Image
            source={require("../../assets/icon.png")}
            style={{ width: 150, height: 150 }}
            alt="loading..."
          />

          <Text
            style={{
              fontSize: widthPercentageToDP(10),
              marginTop: heightPercentageToDP(1),
              fontWeight: "300",
              color: "#1F415B",
            }}
          >
            {showSingle ? "Enter Passcode" : "Generate Passcode"}
          </Text>
        </View>
        {!showSingle ? (
          <View>
            {step === 1 && (
              <>
                <Text
                  style={{
                    textAlign: "left",
                    fontSize: widthPercentageToDP(5),
                    marginTop: heightPercentageToDP(7),
                    marginBottom: heightPercentageToDP(2),
                    color: "#1F415B",
                    fontWeight: "400",
                  }}
                >
                  New Passcode
                </Text>
                <CodeField
                  ref={ref}
                  {...passCodeProps}
                  // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                  value={PassCode}
                  onChangeText={(e) => handleInputChange1(e)}
                  cellCount={CELL_COUNT}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  autoFocus={true}
                  renderCell={({ index, symbol, isFocused }) => (
                    <TextInput
                      key={index}
                      style={[
                        error !== "" ? styles.cellConf : styles.cell,
                        isFocused && styles.focusCell,
                      ]}
                      onLayout={getPassCodeCellOnLayoutHandler(index)}
                    >
                      {showPassword ? (
                        PassCode.length > index ? (
                          "*"
                        ) : isFocused ? (
                          <Cursor />
                        ) : null
                      ) : (
                        symbol || (isFocused ? <Cursor /> : null)
                      )}
                    </TextInput>
                  )}
                />
              </>
            )}
            {step === 2 && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: heightPercentageToDP(7),
                  }}
                >
                  <Text style={error !== "" ? styles.title2 : styles.title1}>
                    Confirm Passcode
                  </Text>
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={{ marginLeft: widthPercentageToDP("15%") }}
                  >
                    <Ionicons
                      name={showPassword1 ? "eye-off-outline" : "eye-outline"}
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
                <CodeField
                  ref={ref1}
                  {...confPassProps}
                  // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                  value={ConfPass}
                  onChangeText={(e) => handleInputChange2(e)}
                  cellCount={CELL_COUNT}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  autoFocus={true}
                  renderCell={({ index, symbol, isFocused }) => (
                    <TextInput
                      key={index}
                      style={[
                        error !== "" ? styles.cellConf : styles.cell,
                        isFocused && styles.focusCell,
                      ]}
                      onLayout={getConfPassCellOnLayoutHandler(index)}
                    >
                      {showPassword1 ? (
                        ConfPass.length > index ? (
                          "*"
                        ) : isFocused ? (
                          <Cursor />
                        ) : null
                      ) : (
                        symbol || (isFocused ? <Cursor /> : null)
                      )}
                    </TextInput>
                  )}
                />
              </>
            )}
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                color: "red",
                marginTop: 5,
                alignSelf: "center",
              }}
            >
              {error}
            </Text>
          </View>
        ) : null}

        {showSingle ? (
          <View style={{ marginTop: heightPercentageToDP(2) }}>
            {/* <Text
              style={{
                textAlign:"left",
                fontSize:error!==""?widthPercentageToDP(7): widthPercentageToDP(6),
                fontWeight:"400",
                marginTop: heightPercentageToDP(7),
                color:error!==""?"red":"#1F415B",
              }}
            >
              Enter Passcode
            </Text> */}
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={{ alignSelf: "flex-end" }}
            >
              <Ionicons
                name={showPassword1 ? "eye-off-outline" : "eye-outline"}
                size={25}
                color="black"
              />
            </TouchableOpacity>
            <CodeField
              ref={ref2}
              {...checkPassProps}
              // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
              value={CheckPass}
              onChangeText={(e) => handleInputChange(e)}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoFocus={true}
              renderCell={({ index, symbol, isFocused }) => (
                <TextInput
                  key={index}
                  style={[
                    error !== "" ? styles.cellConf : styles.cell,
                    isFocused && styles.focusCell,
                  ]}
                  onLayout={getCheckPassCellOnLayoutHandler(index)}
                >
                  {showPassword1 ? (
                    CheckPass.length > index ? (
                      "*"
                    ) : isFocused ? (
                      <Cursor />
                    ) : null
                  ) : (
                    symbol || (isFocused ? <Cursor /> : null)
                  )}
                </TextInput>
              )}
            />
            <Text
              style={{
                fontSize: widthPercentageToDP(4),
                color: "red",
                marginTop: 5,
                alignSelf: "center",
              }}
            >
              {error}
            </Text>
          </View>
        ) : null}
      </KeyboardAwareScrollView>
      {/* <View>
      <TextInput
        value={inputValue}
        onChangeText={setInputValue}
        keyboardType="numeric"
      />
      <View style={styles.keyboardContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('1')}>
          <Text style={styles.buttonText}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('2')}>
          <Text style={styles.buttonText}>2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('3')}>
          <Text style={styles.buttonText}>3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('4')}>
          <Text style={styles.buttonText}>4</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('5')}>
          <Text style={styles.buttonText}>5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('6')}>
          <Text style={styles.buttonText}>6</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('7')}>
          <Text style={styles.buttonText}>7</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('8')}>
          <Text style={styles.buttonText}>8</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('9')}>
          <Text style={styles.buttonText}>9</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('0')}>
          <Text style={styles.buttonText}>0</Text>
        </TouchableOpacity>
      </View>
      </View> */}
      <View
        style={{
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <AntDesign name="logout" size={24} color="red" />
        <Text
          onPress={gotoLogout}
          style={{
            marginLeft: 6,
            fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
            color: "red",
          }}
        >
          Logout
        </Text>
      </View>
      <View></View>
    </View>
  );
};

export default PasscodeAuth;
const styles = StyleSheet.create({
  root: { flex: 1, margin: widthPercentageToDP(5) },

  // title: {textAlign: 'center', fontSize:widthPercentageToDP(5),marginTop:heightPercentageToDP(7)},
  title1: {
    textAlign: "center",
    fontSize: widthPercentageToDP(5),
    color: "#1F415B",
    fontWeight: "400",
    marginBottom: heightPercentageToDP(2),
  },
  title2: {
    textAlign: "center",
    fontSize: widthPercentageToDP(5),
    fontWeight: "400",
    color: "red",
    marginBottom: heightPercentageToDP(2),
  },
  codeFieldRoot: { marginTop: heightPercentageToDP(1) },
  cell: {
    width: widthPercentageToDP(12),
    height: heightPercentageToDP(6),
    fontSize: heightPercentageToDP(3),
    borderWidth: widthPercentageToDP(0.4),
    borderRadius: widthPercentageToDP(2),
    borderColor: "#1F415B",
    textAlign: "center",
  },
  cellConf: {
    width: widthPercentageToDP(12),
    height: heightPercentageToDP(6),
    fontSize: heightPercentageToDP(3),
    borderWidth: widthPercentageToDP(0.4),

    borderRadius: widthPercentageToDP(2),
    borderColor: "red",
    textAlign: "center",
  },
  focusCell: {
    borderColor: "green",
  },
  //
  keyboardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 1,
  },
  button: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    fontSize: FontSize.Antz_Medium_Medium.fontSize,
  },
});
