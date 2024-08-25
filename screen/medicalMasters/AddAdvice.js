import React, { useState } from "react";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import Loader from "../../components/Loader";
import CustomFormWithoutKeyboardScroll from "../../components/CustomFormWithoutKeyboardScroll";
import { useNavigation } from "@react-navigation/native";
import { addAdvice } from "../../services/MedicalMastersService";
import DynamicAlert from "../../components/DynamicAlert";
import { useToast } from "../../configs/ToastConfig";

const AddAdviceData = () => {
  const navigation = useNavigation();
  const [labelData, setLabelData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const { showToast, successToast, errorToast, alertToast, warningToast } = useToast();

  const hideAlert = () => {
    setIsVisible(false);
  };
  const showAlert = () => {
    setIsVisible(true);
  };
  const handleOK = () => {
    setIsVisible(false);
    if (alertType === "success") {
      navigation.goBack();
    }
  };
  const handleCancel = () => {
    navigation.goBack();
    setIsVisible(false);
  };
  const onSubmit = () => {
    setIsError({});
    setErrorMessage({});
    if (labelData.trim().length === 0) {
      setIsError({ labelData: true });
      setErrorMessage({ labelData: "label is required" });
      return false;
    } else {
      var obj = {
        label: labelData,
        // description: descriptionData,
      };
      setIsLoading(true);
      addAdvice(obj)
      .then((res) => {
        if (res?.success) {
          successToast("success",res?.message);
          navigation.goBack();
        } else {
          errorToast("error",res?.message);
        }
      })
      .catch((err) => {
        setAlertType("error");
        errorToast("error","Oops! Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  };

  return (
    <>
      <CustomFormWithoutKeyboardScroll
        header={true}
        title={"Add Advice"}
        onPress={onSubmit}
        marginBottom={50}
      >
        <Loader visible={isLoading} />

        <InputBox
          inputLabel="Label"
          placeholder="Label"
          value={labelData}
          onChange={(val) => {
            setLabelData(val);
          }}
          isError={!labelData?isError.labelData:false}
          errors={errorMessage.labelData}
        />
      </CustomFormWithoutKeyboardScroll>
  
    </>
  );
};

export default AddAdviceData;
