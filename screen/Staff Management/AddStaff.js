import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  useWindowDimensions,
  Platform,
} from "react-native";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../components/Loader";
import { CountryPicker } from "react-native-country-codes-picker";
import Colors from "../../configs/Colors";
import Category from "../../components/DropDownBox";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import {
  getDesignation,
  getSection,
} from "../../services/staffManagement/getEducationType";
import {
  addStaff,
  emailExist,
} from "../../services/staffManagement/addPersonalDetails";
import { useSelector } from "react-redux";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { useToast } from "../../configs/ToastConfig";

const AddStaff = (props) => {
  const navigation = useNavigation();
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const [designation, setDesignation] = useState([]);
  const [id, setId] = useState(0);
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setmobile] = useState("");
  const [country, setcountry] = useState("");
  const [designationName, setdesignationName] = useState(null);
  const [designationId, setdesignationId] = useState("");
  const [isDesignationOpen, setisDesignationOpen] = useState(false);
  const [staffId, setstaffId] = useState("");

  const [show, setShow] = useState(false);
  const [email_exist, setemail_exist] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const { height, width } = useWindowDimensions();

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  // const dynamicStyles = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      getDesignation()
        .then((res) => {
          let getdata = res.map((item) => {
            return {
              id: item.designation_id,
              name: item.designation_name,
            };
          });
          setDesignation(getdata);
          setIsLoading(false);
          {
            /*Closing all auto complete for favor of IOS modal By Biswanath Nath 24.04.2023
          setTimeout(() => {
            firstNameRef.current.focus();
          }, 1000);*/
          }
        })
        .catch((error) => {
          errorToast("error","Oops! Something went wrong!!");
          setIsLoading(false);
        });
    });
    return unsubscribe;
  }, [navigation]);

  const catPressed = (item) => {
    setdesignationName(item.map((u) => u.name).join(", "));
    setdesignationId(item.map((id) => id.id));
    setisDesignationOpen(!isDesignationOpen);
    {
      /*Closing all auto complete for favor of IOS modal By Biswanath Nath 24.04.2023
  handleSubmitFocus(input7Ref);*/
    }
  };
  //Validating email from server side
  const checkEmail = (email) => {
    setemail(email);
    setIsError({});
    let user_id = 0;
    if (parseInt(id) > 0) {
      user_id = id;
    }
    if (email.length > 10) {
      emailExist({ email })
        .then((res) => {
          setemail_exist(!res.success);
          if (!res.success) {
            setIsError({ email: true });
            setErrorMessage({ email: res.message });
          }
        })
        .catch((err) => errorToast("error","Oops! omething went wrong!!"));
    } else {
      setemail_exist(true);
      setIsError({ email: true });
      setErrorMessage({ email: "Enter a valid email" });
    }
  };

  const validation = () => {
    setIsError({});
    let mobileRegx = /^\d{10}$/;
    let emailRegx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (first_name.trim().length === 0) {
      setIsError({ first_name: true });
      setErrorMessage({ first_name: "This field required" });
      return false;
    } else if (last_name.trim().length === 0) {
      setIsError({ last_name: true });
      setErrorMessage({ last_name: "This field required" });
      return false;
    } else if (email.trim().length === 0) {
      setIsError({ email: true });
      setErrorMessage({ email: "This field required" });
      return false;
    } else if (!emailRegx.test(email)) {
      setIsError({ email: true });
      setErrorMessage({ email: "Enter a valid email" });
      return false;
    } else if (email_exist) {
      setIsError({ email: true });
      setErrorMessage({ email: "User already exists with this email id" });
      return false;
    } else if (password.trim().length === 0) {
      setIsError({ password: true });
      setErrorMessage({ password: "This field required" });
      return false;
    } else if (countryCode.trim().length === 0) {
      setIsError({ countryCode: true });
      setErrorMessage({ countryCode: "This field required" });
      return false;
    } else if (mobile.trim().length === 0) {
      setIsError({ mobile: true });
      setErrorMessage({ mobile: "This field required" });
      return false;
    } else if (!mobileRegx.test(mobile)) {
      setIsError({ mobile: true });
      setErrorMessage({ mobile: "Enter a valid mobile no." });
      return false;
    }
    //  else if (country.trim().length === 0) {
    // 	setIsError({ country: true })
    // 	setErrorMessage({ country: "This field required" })
    // 	return false
    // }
    // else if (designationName === null) {
    // 	setIsError({ designationName: true })
    // 	setErrorMessage({ designationName: "This field required" })
    // 	return false
    // }
    else if (staffId.trim().length === 0) {
      setIsError({ staffId: true });
      setErrorMessage({ staffId: "This field required" });
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (validation()) {
      var obj = {
        first_name: first_name,
        last_name: last_name,
        user_type: "staff",
        email: email,
        password: password,
        phone_no: mobile,
        country: country,
        country_code: countryCode,
        designation: designationName,
        staff_id: staffId,
        zoo_id: zooID,
      };
      setIsLoading(true);
      addStaff(obj)
        .then((res) => {
          if (res.success == true) {
            alert("Staff Added!!");
            navigation.replace("UserDetails", {
              user_id: res.data.user_id,
            });
          } else if (Object.keys(res.message)[0] == "email") {
            setIsError({ email: true });
            setErrorMessage({ email: Object.values(res.message)[0] });
          } else {
            setIsError({ staffId: true });
            setErrorMessage({ staffId: res.message });
          }
        })
        .catch((err) => {
          errorToast("error","Oops! Something went wrong!!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const firstNameRef = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const countryCodeRef = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);
  const input7Ref = useRef(null);
  const handleSubmitFocus = (refs) => {
    {
      /*Closing all auto complete for favor of IOS modal By Biswanath Nath 24.04.2023
      if (refs.current) {
      refs.current.blur();
        refs.current.focus();
    }*/
    }
  };

  //Reason for creating this is by default one is not working for only mobile field If made any modification
  // In that case others were getting affected to
  // Created By: Biswanath Nath
  // Date: 11.04.2023
  const handleMobileInputFocus = (refs) => {
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    setTimeout(() => {
      if (refs.current) {
        refs.current.focus();
      }
    }, 1500);*/
    }
  };

  const firstDropdownopen = (refs) => {
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    handleSubmitFocus(countryCodeRef);*/
    }
    setShow(true);
  };
  const secondDropDownOpen = () => {
    setisDesignationOpen(true);
  };

  const closeDesignation = () => {
    setisDesignationOpen(false);
  };
  const CountryCodeopen = () => {
    setShow(true);
  };

  const CountCode = (item) => {
    setCountryCode(item.dial_code);
    setShow(false);
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: isSwitchOn ? "#1F415B" : "#DAE7DF" }}
    >
      <Loader visible={isLoading} />
      <CustomForm
        header={true}
        title={"User Form"}
        onPress={onSubmit}
        marginBottom={50}
      >
        <InputBox
          refs={firstNameRef}
          inputLabel={"First Name*"}
          placeholder={"First Name*"}
          onChange={(val) => {
            setfirst_name(val);
          }}
          onFocus={closeDesignation}
          value={first_name}
          isError={isError.first_name}
          errors={errorMessage.first_name}
          onSubmitEditing={() => handleSubmitFocus(input2Ref)}
        />
        <InputBox
          refs={input2Ref}
          inputLabel={"Last Name*"}
          placeholder={"Last Name*"}
          onChange={(val) => {
            setlast_name(val);
          }}
          onFocus={closeDesignation}
          value={last_name}
          isError={isError.last_name}
          errors={errorMessage.last_name}
          onSubmitEditing={() => handleSubmitFocus(input3Ref)}
        />
        <InputBox
          refs={input3Ref}
          inputLabel={"Email Address*"}
          placeholder={"Email Address*"}
          keyboardType={"email-address"}
          onChange={(val) => {
            checkEmail(val);
          }}
          value={email}
          isError={isError.email}
          errors={errorMessage.email}
          onSubmitEditing={() => handleSubmitFocus(input4Ref)}
          onFocus={closeDesignation}
          renderRightIcon={true}
          right={() => {
            return email.length > 5 ? (
              email_exist ? (
                <Entypo name="cross" size={24} color="red" />
              ) : (
                <Ionicons name="checkmark-done" size={24} color="green" />
              )
            ) : (
              <></>
            );
          }}
        />
        <InputBox
          refs={input4Ref}
          inputLabel={"Password"}
          placeholder={"Password"}
          onChange={(val) => {
            setpassword(val);
          }}
          onFocus={closeDesignation}
          value={password}
          isError={isError.password}
          errors={errorMessage.password}
          // onSubmitEditing={() => firstDropdownopen()}
        />
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View style={{ width: "35%" }}>
            <InputBox
              inputLabel={"Country"}
              placeholder={"Country Code"}
              editable={false}
              rightElement={show ? "menu-up" : "menu-down"}
              DropDown={() => {
                setShow(true);
              }}
              value={countryCode}
              onFocus={() => {
                setShow(true);
              }}
              isError={isError.countryCode}
              errors={errorMessage.countryCode}
            />
          </View>
          <View
            style={{
              width: "60%",
            }}
          >
            <InputBox
              refs={input5Ref}
              inputLabel={"Mobile"}
              placeholder={"Mobile"}
              keyboardType={"numeric"}
              maxLength={10}
              onChange={(val) => {
                setmobile(val);
              }}
              value={mobile}
              isError={isError.mobile}
              onFocus={closeDesignation}
              errors={errorMessage.mobile}
              onSubmitEditing={() => handleSubmitFocus(input6Ref)}
            />
          </View>
        </View>

        <InputBox
          inputLabel={"Designation"}
          placeholder="Designation"
          editable={false}
          value={designationName}
          isError={isError.designationName}
          onFocus={closeDesignation}
          errors={errorMessage.designationName}
          rightElement={isDesignationOpen ? "menu-up" : "menu-down"}
          DropDown={() => {
            setisDesignationOpen(!isDesignationOpen);
          }}
        />
        <InputBox
          refs={input7Ref}
          inputLabel={"Staff Id"}
          placeholder={"Staff Id"}
          keyboardType={"numeric"}
          maxLength={9}
          onChange={
            (val) => setstaffId(val)
            // checkStaff(val)
          }
          closeDesignation
          onFocus={closeDesignation}
          value={staffId}
          isError={isError.staffId}
          errors={errorMessage.staffId}
        />
      </CustomForm>

      {/* <View style={{ flex: 1, backgroundColor: "#fff" }}>
				<Category
					categoryData={designation}
					onCatPress={catPressed}
					heading={"Choose Designation"}
					onClose={() => setisDesignationOpen(!isDesignationOpen)}
				/>
			</View> */}
      {isDesignationOpen ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={isDesignationOpen}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={() => setisDesignationOpen(!isDesignationOpen)}
          >
            <Category
              categoryData={designation}
              onCatPress={catPressed}
              heading={"Choose Designation"}
              isMulti={false}
              onClose={() => setisDesignationOpen(!isDesignationOpen)}
            />
          </Modal>
        </View>
      ) : null}

      <CountryPicker
        show={show}
        style={{
          // Styles for whole modal [View]
          modal: {
            height: 300,
          },
        }}
        onBackdropPress={() => setShow(false)}
        // when picker button press you will get the country object with dial code
        pickerButtonOnPress={(item) => {
          setCountryCode(item.dial_code);
          setShow(!show);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
});

export default AddStaff;
