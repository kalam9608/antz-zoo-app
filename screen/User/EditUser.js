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
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../components/Loader";
import { CountryPicker } from "react-native-country-codes-picker";
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
  EditStaff,
  addStaff,
  checkUserNameExist,
  emailExist,
  mobileExist,
} from "../../services/staffManagement/addPersonalDetails";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import DatePicker from "../../components/DatePicker";
import RBSheet from "react-native-raw-bottom-sheet";
import { Image } from "react-native";
import {
  capitalize,
  getFileData,
  getTextWithoutExtraSpaces,
} from "../../utils/Utils";
import Flag from "react-native-flags";
import * as allFlatFlags32 from "react-native-flags/flags/flat/32";

import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { ActivityIndicator } from "react-native-paper";
import { saveAsyncData } from "../../utils/AsyncStorageHelper";
import { setSignIn } from "../../redux/AuthSlice";
import { setSites } from "../../redux/SiteSlice";
import { ScrollView } from "react-native-gesture-handler";
import { useToast } from "../../configs/ToastConfig";
import { removeDisplayImage } from "../../services/ZooSiteService";
import moment from "moment";
import { handleFilesPick } from "../../utils/UploadFiles";

const EditUser = (props) => {
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const navigation = useNavigation();
  // const sheetRef = useRef();
  const [designation, setDesignation] = useState([]);
  const [user_id, setUser_id] = useState(
    props.route.params?.data?.user_id ?? null
  );
  const [first_name, setfirst_name] = useState(
    props.route.params?.data?.user_first_name ?? ""
  );
  const [last_name, setlast_name] = useState(
    props.route.params?.data?.user_last_name ?? ""
  );
  const [email, setemail] = useState(
    props.route.params?.data?.user_email ?? ""
  );
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setmobile] = useState(
    props.route.params?.data?.user_mobile_number ?? ""
  );
  const [username, setUsername] = useState(
    props.route.params?.data?.user_name ?? ""
  );
  const [suggestUsername, setSuggestUsername] = useState("");
  const [country, setcountry] = useState("");
  const [designationName, setdesignationName] = useState(null);
  const [designationId, setdesignationId] = useState("");
  const [isDesignationOpen, setisDesignationOpen] = useState(false);
  const [Address, setAddress] = useState(
    props.route.params?.item?.user_address ?? ""
  );
  const [date, setDate] = useState(props.route.params?.item?.user_dob ?? null);
  const [show, setShow] = useState(false);
  const [email_exist, setemail_exist] = useState(false);
  const [EmailLoad, setEmailLoad] = useState(false);
  const [MobileLoad, setMobileLoad] = useState(false);
  const [mobile_exist, setmobile_exist] = useState(false);

  const [userNameLoad, setUserNameLoad] = useState(2);
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const { height, width } = useWindowDimensions();
  const [userImageModal, setUserImageModal] = useState(false);
  const [checkState, setCheckstate] = useState(false);
  const [Gender, setGender] = useState(
    capitalize(props.route.params?.item?.user_gender) ?? ""
  );
  const [DropDown, setDropDown] = useState(false);
  // const [add, setAdd] = useState("Add Profile Picture");

  const [imageUri, setImageUri] = useState(
    props.route.params?.data?.profile_pic
      ? `${props.route.params?.data?.profile_pic}`
      : null
  );
  const [staffId, setstaffId] = useState(
    props.route.params?.data.staff_id ?? ""
  );
  const [imagetype, setimagetype] = useState();
  const [imageData, setImageData] = useState(
    props.route.params?.data?.profile_pic
      ? getFileData({ uri: props.route.params?.data?.profile_pic })
      : {}
  );
  const [imgformat, setimgformat] = useState();
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
  const [martialStatus, setMartialStatus] = useState(
    capitalize(props.route.params?.item?.user_marital_status) ?? ""
  );
  const [bloodGroupDropDown, setbloodGroupDropDown] = useState(false);
  const [bloodGroup, setBloodGroup] = useState(
    props.route.params?.item?.user_blood_grp ?? ""
  );
  const genderRef = useRef(null);
  const datePicker2Ref = useRef(null);
  const maritalRef = useRef(null);

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

  const removeIcon = async () => {
    if (props.route.params?.data?.profile_pic) {
      setIsLoading(true);
      removeDisplayImage({
        ref_id: user_id,
        ref_type: "user",
      })
        .then((res) => {
          successToast("success", res?.message);
          setImageData({});
        })
        .catch((err) => {
          errorToast("Oops!", "Something went wrong!!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setImageData({});
    }
  };

  const pickImage = async () => {
    let result = await handleFilesPick(errorToast, "image", setIsLoading)
    
    if (result&&result?.length>0) {
      setImageData(result[0]);
    setUserImageModal(false);
    }else{
      setUserImageModal(false);
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
    // setMartialItemDropDown(false);
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
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
          addressRef.current.focus();*/
    }
  };
  const martialCls = () => {
    setMartialItemDropDown(false);
  };

  useEffect(() => {
    setItem(
      Item.map((item) => {
        return {
          id: item.id,
          name: item.name,
          isSelect: item.name == martialStatus ? true : false,
        };
      })
    );
    setgenderItem(
      genderItem.map((item) => {
        return {
          id: item.id,
          name: item.name,
          isSelect: item.name == Gender ? true : false,
        };
      })
    );
    setbloodGroupData(
      bloodGroupData.map((item) => {
        return {
          id: item.id,
          name: item.name,
          isSelect: item.name == bloodGroup ? true : false,
        };
      })
    );
  }, []);

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
    {
      /*Closing all auto complete for favor of IOS modal By Biswanath Nath 24.04.2023
        handleSubmitFocus(input7Ref);*/
    }
  };
  //Validating email from server side
  const checkEmail = (email) => {
    setemail(email);
    setIsError({});
    if (email?.includes("@") || email.length > 10) {
      let obj = {
        email: email,
        user_id: user_id,
      };
      setTimeout(() => {
        setEmailLoad(true);
        emailExist(obj)
          .then((res) => {
            setemail_exist(!res.success);
            if (!res.success) {
              setIsError({ email: true });
              setErrorMessage({ email: res.message });
              setEmailLoad(false);
            } else {
              setIsError({});
            }
            setEmailLoad(false);
          })
          .catch((err) => {
            errorToast("error", "Oops! Something went wrong!!");
            setEmailLoad(false);
          });
      }, 1500);
    } else {
      setemail_exist(true);
      setEmailLoad(false);
      setIsError({ email: true });
      setErrorMessage({ email: "Enter a valid email" });
    }
  };
  // check mobile
  const checkMobile = (mobile) => {
    setmobile(mobile);
    setIsError({});

    // Clear any existing timeout
    clearTimeout(getDataTimeout);

    if (mobile.length >= 10) {
      let obj = {
        mobile: Number(mobile),
        user_id: user_id,
      };
      setMobileLoad(true);

      // Use Promise.all to wait for both API response and a delay
      Promise.all([
        mobileExist(obj),
        new Promise((resolve) => setTimeout(resolve, 1000)), // Add a delay of 1 second
      ])
        .then(([res]) => {
          setmobile_exist(!res.success);
          if (!res.success) {
            setIsError({ mobile: true });
            setErrorMessage({ mobile: res.message });
          }
        })
        .catch((err) => {
          console.log(err?.toString() ?? "", "==============");
          errorToast("error", showErr(err?.toString() ?? ""));
          // Handle API error
        })
        .finally(() => {
          setMobileLoad(false);
        });
    } else if (mobile.length < 10) {
      getDataTimeout = setTimeout(() => {
        // Check if the API response has been received before displaying the error
        if (!MobileLoad && mobile.length < 10) {
          setmobile_exist(true);
          setIsError({ mobile: true });
          setErrorMessage({ mobile: "Enter a valid mobile no" });
        }
      }, 1000);
    }
  };

  useEffect(() => {
    if (!mobile_exist) {
      setIsError({ mobile: false });
    }
  }, [MobileLoad]);

  // Declare getDataTimeout outside the function
  let getDataTimeout;

  const validation = () => {
    setIsError({});
    setErrorMessage({});
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
    } else if (!emailRegx.test(email) || email.trim().length == 0) {
      setIsError({ email: true });
      setErrorMessage({ email: "Enter a valid email" });
      return false;
    } else if (email_exist) {
      setIsError({ email: true });
      setErrorMessage({ email: "Enter a valid email" });
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
    } else if (userNameLoad != 2) {
      setIsError({ username: true });
      setErrorMessage({ username: "Please verify your username first" });
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
    if (first_name || last_name || mobile || email) {
      setIsError(false);
      setErrorMessage(false);
    }
  }, [first_name, last_name, mobile, email]);

  const onSubmit = () => {
    if (validation()) {
      var obj = {
        first_name: getTextWithoutExtraSpaces(first_name),
        last_name: getTextWithoutExtraSpaces(last_name),
        user_type: "staff",
        zoo_id: zooID,
        phone_no: mobile,
        email: email,
        user_gender: Gender,
        user_name: getTextWithoutExtraSpaces(username),
        user_blood_grp: bloodGroup,
        user_marital_status: martialStatus,
        user_address: Address,
        user_id: user_id,
        staff_id: staffId,
      };
      if (date) {
        obj.user_dob = moment(date).format("YYYY-MM-DD");
      }
      // if (imageData&&imageData?.uri&&imageData?.uri!=undefined) {
      //   obj.user_profile_pic = imageData;
      // }
      if (imageData?.uri&&imageData?.uri!=undefined) {
        obj.user_profile_pic = imageData;
      }
      setIsLoading(true);
      EditStaff(obj)
        .then((res) => {
          if (res.success == true) {
            navigation.goBack();
            successToast("success", res.message);
            setIsLoading(false);
          } else {
            errorToast("error", res.message);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log({err});
          errorToast("error", "Oops! Something went wrong!!");
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {}, []);

  const firstNameRef = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const countryCodeRef = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);
  const input7Ref = useRef(null);
  const input8Ref = useRef(null);

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

  const checkUsername = () => {
    setIsError({});
    setErrorMessage({});
    setSuggestUsername(null);
    setUserNameLoad(1);
    let obj = {
      user_name: username,
      user_id: user_id,
    };
    checkUserNameExist(obj)
      .then((res) => {
        if (res.success == true) {
          setUserNameLoad(2);
        } else {
          setUserNameLoad(3);
          setSuggestUsername(res.data);
          setIsError({ username: true });
        }
      })
      .catch((err) => {
        setUserNameLoad(0);
        errorToast("Oops!", "Something went wrong!!");
      });
  };

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
          marginTop: Spacing.body,
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
          Edit Basic Info
        </Text>
      </View>
      <CustomForm
        header={false}
        // title={"User Form"}
        onPress={onSubmit}
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
          {imageData!={}&&imageData.uri ? (
            <Image
              source={{ uri: imageData.uri??"" }}
              style={{
                width: 124,
                height: 124,
                borderRadius: 62,
                alignSelf: "center",
                backgroundColor: constThemeColor.secondary,
                justifyContent: "center",
              }}
            />
          ) : (
            <AntDesign
              name="adduser"
              size={60}
              color={constThemeColor.onPrimary}
              style={{ alignSelf: "center" }}
            />
          )}
        </TouchableOpacity>

        {imageData.uri ? (
          <TouchableOpacity
            style={{
              alignSelf: "center",
              marginTop: Spacing.body,
            }}
            onPress={() => {
              removeIcon();
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontSize: FontSize.Antz_Minor_Regular.fontSize,
                fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                color: constThemeColor.error,
              }}
            >
              Remove Profile Picture{" "}
            </Text>
          </TouchableOpacity>
        ) : (
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
          inputLabel={"User Name*"}
          placeholder={"User Name"}
          onChange={(val) => {
            setUsername(val);
            setUserNameLoad(0);
          }}
          onFocus={closeDesignation}
          value={username}
          isError={isError.username}
          errors={errorMessage.username}
          helpText={
            suggestUsername ? (
              <Text
                style={{
                  color: constThemeColor.onSecondaryContainer,
                  fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                  fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                  lineHeight: 16,
                  marginBottom: 5,
                  marginLeft: widthPercentageToDP(1),
                }}
              >
                Suggested Username :
                <Text
                  onPress={() => {
                    setUsername(suggestUsername);
                    setSuggestUsername("");
                    setIsError({});
                    setUserNameLoad(2);
                  }}
                  style={[
                    {
                      color: constThemeColor.primaryContainer,
                      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                      lineHeight: 16,
                      marginBottom: 5,
                      marginLeft: widthPercentageToDP(3),
                    },
                  ]}
                >
                  {" " + suggestUsername}
                </Text>
              </Text>
            ) : null
          }
          renderRightIcon={true}
          right={() => {
            return (
              <>
                {userNameLoad == 0 ? (
                  <TouchableOpacity onPress={checkUsername}>
                    <Text
                      style={{
                        fontSize: FontSize.Antz_Body_Title.fontSize,
                        fontWeight: FontSize.Antz_Body_Title.fontWeight,
                        color: constThemeColor.onSurface,
                      }}
                    >
                      Verify
                    </Text>
                  </TouchableOpacity>
                ) : userNameLoad == 1 ? (
                  <ActivityIndicator size={24} />
                ) : userNameLoad == 2 ? (
                  <Ionicons
                    name="checkmark-done"
                    size={24}
                    color={constThemeColor.primaryContainer}
                  />
                ) : userNameLoad == 3 ? (
                  <Entypo
                    name="cross"
                    size={24}
                    color={constThemeColor.error}
                  />
                ) : null}
              </>
            );
          }}
        />
        <InputBox
          refs={input3Ref}
          inputLabel={"Email Address*"}
          placeholder={"Email Address"}
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
              EmailLoad ? (
                <ActivityIndicator size={24} />
              ) : email_exist ? (
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
        {/* <InputBox
          refs={input3Ref}
          inputLabel={"Email Address"}
          placeholder={"Email Address"}
          keyboardType={"email-address"}
          onChange={(val) => {
            setemail(val);
          }}
          value={email}
          isError={isError.email}
          errors={errorMessage.email}
          onSubmitEditing={() => handleSubmitFocus(input4Ref)}
          onFocus={closeDesignation}
        /> */}
        <InputBox
          refs={input5Ref}
          inputLabel={"Mobile Number*"}
          placeholder={"Mobile Number"}
          keyboardType={"numeric"}
          maxLength={10}
          // edit={false}
          onChange={(val) => {
            checkMobile(val);
          }}
          value={mobile}
          marginLeft={20}
          isError={isError.mobile}
          errors={errorMessage.mobile}
          onSubmitEditing={() => handleSubmitFocus(input6Ref)}
          renderRightIcon={true}
          left={
            <TouchableOpacity
              onPress={() => {}}
              style={{ flexDirection: "row" }}
            >
              <View
                onPress={() => {}}
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <Flag code={"IN"} size={32} from={allFlatFlags32} />
              </View>
              {/* <View>
                  <AntDesign
                    name="caretdown"
                    size={15}
                    color="grey"
                    style={{
                      marginLeft: widthPercentageToDP(0.3),
                      marginTop: widthPercentageToDP(2),
                    }}
                  />
                </View> */}
            </TouchableOpacity>
          }
          right={() => {
            return mobile.length >= 10 ? (
              MobileLoad ? (
                <ActivityIndicator size={24} />
              ) : mobile_exist ? null : (
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
            // editable={false}
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
            // editable={false}
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

      <CountryPicker
        show={show}
        style={{
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
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={[
                {
                  backgroundColor: "transparent",
                  width: "100%",
                  maxHeight: "90%",
                },
              ]}
            >
              <ScrollView>
                <Category
                  categoryData={genderItem}
                  onCatPress={getGenderData}
                  heading={"Choose Gender"}
                  onClose={genderCls}
                  style={{ height: "100%" }}
                />
              </ScrollView>
            </KeyboardAvoidingView>
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
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={[
                {
                  backgroundColor: "transparent",
                  width: "100%",
                  maxHeight: "90%",
                },
              ]}
            >
              {/* <ScrollView> */}
              <Category
                categoryData={bloodGroupData}
                onCatPress={getBloodGroupData}
                heading={"Choose Blood Group"}
                onClose={bloodGroupCls}
              />
              {/* </ScrollView> */}
            </KeyboardAvoidingView>
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
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={[
                {
                  backgroundColor: "transparent",
                  width: "100%",
                  maxHeight: "90%",
                },
              ]}
            >
              <ScrollView>
                <Category
                  categoryData={Item}
                  onCatPress={getMaritalStatusData}
                  heading={"Choose Marital Status"}
                  onClose={martialCls}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </Modal>
        </View>
      ) : null}

      {/* <RBSheet
        ref={sheetRef}
        enablePanDownToClose={true}
        height={130}
        openDuration={250}
        customStyles={{
          container: {
            backgroundColor: constThemeColor.onPrimary,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          },
        }}
      >
        <View
          style={{
            justifyContent: "space-around",
            marginTop: "10%",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              width: "30%",
              height: "100%",
              borderRadius: 7,
            }}
            onPress={() => takePhoto()}
          >
            <Ionicons
              name="camera-outline"
              size={40}
              color={constThemeColor.neutralPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              width: "30%",
              height: "100%",
              borderRadius: 7,
            }}
            onPress={() => pickImage()}
          >
            <Foundation
              name="photo"
              size={40}
              color={constThemeColor.neutralPrimary}
            />
          </TouchableOpacity>
        </View>
      </RBSheet> */}

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
      fontSize: FontSize.Antz_Small.fontSize,
      fontWeight: FontSize.Antz_Small.fontWeight,
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

export default EditUser;
