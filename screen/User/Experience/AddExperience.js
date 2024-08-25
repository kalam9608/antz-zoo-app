import React, { useEffect, useState } from "react";
import { StyleSheet, Alert, View, BackHandler } from "react-native";
import CustomForm from "../../../components/CustomForm";
import InputBox from "../../../components/InputBox";
import DatePicker from "../../../components/DatePicker";
import {
  addExperience,
  deleteExperience,
  editExperience,
} from "../../../services/ExperienceService";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../../components/Loader";
import { useRef } from "react";
import moment from "moment";
import { warningDailog } from "../../../utils/Alert";
import FontSize from "../../../configs/FontSize";
import Spacing from "../../../configs/Spacing";
import { useToast } from "../../../configs/ToastConfig";
import DialougeModal from "../../../components/DialougeModal";
import Config from "../../../configs/Config";
import { useSelector } from "react-redux";

const AddExperience = (props) => {
  const { successToast, errorToast, warningToast } = useToast();
  const user_id = props.route.params?.item.user_id;
  const navigation = useNavigation();
  const [id, setId] = useState(props.route.params?.item.experience_id ?? 0);
  const [instituteName, setInstituteName] = useState(
    props.route.params?.item.institution_name ?? ""
  );

  const [instituteLocation, setInstituteLocation] = useState(
    props.route.params?.item.institution_location ?? ""
  );
  const [joinDate, setJoinDate] = useState(
    props.route.params?.item.join_date != "0000-00-00"
      ? moment(props.route.params?.item.join_date)
      : ""
  );
  const [endDate, setEndDate] = useState(
    props.route.params?.item.end_date != "0000-00-00"
      ? moment(props.route.params?.item.end_date)
      : ""
  );
  const [indusTRY, setIndustry] = useState(
    props.route.params?.item.industry ?? ""
  );
  const [designaTION, setDesignation] = useState(
    props.route.params?.item.designation ?? ""
  );
  const [totalWorkExp, setTotalWorkExp] = useState(
    props.route.params?.item.total_work_experience ?? ""
  );

  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };
  const firstButtonPress = () => {
    deleteExperienceData();
    alertModalClose();
  };
  const secondButtonPress = () => {
    alertModalClose();
  };
  const validation = () => {
    if (instituteName.trim().length === 0) {
      setIsError({ instituteName: true });
      setErrorMessage({ instituteName: "This field required" });
      return false;
    } else if (instituteLocation.trim().length === 0) {
      setIsError({ instituteLocation: true });
      setErrorMessage({ instituteLocation: "This field required" });
      return false;
    } else if (indusTRY.trim().length === 0) {
      setIsError({ indusTRY: true });
      setErrorMessage({ indusTRY: "This field required" });
      return false;
    } else if (designaTION.trim().length === 0) {
      setIsError({ designaTION: true });
      setErrorMessage({ designaTION: "This field required" });
      return false;
    } else if (totalWorkExp.trim().length === 0) {
      setIsError({ totalWorkExp: true });
      setErrorMessage({ totalWorkExp: "This field required" });
      return false;
    } else if (joinDate === "") {
      setIsError({ joinDate: true });
      setErrorMessage({ joinDate: "This field required" });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (
      instituteName ||
      instituteLocation ||
      indusTRY ||
      designaTION ||
      totalWorkExp ||
      joinDate
    ) {
      setIsError(false);
      setErrorMessage(false);
    }
  }, [
    instituteName,
    instituteLocation,
    indusTRY,
    designaTION,
    totalWorkExp,
    joinDate,
  ]);

  const deleteApi = () => {
    alertModalOpen();
    // warningDailog(
    // "Delete Experience",
    //   "Do you want to delete this experience details?",
    //   "YES",
    //   () => deleteExperienceData(),
    //   "NO"
    // );
  };

  const deleteExperienceData = () => {
    setIsLoading(true);
    let obj = {
      id: id,
    };
    deleteExperience(obj)
      .then((res) => {
        setIsLoading(false);
        if (!res.success) {
          errorToast("error", "Something went wrong!!");
        } else {
          successToast("Success", res.message);
          setTimeout(() => {
            navigation.goBack();
          }, 500);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        errorToast("error", "Oops! Something went wrong!!");
      });
  };

  const editOnSubmit = () => {
    if (validation()) {
      var obj = {
        id: id,
        institution_name: instituteName,
        institution_location: instituteLocation,
        industry: indusTRY,
        designation: designaTION,
        total_work_experience: totalWorkExp,
        join_date: joinDate,
        end_date: endDate,
        user_id: user_id,
      };
      setIsLoading(true);
      editExperience(obj)
        .then((res) => {
          if (!res.success) {
            errorToast("error", "Oops! Something went wrong!!");
          } else {
            successToast("Success", res.message);
            setTimeout(() => {
              navigation.goBack();
            }, 500);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          errorToast("error", "Oops! Something went wrong!!");
        });
    }
  };

  const onSubmit = () => {
    if (validation()) {
      var obj = {
        institution_name: instituteName,
        institution_location: instituteLocation,
        industry: indusTRY,
        designation: designaTION,
        total_work_experience: totalWorkExp,
        join_date: joinDate,
        end_date: endDate,
        user_id: user_id,
      };
      setIsLoading(true);
      addExperience(obj)
        .then((res) => {
          if (!res.success) {
            errorToast("error", "Oops! Something went wrong!!");
            console.log("res====>",res)
          } else {
            successToast("Success ", res.message);
            setTimeout(() => {
              navigation.goBack();
            }, 500);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          errorToast("error", "Oops! Something went wrong!!");
          console.log("error===>",error)
        });
    }
  };

  const InstituteLocation = useRef(null);
  const IndustryName = useRef(null);
  const Designation = useRef(null);
  const WorkExperience = useRef(null);
  const JoinDate = useRef(null);
  const EndDate = useRef(null);

  const handleSubmitFocus = (refs) => {
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
		if (refs.current) {
			refs.current.focus();
		}*/
    }
  };
  const dropdownoff = () => {};

  const setSelectedDate = (item) => {
    let today = new Date();
    if (today > item) {
      warningToast("warning", "Select only Join Date or Later Date");
      return;
    }
    setEndDate(item);
  };
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);

  return (
    <>
      <Loader visible={isLoading} />
      <CustomForm
        header={true}
        title={id > 0 ? "Edit Experience" : "Add Experience"}
        onPress={id > 0 ? editOnSubmit : onSubmit}
        deleteButton={id > 0 ? deleteApi : null}
        deleteTitle={"Work Experience"}
      >
        <InputBox
          inputLabel={"Company Name"}
          placeholder={"Company Name"}
          onChange={(val) => {
            setInstituteName(val);
          }}
          defaultValue={instituteName != null ? instituteName : null}
          value={instituteName}
          isError={isError.instituteName}
          errors={errorMessage.instituteName}
          onSubmitEditing={() => handleSubmitFocus(InstituteLocation)}
        />
        <InputBox
          refs={InstituteLocation}
          inputLabel={"Company Location"}
          placeholder={"Company Location"}
          onChange={(val) => {
            setInstituteLocation(val);
          }}
          defaultValue={instituteLocation != null ? instituteLocation : null}
          value={instituteLocation}
          isError={isError.instituteLocation}
          errors={errorMessage.instituteLocation}
          onSubmitEditing={() => handleSubmitFocus(IndustryName)}
        />
        <InputBox
          refs={IndustryName}
          inputLabel={"Industry Type"}
          placeholder={"Industry Type"}
          onChange={(val) => {
            setIndustry(val);
          }}
          defaultValue={indusTRY != null ? indusTRY : null}
          value={indusTRY}
          isError={isError.indusTRY}
          errors={errorMessage.indusTRY}
          onSubmitEditing={() => handleSubmitFocus(Designation)}
        />
        <InputBox
          refs={Designation}
          inputLabel={"Designation"}
          placeholder={"Designation"}
          onChange={(val) => {
            setDesignation(val);
          }}
          defaultValue={designaTION != null ? designaTION : null}
          value={designaTION}
          isError={isError.designaTION}
          errors={errorMessage.designaTION}
          onSubmitEditing={() => handleSubmitFocus(WorkExperience)}
        />
        <InputBox
          refs={WorkExperience}
          inputLabel={"Total work experience"}
          placeholder={"Total work experience"}
          onChange={(val) => {
            setTotalWorkExp(val);
          }}
          defaultValue={totalWorkExp != null ? totalWorkExp : null}
          value={totalWorkExp}
          isError={isError.totalWorkExp}
          errors={errorMessage.totalWorkExp}
          // onSubmitEditing={() => handleSubmitFocus(JoinDate)}
        />
        <DatePicker
          today={joinDate}
          onChange={(item) => {
            setJoinDate(item);
          }}
          title="Join Date"
          onOpen={() => {}}
          // maximumDate={new Date()} 
          isError={isError.joinDate}
          errors={errorMessage.joinDate}
        />

        <DatePicker
          today={endDate}
          onChange={setSelectedDate}
          title="End Date"
          onOpen={() => {}}
          // maximumDate={new Date()} 
        />
      </CustomForm>
      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={"Do you want to delete this experience details?"}
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

const styles = StyleSheet.create({});

export default AddExperience;
