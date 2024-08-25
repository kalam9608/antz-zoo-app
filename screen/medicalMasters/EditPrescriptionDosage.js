import React, { useEffect, useState } from "react";
import InputBox from "../../components/InputBox";
import Loader from "../../components/Loader";
import CustomFormWithoutKeyboardScroll from "../../components/CustomFormWithoutKeyboardScroll";
import { useNavigation } from "@react-navigation/native";
import DynamicAlert from "../../components/DynamicAlert";
import { useSelector } from "react-redux";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { View, Text, StyleSheet } from "react-native";
import Switch from "../../components/Switch";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { editPrescriptionDosage } from "../../services/MedicalMastersService";
import { useToast } from "../../configs/ToastConfig";

const EditPrescriptionDosage = (props) => {
  const navigation = useNavigation();
  const [labelData, setLabelData] = useState("");
  const [descriptionData, setDescriptionData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isSwitchOn, setIsSwitchOn] = React.useState(
    props.route.params?.site?.item?.active =="1"?true : false
  );
  const [diagnosisId]=useState(props.route.params?.site?.item?.id);
  const { showToast, successToast, errorToast, alertToast, warningToast } = useToast();

  useEffect(() => {
    setLabelData(props.route.params?.site?.item?.label ?? "");
    setDescriptionData(props.route.params?.site?.item?.description ?? "");
  }, []);
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
    } else if (descriptionData.trim().length === 0) {
      setIsError({ descriptionData: true });
      setErrorMessage({ descriptionData: "Enter  description" });
      return false;
    } else {
      var obj = {
        label: labelData,
        description: descriptionData,
        status: Number(isSwitchOn),
        id:diagnosisId
      };
      setIsLoading(true);
      editPrescriptionDosage(obj)
      .then((res) => {
        if (res?.success) {
          successToast("success", res?.message);
          navigation.goBack();
        } else {
          errorToast("error", res?.message);
        }
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  };
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <>
      <CustomFormWithoutKeyboardScroll
        header={true}
        title={"Edit Prescription Dosage"}
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

        <View
          style={[
            {
              marginVertical: heightPercentageToDP(2),
              backgroundColor: isSwitchOn
              ? constThemeColor.displaybgPrimary
              : constThemeColor.surface,
            },
          ]}
        >
          <View
            style={[
              reduxColors.switchStyle,
              {
                borderWidth: isSwitchOn ? 2 : 1,
              },
            ]}
          >
            <Text style={reduxColors.textStyle}>Status</Text>
            <Switch handleToggle={onToggleSwitch} active={isSwitchOn} />
          </View>
        </View>
      </CustomFormWithoutKeyboardScroll>
      <DynamicAlert
        isVisible={isVisible}
        onClose={hideAlert}
        type={alertType}
        title={alertType === "success" ? "Success" : "Error"}
        message={alertMessage}
        onOK={handleOK}
        // isCancelButton={alertType === "success" ? true : false}
        onCancel={handleCancel}
      />
    </>
  );
};

export default EditPrescriptionDosage;

const styles = (reduxColors) =>
  StyleSheet.create({
    switchStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      minHeight: 50,
      borderRadius: Spacing.mini,
      borderColor: reduxColors.outline,
      padding: widthPercentageToDP(1),
    },
    textStyle: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.onSurface,
      marginLeft: widthPercentageToDP(2.5),
    },
  });
