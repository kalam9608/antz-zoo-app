import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, TextInput } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { ScrollView, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { signin } from "../../services/AuthService";
import { saveAsyncData } from "../../utils/AsyncStorageHelper";
import ButtonLoader from "../../components/ButtonLoader";
import ButtonCom from "../../components/ButtonCom";
import { useNavigation } from "@react-navigation/native";
import { setSignIn } from "../../redux/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { setSites } from "../../redux/SiteSlice";
import { TouchableOpacity } from "react-native";
import { manageDeviceLog } from "../../services/staffManagement/addPersonalDetails";
import FontSize from "../../configs/FontSize";
import {
  getDeviceToken,
  getDeviceInformation,
  getDeviceData,
} from "../../utils/Utils";
import { errorToast, successDailog } from "../../utils/Alert";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import { setModulesLab } from "../../redux/accessLabSlice";
import { setPharmacyData } from "../../redux/PharmacyAccessSlice";
import Spacing from "../../configs/Spacing";

const LoginScreen = () => {
  const [show, setShow] = React.useState(false);
  const [isLoading, setLoding] = React.useState(false);
  const [user_id, setUser_id] = React.useState(null);
  const [response, setResponse] = React.useState(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [isVisible, setIsVisible] = React.useState(false);
  const { showToast } = useToast();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  const [loginData, setLoginData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };
  const firstButtonPress = () => {
    navigation.replace("UserPassword", {
      userAllData: loginData,
      userDetails: loginData.user,
      screen: true,
    });
    alertModalClose();
  };
  const secondButtonPress = () => {
    alertModalClose();
    saveAsyncData("@antz_user_data", loginData);
    dispatch(setSignIn(loginData));
    dispatch(setSites(loginData.user.zoos[0].sites));
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      }).start();
    });
    return unsubscribe;
  }, [fadeAnim]);

  const login = () => {
    setErrorMessage(false);
    if (validation()) {
      setLoding(true);
      getDeviceData().then((DeviceDataRes) => {
        if (DeviceDataRes) {
          let obj = {
            email: email,
            password: password,
            device_details: DeviceDataRes,
          };
          signin(obj)
            .then((res) => {
              if (!res?.success) {
                setLoding(false);
                setErrorMessage({ api: res?.message });
                return;
              }
              saveAsyncData(
                "@antz_user_device_token",
                DeviceDataRes.device_token
              );
              saveAsyncData("@antz_user_token", res.token);
              saveAsyncData("@antz_max_upload_sizes", res?.settings);
              getDeviceDetails(res?.user, res?.user?.zoos[0]?.zoo_id);
              if (res.login_count > 0) {
                saveAsyncData("@antz_user_data", res);
                dispatch(setSignIn(res));
                dispatch(setSites(res.user.zoos[0].sites));
                dispatch(setModulesLab(res?.modules?.lab_data));
                dispatch(setPharmacyData(res?.modules?.pharmacy_data));
              } else {
                setLoginData(res);
                alertModalOpen();
              }
              setLoding(false);
            })
            .catch((err) => {
              setLoding(false);
              console.log("err", err);
              showToast(
                "error",
                "You don't have any zoo access right now, Please try again later!!"
              );
            });
        }
      });
    }
  };
  const validation = () => {
    if (email == "") {
      setErrorMessage({ email: "Please enter your Email" });
      return false;
    } else if (password == "") {
      setErrorMessage({ password: "Please enter your Password" });
      return false;
    }
    return true;
  };

  const getDeviceDetails = async (userDetails, zooID) => {
    const data = await getDeviceInformation();
    let obj = {
      user_id: userDetails?.user_id,
      user_name: userDetails?.user_name,
      zoo_id: zooID,
      type: "login",
      device_details: data.device,
      lat: data.lat,
      long: data.long,
    };

    manageDeviceLog(obj)
      .then((res) => {})
      .catch((err) => {});
  };
  const passwordRef = useRef(null);

  const handleEmailChange = (refs) => {
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    if (refs.current) {
      refs.current.focus();
    }*/
    }
  };

  return (
    <Animated.View // Special animatable View
      style={{
        // ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {/* <ScrollView
        style={{
          backgroundColor: constThemeColor.surfaceVariant,
          height: "100%",
        }}
      > */}
      <KeyboardAwareScrollView
        style={{
          backgroundColor: constThemeColor.surfaceVariant,
          height: "100%",
        }}
      >
        <View
          style={{
            alignItems: "center",
            // marginBottom: "10%",
            // marginTop: "10%",
            marginTop: 70,
            marginBottom: 40,
          }}
        >
          <Image
            source={require("../../assets/icon.png")}
            style={{ width: 150, height: 150 }}
            alt="loading..."
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: FontSize.Antz_Extra_Large,
              fontWeight: FontSize.weight300,
              color: constThemeColor.onSecondaryContainer,
            }}
          >
            Login
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <TextInput
            style={{
              marginTop: 60,
              width: "80%",
              backgroundColor: constThemeColor.surfaceVariant,
              textAlign: "auto",
            }}
            editable={isLoading ? false : true}
            label="Username/Email"
            accessible={true}
            accessibilityLabel={"email"}
            accessibilityId="tvEmail"
            textColor={constThemeColor.cardLebel}
            autoCapitalize="none"
            mode="outlined"
            keyboardType="email-address"
            onChangeText={(text) => {
              setErrorMessage(false);
              setEmail(text);
            }}
            error={errorMessage?.email ? true : false}
            onSubmitEditing={() => handleEmailChange(passwordRef)}
            left={
              <TextInput.Icon
                icon={(props) => (
                  <FontAwesome
                    {...props}
                    name="user-circle-o"
                    size={20}
                    color={constThemeColor.onSurfaceVariant}
                  />
                )}
              />
            }
          />
          {errorMessage.email ? (
            <View style={{ width: "78%" }}>
              <Text
                style={{
                  color: constThemeColor.error,
                  alignSelf: "flex-start",
                }}
              >
                {errorMessage?.email}
              </Text>
            </View>
          ) : null}
          <TextInput
            style={{
              marginTop: 30,
              width: "80%",
              backgroundColor: constThemeColor.surfaceVariant,
              textAlign: "auto",
            }}
            editable={isLoading ? false : true}
            mode="outlined"
            label="Password"
            accessibilityLabel="Password"
            accessibilityId="tvPassword"
            textColor={constThemeColor.cardLebel}
            ref={passwordRef}
            autoCapitalize="none"
            onChangeText={(text) => {
              setErrorMessage(false);
              setPassword(text);
            }}
            onSubmitEditing={login}
            keyboardType="default"
            error={errorMessage?.password ? true : false}
            secureTextEntry={show}
            right={
              <TextInput.Icon
                icon={(props) => (
                  <Pressable onPress={() => setShow(!show)}>
                    <MaterialIcons
                      {...props}
                      name={show ? "visibility-off" : "visibility"}
                      style={constThemeColor.onSecondaryContainer}
                    />
                  </Pressable>
                )}
              />
            }
            left={
              <TextInput.Icon
                icon={(props) => (
                  <MaterialCommunityIcons
                    {...props}
                    name="key"
                    size={25}
                    style={constThemeColor.onSurfaceVariant}
                  />
                )}
              />
            }
          />
          {errorMessage.password ? (
            <View style={{ width: "78%" }}>
              <Text
                style={{
                  color: constThemeColor.error,
                  alignSelf: "flex-start",
                }}
              >
                {errorMessage?.password}
              </Text>
            </View>
          ) : null}

          {/* <View style={{ alignItems: "flex-end", width: "80%" }}>
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                // height:40,
                // lineHeight:40,
                paddingTop: 10,
                fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                color: constThemeColor.onSecondaryContainer,
                textAlign: "right",
              }}
            >
              Forgot password?
            </Text>
          </View> */}
          {errorMessage?.api ? (
            <View
              style={{
                marginVertical: Spacing.small,
                width: "80%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={dynamicStyles.errorText}>{errorMessage?.api}</Text>
            </View>
          ) : null}
          <ButtonCom
            title={isLoading ? <ButtonLoader loaderColor="white" /> : "Login"}
            accessible={true}
            accessibilityLabel="Login"
            accessibilityId="btnLogin"
            buttonStyle={{
              width: "80%",
              alignSelf: "center",
              borderRadius: 5,
              backgroundColor: constThemeColor.primary,
              height: 55,
              marginTop: 5,
              // bottom: "10%",
              marginTop: 24,
            }}
            textStyle={{
              color: "white",
              fontWeight: FontSize.Antz_Medium_Medium_btn.fontWeight,
              fontSize: FontSize.Antz_Medium_Medium_btn.fontSize,
            }}
            onPress={isLoading ? null : login}
          />
          {/* <View style={dynamicStyles.registerCont}>
            <Text style={{ color: constThemeColor.onSecondaryContainer }}>
              Don’t have an account?
            </Text>
            <TouchableOpacity activeOpacity={1}>
              <Text style={dynamicStyles.register}>Register</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </KeyboardAwareScrollView>
      {/* </ScrollView> */}
      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.SUCCESS_TYPE}
        title={"Successfully Login"}
        subTitle={"Want to reset your password?"}
        closeModal={alertModalClose}
        firstButtonHandle={firstButtonPress}
        secondButtonHandle={secondButtonPress}
        firstButtonText={"Yes"}
        secondButtonText={"No"}
        firstButtonStyle={{
          backgroundColor: constThemeColor.error,
          borderWidth: 0,
        }}
        firstButtonTextStyle={{ color: constThemeColor.onPrimary }}
        secondButtonStyle={{
          backgroundColor: constThemeColor.surfaceVariant,
          borderWidth: 0,
        }}
      />
    </Animated.View>
  );
};

export default LoginScreen;

const styles = (DarkModeReducer) =>
  StyleSheet.create({
    inputContainer: {
      width: "100%",
    },
    errorText: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      color: DarkModeReducer.error,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      textAlign: "center",
    },
    imageContainer: {
      alignItems: "center",
    },
    registerCont: {
      alignItems: "center",
      // marginTop: "7%",
      marginTop: 40,
    },
    register: {
      color: DarkModeReducer.primary,
      fontWeight: FontSize.Antz_Minor_Medium_title.fontWeight,
      fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
      marginTop: 5,
    },
  });
