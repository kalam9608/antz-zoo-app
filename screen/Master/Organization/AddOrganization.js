import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import CustomFormWithoutKeyboardScroll from "../../../components/CustomFormWithoutKeyboardScroll";
import Loader from "../../../components/Loader";
import InputBox from "../../../components/InputBox";

import { useRef } from "react";
import { Alert, BackHandler } from "react-native";
import DynamicAlert from "../../../components/DynamicAlert";
import { addOrganization } from "../../../services/Organization";
import { useSelector } from "react-redux";
import { useToast } from "../../../configs/ToastConfig";
// import Toast from 'react-native-simple-toast';

const AddOrganization = () => {
  const navigation = useNavigation();
  const [organizationName, setorganization] = useState("");
  const [loading, setLoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [description, setDescription] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const { showToast } = useToast();
  const saveorganizationData = () => {
    setIsError({});
    setErrorMessage({});
    if (organizationName.trim().length === 0) {
      setIsError({ organizationName: true });
      setErrorMessage({ organizationName: "Organization name is required" });
      return false;
    } else {
      let obj = {
        organization_name: organizationName,
        zoo_id: zooID,
        description: description,
      };
      setLoding(true);
      addOrganization(obj)
        .then((res) => {
          if (res.success == false) {
            // setAlertType("error");
            // setAlertMessage(res?.message);
            showToast("error", res?.message);
            // showAlert();
          } else {
            // setAlertType("success");
            // setAlertMessage("Organization added successfully");
            showToast("success", "Organization added successfully");
            navigation.goBack();
          }

          // Toast.showWithGravity(res.message, Toast.LONG, Toast.BOTTOM);
        })
        .catch((err) => {
          // setAlertType("error");
          // setAlertMessage("Something Went Wrong");
          showToast("error", "Something Went Wrong");
          // Toast.showWithGravity('Something Went Wrong', Toast.LONG, Toast.BOTTOM);
          setLoding(false);
        })
        .finally(() => {
          // showAlert();
          setLoding(false);
        });
    }
  };

  // const hideAlert = () => {
  //   setIsVisible(false);
  // };
  // const handleOK = () => {
  //   setIsVisible(false);
  //   if (alertType === "success") {
  //     navigation.goBack();
  //   }
  // };
  // const handleCancel = () => {
  //   setIsVisible(false);
  // };
  // const showAlert = () => {
  //   setIsVisible(true);
  // };



  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <CustomFormWithoutKeyboardScroll
            header={true}
            title={"Add Organization"}
            onPress={saveorganizationData}
          >
            <InputBox
              inputLabel={"Name"}
              placeholder={"Enter Organization Name"}
              onChange={(val) => setorganization(val)}
              value={organizationName}
              errors={errorMessage.organizationName}
              isError={!organizationName ? isError.organizationName : false}
              keybordType={"default"}
              autoFocus={false}
            />
            <InputBox
              inputLabel={"Organization Description"}
              multiline={true}
              numberOfLines={3}
              placeholder={"Enter Organization Description"}
              onChange={(val) => setDescription(val)}
              value={description}
            />
          </CustomFormWithoutKeyboardScroll>
          {/* <DynamicAlert
            isVisible={isVisible}
            onClose={hideAlert}
            type={alertType}
            title={alertType === "success" ? "Success" : "Error"}
            message={alertMessage}
            onOK={handleOK}
            isCancelButton={alertType === "success" ? true : false}
            onCancel={handleCancel}
          /> */}
        </>
      )}
    </>
  );
};

export default AddOrganization;
