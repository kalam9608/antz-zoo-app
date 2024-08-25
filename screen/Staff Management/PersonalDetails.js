import {
  View,
  Text,
  StyleSheet,
  Alert,
  useWindowDimensions,
  Image,
} from "react-native";
import DatePicker from "../../components/DatePicker";
import React, { useState, useRef, useEffect } from "react";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import { useNavigation } from "@react-navigation/native";
import {
  EditpersonalDetails,
  personalDetails,
} from "../../services/staffManagement/addPersonalDetails";
import Loader from "../../components/Loader";
import DocumentUpload from "../../components/DocumentUpload";
import Category from "../../components/DropDownBox";
import { useSelector } from "react-redux";
import Modal from "react-native-modal";
import { capitalize } from "../../utils/Utils";
import { heightPercentageToDP } from "react-native-responsive-screen";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import FontSize from "../../configs/FontSize";
import { useToast } from "../../configs/ToastConfig";

const PersonalDetails = (props) => {
  const { height, width } = useWindowDimensions();
  const navigation = useNavigation();
  // user_id: user_id,
  // item: data.user_details.personal_details,
  // user:data.user_email,
  // mobile:data.user_mobile_number
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const [phone, setPhone] = useState(props.route.params?.mobile ?? "");

  const [email, setEmail] = useState(props.route.params?.user ?? "");

  const [user_id, setUser_id] = useState(props.route.params?.user_id ?? 0);

  const [Gender, setGender] = useState(
    capitalize(props.route.params?.item?.user_gender) ?? ""
  );
  const [address, setAddress] = useState(
    props?.route?.params?.item?.user_address ?? ""
  );
  const [martialStatus, setMartialStatus] = useState(
    capitalize(props.route.params?.item?.user_marital_status) ?? ""
  );
  const [date, setDate] = useState(
    props.route.params?.item?.user_dob ?? new Date()
  );
  const [DropDown, setDropDown] = useState(false);

  const [bloodGroupDropDown, setbloodGroupDropDown] = useState(false);
  const [bloodGroup, setBloodGroup] = useState(
    props.route.params?.item?.user_blood_grp ?? ""
  );

  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [isLoading, setLoding] = useState(false);
  const [uploadFile, setUploadFile] = useState([]);
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
  const [martialItemDropDown, setMartialItemDropDown] = useState(false);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  // const dynamicStyles = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

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
    setMartialItemDropDown(false);
  };

  const getBloodGroupData = (item) => {
    setBloodGroup(item[0].name);
    setbloodGroupDropDown(!bloodGroupDropDown);
  };

  const SetBloodGroupDropDown = (data) => {
    setbloodGroupDropDown(!bloodGroupDropDown);
    setMartialItemDropDown(false);
    setDropDown(false);
  };

  const SetMaritalStatus = (data) => {
    setMartialItemDropDown(data);
    setMartialItemDropDown(!martialItemDropDown);
    setDropDown(false);
    setbloodGroupDropDown(false);
  };
  const getMaritalStatusData = (item) => {
    // userMarritalStatus = item.val;
    // setMartialStatus(userMarritalStatus);
    item.map((value) => {
      setMartialStatus(value.name);
    });
    setMartialItemDropDown(!martialItemDropDown);
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    addressRef.current.focus();*/
    }
  };

  const onSubmit = () => {
    setIsError({});
    setErrorMessage({});
    let mobileRegx = /^\d{10}$/;
    let emailRegx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    let bloodRegex = /(A|B|AB|O)[+-]/;

    if (phone.trim().length === 0 || !mobileRegx.test(phone)) {
      setIsError({ phone: true });
      // scrollToScrollViewTop();
      setErrorMessage({ phone: "Enter Valid Mobile Number" });
      return false;
    } else if (email.trim().length === 0 || !emailRegx.test(email)) {
      setIsError({ email: true });
      // scrollToScrollViewTop();
      setErrorMessage({ email: "Enter Valid Email Address" });
      return false;
    } else if (Gender.trim().length === 0 || Gender === "") {
      setIsError({ Gender: true });
      setErrorMessage({ Gender: "Select Your Gender" });
      return false;
    } else if (!date) {
      setIsError({ date: true });
      setErrorMessage({ date: "Select the Date" });
      return false;
    } else if (bloodGroup.trim().length === 0) {
      setIsError({ bloodGroup: true });
      setErrorMessage({ bloodGroup: "Enter valid blood group" });
      return false;
    } else if (martialStatus.trim().length === 0 || martialStatus === "") {
      setIsError({ martialStatus: true });
      setErrorMessage({ martialStatus: "Select The Martial Status" });
      return false;
    } else if (address.trim().length === 0 || address === "") {
      setIsError({ address: true });
      setErrorMessage({ address: "Enter your address" });
      return false;
    } else if (uploadFile == "") {
      setIsError({ uploadFile: true });
      setErrorMessage({ uploadFile: "Please upload id proof document" });
    } else {
      var obj = {
        user_id: user_id,
        user_mobile_number: phone,
        user_email: email,
        user_gender: Gender,
        user_dob: date,
        user_blood_grp: bloodGroup,
        user_marital_status: martialStatus,
        user_address: address,
        user_address_doc: `data:${uploadFile[0].type};base64,${uploadFile[0].fileBase64}`,
      };
      setLoding(true);
      personalDetails(obj)
        .then((response) => {
          if (response) {
            successToast("success",response.message);
            setTimeout(() => {
              navigation.goBack();
            }, 500);
          }
        })
        .catch((error) => {
          errorToast("error","Oops! Something went wrong!!");
        })
        .finally(() => {
          setLoding(false);
        });
    }
  };

  const onEditSubmit = () => {
    setIsError({});
    setErrorMessage({});
    let mobileRegx = /^\d{10}$/;
    let emailRegx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    let bloodRegex = /(A|B|AB|O)[+-]/;

    if (phone.trim().length === 0 || !mobileRegx.test(phone)) {
      setIsError({ phone: true });
      // scrollToScrollViewTop();
      setErrorMessage({ phone: "Enter Phone number" });
      return false;
    } else if (email.trim().length === 0 || !emailRegx.test(email)) {
      setIsError({ email: true });
      // scrollToScrollViewTop();
      setErrorMessage({ email: "Enter the Email" });
      return false;
    } else if (Gender.trim().length === 0 || Gender === "") {
      setIsError({ Gender: true });
      setErrorMessage({ Gender: "Select the Gender" });
      return false;
    } else if (date === "") {
      setIsError({ date: true });
      setErrorMessage({ date: "Select from dropdown" });
      return false;
    } else if (bloodGroup.trim().length === 0) {
      setIsError({ bloodGroup: true });
      setErrorMessage({ bloodGroup: "Enter the blood group" });
      return false;
    } else if (martialStatus.trim().length === 0 || martialStatus === "") {
      setIsError({ martialStatus: true });
      setErrorMessage({ martialStatus: "Select the Martial Status" });
      return false;
    } else if (address.trim().length === 0 || address === "") {
      setIsError({ address: true });
      setErrorMessage({ address: "Enter your address" });
      return false;
    } else {
      var obj = {
        user_id: user_id,
        user_mobile_number: phone,
        user_email: email,
        user_gender: Gender,
        user_dob: date,
        user_blood_grp: bloodGroup,
        user_marital_status: martialStatus,
        user_address: address,
        user_address_doc: uploadFile[0]
          ? `data:${uploadFile[0].type};base64,${uploadFile[0].fileBase64}`
          : "",
      };
      setLoding(true);
      EditpersonalDetails(obj)
        .then((response) => {
          if (response.success) {
            successToast("success",response.message);
            setTimeout(() => {
              navigation.goBack();
            }, 500);
          } else {
            errorToast("error","Something went wrong!!");
          }
        })
        .catch((error) => {
          errorToast("error","Oops! Something went wrong!!");
        })
        .finally(() => {
          setLoding(false);
        });
    }
  };

  const phoneNumberRef = useRef(null);
  const emailRef = useRef(null);
  const genderRef = useRef(null);
  const bloodRef = useRef(null);
  const maritalRef = useRef(null);
  const addressRef = useRef(null);
  const datePicker2Ref = useRef(null);
  const handleSubmitFocus = (refs) => {
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    if (refs.current) {
      refs.current.focus();
    }*/
    }
  };

  const dropdownOff = () => {
    setMartialItemDropDown(false);
    setDropDown(false);
  };
  const genderCls = () => {
    setDropDown(false);
  };
  const bloodGroupCls = () => {
    setbloodGroupDropDown(false);
  };
  const martialCls = () => {
    setMartialItemDropDown(false);
  };

  const checkNumber = (number) => {
    setIsError({ phone: false });
    const pattern = /^[1-9][0-9]*$/;
    let result = pattern.test(number);
    if (!result) {
      setIsError({ phone: true });
      setErrorMessage({ phone: "Only number accepted" });
    }
    return result;
  };

  const emailCheck = (text) => {
    setIsError({ email: false });
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    let result = reg.test(text);
    if (!result) {
      setIsError({ email: true });
      setErrorMessage({ email: "enter proper email" });
    } else {
      setIsError({ email: false });
      setErrorMessage({ email: text });
    }
    return result;
  };

  // useEffect(() => {
  // 	Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
  // 	setTimeout(() => {
  // 		phoneNumberRef.current.focus();
  // 	}, 100);
  // }, []);

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

  const setSelectedDate = (item) => {
    let today = new Date();
    if (today < item) {
      warningToast("warning","Select only today or previous date");
      return;
    }
    setDate(item);
  };

  return (
    <>
      <CustomForm
        header={true}
        title={"Personal Details"}
        onPress={props.route.params?.item ? onEditSubmit : onSubmit}
        // onPress={onSubmit}
        marginBottom={50}
      >
        <Loader visible={isLoading} />
        <InputBox
          inputLabel={"Personal Phone number"}
          placeholder={"Personal Phone number"}
          refs={phoneNumberRef}
          // onChange={(val) => {
          // 	setPhone(val);
          // }}
          onChange={(val) => {
            checkNumber(val) ? setPhone(val) : setPhone("");
          }}
          edit={false}
          value={phone}
          onFocus={dropdownOff}
          isError={isError.phone}
          errors={errorMessage.phone}
          onSubmitEditing={() => handleSubmitFocus(emailRef)}
          keyboardType={"number-pad"}
          maxLength={10}
        />
        <InputBox
          inputLabel={"Personal Email"}
          placeholder={"Personal Email"}
          refs={emailRef}
          onChange={(val) => setEmail(val)}
          // onChange={(val) => {
          //   emailCheck(val) ? setEmail(val) : setEmail("");
          // }}
          edit={false}
          value={email}
          onFocus={dropdownOff}
          isError={isError.email}
          errors={errorMessage.email}
          onSubmitEditing={() => handleSubmitFocus(genderRef)}
          keyboardType={"email-address"}
        />
        <InputBox
          editable={false}
          inputLabel="Gender"
          value={Gender}
          refs={genderRef}
          placeholder="Choose Gender"
          rightElement={DropDown ? "menu-up" : "menu-down"}
          // DropDown={()=>{setIdProofDropDown(!idProofDropDown)}}
          DropDown={SetGenderDropDown}
          onFocus={SetGenderDropDown}
          errors={errorMessage.Gender}
          isError={isError.Gender}
        />
        <View>
          <DatePicker
            title="DOB"
            today={date}
            refs={datePicker2Ref}
            onChange={setSelectedDate}
            onOpen={dropdownOff}
            errors={errorMessage.date}
            isError={isError.date}
          />
        </View>
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
        {/* <NewDropdown
						title="Marital Status"
						data={martialItem}
						afterPressDropdown={getMaritalStatusData}
						errors={errorMessage.martialStatus}
						isError={isError.martialStatus}
					/> */}
        <InputBox
          editable={false}
          inputLabel="Marital Status"
          value={martialStatus}
          refs={maritalRef}
          placeholder="Enter Marital Status"
          rightElement={DropDown ? "menu-up" : "menu-down"}
          // DropDown={()=>{setIdProofDropDown(!idProofDropDown)}}
          DropDown={SetMaritalStatus}
          onFocus={SetMaritalStatus}
          errors={errorMessage.martialStatus}
          isError={isError.martialStatus}
        />
        <InputBox
          inputLabel={"Address"}
          placeholder={"Address"}
          refs={addressRef}
          onChange={(val) => setAddress(val)}
          value={address}
          onFocus={dropdownOff}
          isError={isError.address}
          errors={errorMessage.address}
        />
        <View>
          <Text
            style={[
              Styles.Label,
              { fontSize: FontSize.Antz_Body_Medium.fontSize, fontWeight: FontSize.Antz_Body_Medium.fontWeight, color: "grey" },
            ]}
          >
            Address Proof Doc Upload
          </Text>
          <DocumentUpload
            uploadable={true}
            type={"document"}
            items={uploadFile}
            onChange={(value) => {
              setUploadFile(value);
            }}
          />
          {isError.uploadFile ? (
            <Text style={Styles.errortext}>{errorMessage.uploadFile}</Text>
          ) : null}
          {uploadFile.length > 0 ? null : (
            <Image
              source={{ uri: props.route.params?.item?.user_address_doc }}
              style={{ height: 100, width: 100 }}
            />
          )}
        </View>
      </CustomForm>

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
    </>
  );
};
export default PersonalDetails;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    color: "grey",
    fontSize: FontSize.Antz_Medium_Medium.fontSize,
    fontWeight: FontSize.Antz_Medium_Medium_btn.fontWeight,
    // marginBottom: 20
  },
  body: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
    paddingVertical: 20,
    //    backgroundColor:"green"
  },
  headerTitle: {
    color: "grey",
    fontSize:  FontSize.Antz_Medium_Medium.fontSize,
    fontWeight: FontSize.Antz_Medium_Medium_btn.fontWeight,
    // marginBottom: 20
  },
  body: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "white",
  },

  Label: {
    // top: "3%",
    marginTop: 20,
  },
  nextBtn: {
    marginVertical: 12,
    backgroundColor: "#7CC0CF",
    width: "40%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 10,
  },
  btnText: {
    color: "white",
  },
  errortext: {
    color: "red",
  },
});
