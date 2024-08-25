import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import CustomFormWithoutKeyboardScroll from "../../components/CustomFormWithoutKeyboardScroll";
import Loader from "../../components/Loader";
import InputBox from "../../components/InputBox";
import { createDesignation } from "../../services/staffManagement/DesignationService";
import { useRef } from "react";
import { Alert, BackHandler } from "react-native";
import DynamicAlert from "../../components/DynamicAlert";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import { useSelector } from "react-redux";

const CreateDesignation = () => {
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const navigation = useNavigation();
  const [designationName, setDesignation] = useState("");
  const [designationCode, setDesignationCode] = useState("");
  const [loading, setLoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const saveDesignationData = () => {
    setIsError({});
    setErrorMessage({});
    if (designationName.trim().length === 0) {
      setIsError({ designationName: true });
      setErrorMessage({ designationName: "Designation name is required" });
      return false;
    } else if (designationCode.trim().length === 0) {
      setIsError({ designationCode: true });
      setErrorMessage({ designationCode: "Designation code is required" });
      return false;
    } else {
      let obj = {
        designation_name: designationName,
        designation_code: designationCode,
      };
      setLoding(true);
      createDesignation(obj)
        .then((res) => {
          successToast("success", "Designation added successfully");
          navigation.goBack();
        })
        .finally(() => {
          setLoding(false);
          // setAlertType("success");
          // setAlertMessage("Designation added successfully");
          // showAlert();
        })
        .catch((err) => {
          errorToast("error", "Oops! Something went wrong!!");
        });
    }
  };
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const handleSubmitEditing = (refs) => {
    if (refs.current) {
      refs.current.focus();
    }
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };


  const firstButtonPress = () => {
    alertModalClose();
    navigation.goBack() 
  };
  const secondButtonPress = () => {
    alertModalClose();
  };
  useEffect(() => {
    const backAction = () => {
      alertModalOpen()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <CustomFormWithoutKeyboardScroll
            header={true}
            title={"Designation"}
            onPress={saveDesignationData}
          >
            <InputBox
              inputLabel={"Name"}
              placeholder={"Enter Designation Name"}
              onChange={(val) => setDesignation(val)}
              value={designationName}
              errors={errorMessage.designationName}
              isError={!designationName ? isError.designationName : false}
              keybordType={"default"}
              autoFocus={false}
              // onSubmitEditing={() => handleSubmitEditing(input2Ref)}
            />
            <InputBox
              refs={input2Ref}
              inputLabel={"Designation Code"}
              placeholder={"Enter Designation  "}
              onChange={(val) => setDesignationCode(val)}
              value={designationCode}
              errors={!designationCode ? errorMessage.designationCode : false}
              isError={!designationCode ? isError.designationCode : false}
              // onSubmitEditing={() => handleSubmitEditing(input3Ref)}
            />
          </CustomFormWithoutKeyboardScroll>
          <DialougeModal
            isVisible={isModalVisible}
            alertType={Config.ERROR_TYPE}
            title={"Are you sure you want to go back?"}
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
      )}
    </>
  );
};

export default CreateDesignation;
