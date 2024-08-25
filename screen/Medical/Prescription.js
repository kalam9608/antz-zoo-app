//modify By: gaurav shukla
//date:2-05-2023
//description: add the functions for the navigation footermedical

import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import Colors from "../../configs/Colors";
import {
  AntDesign,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import MedicalHeader from "../../components/MedicalHeader";
import Footermedical from "../../components/Footermedical";
import { useDispatch, useSelector } from "react-redux";
import {
  setActivePrescriptionEdit,
  setAdverseEffectList,
  setBodyWeight,
  setEffectListApiCall,
  setMedicalSettings,
  setprescription,
} from "../../redux/MedicalSlice";
import Loader from "../../components/Loader";

import {
  createTemplate,
  getDeliveryRoute,
  getDosageUnit,
  getDurationUnit,
  getFrequencyUnit,
  getLatestWeight,
  getTemplate,
  listAnimalPrescription,
  listMostlyUsed,
  listRecentlyUsed,
  medicineSideEffect,
  prescriptionUpdate,
} from "../../services/MedicalsService";
import { Searchbar } from "react-native-paper";
import FontSize from "../../configs/FontSize";
import CheckBox from "../../components/CheckBox";
import { Dropdown } from "react-native-element-dropdown";
// import {
//   warningDailog,

// } from "../../utils/Alert";
import Spacing from "../../configs/Spacing";
import SaveTemplate, { SaveAsTemplate } from "../../components/SaveTemplate";
import VoiceText from "../../components/VoiceText";
import Constants from "../../configs/Constants";
import { getEducation } from "../../services/EducationService";
import { BackHandler } from "react-native";
import { opacityColor } from "../../utils/Utils";
import MedicalPrescriptionModal from "../../components/MedicalPrescriptionModal";
import { getMeasurmentUnit } from "../../services/AnimalService";
import MedicalRecordSection from "../../components/MedicalRecordSection";
import Header from "../../components/Header";
import { SvgXml } from "react-native-svg";
import moment from "moment";
import PrescriptionItem from "../../components/PrescriptionItem";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import { useToast } from "../../configs/ToastConfig";

const Prescription = (props) => {
  const navigation = useNavigation();

  /*  Redux Function And Value ---------------- */

  const dispatch = useDispatch();
  const medicalSettingsData = useSelector(
    (state) => state.medical.medicalSettings
  );
  const SelectedAnimalRedux = useSelector((state) => state.medical.animal);
  const SelectedEnclosureRedux = useSelector(
    (state) => state.medical.enclosure
  );
  const SelectedSectionRedux = useSelector((state) => state.medical.section);
  const PrescriptionSelectData = useSelector(
    (state) => state.medical.prescription
  );
  const activePrescriptionEdit = useSelector(
    (state) => state.medical.activePrescriptionEdit
  );
  const bodyWeightRedux = useSelector((state) => state.medical.bodyWeight);
  const medicalRecordId = useSelector((state) => state.medical.medicalRecordId);
  const effectListApiCall = useSelector(
    (state) => state.medical.effectListApiCall
  );
  const adverseEffectList = useSelector(
    (state) => state.medical.adverseEffectList
  );
  /*  State Value ------ */
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);
  const [prevMediceStatus, setPrevMediceStatus] = useState(false);
  const [selectItemName, setSelectItemName] = useState("");
  const [toggleSelectedModal, setToggleSelectedModal] = useState(false);
  // const [durationType, setDurationType] = useState("");
  const [durationTypeLabel, setDurationTypeLabel] = useState(
    medicalSettingsData?.prescriptionDuration[0]?.label ?? ""
  );
  const [durationType, setDurationType] = useState(
    medicalSettingsData?.prescriptionDuration[0]?.key ?? ""
  );
  const [durationNo, setDurationNo] = useState("");
  const [toggleSaveBtn, setToggleBtn] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templates, setTemplates] = useState(
    medicalSettingsData?.medicineTemplates ?? []
  );
  const [adverseWarning, setAdverseWarning] = useState(false);
  const [seletectedItem, setseletectedItem] = useState({});
  const [templatesIds, setTemplatesIds] = useState([]);
  const [rxData, setrxData] = useState([]);
  // const [rxMostlyData, setMostlyRxData] = useState(
  //   medicalSettingsData?.mostUsedMedicines ?? []
  // );
  const [recentlyUsedData, setRecentlyUsedData] = useState(
    medicalSettingsData?.recentlyUsedMedicines ?? []
  );
  const [isLoading, setisLoading] = useState(false);
  const [reasonText, setreasonText] = useState("");
  const [recordWeight, setRecordWeight] = useState(
    bodyWeightRedux?.split(" ")[0] ?? ""
  );
  const [recordWeightUnit, setRecordWeightUnit] = useState(
    bodyWeightRedux?.split(" ")[1] ?? ""
  );
  const [selectAction, setSelectAction] = useState(true);
  const [quantity, Setquantity] = useState(1);
  const [dosagePerWeight, setDosagePerWeight] = useState(0);
  const [dosagePerWeightUnit, setDosagePerWeightUnit] = useState("");
  const [dosage, setDosage] = useState(0);
  const [giveUnit, setGiveUnit] = useState(
    medicalSettingsData?.prescriptionDosageMeasurementType[0]?.key ?? ""
  );
  const [frequencyValue, setFrequencyValue] = useState(0);
  // const [frequencyUnit, setFrequencyUnit] = useState("");
  const [frequencyUnitLabel, setFrequencyUnitLabel] = useState(
    medicalSettingsData?.prescriptionFrequency[0]?.label ?? ""
  );
  const [frequencyUnit, setFrequencyUnit] = useState(
    medicalSettingsData?.prescriptionFrequency[0]?.key ?? ""
  );
  const [reasonModal, setReasonModal] = useState(false);
  const [reasonModalType, setReasonModalType] = useState("");
  const [notes, setNotes] = useState("");
  const [toggle, setToggle] = useState(false);
  // const [route, setRoute] = useState("");
  const [routeLabel, setRouteLabel] = useState(
    medicalSettingsData?.prescriptionDeliveryRoute[0]?.delivery ?? ""
  );
  // const [routeId, setRouteId] = useState("");
  const [route, setRoute] =
    useState(medicalSettingsData?.prescriptionDeliveryRoute[0]?.delivery) ?? "";
  const [routeId, setRouteId] = useState(
    medicalSettingsData?.prescriptionDeliveryRoute[0]?.id ?? ""
  );
  // const [errorMessageDosage, setErrorMessage] = useState();
  const [isErrorDosage, setIsErrorDosage] = useState("");
  const [isErrorFreq, setIsErrorFreq] = useState("");
  const [isErrorDuration, setIsErrorDuration] = useState("");
  const [isErrorQyt, setIsErrorQyt] = useState("");
  const [routeData, setRouteData] = useState(
    medicalSettingsData?.prescriptionDeliveryRoute
  );
  const [dataWeight, setDataWeight] = useState(
    medicalSettingsData?.prescriptionMeasurementType
  );
  const [dosagePerWeightdata, setDosagePerWeightdata] = useState([]);
  const [dosageData, setDosageData] = useState(
    medicalSettingsData?.prescriptionDosageMeasurementType
  );
  const [latestWeight, setLatestWeight] = useState("");
  const [stopMedicine, setStopMedicine] = useState(false);
  const [restartMedicine, setRestartMedicine] = useState(false);
  const [sideEffects, setSideEffects] = useState(false);
  const [frequencyData, setFrequencyData] = useState(
    medicalSettingsData?.prescriptionFrequency
  );
  const [durationData, setDurationData] = useState(
    medicalSettingsData?.prescriptionDuration
  );
  const [selectedCommonNames, setSelectedCommonNames] = useState([
    ...PrescriptionSelectData,
  ]);
  const [mappedResult, setMappedResult] = useState([]);
  const [sideEffectsList, setSideEffectsList] = useState();
  // For Dialouge type modal  =========================
  // console?.log({ effectListApiCall });
  const [isModalVisible, setModalVisible] = useState(false);
  const [DialougeTitle, setDialougeTitle] = useState("");
  const [isEdit, setIsEdit] = useState(props?.route?.params?.edit ?? false);
  const { showToast, errorToast, successToast, warningToast } = useToast();
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
    setAdverseWarning(false);
  };
  const confirmButtonPress = () => {
    if (adverseWarning) {
      handleToggleCommDropdown(seletectedItem);
      setModalVisible(false);
      setAdverseWarning(false);
    } else {
      setSelectedCommonNames([]);
      setModalVisible(false);
    }
  };

  const cancelButtonPress = () => {
    alertModalClose();
  };
  const checkSignleAnimal =
    SelectedAnimalRedux?.length == 1 &&
    SelectedEnclosureRedux?.length == 0 &&
    SelectedSectionRedux?.length == 0
      ? true
      : false;
  const { height, width } = Dimensions.get("window");
  const aspectRatio = height / width;
  let isTablet = false;

  if (aspectRatio > 1.6) {
    isTablet = false;
  } else {
    isTablet = true;
  }
  useFocusEffect(
    React.useCallback(() => {
      if (effectListApiCall == true) {
        setisLoading(true);
        let obj = {
          animal_id: JSON.stringify(
            SelectedAnimalRedux?.map((p) => p?.animal_id)
          ),
          enclosure_id: JSON.stringify(
            SelectedEnclosureRedux?.map((p) => p?.enclosure_id)
          ),
          section_id: JSON.stringify(
            SelectedSectionRedux?.map((p) => p?.section_id)
          ),
        };
        medicineSideEffect(obj)
          .then((response) => {
            setSideEffectsList(response?.data?.result);
            dispatch(setAdverseEffectList(response?.data?.result));
            dispatch(setEffectListApiCall(false));
          })
          .catch((err) => {
            console.log("err", err);
          })
          .finally(() => {
            setisLoading(false);
          });
      } else {
        setSideEffectsList(adverseEffectList);
      }

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [effectListApiCall])
  );
  const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  useEffect(() => {
    if (selectedCommonNames?.length == 0) {
      setTemplatesIds([]);
    }
  }, [selectedCommonNames?.length]);

  // useFocusEffect(React.useCallback(() => {}, [PrescriptionSelectData,navigation]));

  const [detailsReport, setDetailsReport] = useState({
    dosage_per_weight: "",
    duration: "",
    when: "",
    dosage: "",
    quantity: "",
    notes: "",
    delivery_route_name: "",
    delivery_route_id: "",
    start_date: null,
    stop_date: null,
    will_restart: true,
    restart_reason: "",
    stop_reason: "",
  });

  useEffect(() => {
    if (activePrescriptionEdit) {
      setTimeout(() => {
        handleEditToggleCommDropdown(activePrescriptionEdit);
      }, 500);
    }
    setTimeout(() => {
      dispatch(setActivePrescriptionEdit(null));
    }, 1000);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // fetchData();
      // getTemplateData();
      // getUnits()
      if (checkSignleAnimal) {
        getLatestBodyweight();
      }
    });
    return unsubscribe;
  }, [navigation]);

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
  const getLatestBodyweight = () => {
    try {
      getLatestWeight(SelectedAnimalRedux[0]?.animal_id)
        .then((res) => {
          // let rx = res[0].map((item) => {
          //   return {
          //     id: item.id,
          //     name: item.label,
          //   };
          // });
          // let rxMostly = res[1]?.data?.map((item) => {
          //   return {
          //     ...item,
          //     id: item.id,
          //     name: item.label,
          //   };
          // });
          // let recentlyUsed = res[2]?.data?.map((item) => {
          //   return {
          //     ...item,
          //     id: item.id,
          //     name: item.label,
          //   };
          // });
          // setrxData(rx);
          // setMostlyRxData(rxMostly);
          // setRecentlyUsedData(recentlyUsed);
          // setRouteData(res[3]?.data);
          // setRouteId(res[3]?.data[0]?.id);
          // setRoute(res[3]?.data[0]?.delivery);
          // setRouteLabel(res[3]?.data[0]?.delivery);
          // setDataWeight(res[4]?.data);
          // setDosagePerWeightdata(res[5]);
          // setDosageData(res[6]);
          // setGiveUnit(res[6][0]?.key);
          // setDurationData(res[7]?.data);
          // setDurationType(res[7]?.data[0]?.key);
          // setDurationTypeLabel(res[7]?.data[0]?.label);
          // setFrequencyData(res[8]?.data);
          // setFrequencyUnit(res[8]?.data[0]?.key);
          // setFrequencyUnitLabel(res[8]?.data[0]?.label);
          setisLoading(false);
          setLatestWeight(
            res?.data?.measurement_value
              ? `${res?.data?.measurement_value} ${res?.data?.unit_name}`
              : ""
          );
        })
        .catch((e) => {
          console.log("err", e);
        });
    } catch (error) {
      console.log("err", error);
    }
  };
  // const fetchData = () => {
  //   setisLoading(true);
  //   Promise.all([
  //     listAnimalPrescription(),
  //     listMostlyUsed({
  //       item_type: Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION,
  //     }),
  //     listRecentlyUsed({
  //       item_type: Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION,
  //     }),
  //     getDeliveryRoute(),
  //     getMeasurmentUnit("weight"),
  //     getDosageUnit("Body Weight"),
  //     getDosageUnit("Dosage"),
  //     getDurationUnit(),
  //     getFrequencyUnit(),
  //   ])
  //     .then((res) => {
  //       let rx = res[0].map((item) => {
  //         return {
  //           id: item.id,
  //           name: item.label,
  //         };
  //       });
  //       let rxMostly = res[1]?.data?.map((item) => {
  //         return {
  //           ...item,
  //           id: item.id,
  //           name: item.label,
  //         };
  //       });
  //       let recentlyUsed = res[2]?.data?.map((item) => {
  //         return {
  //           ...item,
  //           id: item.id,
  //           name: item.label,
  //         };
  //       });
  //       // setrxData(rx);
  //       // setMostlyRxData(rxMostly);
  //       // setRecentlyUsedData(recentlyUsed);
  //       // setRouteData(res[3]?.data);
  //       // setRouteId(res[3]?.data[0]?.id);
  //       // setRoute(res[3]?.data[0]?.delivery);
  //       // setDataWeight(res[4]?.data);
  //       // setDosagePerWeightdata(res[5]);
  //       // setDosageData(res[6]);
  //       // setGiveUnit(res[6][0]?.key);
  //       // setDurationData(res[7]?.data);
  //       // setDurationType(res[7]?.data[0]?.key);
  //       // setFrequencyData(res[8]?.data);
  //       // setFrequencyUnit(res[8]?.data[0]?.key);
  //       setisLoading(false);
  //     })
  //     .catch((err) => {
  //       setisLoading(false);
  //       console.log({ err });
  //       errorToast("Oops!", "Something went wrong!!");
  //     });
  // };

  const goback = () => {
    dispatch(setprescription(selectedCommonNames));
    navigation.navigate("AddMedical");
  };
  const clickFunc = (item) => {
    const findUnfilledItem = item?.find((p) =>
      p.additional_info?.dosage == undefined ? p : null
    );
    if (findUnfilledItem?.id) {
      handleToggleCommDropdown(findUnfilledItem);
    } else {
      goback();
      dispatch(setprescription(item));
      // dispatch(
      //   setBodyWeight(
      //     !recordWeight
      //       ? latestWeight?.body_weight
      //       : `${recordWeight} ${recordWeightUnit}`
      //   )
      // );
    }
  };
  // const searchSelectData = (data) => {
  //   for (let index = 0; index < data.length; index++) {
  //     const item = selectedCommonNames.find(
  //       (item) => item.id === data[index].id
  //     );
  //     if (!item) {
  //       selectedCommonNames.push(data[index]);
  //       setToggle(!toggle);
  //     }
  //   }
  // };

  const searchSelectData = (data) => {
    let arrayData = [...selectedCommonNames];
    for (let index = 0; index < data.length; index++) {
      // const item = selectedCommonNames.find(
      //   (item) => item.id === data[index].id
      // );

      const indexfind = selectedCommonNames.findLastIndex(
        (item) => item.id === data[index].id
      );
      if (indexfind != -1) {
        arrayData = [
          ...selectedCommonNames.slice(0, indexfind),
          {
            ...selectedCommonNames[indexfind],
            ["id"]: selectedCommonNames[indexfind].id,
            ["name"]: selectedCommonNames[indexfind].name,
            ["additional_info"]: {
              ...selectedCommonNames[indexfind]?.additional_info,
              // start_date: response?.data?.additional_info?.start_date,
              // stop_date: response?.data?.additional_info?.stop_date,
              // restart_reason:
              //   response?.data?.additional_info?.restart_reason,
              // stop_reason: response?.data?.additional_info?.stop_reason,
              will_restart: false,
            },
          },
          ...selectedCommonNames.slice(indexfind + 1),
          {
            id: data[index]?.id,
            name: data[index].name,
            additional_info: {
              ...data[index]?.additional_info,
              will_restart: true,
            },
          },
        ];
      } else {
        arrayData.push(data[index]);
        setToggle(!toggle);
      }
    }
    setSelectedCommonNames(arrayData);
  };
  const showDurationField =
    durationData?.find((p) => p.key == durationType)?.show_duration_field == "0"
      ? false
      : true;

  const showFrequencyField =
    frequencyData?.find((p) => p.key == frequencyUnit)?.show_freq_field == "0"
      ? false
      : true;
  /* handle Input values --------------------------- */

  const handleDosagePerWeightSelect = (d) => {
    setDosagePerWeight(d);
    setDetailsReport({
      ...detailsReport,
      dosage_per_weight: `${d} ${dosagePerWeightUnit}`,
    });
  };
  const handleDosagePerWeightUnitSelect = (d) => {
    setDosagePerWeightUnit(d);
    setDetailsReport({
      ...detailsReport,
      dosage_per_weight: `${dosagePerWeight} ${d}`,
    });
  };
  const handleGiveSelect = (g) => {
    setDosage(g);
    setDetailsReport({ ...detailsReport, dosage: `${g} ${giveUnit}` });
  };
  const handleGiveSelectUnit = (g) => {
    setGiveUnit(g);
    setDetailsReport({ ...detailsReport, dosage: `${dosage} ${g}` });
  };

  const handleWhenSelect = (name) => {
    setFrequencyValue(name);
    setDetailsReport({ ...detailsReport, when: `${name} ${frequencyUnit}` });
  };

  const handleWhenSelectUnit = (item) => {
    const showFrequencyField =
      frequencyData?.find((p) => p.key == item.key)?.show_freq_field == "0"
        ? false
        : true;

    setFrequencyUnit(item.key);
    setFrequencyUnitLabel(item.name);
    if (!showFrequencyField) {
      setFrequencyValue(0);
    }
    setDetailsReport({
      ...detailsReport,
      when: `${showFrequencyField ? frequencyValue : 0} ${item.key}`,
    });
  };
  const handleQuantitySelect = (no) => {
    Setquantity(no);
    setDetailsReport({ ...detailsReport, quantity: no });
  };
  const handleDilevery = (e) => {
    setRoute(e?.name);
    setRouteLabel(e?.name);
    setRouteId(e?.id);
    setDetailsReport({
      ...detailsReport,
      delivery_route_name: e?.name,
      delivery_route_id: e?.id,
    });
  };
  const handleNote = (e) => {
    setNotes(e);
    setDetailsReport({ ...detailsReport, notes: e });
  };
  // const handleShowDurationFiled = (e) => {
  //   setShowDurationField(e);
  //   if (!e) {
  //     setDurationNo(0);
  //   }

  // };
  const handleDurationSelect = (item) => {
    const showDurationField =
      durationData?.find((p) => p.key == item.key)?.show_duration_field == "0"
        ? false
        : true;

    setDurationType(item.key);
    setDurationTypeLabel(item.name);
    setDetailsReport({
      ...detailsReport,
      duration: `${showDurationField ? durationNo : 0} ${item.key}`,
    });
    if (!showDurationField) {
      setDurationNo(0);
    }
  };
  const handleDurationInptSelect = (no) => {
    setDurationNo(no);
    setDetailsReport({
      ...detailsReport,
      duration: `${no} ${durationTypeLabel}`,
    });
  };

  // useEffect(() => {
  //   let item = selectedCommonNames.find((item) => item.name === selectItemName);
  //   let du = item?.additional_info?.duration?.split(" ")[0];
  //   setDurationNo(isNaN(du) ? 0 : du);
  //   setDetailsReport(item?.additional_info);
  // }, [selectItemName]);
  const handleToggleCommDropdown = (item) => {
    clearState();
    setReasonModal(false);
    setPrevMediceStatus(false);
    setToggleSelectedModal(!toggleSelectedModal);
    if (toggleSelectedModal) {
      setSelectItemName(item);
      setDetailsReport({
        dosage_per_weight: "",
        duration: "",
        when: "",
        quantity: "",
        notes: "",
        delivery_route_name: "",
        delivery_route_id: "",
        start_date: null,
        stop_date: null,
        restart_reason: "",
        stop_reason: "",
        will_restart: true,
      });
    } else {
      setSelectItemName(item);
      setselectedCheckBoxDay(dosageData[0].id);
      setselectedCheckBoxfrequency(frequencyData[0].id);
      setselectedCheckBoxDuration(durationData[0].id);
      setselectedCheckBoxRoute(routeData[0].id);
    }
  };

  const resonModalFun = (type) => {
    // setToggleSelectedModal(false);
    setSideEffects(false);
    setReasonModal(true);
    setReasonModalType(type);
  };

  /*   Edit Prescription ------------------------------------------- */
  const handleEditToggleCommDropdown = (item) => {
    setPrevMediceStatus(item?.additional_info?.start_date ? true : false);
    setDetailsReport(item?.additional_info);
    // setErrorMessage({});
    // setIsError({});
    setToggleSelectedModal(true);
    setSelectItemName(item);
    setDosagePerWeight(item?.additional_info?.dosage_per_weight?.split(" ")[0]);
    setDosagePerWeightUnit(
      item?.additional_info?.dosage_per_weight?.split(" ")[1] ?? ""
    );
    setDosage(item?.additional_info?.dosage?.split(" ")[0]);

    setGiveUnit(
      item?.additional_info?.dosage?.split(" ")[1] ?? dosageData[0]?.key
    );
    setFrequencyValue(item?.additional_info?.when?.split(" ")[0]);
    setFrequencyUnit(
      item?.additional_info?.when?.split(" ")[1] ?? frequencyData[0]?.key
    );
    let frequencyDataSplit = item?.additional_info?.when
      ?.split(" ")
      .slice(1)
      .join(" ");
    let frequencyLabel = frequencyData.find(
      (e) => e.key === frequencyDataSplit
    )?.label;
    setFrequencyUnitLabel(frequencyLabel ?? frequencyData[0]?.label);
    setDurationNo(item?.additional_info?.duration?.split(" ")[0]);
    setDurationType(
      item?.additional_info?.duration?.split(" ")[1] ?? durationData[0]?.key
    );
    let durationDataSplit = item?.additional_info?.duration
      ?.split(" ")
      .slice(1)
      .join(" ");

    let durationLabel = durationData.find((e) =>
      e.label === durationDataSplit
        ? e.label === durationDataSplit
        : e.key === durationDataSplit
    )?.label;
    setDurationTypeLabel(durationLabel ?? durationData[0]?.label);

    setRoute(
      item?.additional_info?.delivery_route_name ?? routeData[0]?.delivery
    );
    setRouteLabel(
      item?.additional_info?.delivery_route_name
        ? item?.additional_info?.delivery_route_name
        : routeData[0].delivery
    );
    setRouteId(item?.additional_info?.delivery_route_id ?? routeData[0]?.key);
    Setquantity(
      item?.additional_info?.quantity
        ? String(item?.additional_info?.quantity)
        : 0
    );
    setNotes(item?.additional_info?.notes);

    let dosageDataItem = item?.additional_info?.dosage?.split(" ");
    let routeDataItem = item?.additional_info?.delivery_route_name;
    let durationDataItem = item?.additional_info?.duration
      ?.split(" ")
      .slice(1)
      .join(" ");
    let frequencyDataItem = item?.additional_info?.when
      ?.split(" ")
      .slice(1)
      .join(" ");

    if (dosageDataItem) {
      const unit = dosageDataItem[1] ? dosageDataItem[1] : "l";
      const idUnit = dosageData.find((e) => e.label === unit)?.id;

      setselectedCheckBoxDay(idUnit);
    } else {
      setselectedCheckBoxDay(dosageData[0].id);
    }

    if (durationDataItem) {
      const duration = durationDataItem;
      const idFreq = durationData.find((e) =>
        e.label === duration ? e.label === duration : e.key === duration
      )?.id;
      setselectedCheckBoxDuration(idFreq);
    } else {
      setselectedCheckBoxDuration(durationData[0].id);
    }
    if (frequencyDataItem) {
      const frequency = frequencyDataItem;
      const idFreq = frequencyData.find((e) => e.key === frequency)?.id;
      setselectedCheckBoxfrequency(idFreq);
    } else {
      setselectedCheckBoxfrequency(frequencyData[0].id);
    }

    if (routeDataItem) {
      const route = routeDataItem;
      const idRoute = routeData.find((e) => e.delivery === route)?.id;
      setselectedCheckBoxRoute(idRoute);
    } else {
      setselectedCheckBoxRoute(routeData[0].id);
    }
  };
  const handleCloseModel = () => {
    setreasonText("");
    setReasonModal(!reasonModal);
    // setIsError(false);
    // setErrorMessage("");
  };
  // const getTemplateData = () => {
  //   getTemplate({ type: Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION })
  //     .then((response) => {
  //       setTemplates(response?.data);
  //     })
  //     .catch((e) => {});
  // };
  const handleSave = () => {
    setDisableSaveBtn(true);
    if (templateName) {
      let checkTempName = templates.filter(
        (item) =>
          item.template_name.toLowerCase() === templateName.toLowerCase()
      );
      if (checkTempName.length === 0) {
        setisLoading(true);
        const obj = {
          template_name: templateName,
          type: Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION,
          template_items: selectedCommonNames
            ?.filter((p) => p?.id && p)
            .map((v) => v?.id),
          template_new_items: selectedCommonNames
            ?.filter((p) => !p?.id && p)
            .map((v) => v?.name),
        };
        createTemplate(obj)
          .then((response) => {
            if (response?.success) {
              successToast("Success", response?.message);
              // setisLoading(false);
              setTemplates(response?.data);
              dispatch(
                setMedicalSettings({
                  ...medicalSettingsData,
                  medicineTemplates: response?.data,
                })
              );
              setTemplateName("");
            }
          })
          .catch((e) => {
            console.log(e);
            setisLoading(false);
          })
          .finally(() => {
            setisLoading(false);
            setToggleBtn(false);
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

  const selectedItemsColor = (item) => {
    let itemss = selectedCommonNames.find((items) => items.name == item.name);
    if (itemss) {
      return true;
    } else {
      return false;
    }
  };
  // const handleClearAll = () => {
  //   warningDailog(
  //     "Sure!!",
  //     "Do you want to clear all?",
  //     "Yes",
  //     () => {
  //       setSelectedCommonNames([]);
  //     },
  //     "No"
  //   );
  // };

  const handleDeleteName = (name) => {
    const findIndex = selectedCommonNames?.findLastIndex(
      (p) => p?.id == name?.id && p?.additional_info?.start_date
    );
    if (findIndex != -1) {
      const filterdData = [
        ...selectedCommonNames.slice(0, findIndex),
        {
          ...selectedCommonNames[findIndex],
          ["name"]: selectedCommonNames[findIndex]?.name,
          ["id"]: selectedCommonNames[findIndex]?.id,
          ["additional_info"]: {
            ...selectedCommonNames[findIndex]?.additional_info,
            will_restart: true,
          },
        },
        ...selectedCommonNames.slice(findIndex + 1),
      ];
      setSelectedCommonNames(filterdData.filter((item) => item !== name));
    } else {
      setSelectedCommonNames(
        selectedCommonNames.filter((item) => item !== name)
      );
    }
  };
  const handleClickSaveTemp = () => {
    setToggleBtn(true);
  };
  const handleSelectFromTemplate = (item) => {
    let preselectid = PrescriptionSelectData?.map((i) => i?.id);
    if (isEdit) {
      setTemplatesIds([...templatesIds, item?.id]);
      let saveTempValue = item?.template_items?.filter((i) => i?.name != null);
      let FilteredSaveTemp = saveTempValue?.filter(
        (i) => !preselectid?.includes(i?.id)
      );
      if (preselectid?.length > 0) {
        let concatArr = [
          ...(PrescriptionSelectData ?? []),
          ...(FilteredSaveTemp ?? []),
        ];
        setSelectedCommonNames(concatArr);
      } else {
        setSelectedCommonNames(saveTempValue);
      }
    } else {
      setTemplatesIds([...templatesIds, item?.id]);
      let saveTempValue = item?.template_items?.filter(
        (i) => i?.name !== undefined && i?.name !== null
      );
      setSelectedCommonNames(saveTempValue ?? []);
    }
  };
  const handleSelectCommon = (e) => {
    let item = selectedCommonNames.find((item) => item.id === e.id);
    if (item) {
      if (item?.additional_info?.start_date) {
        setSelectedCommonNames(selectedCommonNames);
      } else {
        setSelectedCommonNames(
          selectedCommonNames.filter((item) => item.id !== e.id)
        );
      }
    }
  };

  const Validation = () => {
    setIsErrorDosage("");
    setIsErrorDuration("");
    setIsErrorFreq("");
    setIsErrorQyt("");
    let status = true;
    if (!dosage && showDurationField) {
      // setIsError({ ...isError, dosage: true });
      setIsErrorDosage("This field is requiried");
      status = false;
    }
    if (dosage == 0 && showDurationField) {
      setIsErrorDosage("Enter valid value");
      status = false;
    }
    // if (!giveUnit) {
    //   setIsErrorDosage("This field is requiried");
    //   status = false;
    // }
    if (!frequencyValue && showFrequencyField) {
      setIsErrorFreq("This field is requiried");
      status = false;
    }
    if (frequencyValue == 0 && showFrequencyField) {
      setIsErrorFreq("Enter valid value");
      status = false;
    }
    // if (!frequencyUnit) {
    //   setIsError({ ...isError, frequencyUnit: true });
    //   setErrorMessage({
    //     ...errorMessage,
    //     frequencyUnit: "This field is requiried",
    //   });
    //   status = false;
    // }
    if (!durationNo && showDurationField) {
      setIsErrorDuration("This field is requiried");
      status = false;
    }
    if (durationNo == 0 && showDurationField) {
      setIsErrorDuration("Enter valid value");
      status = false;
    }
    // if (!quantity) {
    //   // setIsError({ ...isError, quantity: true });
    //   setIsErrorQyt("This field is requiried");
    //   status = false;
    // }
    // if (quantity == 0) {
    //   // setIsError({ ...isError, quantity: true });
    //   setIsErrorQyt("Enter valid value");
    //   status = false;
    // }
    // if (!routeId) {
    //   setIsError({ ...isError, delivery: true });
    //   setErrorMessage({ ...errorMessage, delivery: "This field is requiried" });
    //   status = false;
    // }
    return status;
  };
  // useEffect(() => {
  //   let str1 = detailsReport?.dosage_per_weight?.replace(/[^\d.]/g, "");
  //   let str2 = Array.from(String(str1), Number);
  //   const totalDosePerDay = isNaN(
  //     str2.reduce((partialSum, a) => partialSum + a, 0)
  //   )
  //     ? 0
  //     : str2.reduce((partialSum, a) => partialSum + a, 0);
  //   if (durationType == "Days") {
  //     setDetailsReport({
  //       ...detailsReport,
  //       quantity: totalDosePerDay * durationNo,
  //     });
  //   } else if (durationType == "Weeks") {
  //     setDetailsReport({
  //       ...detailsReport,
  //       quantity: totalDosePerDay * durationNo * 7,
  //     });
  //   } else if (durationType == "Months") {
  //     setDetailsReport({
  //       ...detailsReport,
  //       quantity: totalDosePerDay * durationNo * 30,
  //     });
  //   } else if (durationType == "Years") {
  //     setDetailsReport({
  //       ...detailsReport,
  //       quantity: totalDosePerDay * durationNo * 365,
  //     });
  //   }
  // }, [durationType, durationNo, detailsReport?.dosage_per_weight]);

  /*   handle Submit function------------------------------------------------------------------ */
  const handleDetailsSubmit = (name, id, stop, restart) => {
    if (Validation()) {
      const index = selectedCommonNames.findIndex(
        (item) => item.id === id && item?.additional_info?.will_restart != false
      );
      const checkSideEffect = sideEffectsList?.find(
        (p) => p?.medicine_id == id
      );
      if (index == -1) {
        setSelectedCommonNames([
          ...selectedCommonNames,
          {
            ["name"]: name,
            ["id"]: id,
            ["additional_info"]: {
              ...detailsReport,
              delivery_route_name: route,
              delivery_route_id: routeId,
              will_restart: true,
              side_effect: checkSideEffect?.id ? true : false,
              side_effect_reason: checkSideEffect?.reason,
            },
          },
        ]);
        handleToggleCommDropdown();
      } else {
        const compareObj = {
          dosage_per_weight: !detailsReport?.dosage_per_weight
            ? selectedCommonNames[index]?.additional_info?.dosage_per_weight
            : detailsReport?.dosage_per_weight,
          duration: !detailsReport?.duration
            ? selectedCommonNames[index]?.additional_info?.duration
            : detailsReport?.duration,
          when: !detailsReport?.when
            ? selectedCommonNames[index]?.additional_info?.when
            : detailsReport?.when,
          quantity: !detailsReport?.quantity
            ? selectedCommonNames[index]?.additional_info?.quantity
            : detailsReport?.quantity,
          notes: !detailsReport?.notes
            ? selectedCommonNames[index]?.additional_info?.notes
            : detailsReport?.notes,
          dosage: !detailsReport?.dosage
            ? selectedCommonNames[index]?.additional_info?.dosage
            : detailsReport?.dosage,
          delivery_route_name: !detailsReport?.delivery_route_name
            ? selectedCommonNames[index]?.additional_info?.delivery_route_name
            : detailsReport?.delivery_route_name,

          delivery_route_id: !detailsReport?.delivery_route_id
            ? selectedCommonNames[index]?.additional_info?.delivery_route_id
            : detailsReport?.delivery_route_id,
          start_date: !detailsReport?.start_date
            ? restart
              ? currentDate
              : selectedCommonNames[index]?.additional_info?.start_date
            : currentDate,
          stop_date: stop ? currentDate : null,
          restart_reason: restart ? reasonText : "",
          stop_reason: stop ? reasonText : "",
          will_restart: true,
          side_effect: checkSideEffect?.id ? true : false,
          side_effect_reason: checkSideEffect?.reason,
        };
        setSelectedCommonNames([
          ...selectedCommonNames.slice(0, index),
          {
            ...selectedCommonNames[index],
            ["name"]: name,
            ["id"]: id,
            ["additional_info"]: compareObj,
          },
          ...selectedCommonNames.slice(index + 1),
        ]);
        setreasonText("");
        handleToggleCommDropdown();
      }
    }
  };
  /* 
  clear State Functon --------------------------------------------------------------------- */
  const clearState = () => {
    setDosagePerWeight();
    setDosagePerWeightUnit("");
    setGiveUnit(dosageData[0]?.key);
    setDosage("");
    setFrequencyValue("");
    setFrequencyUnit(frequencyData[0]?.key);
    setFrequencyUnitLabel(frequencyData[0]?.label);
    setRoute(routeData[0]?.delivery);
    setRouteLabel(routeData[0]?.delivery);
    setRouteId(routeData[0]?.id);
    Setquantity(0);
    setDurationNo(0);
    setDurationType(durationData[0]?.key);
    setDurationTypeLabel(durationData[0]?.label);
    setNotes("");
    setIsErrorDosage("");
    setIsErrorDuration("");
    setIsErrorFreq("");
    setIsErrorQyt("");
    // setErrorMessage({});
    // setIsError({});
  };

  const navigateNextScreen = () => {
    const findUnfilledItem = selectedCommonNames?.find((p) =>
      p.additional_info?.dosage == undefined ? p : null
    );
    if (findUnfilledItem?.id) {
      handleToggleCommDropdown(findUnfilledItem);
    } else {
      dispatch(setprescription(selectedCommonNames));
      // dispatch(
      //   setBodyWeight(
      //     !recordWeight
      //       ? latestWeight?.body_weight
      //       : `${recordWeight} ${recordWeightUnit}`
      //   )
      // );
      navigation.navigate("Advice");
    }
  };

  const navigatePreviousScreen = () => {
    const findUnfilledItem = selectedCommonNames?.find((p) =>
      p.additional_info?.dosage == undefined ? p : null
    );
    if (findUnfilledItem?.id) {
      handleToggleCommDropdown(findUnfilledItem);
    } else {
      dispatch(setprescription(selectedCommonNames));
      // dispatch(
      //   setBodyWeight(
      //     !recordWeight
      //       ? latestWeight?.body_weight
      //       : `${recordWeight} ${recordWeightUnit}`
      //   )
      // );
      navigation.navigate("Diagnosis");
    }
  };
  // fot taking reduxColors from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const closeTempSave = () => {
    setToggleBtn(false);
    setTemplateName("");
  };

  const handleToggle = (item) => {
    if (selectedCommonNames.find((items) => items.id === item.id)) {
      handleSelectCommon(item);
    } else {
      const checkSideEffect = sideEffectsList?.find(
        (p) => p?.medicine_id == item.id
      );
      if (checkSideEffect?.medicine_id) {
        setDialougeTitle("Caused adverse side effects, Do you want to add?");
        alertModalOpen();
        setseletectedItem(item);
        setAdverseWarning(true);
      } else {
        handleToggleCommDropdown(item);
        setAdverseWarning(false);
      }
    }
  };

  useEffect(() => {
    let mappedResult = templates?.map((item) => ({
      id: item.id,
      name: item.template_name,
      template_items: item.template_items,
    }));
    setMappedResult(mappedResult ?? []);
  }, [templates]);

  const [medicalUnitModal, setMedicalUnitModal] = useState(false);
  const [selectedCheckBoxDay, setselectedCheckBoxDay] = useState(null);

  useEffect(() => {
    setselectedCheckBoxDay(
      dosageData && dosageData.length > 0 ? dosageData[0].id : ""
    );
    setselectedCheckBoxDuration(
      durationData && durationData.length > 0 ? durationData[0].id : ""
    );
    setselectedCheckBoxfrequency(
      frequencyData && frequencyData.length > 0 ? frequencyData[0].id : ""
    );
    setselectedCheckBoxRoute(
      routeData && routeData.length > 0 ? routeData[0].id : ""
    );
  }, [dosageData, durationData, frequencyData, routeData]);

  const isSelectedIdUnit = (id) => {
    if (selectedCheckBoxDay == id) {
      return true;
    } else {
      return false;
    }
  };

  const toggleUnitModal = () => {
    setMedicalUnitModal(!medicalUnitModal);
  };
  const closeUnitModal = () => {
    setMedicalUnitModal(!medicalUnitModal);
  };
  const closeMenuUnit = (item) => {
    setselectedCheckBoxDay(item?.id);
    handleGiveSelectUnit(item.key);
    setMedicalUnitModal(!medicalUnitModal);
  };
  // modal frequency function data

  const [medicalfrequencyModal, setMedicalfrequencyModal] = useState(false);
  const [selectedCheckBoxfrequency, setselectedCheckBoxfrequency] =
    useState(null);

  const isSelectedIdfrequency = (id) => {
    if (selectedCheckBoxfrequency == id) {
      return true;
    } else {
      return false;
    }
  };

  const togglefrequencyModal = () => {
    setMedicalfrequencyModal(!medicalfrequencyModal);
  };
  const closefrequencyModal = () => {
    setMedicalfrequencyModal(!medicalfrequencyModal);
  };
  const closeMenufrequency = (item) => {
    setselectedCheckBoxfrequency(item?.id);
    handleWhenSelectUnit(item);
    setMedicalfrequencyModal(!medicalfrequencyModal);
  };

  // modal Duration function data

  const [medicalDurationModal, setMedicalDurationModal] = useState(false);
  const [selectedCheckBoxDuration, setselectedCheckBoxDuration] =
    useState(null);

  const isSelectedIdDuration = (id) => {
    if (selectedCheckBoxDuration == id) {
      return true;
    } else {
      return false;
    }
  };

  const toggleDurationModal = () => {
    setMedicalDurationModal(!medicalDurationModal);
  };
  const closeDurationModal = () => {
    setMedicalDurationModal(!medicalDurationModal);
  };
  const closeMenuDuration = (item) => {
    setselectedCheckBoxDuration(item?.id);
    handleDurationSelect(item);
    setMedicalDurationModal(!medicalDurationModal);
  };

  // modal Route function data
  const [medicalRouteModal, setMedicalRouteModal] = useState(false);
  const [selectedCheckBoxRoute, setselectedCheckBoxRoute] = useState(null);

  const isSelectedIdRoute = (id) => {
    if (selectedCheckBoxRoute == id) {
      return true;
    } else {
      return false;
    }
  };

  const toggleRouteModal = () => {
    setMedicalRouteModal(!medicalRouteModal);
  };
  const closeRouteModal = () => {
    setMedicalRouteModal(!medicalRouteModal);
  };
  const closeMenuRoute = (item) => {
    setselectedCheckBoxRoute(item?.id);
    handleDilevery(item);
    setMedicalRouteModal(!medicalRouteModal);
  };
  const medicalStatusUpdate = (id, status, note) => {
    const obj = {
      medical_record_id: medicalRecordId,
      prescription_id: id,
      status: status,
      will_restart: status == "restart" ? true : false,
      note: reasonText,
      // side_effect: sideEffects,
    };
    if (sideEffects == true) {
      obj.side_effect = sideEffects;
    }
    console.log({obj})
    prescriptionUpdate(obj)
      .then((response) => {
        if (response?.success) {
          const index = selectedCommonNames.findIndex(
            (item) =>
              item.id === response?.data?.id &&
              item?.additional_info?.will_restart == true
          );
          const indexRedux = PrescriptionSelectData.findIndex(
            (item) =>
              item.id === response?.data?.id &&
              item?.additional_info?.will_restart == true
          );
          if (index != -1) {
            if (status == "restart") {
              // const indexCheck = selectedCommonNames.findIndex(
              //   (item) => item.id === response?.data?.id && item?.additional_info?.will_restart
              // );
              setSelectedCommonNames([
                ...selectedCommonNames.slice(0, index),
                {
                  ...selectedCommonNames[index],
                  ["id"]: selectedCommonNames[index].id,
                  ["name"]: selectedCommonNames[index].name,
                  ["additional_info"]: {
                    ...selectedCommonNames[index]?.additional_info,
                    // start_date: response?.data?.additional_info?.start_date,
                    // stop_date: response?.data?.additional_info?.stop_date,
                    // restart_reason:
                    //   response?.data?.additional_info?.restart_reason,
                    // stop_reason: response?.data?.additional_info?.stop_reason,
                    side_effect: checkIdMatch(selectedCommonNames[index].id)
                      ? true
                      : sideEffects,
                    will_restart: false,
                  },
                },
                ...selectedCommonNames.slice(index + 1),
                {
                  id: response?.data?.id,
                  name: selectedCommonNames[index].name,
                  additional_info: {
                    ...detailsReport,
                    start_date: currentDate,
                    stop_date: null,
                    stop_reason: "",
                    restart_reason: reasonText,
                    notes: detailsReport?.notes,
                    will_restart: true,
                    side_effect: sideEffects,
                  },
                },
              ]);
            } else {
              setSelectedCommonNames([
                ...selectedCommonNames.slice(0, index),
                {
                  ...selectedCommonNames[index],
                  ["id"]: selectedCommonNames[index].id,
                  ["name"]: selectedCommonNames[index].name,
                  ["additional_info"]: {
                    ...detailsReport,
                    start_date: response?.data?.additional_info?.start_date,
                    stop_date: response?.data?.additional_info?.stop_date,
                    restart_reason:
                      response?.data?.additional_info?.restart_reason,
                    stop_reason: response?.data?.additional_info?.stop_reason,
                    side_effect: sideEffects,
                  },
                },
                ...selectedCommonNames.slice(index + 1),
              ]);
            }
          }
          if (indexRedux != -1) {
            if (status == "restart") {
              // const indexCheck = selectedCommonNames.findIndex(
              //   (item) => item.id === response?.data?.id && item?.additional_info?.will_restart
              // );
              dispatch(
                setprescription([
                  ...selectedCommonNames.slice(0, index),
                  {
                    ...selectedCommonNames[index],
                    ["id"]: selectedCommonNames[index].id,
                    ["name"]: selectedCommonNames[index].name,
                    ["additional_info"]: {
                      ...selectedCommonNames[index]?.additional_info,
                      // start_date: response?.data?.additional_info?.start_date,
                      // stop_date: response?.data?.additional_info?.stop_date,
                      // restart_reason:
                      //   response?.data?.additional_info?.restart_reason,
                      // stop_reason: response?.data?.additional_info?.stop_reason,
                      will_restart: false,
                      side_effect: sideEffects,
                    },
                  },
                  ...selectedCommonNames.slice(index + 1),
                  {
                    id: response?.data?.id,
                    name: selectedCommonNames[index].name,
                    additional_info: {
                      ...detailsReport,
                      start_date: currentDate,
                      stop_date: null,
                      stop_reason: "",
                      restart_reason: reasonText,
                      notes: detailsReport?.notes,
                      side_effect: sideEffects,
                    },
                  },
                ])
              );
            } else {
              dispatch(
                setprescription([
                  ...PrescriptionSelectData.slice(0, index),
                  {
                    ...selectedCommonNames[index],
                    ["id"]: selectedCommonNames[index].id,
                    ["name"]: selectedCommonNames[index].name,
                    ["additional_info"]: {
                      ...detailsReport,
                      start_date: response?.data?.additional_info?.start_date,
                      stop_date: response?.data?.additional_info?.stop_date,
                      restart_reason:
                        response?.data?.additional_info?.restart_reason,
                      stop_reason: response?.data?.additional_info?.stop_reason,
                    },
                  },
                  ...PrescriptionSelectData.slice(index + 1),
                ])
              );
            }
          }
          setreasonText("");
          handleToggleCommDropdown();
          setisLoading(false);
          successToast("Success", response?.message);
        } else {
          setisLoading(false);
          errorToast("error", response?.message);
        }
      })
      .catch((e) => {
        console.log("err", e);
        setisLoading(false);
      });
  };

  const setreasonTextFun = (text) => {
    const isOnlySpaces = /^\s+$/.test(text);
    if (!isOnlySpaces) {
      setreasonText(text);
    }
  };
  const [selectId, setSelectId] = useState([]);
  const selectIds = () => {
    const sideEffectIds = selectedCommonNames
      ?.filter((item) => item?.additional_info?.side_effect)
      .map((item) => item.id);
    setSelectId(sideEffectIds ?? []);
  };
  useEffect(() => {
    selectIds();
  }, [selectedCommonNames]);
  const checkIdMatch = (id) => {
    if (selectId?.length > 0) {
      if (selectId && selectId?.length > 0) {
        const objId = String(id);
        return selectId?.some((item) => item === objId);
      } else {
        return false;
      }
    }
  };

  const handleLongPress = (item) => {
    let filtered = item?.template_items?.filter((i) => i?.name != null);
    let Filtereditem = {
      id: item?.id ?? "",
      name: item?.name ?? "",
      template_items: filtered ?? [],
    };
    navigation.navigate("EditMedicalTempalte", {
      type: "prescription",
      editTempData: Filtereditem,
      data: Filtereditem?.template_items,
      typeId: Filtereditem?.id,
      mappedTempData:mappedResult?.filter((i)=>i?.name!=Filtereditem?.name),
      onGoBackData: (e) => editSelectData(e),
    });
  };
  const editSelectData = (e) => {
    let preselectid = PrescriptionSelectData?.map((i) => i?.id);
    if (e?.checked) {
      const prevselectedItems = PrescriptionSelectData?.map((i) => {
        return {
          id: i?.id ?? "",
          name: i?.name ?? "",
          composition: i?.composition,
          store_data: i?.store_data ?? [],
          total_qty: i?.total_qty ?? [],
        };
      });

      const selectedItems = e?.editTempData
        ?.filter((itemData) => !preselectid?.includes(itemData?.id))
        ?.map((itemData) => {
          return {
            id: itemData?.id,
            name: itemData?.name,
            composition: null,
            store_data: [],
            total_qty: "0",
          };
        });
      let concatNames = [
        ...(prevselectedItems ?? []),
        ...(selectedItems ?? []),
      ];
      console.log(concatNames);

      setSelectedCommonNames(concatNames);
    }
    if (e?.delete) {
      setMappedResult(mappedResult?.filter((i) => i.id != e?.typeId) ?? []);
      dispatch(
        setMedicalSettings({
          ...medicalSettingsData,
          medicineTemplates:
          medicalSettingsData.medicineTemplates?.filter((i) => i.id != e?.typeId),
        })
      );
    } else {
      let mappedTempData = templates?.map((item) => {
        if (item?.id == e?.typeId) {
          return {
            id: e?.typeId,
            name: e?.editInputName,
            template_items: e?.editTempData,
          };
        } else {
          return {
            id: item?.id,
            name: item?.template_name,
            template_items: item?.template_items,
          };
        }
      });
      setMappedResult(mappedTempData ?? []);
    }
  };

  return (
    <>
      {/* <MedicalHeader title="Prescription" noIcon={true} /> */}
      <Header
        title={"Prescription"}
        headerTitle={reduxColors.headerTitle}
        noIcon={true}
        search={false}
        hideMenu={true}
        backgroundColor={constThemeColor?.onPrimary}
        customBack={() => navigation.navigate("AddMedical")}
      />
      <Loader visible={isLoading} />
      <View style={[reduxColors.container]}>
        <TouchableOpacity
          style={reduxColors.searchBox}
          onPress={() =>
            navigation.navigate("CommonSearch", {
              name: "prescription",
              listData: rxData,
              selected: selectedCommonNames?.filter(
                (p) => p?.additional_info?.stop_date == null
              ),
              routeData: routeData ?? [],
              dataWeight: dataWeight ?? [],
              dosagePerWeightdata: dosagePerWeightdata,
              dosageData: dosageData,
              frequencyData: frequencyData,
              durationData: durationData,
              latestWeight: latestWeight,
              giveUnit: giveUnit,
              frequencyUnit: frequencyUnit,
              durationType: durationType,
              routeId: routeId,
              route: route,
              frequencyUnitLabel: frequencyUnitLabel,
              durationTypeLabel: durationTypeLabel,
              routeLabel: routeLabel,
              sideEffectsList: sideEffectsList,
              onGoBack: (e) => searchSelectData(e),
            })
          }
        >
          {/* <Searchbar
            accessible={true}
            accessibilityLabel={"searchPrescription"}
            AccessibilityId={"searchPrescription"}
            autoCompleteType="off"
            placeholder="Search Medicines"
            placeholderTextColor={constThemeColor.onSurfaceVariant}
            style={reduxColors.histopathologySearchField}
            inputStyle={reduxColors.input}
            onFocus={() =>
              navigation.navigate("CommonSearch", {
                name: "prescription",
                listData: rxData,
                selected: selectedCommonNames,
                routeData: routeData ?? [],
                dataWeight: dataWeight ?? [],
                dosagePerWeightdata: dosagePerWeightdata,
                dosageData: dosageData,
                frequencyData: frequencyData,
                durationData: durationData,
                latestWeight: latestWeight,
                giveUnit: giveUnit,
                frequencyUnit: frequencyUnit,
                durationType: durationType,
                routeId: routeId,
                route: route,
                frequencyUnitLabel: frequencyUnitLabel,
                durationTypeLabel: durationTypeLabel,
                routeLabel: routeLabel,
                onGoBack: (e) => searchSelectData(e),
              })
            }
            // right={() => (
            //   <>
            //     <VoiceText resultValue={{}} />
            //   </>
            // )}
          /> */}
          <View style={[reduxColors.histopathologySearchField]}>
            <AntDesign
              name="search1"
              size={20}
              color={constThemeColor.onSurfaceVariant}
              marginLeft={Spacing.minor}
            />
            <Text
              style={{
                color: constThemeColor.onSurfaceVariant,
                marginLeft: Spacing.body,
                fontSize: FontSize.Antz_Minor_Title.fontSize,
              }}
            >
              Search Medicines
            </Text>
          </View>
        </TouchableOpacity>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={reduxColors.scrollContainer}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          {selectedCommonNames.map((item, index) => {
            return (
              <PrescriptionItem
                selectId={selectId}
                item={item}
                handleEditToggleCommDropdown={handleEditToggleCommDropdown}
                handleDeleteName={handleDeleteName}
                index={index}
              />
            );
          })}

          {/* Save Template */}
          {toggleSaveBtn ? (
            <>
              {selectedCommonNames.length > 1 ? (
                <SaveTemplate
                  disable={disableSaveBtn}
                  closeTempSave={closeTempSave}
                  handleSave={handleSave}
                  onChangeText={(e) => setTemplateName(e)}
                />
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              {selectedCommonNames.length > 1 ? (
                <>
                  <SaveAsTemplate
                    handleClearAll={() => {
                      setDialougeTitle("Do you want to clear all?");
                      alertModalOpen();
                    }}
                    medicalRecordId={medicalRecordId}
                    handleClickSaveTemp={handleClickSaveTemp}
                  />
                </>
              ) : (
                <></>
              )}
            </>
          )}

          <View>
            {templates.length >= 1 ? (
              <>
                {/* <Text
                  style={[
                    reduxColors.searchSuggestionTitle,
                    { marginVertical: Spacing.small },
                    { color: constThemeColor.onSecondaryContainer },
                  ]}
                >
                  Your Templates
                </Text>
                <View style={reduxColors.commBtnContainer}>
                  {templates.map((item, index) => {
                    return (
                      <View key={index}>
                        <TouchableOpacity
                          onPress={() => handleSelectFromTemplate(item)}
                          style={
                            templatesIds?.includes(item?.id) &&
                            selectedCommonNames?.length > 0
                              ? reduxColors.activeSearchSgBtnCover
                              : reduxColors.searchSuggestionbtnCover
                          }
                        >
                          <Text style={reduxColors.caseTypeBtnTxt}>
                            {item.template_name}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View> */}
                <MedicalRecordSection
                  data={mappedResult}
                  title={"Your Templates"}
                  handleToggle={handleSelectFromTemplate}
                  titleStyle={{ color: constThemeColor.onSurface }}
                  contStyle={{ backgroundColor: constThemeColor.surface }}
                  onLongPress={handleLongPress}
                />
              </>
            ) : (
              <></>
            )}
            {recentlyUsedData?.length > 0 ? (
              <>
                {/* <Text
                  style={[
                    reduxColors.searchSuggestionTitle,
                    { marginVertical: Spacing.small },
                    { color: constThemeColor.onSecondaryContainer },
                  ]}
                >
                  Recently used
                </Text>
                <View style={reduxColors.commBtnContainer}>
                  {recentlyUsedData?.map((item, index) => {
                    return (
                      <View key={index}>
                        <TouchableOpacity
                          style={
                            selectedItemsColor(item.name)
                              ? reduxColors.activeSearchSgBtnCover
                              : reduxColors.searchSuggestionbtnCover
                          }
                          onPress={() => {
                            if (
                              selectedCommonNames.find(
                                (items) => items.id === item.id
                              )
                            ) {
                              handleSelectCommon(item);
                            } else {
                              handleToggleCommDropdown(item);
                            }
                          }}
                        >
                          <Text style={reduxColors.caseTypeBtnTxt}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View> */}
                <MedicalRecordSection
                  data={recentlyUsedData}
                  title={"Recently used"}
                  selectedItemsColor={selectedItemsColor}
                  handleToggle={handleToggle}
                />
              </>
            ) : null}
            {/* Common Button */}
            {/* {rxMostlyData?.length > 0 ? ( */}
            <>
              {/* <Text
                  style={[
                    reduxColors.searchSuggestionTitle,
                    { marginVertical: Spacing.small },
                    { color: constThemeColor.onSecondaryContainer },
                  ]}
                >
                  Most Used
                </Text>
                <View style={reduxColors.commBtnContainer}>
                  {rxMostlyData.map((item, index) => {
                    return (
                      <View key={index}>
                        <TouchableOpacity
                          style={
                            selectedItemsColor(item.id)
                              ? reduxColors.activeSearchSgBtnCover
                              : reduxColors.searchSuggestionbtnCover
                          }
                          onPress={() => {
                            if (
                              selectedCommonNames.find(
                                (items) => items.id === item.id
                              )
                            ) {
                              handleSelectCommon(item);
                            } else {
                              handleToggleCommDropdown(item);
                            }
                          }}
                        >
                          <Text style={reduxColors.caseTypeBtnTxt}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View> */}
              {/* <MedicalRecordSection
                  data={rxMostlyData}
                  title={"Most Used"}
                  selectedItemsColor={selectedItemsColor}
                  handleToggle={handleToggle}
                /> */}
            </>
            {/* ) : null} */}
          </View>
          {/* </View> */}
        </ScrollView>

        {/* Footer */}
        <View style={{ width: "100%" }}>
          <Footermedical
            ShowIonicons={true}
            ShowRighticon={true}
            firstlabel={"Diagnosis"}
            lastlabel={"Advice"}
            navigateNextScreen={navigateNextScreen}
            navigatePreviousScreen={navigatePreviousScreen}
            onPress={() => {
              clickFunc(selectedCommonNames);
            }}
          />
        </View>

        {/* Modal Dropdown */}
        {toggleSelectedModal ? (
          <MedicalPrescriptionModal
            selectItemName={selectItemName}
            handleToggleCommDropdown={handleToggleCommDropdown}
            SelectedAnimalRedux={SelectedAnimalRedux}
            SelectedEnclosureRedux={SelectedEnclosureRedux}
            SelectedSectionRedux={SelectedSectionRedux}
            selectAction={selectAction}
            setSelectAction={setSelectAction}
            recordWeight={recordWeight}
            dataWeight={dataWeight}
            recordWeightUnit={recordWeightUnit}
            setRecordWeight={setRecordWeight}
            setRecordWeightUnit={setRecordWeightUnit}
            dosagePerWeight={dosagePerWeight}
            handleDosagePerWeightSelect={handleDosagePerWeightSelect}
            dosagePerWeightUnit={dosagePerWeightUnit}
            handleDosagePerWeightUnitSelect={handleDosagePerWeightUnitSelect}
            give={dosage}
            handleGiveSelect={handleGiveSelect}
            dosagePerWeightdata={dosagePerWeightdata}
            giveUnit={giveUnit}
            handleGiveSelectUnit={handleGiveSelectUnit}
            isErrorDosage={isErrorDosage}
            isErrorDuration={isErrorDuration}
            isErrorQyt={isErrorQyt}
            isErrorFreq={isErrorFreq}
            frequencyValue={frequencyValue}
            handleWhenSelect={handleWhenSelect}
            isLoading={isLoading}
            setisLoading={setisLoading}
            frequencyData={frequencyData}
            frequencyUnit={frequencyUnit}
            frequencyUnitLabel={frequencyUnitLabel}
            setReasonModal={setReasonModal}
            setStopMedicine={setStopMedicine}
            setRestartMedicine={setRestartMedicine}
            handleWhenSelectUnit={handleWhenSelectUnit}
            dosageData={dosageData}
            durationNo={durationNo}
            durationData={durationData}
            durationType={durationType}
            showDurationField={showDurationField}
            handleDurationInptSelect={handleDurationInptSelect}
            handleDurationSelect={handleDurationSelect}
            quantity={quantity}
            handleQuantitySelect={handleQuantitySelect}
            routeData={routeData}
            route={route}
            handleDilevery={handleDilevery}
            notes={notes}
            handleNote={handleNote}
            setreasonText={setreasonTextFun}
            reasonText={reasonText}
            showFrequencyField={showFrequencyField}
            prevMediceStatus={prevMediceStatus}
            handleCloseModel={handleCloseModel}
            reasonModal={reasonModal}
            latestWeight={latestWeight}
            reasonModalType={reasonModalType}
            checkSignleAnimal={checkSignleAnimal}
            setSideEffects={setSideEffects}
            sideEffects={sideEffects}
            sideEffectsList={sideEffectsList}
            resonModalFun={resonModalFun}
            handleDetailsSubmit={handleDetailsSubmit}
            // modal unit function data
            toggleUNitModal={toggleUnitModal}
            closeUnitModal={closeUnitModal}
            closeMenuUnit={closeMenuUnit}
            isSelectedIdUnit={isSelectedIdUnit}
            medicalUnitModal={medicalUnitModal}
            // modal frequency function data
            medicalfrequencyModal={medicalfrequencyModal}
            togglefrequencyModal={togglefrequencyModal}
            closefrequencyModal={closefrequencyModal}
            closeMenufrequency={closeMenufrequency}
            isSelectedIdfrequency={isSelectedIdfrequency}
            // modal duration function
            durationTypeLabel={durationTypeLabel}
            toggleDurationModal={toggleDurationModal}
            closeDurationModal={closeDurationModal}
            closeMenuDuration={closeMenuDuration}
            isSelectedIdDuration={isSelectedIdDuration}
            medicalDurationModal={medicalDurationModal}
            // modal Route function
            toggleRouteModal={toggleRouteModal}
            closeRouteModal={closeRouteModal}
            closeMenuRoute={closeMenuRoute}
            isSelectedIdRoute={isSelectedIdRoute}
            medicalRouteModal={medicalRouteModal}
            routeLabel={routeLabel}
            medicalStatusUpdate={medicalStatusUpdate}
          />
        ) : null}
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

export default Prescription;

export const DosaseTab = ({
  constThemeColor,
  reduxColors,
  recordWeight,
  setRecordWeight,
  setRecordWeightUnit,
  dataWeight,
  recordWeightUnit,
  latestWeight,
}) => {
  const TAB_HEADER_ITEMS = [
    {
      id: "1",
      title: "Use last weight",
      screen: "useWeight",
    },
    {
      id: "2",
      title: "Record new weight",
      screen: "recordWeight",
    },
  ];

  const [screen, setScreen] = useState("useWeight");

  const Item = ({ title, screenName }) => (
    <TouchableOpacity
      style={{
        borderBottomColor:
          screenName === screen
            ? constThemeColor.primary
            : constThemeColor.displaybgPrimary,
        borderBottomWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        height: 50,
        marginHorizontal: Spacing.minor,
      }}
      onPress={() => setScreen(screenName)}
    >
      <Text
        style={[
          {
            color:
              screenName === screen
                ? constThemeColor.primary
                : constThemeColor.onSurfaceVariant,
            fontWeight: FontSize.Antz_Body_Medium.fontWeight,
            FontSize: FontSize.Antz_Body_Medium.fontSize,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View
        style={{
          backgroundColor: constThemeColor.displaybgPrimary,
          borderRadius: Spacing.small,
        }}
      >
        <View style={{ height: 50 }}>
          <FlatList
            data={TAB_HEADER_ITEMS}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <Item title={item.title} screenName={item.screen} />
            )}
            keyExtractor={(item) => item.id}
            // horizontal={true}
            // showsHorizontalScrollIndicator={false}
            numColumns={2}
          />
        </View>

        <View
          style={{
            backgroundColor: constThemeColor.displaybgSecondary,
            padding: Spacing.body,
            borderBottomLeftRadius: Spacing.small,
            borderBottomRightRadius: Spacing.small,
            height: 80,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {screen === "useWeight" ? (
            <>
              <View>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Medium.fontSize,
                    fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                    color: constThemeColor.onSurfaceVariant,
                  }}
                >
                  {latestWeight?.body_weight?.trim() == ""
                    ? "No latest weight Found"
                    : latestWeight?.body_weight}
                  {latestWeight?.body_weight?.trim() == "" ? null : (
                    <Text
                      style={{
                        fontSize: FontSize.Antz_Body_Regular.fontSize,
                        fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                        color: constThemeColor.onSurfaceVariant,
                      }}
                    >
                      {" "}
                      ( {latestWeight?.body_weight_date} )
                    </Text>
                  )}
                </Text>
              </View>
            </>
          ) : screen === "recordWeight" ? (
            <>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TextInput
                  autoCompleteType="off"
                  style={[reduxColors.durationInput, { height: 32, width: 52 }]}
                  defaultValue={recordWeight}
                  onChangeText={(e) => setRecordWeight(e)}
                  placeholder="0"
                  keyboardType="numeric"
                />

                <Dropdown
                  style={{
                    width: 82,
                    height: 32,

                    borderWidth: 1,
                    borderRadius: 4,

                    borderColor: constThemeColor.outlineVariant,
                    backgroundColor: constThemeColor.surface,
                    paddingHorizontal: Spacing.body,
                  }}
                  showsVerticalScrollIndicator={false}
                  itemTextStyle={{
                    fontSize: FontSize.Antz_Body_Title.fontSize,
                  }}
                  containerStyle={{
                    height: 150,
                  }}
                  placeholderStyle={{
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                  }}
                  selectedTextStyle={{
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                  }}
                  data={dataWeight}
                  labelField="uom_abbr"
                  valueField="uom_abbr"
                  placeholder="Unit"
                  value={recordWeightUnit}
                  onChange={(item) => {
                    setRecordWeightUnit(item?.uom_abbr);
                  }}
                  renderRightIcon={() => (
                    <AntDesign
                      name="caretdown"
                      size={12}
                      color={constThemeColor.onSurfaceVariant}
                    />
                  )}
                />
              </View>
            </>
          ) : null}
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
    </>
  );
};

const windowHeight = Dimensions.get("screen").height;
const windowWidth = Dimensions.get("screen").width;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
    },
    searchBox: {
      marginBottom: Spacing.minor,
      marginHorizontal: Spacing.minor,
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
    scrollContainer: {
      paddingHorizontal: Spacing.minor,
    },
    // searchSuggestionTitle: {
    //   color: reduxColors.onSecondaryContainer,
    //   fontSize: FontSize.Antz_Minor_Medium.fontSize,
    //   fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
    //   marginTop: Spacing.minor,
    //   marginBottom: Spacing.mini,
    //   marginLeft: Spacing.micro,
    // },
    suggestionTitle: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginVertical: Spacing.mini,
    },
    // commBtnContainer: { flexDirection: "row", flex: 1, flexWrap: "wrap" },
    labelName: {
      color: Colors.textColor,
      fontSize: FontSize.Antz_Standerd,
    },
    durationInput: {
      width: 84,
      height: 54,
      paddingLeft: Spacing.body,
      paddingVertical: Spacing.mini,
      marginRight: Spacing.body,
      borderRadius: 4,
      backgroundColor: reduxColors.surface,
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
    },
    // recentlyUsedbtnCover: {
    //   width: "auto",
    //   margin: Spacing.mini,
    //   paddingHorizontal: Spacing.small,
    //   paddingVertical: Spacing.mini + Spacing.micro,
    //   height: 32,
    //   borderRadius: Spacing.small,
    //   borderWidth: 1,
    //   color: reduxColors.onPrimaryContainer,
    //   borderColor: reduxColors.outline,
    //   backgroundColor: reduxColors.surface,
    //   justifyContent: "center",
    //   alignItems: "center",
    // },
    // caseTypeBtnTxt: {
    //   fontSize: FontSize.Antz_Body_Medium.fontSize,
    //   fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    //   color: reduxColors.onPrimaryContainer,
    // },
    inputBox: {
      width: "100%",
      height: 50,
      marginBottom: Spacing.body,
      flexDirection: "row",
      alignItems: "center",
    },
    textfield: {
      height: 40,
      fontSize: FontSize.Antz_Strong,
      color: Colors.textColor,
      padding: Spacing.mini,
    },
    // activeSearchSgBtnCover: {
    //   width: "auto",
    //   margin: Spacing.mini,
    //   paddingHorizontal: Spacing.small,
    //   paddingVertical: Spacing.mini + Spacing.micro,
    //   height: 32,
    //   borderRadius: Spacing.small,
    //   borderWidth: 1,
    //   borderColor: reduxColors.outline,
    //   backgroundColor: reduxColors.secondaryContainer,
    //   justifyContent: "center",
    //   alignItems: "center",
    // },
    // searchSuggestionbtnCover: {
    //   width: "auto",
    //   margin: Spacing.mini,
    //   paddingHorizontal: Spacing.small,
    //   paddingVertical: Spacing.mini + Spacing.micro,
    //   height: 32,
    //   borderRadius: Spacing.small,
    //   borderWidth: 1,
    //   borderColor: reduxColors.outline,
    //   backgroundColor: reduxColors.onPrimary,
    //   justifyContent: "center",
    //   alignItems: "center",
    // },
    bottomBtnTxt: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onPrimary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: opacityColor(reduxColors.neutralPrimary, 60),
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalContainer: {
      // backgroundColor: reduxColors.onPrimary,
      // width: "100%",
      // flex: 1,
      // justifyContent: "center",
      // alignItems: "center",
      // borderTopLeftRadius: 16,
      // borderTopRightRadius: 16,
      // marginTop: 100,

      backgroundColor: reduxColors.onPrimary,
      width: "100%",
      flex: 1,
      marginTop: 100,
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: Spacing.minor,
      borderTopRightRadius: Spacing.minor,
    },
    modalHeader: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: Spacing.minor,
      borderBottomWidth: 1,
      borderBottomColor: reduxColors.outlineVariant,
    },
    leftBoxStyle: {
      flex: 1,
    },
    fontStyle: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    description: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      paddingVertical: Spacing.small,
    },
    stockBoxText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    stockValue: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
    },
    commonListStyle: {
      flexDirection: "row",
      flex: 1,
      flexWrap: "wrap",
      alignItems: "center",
    },
    commonSelectStyle: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: Spacing.mini,
    },

    modalBody: {
      flex: 1,
      width: "100%",
      paddingHorizontal: Spacing.minor,
      marginBottom: 80,
    },
    notesBoxCover: {
      height: 50,
      paddingHorizontal: Spacing.small,
      flexDirection: "row",
      backgroundColor: reduxColors.notes,
      borderRadius: Spacing.mini,
      borderColor: Colors.mediumGrey,
      marginTop: Spacing.micro,
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
    },
    notesTextFeild: {
      notesBoxCover: {
        height: 50,
        paddingHorizontal: Spacing.small,
        flexDirection: "row",
        backgroundColor: reduxColors.notes,
        borderRadius: Spacing.mini,
        borderColor: Colors.mediumGrey,
        marginTop: Spacing.micro,
        borderWidth: 1,
        borderColor: reduxColors.outlineVariant,
      },
      notesTextFeild: {
        padding: Spacing.mini,
        color: reduxColors.onErrorContainer,
        fontSize: FontSize.Antz_Minor_Title.fontSize,
      },
      addMedBtn: {
        minWidth: 140,
        height: 40,
        marginBottom: Spacing.major,
        marginTop: Spacing.major,
        borderRadius: 8,
        backgroundColor: reduxColors.primary,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
      },
      padding: Spacing.mini,
      color: reduxColors.onErrorContainer,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
    },
    addMedBtn: {
      minWidth: 140,
      height: 40,
      marginBottom: Spacing.major,
      marginTop: Spacing.major,
      borderRadius: 8,
      backgroundColor: reduxColors.primary,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
    listCard: {
      backgroundColor: reduxColors?.onBackground,
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

    centeredView: {
      alignItems: "center",
      backgroundColor: reduxColors?.lightBlack,
      flex: 1,
    },
    modalView: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: reduxColors.onPrimary,
      width: "100%",
      borderRadius: 8,
      shadowColor: reduxColors.shadow,
      top: 280,
    },
    modalText: {
      fontStyle: "normal",
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      paddingTop: Spacing.small,
      paddingLeft: Spacing.minor,
      color: reduxColors.neutralPrimary,
    },
    inputBoxStyle: {
      width: "100%",
      alignSelf: "center",
      borderWidth: 1,
      borderStyle: "solid",
      borderRadius: 4,
      padding: Spacing.small,
      minHeight: 100,
    },
    btnView: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      width: "100%",
      marginBottom: Spacing.minor,

      paddingRight: Spacing.minor + Spacing.mini,
    },

    skipBtn: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: 90,
      height: 32,
      right: Spacing.body,
      backgroundColor: reduxColors.surfaceVariant,
      borderRadius: 4,
    },
    doneBtn: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      minWidth: 150,
      height: 32,
      backgroundColor: reduxColors.primary,
      borderRadius: 4,
    },
    textStyle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
    },
  });
