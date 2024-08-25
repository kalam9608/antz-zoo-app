import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import AddMedicalRecordCard from "../../components/AddMedicalRecordCard";
import { useDispatch, useSelector } from "react-redux";
import {
  removeMedical,
  setAddMedicalPage,
  setEditFor,
  setEffectListApiCall,
  setMedicalAnimal,
  setMedicalEnclosure,
  setMedicalSection,
  setcaseType,
} from "../../redux/MedicalSlice";
import { Chip, List } from "react-native-paper";
import MedicalHeader from "./MedicalHeader";
import SubmitBtn from "../../components/SubmitBtn";
import Header from "../../components/Header";
import {
  createMedicalRecordNew,
  editMedicalRecordNew,
  getMedicalMasterdata,
  getTemplate,
  listRecentlyUsed,
} from "../../services/MedicalsService";

// --- For fine-tuning the performance ------------
import { setMedicalSettings } from "../../redux/MedicalSlice";
// import { errorToast, successToast, warningToast } from "../../utils/Alert";
// ------------------------------------------------

// IMPORT SVG TO INDIVIDUAL VARIABLES
import svg_med_case_type from "../../assets/Med_Casetype.svg";
import svg_med_complaints from "../../assets/Med_Complaints.svg";
import svg_med_diagnosis from "../../assets/Med_Diagnosis.svg";
import svg_med_prescription from "../../assets/Med_Prescription.svg";
import svg_med_advice from "../../assets/Med_Advice.svg";
import svg_med_lab from "../../assets/Med_Lab.svg";
// import svg_med_notes from "../../assets/Med_Notes.svg";
import svg_med_notes from "../../assets/Med_Attachments.svg";
import svg_med_follow_up_date from "../../assets/Med_Followup.svg";

import { severityColor, opacityColor, getFileData } from "../../utils/Utils";
import Loader from "../../components/Loader";
import DynamicAlert from "../../components/DynamicAlert";
import FontSize from "../../configs/FontSize";
import moment from "moment";
import MedicalAnimalCard from "../../components/MedicalAnimalCard";
import Spacing from "../../configs/Spacing";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
// import { errorDailog, successDailog } from "../../utils/Alert";
import Constants from "../../configs/Constants";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import { useToast } from "../../configs/ToastConfig";
import { getAsyncData } from "../../utils/AsyncStorageHelper";

const AddMedical = (props) => {
  const dispatch = useDispatch();
  const [DataCase, setDataCase] = useState("");
  const [idCase, setIdCase] = useState("");
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [prescription, setprescription] = useState([]);
  const [advice, setAdvice] = useState([]);
  const [adviceNotes, setAdviceNotes] = useState("");
  const [expand, setExpand] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [SelectedAnimal, setSelectedAnimal] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [SelectedEnclosure, setSelectedEnclosure] = useState([]);
  const [SelectedSection, setSelectedSection] = useState([]);
  const [successData, setSucessData] = useState(null);
  const [selectedSite, setSelectedSite] = useState({});
  // For Dialouge type modal  =========================
  const [isModalVisible, setModalVisible] = useState(false);
  const [DialougeTitle, setDialougeTitle] = useState("");
  const { showToast, errorToast, successToast, warningToast } = useToast();
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };
  const confirmButtonPress = () => {
    handleOK(successData);
  };

  const cancelButtonPress = () => {
    setSucessData(null);
    dispatch(removeMedical());
    alertModalClose();
  };

  const navigation = useNavigation();
  const medicalRecordId = useSelector((state) => state.medical.medicalRecordId);
  const caseType = useSelector((state) => state.medical.caseType);
  const diagnosisSelectData = useSelector((state) => state.medical.diagnosis);
  const editFromAnimalDetailsPage = useSelector(
    (state) => state.medical.editFromAnimalDetailsPage
  );
  const editFor = useSelector((state) => state.medical.editFor);
  const multipleLabTests = useSelector(
    (state) => state.medical.multipleLabTests
  );
  const complaintDataSelector = useSelector(
    (state) => state.medical.complaints
  );

  const prescriptionSelectData = useSelector(
    (state) => state.medical.prescription
  );
  const bodyWeightRedux = useSelector((state) => state.medical.bodyWeight);
  const AdiveSelectData = useSelector((state) => state.medical.advice);
  const AdviceNotesData = useSelector((state) => state.medical.adviceNotes);
  const SelectedAnimalRedux = useSelector((state) => state.medical.animal);
  const SelectedEnclosureRedux = useSelector(
    (state) => state.medical.enclosure
  );

  const SelectedSectionRedux = useSelector((state) => state.medical.section);
  const attachmentData = useSelector((state) => state.medical.attachments);
  const labRequests = useSelector((state) => state.medical.labRequests);
  const [labRequestActive, setLabRequestActive] = useState(false);

  // --- For fine-tuning the performance ------------
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const selectedSite = async () => {
      try {
        const data = await getAsyncData("@antz_selected_site");
        return setSelectedSite(data);
      } catch (e) {
        return setSelectedSite({});
      }
    };
    const sub = navigation.addListener("focus", () => {
      selectedSite();
    });

    return sub;
  }, []);

  const fetchData = () => {
    setisLoading(true);
    Promise.all([
      getMedicalMasterdata(),
      listRecentlyUsed({ item_type: "all" }),
      getTemplate({ type: "all" }),
    ])
      .then((res) => {
        if (res[0].success) {
          let allData = res[0]?.data;
          const recentlyUsedData = res[1]?.data;
          const templateData = res[2]?.data;
          let caseTypes = allData?.caseTypes;
          let complaintsTemplates = templateData?.complaintsTemplates;

          let recentlyUsedComplaints =
            recentlyUsedData?.recentlyUsedComplaints?.map((item) => {
              return {
                id: item.id,
                name: item.label,
              };
            });

          let diagnosisTemplates = templateData?.diagnosisTemplates;
          let recentlyUsedDiagnosis =
            recentlyUsedData?.recentlyUsedDiagnosis?.map((item) => {
              return {
                id: item.id,
                name: item.label,
              };
            });
          let medicineTemplates = templateData?.medicineTemplates ?? [];
          let recentlyUsedMedicines =
            recentlyUsedData?.recentlyUsedMedicines?.map((item) => {
              return {
                id: item.id,
                name: item.label,
                ...item,
              };
            });
          let prescriptionMeasurementType =
            allData?.prescriptionMeasurementType;
          let prescriptionDosageMeasurementType =
            allData?.prescriptionDosageMeasurementType;
          let prescriptionDuration = allData?.prescriptionDuration;
          let prescriptionFrequency = allData?.prescriptionFrequency;
          let prescriptionDeliveryRoute = allData?.prescriptionDeliveryRoute;
          let adviceTemplates = templateData?.adviceTemplates;
          let recommendedAdvices = allData?.recommendedAdvices?.map((item) => {
            return {
              id: item.id,
              name: item.label,
            };
          });
          let recentlyUsedAdvices = recentlyUsedData?.recentlyusedAdvice?.map(
            (item) => {
              return {
                id: item.id,
                name: item.label,
              };
            }
          );

          let labTests = allData?.labTests;
          let recentlyUsedLabTests =
            recentlyUsedData?.recentlyUsedLabTests?.map((item) => {
              return {
                id: item.id,
                name: item.label,
              };
            });
          dispatch(
            setMedicalSettings({
              caseTypes,
              complaintsTemplates,
              recentlyUsedComplaints,
              diagnosisTemplates,
              recentlyUsedDiagnosis,
              medicineTemplates,
              recentlyUsedMedicines,

              prescriptionMeasurementType,
              prescriptionDosageMeasurementType,
              prescriptionDuration,
              prescriptionFrequency,
              prescriptionDeliveryRoute,

              adviceTemplates,
              recommendedAdvices,
              recentlyUsedAdvices,
              labTests,
              recentlyUsedLabTests,
            })
          );
          if (medicalRecordId==null) {
            dispatch(setcaseType(caseTypes?.length > 0 ? caseTypes[0] : {}));
          }
        } else {
          warningToast("Oops!!", "Data not loaded!!");
        }
        setisLoading(false);
      })
      .catch((err) => {
        setisLoading(false);
        errorToast("error", "Something went wrong!!");
      })
      .finally(() => {
        setisLoading(false);
        if (editFor === Constants.MEDICAL_TEMPLATE_TYPE.DIAGNOSIS) {
          navigation.navigate("Diagnosis");
        } else if (editFor === Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION) {
          navigation.navigate("Prescription");
        }
        dispatch(setEditFor(""));
      });
  };

  // ------------------------------------------------

  useEffect(() => {
    // Check if any lab request is active
    const isActive = labRequests.some(
      (outerObject) => outerObject.active === true
    );
    const isActiveMultipleLab = multipleLabTests.some(
      (outerObject) => outerObject.lab_test_id
    );
    setLabRequestActive(
      isActive || isActiveMultipleLab || additionalSamplesData
    );
  }, [labRequests, JSON.stringify(multipleLabTests)]);

  useEffect(() => {
    if (
      AdiveSelectData.length > 0 ||
      labRequestActive ||
      (attachmentData.notes.length > 0 &&
        attachmentData.images.length > 0 &&
        attachmentData.documents.length > 0) ||
      followUpDate.length > 0
    ) {
      setExpand(true);
    }
  }, [labRequestActive, AdiveSelectData, attachmentData, followUpDate]);

  const additionalSamplesData = useSelector(
    (state) => state.medical.additionalSamples
  );
  const followUpDate = useSelector((state) => state.medical.followUpDate);
  const showFollowUpDate = useSelector(
    (state) => state.medical.showFollowUpDate
  );
  const editFromSummaryPage = useSelector(
    (state) => state.medical.editFromSummaryPage
  );

  const [complete_name, setcomplete_name] = useState("");

  useEffect(() => {
    if (props.route.params?.item?.animal_id) {
      dispatch(setMedicalAnimal([props.route.params?.item]));
      setcomplete_name(props.route.params?.item);
    }
  }, [props.route.params?.item?.animal_id]);
  const [finalData, setFinalData] = useState({});
  /**
   * Alert
   */
  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  /**
   * Navigations
   */
  const CaseType = () => {
    navigation.navigate("CaseType");
  };

  const chooseAnimal = () => {
    navigation.navigate("CommonAnimalSelectMedical", {
      screenName: "Medical",
      limit: Infinity,
      selectedIds: selectedIds,
    });
  };
  const gotoComplaints = () => {
    navigation.navigate("Complaints",{
      medicalRecordId: medicalRecordId ?? false
    });
  };

  const gotoDaignosis = () => {
    navigation.navigate("Diagnosis", {
      medicalRecordId: medicalRecordId ?? false,
    });
  };
  // console.log(medicalRecordId);
  const gotoAdvice = () => {
    navigation.navigate("Advice");
  };
  const gotoPrescription = () => {
    navigation.navigate("Prescription", {
      edit: medicalRecordId ? true : false,
    });
  };
  const gotoLabRequest = () => {
    navigation.navigate("LabRequest");
  };
  const gotoNotes = () => {
    navigation.navigate("Notes");
  };
  const gotoFollowUpDate = () => {
    navigation.navigate("FollowUpDate");
  };

  const singleAnimalCheck =
    SelectedAnimal?.length == 1 &&
    SelectedEnclosure?.length == 0 &&
    SelectedSection?.length == 0;
  useEffect(() => {
    setSelectedAnimal(SelectedAnimalRedux);
    setSelectedIds(SelectedAnimalRedux?.map((i) => i?.animal_id));
  }, [JSON.stringify(SelectedAnimalRedux)]);
  useEffect(() => {
    setSelectedEnclosure(SelectedEnclosureRedux);
  }, [JSON.stringify(SelectedEnclosureRedux)]);
  useEffect(() => {
    setSelectedSection(SelectedSectionRedux);
  }, [JSON.stringify(SelectedSectionRedux)]);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setAllData();
    });
    return unsubscribe;
  }, [navigation, caseType]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setDiagnosisData(diagnosisSelectData);
    });
    return unsubscribe;
  }, [navigation, gotoDaignosis]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setComplaints(complaintDataSelector);
    });
    return unsubscribe;
  }, [navigation, gotoComplaints]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setprescription(prescriptionSelectData);
    });
    return unsubscribe;
  }, [navigation, gotoPrescription]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setAdvice(AdiveSelectData);
      setAdviceNotes(AdviceNotesData);
    });
    return unsubscribe;
  }, [navigation, gotoAdvice]);
  useEffect(() => {
    if (medicalRecordId == null) {
      setIdCase(caseType.id ?? "");
      setDataCase(caseType.label ?? "");
    }
  }, [caseType]);
  const setAllData = () => {
    setIdCase(caseType.id ?? "");
    setDataCase(caseType.label ?? "");
  };

  /**
   * Alert functions
   */
  const showAlert = () => {
    setIsVisible(true);
  };

  const hideAlert = () => {
    setIsVisible(false);
  };
  const moveBackToAnimalDetails = (e) => {
    navigation.goBack();
  };
  const handleOK = (data) => {
    setIsVisible(false);
    let obj = {
      medical_record_id: data?.id,
      item: data,
    };
    if (editFromAnimalDetailsPage) {
      obj.moveToBack = moveBackToAnimalDetails;
    }
    if (!editFromAnimalDetailsPage && !medicalRecordId) {
      dispatch(setAddMedicalPage(true));
    }
    if (singleAnimalCheck) {
      if (medicalRecordId && !editFromSummaryPage) {
        navigation.goBack();
      } else {
        navigation.navigate("MedicalSummary", obj);
      }
    } else {
      navigation.replace("MedicalRecordList");
    }
    // }
    setSucessData(null);
    dispatch(removeMedical());
    setSucessData(null);
    setModalVisible(false);
  };
  const handleCancel = () => {
    setSucessData(null);
    dispatch(removeMedical());
    setIsVisible(false);
  };
  /**
   * Create medical record
   */
  const handleSubmit = () => {
    setFinalData({});
    setisLoading(true);
    let obj = {
      site_id: selectedSite?.site_id,
      animal_id: JSON.stringify(SelectedAnimal?.map((p) => p?.animal_id)),
      enclosure_id: JSON.stringify(
        SelectedEnclosure?.map((p) => p?.enclosure_id)
      ),
      section_id: JSON.stringify(SelectedSection?.map((p) => p?.section_id)),
      case_type: caseType.id,
      complaints: JSON.stringify(complaintDataSelector),
      diagnosis: JSON.stringify(diagnosisData),
      prescription: JSON.stringify(prescriptionSelectData),
      lab: JSON.stringify({
        is_lab_test_present: labRequests.some(
          (outerObject) => outerObject.active === true
        ),
        is_additional_sample_present:
          additionalSamplesData.length > 0 ? true : false,
        lab_test: labRequests,
        additional_samples: additionalSamplesData,
      }),
      advices: JSON.stringify(AdiveSelectData),
      body_weight: bodyWeightRedux,
      notes_text: JSON.stringify(
        attachmentData?.notes?.map((value) => {
          return {
            ...value,
            date: moment(value?.date, "DD MMMM YYYY hh:mm A").format(
              "YYYY-MM-DD HH:mm:ss"
            ),
          };
        })
      ),
      follow_up_date: followUpDate
        ? moment(followUpDate, "DD-MM-YYYY").format("YYYY-MM-DD")
        : null,
    };
    const data =
      // attachmentData?.documents?.concat(attachmentData?.images) ?? [];
      [...attachmentData?.documents, ...attachmentData?.images];
    createMedicalRecordNew(obj, data ?? [], "notes_files[]")
      .then((res) => {
        setisLoading(false);
        if (res.success === true) {
          let data = {
            id: res?.data,
          };
          // successToast("Success!", res.message);
          setDialougeTitle(
            editFromAnimalDetailsPage
              ? "Do you want to go to medical record summary?"
              : singleAnimalCheck
              ? "Do you want to go to medical record summary?"
              : "Do you want to go to medical record list?"
          );
          successToast("success", res?.message);
          handleOK(data);
          // setSucessData(data);
          // setTimeout(() => {
          // alertModalOpen();
          // }, Constants.GLOBAL_ALERT_TIMEOUT_VALUE);
        } else {
          errorToast(
            "error",
            res.message ? res.message : "Something went wrong!!"
          );
        }
      })
      .catch((err) => {
        errorToast("error", "Something went wrong.");
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  /**
   * Edit medical record
   */
  const handleEdit = () => {
    setisLoading(true);
    let obj = {
      site_id: selectedSite?.site_id,
      animal_id: SelectedAnimal[0].animal_id,
      enclosure_id: JSON.stringify(
        SelectedEnclosure?.map((p) => p?.enclosure_id)
      ),
      section_id: JSON.stringify(SelectedSection?.map((p) => p?.section_id)),
      case_type: caseType.id,
      complaints: JSON.stringify(complaintDataSelector),
      diagnosis: JSON.stringify(diagnosisData),
      prescription: JSON.stringify(prescriptionSelectData),
      lab: JSON.stringify({
        is_lab_test_present: labRequests.some(
          (outerObject) => outerObject.active === true
        ),
        is_additional_sample_present:
          additionalSamplesData.length > 0 ? true : false,
        lab_test: labRequests,
        additional_samples: additionalSamplesData,
      }),
      additional_samples: additionalSamplesData,
      advices: JSON.stringify(AdiveSelectData),
      body_weight: bodyWeightRedux,
      notes_text: JSON.stringify(
        attachmentData?.notes?.map((value) => {
          return {
            ...value,
            date: moment(value?.date, "DD MMMM YYYY hh:mm A").format(
              "YYYY-MM-DD HH:mm:ss"
            ),
          };
        })
      ),
      follow_up_date: followUpDate
        ? moment(followUpDate, "DD-MM-YYYY").format("YYYY-MM-DD")
        : null,
    };
    const data =
      // attachmentData?.documents?.concat(attachmentData?.images) ?? [];
     
      [...attachmentData?.documents, ...attachmentData?.images];
    editMedicalRecordNew(obj, medicalRecordId, data ?? [], "notes_files[]")
      .then((res) => {
        setisLoading(false);
        if (res.success === true) {
          let data = {
            id: res?.data,
          };
          successToast("Success!", res.message);
          handleOK(data);
        } else {
          errorToast(
            "error",
            res.message ? res.message : "Something went wrong!!"
          );
        }
      })
      .catch((err) => {
        console.log({ err });
        errorToast("error", "Something went wrong.");
      })
      .finally(() => {
        setisLoading(false);
      });
  };
  const [cameFrom, setCameFrom] = useState(
    props?.route?.params?.cameFrom ?? false
  );
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  //clear data function
  const deleteFun = (type, id) => {
    dispatch(setEffectListApiCall(true));
    if (cameFrom != "AnimalDetails") {
      if (type == "animal") {
        if (!medicalRecordId) {
          const filterData = SelectedAnimal?.filter((p) => p.animal_id != id);
          setSelectedAnimal(filterData);
          setSelectedIds(filterData?.map((i) => i?.animal_id));
          dispatch(setMedicalAnimal(filterData));
        }
      } else if (type == "enclosure") {
        const filterData = SelectedEnclosure?.filter(
          (p) => p.enclosure_id != id
        );
        setSelectedEnclosure(filterData);
        dispatch(setMedicalEnclosure(filterData));
      } else if (type == "section") {
        const filterData = SelectedSection?.filter((p) => p.section_id != id);
        setSelectedSection(filterData);
        dispatch(setMedicalSection(filterData));
      }
    }
  };
  return (
    <View style={{ height: "100%" }}>
      <Header
        title={medicalRecordId ? "Edit Medical Record" : "Add Medical Record"}
        headerTitle={reduxColors.headerTitle}
        noIcon={true}
        search={false}
        hideMenu={true}
        backgroundColor={constThemeColor?.onPrimary}
      />
      <Loader visible={isLoading} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: constThemeColor.onPrimary }}
      >
        <View style={reduxColors.conatiner}>
          <MedicalAnimalCard
            outerStyle={[
              reduxColors.cardContainer,
              {
                marginTop: 0,
                paddingBottom:
                  SelectedAnimal?.length > 0 ||
                  SelectedEnclosure?.length > 0 ||
                  SelectedSection?.length > 0 ||
                  complete_name?.animal_id
                    ? 0
                    : null,
              },
            ]}
            title={"Select Animal(s)*"}
            navigation={() => {
              if (!complete_name?.animal_id) {
                chooseAnimal();
              }
            }}
            selectedAnimal={
              SelectedAnimal?.length > 0 ? SelectedAnimal[0] : null
            }
            animalList={SelectedAnimal}
            enclosureData={SelectedEnclosure}
            sectionData={SelectedSection}
            completeName={complete_name}
            deleteFun={deleteFun}
            allowRemove={
              medicalRecordId || cameFrom === "AnimalDetails" ? false : true
            }
          />

          {SelectedAnimal?.length > 0 ||
          SelectedEnclosure?.length > 0 ||
          SelectedSection?.length > 0 ||
          complete_name?.animal_id ? (
            <>
              {DataCase != "" ? (
                <AddMedicalRecordCard
                  children={
                    <View>
                      <View>
                        <Text style={reduxColors.title}>Case Type</Text>
                      </View>
                      <Text style={reduxColors.subtitle}>{DataCase}</Text>
                    </View>
                  }
                  image={false}
                  svgUri={false}
                  svgXML={true}
                  svgXMLData={svg_med_case_type}
                  onPress={() => CaseType()}
                  rightIcon={true}
                  data={true}
                />
              ) : (
                <AddMedicalRecordCard
                  children={
                    <View>
                      <Text style={[reduxColors.title]}>Case Type*</Text>
                    </View>
                  }
                  onPress={() => CaseType()}
                  svgXML={true}
                  svgXMLData={svg_med_case_type}
                  rightIcon={true}
                />
              )}

              {/**
               * Complaints
               */}
              {complaintDataSelector?.filter((item)=>item?.additional_info?.status!=='closed').length > 0 ? (
                <AddMedicalRecordCard
                  children={
                    <>
                      <View>
                        <Text style={reduxColors.selectedTitle}>
                          Complaints*
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                        }}
                      >
                        {complaints
                          ?.filter(
                            (p) => p?.additional_info?.status != "closed"
                          )
                          ?.map((item, index) => {
                            return (
                              <View key={index}>
                                <Chip
                                  style={[
                                    reduxColors.painbox,
                                    {
                                      // backgroundColor: severityColor(
                                      //   item.additional_info.severity
                                      // ),
                                      borderWidth: 1,
                                      borderColor: constThemeColor.outline,
                                      backgroundColor: constThemeColor.surface,
                                    },
                                  ]}
                                >
                                  <Text
                                    style={{
                                      // color:
                                      //   item.additional_info?.severity ===
                                      //   "Extreme"
                                      //     ? constThemeColor.onPrimary
                                      //     : constThemeColor.onTertiaryContainer,
                                      // fontWeight:
                                      //   FontSize.Antz_Minor_Title.fontWeight,
                                      // fontSize:
                                      //   FontSize.Antz_Minor_Title.fontSize,

                                      color: constThemeColor.neutralPrimary,
                                      fontSize:
                                        FontSize.Antz_Minor_Medium.fontSize,
                                      fontWeight:
                                        FontSize.Antz_Minor_Medium.fontWeight,
                                    }}
                                  >
                                    {item.name}
                                  </Text>
                                </Chip>
                              </View>
                            );
                          })}
                      </View>
                    </>
                  }
                  image={false}
                  svgUri={false}
                  svgXML={true}
                  svgXMLData={svg_med_complaints}
                  onPress={() => gotoComplaints()}
                  rightIcon={true}
                  data={true}
                />
              ) : (
                <AddMedicalRecordCard
                  children={
                    <>
                      <View>
                        <Text style={reduxColors.title}>Complaints*</Text>
                      </View>
                    </>
                  }
                  onPress={() => gotoComplaints()}
                  svgXML={true}
                  svgXMLData={svg_med_complaints}
                  rightIcon={true}
                />
              )}

              {/**
               * Diagnosis
               */}
              {diagnosisSelectData?.filter(
                (p) => p?.additional_info?.status !== "closed"
              )?.length > 0 ? (
                <AddMedicalRecordCard
                  children={
                    <View>
                      <View>
                        <Text style={reduxColors.selectedTitle}>Diagnosis</Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                        }}
                      >
                        {diagnosisData
                          ?.filter(
                            (p) => p?.additional_info?.status == "active"
                          )
                          ?.map((item, index) => {
                            return (
                              <View key={index}>
                                <Chip
                                  style={[
                                    reduxColors.painbox,
                                    {
                                      backgroundColor: severityColor(
                                        item.additional_info.severity
                                      ),
                                    },
                                  ]}
                                >
                                  <Text
                                    style={{
                                      // color:
                                      //   item.additional_info?.severity ===
                                      //   "Extreme"
                                      //     ? constThemeColor.onPrimary
                                      //     : constThemeColor.onTertiaryContainer,
                                      // fontWeight:
                                      //   FontSize.Antz_Minor_Title.fontWeight,
                                      // fontSize:
                                      //   FontSize.Antz_Minor_Title.fontSize,

                                      color: constThemeColor.onError,
                                      fontSize:
                                        FontSize.Antz_Minor_Medium.fontSize,
                                      fontWeight:
                                        FontSize.Antz_Minor_Medium.fontWeight,
                                    }}
                                  >
                                    {item.name}
                                  </Text>
                                </Chip>
                              </View>
                            );
                          })}
                      </View>
                    </View>
                  }
                  image={false}
                  svgUri={false}
                  svgXML={true}
                  svgXMLData={svg_med_diagnosis}
                  onPress={() => gotoDaignosis()}
                  rightIcon={true}
                  data={true}
                />
              ) : (
                <AddMedicalRecordCard
                  children={
                    <View>
                      <Text style={reduxColors.title}> Diagnosis</Text>
                    </View>
                  }
                  onPress={() => gotoDaignosis()}
                  svgXML={true}
                  svgXMLData={svg_med_diagnosis}
                  rightIcon={true}
                />
              )}

              {/**
               * Prescription
               */}
              {prescriptionSelectData?.filter(
                (p) => !p?.additional_info?.stop_date
              )?.length > 0 ? (
                <AddMedicalRecordCard
                  children={
                    <>
                      <View>
                        <Text style={reduxColors.selectedTitle}>
                          Prescription
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                        }}
                      >
                        {prescription
                          ?.filter((p) => !p?.additional_info?.stop_date)
                          .map((item, index) => {
                            return (
                              <View key={index}>
                                <Chip
                                  style={[
                                    reduxColors.painbox,
                                    {
                                      // backgroundColor:
                                      //   constThemeColor.secondaryContainer,
                                      backgroundColor: opacityColor(
                                        constThemeColor.primary,
                                        20
                                      ),
                                    },
                                  ]}
                                >
                                  <Text
                                    style={{
                                      // color: constThemeColor.onSecondaryContainer,
                                      // fontWeight:
                                      //   FontSize.Antz_Minor_Title.fontWeight,
                                      // fontSize:
                                      //   FontSize.Antz_Minor_Title.fontSize,

                                      color: constThemeColor.neutralPrimary,
                                      fontSize:
                                        FontSize.Antz_Minor_Medium.fontSize,
                                      fontWeight:
                                        FontSize.Antz_Minor_Medium.fontWeight,
                                    }}
                                  >
                                    {item.name}
                                  </Text>
                                </Chip>
                              </View>
                            );
                          })}
                      </View>
                    </>
                  }
                  image={false}
                  svgUri={false}
                  svgXML={true}
                  svgXMLData={svg_med_prescription}
                  onPress={() => gotoPrescription()}
                  rightIcon={true}
                  data={true}
                />
              ) : (
                <AddMedicalRecordCard
                  children={
                    <>
                      <View>
                        <Text style={reduxColors.title}>Prescription</Text>
                      </View>
                    </>
                  }
                  onPress={() => gotoPrescription()}
                  svgUri={false}
                  svgXML={true}
                  svgXMLData={svg_med_prescription}
                  rightIcon={true}
                />
              )}

              <List.Section>
                <List.Accordion
                  title="Additional Information"
                  id="2"
                  accessible={true}
                  accessibilityLabel={"accordianAdditionalInfo"}
                  AccessibilityId={"accordianAdditionalInfo"}
                  titleStyle={{
                    color: constThemeColor.onPrimaryContainer,
                    fontSize: FontSize.Antz_Minor_Medium.fontSize,
                    fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                    marginLeft: -(Spacing.mini + Spacing.micro),
                  }}
                  style={{
                    backgroundColor: constThemeColor.onPrimary,
                    paddingLeft: 0,
                    // marginTop: -20,
                    marginRight: -16,
                  }}
                  onPress={() => setExpand(!expand)}
                  expanded={expand}
                  right={(props) => (
                    <List.Icon
                      {...props}
                      icon={expand ? "minus" : "plus"}
                      color={constThemeColor.onPrimaryContainer}
                    />
                  )}
                >
                  {/**
                   * Advice
                   */}
                  {AdiveSelectData.length > 0 ? (
                    <AddMedicalRecordCard
                      children={
                        <>
                          <View>
                            <Text style={reduxColors.title}>Advice</Text>
                          </View>
                          <View style={reduxColors.adviceDataBox}>
                            <Text
                              style={{
                                color: constThemeColor.neutralPrimary,
                                fontWeight:
                                  FontSize.Antz_Body_Regular.fontWeight,
                                fontSize: FontSize.Antz_Body_Regular.fontSize,
                                lineHeight: 18,
                              }}
                              numberOfLines={5}
                              ellipsizeMode="tail"
                            >
                              {adviceNotes}
                            </Text>
                          </View>
                        </>
                      }
                      image={false}
                      svgUri={false}
                      svgXML={true}
                      svgXMLData={svg_med_advice}
                      onPress={() => gotoAdvice()}
                      rightIcon={true}
                      data={true}
                    />
                  ) : (
                    <AddMedicalRecordCard
                      children={
                        <View>
                          <Text style={reduxColors.title}>Advice</Text>
                        </View>
                      }
                      onPress={() => gotoAdvice()}
                      svgXML={true}
                      svgXMLData={svg_med_advice}
                      rightIcon={true}
                    />
                  )}

                  {/**
                   * Lab Request
                   */}
                  {labRequestActive ? (
                    <AddMedicalRecordCard
                      children={
                        <>
                          <View>
                            <Text style={reduxColors.title}>
                              Lab Test Request
                            </Text>
                          </View>
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              flexWrap: "wrap",
                            }}
                            // onStartShouldSetResponder={() => true}
                          >
                            {multipleLabTests?.map((data) => {
                              return (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    borderColor:
                                      constThemeColor?.adviceBorderColor1,
                                    borderWidth: 1,
                                    padding: Spacing.body,
                                    borderRadius: 8,
                                    width: "100%",
                                    marginVertical: Spacing.mini,
                                  }}
                                >
                                  <View>
                                    <Text style={reduxColors?.labTextSub}>
                                      {moment(
                                        data?.lab_test_date,
                                        "YYYY-MM-DD HH:mm:ss"
                                      ).format("DD MMM YYYY")}
                                    </Text>
                                    <Text
                                      style={[
                                        reduxColors?.labTextTitle,
                                        {
                                          color:
                                            constThemeColor?.onPrimaryContainer,
                                        },
                                      ]}
                                    >
                                      Lab Test - {data?.lab_test_id}
                                    </Text>
                                  </View>
                                </View>
                              );
                            })}

                            {labRequests.map((sample, sampleIndex) => {
                              return (
                                <View key={sample.sample_id}>
                                  {sample.tests.map((test, testIndex) => {
                                    // Check if full test is true or if there is a true child test
                                    if (test.full_test) {
                                      return (
                                        <Chip
                                          key={test.test_id}
                                          style={[
                                            reduxColors.painbox,
                                            {
                                              backgroundColor:
                                                constThemeColor.secondaryContainer,
                                            },
                                          ]}
                                        >
                                          <Text>{test.test_name}</Text>
                                        </Chip>
                                      );
                                    }
                                    if (!test.full_test) {
                                      // Filter child tests based on the condition (childTest.value === true)
                                      const filteredChildTests =
                                        test.child_tests.filter(
                                          (childTest) => childTest.value
                                        );

                                      // Map over the filtered child tests to return JSX
                                      return filteredChildTests.map(
                                        (childTest) => (
                                          <Chip
                                            key={childTest.test_id}
                                            style={[
                                              reduxColors.painbox,
                                              {
                                                backgroundColor:
                                                  constThemeColor.secondaryContainer,
                                              },
                                            ]}
                                          >
                                            <Text>{childTest.test_name}</Text>
                                          </Chip>
                                        )
                                      );
                                    }
                                    return null; // Handle other cases where neither full test nor child tests meet the condition
                                  })}
                                </View>
                              );
                            })}
                            {additionalSamplesData ? (
                              <View>
                                <Chip
                                  style={[
                                    reduxColors.painbox,
                                    {
                                      backgroundColor:
                                        constThemeColor.secondaryContainer,
                                    },
                                  ]}
                                >
                                  <Text>{additionalSamplesData}</Text>
                                </Chip>
                              </View>
                            ) : null}
                          </View>
                        </>
                      }
                      image={false}
                      svgUri={false}
                      svgXML={true}
                      svgXMLData={svg_med_lab}
                      onPress={() => gotoLabRequest()}
                      rightIcon={true}
                      data={true}
                    />
                  ) : (
                    <AddMedicalRecordCard
                      children={
                        <>
                          <View>
                            <Text style={reduxColors.title}>
                              Lab Test Request
                            </Text>
                          </View>
                        </>
                      }
                      onPress={() => gotoLabRequest()}
                      svgXML={true}
                      svgXMLData={svg_med_lab}
                      rightIcon={true}
                    />
                  )}

                  {/**
                   * Notes
                   */}
                  {attachmentData.notes.length <= 0 &&
                  attachmentData.images.length <= 0 &&
                  attachmentData.documents.length <= 0 ? (
                    <View>
                      <AddMedicalRecordCard
                        children={
                          <>
                            <View>
                              <Text style={reduxColors.title}>
                                Attachments & Notes
                              </Text>
                            </View>
                          </>
                        }
                        onPress={() => gotoNotes()}
                        svgXML={false}
                        attach={true}
                        rightIcon={true}
                      />
                    </View>
                  ) : (
                    <View>
                      <AddMedicalRecordCard
                        children={
                          <>
                            {attachmentData.images.length > 0 ||
                            attachmentData.documents.length > 0 ? (
                              <View>
                                <Text style={reduxColors.selectedTitle}>
                                  Attachments
                                </Text>
                                <View
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    marginTop: Spacing.small,
                                    marginBottom: Spacing.small,
                                  }}
                                >
                                  {attachmentData.images.length > 0 ? (
                                    <View
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                      }}
                                    >
                                      <FontAwesome
                                        name="photo"
                                        size={20}
                                        color={constThemeColor?.secondary}
                                      />
                                      <Text
                                        style={reduxColors.attachmentCountText}
                                      >
                                        {attachmentData.images.length === 1
                                          ? "1 image"
                                          : attachmentData.images.length +
                                            " images"}
                                      </Text>
                                    </View>
                                  ) : null}

                                  {attachmentData.documents.length > 0 ? (
                                    <View
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginLeft:
                                          attachmentData.images.length > 0
                                            ? Spacing.major
                                            : 0,
                                      }}
                                    >
                                      <MaterialIcons
                                        name="description"
                                        size={20}
                                        color={constThemeColor?.secondary}
                                      />
                                      <Text
                                        style={reduxColors.attachmentCountText}
                                      >
                                        {attachmentData.documents.length === 1
                                          ? "1 document"
                                          : attachmentData.documents.length +
                                            " documents"}
                                      </Text>
                                    </View>
                                  ) : null}
                                </View>
                              </View>
                            ) : null}
                            {attachmentData?.notes?.length > 0 ? (
                              <>
                                <View>
                                  <Text style={reduxColors.selectedTitle}>
                                    Notes
                                  </Text>
                                </View>
                                <View style={reduxColors.notesDataBox}>
                                  <Text
                                    style={{
                                      fontSize: FontSize.Antz_Small.fontSize,
                                      fontWeight:
                                        FontSize.Antz_Small.fontWeight,
                                      color: constThemeColor.notesDate,
                                      marginBottom: Spacing.mini,
                                    }}
                                  >
                                    {
                                      attachmentData.notes[
                                        attachmentData.notes.length - 1
                                      ]?.date
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize:
                                        FontSize.Antz_Body_Regular.fontSize,
                                      fontWeight:
                                        FontSize.Antz_Body_Regular.fontWeight,
                                      color: constThemeColor.onErrorContainer,
                                    }}
                                  >
                                    {attachmentData?.notes[
                                      attachmentData?.notes?.length - 1
                                    ]?.name?.length > 20
                                      ? attachmentData?.notes[
                                          attachmentData?.notes?.length - 1
                                        ]?.name?.slice(0, 100) + "..."
                                      : attachmentData?.notes[
                                          attachmentData?.notes?.length - 1
                                        ]?.name}
                                  </Text>
                                </View>
                              </>
                            ) : null}
                          </>
                        }
                        onPress={() => gotoNotes()}
                        svgXML={true}
                        svgXMLData={svg_med_notes}
                        rightIcon={true}
                        data={true}
                      />
                    </View>
                  )}

                  {/**
                   * Follow Up Date
                   */}
                  {followUpDate !== "" ? (
                    <AddMedicalRecordCard
                      children={
                        <>
                          <View>
                            <Text style={reduxColors.selectedTitle}>
                              Follow Up Date
                            </Text>
                          </View>
                          <Text
                            style={[
                              reduxColors.subtitle,
                              { color: constThemeColor.onPrimaryContainer },
                            ]}
                          >
                            {showFollowUpDate}
                          </Text>
                        </>
                      }
                      image={false}
                      svgUri={false}
                      svgXML={true}
                      svgXMLData={svg_med_follow_up_date}
                      onPress={() => gotoFollowUpDate()}
                      rightIcon={true}
                      data={true}
                    />
                  ) : (
                    <AddMedicalRecordCard
                      children={
                        <View>
                          <Text style={reduxColors.title}>Follow Up Date</Text>
                        </View>
                      }
                      svgXML={true}
                      svgXMLData={svg_med_follow_up_date}
                      rightIcon={true}
                      onPress={() => gotoFollowUpDate()}
                    />
                  )}
                </List.Accordion>
              </List.Section>
            </>
          ) : null}
          <DynamicAlert
            isVisible={isVisible}
            onClose={hideAlert}
            type={alertType}
            title={alertType === "success" ? "Success" : "Error"}
            message={alertMessage}
            onOK={handleOK}
            isCancelButton={alertType === "success" ? true : false}
            onCancel={handleCancel}
          />
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: constThemeColor.onPrimary,
          paddingBottom: Spacing.minor,
        }}
      >
        <SubmitBtn
          onPress={medicalRecordId ? handleEdit : handleSubmit}
          isButtonDisabled={
            (SelectedAnimal?.length > 0 ||
              SelectedEnclosure?.length > 0 ||
              SelectedSection?.length > 0 ||
              complete_name?.animal_id) &&
            (complaints?.length > 0 ||
              diagnosisData?.length > 0 ||
              prescription?.length > 0)
              ? false
              : true
          }
        />
      </View>
      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.SUCCESS_TYPE}
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
  );
};
export default AddMedical;

const styles = (reduxColors) =>
  StyleSheet.create({
    conatiner: {
      flex: 1,
      minHeight: "100%",
      backgroundColor: reduxColors.onPrimary,
      paddingVertical: Spacing.small,
      paddingHorizontal: Spacing.minor,
    },
    attachmentCountText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginLeft: Spacing.mini,
    },

    selectedTitle: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      width: "100%",
    },
    title: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      width: "100%",
    },
    subtitle: {
      marginTop: Spacing.micro,
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.neutralPrimary,
    },
    painbox: {
      margin: Spacing.mini,
      borderRadius: Spacing.mini,
      color: reduxColors.onSurfaceVariant,
    },
    notesDataBox: {
      width: "100%",
      backgroundColor: reduxColors.notes,
      borderRadius: Spacing.small,
      padding: Spacing.body,
      // marginVertical: Spacing.mini,
      marginTop: Spacing.small,
    },
    adviceDataBox: {
      marginTop: Spacing.small,
      flex: 1,
      backgroundColor: reduxColors.surfaceVariant,
      borderRadius: Spacing.mini,
      padding: Spacing.small,
    },
    cardContainer: {
      borderWidth: 1,
      borderColor: reduxColors.whiteSmoke,
      borderRadius: Spacing.small,
      backgroundColor: reduxColors.surface,
      marginVertical: Spacing.mini,
    },
    labTextSub: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    labTextTitle: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors?.onPrimaryContainer,
    },
  });
