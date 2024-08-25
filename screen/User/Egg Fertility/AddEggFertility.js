import { StyleSheet, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import CustomForm from "../../../components/CustomForm";
import InputBox from "../../../components/InputBox";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../../components/Loader";
import { createEggFertility } from "../../../services/EggFartilityService";
import { useToast } from "../../../configs/ToastConfig";

const AddEggFertility = () => {
  const navigation = useNavigation();
  const { successToast, errorToast, } = useToast();
  const [fartilityCode, setfartilityCode] = useState("");
  const [fartilityDescription, setfartilityDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});

  const onSubmit = () => {
    setIsError({});
    setErrorMessage({});
    if (fartilityCode.trim().length === 0) {
      setIsError({ fartilityCode: true });
      setErrorMessage({ fartilityCode: "Name is required" });
      return false;
    } else if (fartilityDescription.trim().length === 0) {
      setIsError({ fartilityDescription: true });
      setErrorMessage({ fartilityDescription: "Enter zoo description" });
      return false;
    } else {
      let obj = {
        code: fartilityCode,
        description: fartilityDescription,
      };
      setIsLoading(true);
      createEggFertility(obj)
        .then((response) => {
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          errorToast("error","Oops! Something went wrong!!");
        })
        .finally(() => {
          setIsLoading(false);
          alert("Your data sucessfully save");
          navigation.goBack();
        });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader loaderSize="lg" />
      ) : (
        <CustomForm
          header={true}
          title={"Add Egg Fertility Type"}
          onPress={onSubmit}
          marginBottom={50}
        >
          <InputBox
            inputLabel={"Code"}
            placeholder={"Enter Code"}
            onChange={(val) => setfartilityCode(val)}
            value={fartilityCode}
            isError={isError.fartilityCode}
            errors={errorMessage.fartilityCode}
            keyboardType={"default"}
            // maxLength={10}
          />
          <InputBox
            inputLabel={"Description"}
            placeholder={"Enter description"}
            onChange={(val) => setfartilityDescription(val)}
            value={fartilityDescription}
            isError={isError.fartilityDescription}
            errors={errorMessage.fartilityDescription}
            keyboardType={"default"}
          />
        </CustomForm>
      )}
    </>
  );
};

export default AddEggFertility;

const styles = StyleSheet.create({
});
