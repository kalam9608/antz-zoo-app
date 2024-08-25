import React, { useEffect, useState } from "react";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import Loader from "../../components/Loader";
import CustomFormWithoutKeyboardScroll from "../../components/CustomFormWithoutKeyboardScroll";
import { useNavigation } from "@react-navigation/native";
import { editAdvice } from "../../services/MedicalMastersService";
import { errorToast, successToast } from "../../utils/Alert";
import Switch from "../../components/Switch";
import { Text } from "react-native";
import { View } from "react-native";
import { useSelector } from "react-redux";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import FontSize from "../../configs/FontSize";
import { useToast } from "../../configs/ToastConfig";

const EditAdvice = (props) => {
  const navigation = useNavigation();
  const [labelData, setLabelData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isSwitchOn, setIsSwitchOn] = React.useState(
    props.route.params?.site?.item?.active == "1" ? true : false
  );
  const [itemid, setItemid] = useState(null);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  useEffect(() => {
    setLabelData(props.route.params?.site?.item?.label ?? "");
    setItemid(props.route.params?.site?.item?.id ?? null);
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
    } else {
      var obj = {
        id: itemid,
        label: labelData,
        status: Number(isSwitchOn),
      };
      setIsLoading(true);
      editAdvice(obj)
        .then((res) => {
          if (res?.success) {
            successToast("success", res?.message);
            navigation.goBack();
          } else {
            errorToast("error", res?.message);
          }
        })
        .catch((err) => {
          setAlertType("error");
          errorToast("error", "Oops! Something went wrong!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  return (
    <>
      <CustomFormWithoutKeyboardScroll
        header={true}
        title={"Edit Advice"}
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
          isError={!labelData ? isError.labelData : false}
          errors={errorMessage.labelData}
        />
        <View
          style={[
            {
              marginVertical: heightPercentageToDP(2),
              backgroundColor: constThemeColor.displaybgPrimary,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: 50,
              borderWidth: isSwitchOn ? 2 : 1,
              borderRadius: 5,
              borderColor: constThemeColor.outline,
              padding: widthPercentageToDP(1),
            }}
          >
            <Text
              style={{
                fontSize: FontSize.Antz_Minor_Regular.fontSize,
                fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                color: constThemeColor.onSurface,
                textAlign: "left",
                lineHeight: 20,
                marginLeft: widthPercentageToDP(2.5),
              }}
            >
              Status
            </Text>
            <Switch handleToggle={onToggleSwitch} active={isSwitchOn} />
          </View>
        </View>
      </CustomFormWithoutKeyboardScroll>
    </>
  );
};

export default EditAdvice;
