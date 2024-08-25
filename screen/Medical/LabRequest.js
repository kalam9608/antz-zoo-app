import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  FlatList,
  TouchableHighlight,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import Footermedical from "../../components/Footermedical";
import { useDispatch, useSelector } from "react-redux";
import {
  setAdditionalSamples,
  setLabRequests,
  setMultiLabTests,
} from "../../redux/MedicalSlice";
import {
  addLabFiles,
  labSampleList,
  listMostlyUsed,
  listRecentlyUsed,
  removeLabFiles,
} from "../../services/MedicalsService";
import Loader from "../../components/Loader";
import FontSize from "../../configs/FontSize";
import { successToast } from "../../utils/Alert";
import SubmitBtn from "../../components/SubmitBtn";
import Spacing from "../../configs/Spacing";
import LabTestCard from "../../components/medical/LabTestCard";
import InputBox from "../../components/InputBox";
import { dateFormatter, getDocumentData, getFileData } from "../../utils/Utils";
import Constants from "../../configs/Constants";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import MedicalRecordSection from "../../components/MedicalRecordSection";
import Header from "../../components/Header";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import moment from "moment/moment";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { TouchableWithoutFeedback } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { documentType } from "../../configs/Config";
import { Image } from "react-native";
import ImageViewer from "../../components/ImageViewer";
import { getAnimalMedicalDetailsNew } from "../../services/AnimalService";
import { handleFilesPick } from "../../utils/UploadFiles";
import { useToast } from "../../configs/ToastConfig";

const LabRequest = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const medicalSettingsData = useSelector(
    (state) => state.medical.medicalSettings
  );
  const labRequestSelectData = useSelector(
    (state) => state.medical.labRequests
  );
  const additionalSamplesData = useSelector(
    (state) => state.medical.additionalSamples
  );
  const multipleLabTests = useSelector(
    (state) => state.medical.multipleLabTests
  );
  const medicalRecordId = useSelector((state) => state.medical.medicalRecordId);
  const animal_id = useSelector((state) => state.medical.animal[0]?.animal_id);

  const [labTestDataArray, setLabTestDataArray] = useState(
    labRequestSelectData?.length !== 0
      ? labRequestSelectData
      : medicalSettingsData?.labTests
  );
  const [extraSample, setExtraSample] = useState(
    additionalSamplesData ? additionalSamplesData : ""
  );
  const [isLoading, setisLoading] = useState(false);
  // const [mostlyUsedData, setMostlyUsedData] = useState(
  //   medicalSettingsData?.mostUsedLabTests ?? []
  // );
  const [recentlyUsedData, setRecentlyUsedData] = useState(
    medicalSettingsData?.recentlyUsedLabTests ?? []
  );
  const [selectedLabTestId, setSelectedLabTestId] = useState("");
  const [selectedLabTestIdforFiles, setSelectedLabTestIdforFiles] =
    useState("");
  const [documentModal, setDocumentModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
const {errorToast}=useToast()
  const modalStyles =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  // fot taking reduxColors from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  useEffect(() => {
    if (extraSample && extraSample?.charAt(0) == ' ') {
      setExtraSample(extraSample?.trimStart());
    }
  }, [extraSample]);




  const handleSelectCommon = (e) => {
    const updatedLabTestDataArray = labTestDataArray.map((sample) => {
      const updatedSample = {
        ...sample,
        tests: sample.tests.map((test) => {
          const updatedTest = {
            ...test,
            child_tests: test.child_tests.map((childTest) => {
              if (childTest.test_id === parseInt(e.id)) {
                return {
                  ...childTest,
                  value: !childTest.value,
                };
              }
              return childTest;
            }),
          };
          updatedTest.active = updatedTest.child_tests.some(
            (childTest) => childTest.value === true
          );

          // Exclude "Others" test from setting full_test to true
          if (test.test_name !== "Others") {
            updatedTest.full_test = updatedTest.child_tests.every(
              (childTest) => childTest.value === true
            );
          }

          return updatedTest;
        }),
      };

      updatedSample.active = updatedSample.tests.some(
        (test) => test.active === true
      );

      return updatedSample;
    });
    setLabTestDataArray(updatedLabTestDataArray);
  };

  const handleDocumentPick = async () => {
    // try {
    //   const result = await DocumentPicker.getDocumentAsync({
    //     type: documentType,
    //   });
    //   if (!result.canceled) {
    //     setSelectedItems([...selectedItems, getFileData(result?.assets[0])]);
    //   }
    // } catch (err) {
    //   console.log("Error picking document:", err);
    // }
    setSelectedItems(await handleFilesPick(errorToast, "doc",setisLoading, selectedItems, true));
  };

  const handleImagePick = async () => {
    // try {
    //   const result = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //     allowsEditing: true,

    //     quality: 1,
    //   });
    //   if (
    //     result &&
    //     !result.canceled &&
    //     result.assets &&
    //     result.assets.length > 0
    //   ) {
    //     setSelectedItems([...selectedItems, getFileData(result.assets[0])]);
    //   }
    // } catch (err) {
    //   console.log("Error picking image:", err);
    // }
    setSelectedItems(await handleFilesPick(errorToast, "image",setisLoading, selectedItems, true));
  };

  const removeDocuments = (docsName) => {
    const filterData = selectedItems?.filter((item) => {
      if (item?.type == "image/jpeg") {
        return item?.uri != docsName;
      } else {
        return item?.name != docsName;
      }
    });
    setSelectedItems(filterData);
  };

  const submitLabFiles = () => {
    setisLoading(true);
    setDocumentModal(false);
    let postData = {
      animal_id: animal_id,
      medical_record_id: medicalRecordId,
      lab_test_id: selectedLabTestIdforFiles,
      entity_id: selectedLabTestIdforFiles,
    };
    addLabFiles(postData, selectedItems, "lab_test_files[]")
      .then((res) => {
        if (res.success) {
          successToast("Success!!", res.message);
          getLabData();
        } else {
          errorToast("Oops!!", res.message);
        }
      })
      .catch((err) => {
        errorToast("Oops!!", JSON.stringify(err));
      })
      .finally(() => {
        setSelectedItems([]);
        setisLoading(false);
      });
  };

  const removeFiles = (id) => {
    setisLoading(true);
    setDocumentModal(false);
    removeLabFiles(id)
      .then((res) => {
        if (res.success) {
          successToast("Success!!", res.message);
          getLabData();
        } else {
          errorToast("Oops!!", res.message);
        }
      })
      .catch((err) => {
        errorToast("Oops!!", JSON.stringify(err));
      })
      .finally(() => {
        setSelectedItems([]);
        setisLoading(false);
      });
  };

  const getLabData = () => {
    setisLoading(true);
    getAnimalMedicalDetailsNew({
      medical_record_id: medicalRecordId,
    })
      .then((res) => {
        dispatch(setMultiLabTests(res.data.lab));
      })
      .catch((err) => {
        errorToast("Oops!!", JSON.stringify(err));
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  const openPDF = async (pdfURL) => {
    const supported = await Linking.canOpenURL(pdfURL);

    if (supported) {
      await Linking.openURL(pdfURL);
    } else {
      console.error(`Don't know how to open URL: ${pdfURL}`);
    }
  };

  const toggleModal = () => {
    setDocumentModal(!documentModal);
    setSelectedItems([]);
  };

  const removeTests = (testObj) => {
    const updatedLabTestDataArray = labTestDataArray.map((sample) => {
      const updatedSample = { ...sample };
      updatedSample.tests = updatedSample.tests.map((test) => {
        if (test.test_id === testObj.test_id) {
          test.full_test = false;
          test.child_tests = test.child_tests.map((childTest) => ({
            ...childTest,
            value: false,
          }));
        }

        // Check if the testObj is "Others" and update accordingly
        if (testObj.test_name === "Others") {
          test.full_test = false;
          test.input_value = ""; // Clear the input_value for "Others"
        }

        return test;
      });

      // Check if any child test in the current sample is true
      const anyChildTestTrue = updatedSample.tests.some((test) =>
        test.child_tests.some((childTest) => childTest.value === true)
      );

      // If any child test is true in the current sample, set sample.active to true
      if (anyChildTestTrue) {
        updatedSample.active = true;
      } else {
        updatedSample.active = false;
      }

      return updatedSample;
    });

    setLabTestDataArray(updatedLabTestDataArray);
  };

  /**
   * Back nav
   */
  const goback = () => {
    dispatch(setLabRequests(labTestDataArray));
    navigation.navigate("AddMedical");
  };

  /**
   * Submit
   */
  const clickFunc = (item) => {
    
    dispatch(setLabRequests(item));
    dispatch(setAdditionalSamples(extraSample));
    goback();
  };

  /**
   * Color
   */
  const selectedItemsColor = (itemId) => {
    let item = labTestDataArray.some((sample) =>
      sample.tests.some((test) =>
        test.child_tests.some(
          (childTest) =>
            childTest.test_id == itemId.id && childTest.value === true
        )
      )
    );
    return item;
  };

  /**
   * Merge search select data
   */
  const searchSelectData = (data) => {
    setLabTestDataArray(data);
  };

  /**
   * Navigation
   */
  const navigateNextScreen = () => {
    dispatch(setLabRequests(labTestDataArray));
    dispatch(setAdditionalSamples(extraSample));
    navigation.navigate("Notes");
  };
  const navigatePreviousScreen = () => {
    dispatch(setLabRequests(labTestDataArray));
    dispatch(setAdditionalSamples(extraSample));
    navigation.navigate("Advice");
  };
  const handleSelectedLabTest = (labTestId) => {
    if (selectedLabTestId === labTestId) {
      setSelectedLabTestId("");
    } else {
      setSelectedLabTestId(labTestId);
    }
  };
  const imageData = selectedItems.filter(
    (item) => item?.type.split("/")[0]?.toLowerCase() == "image"
  );

  const documentData = selectedItems.filter(
    (item) => item?.type.split("/")[0]?.toLowerCase() !== "image"
  );
  const reOrderedLabTestArray = (index, updatedTests) => {
    // Create a new array of objects
    const newData = [...labTestDataArray];

    // Update the tests array of the specified object
    newData[index] = { ...newData[index], tests: updatedTests };

    // Iterate over all tests in newData
    newData.forEach((test) => {
      // Filter out innerTest objects that don't meet the condition
      const filteredTests = test.tests.filter((innerTest) => {
        // Check if the condition fulfills for any childTest
        return innerTest.child_tests.some(
          (childTest) => childTest.value !== false
        );
      });

      // Filter out innerTest objects that meet the condition
      const rejectedTests = test.tests.filter((innerTest) => {
        // Check if the condition does not fulfill for any childTest
        return !innerTest.child_tests.some(
          (childTest) => childTest.value !== false
        );
      });

      // Concatenate filtered and rejected tests arrays
      test.tests = filteredTests.concat(rejectedTests);
    });

    setLabTestDataArray(newData);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={"Lab Test Request"}
        headerTitle={reduxColors.headerTitle}
        noIcon={true}
        search={false}
        hideMenu={true}
        backgroundColor={constThemeColor?.onPrimary}
        customBack={() => navigation.navigate("AddMedical")}
      />
      <Loader visible={isLoading} />
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: Spacing.minor,
          paddingBottom: Spacing.minor,
          backgroundColor: constThemeColor?.onPrimary,
        }}
      >
        <View
          style={{
            marginTop: Spacing.body,
            marginBottom: Spacing.minor,
            backgroundColor: constThemeColor?.onPrimary,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: Spacing.mini,
            }}
          >
            <Text
              style={[
                FontSize.Antz_Subtext_Regular,
                {
                  color: constThemeColor?.neutralPrimary,
                },
              ]}
            >
              Today:
            </Text>
            <Text
              style={[
                FontSize.Antz_Subtext_Regular,
                { color: constThemeColor?.neutralPrimary },
              ]}
            >
              {" "}
              {dateFormatter(new Date())}
            </Text>
          </View>
          <Text
            style={[
              FontSize.Antz_Minor_Title,
              { color: constThemeColor?.onSurfaceVariant },
            ]}
          >
            New Request
          </Text>
        </View>

        <View
          style={{
            backgroundColor: constThemeColor?.background,
            paddingVertical: Spacing.minor,
            borderRadius: Spacing.small,
          }}
        >
          <View style={{ marginBottom: Spacing.small }}>
            <SubmitBtn
              buttonText="Add Tests"
              onPress={() =>
                navigation.navigate("LabTestSearch", {
                  name: "Lab Request",
                  listData: labTestDataArray,
                  onGoBack: (e) => searchSelectData(e),
                })
              }
              backgroundColor={constThemeColor.secondaryContainer}
              color={constThemeColor.onSecondaryContainer}
              iconName={"plus"}
              fontSize={FontSize.Antz_Minor_Medium.fontSize}
              fontWeight={FontSize.Antz_Minor_Medium.fontWeight}
            />
          </View>
          <LabTestCard
            data={labTestDataArray}
            reOrderedLabTestArray={reOrderedLabTestArray}
            removeTests={(e) => removeTests(e)}
          />
          <InputBox
            accessible={true}
            accessibilityLabel={"othersSampleInput"}
            AccessibilityId={"othersSampleInput"}
            value={extraSample}
            onChange={(v) => setExtraSample(v)}
            inputLabel={"Add any other special samples"}
            placeholder={"Enter samples name here..."}
            style={{
              marginHorizontal: Spacing.minor,
              marginTop:
                labTestDataArray && labTestDataArray.length >= 1
                  ? Spacing.small
                  : 0,
            }}
          />
        </View>
        {multipleLabTests.length > 0 ? (
          <>
            {multipleLabTests?.map((labTest, index) => {
              return (
                <View style={reduxColors?.labContainer}>
                  <TouchableOpacity
                    accessible={true}
                    accessibilityLabel={"multilabDropTouch"}
                    AccessibilityId={"multilabDropTouch"}
                    onPress={() => handleSelectedLabTest(labTest?.lab_test_id)}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      backgroundColor: constThemeColor.displaybgPrimary,
                      padding: Spacing.body,
                      alignItems: "center",
                      borderRadius: Spacing.small,
                    }}
                  >
                    <View>
                      <Text style={reduxColors?.labTextSub}>
                        {moment(
                          labTest?.lab_test_date,
                          "YYYY-MM-DD HH:mm:ss"
                        ).format("DD MMM YYYY")}
                      </Text>
                      <Text
                        style={[
                          reduxColors?.labTextTitle,
                          {
                            color:
                              selectedLabTestId === labTest?.lab_test_id
                                ? constThemeColor?.neutralPrimary
                                : constThemeColor?.onPrimaryContainer,
                          },
                        ]}
                      >
                        Lab Test - {labTest?.lab_test_id}
                      </Text>
                    </View>
                    {selectedLabTestId === labTest?.lab_test_id ? (
                      <MaterialIcons
                        name="keyboard-arrow-up"
                        size={24}
                        color={constThemeColor?.primary}
                      />
                    ) : (
                      <MaterialIcons
                        name="keyboard-arrow-down"
                        size={24}
                        color={constThemeColor?.onSurfaceVariant}
                      />
                    )}
                  </TouchableOpacity>
                  {selectedLabTestId === labTest?.lab_test_id ? (
                    <View style={{ paddingTop: Spacing.major }}>
                      {labTest?.data?.map((item, index) => {
                        return (
                          <>
                            {item?.is_child_test ? (
                              <View>
                                <Text style={reduxColors?.sampleTextTitle}>
                                  {item?.sample_name}
                                </Text>
                                <View>
                                  {item?.tests?.map((value) => {
                                    return (
                                      <>
                                        {value?.full_test ||
                                        value?.child_tests?.filter(
                                          (v) => v.value == true
                                        ).length > 0 ? (
                                          <View
                                            style={{
                                              backgroundColor:
                                                constThemeColor?.displaybgSecondary,
                                              marginVertical: Spacing.mini,
                                              padding: Spacing.small,
                                              borderRadius: 4,
                                            }}
                                          >
                                            <Text
                                              style={[
                                                {
                                                  color:
                                                    reduxColors?.onSurfaceVariant,
                                                  fontSize:
                                                    FontSize.Antz_Minor_Title
                                                      .fontSize,
                                                  fontWeight:
                                                    FontSize.Antz_Minor_Title
                                                      .fontWeight,
                                                },
                                              ]}
                                            >
                                              {value?.test_name}
                                            </Text>
                                            {value?.test_name == "Others" ? (
                                              <Text
                                                style={[
                                                  {
                                                    color:
                                                      reduxColors?.onSurfaceVariant,
                                                    fontSize:
                                                      FontSize.Antz_Body_Regular
                                                        .fontSize,
                                                    fontWeight:
                                                      FontSize.Antz_Body_Regular
                                                        .fontWeight,
                                                  },
                                                ]}
                                              >
                                                {" "}
                                                {value?.test_name == "Others"
                                                  ? value?.input_value
                                                  : value?.test_name}
                                              </Text>
                                            ) : null}

                                            <View>
                                              {value?.child_tests.length > 0 &&
                                                (!value?.full_test ||
                                                  value?.full_test ==
                                                    "false") && (
                                                  <>
                                                    {value?.child_tests?.map(
                                                      (v, i) => {
                                                        return (
                                                          <>
                                                            {v?.value && (
                                                              <View
                                                                style={{
                                                                  flexDirection:
                                                                    "row",
                                                                  alignItems:
                                                                    "center",
                                                                  marginVertical:
                                                                    Spacing.micro,
                                                                }}
                                                              >
                                                                <MaterialCommunityIcons
                                                                  name="check"
                                                                  size={24}
                                                                  color={
                                                                    constThemeColor?.primaryContainer
                                                                  }
                                                                  style={{
                                                                    marginRight:
                                                                      Spacing.small,
                                                                  }}
                                                                />
                                                                <Text
                                                                  style={[
                                                                    FontSize
                                                                      .Antz_Body_Regular
                                                                      .fontSize,
                                                                    {
                                                                      color:
                                                                        constThemeColor?.onSurfaceVariant,
                                                                      flex: 1,
                                                                    },
                                                                  ]}
                                                                  numberOfLines={
                                                                    2
                                                                  }
                                                                  ellipsizeMode="tail"
                                                                >
                                                                  {v?.test_name}
                                                                </Text>
                                                              </View>
                                                            )}
                                                          </>
                                                        );
                                                      }
                                                    )}
                                                  </>
                                                )}
                                            </View>
                                          </View>
                                        ) : null}
                                      </>
                                    );
                                  })}
                                </View>
                              </View>
                            ) : null}
                          </>
                        );
                      })}
                      {labTest?.additional_samples ? (
                        <View>
                          <Text style={reduxColors?.sampleTextTitle}>
                            Any other special samples
                          </Text>
                          <View>
                            <View
                              style={{
                                backgroundColor:
                                  constThemeColor?.displaybgSecondary,
                                marginVertical: Spacing.mini,
                                padding: Spacing.small,
                                borderRadius: 4,
                              }}
                            >
                              <Text
                                style={[
                                  {
                                    color: reduxColors?.onSurfaceVariant,
                                    fontSize:
                                      FontSize.Antz_Minor_Title.fontSize,
                                    fontWeight:
                                      FontSize.Antz_Minor_Title.fontWeight,
                                  },
                                ]}
                              >
                                {labTest?.additional_samples}
                              </Text>
                            </View>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  ) : null}

                  <TouchableOpacity
                    accessible={true}
                    accessibilityLabel={"reportAttach"}
                    AccessibilityId={"reportAttach"}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingHorizontal: Spacing.minor,
                      paddingTop: Spacing.minor,
                      paddingBottom: Spacing.mini,
                      alignItems: "center",
                      borderRadius: Spacing.small,
                    }}
                    onPress={() => {
                      setDocumentModal(!documentModal);
                      setSelectedLabTestIdforFiles(labTest?.lab_test_id);
                    }}
                  >
                    <Text
                      style={{
                        color: constThemeColor.onSecondaryContainer,
                        fontSize: FontSize.Antz_Minor_Regular.fontSize,
                        fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                      }}
                    >
                      Attach Reports
                    </Text>
                    <View
                      style={{
                        backgroundColor: constThemeColor.secondary,
                        height: 36,
                        width: 36,
                        borderRadius: widthPercentageToDP(50),
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name="attach-sharp"
                        size={24}
                        color={constThemeColor.onSurfaceVariant}
                      />
                    </View>
                  </TouchableOpacity>
                  <View>
                    <ImageViewer
                      data={labTest.attachments
                        .filter((i) => i.file_type.split("/")[0] == "image")
                        .map((e) => {
                          return {
                            id: e.id,
                            name: e.file_original_name,
                            url: e.file,
                          };
                        })}
                      horizontal
                      width={widthPercentageToDP(41)}
                      imgHeight={99}
                      imgWidth={widthPercentageToDP(40.5)}
                      imageClose={(item) => removeFiles(item?.id)}
                    />
                    <View style={[reduxColors.TitleView, {}]}>
                      <View>
                        {labTest.attachments
                          .filter((i) => i.file_type.split("/")[0] != "image")
                          .map((item) => (
                            <TouchableOpacity
                              onPress={() => openPDF(item?.file)}
                              accessible={true}
                              accessibilityLabel={"fileTouch"}
                              AccessibilityId={"fileTouch"}
                            >
                              <View
                                style={[
                                  reduxColors.attachBox,
                                  {
                                    backgroundColor:
                                      constThemeColor?.background,
                                    // margin: widthPercentageToDP(2),
                                  },
                                ]}
                              >
                                <View style={{ flexDirection: "row" }}>
                                  <MaterialIcons
                                    name="picture-as-pdf"
                                    size={24}
                                    color={constThemeColor.onSurfaceVariant}
                                  />

                                  <View style={{ marginLeft: 10 }}>
                                    <Text
                                      style={reduxColors.attachText}
                                      numberOfLines={1}
                                      ellipsizeMode="tail"
                                    >
                                      {item?.file_original_name}
                                    </Text>
                                  </View>
                                </View>
                                <MaterialCommunityIcons
                                  name="close"
                                  size={24}
                                  color={constThemeColor.onSurfaceVariant}
                                  onPress={() => removeFiles(item?.id)}
                                />
                              </View>
                            </TouchableOpacity>
                          ))}
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </>
        ) : null}
        {/* {mostlyUsedData?.length > 0 ? (
          <>
            <MedicalRecordSection
              data={mostlyUsedData}
              title={"Most common"}
              selectedItemsColor={selectedItemsColor}
              handleToggle={handleSelectCommon}
            />
          </>
        ) : null} */}

        {recentlyUsedData?.length > 0 ? (
          <>
            <MedicalRecordSection
              data={recentlyUsedData}
              title={"Recently used"}
              selectedItemsColor={selectedItemsColor}
              handleToggle={handleSelectCommon}
            />
          </>
        ) : null}
      </ScrollView>
      {documentModal ? (
        <Modal
          avoidKeyboard
          animationType="fade"
          transparent={true}
          visible={true}
          style={[
            modalStyles.bottomSheetStyle,
            { backgroundColor: "transparent" },
          ]}
        >
          <TouchableWithoutFeedback
            onPress={toggleModal}
            style={[reduxColors.modalOverlay]}
          >
            <View style={[reduxColors.modalOverlay]}>
              <TouchableWithoutFeedback onPress={() => setDocumentModal(true)}>
                <View
                  style={[
                    reduxColors.modalContainer,
                    {
                      paddingHorizontal: Spacing.small + Spacing.mini,
                      paddingTop: Spacing.small + Spacing.mini,
                      maxHeight: 500,
                    },
                  ]}
                >
                  <ImageViewer
                    data={imageData}
                    horizontal={true}
                    width={160}
                    imgWidth={160}
                    imgHeight={100}
                    imageClose={(item) => removeDocuments(item?.uri)}
                  />
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {documentData?.map((item) => (
                      <TouchableWithoutFeedback
                        style={{ marginTop: Spacing.small }}
                      >
                        <View
                          style={[
                            reduxColors.attachBox,
                            {
                              backgroundColor: constThemeColor.displaybgPrimary,
                              margin: widthPercentageToDP(2),
                            },
                          ]}
                        >
                          <MaterialIcons
                            name="picture-as-pdf"
                            size={24}
                            color={constThemeColor.onSurfaceVariant}
                          />
                          <View style={{ marginLeft: 10 }}>
                            <Text style={reduxColors.attachText}>
                              {item?.name}
                            </Text>
                          </View>

                          <MaterialCommunityIcons
                            name="close"
                            size={24}
                            color={constThemeColor.onSurfaceVariant}
                            style={{
                              paddingHorizontal: 5,
                            }}
                            onPress={() => removeDocuments(item?.name)}
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </ScrollView>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      padding: Spacing.major,
                    }}
                  >
                    <TouchableWithoutFeedback onPress={handleDocumentPick}>
                      <View style={reduxColors.modalView}>
                        <View
                          style={{
                            backgroundColor: constThemeColor.secondary,
                            height: 50,
                            width: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 40,
                          }}
                        >
                          <Ionicons
                            name="document-text-sharp"
                            size={24}
                            color={constThemeColor.onPrimary}
                          />
                        </View>
                        <Text style={reduxColors.docsText}>Document</Text>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={handleImagePick}>
                      <View style={reduxColors.modalView}>
                        <View
                          style={{
                            backgroundColor: constThemeColor.secondary,
                            height: 50,
                            width: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 30,
                          }}
                        >
                          <FontAwesome
                            name="image"
                            size={22}
                            color={constThemeColor.onPrimary}
                          />
                        </View>
                        <Text style={reduxColors.docsText}>Add Photo</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  <View
                    style={{
                      backgroundColor: constThemeColor.addBackground,
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    {selectedItems.length > 0 ? (
                      <View style={{ padding: 16 }}>
                        <TouchableOpacity
                          style={{
                            backgroundColor: constThemeColor.primary,
                            padding: 10,
                            borderRadius: 8,
                            // width: "20%",
                          }}
                          onPress={submitLabFiles}
                          accessible={true}
                          accessibilityLabel={"btnSubmit"}
                          AccessibilityId={"btnSubmit"}
                        >
                          <Text style={{ color: constThemeColor.onPrimary }}>
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      ) : null}
      <View style={{ width: "100%" }}>
        <Footermedical
          ShowIonicons={true}
          ShowRighticon={true}
          firstlabel={"Advice"}
          lastlabel={`Attachments & Notes`}
          navigateNextScreen={navigateNextScreen}
          navigatePreviousScreen={navigatePreviousScreen}
          onPress={() => {
            clickFunc(labTestDataArray);
          }}
        />
      </View>
    </View>
  );
};
export default LabRequest;

const styles = (reduxColors) =>
  StyleSheet.create({
    searchSuggestionTitle: {
      color: reduxColors.onSecondaryContainer,
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      marginTop: Spacing.minor,
      marginBottom: Spacing.mini,
      marginLeft: Spacing.micro,
    },
    commBtnContainer: { flexDirection: "row", flex: 1, flexWrap: "wrap" },
    caseTypeBtnTxt: {
      fontSize: FontSize.Antz_Standerd,
      color: reduxColors.onSurfaceVariant,
      lineHeight: 17,
    },
    labContainer: {
      backgroundColor: reduxColors?.displaybgSecondary,
      width: "100%",
      padding: Spacing.body,
      marginTop: Spacing.body,
      borderRadius: 8,
    },
    labTextSub: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    labTextTitle: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors?.onSurfaceVariant,
    },
    sampleTextTitle: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors?.onSurfaceVariant,
    },
    activeSearchSgBtnCover: {
      width: "auto",
      margin: Spacing.mini,
      paddingHorizontal: Spacing.small,
      paddingVertical: Spacing.mini + Spacing.micro,
      height: 32,
      borderRadius: Spacing.small,
      borderWidth: 1,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.secondaryContainer,
      justifyContent: "center",
      alignItems: "center",
    },
    searchSuggestionbtnCover: {
      width: "auto",
      margin: Spacing.mini,
      paddingHorizontal: Spacing.small,
      paddingVertical: Spacing.mini + Spacing.micro,
      height: 32,
      borderRadius: Spacing.small,
      borderWidth: 1,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.onPrimary,
      justifyContent: "center",
      alignItems: "center",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: reduxColors.blackWithPointEight,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: reduxColors.onPrimary,
      width: widthPercentageToDP("100%"),
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    modalView: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    docsText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    attachBox: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      marginBottom: 3,
      marginTop: 3,
      backgroundColor: reduxColors.surface,
    },
  });
