/**
   * Create and modified by - Anirban Pan
      Date - 09.06.23
      Des- All Functionality and design
   */

import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import Footermedical from "../../components/Footermedical";
import { useDispatch, useSelector } from "react-redux";
import {
  setAdviceNotes,
  setMedicalSettings,
  setadvice,
} from "../../redux/MedicalSlice";
import Loader from "../../components/Loader";
import FontSize from "../../configs/FontSize";
// import { successToast, warningDailog, warningToast } from "../../utils/Alert";
import Spacing from "../../configs/Spacing";
import Constants from "../../configs/Constants";
import {
  createTemplate,
  listAnimalAdvices,
} from "../../services/MedicalsService";
import SaveTemplate, { SaveAsTemplate } from "../../components/SaveTemplate";
import { BackHandler } from "react-native";
import MedicalRecordSection from "../../components/MedicalRecordSection";
import Header from "../../components/Header";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import { AntDesign } from "@expo/vector-icons";

const Advice = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const AdiveSelectData = useSelector((state) => state.medical.advice);
  const medicalSettingsData = useSelector(
    (state) => state.medical.medicalSettings
  );
  useEffect(() => {
    const mapped = AdiveSelectData?.map((item) => item.name);
    setSelectRecommendedNames(mapped ?? []);
    let searchSelect = AdiveSelectData?.map((item) => {
      return {
        id: item?.id,
        name: item?.name,
      };
    });
    SetSearchSelected(searchSelect ?? []);
  }, [AdiveSelectData]);
  const [selectRecommendeNames, setSelectRecommendedNames] = useState([]);
  const [toggleSaveBtn, setToggleBtn] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templates, setTemplates] = useState(
    medicalSettingsData?.adviceTemplates ?? []
  );
  const [toggle, setToggle] = useState(false);
  const [adviceData, setadviceData] = useState(
    medicalSettingsData?.recentlyUsedAdvices
  );
  const [allAdviceData, setAllAdviceData] = useState(
    medicalSettingsData?.recommendedAdvices
  );
  const [isLoading, setisLoading] = useState(false);
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);
  // For Dialouge type modal  =========================
  const [isModalVisible, setModalVisible] = useState(false);
  const [DialougeTitle, setDialougeTitle] = useState("");
  const [searchSelected, SetSearchSelected] = useState([]);
  const { showToast, errorToast, successToast, warningToast } = useToast();
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };
  const confirmButtonPress = () => {
    setSelectRecommendedNames([]);
    SetSearchSelected([]);
    setModalVisible(false);
  };

  const cancelButtonPress = () => {
    alertModalClose();
  };
  // useEffect(()=>{
  //   let obj={
  //   }
  //   listAnimalAdvices(obj)
  //         .then((response) => {
  //         })
  //         .catch((e) => {
  //          console.log(e);
  //         })
  //         .finally(() => {
  //         });
  // },[])

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("AddMedical");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  /**
   * Select and add to array of string
   */
  const clickFun = () => {
    let data = [];
    for (let i = 0; i < selectRecommendeNames?.length; i++) {
      let item = allAdviceData?.find(
        (item) => item.name === selectRecommendeNames[i]
      );
      if (item) {
        let obj = {};
        obj.id = item.id;
        obj.name = item.name;
        data.push(obj);
      } else {
        let obj = {};
        obj.id = selectRecommendeNames[i];
        obj.name = selectRecommendeNames[i];
        data.push(obj);
      }
    }

    // for (let item of selectRecommendeNames) {
    //   if (adviceData?.find(element => element?.name === item)) {
    //     let obj = {};
    //     obj.id = item.id;
    //     obj.name = item.name;
    //     data.push(obj);
    //   }else{
    //     let obj = {};
    //     obj.id = selectRecommendeNames[i];
    //     obj.name = selectRecommendeNames[i];
    //     data.push(obj);
    //   }
    // }
  
   dispatch(setadvice(data));
    dispatch(
      setAdviceNotes(
        String(
          selectRecommendeNames?.map((item) => {
            return item;
          })
        )
      )
    );
  };
  const done = (item) => {
    goback();
    clickFun();
  };

  /**
   * Select from recent
   */
  const handleSelectRecomended = (item) => {
    let items = selectRecommendeNames?.find((ite) => ite === item.name);

    if (items) {
      setSelectRecommendedNames(
        selectRecommendeNames?.filter((ite) => ite !== item.name)
      );
      SetSearchSelected(searchSelected?.filter((i) => i.id != item.id));
    } else {
      if (
        selectRecommendeNames.length == 1 &&
        selectRecommendeNames[0] === ""
      ) {
        setSelectRecommendedNames([item.name]);
        SetSearchSelected([item]);
      } else {
        setSelectRecommendedNames([...selectRecommendeNames, item.name]);
        SetSearchSelected([...searchSelected, item]);
      }
    }
  };

  /**
   * Save button toggle
   */
  const handleClickSaveTemp = () => {
    setToggleBtn(true);
  };

  /**
   * Write advice and add
   */
  const changeAdvice = (e) => {
    let arr = [];
    arr = e.split(",\n");
    setSelectRecommendedNames(arr);
  };
  useEffect(() => {
    if (selectRecommendeNames?.length == 1 && selectRecommendeNames[0] == "") {
      setSelectRecommendedNames([]);
    }
    if (selectRecommendeNames[0]?.trim() == "") {
      setSelectRecommendedNames([]);
    }
  }, [selectRecommendeNames]);
  /**
   * Color
   */
  const selectedItemsColor = (item) => {
    let items = selectRecommendeNames?.find((ite) => ite === item.name);
    if (items) {
      return true;
    } else {
      return false;
    }
  };
  /**
   * Clear
   */
  // const handleClearAll = () => {
  //   warningDailog(
  //     "Sure!!",
  //     "Do you want to clear all?",
  //     "Yes",
  //     () => setSelectRecommendedNames([]),
  //     "No"
  //   );
  // };

  /**
   * Template select and merge data
   */
  const handleSelectFromTemplate = (item) => {
    // if (item?.name != templateName) {
    setTemplateName(item?.name);
    // const uniqueItems = item.template_items.filter((itemData) => {
    //   return !selectRecommendeNames.some(
    //     (selectedItem) => selectedItem === itemData.name
    //   );
    // });
    const selectedItems = item?.template_items?.map(
      (itemData) => itemData.name
    );
    let searchSelect = item?.template_items?.map((item) => {
      return {
        id: item.id,
        name: item.name,
      };
    });
    if (selectedItems.length > 0) {
      setSelectRecommendedNames([...selectedItems]);
      SetSearchSelected(searchSelect);
    } else {
      setSelectRecommendedNames([]);
      SetSearchSelected([]);
    }
    // }
  };

  /**
   * Save template
   */
  const handleSave = () => {
    setDisableSaveBtn(true);
    const newArray = [];

    //Checking with main array
    for (const item of selectRecommendeNames) {
      const matchingObject = adviceData?.find((obj) => obj.name === item);
      if (matchingObject) {
        newArray.push(matchingObject);
      } else {
        newArray.push({ id: item, name: item });
      }
    }
    // setToggleBtn(false);
    if (templateName) {
      let checkTempName = templates?.filter(
        (item) =>
          item.template_name.toLowerCase() === templateName.toLowerCase()
      );
      if (checkTempName.length === 0) {
        setisLoading(true);
        const obj = {
          template_name: templateName,
          type: Constants.MEDICAL_TEMPLATE_TYPE.ADVICE,
          template_items: [],
          template_new_items: [],
        };

        newArray.forEach((item) => {
          if (isNaN(Number(item.id))) {
            obj.template_new_items.push(item.name);
          } else {
            obj.template_items.push(item.id);
          }
        });
        createTemplate(obj)
          .then((response) => {
            setisLoading(false);
            if (response?.success) {
              setTemplates(response?.data);
              dispatch(
                setMedicalSettings({
                  ...medicalSettingsData,
                  adviceTemplates: response?.data,
                })
              );
              successToast("Success", response?.message);
              setToggleBtn(false);
              setTemplateName("");
            }
          })
          .catch((e) => {
            setisLoading(false);
          })
          .finally(() => {
            setisLoading(false);
            setDisableSaveBtn(false);
          });
      } else {
        setDisableSaveBtn(false);
        warningToast("Oops!!", "Template name already exist!");
      }
    } else {
      setDisableSaveBtn(false);
      warningToast("Oops!!", "Please enter a valid Template name!");
    }
  };

  /**
   * Navigations
   */
  const navigateNextScreen = () => {
    clickFun();
    navigation.navigate("LabRequest");
  };

  const navigatePreviousScreen = () => {
    clickFun();
    navigation.navigate("Prescription");
  };
  const goback = () => {
    navigation.navigate("AddMedical");
  };

  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const userPermissions = useSelector((state) => state.UserAuth.permission);

  const closeTempSave = () => {
    setToggleBtn(false);
  };

  const mappedResult = templates?.map((item) => ({
    id: item.id,
    name: item.template_name,
    template_items: item.template_items,
  }));
  const searchSelectData = (data) => {
    const mapped = data?.map((item) => item.name);
    setSelectRecommendedNames(mapped ?? []);
    dispatch(setadvice(data));
    dispatch(
      setAdviceNotes(
        String(
          data?.map((item) => {
            return item;
          })
        )
      )
    );
  };
  return (
    <>
      <Header
        title={"Advice"}
        headerTitle={reduxColors.headerTitle}
        noIcon={true}
        search={false}
        hideMenu={true}
        backgroundColor={constThemeColor?.onPrimary}
        customBack={() => navigation.navigate("AddMedical")}
      />
      <Loader visible={isLoading} />
      <View style={[reduxColors.container, reduxColors.center]}>
        {/* Advice Input Box */}
        <View style={reduxColors.adviceContainer}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[reduxColors.searchBox]}
            onPress={() => {
              navigation.navigate("CommonSearch", {
                name: Constants.MEDICAL_TEMPLATE_TYPE.ADVICE,
                listData: allAdviceData,
                selected: searchSelected,
                add_permission: userPermissions["medical_add_advices"],
                onGoBack: (e) => searchSelectData(e),
              });
            }}
          >
            <View style={[reduxColors.histopathologySearchField]}>
              <AntDesign
                name="search1"
                size={20}
                color={constThemeColor.onSurfaceVariant}
                marginLeft={15}
              />
              <Text
                style={{
                  color: constThemeColor.onSurfaceVariant,
                  marginLeft: Spacing.body,
                  fontSize: FontSize.Antz_Minor_Title.fontSize,
                }}
              >
                Search Advices
              </Text>
            </View>
          </TouchableOpacity>
          <TextInput
            accessible={true}
            accessibilityLabel={"adviceMainInput"}
            AccessibilityId={"adviceMainInput"}
            multiline={true}
            autoCompleteType="off"
            placeholder="Type Advice"
            placeholderTextColor={constThemeColor.outlineVariant}
            style={reduxColors.adviceTextField}
            onChangeText={(e) => changeAdvice(e)}
            maxLength={2000}
            defaultValue={selectRecommendeNames
              ?.map((item) => item)
              .join(",\n")}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={reduxColors.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Save Button */}
          {selectRecommendeNames?.length > 0 && toggleSaveBtn == true ? (
            <SaveTemplate
              disable={disableSaveBtn}
              closeTempSave={closeTempSave}
              handleSave={handleSave}
              onChangeText={(e) => setTemplateName(e)}
            />
          ) : null}

          {selectRecommendeNames?.length > 0 && toggleSaveBtn == false ? (
            <SaveAsTemplate
              handleClearAll={() => {
                setDialougeTitle("Do you want to clear all?");
                alertModalOpen();
              }}
              handleClickSaveTemp={handleClickSaveTemp}
            />
          ) : null}

          <View style={{ marginVertical: Spacing.minor }}>
            {/* Template List */}
            {templates?.length >= 1 ? (
              <>
                <MedicalRecordSection
                  data={mappedResult}
                  title={"Your Template"}
                  handleToggle={handleSelectFromTemplate}
                  titleStyle={{ color: constThemeColor.onSurface }}
                  contStyle={{ backgroundColor: constThemeColor.surface }}
                />
              </>
            ) : (
              <></>
            )}

            {/* Recommende List */}
            {adviceData?.length >= 1 ? (
              <MedicalRecordSection
                data={adviceData}
                title={"Recently Used"}
                selectedItemsColor={selectedItemsColor}
                handleToggle={handleSelectRecomended}
              />
            ) : null}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={{ width: "100%" }}>
          <Footermedical
            ShowIonicons={true}
            ShowRighticon={true}
            firstlabel={"Prescription"}
            lastlabel={"Lab Test Request"}
            navigatePreviousScreen={navigatePreviousScreen}
            navigateNextScreen={navigateNextScreen}
            onPress={() => {
              done(selectRecommendeNames);
            }}
          />
        </View>
        <DialougeModal
          isVisible={isModalVisible}
          alertType={Config.ERROR_TYPE}
          title={DialougeTitle}
          closeModal={alertModalClose}
          firstButtonHandle={confirmButtonPress}
          secondButtonHandle={cancelButtonPress}
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
    </>
  );
};

export default Advice;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
    },
    adviceContainer: {
      width: "100%",
      paddingHorizontal: Spacing.minor,
    },
    adviceTextField: {
      maxHeight: 200,
      minHeight: 100,
      padding: Spacing.small,
      backgroundColor: reduxColors.onPrimary,
      color: reduxColors.onSurfaceVariant,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      lineHeight: Spacing.minor,
      borderRadius: Spacing.small,
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
      textAlignVertical: "top",
    },
    scrollContainer: {
      width: "100%",
      paddingHorizontal: Spacing.body,
      paddingBottom: Spacing.minor,
      backgroundColor: reduxColors.onPrimary,
    },
    saveBtnCover: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: Spacing.major,
      marginHorizontal: Spacing.mini,
    },
    inputTemp: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      borderBottomWidth: 1,
      borderColor: reduxColors.adviceBorderColor1,
      height: Spacing.major,
      marginRight: Spacing.mini,
      flex: 1,
    },
    saveAsTempBtn: {
      width: "50%",
      backgroundColor: reduxColors.onPrimary,
      alignItems: "center",
      alignSelf: "flex-start",
      display: "flex",
      flexDirection: "row",
    },
    clearSelection: {
      width: "50%",
      alignItems: "center",
      justifyContent: "flex-end",
      display: "flex",
      flexDirection: "row",
    },
    saveBtnContainer: {
      flexDirection: "row",
      marginBottom: Spacing.small,
      alignItems: "center",
      marginTop: hp(1),
      justifyContent: "space-between",
    },
    saveTemp: {
      fontSize: FontSize.Antz_Standerd,
      textAlign: "center",
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      marginLeft: 3,
      color: reduxColors.onPrimary,
    },
    saveTempInput: {
      width: wp(60),
      height: 40,
    },
    ClearSelect: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      textAlign: "center",
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onSurface,
    },
    commonListStyle: {
      flexDirection: "row",
      flex: 1,
      flexWrap: "wrap",
    },
    histopathologySearchField: {
      color: reduxColors.onSurfaceVariant,
      fontSize: FontSize.Antz_Minor,
      backgroundColor: reduxColors?.onPrimary,
      borderWidth: 1,
      borderColor: reduxColors?.outline,
      width: "100%",
      height: 50,
      borderRadius: 50,
      flexDirection: "row",
      alignContent: "center",
      alignItems: "center",
    },
    searchBox: {
      marginBottom: Spacing.body,
      // marginHorizontal: Spacing.minor,
    },
  });
