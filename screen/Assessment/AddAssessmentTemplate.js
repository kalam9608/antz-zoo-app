import React, { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import AssessmentTemplateInsight from "../../components/AssessmentTemplateInsight";
import SubmitBtn from "../../components/SubmitBtn";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { MaterialIcons } from "@expo/vector-icons";
import {
  addNewAssessmentTemplate,
  assessmentTemplateEdit,
  assessmentTemplateSpeciesList,
  assessmentTemplateTypesList,
} from "../../services/assessmentService/AssessmentTemplate";
import Loader from "../../components/Loader";
import { useToast } from "../../configs/ToastConfig";
import { opacityColor } from "../../utils/Utils";
import BottomSheetModalComponent from "../../components/BottomSheetModalComponent";
import InsideBottomsheet from "../../components/Move_animal/InsideBottomsheet";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";

const AddAssessmentTemplate = (props) => {
  const { goBack } = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  const [activeTab, setActiveTab] = useState("Info");
  const [title, setTitle] = useState(
    props?.route?.params?.assessmentTempDetails?.template_name
      ? props?.route?.params?.duplicateTemp == "copy"
        ? props?.route?.params?.assessmentTempDetails?.template_name +
          " " +
          "copy"
        : props?.route?.params?.assessmentTempDetails?.template_name
      : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();
  const [selectedTypeData, setSelectedTypeData] = useState([]);
  const [selectedTypeDataId, setSelectedTypeDataId] = useState([]);
  const [selectedTypeIdForCampare, setSelectedTypeIdForCompare] = useState([]);
  const [selectedNewTypeId, setSelectedNewTypeId] = useState([]);
  const [selectedRemovedTypeId, setSelectedRemovedTypeId] = useState([]);
  const [tempDescription, setTempDescription] = useState(
    props?.route?.params?.assessmentTempDetails?.description ?? ""
  );
  const [assessementId, setAssessmentId] = useState(
    props?.route?.params?.assessmentTemplateId ?? ""
  );
  const [typeChecked, setTypeCheck] = useState("");
  const [speciesCount, setSpeciesCount] = useState("");
  const onTabChange = (newTab) => {
    setActiveTab(newTab);
  };
  // This State and function is used for asking permission you want to go back or not
  const [isModalVisible, setModalVisible] = useState(false);
  const alertModalOpen = (check) => {
    if (check == "checkType") {
      setModalVisible(true);
      setTypeCheck("typeChecked");
    } else {
      setModalVisible(true);
    }
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };
  const firstButtonPress = () => {
    if (typeChecked == "typeChecked") {
      addNewTemplate(true);
      setTypeCheck("");
      alertModalClose();
    } else {
      navigation.goBack();
      alertModalClose();
    }
  };

  const secondButtonPress = () => {
    alertModalClose();
    setTypeCheck("");
  };

  const handleNavigate = () => {
    navigation.navigate("AddAssessmentTypeTemplate", {
      selectedDataId: selectedTypeDataId,
      data: selectedTypeData,
      onGoBack: (e) => searchSelectData(e),
      saveExtraData: (e) => saveExtraDataId(e),
    });
  };

  const saveExtraDataId = (typesIds) => {
    const newlyAddedTypesIds = typesIds?.filter(
      (id) => !selectedTypeIdForCampare?.includes(id)
    );
    const removeTypeIdArray = [];
    selectedTypeIdForCampare?.forEach((value) => {
      if (!typesIds?.includes(value)) {
        removeTypeIdArray.push(value);
      }
    });
    setSelectedRemovedTypeId(removeTypeIdArray);
    setSelectedNewTypeId(newlyAddedTypesIds);
    setSelectedTypeDataId(typesIds);
  };

  const searchSelectData = (selectedData) => {
    setSelectedTypeData(selectedData);
  };

  const selectedAssessmentDataModify = {};
  selectedTypeData?.forEach((obj) => {
    if (!selectedAssessmentDataModify[obj.label]) {
      selectedAssessmentDataModify[obj.label] = {
        assessment_category_id: obj.assessment_category_id,
        assessment_type_id: obj.assessment_type_id,
        label: obj.label,
        allDataWIthsameLabel: [obj],
      };
    } else {
      selectedAssessmentDataModify[obj.label].allDataWIthsameLabel.push(obj);
    }
  });

  const modifySelectedAssessmentType = Object.values(
    selectedAssessmentDataModify
  );
  const Validation = (typeLenghthCheck) => {
    if (title?.length == 0) {
      showToast("warning", "Assessment Type title is mandatory");
      return false;
    } else if (selectedTypeDataId?.length == 0 && typeLenghthCheck == false) {
      alertModalOpen("checkType");
      return false;
    }
    return true;
  };
  const addNewTemplate = (isTypeLengthCheck) => {
    if (Validation(isTypeLengthCheck)) {
      setIsLoading(true);
      const obj = {
        active: 1,
        assessment_types: selectedTypeDataId,
        template_name: title,
        description: tempDescription,
      };
      const modifiedAssessmentTypeId =
        "[" + selectedTypeDataId?.join(",") + "]";
      obj.assessment_types = modifiedAssessmentTypeId;
      addNewAssessmentTemplate(obj)
        .then((response) => {
          if (response?.success) {
            showToast("success", response?.message);
            navigation.replace("AssessmentTemplateDetails", {
              assessmentTemplateId: response?.data?.assessment_template_id,
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

  // This Function is used for Update perticular template edit
  const updateTemplate = () => {
    setIsLoading(true);
    const obj = {
      active: 1,
      template_name: title,
      assessment_template_id: assessementId,
      description: tempDescription,
      master_assessment_types: selectedTypeIdForCampare
        ? "[" + selectedTypeIdForCampare?.join(",") + "]"
        : [],
      new_assessment_types: selectedNewTypeId
        ? "[" + selectedNewTypeId?.join(",") + "]"
        : [],
      assessment_types_to_be_removed: selectedRemovedTypeId
        ? "[" + selectedRemovedTypeId?.join(",") + "]"
        : [],
    };
    assessmentTemplateEdit(obj)
      .then((response) => {
        if (response?.success) {
          showToast("success", response?.message);
          navigation.replace("AssessmentTemplateDetails", {
            assessmentTemplateId: assessementId,
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
  };

  // This function is called for based on assessment id call the api and show typs for duplicate template
  useEffect(() => {
    if (assessementId !== "") {
      setIsLoading(true);
      templateTypesList();
      getTemplateSpecies();
    }
  }, [props?.route?.params?.assessmentTemplateId]);

  const getTemplateSpecies = () => {
    const obj = {
      assessment_template_id: assessementId,
    };
    assessmentTemplateSpeciesList(obj)
      .then((res) => {
        if (res?.success) {
          setSpeciesCount(res?.data.total_count);
        }
      })
      .catch((e) => {
        errorToast("error", "Something went wrong");
      })
      .finally((e) => {
        setIsLoading(false);
      });
  };
  const templateTypesList = () => {
    const obj = {
      assessment_template_id: assessementId,
    };
    assessmentTemplateTypesList(obj)
      .then((res) => {
        if (res.success) {
          setSelectedTypeDataId(
            res?.data?.assessment_category?.flatMap((item) =>
              item.assessment_types.flatMap((type) =>
                String(type?.assessment_type_id)
              )
            )
          );
          setSelectedTypeIdForCompare(
            res?.data?.assessment_category?.flatMap((item) =>
              item.assessment_types.flatMap((type) =>
                String(type?.assessment_type_id)
              )
            )
          );
          setSelectedTypeData(
            res?.data?.assessment_category?.flatMap((item) =>
              item.assessment_types.flatMap((arr) => arr)
            )
          );
        } else {
          errorToast("error", "Something went wrong");
        }
      })
      .catch((e) => {
        setIsLoading(false);
        errorToast("error", "Something went wrong");
      })
      .finally((e) => {
        setIsLoading(false);
      });
  };
  return (
    <View style={{ flex: 1 }}>
      <Loader visible={isLoading} />
      <View style={dynamicStyles.headerContainer}>
        <TouchableOpacity onPress={() => alertModalOpen()}>
          <Image
            source={require("../../assets/close.png")}
            resizeMode={"contain"}
            style={dynamicStyles.headerIcon}
          />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitleText}>{"New Template"}</Text>
        <TouchableOpacity
          onPress={
            props?.route?.params?.edittemplate == "edit"
              ? updateTemplate
              : () => addNewTemplate(false)
          }
        >
          <Image
            source={require("../../assets/check.png")}
            resizeMode={"contain"}
            style={dynamicStyles.headerIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.assessmentContainer}>
        <View style={dynamicStyles.titleContainer}>
          <TextInput
            placeholderTextColor={constThemeColor.onPrimary}
            value={title}
            onChangeText={setTitle}
            style={dynamicStyles.titleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? "" : "Untitled"}
          />
        </View>

        <AssessmentTemplateInsight
          activeTab={activeTab}
          onTabChange={onTabChange}
          isSpeciesDisabled={true}
          typesCount={
            selectedTypeDataId?.length ? selectedTypeDataId?.length : "0"
          }
          speciesCount={
            props?.route?.params?.edittemplate !== "edit"
              ? "0"
              : speciesCount
              ? speciesCount
              : "0"
          }
        />
      </View>

      {activeTab === "Info" ? (
        <Info
          description={tempDescription}
          setDescription={setTempDescription}
        />
      ) : null}
      {activeTab === "Types" ? (
        <Types
          onPress={handleNavigate}
          modifySelectedAssessmentType={modifySelectedAssessmentType}
        />
      ) : null}
      <DialougeModal
        isVisible={isModalVisible}
        title={
          typeChecked
            ? "Are you sure to continue creating template without assessment types?"
            : "Are you sure you want to go back?"
        }
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

export default AddAssessmentTemplate;

const Info = ({ description, setDescription }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const userDetails = useSelector((state) => state.UserAuth.userDetails);
  const dynamicStyles = styles(constThemeColor);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: constThemeColor.background }}
    >
      <TextInput
        placeholder={"Enter Description"}
        placeholderTextColor={constThemeColor.onPrimaryContainer}
        style={dynamicStyles.descriptionInput}
        multiline={true}
        value={description}
        onChangeText={(e) => setDescription(e)}
      />
    </ScrollView>
  );
};

const Types = ({ onPress, modifySelectedAssessmentType, ...props }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  const assessmentTemplate = useRef(null);
  const [templateType, setTemplateType] = useState([]);
  const [templateTypeName, setTemplateTypeName] = useState("");
  const [assessmentTypeModal, setassessmentTypeModal] = useState(false);
  const navigation = useNavigation();
  const openModalForAddTemp = (item) => {
    assessmentTemplate.current.present();
    setassessmentTypeModal(true);
    setTemplateType(item?.allDataWIthsameLabel);
    setTemplateTypeName(
      item?.label + " - " + item?.allDataWIthsameLabel?.length
    );
  };
  const searchAllAssessmentClose = () => {
    assessmentTemplate.current.close();
    setassessmentTypeModal(false);
  };
  useEffect(() => {
    const backAction = () => {
      if (assessmentTypeModal) {
        searchAllAssessmentClose();
      } else {
        navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation, assessmentTypeModal]);
  return (
    <View style={dynamicStyles.typesMainContainer}>
      <SubmitBtn
        buttonText={"Add Assessment Type"}
        iconName={"plus"}
        backgroundColor={constThemeColor.secondary}
        color={constThemeColor.onError}
        fontSize={FontSize.Antz_Minor_Medium.fontSize}
        fontWeight={FontSize.Antz_Minor_Medium.fontWeight}
        onPress={onPress}
      />
      <FlatList
        data={modifySelectedAssessmentType}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => openModalForAddTemp(item)}>
              <View style={dynamicStyles.typeListContainer}>
                <Text style={dynamicStyles.typeTitle}>{item?.label}</Text>
                <View style={dynamicStyles.rightIcon}>
                  <Text style={dynamicStyles.typeTitle}>
                    {item?.allDataWIthsameLabel?.length}
                  </Text>

                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={constThemeColor.onSurfaceVariant}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item?.assessment_category_id}
      />
      <BottomSheetModalComponent ref={assessmentTemplate}>
        <InsideBottomsheet
          title={templateTypeName}
          type={"assessmentType"}
          assessmentTypeData={templateType}
          CloseBottomSheet={() => assessmentTemplate.current.close()}
          searchRemoveFromTemp={"searchRemoveTemplate"}
          navigateTodetails={() => {}}
          removeRightIcon={false}
        />
      </BottomSheetModalComponent>
    </View>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    assessmentContainer: {
      backgroundColor: reduxColors.onPrimaryContainer,
      height: 163,
      paddingHorizontal: Spacing.minor,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    titleInput: {
      ...FontSize.Antz_Major_Medium,
      color: reduxColors.onPrimary,
      backgroundColor: opacityColor(reduxColors.onPrimary, 10),
      paddingHorizontal: Spacing.small,
      paddingVertical: 2,
      borderRadius: Spacing.mini,
      minWidth: "40%",
    },
    descriptionContainer: {
      borderRadius: Spacing.major,
      backgroundColor: reduxColors.displaybgSecondary,
      margin: Spacing.minor,
      paddingHorizontal: Spacing.minor,
      paddingVertical: Spacing.major,
    },
    descriptionTitle: {
      ...FontSize.Antz_Body_Regular,
      color: reduxColors.neutralSecondary,
    },
    descriptionValueText: {
      ...FontSize.Antz_Minor_Regular,
      color: reduxColors.onPrimaryContainer,
      marginTop: Spacing.mini,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: reduxColors.onPrimaryContainer,
      paddingHorizontal: Spacing.small,
      paddingVertical: Spacing.body,
    },
    headerIcon: {
      height: 40,
      width: 40,
    },
    headerTitleText: {
      ...FontSize.Antz_Medium_Medium,
      color: reduxColors.onPrimary,
      flex: 1,
      textAlign: "center",
    },
    descriptionInput: {
      minHeight: 110,
      paddingHorizontal: Spacing.minor,
      paddingTop: Spacing.minor + 4,
      paddingBottom: Spacing.minor,
      margin: Spacing.minor,
      marginBottom: Spacing.body,
      borderWidth: 1,
      borderColor: reduxColors.outline,
      borderRadius: 4,
      ...FontSize.Antz_Minor_Regular,
      color: reduxColors.onPrimaryContainer,
      textAlignVertical: "top",
    },

    typesMainContainer: {
      flex: 1,
      backgroundColor: reduxColors.background,
      paddingTop: Spacing.body,
    },

    typeListContainer: {
      backgroundColor: reduxColors.onPrimary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignContent: "center",
      marginVertical: Spacing.small,
      padding: Spacing.minor,
      marginHorizontal: Spacing.body,
      borderRadius: Spacing.small,
    },
    rightIcon: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "20%",
    },
    typeTitle: {
      ...FontSize.Antz_Minor_Title,
      color: reduxColors.onSurfaceVariant,
    },
  });
