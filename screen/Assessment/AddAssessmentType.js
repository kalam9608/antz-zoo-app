import { BackHandler, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import CustomForm from "../../components/CustomForm";
import ModalFilterComponent from "../../components/ModalFilterComponent";
import InputBox from "../../components/InputBox";
import { useSelector } from "react-redux";
import Spacing from "../../configs/Spacing";
import { Checkbox } from "react-native-paper";
import FontSize from "../../configs/FontSize";
import { useNavigation } from "@react-navigation/native";
import AssessmentAddListItem from "../../components/AssessmentAddListItem";
import {
  addNewAssessmentType,
  getAssessmentMasterDataList,
  updateAssessmentType,
} from "../../services/assessmentService/AssessmentServiceApi";
import Loader from "../../components/Loader";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";

const AddAssessmentType = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const [assessmentCategoryOpen, setAssessmentCategoryOpen] = useState(false);
  const [assessmentCategoryID, setAssessmentCategoryID] = useState(
    props?.route?.params?.assessmentDetails?.assessment_category_id
      ? props?.route?.params?.assessmentDetails?.assessment_category_id
      : ""
  );
  const [assessmentCategory, setAssessmentCategory] = useState(
    props?.route?.params?.assessmentDetails?.label
      ? props?.route?.params?.assessmentDetails?.label
      : ""
  );
  const [assessmentName, setAssessmentName] = useState(
    props?.route?.params?.assessmentDetails?.assessments_type_label ?? ""
  );
  const [assessmentDescription, setAssessmentDescriptione] = useState(
    props?.route?.params?.assessmentDetails?.description
      ? props?.route?.params?.assessmentDetails?.description
      : ""
  );
  const [checked, setChecked] = React.useState(1);

  const [assessmentResponseOpen, setAssessmentResponseOpen] = useState(false);
  const [assessmentResponseID, setAssessmentResponseID] = useState(
    props?.route?.params?.assessmentDetails?.response_type
      ? props?.route?.params?.assessmentDetails?.response_type
      : ""
  );

  const responseTypeObj = {
    id: props?.route?.params?.assessmentDetails?.response_type,
    name: props?.route?.params?.assessmentDetails?.response_type_label,
  };
  const [assessmentResponse, setAssessmentResponse] = useState(
    responseTypeObj ? responseTypeObj : ""
  );
  const [assessmentMeasurementOpen, setAssessmentMeasurementOpen] =
    useState(false);
  const [assessmentMeasurementID, setAssessmentMeasurementID] = useState(
    props?.route?.params?.assessmentDetails?.response_type == "numeric_value"
      ? props?.route?.params?.assessmentDetails?.measurement_type
      : ""
  );
  const [assessmentMeasurement, setAssessmentMeasurement] = useState(
    props?.route?.params?.assessmentDetails?.response_type == "numeric_value"
      ? props?.route?.params?.assessmentDetails?.measurement_type_label
      : ""
  );
  const [listItemObj, setListItemObj] = useState(
    props?.route?.params?.assessmentDetails?.response_type == "list"
      ? props?.route?.params?.assessmentDetails?.default_values?.map(
          (item) => ({
            label: item.label,
            id : item.id
          })
        )
      : [{ label: "" }]
  );
  const [listItemText, setListItemText] = useState("");
  const [enableInputBox, setEnableInputBox] = useState(false);

  const [listNumericScaleText, setListNumericScaleText] = useState("");
  const [listNumericScaleObj, setListNumericScaleObj] = useState(
    props?.route?.params?.assessmentDetails?.response_type == "numeric_scale"
      ? props?.route?.params?.assessmentDetails?.default_values?.map(
          (item) => ({
            id : item.id,
            label: item.label,
            order: item.order,
          })
        )
      : [{ order: 1, label: "" }]
  );
  const [categoryListData, setCategoryListData] = useState([]);
  const [responseTypeData, setResponseTypeData] = useState([]);
  const [measurmentTypeData, setMeasurmentTypeData] = useState([]);
  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  // This State and function is used for asking permission you want to go back or not
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  const firstButtonPress = () => {
    navigation.goBack();
    alertModalClose();
  };
  const secondButtonPress = () => {
    alertModalClose();
  };
  useEffect(() => {
    const backAction = () => {
      alertModalOpen();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  // These below function is used for Category modal
  const assessementCategoryToggal = () => {
    setAssessmentCategoryOpen(!assessmentCategoryOpen);
  };
  const assessmentCategoryClose = () => {
    setAssessmentCategoryOpen(false);
  };
  const isAssessmentCategoryClick = (id) => {
    return assessmentCategoryID == id;
  };
  const assessmentCategoryClick = (item) => {
    setAssessmentCategoryOpen(!assessmentCategoryOpen);
    setAssessmentCategory(item.name);
    setAssessmentCategoryID(item.id);
  };

  // These below function is used for Response modal
  const assessementResponseToggal = () => {
    setAssessmentResponseOpen(!assessmentResponseOpen);
  };
  const assessmentResponseClose = () => {
    setAssessmentResponseOpen(false);
  };
  const isAssessmentResponseClick = (id) => {
    return assessmentResponseID == id;
  };
  const assessmentResponseClick = (item) => {
    setAssessmentResponseOpen(!assessmentResponseOpen);
    setAssessmentResponse(item);
    setAssessmentResponseID(item.id);
    if (item?.id == "numeric_value") {
      setListItemObj([{ label: "" }]);
      setListNumericScaleObj([{ order: 1, label: "" }]);
    } else if (item?.id == "list") {
      setListNumericScaleObj([{ order: 1, label: "" }]);
    } else if (item?.id == "numeric_scale") {
      setListItemObj([{ label: "" }]);
    }
  };
  // These below function is used for Measurement modal
  const assessementMeasurementToggal = () => {
    setAssessmentMeasurementOpen(!assessmentMeasurementOpen);
  };
  const assessmentMeasurementClose = () => {
    setAssessmentMeasurementOpen(false);
  };
  const isAssessmentMeasurementClick = (id) => {
    return assessmentMeasurementID == id;
  };
  const assessmentMeasurementClick = (item) => {
    setAssessmentMeasurementOpen(!assessmentMeasurementOpen);
    setAssessmentMeasurement(item.name);
    setAssessmentMeasurementID(item.id);
  };
  const latestInputRef = useRef(null);
  const latestInputScaleRef = useRef(null);
  const handleListItemAdd = (type) => {
    if (type == "list") {
      setListItemObj([...listItemObj, { label: "" }]);
    } else if (type == "Numeric") {
      setListNumericScaleObj([
        ...listNumericScaleObj,
        {
          label: "",
          order: listNumericScaleObj.length + 1,
        },
      ]);
    }
  };

  //-----
  useEffect(() => {
    if (latestInputRef.current) {
      latestInputRef.current.focus();
    }
    if(latestInputScaleRef.current){
      latestInputScaleRef.current.focus();
    }
  }, [listItemObj,listNumericScaleObj]);
  //-----

  // Below Function is ussed for Handle Add list Time  input
  const InputListItemUpdate = (text, index) => {
    const newListItemObj = listItemObj?.map((item, i) => {
      if (i === index) {
        return { ...item, label: text };
      }
      return item;
    });
    setListItemObj(newListItemObj);
  };
  const handleListItemRemove = (index) => {
    const newListItemObj = listItemObj?.map((listItem, i) => {
      if (i === index) {
        return { ...listItem, label: "" };
      }
      return listItem;
    });
    setListItemObj(newListItemObj);
  };
  const handleInputBoxRemove = (indexData) => {
    const listObjRemove = listItemObj?.filter(
      (item, index) => index !== indexData
    );
    setListItemObj(listObjRemove);
  };
  const handleNumericInputBoxRemove = (indexData) => {
    const numericObjRemove = listNumericScaleObj?.filter(
      (item, index) => index !== indexData
    );
    setListNumericScaleObj(numericObjRemove);
  };
  // Below Function is ussed for Handle Numeric value input
  const handleNumericScaleRemove = (index) => {
    const newListItemObj = listNumericScaleObj?.map((numericScale, i) => {
      if (i === index) {
        return { ...numericScale, label: "" };
      }
      return numericScale;
    });
    setListNumericScaleObj(newListItemObj);
  };
  const InputTextNumericUpdate = (text, index) => {
    const newNumericScaleObj = listNumericScaleObj?.map((item, i) => {
      if (i === index) {
        return { ...item, label: text };
      }
      return item;
    });
    setListNumericScaleObj(newNumericScaleObj);
  };

  const handleCheckboxToggle = () => {
    setChecked(checked == 0 ? 1 : 0);
  };

  // Calling Master data api in this useEffect
  useEffect(() => {
    setIsLoading(true);
    masterDataApiCall();
  }, []);
  const masterDataApiCall = () => {
    getAssessmentMasterDataList()
      .then((res) => {
        if (res.success) {
          setCategoryListData(
            res?.data?.assessment_category?.map((item) => ({
              id: item.assessment_category_id,
              name: item.label,
            }))
          );
          setResponseTypeData(
            res?.data?.response_type?.map((item) => ({
              id: item.key,
              name: item.label,
            }))
          );
          setMeasurmentTypeData(
            res?.data?.measurement_types?.map((item) => ({
              id: item.key,
              name: item.label,
            }))
          );
          setAssessmentCategoryID(
            props?.route?.params?.assessmentDetails?.assessment_category_id
              ? props?.route?.params?.assessmentDetails?.assessment_category_id
              : res?.data?.assessment_category[0]?.assessment_category_id
          );
          setAssessmentCategory(
            props?.route?.params?.assessmentDetails?.label
              ? props?.route?.params?.assessmentDetails?.label
              : res?.data?.assessment_category[0]?.label
          );
        }
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", "Something went wrong");
      })
      .finally((e) => {
        setIsLoading(false);
      });
  };

  // Check Validation function for form
  useEffect(() => {
    if (assessmentName) {
      setIsError({ assessmentName: false });
    }
    if (assessmentResponse) {
      setIsError({ responseType: false });
    }
    if (listItemObj) {
      let isEmptyLabel = false;

      listItemObj.forEach((item) => {
        if (item.label.trim() === "") {
          isEmptyLabel = true;
        }
      });

      if (isEmptyLabel) {
        setIsError({ listItem: false });
      }
    }

    if (listNumericScaleObj) {
      let isEmptyNumericScale = false;
      listNumericScaleObj.forEach((item) => {
        if (item.label.trim() === "") {
          isEmptyNumericScale = true;
        }
      });
      if (isEmptyNumericScale) {
        setIsError({ numericScale: false });
      }
    }
  }, [assessmentName, assessmentResponse, listItemObj, listNumericScaleObj]);

  const Validation = () => {
    setIsError({});
    setErrorMessage({});
    if (assessmentName.length == 0) {
      setIsError({ assessmentName: true });
      setErrorMessage({ assessmentName: "Assessment Name is Required" });
      return false;
    } else if (assessmentResponse.length == 0) {
      setIsError({ responseType: true });
      setErrorMessage({ responseType: "Response Type is Required" });
      return false;
    } else if (assessmentResponse.id !== "") {
      if (
        assessmentResponse.id == "numeric_value" &&
        assessmentMeasurement.length == 0
      ) {
        setIsError({ measurement: true });
        setErrorMessage({ measurement: "Measurement Type is Required" });
        return false;
      } else if (assessmentResponse.id == "list") {
        let isEmptyListLabel = false;

        listItemObj.forEach((item) => {
          if (item.label.trim() === "") {
            isEmptyListLabel = true;
          }
        });

        if (isEmptyListLabel) {
          setIsError({ listItem: true });
          setErrorMessage({ listItem: "All list field is Required" });
          return false;
        }
      } else if (assessmentResponse.id == "numeric_scale") {
        let isEmptyNumericScale = false;
        listNumericScaleObj.forEach((item) => {
          if (item.label.trim() === "") {
            isEmptyNumericScale = true;
          }
        });

        if (isEmptyNumericScale) {
          setIsError({ numericScale: true });
          setErrorMessage({
            numericScale: "All Numeric scale field is Required",
          });
          return false;
        }
      }
    }
    return true;
  };
  const handleNewAssessmentSave = () => {
    if (Validation()) {
      const response = {
        assessment_name: assessmentName,
        response_type: assessmentResponse.id,
        measurement_type: assessmentMeasurementID,
        assessment_category_id: assessmentCategoryID,
        active: checked,
        description: assessmentDescription,
        list_values: listItemObj,
      };

      const numericListItemCheck = listNumericScaleObj.filter(
        (obj) => obj.label !== ""
      );
      const listItemObjCheck = listItemObj.filter((obj) => obj.label !== "");
      if (numericListItemCheck.length === 0 && listItemObjCheck.length === 0) {
        response.list_values = [];
      } else {
        if (numericListItemCheck.length > 0) {
          response.list_values = numericListItemCheck;
        }
        if (listItemObjCheck.length > 0) {
          response.list_values = listItemObjCheck;
        }
      }
      setIsLoading(true);

      addNewAssessmentType(response)
        .then((response) => {
          if (response?.success) {
            showToast("success", response?.message);
            navigation.replace("AssessmentDetails", {
              assessmentId: response?.data?.assession_type_id,
            });
          } else {
            showToast("warning", response?.message);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          showToast("error", "Something went wrong!!");
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleAssessmentEditDataSave = () => {
    const response = {
      assessment_type_id:props?.route?.params?.assessmentDetails?.assessment_type_id,
      assessment_name: assessmentName,
      response_type: assessmentResponse.id,
      measurement_type: assessmentMeasurementID,
      assessment_category_id: assessmentCategoryID,
      active: checked,
      description: assessmentDescription,
      list_values: listItemObj,
    };

    const numericListItemCheck = listNumericScaleObj.filter(
      (obj) => obj.label !== ""
    );
    const listItemObjCheck = listItemObj.filter((obj) => obj.label !== "");
    if (numericListItemCheck.length === 0 && listItemObjCheck.length === 0) {
      response.list_values = [];
    } else {
      if (numericListItemCheck.length > 0) {
        response.list_values = numericListItemCheck;
      }
      if (listItemObjCheck.length > 0) {
        response.list_values = listItemObjCheck;
      }
    }
    setIsLoading(true);
    updateAssessmentType(response)      
     .then((response) => {
        if (response?.success) {
          showToast("success", response?.message);
          navigation.replace("AssessmentDetails", {
            assessmentId: props?.route?.params?.assessmentDetails?.assessment_type_id,
          });
        } 
      })
      .catch((err) => {
        showToast("error", "Something went wrong!!");
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <>
      <CustomForm
        header={true}
        title={"New Assessment Type"}
        onPress={
          props?.route?.params?.editAssessmentTypeCheck === "Edit"
            ? handleAssessmentEditDataSave
            : handleNewAssessmentSave
        }
        back={alertModalOpen}
      >
        <Loader visible={isLoading} />
        <InputBox
          inputLabel={"Category"}
          placeholder={"Category"}
          editable={false}
          rightElement={assessmentCategoryOpen ? "menu-up" : "menu-down"}
          value={assessmentCategory}
          DropDown={assessementCategoryToggal}
          onFocus={assessementCategoryToggal}
        />
        <View>
          <InputBox
            inputLabel={"Assessment Name"}
            placeholder={"Assessment Name"}
            value={assessmentName}
            autoFocus={false}
            onChange={(value) => {
              setAssessmentName(value);
            }}
            errors={errorMessage.assessmentName}
            isError={isError.assessmentName}
          />
        </View>

        <View>
          <InputBox
            inputLabel={"Description"}
            placeholder={"Description"}
            value={assessmentDescription}
            autoFocus={false}
            onChange={(value) => {
              setAssessmentDescriptione(value);
            }}
            multiline={true}
            numberOfLines={2}
          />
        </View>
        <View style={reduxColors.activeAssessment}>
          <Checkbox
            status={checked == 1 ? "checked" : "unchecked"}
            onPress={handleCheckboxToggle}
          />
          <Text style={reduxColors.activeCheckText}>
            Mark as Active (Available for selection)
          </Text>
        </View>
        <InputBox
          inputLabel={"Response Type"}
          placeholder={"Response Type"}
          editable={false}
          rightElement={assessmentResponseOpen ? "menu-up" : "menu-down"}
          value={assessmentResponse.name}
          DropDown={assessementResponseToggal}
          onFocus={assessementResponseToggal}
          errors={errorMessage.responseType}
          isError={isError.responseType}
        />

        <View>
          {assessmentResponse.id == "numeric_value" ? (
            <View>
              <InputBox
                inputLabel={"Choose Measurement Type"}
                placeholder={"Choose Measurement Type"}
                editable={false}
                rightElement={
                  assessmentMeasurementOpen ? "menu-up" : "menu-down"
                }
                value={assessmentMeasurement}
                DropDown={assessementMeasurementToggal}
                onFocus={assessementMeasurementToggal}
                errors={errorMessage.measurement}
                isError={isError.measurement}
              />
            </View>
          ) : assessmentResponse.id == "list" ? (
            <View>
              <AssessmentAddListItem
                title={"List Item"}
                listItemObj={listItemObj}
                handleListItemAdd={() => handleListItemAdd("list")}
                handleListItemRemove={handleListItemRemove}
                handleInputBoxRemove={handleInputBoxRemove}
                setEnableInputBox={() => setEnableInputBox(true)}
                enableInputBox={enableInputBox}
                setListItemText={setListItemText}
                listItemText={listItemText}
                InputTextUpdate={InputListItemUpdate}
                AddTitle={"Add List Item"}
                latestInputRef={latestInputRef}
              />
              {isError?.listItem ? (
                <Text
                  style={{
                    color: constThemeColor.error,
                    fontSize: FontSize.Antz_errMsz,
                  }}
                >
                  {errorMessage?.listItem}
                </Text>
              ) : null}
            </View>
          ) : assessmentResponse.id == "numeric_scale" ? (
            <View>
              <AssessmentAddListItem
                title={"Numeric scale"}
                listItemObj={listNumericScaleObj}
                handleListItemAdd={() => handleListItemAdd("Numeric")}
                handleListItemRemove={handleNumericScaleRemove}
                setEnableInputBox={() => setEnableInputBox(true)}
                enableInputBox={enableInputBox}
                handleInputBoxRemove={handleNumericInputBoxRemove}
                setListItemText={setListNumericScaleText}
                listItemText={listNumericScaleText}
                InputTextUpdate={InputTextNumericUpdate}
                AddTitle={"Add Numeric Item"}
                latestInputRef={latestInputScaleRef}
              />
              {isError?.numericScale ? (
                <Text
                  style={{
                    color: constThemeColor.error,
                    fontSize: FontSize.Antz_errMsz,
                  }}
                >
                  {errorMessage?.numericScale}
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
      </CustomForm>

      {/*  Assessment Category modal  */}

      {assessmentCategoryOpen ? (
        <ModalFilterComponent
          onPress={assessmentCategoryClose}
          onDismiss={assessmentCategoryClose}
          onBackdropPress={assessmentCategoryClose}
          onRequestClose={assessmentCategoryClose}
          data={categoryListData}
          closeModal={assessmentCategoryClick}
          title="Select Assessment Types"
          style={{ alignItems: "flex-start" }}
          isSelectedId={isAssessmentCategoryClick}
          checkIcon={true}
        />
      ) : null}

      {/*  Assessment Response Modal */}

      {assessmentResponseOpen ? (
        <ModalFilterComponent
          onPress={assessmentResponseClose}
          onDismiss={assessmentResponseClose}
          onBackdropPress={assessmentResponseClose}
          onRequestClose={assessmentResponseClose}
          data={responseTypeData}
          closeModal={assessmentResponseClick}
          title="Select Response Types"
          style={{ alignItems: "flex-start" }}
          isSelectedId={isAssessmentResponseClick}
          checkIcon={true}
        />
      ) : null}

      {/*  Choose Measurement Type Modal */}

      {assessmentMeasurementOpen ? (
        <ModalFilterComponent
          onPress={assessmentMeasurementClose}
          onDismiss={assessmentMeasurementClose}
          onBackdropPress={assessmentMeasurementClose}
          onRequestClose={assessmentMeasurementClose}
          data={measurmentTypeData}
          closeModal={assessmentMeasurementClick}
          title="Select Measurement Type"
          style={{ alignItems: "flex-start" }}
          isSelectedId={isAssessmentMeasurementClick}
          checkIcon={true}
        />
      ) : null}
      <DialougeModal
        isVisible={isModalVisible}
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
  );
};

export default AddAssessmentType;

const styles = (reduxColors) =>
  StyleSheet.create({
    activeAssessment: {
      height: 56,
      borderWidth: 1,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.surface,
      borderRadius: Spacing.mini,
      marginVertical: Spacing.small + 2,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.small,
    },
    activeCheckText: {
      ...FontSize.Antz_Body_Medium,
      color: reduxColors.onPrimaryContainer,
    },
  });
