import React, { useState } from "react";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import Loader from "../../components/Loader";
import CustomFormWithoutKeyboardScroll from "../../components/CustomFormWithoutKeyboardScroll";
import { useNavigation } from "@react-navigation/native";
import { addPrescriptionDosage } from "../../services/MedicalMastersService";
import { errorToast } from "../../utils/Alert";
import DynamicAlert from "../../components/DynamicAlert";
import { useToast } from "../../configs/ToastConfig";

const AddPrescriptionDosage = () => {
  const navigation = useNavigation();
  const [labelData, setLabelData] = useState("");
  const [descriptionData, setDescriptionData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const {successToast,errorToast,alertToast,warningToast} = useToast();
  // const hideAlert = () => {
  //   setIsVisible(false);
  // };
  // const showAlert = () => {
  //   setIsVisible(true);
  // };
  // const handleOK = () => {
  //   setIsVisible(false);
  //   if (alertType === "success") {
  //     navigation.goBack();
  //   }
  // };
  // const handleCancel = () => {
  //   navigation.goBack();
  //   setIsVisible(false);
  // };
  const onSubmit = () => {
    setIsError({});
    setErrorMessage({});
    if (labelData.trim().length === 0) {
      setIsError({ labelData: true });
      setErrorMessage({ labelData: "label is required" });
      return false;
    } else if (descriptionData.trim().length === 0) {
      setIsError({ descriptionData: true });
      setErrorMessage({ descriptionData: "Enter  description" });
      return false;
    } else {
      var obj = {
        label: labelData,
        description: descriptionData,
      };
      setIsLoading(true);
      addPrescriptionDosage(obj)
      .then((res) => {
        if (res?.success) {
          // setAlertType("success");
          // setAlertMessage();
          successToast("success",res?.message);
          navigation.goBack();
        } else {
          // setAlertType("error");
          errorToast("error",res?.message);
        }
      })
      .catch((err) => {
        // setAlertType("error");
        errorToast("error","Oops! Something went wrong!");
      })
      .finally(() => {
        // showAlert();
        setIsLoading(false);
      });
    }
  };

  return (
    <>
      <CustomFormWithoutKeyboardScroll
        header={true}
        title={"Add Prescription Dosage"}
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

        <InputBox
          inputLabel={"Description"}
          placeholder={"Description"}
          value={descriptionData}
          onChange={(val) => {
            setDescriptionData(val);
          }}
          isError={!descriptionData?isError.descriptionData:false}
          errors={errorMessage.descriptionData}
        />
      </CustomFormWithoutKeyboardScroll>
      {/* <DynamicAlert
        isVisible={isVisible}
        onClose={hideAlert}
        type={alertType}
        title={alertType === "success" ? "Success" : "Error"}
        message={alertMessage}
        onOK={handleOK}
        // isCancelButton={alertType === "success" ? true : false}
        onCancel={handleCancel}
      /> */}
    </>
  );
};

export default AddPrescriptionDosage;
