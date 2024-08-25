import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  useWindowDimensions,
  Platform,
  Alert,
  BackHandler,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../components/Loader";
import { CountryPicker } from "react-native-country-codes-picker";
import Colors from "../../configs/Colors";
import Category from "../../components/DropDownBox";
import {
  AntDesign,
  Entypo,
  Foundation,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  getDesignation,
  getSection,
} from "../../services/staffManagement/getEducationType";
import {
  SuggestUsername,
  addStaff,
  emailExist,
  mobileExist,
} from "../../services/staffManagement/addPersonalDetails";
import { useSelector } from "react-redux";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import DatePicker from "../../components/DatePicker";
import RBSheet from "react-native-raw-bottom-sheet";
import { Image } from "react-native";
import Flag from "react-native-flags";
import * as allFlatFlags32 from "react-native-flags/flags/flat/32";
import { ActivityIndicator, TextInput } from "react-native-paper";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import { getFileData, getTextWithoutExtraSpaces } from "../../utils/Utils";
import moment from "moment";
import { handleFilesPick } from "../../utils/UploadFiles";

// import FileSystem from 'expo-file-system';
const AddUser = (props) => {
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const navigation = useNavigation();
  // const sheetRef = useRef();
  const [designation, setDesignation] = useState([]);
  const [userid, setuserId] = useState(0);
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [username, setUsername] = useState("");
  const [suggestUsername, setSuggestUsername] = useState("");

  const [countryCode, setCountryCode] = useState("+91");
  const [countryFlag, setCountryFlag] = useState("IN");
  const [country, setcountry] = useState("India");

  const [mobile, setmobile] = useState("");
  const [designationName, setdesignationName] = useState(null);
  const [designationId, setdesignationId] = useState("");
  const [isDesignationOpen, setisDesignationOpen] = useState(false);
  const [Address, setAddress] = useState("");
  const [date, setDate] = useState(null);
  const [show, setShow] = useState(false);
  const [email_exist, setemail_exist] = useState(false);
  const [mobile_exist, setmobile_exist] = useState(false);

  const [userImageModal, setUserImageModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [staffId, setstaffId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const { height, width } = useWindowDimensions();
  const [Gender, setGender] = useState("");
  const [DropDown, setDropDown] = useState(false);
  const [EmailLoad, setEmailLoad] = useState(false);
  const [MobileLoad, setMobileLoad] = useState(false);
  const [UserLoad, setUserLoad] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const [imageData, setImageData] = useState(null);
  const [genderItem, setgenderItem] = useState([
    {
      id: 1,
      name: "Male",
    },
    {
      id: 2,
      name: "Female",
    },
  ]);
  const [bloodGroupData, setbloodGroupData] = useState([
    {
      id: 1,
      name: "A+",
    },
    {
      id: 2,
      name: "A-",
    },
    {
      id: 3,
      name: "B+",
    },
    {
      id: 4,
      name: "AB+",
    },
    {
      id: 5,
      name: "AB-",
    },
    {
      id: 6,
      name: "O+",
    },
    {
      id: 7,
      name: "O-",
    },
  ]);
  const [Item, setItem] = useState([
    {
      id: 1,
      name: "Married",
    },
    {
      id: 2,
      name: "Unmarried",
    },
  ]);
  const [martialItemDropDown, setMartialItemDropDown] = useState(false);
  //   const [address, setAddress] = useState("");
  const [martialStatus, setMartialStatus] = useState("");
  const [bloodGroupDropDown, setbloodGroupDropDown] = useState(false);
  const [bloodGroup, setBloodGroup] = useState("");
  const [imagetype, setimagetype] = useState();
  const genderRef = useRef(null);
  const datePicker2Ref = useRef(null);
  const maritalRef = useRef(null);
  const [emailvalid, setEmailvalid] = useState(false);

  let emailRegx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

  const toggleUserImageModal = () => {
    setUserImageModal(!userImageModal);
  };

  const PhotoUploadOptions = () => {
    // sheetRef.current.open();
    setUserImageModal(!userImageModal);
  };

  const closeUserImageModal = () => {
    setUserImageModal(false);
  };

  const pickImage = async () => {
    let result = await handleFilesPick(errorToast, "image", setIsLoading);
    if (result && result?.length > 0) {
      setImageData(result[0]);
      setUserImageModal(false);
    } else {
      setUserImageModal(false);
    }
  };

  const handleSubmitFocus = (refs) => {
    {
      /*Closing all auto complete for favor of IOS modal By Biswanath Nath 24.04.2023
      if (refs.current) {
        refs.current.blur();
        refs.current.focus();
      }*/
    }
  };
  const takePhoto = async () => {
    // setIsLoading(true);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setIsLoading(false);
      setImageData(getFileData(result.assets[0]));
      setUserImageModal(false);
    }

    // setIsLoading(false);
    // sheetRef.current.close();
  };

  const handleContentSizeChange = (event) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };
  const genderCls = () => {
    setDropDown(false);
  };
  const getGenderData = (item) => {
    item.map((value) => {
      setGender(value.name);
    });
    setDropDown(!DropDown);
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
          datePicker2Ref.current.focus();*/
    }
  };

  const SetGenderDropDown = (data) => {
    setDropDown(data);
    setDropDown(!DropDown);
  };
  const dropdownOff = () => {
    setDropDown(false);
  };
  const setSelectedDate = (item) => {
    let today = new Date();
    let selectedDate = new Date(item);

    // Calculate the difference in years between today and the selected date
    let age = today.getFullYear() - selectedDate.getFullYear();

    // Check if the birthdate is in the future or if the person is under 18
    if (selectedDate > today || age < 18) {
      warningToast("warning", "Must be 18+ to proceed");
      return;
    }

    setDate(item);
  };
  const getBloodGroupData = (item) => {
    setBloodGroup(item[0].name);
    setbloodGroupDropDown(!bloodGroupDropDown);
  };
  const bloodGroupCls = () => {
    setbloodGroupDropDown(false);
  };
  const SetBloodGroupDropDown = (data) => {
    setbloodGroupDropDown(!bloodGroupDropDown);
    // setMartialItemDropDown(false);
    setDropDown(false);
  };

  const SetMaritalStatus = (data) => {
    setMartialItemDropDown(data);
    setMartialItemDropDown(!martialItemDropDown);
    setDropDown(false);
    setbloodGroupDropDown(false);
  };

  const getMaritalStatusData = (item) => {
    item.map((value) => {
      setMartialStatus(value.name);
    });
    setMartialItemDropDown(!martialItemDropDown);
  };
  const martialCls = () => {
    setMartialItemDropDown(false);
  };

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
        })
        .catch((error) => {
          errorToast("error", "Oops! Something went wrong!!");
          setIsLoading(false);
        });
    });
    return unsubscribe;
  }, [navigation]);

  const catPressed = (item) => {
    setdesignationName(item.map((u) => u.name).join(", "));
    setdesignationId(item.map((id) => id.id));
    setisDesignationOpen(!isDesignationOpen);
  };

  useEffect(() => {
    if (email?.includes("@") || email.length > 10) {
      const getData = setTimeout(() => {
        checkEmail();
      }, 1500);

      return () => clearTimeout(getData);
    }
  }, [email?.length]);

  const SetEmail = (val) => {
    setErrorMessage(false);
    setIsError(false);
    setemail(val);
  };

  //Validating email from server side

  const checkEmail = () => {
    if (!emailvalid && email.length > 3) {
      setEmailLoad(true);
      emailExist({ email })
        .then((res) => {
          setemail_exist(!res.success);
          if (!res.success) {
            setIsError({ email: true });
            setErrorMessage({ email: res.message });
            setEmailvalid(false);
            setEmailLoad(false);
          } else {
            setIsError(false);
            setErrorMessage(false);
            setEmailvalid(true);
            setEmailLoad(false);
          }
        })
        .catch((err) => {
          errorToast("error", "Oops! Something went wrong!!");
          setEmailLoad(false);
        });
    }
  };

  const showErr = (errorString) => {
    if (errorString) {
      const errorMessageParts = errorString?.split(":");
      const extractedMessage =
        errorMessageParts?.length > 1
          ? errorMessageParts[1]?.trim()
          : errorString?.trim();
      return extractedMessage;
    } else {
      return "No error message found";
    }
  };

  const checkMobile = (mobile) => {
    setmobile(mobile);
    setIsError({});
    if (mobile.length >= 10) {
      setMobileLoad(true);
      mobileExist({ mobile })
        .then((res) => {
          setmobile_exist(!res.success);

          if (!res.success) {
            setIsError({ mobile: true });
            setErrorMessage({ mobile: res.message });
            setMobileLoad(false);
          }
          setMobileLoad(false);
        })

        .catch((err) => {
          errorToast("error", showErr(err?.toString() ?? ""));
          setMobileLoad(false);
        });
    } else {
      setmobile_exist(true);
      setIsError({ mobile: true });
      setErrorMessage({ mobile: "Enter a valid mobile no" });
      setMobileLoad(false);
    }
  };

  const validation = () => {
    setIsError({});
    let mobileRegx = /^\d{10}$/;
    if (first_name.trim().length === 0) {
      setIsError({ first_name: true });
      setErrorMessage({ first_name: "This field required" });
      return false;
    } else if (last_name.trim().length === 0) {
      setIsError({ last_name: true });
      setErrorMessage({ last_name: "This field required" });
      return false;
    } else if (username.trim().length === 0) {
      setIsError({ username: true });
      setErrorMessage({ username: "This field required" });
      return false;
    } else if (!emailRegx.test(email) || email.trim().length == 0) {
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
    } else if (mobile_exist) {
      setIsError({ mobile: true });
      setErrorMessage({ mobile: "User already exists with this mobile" });
      return false;
    } else if (staffId.trim().length === 0) {
      setIsError({ staffId: true });
      setErrorMessage({ staffId: "This field required" });
      return false;
    } else if (isNaN(staffId)) {
      setIsError({ staffId: true });
      setErrorMessage({ staffId: "Staff id should be numeric" });
      return false;
    }
    return true;
  };
  useEffect(() => {
    if (
      first_name ||
      last_name ||
      username ||
      password ||
      countryCode ||
      mobile ||
      staffId
    ) {
      setIsError(false);
      setErrorMessage(false);
    }
  }, [first_name, last_name, username, password, countryCode, mobile, staffId]);
  const onSubmit = () => {
    if (validation()) {
      var obj = {
        first_name: getTextWithoutExtraSpaces(first_name),
        last_name: getTextWithoutExtraSpaces(last_name),
        user_type: "staff",
        email: email ?? "",
        password: password,
        phone_no: mobile,
        country: country,
        country_code: countryCode,
        zoo_id: zooID,
        user_gender: Gender,
        user_name: getTextWithoutExtraSpaces(username),
        user_blood_grp: bloodGroup,
        user_marital_status: martialStatus,
        user_address: Address,
        staff_id: staffId,
      };
      setIsLoading(true);
      if (date) {
        obj.user_dob = moment(date).format("YYYY-MM-DD");
      }
      if (imageData?.uri && imageData?.uri != undefined) {
        obj.user_profile_pic = imageData;
      }
      addStaff(obj)
        .then((res) => {
          if (res.success == true) {
            setAlertTitle("User Created Successfully!!");
            setAlertMessage(
              "UserName: " +
                res.data.user_name +
                "\nPassword: " +
                res.data.password
            );
            setuserId(res.data.user_id);
            showAlert();
          } else if (Object.keys(res.message)[0] == "email") {
            setIsError({ email: true });
            setErrorMessage({ email: Object.values(res.message)[0] });
          } else {
            errorToast("error", res.message);
          }
        })
        .catch((err) => {
          console.log({ err });
          errorToast("error", "Oops! Something went wrong!!");
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
  const input8Ref = useRef(null);

  const closeDesignation = () => {
    setisDesignationOpen(false);
  };

  const CountCode = (item) => {
    setCountryCode(item.dial_code);
    setShow(false);
  };
  /* Function to generate combination of password */
  const generateP = () => {
    let pass = "";
    let str =
      "@#$@#$@#$@#$" +
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
      "abcdefghijklmnopqrstuvwxyz" +
      "0123456789";

    for (let i = 1; i <= 8; i++) {
      let char = Math.floor(Math.random() * str.length + 1);

      pass += str.charAt(char);
    }
    setpassword(pass);
  };

  const showAlert = () => {
    setIsVisible(true);
  };

  const hideAlert = () => {
    setIsVisible(false);
  };

  const handleOK = () => {
    setIsVisible(false);
    navigation.replace("UserDetails", {
      user_id: userid,
    });
  };
  const handleCancel = () => {
    setIsVisible(false);
    navigation.goBack();
  };

  useEffect(() => {
    let timeoutId = null;

    if (first_name.trim().length >= 3 && last_name.trim().length >= 3) {
      const obj = {
        first_name: first_name,
        last_name: last_name,
      };
      setUserLoad(true);

      timeoutId = setTimeout(() => {
        SuggestUsername(obj)
          .then((res) => {
            if (res.success === true) {
              setSuggestUsername(res?.data?.username ?? "");
              setUserLoad(false);
            }
            setUserLoad(false);
          })
          .catch((error) => {
            errorToast("error", "Oops! Something went wrong!!");
            setUserLoad(false);
          })
          .finally(() => {
            setUserLoad(false);
          });
      }, 1000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [first_name, last_name]);

  // // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

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
        <Text
          style={{
            fontSize: FontSize.Antz_Medium_Medium.fontSize,
            fontWeight: FontSize.Antz_Medium_Medium.fontWeight,
          }}
        >
          Add User Basic Info
        </Text>
      </View>

      <CustomForm
        header={false}
        // title={"User Form"}
        onPress={onSubmit}
        // marginBottom={50}
      >
        <TouchableOpacity
          onPress={() => PhotoUploadOptions()}
          style={{
            width: 124,
            height: 124,
            borderRadius: 62,
            alignSelf: "center",
            backgroundColor: constThemeColor.secondary,
            justifyContent: "center",
          }}
        >
          {!imageData || imageData == null ? (
            <AntDesign
              name="adduser"
              size={60}
              color={constThemeColor.onPrimary}
              style={{ alignSelf: "center" }}
            />
          ) : (
            <Image
              source={{ uri: imageData?.uri ?? "" }}
              style={{
                width: 124,
                height: 124,
                borderRadius: 62,
                alignSelf: "center",
                backgroundColor: constThemeColor.secondary,
                justifyContent: "center",
              }}
            />
          )}
        </TouchableOpacity>

        {!imageData ? (
          <TouchableOpacity
            style={{
              alignSelf: "center",
              marginTop: Spacing.body,
            }}
            onPress={() => PhotoUploadOptions()}
          >
            <Text
              style={{
                alignSelf: "center",
                fontSize: FontSize.Antz_Minor_Regular.fontSize,
                fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                color: constThemeColor.primary,
              }}
            >
              Add Profile Picture
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              alignSelf: "center",
              marginTop: Spacing.body,
            }}
            onPress={() => setImageData(null)}
          >
            <Text
              style={{
                alignSelf: "center",
                fontSize: FontSize.Antz_Minor_Regular.fontSize,
                fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                color: constThemeColor.error,
              }}
            >
              Remove Profile Picture
            </Text>
          </TouchableOpacity>
        )}

        <InputBox
          refs={firstNameRef}
          inputLabel={"First Name*"}
          placeholder={"First Name"}
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
          placeholder={"Last Name"}
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
          refs={input4Ref}
          inputLabel={"User Name*"}
          placeholder={"User Name"}
          onChange={(val) => {
            setUsername(val.toLowerCase());
          }}
          autoCapitalize="none"
          onFocus={closeDesignation}
          value={username}
          isError={isError.username}
          errors={errorMessage.username}
          renderRightIcon={true}
          right={() => {
            return UserLoad ? <ActivityIndicator size={24} /> : "";
          }}
        />
        {suggestUsername ? (
          <View>
            <Text style={reduxColors.autoGenarate}>
              Suggested Username :
              <Text
                onPress={() => setUsername(suggestUsername.toLowerCase())}
                style={[
                  reduxColors.autoGenarate,
                  { color: constThemeColor.primary },
                ]}
              >
                {" " + suggestUsername}
              </Text>
            </Text>
          </View>
        ) : null}
        <InputBox
          refs={input3Ref}
          inputLabel={"Email Address*"}
          placeholder={"Email Address"}
          keyboardType={"email-address"}
          onChange={(val) => {
            setEmailvalid(false);
            SetEmail(val);
          }}
          value={email}
          isError={isError.email}
          errors={errorMessage.email}
          onSubmitEditing={() => handleSubmitFocus(input4Ref)}
          onFocus={closeDesignation}
          handleBlur={checkEmail}
          renderRightIcon={true}
          right={() => {
            return email ? (
              EmailLoad ? (
                <ActivityIndicator size={24} />
              ) : email_exist && isError.email ? (
                <Entypo
                  name="cross"
                  size={24}
                  color={constThemeColor.error}
                  onPress={() => {
                    setemail("");
                    setErrorMessage(false);
                    setIsError(false);
                    setEmailvalid(false);
                  }}
                />
              ) : emailvalid ? (
                <Ionicons
                  name="checkmark-done"
                  size={24}
                  color={constThemeColor.primaryContainer}
                />
              ) : null
            ) : (
              <></>
            );
          }}
        />
        <InputBox
          refs={input4Ref}
          inputLabel={"Password*"}
          placeholder={"Password"}
          autoCapitalize="none"
          onChange={(val) => {
            setpassword(val);
          }}
          onFocus={closeDesignation}
          value={password}
          isError={isError.password}
          errors={errorMessage.password}
        />
        <TouchableOpacity onPress={generateP}>
          <Text style={reduxColors.autoGenarate}>Auto generated</Text>
        </TouchableOpacity>
        <InputBox
          refs={input5Ref}
          inputLabel={"Mobile Number*"}
          placeholder={"Mobile Number"}
          keyboardType={"numeric"}
          maxLength={10}
          onChange={(val) => {
            checkMobile(val);
          }}
          value={mobile}
          isError={isError.mobile}
          errors={errorMessage.mobile}
          onSubmitEditing={() => handleSubmitFocus(input6Ref)}
          renderRightIcon={true}
          left={
            <TouchableOpacity
              onPress={() => setShow(true)}
              style={{ flexDirection: "row" }}
            >
              <View
                onPress={() => setShow(true)}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Flag code={countryFlag} size={32} from={allFlatFlags32} />
                <AntDesign
                  name="caretdown"
                  size={10}
                  color={constThemeColor.onPrimaryContainer}
                  style={{ left: 3 }}
                />
              </View>
              {/* <View >
  <AntDesign name="caretdown" size={15} color="grey" style={{marginLeft:widthPercentageToDP(0.3),marginTop:widthPercentageToDP(2)}}/>
  </View> */}
            </TouchableOpacity>
          }
          right={() => {
            return mobile.length >= 10 ? (
              MobileLoad ? (
                <ActivityIndicator size={24} />
              ) : mobile_exist ? (
                <Entypo name="cross" size={24} color={constThemeColor.error} />
              ) : (
                <Ionicons
                  name="checkmark-done"
                  size={24}
                  color={constThemeColor.primaryContainer}
                />
              )
            ) : (
              <></>
            );
          }}
        />
        <InputBox
          refs={input7Ref}
          inputLabel={"Staff Id*"}
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
        <View
          style={{
            width: "100%",
          }}
        >
          <InputBox
            editable={false}
            inputLabel="Gender"
            value={Gender}
            refs={genderRef}
            placeholder="Choose Gender"
            rightElement={DropDown ? "menu-up" : "menu-down"}
            //   DropDown={()=>{setIdProofDropDown(!idProofDropDown)}}
            DropDown={SetGenderDropDown}
            onFocus={SetGenderDropDown}
            errors={errorMessage.Gender}
            isError={isError.Gender}
          />
        </View>

        <View
          style={{
            width: "100%",
          }}
        >
          <DatePicker
            title="Date of Birth"
            today={date}
            refs={datePicker2Ref}
            onChange={setSelectedDate}
            onOpen={dropdownOff}
            maximumDate={new Date()}
            errors={errorMessage.date}
            isError={isError.date}
          />
        </View>

        <View>
          <InputBox
            editable={false}
            inputLabel="Blood Group"
            value={bloodGroup}
            placeholder="Choose Blood Group"
            rightElement={bloodGroupDropDown ? "menu-up" : "menu-down"}
            // DropDown={()=>{setIdProofDropDown(!idProofDropDown)}}
            DropDown={SetBloodGroupDropDown}
            onFocus={SetBloodGroupDropDown}
            errors={errorMessage.bloodGroup}
            isError={isError.bloodGroup}
          />
        </View>
        <View
          style={{
            width: "100%",
          }}
        >
          <InputBox
            editable={false}
            inputLabel="Marital Status"
            value={martialStatus}
            refs={maritalRef}
            placeholder="Enter Marital Status"
            rightElement={DropDown ? "menu-up" : "menu-down"}
            DropDown={SetMaritalStatus}
            onFocus={SetMaritalStatus}
            errors={errorMessage.martialStatus}
            isError={isError.martialStatus}
          />
        </View>

        <InputBox
          // style={{ backgroundColor: "#FFFACF" }}
          refs={input8Ref}
          inputLabel={"Enter Address"}
          placeholder={"Enter Address"}
          keyboardType={"default"}
          onContentSizeChange={handleContentSizeChange}
          multiline={true}
          numberOfLines={1}
          onChange={(val) => setAddress(val)}
          closeDesignation
          onFocus={closeDesignation}
          value={Address}
          isError={isError.Address}
          errors={errorMessage.Address}
        />
        {/* <TouchableOpacity
          onPress={onSubmit}
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
            Submit
          </Text>
        </TouchableOpacity> */}
      </CustomForm>

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
          setcountry(item.name.en);
          setCountryFlag(item.code);
          setShow(false);
        }}
      />

      {DropDown ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={DropDown}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={genderCls}
          >
            <Category
              categoryData={genderItem}
              onCatPress={getGenderData}
              heading={"Choose Gender"}
              onClose={genderCls}
            />
          </Modal>
        </View>
      ) : null}
      {bloodGroupDropDown ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={bloodGroupDropDown}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={bloodGroupCls}
          >
            <Category
              categoryData={bloodGroupData}
              onCatPress={getBloodGroupData}
              heading={"Choose Blood Group"}
              onClose={bloodGroupCls}
            />
          </Modal>
        </View>
      ) : null}
      {martialItemDropDown ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={martialItemDropDown}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={martialCls}
          >
            <Category
              categoryData={Item}
              onCatPress={getMaritalStatusData}
              heading={"Choose Marital Status"}
              onClose={martialCls}
            />
          </Modal>
        </View>
      ) : null}

      {userImageModal ? (
        <Modal
          avoidKeyboard
          animationType="fade"
          visible={true}
          onDismiss={closeUserImageModal}
          onBackdropPress={closeUserImageModal}
          onRequestClose={closeUserImageModal}
          style={[
            stylesSheet.bottomSheetStyle,
            { backgroundColor: "transparent" },
          ]}
        >
          <TouchableWithoutFeedback onPress={toggleUserImageModal}>
            <View style={[reduxColors.modalOverlay]}>
              <View style={reduxColors.modalContainer}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <TouchableWithoutFeedback onPress={pickImage}>
                    <View style={reduxColors.modalView}>
                      <View
                        style={{
                          backgroundColor: constThemeColor.secondary,
                          height: 50,
                          width: 50,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 25,
                        }}
                      >
                        <MaterialIcons
                          name="photo-library"
                          size={24}
                          color={constThemeColor.onPrimary}
                        />
                      </View>
                      <Text style={reduxColors.docsText}>Gallery</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={takePhoto}>
                    <View style={reduxColors.modalView}>
                      <View
                        style={{
                          backgroundColor: constThemeColor.secondary,
                          height: 50,
                          width: 50,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 25,
                        }}
                      >
                        <MaterialIcons
                          name="camera-alt"
                          size={24}
                          color={constThemeColor.onPrimary}
                        />
                      </View>
                      <Text style={reduxColors.docsText}>Camera</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      ) : null}

      <DialougeModal
        isVisible={isVisible}
        alertType={Config.SUCCESS_TYPE}
        title={alertTitle}
        subTitle={alertMessage}
        closeModal={hideAlert}
        firstButtonHandle={handleOK}
        secondButtonHandle={handleCancel}
        firstButtonText={"Go to user details"}
        secondButtonText={"Go to back"}
        secondButtonStyle={{
          backgroundColor: constThemeColor.error,
          borderWidth: 0,
        }}
        secondButtonTextStyle={{
          color: constThemeColor.onPrimary,
        }}
        firstButtonStyle={{
          backgroundColor: constThemeColor.surfaceVariant,
          borderWidth: 0,
        }}
      />
    </View>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: Spacing.small,
      paddingHorizontal: Spacing.small,
    },
    Label: {
      marginTop: 20,
      fontSize: FontSize.Antz_Small,
      fontWeight: "200",
    },
    autoGenarate: {
      color: reduxColors.primary,
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      lineHeight: 16,
      marginBottom: Spacing.mini,
      marginLeft: widthPercentageToDP(3),
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: reduxColors?.blackWithPointEight,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: reduxColors.surface,
      height: 150,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    modalView: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Spacing.major,
    },
    docsText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      marginTop: Spacing.mini,
    },
  });

export default AddUser;
