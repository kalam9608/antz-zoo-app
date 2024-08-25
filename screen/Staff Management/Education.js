//Create by: Gaurav Shukla
//Create on :21/02/2023

import React, { useEffect, useState } from "react";
import CustomFormWithoutKeyboardScroll from "../../components/CustomFormWithoutKeyboardScroll";
import InputBox from "../../components/InputBox";
import {
  createEducationType,
  deleteEducationType,
  editEducationType,
} from "../../services/CreateEducationTypeService";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../components/Loader";
import { useToast } from "../../configs/ToastConfig";

const Education = (props) => {
  const { successToast, errorToast } = useToast();
  const navigation = useNavigation();
  const [educationTypeId] = useState(props?.route?.params?.type_id ?? null);
  const [educationType, setEducationType] = useState(
    props?.route?.params?.type_name ?? ""
  );
  const [isLoading, setLoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    educationType: null,
  });

  const [isError, setIsError] = useState({
    educationType: false,
  });

  const CreateTypeEdu = () => {
    setIsError({});
    setErrorMessage({});
    if (educationType.trim().length === 0) {
      setIsError({ educationType: true });
      setErrorMessage({ educationType: "Enter Education Type" });
      return false;
    } else {
      setLoding(true);
      let obj = {
        type_name: educationType,
      };
      createEducationType(obj)
        .then((res) => {
          if (res.success) {
            successToast("success", res.message);
            navigation.goBack();
          } else {
            errorToast("error", "Something Went Wrong");
          }
        })
        .catch((err) => {
          errorToast("error", "Oops! Something went wrong!!");
        })
        .finally(() => {
          setLoding(false);
        });
    }
  };

  const EditTypeEdu = () => {
    setIsError({});
    setErrorMessage({});
    if (educationType.trim().length === 0) {
      setIsError({ educationType: true });
      setErrorMessage({ educationType: "Enter Education Type" });
      return false;
    } else {
      setLoding(true);
      let obj = {
        id: educationTypeId,
        type_name: educationType,
      };
      editEducationType(obj)
        .then((res) => {
          if (res.success) {
            successToast("success", res.message);
            navigation.goBack();
          } else {
            errorToast("error", "Something Went Wrong");
          }
        })
        .catch((err) => {
          errorToast("error", "Oops! Something went wrong!!");
        })
        .finally(() => {
          setLoding(false);
        });
    }
  };

  const DeleteTypeEdu = () => {
    setLoding(true);
    let obj = {
      id: educationTypeId,
    };
    deleteEducationType(obj)
      .then((res) => {
        if (res.success) {
          successToast("success", res.message);
          navigation.goBack();
        } else {
          errorToast("error", "Something Went Wrong");
        }
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
      })
      .finally(() => {
        setLoding(false);
      });
  };

  return (
    <>
      <Loader visible={isLoading} />
      <CustomFormWithoutKeyboardScroll
        header={true}
        title={educationTypeId ? "Edit Education Type" : "Add Education Type"}
        onPress={educationTypeId ? EditTypeEdu : CreateTypeEdu}
        deleteButton={educationTypeId ? DeleteTypeEdu : undefined}
        deleteTitle={"Education Type"}
      >
        <InputBox
          inputLabel={"Enter Education Type"}
          placeholder={"Education Type"}
          autoFocus={false}
          onChange={(value) => setEducationType(value)}
          value={educationType}
          errors={errorMessage.educationType}
          isError={!educationType ? isError.educationType : false}
        />
      </CustomFormWithoutKeyboardScroll>
    </>
  );
};
export default Education;
