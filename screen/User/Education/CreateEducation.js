import React, { useEffect, useState, useRef } from "react";
import {
  addEducation,
  deletetEducation,
  editEducation,
  getListEducation,
} from "../../../services/EducationService";
import InputBox from "../../../components/InputBox";
import CustomForm from "../../../components/CustomForm";
import { useNavigation } from "@react-navigation/native";
import {
  getEducationType,
  getSection,
} from "../../../services/staffManagement/getEducationType";
import NewDropdown from "../../../components/Dropdown";
import Category from "../../../components/DropDownBox";
import Loader from "../../../components/Loader";
import { Alert, BackHandler, View, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import Modal from "react-native-modal";
import BottomSheetModalStyles from "../../../configs/BottomSheetModalStyles";
import { useToast } from "../../../configs/ToastConfig";
import { warningDailog } from "../../../utils/Alert";
import DialougeModal from "../../../components/DialougeModal";
import Config from "../../../configs/Config";

const CreateEducation = (props) => {
  const { height, width } = useWindowDimensions();
  const navigation = useNavigation();
  const [id, setId] = useState(
    props.route.params?.item?.item?.education_id ?? 0
  );
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const [eduValue, setEduValue] = useState(
    props.route.params?.item?.item?.education_type_name ?? ""
  );
  const [eduId, setEduId] = useState(
    props.route.params?.item?.item?.education_type ?? ""
  );
  const [user_id, setuser_id] = useState(
    props.route.params?.item?.item?.user_id ?? 0
  );
  const [institutionValue, setInstitutionValue] = useState(
    props.route.params?.item?.item?.institution_name ?? ""
  );
  const [passoutValue, setPassoutValue] = useState(
    props.route.params?.item?.item?.year_of_passout ?? ""
  );
  const [courseValue, setCourseValue] = useState(
    props.route.params?.item?.item?.course ?? ""
  );
  const [marksValue, setMarksValue] = useState(
    props.route.params?.item?.item?.marks ?? ""
  );
  const [isLoading, setIsLoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [dataEducationType, setdataEducationType] = useState([]);
  const [educationDown, setEducationDown] = useState(false);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  // const dynamicStyles = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  const [isModalVisible, setModalVisible] = useState(false);
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };
  const firstButtonPress = () => {
    deleteUserEducation();
    alertModalClose();
  };
  const secondButtonPress = () => {
    alertModalClose();
  };
  const validation = () => {
    setIsError({});
    setErrorMessage({});
    if (eduValue.length === 0) {
      setIsError({ eduValue: true });
      setErrorMessage({ eduValue: "Enter Education Type*" });
      return false;
    } else if (institutionValue.trim().length === 0) {
      setIsError({ institutionValue: true });
      setErrorMessage({ institutionValue: "Enter Institution Name*" });
      return false;
    } else if (passoutValue.trim().length === 0) {
      setIsError({ passoutValue: true });
      setErrorMessage({ passoutValue: "Enter Passout Year*" });
      return false;
    } else if (passoutValue.trim().length < 4) {
      setIsError({ passoutValue: true });
      setErrorMessage({ passoutValue: "Enter atleast 4 digits" });
      return false;
    } else if (courseValue.trim().length === 0) {
      setIsError({ courseValue: true });
      setErrorMessage({ courseValue: "Enter Course Name*" });
      return false;
    } else if (marksValue.trim().length === 0) {
      setIsError({ marksValue: true });
      setErrorMessage({ marksValue: "Enter marks here*" });
      return false;
    } else if (Number(marksValue) > 100) {
      setIsError({ marksValue: true });
      setErrorMessage({ marksValue: "Enter marks (1-100)%*" });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (
      eduValue ||
      institutionValue ||
      passoutValue ||
      courseValue ||
      marksValue
    ) {
      setIsError(false);
      setErrorMessage(false);
    }
  }, [eduValue, institutionValue, passoutValue, courseValue, marksValue]);

  const catPressed = (item) => {
    setEduId(item.map((u) => u.id).join(", "));
    setEduValue(item.map((u) => u.name).join(","));
    setEducationDown(false);
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    instituteRef.current.focus();*/
    }
  };

  const catClose = (item) => {
    setEducationDown(!educationDown);
  };

  useEffect(() => {
    setIsLoding(true);
    getEducationType()
      .then((res) => {
        let eduType = res.map((item) => {
          return {
            id: item.id,
            name: item.type_name,
            isSelect: eduId == item.id ? true : false,
          };
        });
        setdataEducationType(eduType);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
      })
      .finally(() => {
        setIsLoding(false);
        // handleSubmitFocus(educationRef);
      });
  }, []);

  const addEducationdata = () => {
    if (validation()) {
      var obj = {
        education_type: eduId,
        institution_name: institutionValue,
        year_of_passout: passoutValue,
        course: courseValue,
        marks: marksValue,
        user_id: user_id,
      };
      setIsLoding(true);
      addEducation(obj)
        .then((res) => {
          setIsLoding(false);
          if (!res.success) {
            errorToast("error", "something went wrong");
          } else {
            successToast("Success", res.message);
            setTimeout(() => {
              navigation.goBack();
            }, 500);
          }
        })
        .catch((error) => {
          setIsLoding(false);
          errorToast("error", "Oops! Something went wrong!!");
        });
    }
  };

  const editEducationData = () => {
    if (validation()) {
      var obj = {
        education_type: eduId,
        institution_name: institutionValue,
        year_of_passout: passoutValue,
        course: courseValue,
        marks: marksValue,
        user_id: user_id,
        id: id,
      };
      setIsLoding(true);
      editEducation(obj)
        .then((res) => {
          setIsLoding(false);
          if (!res.success) {
            errorToast("error", "something went wrong");
          } else {
            successToast("Success ", res.message);
            setTimeout(() => {
              navigation.goBack();
            }, 500);
          }
        })
        .catch((error) => {
          setIsLoding(false);
          errorToast("error", "Oops! Something went wrong!!");
        });
    }
  };

  const SetDropDown = (data) => {
    setEducationDown(!educationDown);
  };

  const educationRef = useRef(null);
  const instituteRef = useRef(null);
  const passoutRef = useRef(null);
  const courseRef = useRef(null);
  const marksRef = useRef(null);

  const handleSubmitFocus = (refs) => {
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    if (refs.current) {
      refs.current.focus();
    }*/
    }
  };

  const dropdownOff = () => {
    setEducationDown(false);
  };

  const checkNumber = (number) => {
    setIsError({ passoutValue: false });
    const pattern = /^[1-9][0-9]*$/;
    let result = pattern.test(number);
    if (!result) {
      setIsError({ passoutValue: true });
      setErrorMessage({ passoutValue: "Only number accepted" });
    } else if (Number(number) > 9999) {
      setIsError({ passoutValue: true });
      setErrorMessage({ passoutValue: "Only 4 digit accepted" });
    }
    return result;
  };

  const checkMarks = (number) => {
    setIsError({ marksValue: false });

    const pattern = /^[1-9][0-9]?.?[0-9]*$/;
    let result = pattern.test(number);

    if (!result) {
      setIsError({ marksValue: true });
      setErrorMessage({ marksValue: "Only number accepted" });
    } else if (Number(number) > 100) {
      setIsError({ marksValue: true });
      setErrorMessage({ marksValue: "Only (1-100)% accepted" });
    }
    return result;
  };

  const deleteApi = () => {
    // warningDailog(
    //   "Delete Education",
    //   "Do you want to delete this education details?",
    //   "YES",
    //   () => deleteUserEducation(),
    //   "NO"
    // );
    alertModalOpen();
  };

  const deleteUserEducation = () => {
    let obj = {
      id: id,
    };
    setIsLoding(true);
    deletetEducation(obj)
      .then((res) => {
        setIsLoding(false);
        if (!res.success) {
          errorToast("error", "something went wrong");
        } else {
          successToast("Success ", res.message);
          setTimeout(() => {
            navigation.goBack();
          }, 500);
        }
      })
      .catch((error) => {
        errorToast("error", "Oops! Something went wrong!!");
        setIsLoding(false);
      });
  };

  return (
    <>
      <CustomForm
        header={true}
        title={id > 0 ? "Edit Education" : "Add Education"}
        onPress={id > 0 ? editEducationData : addEducationdata}
        marginBottom={50}
        deleteButton={id > 0 ? deleteApi : null}
        deleteTitle={"User Education"}
      >
        <Loader visible={isLoading} />

        {/* <NewDropdown
              title="Education Type"
              data={dataEducationType}
              afterPressDropdown={getEducationTypeData}
              errors={errorMessage.eduValue}
              isError={isError.eduValue}
            /> */}

        <InputBox
          editable={false}
          inputLabel="Education Type"
          value={eduValue}
          refs={educationRef}
          // autoFocus={true}
          placeholder="Select Section Name"
          rightElement={educationDown ? "menu-up" : "menu-down"}
          DropDown={SetDropDown}
          onFocus={SetDropDown}
          errors={errorMessage.eduValue}
          isError={isError.eduValue}
        />

        <InputBox
          inputLabel={"Enter institution name"}
          placeholder={"Enter institution name"}
          refs={instituteRef}
          onChange={(val) => {
            setInstitutionValue(val);
          }}
          onFocus={dropdownOff}
          value={institutionValue}
          defaultValue={institutionValue != null ? institutionValue : null}
          onSubmitEditing={() => handleSubmitFocus(passoutRef)}
          isError={isError.institutionValue}
          errors={errorMessage.institutionValue}
          keyboardType={"default"}
        />
        <InputBox
          inputLabel={"Enter year of passout"}
          placeholder={"Enter year of passout"}
          refs={passoutRef}
          // onChange={(val) => setPassoutValue(val)}
          onChange={(val) => {
            checkNumber(val) ? setPassoutValue(val) : setPassoutValue("");
          }}
          onFocus={dropdownOff}
          value={passoutValue}
          defaultValue={passoutValue != null ? passoutValue : null}
          isError={isError.passoutValue}
          errors={errorMessage.passoutValue}
          onSubmitEditing={() => handleSubmitFocus(courseRef)}
          keyboardType={"numeric"}
          maxLength={4}
        />
        <InputBox
          inputLabel={"Enter course name"}
          placeholder={"Enter course name"}
          refs={courseRef}
          onChange={(val) => setCourseValue(val)}
          onFocus={dropdownOff}
          value={courseValue}
          defaultValue={courseValue != null ? courseValue : null}
          isError={isError.courseValue}
          errors={errorMessage.courseValue}
          onSubmitEditing={() => handleSubmitFocus(marksRef)}
          keyboardType={"default"}
        />
        <InputBox
          inputLabel={"Enter your marks"}
          placeholder={"Enter marks in %"}
          refs={marksRef}
          // onChange={(val) => setMarksValue(val)}
          onChange={(val) => {
            checkMarks(val) ? setMarksValue(val) : setMarksValue("");
          }}
          onFocus={dropdownOff}
          value={marksValue}
          defaultValue={marksValue != null ? marksValue : null}
          isError={isError.marksValue}
          errors={errorMessage.marksValue}
          keyboardType={"numeric"}
          maxLength={5}
        />
      </CustomForm>

      {educationDown ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={educationDown}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={catClose}
          >
            <Category
              categoryData={dataEducationType}
              onCatPress={catPressed}
              heading={"Choose Education Type"}
              onClose={catClose}
              isMulti={false}
            />
          </Modal>
        </View>
      ) : null}
      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={"Do you want to delete this education details?"}
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
    </>
  );
};

export default CreateEducation;
