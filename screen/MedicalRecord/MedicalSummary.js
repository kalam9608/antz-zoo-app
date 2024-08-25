import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  FontAwesome5,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";

// DATE Formate
import moment from "moment";
// SVG Image Icon
import { SvgXml } from "react-native-svg";
import SvgUri from "react-native-svg-uri";
import svg_med_case_type from "../../assets/Med_Casetype.svg";
import svg_med_complaints from "../../assets/Med_Complaints.svg";
import svg_med_diagnosis from "../../assets/Med_Diagnosis.svg";
import svg_med_prescription from "../../assets/Med_Prescription.svg";
import svg_med_advice from "../../assets/Med_Advice.svg";
import svg_med_lab from "../../assets/Med_Lab.svg";
import line_start from "../../assets/line_start_circle.svg";
import line_end from "../../assets/line_end_square.svg";
import svg_med_notes from "../../assets/Med_Notes.svg";
import svg_med_follow_up_date from "../../assets/Med_Followup.svg";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Chronic_white from "../../assets/Chronic_white.svg";
import svg_med_attachment from "../../assets/attach_file.svg";
import {
  getAnimalMedicalDetails,
  getAnimalMedicalDetailsNew,
} from "../../services/AnimalService";
import Loader from "../../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import FontSize from "../../configs/FontSize";
import SummaryHeader from "../../components/SummaryHeader";
// import { errorToast } from "../../utils/Alert";
import Spacing from "../../configs/Spacing";
import AnimalCustomCard from "../../components/AnimalCustomCard";
// import { TouchableOpacity } from "react-native-gesture-handler";
import {
  LengthDecrease,
  calculateAge,
  checkPermissionAndNavigateWithAccess,
  contactFun,
  getFileData,
  ifEmptyValue,
  opacityColor,
  severityColor,
} from "../../utils/Utils";
import ImageViewer from "../../components/ImageViewer";
import {
  removeMedical,
  setAdviceNotes,
  setAttachments,
  setEditFromSummaryPage,
  setLabRequests,
  setMedicalRecordId,
  setMultiLabTests,
  setSelectDurationData,
  setShowFollowUpDate,
  setadvice,
  setcaseType,
  setcomplaints,
  setdiagnosis,
  setfollowUpDate,
  setprescription,
} from "../../redux/MedicalSlice";
import { deleteMedicalRecord } from "../../services/MedicalsService";
import { widthPercentageToDP } from "react-native-responsive-screen";
import DiagnosisItem from "../../components/DiagnosisItem";
import PrescriptionItem from "../../components/PrescriptionItem";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import { useToast } from "../../configs/ToastConfig";

const MedicalSummary = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [animalMedicalData, setAnimalMedicalData] = useState([]);
  const [extradata, setExtradata] = useState(props?.route?.params?.item ?? "");
  const [openLab, setOpenLab] = useState(0);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();
  const permission = useSelector((state) => state.UserAuth.permission);
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  const editFromAnimalDetailsPage = useSelector(
    (state) => state.medical.editFromAnimalDetailsPage
  );
  const addMedicalPage = useSelector((state) => state.medical.addMedicalPage);
  const fromMedicalBasicPage = useSelector(
    (state) => state.medical.fromMedicalBasicPage
  );
  const [optionData] = useState([
    {
      id: 1,
      option: <Text>Delete Medical Record</Text>,
    },
  ]);

  // For Dialouge type modal  =========================
  const [isModalVisible, setModalVisible] = useState(false);
  const [DialougeTitle, setDialougeTitle] = useState("");

  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };
  const confirmButtonPress = () => {
    // setIsLoading(true);
    // deleteMedicalRecord(animalMedicalData?.id)
    //   .then(() => {
    //     navigation.goBack();
    //     setIsLoading(false);
    //     setModalVisible(false);
    //   })
    //   .catch((e) => {
    //     // console.log("e", e);
    //     errorToast("error","Oops! Something went wrong!");
    //     setIsLoading(false);
    //     setModalVisible(false);
    //   });

    deleteMedicalRecordFunc();
    setModalVisible(false);
    alertModalClose();
  };

  const cancelButtonPress = () => {
    alertModalClose();
  };
  const dob = moment(animalMedicalData?.animal_details?.birth_date);
  const today = moment(new Date());
  const duration = moment.duration(today.diff(dob));
  const years = duration?._data?.years;
  const months = duration?._data?.months;
  const days = duration?._data?.days;
  // const today = new Date();
  // const birthDay = overviewData.animal_details?.birth_date;
  const ageCal = calculateAge(dob, today);
  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      dispatch(removeMedical());
      getAnimalMedicalDetailsNew({
        medical_record_id: props?.route?.params?.medical_record_id,
        // medical_record_id: 13017,
      })
        .then((res) => {
          setAnimalMedicalData(res.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log({ error });
          errorToast("Oops!", "Something went wrong!!");
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [extradata, props?.route?.params?.medical_record_id])
  );
  // useEffect(() => {
  //   setIsLoading(true);
  //   getAnimalMedicalDetailsNew({
  //     medical_record_id: props?.route?.params?.medical_record_id,
  //     // medical_record_id: 13017,
  //   })
  //     .then((res) => {
  //       setAnimalMedicalData(res.data);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log({ error });
  //       errorToast("Oops!", "Something went wrong!!");
  //       setIsLoading(false);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // }, [extradata]);
  const [age, setAge] = useState(null);
  useEffect(() => {
    if (extradata) {
      const ageCalculate = calculateAge(
        extradata?.birth_date,
        moment(new Date())?.format("YYYY-MM-YY HH:MM:SS")
      );
      setAge(ageCalculate);
    }
  }, [extradata]);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const openPDF = async (pdfURL) => {
    const supported = await Linking.canOpenURL(pdfURL);

    if (supported) {
      await Linking.openURL(pdfURL);
    } else {
      console.error(`Don't know how to open URL: ${pdfURL}`);
    }
  };

  const handleCall = (data) => {
    let phoneNumber = typeof data !== "undefined" ? data : null;

    if (phoneNumber !== null) {
      contactFun("tel", phoneNumber);
    }
  };

  const handleMessage = (data) => {
    let phoneNumber = typeof data !== "undefined" ? data : null;

    if (phoneNumber !== null) {
      contactFun("sms", phoneNumber);
    }
  };
  function backgroundSideColor(priroty, constThemeColor) {
    if (priroty == "Mild") {
      return constThemeColor?.secondary;
    } else if (priroty == "Moderate") {
      return constThemeColor?.moderateSecondary;
    } else if (priroty == "High") {
      return constThemeColor?.tertiary;
    } else if (priroty == "Extreme") {
      return constThemeColor?.error;
    } else {
      return constThemeColor?.secondary;
    }
  }
  function backgroundColor(priroty, constThemeColor) {
    if (priroty == "Mild") {
      return constThemeColor?.secondaryContainer;
    } else if (priroty == "Moderate") {
      return constThemeColor?.notes;
    } else if (priroty == "High") {
      return constThemeColor?.tertiaryContainer;
    } else if (priroty == "Extreme") {
      return constThemeColor?.errorContainer;
    } else {
      return constThemeColor?.secondaryContainer;
    }
  }

  const images_Obj = animalMedicalData?.notes?.images?.map((el) => ({
    id: el.id,
    url: el.url,
  }));
  const navigateToEditMedical = () => {
    if (
      checkPermissionAndNavigateWithAccess(
        permission,
        "medical_records_access",
        null,
        null,
        null,
        "EDIT"
      ) &&
      Object.keys(animalMedicalData).length > 0
    ) {
      dispatch(
        setMedicalRecordId(props?.route?.params?.medical_record_id ?? null)
      );
      dispatch(setEditFromSummaryPage(true));
      dispatch(setcaseType(animalMedicalData?.case_type ?? {}));
      dispatch(setcomplaints(animalMedicalData?.complaints ?? []));
      dispatch(setdiagnosis(animalMedicalData?.diagnosis ?? []));
      dispatch(setprescription(animalMedicalData?.prescription ?? []));
      dispatch(setadvice(animalMedicalData?.advices ?? []));
      dispatch(
        setAdviceNotes(
          String(
            animalMedicalData?.advices?.map((item) => {
              return item.name;
            })
          )
        )
      );
      dispatch(setMultiLabTests(animalMedicalData?.lab));
      dispatch(
        setAttachments({
          notes: animalMedicalData?.notes?.notes
            ? animalMedicalData?.notes?.notes?.map((note) => {
                return {
                  name: note.name,
                  date: moment(note.date).format("DD MMM YYYY, LT"),
                };
              })
            : [],
          images:
            animalMedicalData?.notes?.images?.map((i) =>
              getFileData({
                uri: i.url,
                type: i.notes_type,
                name: i.file_original_name,
              })
            ) ?? [],
          documents:
            animalMedicalData?.notes?.documents?.map((i) =>
              getFileData({
                uri: i.url,
                type: i.notes_type,
                name: i.file_original_name,
              })
            ) ?? [],
        })
      );

      const todaysDate = moment(Date.now()).format("DD-MM-YYYY");
      const followUpDate =
        moment(animalMedicalData?.follow_up_date, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        ) == "Invalid date"
          ? ""
          : moment(animalMedicalData?.follow_up_date, "YYYY-MM-DD").format(
              "DD-MM-YYYY"
            );
      let differenceInDays = 0;
      if (followUpDate) {
        const differenceInMilliseconds =
          new Date(followUpDate.split("-").reverse().join("-")) -
          new Date(todaysDate.split("-").reverse().join("-"));
        differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
      }
      dispatch(
        setfollowUpDate(animalMedicalData?.follow_up_date ? followUpDate : null)
      );
      dispatch(
        setShowFollowUpDate(
          animalMedicalData?.follow_up_date ? followUpDate : null
        )
      );
      dispatch(setSelectDurationData(differenceInDays));
      navigation.navigate("AddMedical", {
        item: animalMedicalData.animal_details,
        cameFrom: "AnimalDetails",
      });
    }
  };
  const checkCaseype = animalMedicalData?.case_type?.label;
  const checkComplaints =
    animalMedicalData?.complaints?.length > 0 ? true : false;
  const checkDiagnosis =
    animalMedicalData?.diagnosis?.length > 0 ? true : false;
  const checkPrescription =
    animalMedicalData?.prescription?.length > 0 ? true : false;
  const checkAdvice = animalMedicalData?.advices?.length > 0 ? true : false;
  const checkLab = animalMedicalData?.lab?.length > 0 ? true : false;
  const checkAttachment =
    (animalMedicalData?.notes?.documents?.length ||
      animalMedicalData?.notes?.images?.length > 0) > 0
      ? true
      : false;
  const checkNote = animalMedicalData?.notes?.notes?.length > 0 ? true : false;
  const checkFollowdate =
    ifEmptyValue(
      moment(animalMedicalData?.follow_up_date).format("DD MMM YYYY")
    ) == "NA"
      ? false
      : true;
  const activeComplaints = animalMedicalData?.complaints?.filter(
    (p) => p?.additional_info?.status == "active"
  );
  const closedComplaints = animalMedicalData?.complaints?.filter(
    (p) => p?.additional_info?.status == "closed"
  );

  const activeDiagosis = animalMedicalData?.diagnosis?.filter(
    (p) => p?.additional_info?.status == "active"
  );
  const closedDiagosis = animalMedicalData?.diagnosis?.filter(
    (p) => p?.additional_info?.status == "closed"
  );

  const activePrescription = animalMedicalData?.prescription?.filter(
    (p) => p?.additional_info?.start_date && !p?.additional_info?.stop_date
  );
  const closedPrescription = animalMedicalData?.prescription?.filter(
    (p) => p?.additional_info?.start_date && p?.additional_info?.stop_date
  );

  const [highlightedSection, setHighlightedSection] = useState(0);
  const scrollViewRef = useRef(null);
  const caseTypeRef = useRef(null);
  const complaintsRef = useRef(null);
  const diagnosisRef = useRef(null);
  const prescriptionRef = useRef(null);
  const adviceRef = useRef(null);
  const labRequestRef = useRef(null);
  const attachmentRef = useRef(null);
  const notesRef = useRef(null);
  const followUpRef = useRef(null);
  const sectionRefs = [
    caseTypeRef,
    complaintsRef,
    diagnosisRef,
    prescriptionRef,
    adviceRef,
    labRequestRef,
    attachmentRef,
    notesRef,
    followUpRef,
  ];

  const scrollToSection = (offsetY) => {
    scrollViewRef.current.scrollTo({
      y: offsetY,
      animated: true,
    });
  };

  // Function to calculate the contentOffset.y of the desired element
  const calculateElementOffset = (elementRef, sectionIndex) => {
    if (scrollViewRef.current && elementRef.current) {
      if (!scrollViewRef.current || !elementRef.current) {
        return;
      }

      setHighlightedSection(sectionIndex);

      elementRef.current.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollToSection(y);
        },
        () => {}
      );
    }
  };

  // const handleScroll = (event) => {
  //   this.yOffset = event.nativeEvent.contentOffset.y;

  //   // Iterate through sectionRefs and check if each section is within the visible range
  //   sectionRefs.forEach((sectionRef, index) => {
  //     if (sectionRef) {
  //       sectionRef.current.measureLayout(
  //         scrollViewRef.current,
  //         (x, y) => {
  //           if (yOffset >= y - 50 && yOffset <= y + 50) {
  //             setHighlightedSection(index);
  //           }
  //         },
  //         () => {}
  //       );
  //     }
  //   });
  // };

  const deleteMedicalFun = () => {
    if (
      checkPermissionAndNavigateWithAccess(
        permission,
        "medical_records_access",
        null,
        null,
        null,
        "DELETE"
      )
    ) {
      setDialougeTitle("Do you want to delete this medical record?");
      alertModalOpen();
    }
  };

  const deleteMedicalRecordFunc = () => {
    setIsLoading(true);
    deleteMedicalRecord(animalMedicalData?.id)
      .then((res) => {
        if (res.success) {
          successToast("success", res?.message);
          setIsLoading(false);
          setModalVisible(false);
          gotoBack();
        }
      })
      .catch((e) => {
        // console.log("e", e);
        errorToast("error", "Oops! Something went wrong!");
        setIsLoading(false);
        setModalVisible(false);
      });
  };
  useEffect(() => {
    const backAction = () => {
      if (editFromAnimalDetailsPage) {
        if (typeof props.route.params?.moveToBack === "function") {
          props.route.params.moveToBack();
        }
        navigation.goBack();
      } else if (addMedicalPage) {
        navigation.navigate("Home");
      } else if (fromMedicalBasicPage) {
        navigation.goBack();
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
  }, [navigation]);

  const gotoBack = () => {
    if (editFromAnimalDetailsPage) {
      props.route.params?.moveToBack();
      navigation.goBack();
    } else if (addMedicalPage) {
      navigation.navigate("Home");
    } else if (fromMedicalBasicPage) {
      navigation.goBack();
    } else {
      navigation.goBack();
    }
  };
  const isEditable =
    animalMedicalData?.animal_details?.animal_transfered == "0" &&
    animalMedicalData?.animal_details?.is_deleted == "0" &&
    animalMedicalData?.animal_details?.is_alive == "1" &&
    (permission["medical_records_access"] == "EDIT" ||
      permission["medical_records_access"] == "DELETE");
  return (
    <View style={{ backgroundColor: constThemeColor?.background, flex: 1 }}>
      <View
        style={{
          backgroundColor: constThemeColor?.onPrimary,
        }}
      >
        <Loader visible={isLoading} />
        <SummaryHeader
          page="medical"
          // title="Medical Record"
          edit={
            animalMedicalData?.created_by != undefined &&
            animalMedicalData?.created_by != null &&
            UserId != animalMedicalData?.created_by
              ? false
              : UserId === animalMedicalData?.created_by
              ? isEditable
              : false
          }
          deleteMedical={permission["medical_records_access"] == "DELETE"}
          optionData={optionData}
          deleteMedicalFun={deleteMedicalFun}
          onPressBack={() => gotoBack()}
          onPressEdit={() => navigateToEditMedical()}
          hideMenu={
            UserId === animalMedicalData?.created_by &&
            permission["medical_records_access"] == "DELETE"
              ? false
              : true
          }
          style={{
            justifyContent: "space-between",
          }}
          // styleText={{
          //   marginLeft:-50
          // }}
          styleText={{ alignItems: "flex-start", marginLeft: Spacing.major }}
        />
        <View
          style={{
            backgroundColor: constThemeColor.onPrimary,
          }}
        >
          <View style={{ paddingLeft: Spacing.minor }}>
            <View style={{ flexDirection:'row' }}>
              <View
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: animalMedicalData?.case_type?.color_code,
                }}
              >
                <SvgUri
                  source={{ uri: animalMedicalData?.case_type?.default_icon }}
                  width="15"
                  height="15"
                  style={reduxColors.image}
                />
              </View>
              <View
                style={{
                  paddingHorizontal: Spacing.small,
                  paddingBottom: Spacing.small,
                }}
              >
                <Text style={reduxColors.headetTitle}>
                  {props?.route?.params?.medical_record_code}
                </Text>
              </View>
            </View>
            <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={[FontSize.Antz_Subtext_title, {color: constThemeColor?.neutralSecondary}]}>{animalMedicalData?.case_type?.label}</Text>
            <View style={{height:5, width:5, borderRadius:50, backgroundColor: constThemeColor?.neutralSecondary, marginHorizontal:Spacing.mini}} />
              <View
                style={
                  {
                    // paddingHorizontal: Spacing.minor
                  }
                }
              >
                {animalMedicalData?.created_at ? (
                  <Text style={reduxColors.dateTitle}>
                    {moment(
                      animalMedicalData?.created_at,
                      "YYYY-MM-DD HH:mm:ss"
                    ).format("DD MMM YYYY , HH:mm A")}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: Spacing.small,
              paddingVertical: Spacing.mini,
              paddingHorizontal: Spacing.minor,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                color: constThemeColor?.onSurfaceVariant,
              }}
            >
              By
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: Spacing.small,
                borderRadius: Spacing.mini,
                paddingVertical: Spacing.mini,
                paddingHorizontal: Spacing.mini + Spacing.micro,
                backgroundColor: constThemeColor.surfaceVariant,
              }}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={constThemeColor.neutralPrimary}
              />
              <Text
                style={{
                  fontSize: FontSize.Antz_Minor_Regular.fontSize,
                  fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                  color: constThemeColor.onSurface,
                  marginLeft: Spacing.mini,
                }}
              >
                {/* {animalMedicalData?.user_details?.user_full_name} */}
                {LengthDecrease(
                  22,
                  animalMedicalData?.user_details?.user_full_name ?? "NA"
                )}
              </Text>
            </View>

            <>
              <TouchableOpacity
                onPress={() =>
                  handleCall(animalMedicalData?.user_details?.user_mobile)
                }
                style={{
                  justifyContent: "center",
                  backgroundColor: constThemeColor.surfaceVariant,
                  padding: Spacing.mini,
                  borderRadius: Spacing.mini,
                }}
              >
                <MaterialIcons
                  name="call"
                  size={21}
                  color={constThemeColor.onSurface}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  handleMessage(animalMedicalData?.user_details?.user_email)
                }
                style={{
                  justifyContent: "center",
                  backgroundColor: constThemeColor.surfaceVariant,
                  marginLeft: Spacing.small,
                  padding: Spacing.mini,
                  borderRadius: Spacing.mini,
                }}
              >
                <MaterialCommunityIcons
                  name="message-text-outline"
                  size={21}
                  color={constThemeColor.onSurface}
                />
              </TouchableOpacity>
            </>
          </View>
          <View>
            <AnimalCustomCard
              item={animalMedicalData?.animal_details}
              animalIdentifier={
                animalMedicalData?.animal_details?.label == null
                  ? animalMedicalData?.animal_details?.animal_id
                  : animalMedicalData?.animal_details?.label
              }
              localID={
                animalMedicalData?.animal_details?.local_id
                  ? animalMedicalData?.animal_details?.local_id
                  : null
              }
              icon={animalMedicalData?.animal_details?.default_icon}
              enclosureName={
                animalMedicalData?.animal_details?.user_enclosure_name
              }
              animalName={
                animalMedicalData?.animal_details?.common_name
                  ? animalMedicalData?.animal_details?.common_name
                  : animalMedicalData?.animal_details?.scientific_name ?? ""
              }
              sectionName={animalMedicalData?.animal_details?.section_name}
              siteName={animalMedicalData?.animal_details?.site_name}
              show_specie_details={true}
              show_housing_details={true}
              chips={animalMedicalData?.animal_details?.sex}
              style={{
                paddingHorizontal: Spacing.body,
                paddingVertical: Spacing.small,
              }}
              extra={
                animalMedicalData?.animal_details?.type === "single"
                  ? true
                  : false
              }
              age={
                ageCal?.years || ageCal?.months || ageCal?.days
                  ? `Age - ${ageCal?.years ? `${ageCal?.years}y ` : ""}${
                      ageCal?.months ? `${ageCal?.months}m ` : ""
                    }${ageCal?.days ? `${ageCal?.days}d ` : ""}`
                  : ageCal?.years < 0 || ageCal?.months < 0 || ageCal?.days < 0
                  ? "Age - NA"
                  : ageCal?.days == 0
                  ? "Age - Just Born"
                  : "Age - NA"
              }
              // weight={`Weight -${
              //   animalMedicalData?.body_weight
              //     ? animalMedicalData?.body_weight
              //     : " NA"
              // }`}
              // noArrow={true}
              remove={false}
              onPress={() =>
                checkPermissionAndNavigateWithAccess(
                  permission,
                  "collection_animal_record_access",
                  navigation,
                  "AnimalsDetails",
                  {
                    animal_id: animalMedicalData?.animal_details?.animal_id,
                    default_tab: "Medical",
                    type: animalMedicalData?.animal_details?.type ?? "",
                  },
                  "VIEW"
                )
              }
              screenType="Medical"
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: Spacing.minor,
            backgroundColor: constThemeColor?.onPrimary,
            borderTopColor: constThemeColor?.background,
            borderTopWidth: 1.5,
          }}
        >
          {checkCaseype ? (
            <TouchableOpacity
              onPress={() => {
                calculateElementOffset(caseTypeRef, 0);
              }}
              style={{
                flex: 1,
                paddingVertical: Spacing.body,
                justifyContent: "center",
                alignItems: "center",
                borderBottomWidth: highlightedSection == 0 ? 2 : 0,
                borderBottomColor: constThemeColor?.primary,
              }}
            >
              <ImageIcon path={svg_med_case_type} />
            </TouchableOpacity>
          ) : null}
          {checkComplaints ? (
            <TouchableOpacity
              onPress={() => {
                calculateElementOffset(complaintsRef, 1);
              }}
              style={{
                flex: 1,
                paddingVertical: Spacing.body,
                justifyContent: "center",
                alignItems: "center",
                borderBottomWidth: highlightedSection == 1 ? 2 : 0,
                borderBottomColor: constThemeColor?.primary,
              }}
            >
              <ImageIcon path={svg_med_complaints} />
            </TouchableOpacity>
          ) : null}

          {checkDiagnosis ? (
            <TouchableOpacity
              onPress={() => {
                calculateElementOffset(diagnosisRef, 2);
              }}
              style={{
                flex: 1,
                paddingVertical: Spacing.body,
                justifyContent: "center",
                alignItems: "center",
                borderBottomWidth: highlightedSection == 2 ? 2 : 0,
                borderBottomColor: constThemeColor?.primary,
              }}
            >
              <ImageIcon path={svg_med_diagnosis} />
            </TouchableOpacity>
          ) : null}

          {checkPrescription ? (
            <TouchableOpacity
              onPress={() => {
                calculateElementOffset(prescriptionRef, 3);
              }}
              style={{
                flex: 1,
                paddingVertical: Spacing.body,
                justifyContent: "center",
                alignItems: "center",
                borderBottomWidth: highlightedSection == 3 ? 2 : 0,
                borderBottomColor: constThemeColor?.primary,
              }}
            >
              <ImageIcon path={svg_med_prescription} />
            </TouchableOpacity>
          ) : null}
          {checkAdvice ? (
            <TouchableOpacity
              onPress={() => {
                calculateElementOffset(adviceRef, 4);
              }}
              style={{
                flex: 1,
                paddingVertical: Spacing.body,
                justifyContent: "center",
                alignItems: "center",
                borderBottomWidth: highlightedSection == 4 ? 2 : 0,
                borderBottomColor: constThemeColor?.primary,
              }}
            >
              <ImageIcon path={svg_med_advice} />
            </TouchableOpacity>
          ) : null}
          {checkLab ? (
            <TouchableOpacity
              onPress={() => {
                calculateElementOffset(labRequestRef, 5);
              }}
              style={{
                flex: 1,
                paddingVertical: Spacing.body,
                justifyContent: "center",
                alignItems: "center",
                borderBottomWidth: highlightedSection == 5 ? 2 : 0,
                borderBottomColor: constThemeColor?.primary,
              }}
            >
              <ImageIcon path={svg_med_lab} />
            </TouchableOpacity>
          ) : null}

          {checkAttachment ? (
            <TouchableOpacity
              onPress={() => {
                calculateElementOffset(attachmentRef, 6);
              }}
              style={{
                flex: 1,
                paddingVertical: Spacing.body,
                justifyContent: "center",
                alignItems: "center",
                borderBottomWidth: highlightedSection == 6 ? 2 : 0,
                borderBottomColor: constThemeColor?.primary,
              }}
            >
              <ImageIcon path={svg_med_attachment} />
            </TouchableOpacity>
          ) : null}
          {checkNote ? (
            <TouchableOpacity
              onPress={() => {
                calculateElementOffset(notesRef, 7);
              }}
              style={{
                flex: 1,
                paddingVertical: Spacing.body,
                justifyContent: "center",
                alignItems: "center",
                borderBottomWidth: highlightedSection == 7 ? 2 : 0,
                borderBottomColor: constThemeColor?.primary,
              }}
            >
              <ImageIcon path={svg_med_notes} />
            </TouchableOpacity>
          ) : null}
          {checkFollowdate ? (
            <TouchableOpacity
              onPress={() => {
                calculateElementOffset(followUpRef, 8);
              }}
              style={{
                flex: 1,
                paddingVertical: Spacing.body,
                justifyContent: "center",
                alignItems: "center",
                borderBottomWidth: highlightedSection == 8 ? 2 : 0,
                borderBottomColor: constThemeColor?.primary,
              }}
            >
              <ImageIcon path={svg_med_follow_up_date} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingTop: Spacing.body }}
          showsVerticalScrollIndicator={false}
          // onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={[reduxColors.card]}>
            <View style={{ marginVertical: Spacing.small }}>
              {checkCaseype ? (
                <View style={reduxColors.medicalEachSection} ref={caseTypeRef}>
                  <View style={reduxColors.medicalHeadingSection}>
                    <ImageIcon path={svg_med_case_type} />
                    <Text style={reduxColors.title}>Case Type</Text>
                  </View>
                  {animalMedicalData?.case_type?.label ? (
                    <View style={reduxColors.medicalInnerList}>
                      <Text
                        style={{
                          // marginLeft: Spacing.mini,
                          color: constThemeColor.error,
                          fontSize: FontSize.Antz_Body_Medium.fontSize,
                          fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                        }}
                      >
                        {animalMedicalData?.case_type?.label}
                      </Text>
                      {/* ))} */}
                    </View>
                  ) : null}
                </View>
              ) : null}

              {checkComplaints ? (
                <View
                  style={reduxColors.medicalEachSection}
                  ref={complaintsRef}
                >
                  <View style={reduxColors.medicalHeadingSection}>
                    <ImageIcon path={svg_med_complaints} />
                    <Text style={reduxColors.title}>Complaints</Text>
                  </View>
                  {activeComplaints?.length > 0 ? (
                    <View style={reduxColors.medicalHeadingSection}>
                      <Text style={reduxColors.activeTextStyle}>
                        {activeComplaints?.length} Active
                      </Text>
                    </View>
                  ) : null}
                  <View style={{ marginLeft: Spacing.major + Spacing.mini }}>
                    {activeComplaints?.map((item, index) => {
                      return (
                        <View key={item.id}>
                          <View
                            style={[
                              reduxColors.commonNameList,
                              {
                                backgroundColor:
                                  constThemeColor?.adviceBorderColor1,
                                marginVertical: Spacing.mini,
                                borderRadius: 4,
                              },
                            ]}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text style={[reduxColors.selectedName]}>
                                {item.name}
                              </Text>
                              {/* <View>
                          <Ionicons
                            name="close-outline"
                            size={24}
                            color={constThemeColor.onSurface}
                            // onPress={() => handleDeleteName(item)}
                          />
                        </View> */}
                            </View>
                            {Object.keys(item.additional_info).length > 0 ? (
                              <View style={[reduxColors.caseReportDetails]}>
                                <View
                                  style={[
                                    reduxColors.caseReportItem,
                                    {
                                      display: item.additional_info.severity
                                        ? "flex"
                                        : "none",
                                      minWidth: 100,
                                    },
                                  ]}
                                >
                                  <Ionicons
                                    name="sad-outline"
                                    size={20}
                                    color={severityColor(
                                      item.additional_info.severity
                                    )}
                                  />
                                  <Text
                                    style={[reduxColors.detailsReportTitle]}
                                  >
                                    {item.additional_info?.severity}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    reduxColors.caseReportItem,
                                    {
                                      display: item.additional_info.duration
                                        ? "flex"
                                        : "none",
                                    },
                                  ]}
                                >
                                  <MaterialIcons
                                    name="timer"
                                    size={16}
                                    color={constThemeColor.onSurfaceVariant}
                                  />
                                  <Text
                                    style={[reduxColors.detailsReportTitle]}
                                  >
                                    {item.additional_info?.duration}
                                  </Text>
                                </View>
                              </View>
                            ) : null}
                            {item?.additional_info?.notes ? (
                              <View>
                                <Text>{item?.additional_info?.notes}</Text>
                              </View>
                            ) : null}
                          </View>
                          {/* {selectedCommonNames.length - 1 === index ? null : (
                      <View
                        style={{
                          borderBottomColor: constThemeColor?.outline,
                          borderBottomWidth: 0.5,
                        }}
                      />
                    )} */}
                        </View>
                      );
                    })}
                  </View>

                  {closedComplaints?.length > 0 ? (
                    <View style={reduxColors.medicalHeadingSection}>
                      <Text style={reduxColors.activeTextStyle}>
                        {closedComplaints?.length} Closed
                      </Text>
                    </View>
                  ) : null}
                  <View style={{ marginLeft: Spacing.major + Spacing.mini }}>
                    {closedComplaints?.map((item, index) => {
                      return (
                        <View key={item.id}>
                          <View
                            style={[
                              reduxColors.commonNameList,
                              {
                                backgroundColor:
                                  constThemeColor?.adviceBorderColor1,
                                marginVertical: Spacing.mini,
                                borderRadius: 4,
                              },
                            ]}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text
                                style={[
                                  reduxColors.selectedName,
                                  { textDecorationLine: "line-through" },
                                ]}
                              >
                                {item.name}
                              </Text>
                              {/* <View>
                          <Ionicons
                            name="close-outline"
                            size={24}
                            color={constThemeColor.onSurface}
                            // onPress={() => handleDeleteName(item)}
                          />
                        </View> */}
                            </View>
                            {Object.keys(item.additional_info).length > 0 ? (
                              <View style={[reduxColors.caseReportDetails]}>
                                <View
                                  style={[
                                    reduxColors.caseReportItem,
                                    {
                                      display: item.additional_info.severity
                                        ? "flex"
                                        : "none",
                                      minWidth: 100,
                                    },
                                  ]}
                                >
                                  <Ionicons
                                    name="sad-outline"
                                    size={20}
                                    color={severityColor(
                                      item.additional_info.severity
                                    )}
                                  />
                                  <Text
                                    style={[reduxColors.detailsReportTitle]}
                                  >
                                    {item.additional_info?.severity}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    reduxColors.caseReportItem,
                                    {
                                      display: item.additional_info.duration
                                        ? "flex"
                                        : "none",
                                    },
                                  ]}
                                >
                                  <MaterialIcons
                                    name="timer"
                                    size={16}
                                    color={constThemeColor.onSurfaceVariant}
                                  />
                                  <Text
                                    style={[reduxColors.detailsReportTitle]}
                                  >
                                    {item.additional_info?.duration}
                                  </Text>
                                </View>
                              </View>
                            ) : null}
                            {item?.additional_info?.notes ? (
                              <View>
                                <Text>{item?.additional_info?.notes}</Text>
                              </View>
                            ) : null}
                          </View>
                          {/* {selectedCommonNames.length - 1 === index ? null : (
                      <View
                        style={{
                          borderBottomColor: constThemeColor?.outline,
                          borderBottomWidth: 0.5,
                        }}
                      />
                    )} */}
                        </View>
                      );
                    })}
                  </View>
                </View>
              ) : null}

              {checkDiagnosis ? (
                <View style={reduxColors.medicalEachSection} ref={diagnosisRef}>
                  <View style={reduxColors.medicalHeadingSection}>
                    <ImageIcon path={svg_med_diagnosis} />

                    <Text style={reduxColors.title}>Diagnosis</Text>
                  </View>
                  {activeDiagosis?.length > 0 ? (
                    <View style={reduxColors.medicalHeadingSection}>
                      <Text style={reduxColors.activeTextStyle}>
                        {activeDiagosis?.length} Active
                      </Text>
                    </View>
                  ) : null}

                  <View style={{ marginLeft: Spacing.major + Spacing.mini }}>
                    {activeDiagosis?.map((item, index) => {
                      return <DiagnosisItem item={item} />;
                    })}
                  </View>
                  {/* 
                  //closed design */}
                  {closedDiagosis?.length > 0 ? (
                    <View
                      style={[
                        reduxColors.medicalHeadingSection,
                        { marginTop: Spacing.small },
                      ]}
                    >
                      <Text style={reduxColors.activeTextStyle}>
                        {closedDiagosis?.length} Closed
                      </Text>
                    </View>
                  ) : null}

                  <View style={{ marginLeft: Spacing.major + Spacing.mini }}>
                    {closedDiagosis?.map((item, index) => {
                      return <DiagnosisItem item={item} />;
                    })}
                  </View>
                </View>
              ) : null}

              {checkPrescription ? (
                <View
                  style={reduxColors.medicalEachSection}
                  ref={prescriptionRef}
                >
                  <View style={reduxColors.medicalHeadingSection}>
                    <ImageIcon path={svg_med_prescription} />
                    <Text style={reduxColors.title}>Prescription</Text>
                  </View>
                  {activePrescription?.length > 0 ? (
                    <>
                      <View style={reduxColors.medicalHeadingSection}>
                        <Text style={reduxColors.activeTextStyle}>
                          {activePrescription?.length} Active
                        </Text>
                      </View>
                      <View
                        style={{ marginLeft: Spacing.major + Spacing.mini }}
                      >
                        {activePrescription?.map((item, index) => {
                          return (
                            <PrescriptionItem
                              backgroundColor={constThemeColor?.onPrimary}
                              item={item}
                              index={index}
                            />
                          );
                        })}
                      </View>
                    </>
                  ) : null}
                  {closedPrescription?.length > 0 ? (
                    <>
                      <View style={reduxColors.medicalHeadingSection}>
                        <Text style={reduxColors.activeTextStyle}>
                          {closedPrescription?.length} Stopped
                        </Text>
                      </View>
                      <View
                        style={{ marginLeft: Spacing.major + Spacing.mini }}
                      >
                        {closedPrescription?.map((item, index) => {
                          return (
                            <PrescriptionItem
                              backgroundColor={
                                constThemeColor?.displaybgSecondary
                              }
                              item={item}
                              index={index}
                            />
                          );
                        })}
                      </View>
                    </>
                  ) : null}
                </View>
              ) : null}

              {checkAdvice ? (
                <View style={reduxColors.medicalEachSection} ref={adviceRef}>
                  <View style={reduxColors.medicalHeadingSection}>
                    <ImageIcon path={svg_med_advice} />

                    <Text style={reduxColors.title}>Advice</Text>
                  </View>
                  {animalMedicalData?.advices?.map((item) => {
                    return (
                      <View
                        style={[
                          reduxColors.medicalInnerListGrey,
                          {
                            display: "flex",
                            flexDirection: "row",
                            // backgroundColor: constThemeColor?.lightGreyHexa,
                            // marginVertical: Spacing.micro,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            {
                              paddingHorizontal: Spacing.small,
                              paddingVertical: Spacing.mini,
                              fontSize: FontSize.Antz_Body_Medium.fontSize,
                              fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                            },
                          ]}
                        >
                          {item?.name}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              ) : null}

              {checkLab ? (
                <View
                  style={reduxColors.medicalEachSection}
                  ref={labRequestRef}
                >
                  <View style={reduxColors.medicalHeadingSection}>
                    <ImageIcon path={svg_med_lab} />
                    <Text style={reduxColors.title}>Lab Test Requests</Text>
                  </View>
                  {animalMedicalData?.lab?.map((animalMedicalData, index) => {
                    return (
                      <View
                        style={[
                          reduxColors.medicalInnerListGrey,
                          {
                            display: "flex",
                            flexDirection: "row",
                            marginBottom: Spacing.body,
                          },
                        ]}
                      >
                        <View style={reduxColors?.labContainer}>
                          <TouchableOpacity
                            onPress={() =>
                              openLab == index + 1
                                ? setOpenLab(0)
                                : setOpenLab(index + 1)
                            }
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <View>
                              <Text style={reduxColors?.labTextSub}>
                                {moment(
                                  animalMedicalData?.lab_test_date,
                                  "YYYY-MM-DD HH:mm:ss"
                                ).format("DD MMM YYYY")}
                              </Text>
                              <Text
                                style={[
                                  reduxColors?.labTextTitle,
                                  {
                                    color: openLab
                                      ? constThemeColor?.neutralPrimary
                                      : constThemeColor?.onPrimaryContainer,
                                  },
                                ]}
                              >
                                Lab Test - {animalMedicalData?.lab_test_id}
                              </Text>
                            </View>
                            {openLab == index + 1 ? (
                              <MaterialIcons
                                name="keyboard-arrow-up"
                                size={24}
                                color={constThemeColor?.primary}
                                onPress={() => setOpenLab(0)}
                              />
                            ) : (
                              <MaterialIcons
                                name="keyboard-arrow-down"
                                size={24}
                                color={constThemeColor?.onSurfaceVariant}
                                onPress={() => setOpenLab(index + 1)}
                              />
                            )}
                          </TouchableOpacity>
                          {openLab == index + 1 ? (
                            <View style={{ paddingTop: Spacing.major }}>
                              {animalMedicalData?.data?.map((item, index) => {
                                return (
                                  <>
                                    {item?.is_child_test ? (
                                      <View>
                                        <Text style={reduxColors?.labTextTitle}>
                                          {item?.sample_name}
                                        </Text>
                                        <View>
                                          {item?.tests?.map((value) => {
                                            return (
                                              <>
                                                {value?.full_test ||
                                                value?.full_test == "true" ||
                                                value?.child_tests?.filter(
                                                  (v) => v.value == true
                                                ).length > 0 ? (
                                                  <View
                                                    style={{
                                                      backgroundColor:
                                                        constThemeColor?.lightGreyHexa,
                                                      marginVertical:
                                                        Spacing.small,
                                                      padding: Spacing.body,
                                                      borderRadius: 4,
                                                    }}
                                                  >
                                                    <Text
                                                      style={[
                                                        {
                                                          color:
                                                            reduxColors?.neutralPrimary,
                                                          fontSize:
                                                            FontSize
                                                              .Antz_Body_Medium
                                                              .fontSize,
                                                          fontWeight:
                                                            FontSize
                                                              .Antz_Body_Medium
                                                              .fontWeight,
                                                        },
                                                      ]}
                                                    >
                                                      {value?.test_name}
                                                    </Text>
                                                    {value?.test_name ==
                                                    "Others" ? (
                                                      <Text
                                                        style={[
                                                          {
                                                            color:
                                                              reduxColors?.onSurfaceVariant,
                                                            fontSize:
                                                              FontSize
                                                                .Antz_Body_Regular
                                                                .fontSize,
                                                            fontWeight:
                                                              FontSize
                                                                .Antz_Body_Regular
                                                                .fontWeight,
                                                          },
                                                        ]}
                                                      >
                                                        {" "}
                                                        {value?.test_name ==
                                                        "Others"
                                                          ? value?.input_value
                                                          : value?.test_name}
                                                      </Text>
                                                    ) : null}

                                                    <View>
                                                      {value?.child_tests
                                                        .length > 0 &&
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
                                                                            Spacing.mini,
                                                                        }}
                                                                      >
                                                                        <MaterialCommunityIcons
                                                                          name="check"
                                                                          size={
                                                                            24
                                                                          }
                                                                          color={
                                                                            constThemeColor?.onPrimaryContainer
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
                                                                          {
                                                                            v?.test_name
                                                                          }
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

                              {animalMedicalData?.additional_samples ? (
                                <View>
                                  <Text style={reduxColors?.labTextTitle}>
                                    Any other special samples
                                  </Text>
                                  <View>
                                    <View
                                      style={{
                                        backgroundColor:
                                          constThemeColor?.lightGreyHexa,
                                        marginVertical: Spacing.small,
                                        padding: Spacing.body,
                                        borderRadius: 4,
                                      }}
                                    >
                                      <Text
                                        style={[
                                          {
                                            color: reduxColors?.neutralPrimary,
                                            fontSize:
                                              FontSize.Antz_Body_Medium
                                                .fontSize,
                                            fontWeight:
                                              FontSize.Antz_Body_Medium
                                                .fontWeight,
                                          },
                                        ]}
                                      >
                                        {animalMedicalData?.additional_samples}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              ) : null}
                              {animalMedicalData?.attachments?.length > 0 ? (
                                <>
                                  {/* <View
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                      padding: Spacing.body + Spacing.mini,
                                      paddingHorizontal: Spacing.small,
                                      alignItems: "center",
                                      borderRadius: Spacing.small,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color:
                                          constThemeColor.onSecondaryContainer,
                                        fontSize:
                                          FontSize.Antz_Minor_Regular.fontSize,
                                        fontWeight:
                                          FontSize.Antz_Minor_Regular
                                            .fontWeight,
                                      }}
                                    >
                                      Attach Reports
                                    </Text>
                                    <TouchableOpacity
                                      style={{
                                        backgroundColor:
                                          constThemeColor.secondary,
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
                                    </TouchableOpacity>
                                  </View> */}
                                  <View
                                    style={
                                      {
                                        // marginBottom: Spacing.minor
                                      }
                                    }
                                  >
                                    <ImageViewer
                                      data={animalMedicalData?.attachments
                                        .filter(
                                          (i) =>
                                            i.file_type.split("/")[0] == "image"
                                        )
                                        .map((e) => {
                                          return {
                                            id: e.id,
                                            name: e.file_original_name,
                                            url: e.file,
                                          };
                                        })}
                                      horizontal={true}
                                      width={widthPercentageToDP(41)}
                                      imgHeight={99}
                                      imgWidth={widthPercentageToDP(40.5)}
                                      fileName={true}
                                    />
                                    <View style={[reduxColors.TitleView, {}]}>
                                      <View>
                                        {animalMedicalData?.attachments
                                          .filter(
                                            (i) =>
                                              i.file_type.split("/")[0] !=
                                              "image"
                                          )
                                          .map((item) => (
                                            <TouchableOpacity
                                              onPress={() =>
                                                openPDF(item?.file)
                                              }
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
                                                <View
                                                  style={{
                                                    flexDirection: "row",
                                                  }}
                                                >
                                                  <MaterialIcons
                                                    name="picture-as-pdf"
                                                    size={24}
                                                    color={
                                                      constThemeColor.onSurfaceVariant
                                                    }
                                                  />

                                                  <View
                                                    style={{ marginLeft: 10 }}
                                                  >
                                                    <Text
                                                      style={
                                                        reduxColors.attachText
                                                      }
                                                      numberOfLines={1}
                                                      ellipsizeMode="tail"
                                                    >
                                                      {item?.file_original_name}
                                                    </Text>
                                                  </View>
                                                </View>
                                                {/* <MaterialCommunityIcons
                                    name="close"
                                    size={24}
                                    color={constThemeColor.onSurfaceVariant}
                                    onPress={() => removeFiles(item?.id)}
                                  /> */}
                                              </View>
                                            </TouchableOpacity>
                                          ))}
                                      </View>
                                    </View>
                                  </View>
                                </>
                              ) : null}
                            </View>
                          ) : null}
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}

              {checkAttachment ? (
                <View
                  style={reduxColors.medicalEachSection}
                  ref={attachmentRef}
                >
                  <View style={reduxColors.medicalHeadingSection}>
                    <ImageIcon path={svg_med_attachment} />
                    <Text style={reduxColors.title}>Attachments</Text>
                  </View>
                  <View style={reduxColors.medicalInnerList}>
                    <View>
                      <ImageViewer
                        data={images_Obj ?? []}
                        horizontal={true}
                        fileName={true}
                      />
                    </View>

                    {animalMedicalData?.notes?.documents?.map((item) => (
                      <TouchableOpacity onPress={() => openPDF(item?.url)}>
                        <View
                          style={[
                            reduxColors.attachBox,
                            {
                              backgroundColor: constThemeColor.lightGreyHexa,
                              borderRadius: 4,
                            },
                          ]}
                        >
                          <MaterialIcons
                            name="picture-as-pdf"
                            size={24}
                            color={constThemeColor.onSurfaceVariant}
                          />

                          <View style={{ marginLeft: 10 }}>
                            <Text
                              style={{ width: 200 }}
                              numberOfLines={1}
                              ellipsizeMode="middle"
                            >
                              {item?.file_original_name}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : null}
              {checkNote ? (
                <View style={reduxColors.medicalEachSection} ref={notesRef}>
                  <View style={reduxColors.medicalHeadingSection}>
                    <ImageIcon path={svg_med_notes} />
                    <Text style={reduxColors.title}>Notes</Text>
                  </View>

                  {animalMedicalData?.notes?.notes?.map((item) => {
                    return (
                      <View style={reduxColors.medicalInnerList}>
                        <View style={reduxColors.notesDataBox}>
                          <Text
                            style={{
                              fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                              color: constThemeColor.neutral50,
                              marginBottom: Spacing.mini,
                            }}
                          >
                            {moment(
                              item?.created_at,
                              "YYYY-MM-DD HH:mm:ss"
                            ).format("DD MMM YYYY , HH:mm A")}
                            {/* 10 Jun 2023, 11.30AM */}
                            {}
                          </Text>

                          <Text
                            style={{
                              fontSize: 15,
                              color: constThemeColor?.onErrorContainer,
                            }}
                          >
                            {item?.note}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}

              {checkFollowdate ? (
                <View style={reduxColors.medicalEachSection} ref={followUpRef}>
                  <View style={reduxColors.medicalHeadingSection}>
                    <ImageIcon path={svg_med_follow_up_date} />
                    <Text style={reduxColors.title}>Next Visit</Text>
                  </View>
                  <View style={reduxColors.medicalInnerList}>
                    <Text
                      style={[
                        {
                          marginLeft: Spacing.mini,
                          color: constThemeColor?.onTertiaryContainer,
                        },
                      ]}
                    >
                      {animalMedicalData?.follow_up_date
                        ? ifEmptyValue(
                            moment(animalMedicalData?.follow_up_date).format(
                              "DD MMM YYYY"
                            )
                          )
                        : ""}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>
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
    </View>
  );
};
const ImageIcon = ({ path }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <>
      <SvgXml xml={path} width="20" height="18" style={reduxColors.image} />
    </>
  );
};
export default MedicalSummary;

const styles = (reduxColors) =>
  StyleSheet.create({
    headetTitle: {
      fontSize: FontSize.Antz_Medium_Medium.fontSize,
      fontWeight: FontSize.Antz_Medium_Medium.fontWeight,
      color: reduxColors?.onPrimaryContainer,
    },
    dateTitle: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors?.neutralSecondary,
    },
    secondSymbolOne: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      textAlign: "center",
      alignSelf: "flex-start",
      // width: 21,
      height: 18,
      backgroundColor: reduxColors.surfaceVariant,
      borderRadius: Spacing.mini,
      left: Spacing.body,
      top: Spacing.small,
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      paddingHorizontal: Spacing.mini,
      borderRadius: Spacing.mini,
    },
    medicalEachSection: {
      marginBottom: Spacing.minor,
    },
    medicalHeadingSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: Spacing.micro,
    },
    title: {
      color: reduxColors.onSurfaceVariant,
      marginLeft: Spacing.small,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      marginBottom: Spacing.micro,
    },
    image: {
      height: 100,
      color: reduxColors.onPrimary,
      alignItems: "center",
      justifyContent: "center",
    },
    notesDataBox: {
      minHeight: 50,
      width: "100%",
      backgroundColor: reduxColors.notes,
      borderRadius: Spacing.small,
      padding: Spacing.mini,
      marginBottom: Spacing.mini,
      marginTop: Spacing.micro,
      marginLeft: Spacing.mini,
    },
    medicalInnerList: {
      // flexDirection: "row",
      marginLeft: Spacing.major + Spacing.mini,
      flexWrap: "wrap",
    },
    medicalInnerListGrey: {
      marginLeft: Spacing.major + Spacing.mini,
      flexWrap: "wrap",
      alignSelf: "flex-start",
      borderRadius: Spacing.mini,
      // backgroundColor: reduxColors.background,
    },
    notesTextStyle: {
      marginLeft: Spacing.mini,
      backgroundColor: reduxColors.notes,
      padding: Spacing.mini,
      borderRadius: Spacing.mini,
      marginTop: Spacing.micro,
    },

    sexAndAge: {
      flexDirection: "row",
      marginVertical: Spacing.micro,
    },
    attachBox: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      marginBottom: 3,
      marginTop: 3,
      backgroundColor: reduxColors.surface,
    },
    card: {
      paddingHorizontal: Spacing.minor,
    },
    commonNameList: {
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.small,
    },
    listCard: {
      backgroundColor: reduxColors?.onPrimary,
      marginVertical: Spacing.mini,
      borderRadius: Spacing.small,
    },
    listCardSub: { flexDirection: "row", alignItems: "center" },
    listCardSubText: {
      fontSize: FontSize?.Antz_Subtext_Regular?.fontSize,
      fontWeight: FontSize?.Antz_Subtext_Regular?.fontWeight,
      paddingLeft: Spacing.mini,
      color: reduxColors?.onSurfaceVariant,
    },
    selectedName: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      color: reduxColors.neutralPrimary,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      marginBottom: Spacing.mini,
    },
    caseReportItem: {
      flexDirection: "row",
      alignItems: "center",
      // justifyContent: "center",
    },
    caseReportDetails: {
      flexDirection: "row",
      marginVertical: Spacing.micro,
      paddingTop: Spacing.small,
      width: "100%",
      justifyContent: "flex-start",
    },
    detailsReportTitle: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      color: reduxColors.onSurfaceVariant,
      // fontWeight: "400",
      lineHeight: 15,
      marginLeft: Spacing.mini,
    },
    labContainer: {
      backgroundColor: reduxColors?.onPrimary,
      width: "100%",
      padding: Spacing.body,
      borderRadius: 8,
    },
    activeTextStyle: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors?.onSurfaceVariant,
      paddingLeft: Spacing.major + Spacing.mini,
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
