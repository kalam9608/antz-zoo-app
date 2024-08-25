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
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Spacing from "../../configs/Spacing";
import { useNavigation } from "@react-navigation/native";
import FontSize from "../../configs/FontSize";
import { Checkbox } from "react-native-paper";

import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import { useToast } from "../../configs/ToastConfig";
import Modal from "react-native-modal";
import Loader from "../../components/Loader";
import Constants from "../../configs/Constants";
import {
  DeleteMedicalTemp,
  EditMedicalTemp,
} from "../../services/MedicalsService";
const EditMedicalTempalte = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const navigation = useNavigation();
  const [checked, setChecked] = React.useState(
    props?.route?.params?.editTempData.is_default ?? 0
  );
  const [editTempDataName, setEditTempDataName] = useState(
    props?.route?.params?.editTempData
  );
  const userPermissions = useSelector((state) => state.UserAuth.permission);
  const [type, setType] = useState(props?.route?.params?.type ?? "");
  const [editTempDataId, setEditTempDataId] = useState(
    props?.route?.params?.editTempData?.id
  );
  const [editTempData, setEditTempData] = useState(
    props?.route?.params?.editTempData.template_items
      ? props?.route?.params?.editTempData.template_items
      : []
  );
  const { errorToast, successToast, warningToast } = useToast();
  const [extraData, setExtraData] = useState({});
const [templateData,setTemplateData]=useState(props?.route?.params?.mappedTempData??[])
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editInput, setEditInput] = useState(
    props?.route?.params?.editTempData.name ?? ""
  );
  const [editInputName, setEditInputName] = useState(
    props?.route?.params?.editTempData.name
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const handleCheckboxToggle = () => {
    setChecked(checked == 0 ? 1 : 0);
  };

  const handleSaveClick = () => {
    const trimmedEditInput = editInput ? editInput?.trim()?.toLowerCase() : "";
    if (editInput == "" || editInput == null) {
      setErrorMessage("Template name is required");
    }else if (templateData?.some((i)=>i?.name?.trim()?.toLowerCase()==trimmedEditInput)) {
      setErrorMessage("Template name already exist");
    } else {
      setErrorMessage(false);
      setEditInputName(editInput);
      setIsEditModalVisible(!isEditModalVisible);
    }
  };

  // console.log("------1-------",props.route.params.editTempData);
  // console.log("----2-------",props.route.params.data);
  // console.log("------3------", props.route.params.typeId);
  // console.log("------3------",props.route.params.type);

  const toggleModal = () => {
    setIsEditModalVisible(!isEditModalVisible);
  };
  // function for edit the template
  const handleEditTemplate = () => {
    setIsLoading(true);
    const obj = {
      template_name: editInputName,
      type: props.route.params?.type,
      template_items: editTempData?.map((i) => Number(i?.id)),
    };
    EditMedicalTemp(obj, props.route.params?.typeId)
      .then((response) => {
        if (response.success) {
          props.route.params?.onGoBackData({
            editTempData: editTempData,
            editInputName: editInputName,
            typeId: props.route.params?.typeId,
            checked:checked
          });
          navigation.goBack();
          successToast("success", "Template Updated Successfully !");
        } else {
          warningToast("error", response?.message ?? "Something went wrong!!");
        }
      })
      .catch((e) => {
        console.log(e);
        warningToast("error", "Something went wrong!!");
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  // Delete template function

  const DeleteTemplate = () => {
    setIsLoading(true);

    DeleteMedicalTemp(props.route.params?.typeId)
      .then((res) => {
        console.log(res);
        if (res.success) {
          successToast("success", "Template Deleted Successfully !");
          props.route.params?.onGoBackData({
            typeId: props.route.params?.typeId,
            delete:true
          });
          navigation.goBack();
        } else {
          errorToast("error", "Oops! Something went wrong!");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // confermation modal for delete template

  const [isModalVisible, setModalVisible] = useState(false);
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  const firstButtonPress = () => {
    DeleteTemplate();
    alertModalClose();
  };
  const secondButtonPress = () => {
    alertModalClose();
  };

  // Add more user data function

  const searchSelectData = (data) => {
    setEditTempData(data);
  };
  const saveExtraData = (e) => {
    setExtraData(e);
  };

  // This function is ussed for remove selected user data

  const removeAsign = (item) => {
    const updatedUsers = editTempData.filter((v) => v.id !== item.id);
    setEditTempData(updatedUsers);
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
          <Entypo
            name="add-to-list"
            size={30}
            color={constThemeColor.primary}
            style={{ marginRight: Spacing.major }}
            onPress={() => {
              if (type == "diagnosis") {
                navigation.navigate("CommonSearch", {
                  forEdittemp: true,
                  name: Constants.MEDICAL_TEMPLATE_TYPE.DIAGNOSIS,
                  selected: editTempData,
                  add_permission: userPermissions["medical_add_complaints"],
                  onGoBack: (e) => searchSelectData(e),
                });
              } else if (type == "complaint") {
                navigation.navigate("CommonSearch", {
                  forEdittemp: true,
                  name: Constants.MEDICAL_TEMPLATE_TYPE.COMPLAINTS,
                  selected: editTempData,
                  add_permission: userPermissions["medical_add_complaints"],
                  onGoBack: (e) => searchSelectData(e),
                });
              } else if (type == "prescription") {
                let selec = editTempData?.map((item) => {
                  return {
                    id: item?.id,
                    name: item?.name,
                  };
                });
                navigation.navigate("CommonSearch", {
                  forEdittemp: true,
                  name: Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION,
                  selected: selec,
                  add_permission: userPermissions["medical_add_complaints"],
                  onGoBack: (e) => searchSelectData(e),
                });
              }
            }}
          />
          <AntDesign
            name="delete"
            size={24}
            color={constThemeColor.onSecondaryContainer}
            onPress={() => alertModalOpen(editTempDataName.id)}
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
          data={editTempData}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: constThemeColor.surface,
                borderRadius: Spacing.small,
                borderWidth: 1,
                borderColor: constThemeColor?.outlineVariant,
                marginVertical: Spacing.micro,
              }}
            >
              <TouchableOpacity
                style={[reduxColors?.commonNameList]}
                accessible={true}
                accessibilityLabel={"selectedComplaints"}
                AccessibilityId={"selectedComplaints"}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={[reduxColors.selectedName]}>{item.name}</Text>
                  <View>
                    <Ionicons
                      name="close-outline"
                      size={24}
                      color={constThemeColor.onSurface}
                      onPress={() => removeAsign(item)}
                    />
                  </View>
                </View>
                {/* {item?.additional_info&&Object.keys(item?.additional_info)?.length > 0 ? (
              <View style={[reduxColors?.caseReportDetails]}>
                <View
                  style={[
                    reduxColors?.caseReportItem,
                    {
                      display: item?.additional_info?.severity
                        ? "flex"
                        : "none",
                    },
                  ]}
                >
                  <Ionicons
                    name="sad-outline"
                    size={20}
                    color={severityColor(
                      item?.additional_info?.severity
                    )}
                  />
                  <Text style={[reduxColors.detailsReportTitle]}>
                    {item?.additional_info?.severity}
                  </Text>
                </View>
                <View
                  style={[
                    reduxColors.caseReportItem,
                    {
                      display: item?.additional_info?.duration
                        ? "flex"
                        : "none",
                    },
                  ]}
                >
                  <MaterialIcons
                    name="timer"
                    size={20}
                    color={constThemeColor?.onSurfaceVariant}
                  />
                  <Text style={[reduxColors?.detailsReportTitle]}>
                    {item?.additional_info?.duration}
                  </Text>
                </View>
              </View>
            ) : null} */}
              </TouchableOpacity>
            </View>
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
          onPress={handleEditTemplate}
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
                Edit group name
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
                  onPress={() => setIsEditModalVisible(!isEditModalVisible)}
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
        title={"Do you want to delete this Template?"}
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

export default EditMedicalTempalte;

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
    commonNameList: {
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.small,
    },
    selectedName: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.neutralPrimary,
    },
  });
