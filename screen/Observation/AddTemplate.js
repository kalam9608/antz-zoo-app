import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import Spacing from "../../configs/Spacing";
import { useNavigation } from "@react-navigation/native";
import FontSize from "../../configs/FontSize";
import { Checkbox } from "react-native-paper";
import { NewObservationTemplate } from "../../services/ObservationService";
import { useToast } from "../../configs/ToastConfig";
import Modal from "react-native-modal";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import Loader from "../../components/Loader";
import UserCustomCard from "../../components/UserCustomCard";
const AddTemplate = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const navigation = useNavigation();
  const [checked, setChecked] = React.useState(0);
  const [addTempData, setAddTempData] = useState(
    props?.route?.params?.addTempData ? props?.route?.params?.addTempData : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const { errorToast, successToast, warningToast } = useToast();
  const [extraData, setExtraData] = useState({});

  const [isEditModalVisible, setIsEditModalVisible] = useState(true);
  const [editInput, setEditInput] = useState(
    props?.route?.params?.addTempData.name ?? ""
  );
  const [editInputName, setEditInputName] = useState(
    props?.route?.params?.addTempData.name
  );
  const [errorMessage, setErrorMessage] = useState(false);
  const handleCheckboxToggle = () => {
    setChecked(checked == 0 ? 1 : 0);
  };
  const handleSaveClick = () => {
    if (editInput == "" || editInput == null) {
      setErrorMessage("Group name is required");
    } else {
      setErrorMessage(false);
      setEditInputName(editInput);
      setIsEditModalVisible(!isEditModalVisible);
    }
  };

  const toggleModal = () => {
    setIsEditModalVisible(!isEditModalVisible);
  };

  // Add more user data function

  const searchSelectData = (data) => {
    setAddTempData(data);
  };
  const saveExtraData = (e) => {
    setExtraData(e);
  };

  // This function is ussed for remove selected user data

  const removeAsign = (item) => {
    const updatedUsers = addTempData.filter(
      (user) => user.user_id !== item.user_id
    );
    setAddTempData(updatedUsers);
  };

  const defaultCheckFunction = () => {
    if (checked == 1) {
      handleSaveTemp(1);
    } else {
      alertModalOpen();
    }
  };

  // confermation modal for add default template

  const [isModalVisible, setModalVisible] = useState(false);
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  const firstButtonPress = () => {
    if (checked == 0) {
      setChecked(1);
      handleSaveTemp(1);
      alertModalClose();
    } else {
    }
  };
  const secondButtonPress = () => {
    alertModalClose();
    handleSaveTemp(0);
  };

  // This function is used for add temp

  const handleSaveTemp = (check) => {
    setIsLoading(true);
    const obj = {
      zooID: zooID,
      template_name: editInputName,
      template_type: "observation",
      template_items: [],
      template_sub_type: props?.route?.params?.typeId,
      is_default: check,
      status: 1,
    };
    let templatesMapItems = addTempData.map((item) => item.user_id);
    const numbersArray = templatesMapItems
      .map((item) => parseInt(item, 10))
      .filter((item) => !isNaN(item));
    obj.template_items = JSON.stringify(numbersArray);
    NewObservationTemplate(obj)
      .then((response) => {
        if (response?.success) {
          successToast("success", "Template Updated Successfully !");
          navigation.goBack();
        } else {
          if (
            response?.message?.template_name &&
            response?.message?.template_name ==
              "Please enter different template name"
          ) {
            warningToast(
              "error",
              "Name already exist ,please try with different name"
            );
          } else {
            warningToast(
              "error",
              response?.message?.template_name ?? "Something went wrong"
            );
          }
        }
      })
      .catch((e) => {
        setIsLoading(false);
        warningToast("error", "Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <View style={reduxColors.container}>
      <Loader visible={isLoading} />
      <View style={[reduxColors.contView, { padding: Spacing.minor }]}>
        <Ionicons
          name="arrow-back-outline"
          size={28}
          color={constThemeColor.onSecondaryContainer}
          onPress={() => navigation.goBack()}
        />
        <View style={reduxColors.contView}>
          <Ionicons
            name="person-add"
            size={24}
            color={constThemeColor.primary}
            onPress={() =>
              navigation.navigate("searchUsers", {
                data: addTempData,
                extraData: extraData,
                onGoBack: (e) => searchSelectData(e),
                saveExtraData: (e) => saveExtraData(e),
              })
            }
          />
        </View>
      </View>
      <View
        style={[
          reduxColors.contView,
          { paddingHorizontal: Spacing.minor, paddingVertical: Spacing.body },
        ]}
      >
        <Text style={reduxColors.headingText}>{editInputName}</Text>
        <AntDesign
          name="edit"
          size={24}
          color={constThemeColor.outline}
          onPress={toggleModal}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: Spacing.body,
        }}
      >
        <Checkbox.Android
          status={checked == 1 ? "checked" : "unchecked"}
          onPress={handleCheckboxToggle}
        />
        <Text
          style={{
            color: constThemeColor.onSecondaryContainer,
            marginLeft: Spacing.mini,
          }}
        >
          Mark as default template
        </Text>
      </View>

      <View
        style={{
          marginHorizontal: Spacing.minor,
        }}
      >
        <FlatList
          data={addTempData}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => (
            <UserCustomCard
              item={item}
              handleRemove={() => removeAsign(item)}
            />
          )}
        />
      </View>

      <View
        style={{
          width: "100%",
          alignItems: "center",
          position: "absolute",
          bottom: 0,
          backgroundColor: constThemeColor.displaybgPrimary,
        }}
      >
        <TouchableOpacity
          style={reduxColors.btnBg}
          onPress={() => defaultCheckFunction()}
        >
          <Text
            style={{
              fontSize: FontSize.Antz_Minor_Title.fontSize,
              fontWeight: FontSize.Antz_Minor_Title.fontWeight,
              color: constThemeColor.onPrimary,
            }}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isEditModalVisible}
        onBackdropPress={setIsEditModalVisible}
        onBackButtonPress={setIsEditModalVisible}
        hardwareBackPressCloseTimeoutMS={500}
        propagateSwipe={true}
        hideModalContentWhileAnimating={true}
        swipeThreshold={90}
        swipeDirection={"down"}
        animationInTiming={400}
        animationOutTiming={100}
        useNativeDriver={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
          }}
        >
          <View
            style={{
              height: 190,
              width: "95%",
              marginHorizontal: 24,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                flex: 1,
                justifyContent: "center",
                paddingHorizontal: Spacing.minor,
              }}
            >
              <Text
                style={{
                  ...FontSize.Antz_Minor_Medium,
                  marginVertical: Spacing.minor,
                }}
              >
                Add group name
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errorMessage
                    ? constThemeColor.error
                    : constThemeColor.outlineVariant,
                  borderRadius: Spacing.mini,
                  padding: Spacing.small,
                }}
                value={editInput}
                placeholder="Group name"
                onChangeText={(text) => {
                  setEditInput(text);
                  setErrorMessage(false);
                }}
              />
              {errorMessage ? (
                <Text
                  style={{
                    color: constThemeColor.error,
                    marginLeft: Spacing.micro,
                    marginTop: Spacing.micro,
                    fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                  }}
                >
                  {errorMessage}
                </Text>
              ) : null}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  paddingVertical: Spacing.minor,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setIsEditModalVisible(!isEditModalVisible),
                      navigation.goBack();
                  }}
                  style={[
                    reduxColors.btnModal,
                    {
                      backgroundColor: constThemeColor.surfaceVariant,
                      marginRight: Spacing.small,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: constThemeColor.onSurfaceVariant,
                      ...FontSize.Antz_Minor_Medium,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveClick}
                  style={reduxColors.btnModal}
                >
                  <Text
                    style={{
                      color: constThemeColor.onPrimary,
                      ...FontSize.Antz_Minor_Medium,
                    }}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={"Do you want to make this template default?"}
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
    </View>
  );
};

export default AddTemplate;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
    },
    contView: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    headingText: {
      color: reduxColors.onSecondaryContainer,
      fontSize: FontSize.Antz_Medium_Medium.fontSize,
    },
    card: {
      marginVertical: Spacing.mini,
      borderRadius: Spacing.small,
      backgroundColor: reduxColors.displaybgPrimary,
      borderWidth: 0.5,
      borderColor: reduxColors.outline,
      alignItems: "center",
      marginHorizontal: Spacing.small - 2,
    },
    btnBg: {
      backgroundColor: reduxColors.primary,
      marginVertical: Spacing.minor,
      width: 90,
      height: 44,
      borderRadius: Spacing.small,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    btnModal: {
      backgroundColor: reduxColors.primary,
      alignItems: "center",
      justifyContent: "center",
      padding: Spacing.small,
      paddingHorizontal: Spacing.body,
      borderRadius: Spacing.mini,
    },
  });
