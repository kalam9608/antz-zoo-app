import React, { useState } from "react";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import Loader from "../../components/Loader";
import CustomFormWithoutKeyboardScroll from "../../components/CustomFormWithoutKeyboardScroll";
import { useNavigation } from "@react-navigation/native";
import { addInstitute } from "../../services/MedicalMastersService";
import { useToast } from "../../configs/ToastConfig";

const AddInstitute = () => {
  const navigation = useNavigation();
  const [labelData, setLabelData] = useState("");
  const [descriptionData, setDescriptionData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const { showToast, successToast, errorToast, alertToast, warningToast } = useToast();

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
      addInstitute(obj)
        .then((response) => {
          if (response.success){
            successToast("success",response.message);
            setIsLoading(false);
          }else{
          errorToast("error","Oops! Something went wrong!");
          }
        })
        .catch((error) => {
          setIsLoading(false);
          errorToast("error","Oops! Something went wrong!");
        })
        .finally(() => {
          setIsLoading(false);
          navigation.goBack();
        });
    }
  };

  return (
    <>
      <CustomFormWithoutKeyboardScroll
        header={true}
        title={"Add Institute"}
        onPress={onSubmit}
        marginBottom={60}
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
    </>
  );
};

export default AddInstitute;
