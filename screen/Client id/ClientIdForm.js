import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { idproof } from "../../services/ClientService";
import InputBox from "../../components/InputBox";
import CustomFormWithoutKeyboardScroll from "../../components/CustomFormWithoutKeyboardScroll";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../components/Loader";
import CheckBox from "../../components/CheckBox";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import { useSelector } from "react-redux";

const ClientIdForm = () => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const { successToast, errorToast } = useToast();
  const [isChecked, setIsChecked] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [isLoading, setLoding] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");

  const onSubmit = (isRequired, isPermitted) => {
    setIsError({});
    setErrorMessage({});
    if (inputValue.trim().length === 0) {
      setIsError({ inputValue: true });
      setErrorMessage({ inputValue: "This field is required" });
      return false;
    }
    setLoding(true);
    var obj = {
      id_name: inputValue,
      client_id: null,
      required: Number(isRequired),
      is_permitted: isPermitted,
    };
    idproof(obj)
      .then((res) => {
        if (res.success) {
          successToast("success", res.message);
          navigation.goBack();
        } else {
          setLoding(false);
          if (!res.errors) {
            setTitle(res.message);
            alertModalOpen();
          } else {
            errorToast("error", res.message);
          }
        }
      })
      .catch((error) => {
        console.log({ error });
        errorToast("error", "Something Went Wrong");
      })
      .finally(() => {
        setLoding(false);
      });
  };

  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  const firstButtonPress = () => {
    onSubmit(isChecked, true);
    alertModalClose();
  };
  const secondButtonPress = () => {
    setIsChecked(false);
    onSubmit(false, false);
    alertModalClose();
  };

  return (
    <>
      <Loader visible={isLoading} />
      <CustomFormWithoutKeyboardScroll
        header={true}
        title={"Id Proof Type"}
        onPress={() => onSubmit(isChecked, false)}
      >
        <InputBox
          inputLabel={"Enter Id Proof Type"}
          placeholder={"Id Proof"}
          autoFocus={false}
          onChange={(value) => setInputValue(value)}
          value={inputValue}
          errors={errorMessage.inputValue}
          isError={!inputValue ? isError.inputValue : false}
        />
        <View style={{}}>
          <CheckBox
            checked={isChecked}
            onPress={() => setIsChecked(!isChecked)}
            title={"Is it required?"}
          />
        </View>
      </CustomFormWithoutKeyboardScroll>
      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.WARNING_TYPE}
        title={title}
        subTitle={"Do you want to change?"}
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

export default ClientIdForm;

const styles = StyleSheet.create({});
