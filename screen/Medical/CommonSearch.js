import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  StatusBar,
} from "react-native";
import Colors from "../../configs/Colors";
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CheckBox from "../../components/CheckBox";
import chronic from "../../assets/Chronic.svg";
import { ActivityIndicator, Searchbar } from "react-native-paper";
import MedicalSearchFooter from "../../components/MedicalSearchFooter";
import { useDispatch, useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import PrescriptionMedicineCard from "../../components/PrescriptionMedicineCard";
import { TabView, TabBar } from "react-native-tab-view";
import Constants from "../../configs/Constants";
import Spacing from "../../configs/Spacing";
import MedicalComplaintsModal from "../../components/MedicalComplaintsModal";
import MedicalDiagnosisModal from "../../components/MedicalDiagnosisModal";
import MedicalPrescriptionModal from "../../components/MedicalPrescriptionModal";
import {
  getComplaintsDiagnosisList,
  getDurationUnit,
  getFrequencyUnit,
  getMedicines,
  listAnimalComplaints,
  listAnimalDiagnosis,
} from "../../services/MedicalsService";
import Loader from "../../components/Loader";
import { getMeasurmentUnit } from "../../services/AnimalService";
import {
  setPrescriptionSearch,
  setPrescriptionSearchPage,
} from "../../redux/MedicalSlice";
import ListEmpty from "../../components/ListEmpty";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import CommonSearchItem from "../../components/medical/CommonSearchItem";

const CommonSearch = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const prescriptionSearchData = useSelector(
    (state) => state.medical.prescriptionSearch
  );
  const prescriptionSearchPageNo = useSelector(
    (state) => state.medical.prescriptionSearchPage
  );
  const [selectedCheckedBox, setSelectedCheckBox] = useState(
    props.route.params?.selected?.map((item) => item.id) ?? []
  );
  const [preSelectedIds] = useState(
    props.route.params?.selected?.map((item) => item.id) ?? []
  );

  const [quantity, Setquantity] = useState(1);
  const [dosagePerWeight, setDosagePerWeight] = useState(0);
  const [dosagePerWeightUnit, setDosagePerWeightUnit] = useState("");
  const [dosage, setDosage] = useState(0);
  const [seletectedItemAdverse, setseletectedItemAdverse] = useState();
  const [recordWeight, setRecordWeight] = useState(
    bodyWeightRedux?.split(" ")[0] ?? ""
  );
  const [recordWeightUnit, setRecordWeightUnit] = useState(
    bodyWeightRedux?.split(" ")[1] ?? "kg"
  );
  const [giveUnit, setGiveUnit] = useState(props.route.params?.giveUnit ?? "");
  const [frequencyValue, setFrequencyValue] = useState(0);
  const [frequencyUnit, setFrequencyUnit] = useState(
    props.route.params?.frequencyUnit ?? ""
  );
  const [frequencyUnitLabel, setFrequencyUnitLabel] = useState(
    props.route.params?.frequencyUnitLabel ?? ""
  );

  const [notes, setNotes] = useState("");
  const [route, setRoute] = useState(props.route.params?.route ?? "");
  const [routeLabel, setRouteLabel] = useState(
    props.route.params?.routeLabel ?? ""
  );
  const [routeId, setRouteId] = useState(props.route.params?.routeId ?? "");
  const [isLoading, setisLoading] = useState(false);
  const [selectActionCheck, setSelectActionCheck] = useState(true);
  const [durationType, setDurationType] = useState("");
  const [durationTypePres, setDurationTypePres] = useState(
    props.route.params?.durationType ?? ""
  );
  const [durationTypeLabel, setDurationTypeLabel] = useState(
    props.route.params?.durationTypeLabel ?? ""
  );
  const [durationNo, setDurationNo] = useState("");
  const [selectCount, setSelectCount] = useState(0);
  const [toggleSelectedList, setToggleSelectedList] = useState(false);
  const [selectedItems, setSelectedItems] = useState(
    props.route.params?.selected ?? []
  );
  const [selectedNewItems, setSelectedNewItems] = useState([]);
  const [medicalDateModal, setMedicalDateModal] = useState(false);
  const [togglePrescriptionModal, setTogglePrescriptionModal] = useState(false);
  const [searchInput, setSearchInput] = useState(
    props.route.params?.itemName ? props.route.params?.itemName : ""
  );
  const [selectedCheckBoxDay, setselectedCheckBoxDay] = useState("1");
  const [toggleDiagnosisModal, setToggleDiagnosisModal] = useState(false);
  const [toggleComplaintsModal, setToggleComplaintsModal] = useState(false);
  const [selectItem, setSelectItem] = useState({});
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [selectItemName, setSelectItemName] = useState("");
  const [data, setData] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [dataLengthTotal, setDataLengthTotal] = useState(0);
  const [isErrorDosage, setIsErrorDosage] = useState("");
  const [isErrorFreq, setIsErrorFreq] = useState("");
  const [isErrorDuration, setIsErrorDuration] = useState("");
  const [isErrorQyt, setIsErrorQyt] = useState("");
  const [medicineData, setMedicineData] = useState([]);
  const [medicineDataLength, setMedicineDataLength] = useState(0);
  const [medicineDataLengthTotal, setMedicineDataLengthTotal] = useState(0);

  // For Dialouge type modal  =========================
  const [isModalVisible, setModalVisible] = useState(false);
  const [DialougeTitle, setDialougeTitle] = useState("");
  // const { showToast, errorToast, successToast, warningToast } = useToast();
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };
  const confirmButtonPress = () => {
    setModalVisible(false);
    handleToggleCommModal(seletectedItemAdverse);
  };

  const cancelButtonPress = () => {
    alertModalClose();
  };
  const [index, setIndex] = React.useState(0);
  const [detailsReportComplaints, setDetailsReportCompaints] = useState({
    severity: "Mild",
    duration: "",
    notes: "",
    active_at: "",
    status: "active",
    comment_list: [],
  });
  const [dataWeight, setDataWeight] = useState(
    props.route.params?.dataWeight ?? []
  );
  const [dosagePerWeightdata, setDosagePerWeightdata] = useState(
    props.route.params?.dosagePerWeightdata ?? []
  );
  const [dosageData, setDosageData] = useState(
    props.route.params?.dosageData ?? []
  );
  // useEffect(() => {

  // }, [index]);
  const indexChangeFun = (indexCount) => {
    setIndex(indexCount);
    if (
      searchInput?.length >= 2 &&
      props.route.params?.name == Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION
    ) {
      setisLoading(true);
      getMedicineList(1, searchInput);
    } else if (
      props.route.params?.name == Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION
    ) {
      prescriptionFun();
    }
  };

  const [frequencyData, setFrequencyData] = useState(
    props.route.params?.frequencyData ?? []
  );

  const [durationData, setDurationData] = useState(
    props.route.params?.durationData ?? []
  );

  const [routeData, setRouteData] = useState(
    props.route.params?.routeData ?? []
  );
  const [selectCommonModalName, setSelectCommonModalName] = useState("");

  const [medicalPrirotyModal, setMedicalPrirotyModal] = useState(false);
  const [firstCalled, setfirstCalled] = useState(false);
  const togglePrintModal = () => {
    setMedicalPrirotyModal(!medicalPrirotyModal);
  };
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});

  const [searchData, setsearchData] = useState(
    props.route.params?.listData ?? []
  );
  const [latestWeight, setLatestWeight] = useState(
    props.route.params?.latestWeight ?? ""
  );
  const [filterData, setfilterData] = useState(
    props.route.params?.listData ?? []
  );
  const [filteredData, setFilteredData] = useState([]);
  const [filterDataLength, setFilterDataLength] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState(false);
  const [selectedCheckBox, setselectedCheckBox] = useState("1");
  const [status, setStatus] = useState("active");
  const [notesNo, setNotesNo] = useState("");
  const [diagnosisAdditionalInfo, setDiagnosisAdditionalInfo] = useState({
    severity: "Mild",
    notes: "",
    chronic: false,
    status: "active",
  });
  const [detailsReport, setDetailsReport] = useState({
    dosage_per_weight: "",
    duration: "",
    when: "",
    dosage: "",
    quantity: "",
    notes: "",
    delivery_route_name: "",
    will_restart: true,
  });
  const SevertyData = [
    {
      id: 1,
      name: "Mild",
    },
    {
      id: 2,
      name: "Moderate",
    },
    {
      id: 3,
      name: "High",
    },
    {
      id: 4,
      name: "Extreme",
    },
  ];

  const SelectedAnimalRedux = useSelector((state) => state.medical.animal);
  const SelectedEnclosureRedux = useSelector(
    (state) => state.medical.enclosure
  );
  const SelectedSectionRedux = useSelector((state) => state.medical.section);
  const bodyWeightRedux = useSelector((state) => state.medical.bodyWeight);
  const toggleDateModal = () => {
    setMedicalDateModal(!medicalDateModal);
  };
  const showDurationField =
    durationData?.find((p) => p.key == durationType)?.show_duration_field == "0"
      ? false
      : true;

  const showFrequencyField =
    frequencyData?.find((p) => p.key == frequencyUnit)?.show_freq_field == "0"
      ? false
      : true;
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setisLoading(true);
      setPage(1);
      setfirstCalled(true);
      if (
        props.route.params?.name ===
        Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION
      ) {
        prescriptionFun();
      } else if (
        props.route.params?.name === Constants.MEDICAL_TEMPLATE_TYPE.COMPLAINTS
      ) {
        getComplaintsList(1);
      } else if (
        props.route.params?.name === Constants.MEDICAL_TEMPLATE_TYPE.DIAGNOSIS
      ) {
        getDiagnosisList(1);
      } else {
        setisLoading(false);
      }
    });

    return unsubscribe;
  }, [navigation]);
  const prescriptionFun = () => {
    if (Object.keys(prescriptionSearchData)?.length == 0) {
      setisLoading(true);
      getMedicineList(1, "");
    } else {
      setData(prescriptionSearchData?.brand_name);
      setMedicineData(prescriptionSearchData?.generic_name);
      setMedicineDataLength(prescriptionSearchData?.generic_count);
      setDataLength(prescriptionSearchData?.brand_count);
      setMedicineDataLengthTotal(prescriptionSearchData?.generic_name?.length);
      setDataLengthTotal(prescriptionSearchData?.brand_name?.length);
      setPage(prescriptionSearchPageNo);
      setisLoading(false);
    }
  };
  const getComplaintsList = (pageNo) => {
    let obj = {
      searchterm: searchInput.length >= 2 ? searchInput : "",
      page_no: pageNo,
      type: "complaints",
    };

    getComplaintsDiagnosisList(obj)
      .then((response) => {
        setisLoading(false);
        if (response.success) {
          let dataArr = pageNo == 1 ? [] : filterData;
          setTotalCount(
            response.data.count === undefined ? 0 : response.data.count
          );
          dataArr = response.data;
          setsearchData(dataArr);
          setfilterData(dataArr);
          setFilterDataLength(dataArr.length);
          setisLoading(false);
        } else {
          setFilterDataLength(totalCount);
        }
      })
      .catch((e) => {
        setisLoading(false);
      });
  };

  const getDiagnosisList = (pageNo) => {
    let obj = {
      searchterm: searchInput.length >= 2 ? searchInput : "",
      page_no: pageNo,
      type: "diagnosis",
    };

    getComplaintsDiagnosisList(obj)
      .then((response) => {
        setisLoading(false);

        if (response.success) {
          let dataArr = pageNo == 1 ? [] : filterData;
          setTotalCount(
            response.data.count === undefined ? 0 : response.data.count
          );
          dataArr = response.data;
          setsearchData(dataArr);
          setfilterData(dataArr);
          setFilterDataLength(dataArr.length);
          setisLoading(false);
        } else {
          setFilterDataLength(totalCount);
        }
      })
      .catch((e) => {
        setisLoading(false);
      });
  };
  const getMedicineList = (count, searchText) => {
    const obj = {
      q: searchText,
      page_no: count,
    };

    setPage(count);
    if (searchText?.length > 0) {
      obj.type = index == 0 ? "brand_name" : "generic_name";
    }
    getMedicines(obj)
      .then((response) => {
        // if (searchText.length >= 3) {
        //   setMedicineDataLength(0);
        //   setData(response?.data?.brand_name?.result);
        //   setMedicineData(response?.data?.generic_name?.result);
        //   setMedicineDataLength(response.data?.generic_name?.count);
        //   setDataLength(response.data?.brand_name?.count);
        //   setMedicineDataLengthTotal(dataArr2?.length);
        //   setDataLengthTotal(dataArr?.length);
        //   if (searchInput?.length == 0) {
        //     dispatch(
        //       setPrescriptionSearch({
        //         brand_name: response?.data?.brand_name?.result,
        //         generic_name: response?.data?.generic_name?.result,
        //         brand_count: response?.data?.brand_name?.count ?? 0,
        //         generic_count: response?.data?.generic_name?.count ?? 0,
        //       })
        //     );
        //   }
        // } else {

        if (response?.data) {
          let dataArr = count == 1 ? [] : data;
          let dataArr2 = count == 1 ? [] : medicineData;
          setMedicineDataLength(response.data?.generic_name?.count ?? 0);
          setDataLength(response.data?.brand_name?.count ?? 0);
          setMedicineDataLengthTotal(
            dataArr2.concat(response?.data?.generic_name?.result ?? [])
              ?.length ?? 0
          );
          setDataLengthTotal(
            dataArr.concat(response?.data?.brand_name?.result ?? [])?.length ??
              0
          );
          if (
            response.data?.brand_name?.result ||
            response?.data?.generic_name?.result
          ) {
            setData(dataArr.concat(response?.data?.brand_name?.result ?? []));
            setMedicineData(
              dataArr2.concat(response?.data?.generic_name?.result ?? [])
            );
            if (searchInput?.length == 0) {
              dispatch(
                setPrescriptionSearch({
                  brand_name: dataArr.concat(
                    response?.data?.brand_name?.result
                  ),
                  generic_name: dataArr2.concat(
                    response?.data?.generic_name?.result
                  ),
                  brand_count: response?.data?.brand_name?.count ?? 0,
                  generic_count: response?.data?.generic_name?.count ?? 0,
                })
              );
            }
            if (
              response.data?.brand_name?.result?.length > 0 ||
              response?.data?.generic_name?.result?.length > 0
            ) {
              dispatch(setPrescriptionSearchPage(count));
            }
          }
        }

        setisLoading(false);
      })
      .catch((e) => {
        setisLoading(false);
      });
  };

  /**
   * Select item
   */
  const selectAction = (e) => {
    if (
      props.route.params?.name === Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION
    ) {
      if (selectedCheckedBox.includes(e.id)) {
        setSelectedCheckBox(selectedCheckedBox.filter((v) => e.id !== v));
        setSelectedItems(selectedItems.filter((v) => e.name !== v.name));
        setSelectItem({});
        setSelectCommonModalName("");
        setSelectCount(selectCount === 0 ? 0 : selectCount - 1);
      } else if (props.route.params?.forEdittemp) {
        setSelectedCheckBox([...selectedCheckedBox, e?.id]);
        setSelectedItems([
          ...selectedItems,
          {
            ...("id" && { ["id"]: e.id }),
            ...("name" && { ["name"]: e.name }),
          },
        ]);
        setSelectedNewItems([
          ...selectedNewItems,
          {
            ...("id" && { ["id"]: e.id }),
            ...("name" && { ["name"]: e.name }),
          },
        ]);
        setSelectCount(selectCount + 1);
        setDurationType("");
        setTogglePrescriptionModal(false);
        clearState();
      }
    }

    if (
      props.route.params?.name === Constants.MEDICAL_TEMPLATE_TYPE.DIAGNOSIS
    ) {
      setSelectedCheckBox([...selectedCheckedBox, e.id]);
      if (props.route.params?.forEdittemp) {
        setSelectedItems([
          ...selectedItems,
          {
            ...("id" && { ["id"]: e.id }),
            ...("name" && { ["name"]: e.name }),
          },
        ]);
      } else {
        setSelectedItems([
          ...selectedItems,
          {
            ...("id" && { ["id"]: e.id }),
            ...("name" && { ["name"]: e.name }),
            ...("additional_info" && {
              ["additional_info"]: diagnosisAdditionalInfo,
            }),
          },
        ]);
      }

      setSelectCount(selectCount + 1);
    }
    if (
      props.route.params?.name === Constants.MEDICAL_TEMPLATE_TYPE.COMPLAINTS
    ) {
      if (props.route.params?.forEdittemp) {
        setSelectedCheckBox([...selectedCheckedBox, e.id]);
        setSelectedItems([
          ...selectedItems,
          {
            ...("id" && { ["id"]: e.id }),
            ...("name" && { ["name"]: e.name }),
          },
        ]);
        setSelectCount(selectCount + 1);
        setselectedCheckBoxDay("1");
      } else {
        setSelectedCheckBox([...selectedCheckedBox, e.id]);
        setSelectedItems([
          ...selectedItems,
          {
            ...("id" && { ["id"]: e.id }),
            ...("name" && { ["name"]: e.name }),
            ...("additional_info" && {
              ["additional_info"]: detailsReportComplaints,
            }),
          },
        ]);
        setSelectCount(selectCount + 1);
        setselectedCheckBoxDay("1");
      }
    }

    if (
      props.route.params?.name === Constants.MEDICAL_TEMPLATE_TYPE.DIAGNOSIS
    ) {
      setToggleDiagnosisModal(false);
    }
    if (
      props.route.params?.name === Constants.MEDICAL_TEMPLATE_TYPE.COMPLAINTS
    ) {
      setToggleComplaintsModal(false);
    }
    if (props.route.params?.name === Constants.MEDICAL_TEMPLATE_TYPE.ADVICE) {
      setSelectedCheckBox([...selectedCheckedBox, e.id]);
      setSelectedItems([
        ...selectedItems,
        {
          ...("id" && { ["id"]: e.id }),
          ...("name" && { ["name"]: e.name }),
        },
      ]);
      setSelectCount(selectCount + 1);
      setselectedCheckBoxDay("1");
    }
  };
  const closeDateModal = () => {
    setMedicalDateModal(false);
  };
  const isSelectedIdDay = (id) => {
    if (selectedCheckBoxDay == id) {
      return true;
    } else {
      return false;
    }
  };
  const closeMenuDate = (item) => {
    setselectedCheckBoxDay(item?.id);
    handleDurationSelect(item);
    setMedicalDateModal(!medicalDateModal);
  };
  const clearState = () => {
    setDosagePerWeight();
    setDosagePerWeightUnit("");
    setGiveUnit(props.route.params?.giveUnit ?? "");
    setDosage("");
    setFrequencyValue("");
    setFrequencyUnit(props.route.params?.frequencyUnit ?? "");
    setFrequencyUnitLabel(props.route.params?.frequencyUnitLabel ?? "");
    setRoute(props.route.params?.route ?? "");
    setRouteLabel(props.route.params?.routeLabel ?? "");
    setRouteId(props.route.params?.routeId ?? "");
    Setquantity(0);
    setDurationNo(0);
    setDurationTypePres(props.route.params?.durationType ?? "");
    setDurationTypeLabel(props.route.params?.durationTypeLabel ?? "");
    setNotes("");
    setErrorMessage({});
    setIsError({});
    setIsErrorDosage("");
    setIsErrorDuration("");
    setIsErrorFreq("");
    setIsErrorQyt("");
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

  const savePrescrition = () => {
    if (Validation()) {
      setSelectedCheckBox([...selectedCheckedBox, selectItemName?.id]);
      setSelectedItems([
        ...selectedItems,
        {
          ...("id" && { ["id"]: selectItemName.id }),
          ...("name" && { ["name"]: selectItemName.name }),
          ...("additional_info" && {
            ["additional_info"]: detailsReport,
          }),
        },
      ]);
      setSelectedNewItems([
        ...selectedNewItems,
        {
          ...("id" && { ["id"]: selectItemName.id }),
          ...("name" && { ["name"]: selectItemName.name }),
          ...("additional_info" && {
            ["additional_info"]: detailsReport,
          }),
        },
      ]);
      setSelectCount(selectCount + 1);
      setDurationType("");
      setTogglePrescriptionModal(false);
      clearState();
    }
  };
  const closeMenu = (item) => {
    if (isSelectedId(item.id)) {
      // setselectedCheckBox(selectedCheckBox.filter((item) => item !== item.id));
      isSelectedIdModal(item.id);
    } else {
      setselectedCheckBox([item.id]);
    }
    handleSeveritySelect(item.name);
    setMedicalPrirotyModal(!medicalPrirotyModal);
  };
  const isSelectedId = (id) => {
    return selectedCheckBox.includes(id);
  };

  const isSelectedIdModal = (id) => {
    if (selectedCheckBox == id) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Modal
   */
  const handleToggleCommModal = (item) => {
    setSelectItem(item);
    setSelectCommonModalName(item.name);
    if (selectedCheckedBox.includes(item.id)) {
      setSelectedCheckBox(selectedCheckedBox.filter((e) => item.id !== e));
      setSelectedItems(selectedItems.filter((e) => item.name !== e.name));
      setSelectItem({});
      setSelectCommonModalName("");
      setSelectCount(selectCount === 0 ? 0 : selectCount - 1);
    } else {
      if (
        props.route.params?.name === Constants.MEDICAL_TEMPLATE_TYPE.DIAGNOSIS
      ) {
        if (props.route.params?.forEdittemp) {
          selectAction(item);
        } else {
          setselectedCheckBox([1]);
          setIsSwitchOn(false);
          setToggleDiagnosisModal(!toggleDiagnosisModal);
          setDiagnosisAdditionalInfo({
            severity: "Mild",
            notes: "",
            chronic: false,
            status: "active",
          });
        }
      }
      if (
        props.route.params?.name === Constants.MEDICAL_TEMPLATE_TYPE.COMPLAINTS
      ) {
        if (props.route.params?.forEdittemp) {
          selectAction(item);
        } else {
          setToggleComplaintsModal(!toggleComplaintsModal);
          setDetailsReportCompaints({
            severity: "Mild",
            duration: "",
            notes: "",
            active_at: "",
            status: "active",
            comment_list: [],
          });
          setDurationNo("");
          setDurationType("Days");
        }
      }
      if (
        props.route.params?.name ===
        Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION
      ) {
        if (props.route.params?.forEdittemp) {
          selectAction(item);
        } else {
          clearState();
          setSelectItemName(item);
          setTogglePrescriptionModal(true);
          setDetailsReport({
            dosage_per_weight: "",
            duration: "",
            when: "",
            dosage: "",
            quantity: "",
            notes: "",
            delivery_route_name: "",
            will_restart: true,
          });
        }
      }
    }
  };
  const closePrintModal = () => {
    setMedicalPrirotyModal(false);
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

  /**
   * Filter data
   */
  //prescription search
  useEffect(() => {
    if (
      props.route.params?.name ==
        Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION &&
      firstCalled
    ) {
      if (searchInput.length >= 2) {
        const getData = setTimeout(() => {
          setisLoading(true);
          getMedicineList(1, searchInput);
        }, 1000);
        return () => clearTimeout(getData);
      } else if (searchInput.length == 0) {
        setisLoading(true);
        setSearchInput("");
        getMedicineList(1, "");
      }
    }

    if (searchInput.length >= 2 || searchInput.length == 0) {
      setfilterData(props.route.params?.listData ?? []);
      setPage(1);

      if (
        props.route.params?.name === Constants.MEDICAL_TEMPLATE_TYPE.DIAGNOSIS
      ) {
        const getData = setTimeout(() => {
          setisLoading(true);
          getDiagnosisList(1);
        }, 1000);
        return () => clearTimeout(getData);
      } else if (
        props.route.params?.name === Constants.MEDICAL_TEMPLATE_TYPE.COMPLAINTS
      ) {
        const getData = setTimeout(() => {
          setisLoading(true);
          getComplaintsList(1);
        }, 1000);
        return () => clearTimeout(getData);
      } else if (
        props.route.params?.name === Constants.MEDICAL_TEMPLATE_TYPE.ADVICE
      ) {
        const getData = setTimeout(() => {
          if (searchInput?.length >= 2) {
            setisLoading(true);
            const filteredItems = searchData?.filter((item) =>
              item?.name?.toLowerCase()?.includes(searchInput?.toLowerCase())
            );
            setFilteredData(filteredItems);
          } else {
            setFilteredData([]);
          }
          setisLoading(false);
        }, 1000);

        return () => clearTimeout(getData);
      }
    }
  }, [searchInput]);

  const searchFilterData = (text) => {
    setSearchInput(text);
  };

  /**
   * Add new item
   */
  const addNewItem = () => {
    let obj = [
      {
        id: searchInput,
        name: searchInput,
      },
    ];
    let arr = searchData;
    let newArr = arr.concat(obj);
    setsearchData(newArr);
    searchFilterData(searchInput, newArr);
  };

  /**
   * Modal data to state
   */
  const handleSeveritySelect = (name) => {
    if (Constants.MEDICAL_TEMPLATE_TYPE.DIAGNOSIS == props.route.params?.name) {
      setDiagnosisAdditionalInfo({
        ...diagnosisAdditionalInfo,
        severity: name,
      });
    } else {
      setDetailsReportCompaints({ ...detailsReportComplaints, severity: name });
    }
  };
  const handleNotesInptSelect = (no) => {
    setDiagnosisAdditionalInfo({ ...diagnosisAdditionalInfo, notes: no });
  };

  const onToggleSwitch = (e) => {
    setIsSwitchOn(e);
    setDiagnosisAdditionalInfo({
      ...diagnosisAdditionalInfo,
      chronic: e,
    });
  };

  const back = () => {
    console.log({ss:JSON.stringify(selectedItems)})
    if (
      props.route.params?.name == Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION
    ) {
      if (props.route.params?.forEdittemp) {
        props.route.params?.onGoBack(selectedItems), props.navigation.goBack();
      } else {
        props.route.params?.onGoBack(selectedNewItems),
          props.navigation.goBack();
      }
    } else {
      props.route.params?.onGoBack(selectedItems), props.navigation.goBack();
    }
  };

  /**
   * Clear search
   */
  const clearSearch = () => {
    setisLoading(true);
    setfilterData(props.route.params?.listData ?? []);
    setPage(1);
    setSearchInput("");
    if (
      props.route.params?.name == Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION
    ) {
      // getMedicineList("", 1,index);
    }
  };

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  // data fill prescription

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
    setDetailsReport({
      ...detailsReport,
      when: `${showFrequencyField ? frequencyValue : 0} ${item.key}`,
    });
    if (!showFrequencyField) {
      setFrequencyValue(0);
    }
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

  const handleDurationSelect = (item) => {
    if (
      Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION == props.route.params?.name
    ) {
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
    } else {
      setDurationType(item?.value);
      if (parseFloat(durationNo) > 0) {
        setDetailsReportCompaints({
          ...detailsReportComplaints,
          duration: `${durationNo} ${item.value}`,
        });
      } else {
        setDurationNo("");
      }
    }
  };
  const handleDurationInptSelect = (no) => {
    if (
      Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION == props.route.params?.name
    ) {
      setDurationNo(no);
      setDetailsReport({
        ...detailsReport,
        duration: `${no} ${durationTypePres}`,
      });
    } else {
      if (parseFloat(no) > 0) {
        setDurationNo(no);
        setDetailsReportCompaints({
          ...detailsReportComplaints,
          duration: `${no} ${durationType}`,
        });
      } else {
        setDurationNo("");
      }
    }
  };

  // tab view code

  const durationDataComplaint = [
    { id: 1, name: "Days", value: "Days" },
    { id: 2, name: "Months", value: "Months" },
  ];

  const handleToggleCommDropdown = (item) => {
    setTogglePrescriptionModal(false);
    if (togglePrescriptionModal) {
      setDetailsReport({
        dosage_per_weight: "",
        duration: "",
        when: "",
        quantity: "",
        notes: "",
        delivery_route_name: "",
        will_restart: true,
      });
    }
  };
  const RenderScene = ({ route }) => {
    switch (route.key) {
      case "brandName":
        return (
          <View
            style={{
              paddingHorizontal: Spacing.minor,
            }}
          >
            <FlatList
              showsVerticalScrollIndicator={false}
              data={data}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={<ListEmpty visible={isLoading} />}
              renderItem={({ item, index }) => {
                return (
                  <PrescriptionMedicineCard
                    item={item}
                    index={index}
                    selectedCheckedBox={selectedCheckedBox}
                    selectAction={() => {
                      const checkSideEffect =
                        props.route.params?.sideEffectsList?.find(
                          (p) => p?.medicine_id == item.id
                        );
                      if (checkSideEffect?.medicine_id) {
                        setDialougeTitle(
                          "Caused adverse side effects, Do you want to add?"
                        );
                        alertModalOpen();
                        setseletectedItemAdverse(item);
                      } else {
                        handleToggleCommModal(item);
                      }
                    }}
                    preSelectedIds={preSelectedIds}
                  />
                );
              }}
              onEndReached={handleLoadMoreMedicineData}
              onEndReachedThreshold={0.4}
              ListFooterComponent={renderMedicineFooter}
            />
          </View>
        );
      case "genericName":
        return (
          <View
            style={{
              paddingHorizontal: Spacing.minor,
            }}
          >
            <FlatList
              showsVerticalScrollIndicator={false}
              data={medicineData}
              ListEmptyComponent={<ListEmpty visible={isLoading} />}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                return (
                  <PrescriptionMedicineCard
                    item={item}
                    index={index}
                    selectedCheckedBox={selectedCheckedBox}
                    selectAction={() => {
                      const checkSideEffect =
                        props.route.params?.sideEffectsList?.find(
                          (p) => p?.medicine_id == item.id
                        );
                      if (checkSideEffect?.medicine_id) {
                        setDialougeTitle(
                          "Caused adverse side effects, Do you want to add?"
                        );
                        alertModalOpen();
                        setseletectedItemAdverse(item);
                      } else {
                        handleToggleCommModal(item);
                      }
                    }}
                    // selectAction={ handleToggleCommModal}
                    preSelectedIds={preSelectedIds}
                  />
                );
              }}
              onEndReached={handleLoadMoreMedicineDataGeneric}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderMedicineFooterGeneric}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const [routes] = React.useState([
    { key: "brandName", title: "By Brand Name" },
    { key: "genericName", title: "By Generic Name" },
  ]);

  useEffect(() => {
    setselectedCheckBoxUnit(
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

  const [medicalUnitModal, setMedicalUnitModal] = useState(false);
  const [selectedCheckBoxUnit, setselectedCheckBoxUnit] = useState(null);

  const isSelectedIdUnit = (id) => {
    if (selectedCheckBoxUnit == id) {
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
    handleGiveSelectUnit(item.name);
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

  const renderFooter = () => {
    if (isLoading || filterDataLength <= 20 || filterDataLength == totalCount) {
      return null;
    }
    return <ActivityIndicator style={{ color: Colors.primary }} />;
  };

  const renderMedicineFooter = () => {
    if (
      isLoading ||
      (index == 0 && dataLength <= 10) ||
      (index == 0 && dataLength == dataLengthTotal)
    )
      return null;
    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };
  const renderMedicineFooterGeneric = () => {
    if (
      isLoading ||
      (index == 1 && medicineDataLength <= 10) ||
      (index == 1 && medicineDataLength == medicineDataLengthTotal)
    )
      return null;
    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };

  const handleLoadMoreMedicineData = () => {
    if (
      !isLoading &&
      index == 0 &&
      dataLength > 0 &&
      index == 0 &&
      dataLength != dataLengthTotal &&
      index == 0
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      getMedicineList(nextPage, searchInput);
    }
  };
  const handleLoadMoreMedicineDataGeneric = () => {
    if (
      !isLoading &&
      index == 1 &&
      medicineDataLength > 0 &&
      index == 1 &&
      medicineDataLength != medicineDataLengthTotal &&
      index == 1
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      getMedicineList(nextPage, searchInput);
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && filterDataLength > 0 && filterDataLength != totalCount) {
      const nextPage = page + 1;
      setPage(nextPage);

      if (
        props.route.params?.name == Constants.MEDICAL_TEMPLATE_TYPE.COMPLAINTS
      ) {
        getComplaintsList(nextPage);
      } else if (
        props.route.params?.name == Constants.MEDICAL_TEMPLATE_TYPE.DIAGNOSIS
      ) {
        getDiagnosisList(nextPage);
      }
    }
  };

  const handleNotesInptCompSelect = (no) => {
    setNotesNo(no);
    if (notesNo !== "") {
      setDetailsReportCompaints({ ...detailsReportComplaints, notes: no });
    }
  };

  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={constThemeColor.onPrimary}
      />
      <Loader visible={isLoading} />
      <View style={reduxColors.container}>
        <Searchbar
          accessible={true}
          accessibilityLabel={"commonSearchBar"}
          AccessibilityId={"commonSearchBar"}
          placeholder={`Search ${props.route.params?.name}`}
          placeholderTextColor={Colors.mediumGrey}
          defaultValue={props.route.params?.itemName}
          onChangeText={searchFilterData}
          value={searchInput}
          inputStyle={reduxColors.input}
          autoFocus={false}
          style={[
            reduxColors.Searchbar,
            { backgroundColor: constThemeColor.onPrimary },
          ]}
          // autoFocus={false}
          icon={({ size, color }) => (
            <Ionicons
              name="arrow-back"
              size={24}
              color
              style={{
                color: constThemeColor.onSecondaryContainer,
              }}
              onPress={() => props.navigation.goBack()}
            />
          )}
          right={() => (
            <>
              <View style={{ paddingRight: 10 }}>
                {searchInput ? (
                  <View>
                    <Entypo
                      name="cross"
                      size={30}
                      color={Colors.mediumGrey}
                      onPress={clearSearch}
                    />
                  </View>
                ) : (
                  <></>
                )}
              </View>
            </>
          )}
        />

        {/* {props.route.params?.name !==
          Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION &&
        props.route.params?.add_permission &&
        props.route.params?.name !== Constants.MEDICAL_TEMPLATE_TYPE.ADVICE ? (
          <View
            style={[
              reduxColors.inputTextAddField,
              { display: searchInput === "" ? "none" : "flex" },
            ]}
          >
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                color: constThemeColor.onSurfaceVariant,
                flex: 1,
                marginRight: Spacing.small,
              }}
            >
              Add & Select:{" "}
              <Text
                style={{
                  fontSize: FontSize.Antz_Minor_Title.fontSize,
                  fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                  color: constThemeColor.onSurfaceVariant,
                }}
              >
                {searchInput}
              </Text>
            </Text>
            <Ionicons
              name="add-outline"
              size={24}
              onPress={addNewItem}
              color={Colors.mediumGrey}
            />
          </View>
        ) : !filterData.length > 0 ? (
          <View
            style={[
              reduxColors.inputTextAddField,
              {
                display:
                  searchInput === "" ||
                  props.route.params?.name ==
                    Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION
                    ? "none"
                    : "flex",
                justifyContent: "center",
              },
            ]}
          >
            <Text
              style={{
                fontSize: FontSize.Antz_Minor_Title.fontSize,
                fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                color: constThemeColor.onSurfaceVariant,
                textAlign: "center",
              }}
            >
              No data found
            </Text>
          </View>
        ) : null} */}

        {/*
         * Common component select for medical complaints and diagnosis
         */}
        {/* <CommonSearchItem
          routeName={props.route.params?.name}
          selectAction={selectAction}
          handleToggleCommModal={handleToggleCommModal}
          preSelectedIds={preSelectedIds}
          selectedCheckedBox={selectedCheckedBox}
        /> */}
        {/* Search List */}
        {props.route.params?.name !==
        Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filteredData?.length > 0 ? filteredData : filterData}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 85 }}
            renderItem={({ item, index }) => {
              if (
                props.route.params?.name ===
                Constants.MEDICAL_TEMPLATE_TYPE.ADVICE
              ) {
                return (
                  <TouchableOpacity
                    accessible={true}
                    accessibilityLabel={"commonSearchItems"}
                    AccessibilityId={"commonSearchItems"}
                    key={index}
                    onPress={() => {
                      if (
                        props.route.params?.name ===
                        Constants.MEDICAL_TEMPLATE_TYPE.ADVICE
                      ) {
                        selectAction(item);
                      }
                      handleToggleCommModal(item);
                    }}
                    disabled={preSelectedIds.includes(item.id) ? true : false}
                    style={[
                      reduxColors.searchItemList,
                      {
                        backgroundColor: preSelectedIds.includes(item.id)
                          ? constThemeColor.surface
                          : constThemeColor.onPrimary,
                      },
                    ]}
                  >
                    <Text
                      numberOfLines={5}
                      ellipsizeMode="tail"
                      style={[reduxColors.searchItemName]}
                    >
                      {item.name}
                    </Text>
                    <CheckBox
                      accessible={true}
                      accessibilityLabel={"commonSearchItemCB"}
                      AccessibilityId={"commonSearchItemCB"}
                      key={item.id}
                      activeOpacity={1}
                      iconSize={24}
                      disabled={preSelectedIds.includes(item.id) ? true : false}
                      checked={selectedCheckedBox.includes(item.id)}
                      checkedColor={constThemeColor.primary}
                      uncheckedColor={constThemeColor.outline}
                      labelStyle={[reduxColors.labelName, reduxColors.mb0]}
                    />
                  </TouchableOpacity>
                );
              } else {
                return (
                  <CommonSearchItem
                  searchInput={searchInput}
                    data={item}
                    routeName={props.route.params?.name}
                    selectAction={selectAction}
                    handleToggleCommModal={handleToggleCommModal}
                    preSelectedIds={preSelectedIds}
                    selectedCheckedBox={selectedCheckedBox}
                  />
                );
              }
            }}
            style={{ marginVertical: Spacing.body }}
            onEndReachedThreshold={0.1}
            onEndReached={handleLoadMore}
            ListFooterComponent={renderFooter}
          />
        ) : (
          <View style={[reduxColors.PrescriptionStyle]}>
            <TabView
              accessible={true}
              accessibilityLabel={"commonSearchTab"}
              AccessibilityId={"commonSearchItemTab"}
              navigationState={{ index, routes }}
              renderScene={RenderScene}
              onIndexChange={indexChangeFun}
              renderTabBar={(props) => (
                <TabBar
                  {...props}
                  style={{
                    backgroundColor: constThemeColor.onPrimary,
                    color: constThemeColor.onSurfaceVariant,
                    marginBottom: Spacing.small,
                  }}
                  labelStyle={{
                    textAlign: "center",
                    fontSize: FontSize.Antz_Body_Medium.fontSize,
                    fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                    color: constThemeColor.onSurfaceVariant,
                  }}
                  indicatorStyle={{
                    backgroundColor: constThemeColor.primary,
                    height: 4,
                    borderTopLeftRadius: Spacing.mini,
                    borderTopRightRadius: Spacing.mini,
                    width: "40%",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: Spacing.minor,
                  }}
                  activeColor={constThemeColor.onSurface}
                />
              )}
            />
          </View>
        )}
        {/* </ScrollView> */}

        {/* Footer */}

        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
          }}
        >
          <MedicalSearchFooter
            title={
              props.route.params?.name?.charAt(0).toUpperCase() +
              props.route.params?.name?.slice(1)
            }
            singular={props.route.params?.singular}
            selectCount={
              props.route.params?.name ===
              Constants.MEDICAL_TEMPLATE_TYPE.DIAGNOSIS
                ? selectedItems?.filter(
                    (p) => p.additional_info?.status != "closed"
                  )?.length
                : props.route.params?.name ==
                  Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION
                ? selectedItems?.filter((p) => !p.additional_info?.stop_date)
                    ?.length
                : selectedItems?.length
            }
            toggleSelectedList={toggleSelectedList}
            onPress={back}
            selectedItems={
              props.route.params?.name ===
              Constants.MEDICAL_TEMPLATE_TYPE.DIAGNOSIS
                ? selectedItems?.filter(
                    (p) => p.additional_info?.status != "closed"
                  )
                : props.route.params?.name ==
                  Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION
                ? selectedItems?.filter((p) => !p.additional_info?.stop_date)
                : selectedItems
            }
          />
        </View>

        {/* Modal Dropdown */}
        {toggleDiagnosisModal ? (
          <MedicalDiagnosisModal
            selectCommonModalName={selectCommonModalName}
            handleToggleCommDropdown={() => setToggleDiagnosisModal(false)}
            chronic={chronic}
            detailsReport={diagnosisAdditionalInfo}
            onToggleSwitch={onToggleSwitch}
            togglePrintModal={togglePrintModal}
            backgroundSideColor={backgroundSideColor}
            handleNotesInptSelect={handleNotesInptSelect}
            handleDetailsSubmit={() => selectAction(selectItem)}
            medicalPrirotyModal={medicalPrirotyModal}
            closePrintModal={closePrintModal}
            PrirotyData={SevertyData}
            closeMenu={closeMenu}
            isSelectedId={isSelectedId}
            isSwitchOn={isSwitchOn}
            status={status}
          />
        ) : null}
        {toggleComplaintsModal ? (
          <MedicalComplaintsModal
            selectCommonModalName={selectCommonModalName}
            handleToggleCommDropdown={() => setToggleComplaintsModal(false)}
            detailsReport={detailsReportComplaints}
            togglePrintModal={togglePrintModal}
            durationNo={durationNo}
            handleDurationInptSelect={handleDurationInptSelect}
            durationType={durationType}
            toggleDateModal={toggleDateModal}
            medicalPrirotyModal={medicalPrirotyModal}
            medicalDateModal={medicalDateModal}
            closePrintModal={closePrintModal}
            PrirotyData={SevertyData}
            closeMenu={closeMenu}
            isSelectedId={isSelectedIdModal}
            closeDateModal={closeDateModal}
            durationData={durationDataComplaint}
            closeMenuDate={closeMenuDate}
            isSelectedIdDay={isSelectedIdDay}
            backgroundSideColor={backgroundSideColor}
            handleNotesInptSelect={handleNotesInptCompSelect}
            status={status}
            handleDetailsSubmit={() => selectAction(selectItem)}
          />
        ) : null}
        {/* {medicalPrirotyModal ? (
          <ModalFilterComponent
            onPress={togglePrintModal}
            onDismiss={closePrintModal}
            onBackdropPress={closePrintModal}
            onRequestClose={closePrintModal}
            data={SevertyData}
            closeModal={closeMenu}
            style={{ alignItems: "flex-start" }}
            isSelectedId={isSelectedId}
            radioButton={false}
            checkIcon={true}
          />
        ) : null} */}

        {togglePrescriptionModal ? (
          <MedicalPrescriptionModal
            selectItemName={selectItemName}
            handleToggleCommDropdown={handleToggleCommDropdown}
            SelectedAnimalRedux={SelectedAnimalRedux}
            SelectedEnclosureRedux={SelectedEnclosureRedux}
            SelectedSectionRedux={SelectedSectionRedux}
            selectAction={selectActionCheck}
            setSelectAction={setSelectActionCheck}
            recordWeight={recordWeight}
            dataWeight={dataWeight}
            setRecordWeight={setRecordWeight}
            setRecordWeightUnit={setRecordWeightUnit}
            recordWeightUnit={recordWeightUnit}
            dosagePerWeight={dosagePerWeight}
            handleDosagePerWeightSelect={handleDosagePerWeightSelect}
            dosagePerWeightUnit={dosagePerWeightUnit}
            handleDosagePerWeightUnitSelect={handleDosagePerWeightUnitSelect}
            give={dosage}
            handleGiveSelect={handleGiveSelect}
            dosagePerWeightdata={dosagePerWeightdata}
            dosageData={dosageData}
            giveUnit={giveUnit}
            handleGiveSelectUnit={handleGiveSelectUnit}
            // isError={isError}
            // errorMessage={errorMessage}
            isErrorDosage={isErrorDosage}
            isErrorDuration={isErrorDuration}
            isErrorQyt={isErrorQyt}
            isErrorFreq={isErrorFreq}
            frequencyValue={frequencyValue}
            handleWhenSelect={handleWhenSelect}
            frequencyData={frequencyData}
            frequencyUnit={frequencyUnit}
            handleWhenSelectUnit={handleWhenSelectUnit}
            durationNo={durationNo}
            durationData={durationData}
            durationType={durationTypePres}
            handleDurationInptSelect={handleDurationInptSelect}
            handleDurationSelect={handleDurationSelect}
            quantity={quantity}
            handleQuantitySelect={handleQuantitySelect}
            routeData={routeData}
            latestWeight={latestWeight}
            route={route}
            handleDilevery={handleDilevery}
            showFrequencyField={showFrequencyField}
            notes={notes}
            showDurationField={showDurationField}
            handleNote={handleNote}
            handleDetailsSubmit={savePrescrition}
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
            frequencyUnitLabel={frequencyUnitLabel}
            durationTypeLabel={durationTypeLabel}
            routeLabel={routeLabel}
          />
        ) : null}
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
    </>
  );
};
export default CommonSearch;

const windowHeight = Dimensions.get("screen").height;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: reduxColors.surfaceVariant,
    },
    Searchbar: {
      borderRadius: 0,
      borderBottomWidth: 1,
      borderColor: Colors.lightGrey,
      width: "100%",
    },
    inputTextAddField: {
      height: 50,
      marginHorizontal: Spacing.minor,
      borderRadius: Spacing.mini,
      paddingLeft: Spacing.body,
      paddingRight: Spacing.minor,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: reduxColors.onPrimary,
      marginTop: Spacing.minor,
    },
    searchItemList: {
      borderRadius: Spacing.mini,
      marginHorizontal: Spacing.minor,
      marginVertical: Spacing.mini,
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.small,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    PrescriptionStyle: {
      flex: 1,
      borderTopWidth: 1,
      borderColor: reduxColors.surfaceVariant,
      width: "100%",
      marginBottom: 85,
    },
    labelName: {
      color: Colors.textColor,
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
    },
    searchItemName: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
      flex: 1,
      marginRight: Spacing.small,
    },
  });
