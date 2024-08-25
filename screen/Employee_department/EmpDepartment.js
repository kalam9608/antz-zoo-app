import React, { useState, useRef } from "react";
import CustomFormWithoutKeyboardScroll from "../../components/CustomFormWithoutKeyboardScroll";
import InputBox from "../../components/InputBox";
import { createDepartment } from "../../services/DepartmentServices";
import Loader from "../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { useSelector } from "react-redux";
import { useToast } from "../../configs/ToastConfig";

const EmpDepartment = () => {
  const { successToast, errorToast } = useToast();
  const navigation = useNavigation();
  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [isLoading, setLoding] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const clientID = useSelector((state) => state.UserAuth.client_id);

  const [errorMessage, setErrorMessage] = useState({
    deptName: null,
    deptCode: null,
  });
  const [isError, setIsError] = useState({
    deptName: false,
    deptCode: false,
  });

  const checkDepartmentName = (str) => {
    let res = str.match(/^[A-Za-z/ /]+$/) ? false : true;
    return res;
  };

  const validation = () => {
    if (deptName.trim().length === 0) {
      setIsError({ deptName: true });
      setErrorMessage({ deptName: "Department name is required" });
      return false;
    } else if (checkDepartmentName(deptName)) {
      setIsError({ deptName: true });
      setErrorMessage({
        deptName: "department name can contains only alphabets",
      });
      return false;
    } else if (deptCode.trim().length === 0) {
      setIsError({ deptCode: true });
      setErrorMessage({ deptCode: "Department code is required" });
      return false;
    }
    return true;
  };

  const saveDepartmentData = () => {
    if (validation()) {
      let obj = {
        dept_name: deptName,
        dept_code: deptCode,
        client_id: clientID,
      };
      setLoding(true);
      createDepartment(obj)
        .then((res) => {})
        .catch((err) => {
          errorToast("error","Oops! Something went wrong!!");
        })
        .finally(() => {
          setLoding(false);
    
          // setAlertMessage("Department Added Successfully");
          // showAlert();
        });
      setDeptCode("");
      setDeptName("");
      setIsError("");
      setErrorMessage("");
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
  const deptRef = useRef(null);
  const deptcodeRef = useRef(null);
  const handleSubmitFocus = (refs) => {
    if (refs.current) {
      refs.current.focus();
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader loaderSize="lg" />
      ) : (
        <CustomFormWithoutKeyboardScroll
          header={true}
          title={"Employee Department"}
          onPress={saveDepartmentData}
        >
          <InputBox
            inputLabel={"Department Name"}
            placeholder={"Enter Department Name"}
            autoFocus={false}
            onChange={(val) => setDeptName(val)}
            value={deptName}
            // onSubmitEditing={()=>handleSubmitFocus(deptcodeRef)}
            errors={errorMessage.deptName}
            isError={!deptName?isError.deptName:false}
            //keyboardType={"alpha"}
          />
          <InputBox
            refs={deptcodeRef}
            inputLabel={"Department Code"}
            placeholder={"Enter Department Code"}
            onChange={(val) => setDeptCode(val)}
            value={deptCode}
            errors={errorMessage.deptCode}
            isError={!deptCode?isError.deptCode:false}
            //keyboardType={"alpha"}
          />
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
        </CustomFormWithoutKeyboardScroll>
      )}
    </>
  );
};

export default EmpDepartment;
