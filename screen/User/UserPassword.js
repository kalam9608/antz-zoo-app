import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Platform,
} from "react-native";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { getDeviceInformation } from "../../utils/Utils";
import {
  EditStaff,
  ResetPass,
  manageDeviceLog,
} from "../../services/staffManagement/addPersonalDetails";
import Loader from "../../components/Loader";
import { setSignIn } from "../../redux/AuthSlice";
import { setSites } from "../../redux/SiteSlice";
import { saveAsyncData } from "../../utils/AsyncStorageHelper";
import { Image } from "react-native";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { useToast } from "../../configs/ToastConfig";

const UserPassword = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [oldPass, setOldPass] = useState("");
  const [NewPass, setNewPass] = useState("");
  const [ConfPass, setConfPass] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userDetails = props?.route?.params?.userDetails ?? {};
  const userAllData = props?.route?.params?.userAllData ?? {};
  const screen = props?.route?.params?.screen ?? false;
  const [anotherUserResetPass, setAnotherUserResetPass] = useState(
    props?.route?.params?.resetPassword ?? false
  );
  //   const [alertMessage, setAlertMessage] = useState("");
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  const validation = () => {
    setIsError({});
    setErrorMessage({});
    if (anotherUserResetPass == true) {
      if (NewPass.trim().length === 0) {
        setIsError({ NewPass: true });
        setErrorMessage({ NewPass: "Enter new password" });
        return false;
      } else if (ConfPass.trim().length === 0) {
        setIsError({ ConfPass: true });
        setErrorMessage({ ConfPass: "Confirm your password" });
        return false;
      } else if (NewPass != ConfPass) {
        setIsError({ ConfPass: true });
        setErrorMessage({ ConfPass: "Password not matched with new password" });
        return false;
      }
    } else {
      if (oldPass.trim().length === 0) {
        setIsError({ oldPass: true });
        setErrorMessage({ oldPass: "Enter your old password" });
        return false;
      } else if (NewPass.trim().length === 0) {
        setIsError({ NewPass: true });
        setErrorMessage({ NewPass: "Enter new password" });
        return false;
      } else if (ConfPass.trim().length === 0) {
        setIsError({ ConfPass: true });
        setErrorMessage({ ConfPass: "Confirm your password" });
        return false;
      } else if (NewPass != ConfPass) {
        setIsError({ ConfPass: true });
        setErrorMessage({ ConfPass: "Password not matched with new password" });
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    if (ConfPass.trim().length >= NewPass.trim().length) {
      if (NewPass != ConfPass) {
        setIsError({ ConfPass: true });
        setErrorMessage({ ConfPass: "Password not matched with new password" });
      } else {
        setIsError({ ConfPass: false });
      }
    }
  }, [ConfPass]);

  const confpasscheck = (text) => {
    setConfPass(text);
    setIsError({ ConfPass: false });
  };

  const onSubmit = () => {
    if (validation()) {
      var obj = {
        user_id: userDetails.user_id,
        old_password: oldPass,
        new_password: ConfPass,
      };
      setIsLoading(true);
      ResetPass(obj)
        .then((res) => {
          if (res.success === true) {
            setIsLoading(false);
            getDeviceDetails();
            // successDailog("SUCCESS!!", res.message, "OK", handleOK);
            successToast("success", res.message);
            handleOK();
          } else {
            setIsLoading(false);
            setIsError({ oldPass: true });
            setErrorMessage({
              oldPass: res.message,
            });
          }
        })
        .catch((err) => {
          errorToast("Oops!", JSON.stringify(err));
          setIsLoading(false);
        });
    }
  };

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const firstNameRef = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);

  const getDeviceDetails = async () => {
    const data = await getDeviceInformation();
    let obj = {
      user_id: userDetails?.user_id,
      user_name: userDetails?.user_name,
      zoo_id: zooID,
      type: "reset-password",
      device_details: data.device,
      lat: data.lat,
      long: data.long,
    };

    manageDeviceLog(obj)
      .then((res) => {})
      .catch((err) => errorToast("Oops!", "Something went wrong!!"));
  };

  const handleOK = () => {
    if (screen) {
      saveAsyncData("@antz_user_data", userAllData);
      dispatch(setSignIn(userAllData));
      dispatch(setSites(userAllData.user.zoos[0].sites));
    } else {
      navigation.goBack();
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: constThemeColor.onPrimary }}>
      <Loader visible={isLoading} />
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "transparent",
          alignItems: "center",
          marginHorizontal: Spacing.major,
          marginTop: 10,
        }}
      >
        {!screen ? (
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
            }}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={constThemeColor.neutralPrimary}
            />
          </TouchableOpacity>
        ) : null}

        <Text
          style={{
            fontSize: FontSize.Antz_Medium_Medium.fontSize,
            fontWeight: FontSize.Antz_Medium_Medium.fontWeight,
          }}
        >
          Reset Password
        </Text>
      </View>

      <CustomForm deletes={true}>
        <View
          style={{
            alignSelf: "center",
            marginTop: Spacing.minor,
            marginBottom: Spacing.major,
          }}
        >
          <Image
            source={require("../../assets/Antz_logo_color.png")}
            style={{ width: 124, height: 124 }}
            alt="loading..."
          />
        </View>
        {anotherUserResetPass == false && (
          <InputBox
            refs={firstNameRef}
            inputLabel={"Old Password"}
            placeholder={"Old Password"}
            right={false}
            autoCapitalize="none"
            onChange={(val) => {
              setIsError(false);
              setErrorMessage(false);
              setOldPass(val);
            }}
            //   onFocus={closeDesignation}
            value={oldPass}
            isError={isError.oldPass}
            errors={errorMessage.oldPass}
            //   onSubmitEditing={() => handleSubmitFocus(input2Ref)}
          />
        )}
        <InputBox
          refs={input2Ref}
          inputLabel={"New Password"}
          placeholder={"New Password"}
          secureText={true}
          autoCapitalize="none"
          onChange={(val) => {
            setIsError(false);
            setErrorMessage(false);
            setNewPass(val);
          }}
          value={NewPass}
          isError={isError.NewPass}
          errors={errorMessage.NewPass}
          //   onSubmitEditing={() => handleSubmitFocus(input3Ref)}
        />
        <InputBox
          refs={input3Ref}
          inputLabel={"Confirm Password"}
          placeholder={"Confirm Password"}
          // keyboardType={"password"}
          //   maxLength={NewPass.length}
          autoCapitalize="none"
          onChange={(val) => {
            setIsError(false);
            setErrorMessage(false);
            confpasscheck(val);
          }}
          //   edit={false}
          value={ConfPass}
          isError={isError.ConfPass}
          errors={errorMessage.ConfPass}
          //   onSubmitEditing={() => handleSubmitFocus(input4Ref)}
          //   onFocus={closeDesignation}
          //   renderRightIcon={true}
        />

        {screen ? (
          <TouchableOpacity
            style={{
              width: "100%",
              alignItems: "flex-end",
              marginVertical: Spacing.small,
            }}
            onPress={handleOK}
          >
            <Text
              style={{
                color: constThemeColor.secondary,
                fontSize: FontSize.Antz_Major_Title_btn.fontSize,
                fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
              }}
            >
              {"Skip "}
              <AntDesign
                name="arrowright"
                size={FontSize.Antz_Major_Title_btn.fontSize}
                color={constThemeColor.secondary}
              />
            </Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={() => onSubmit()}
          style={{
            width: "100%",
            backgroundColor: constThemeColor.onPrimaryContainer,
            marginTop: Spacing.minor,
            marginBottom: Spacing.small,
            height: 56,
            borderRadius: Spacing.mini,
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: FontSize.Antz_Major_Title_btn.fontSize,
              fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
              alignSelf: "center",
              color: constThemeColor.onPrimary,
            }}
          >
            Reset
          </Text>
        </TouchableOpacity>
      </CustomForm>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Spacing.small,
    paddingHorizontal: Spacing.small,
  },
});
export default UserPassword;
