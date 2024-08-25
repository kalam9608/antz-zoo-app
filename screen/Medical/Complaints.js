/**
   * Create and modified by - Anirban Pan
      Date - 09.06.23
      Des- All Functionality and design
   */

import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  BackHandler,
} from "react-native";
import Colors from "../../configs/Colors";
import {
  AntDesign,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import Footermedical from "../../components/Footermedical";
import { useDispatch, useSelector } from "react-redux";
import { setMedicalSettings, setcomplaints } from "../../redux/MedicalSlice";
import {
  complaintUpdate,
  createTemplate,
} from "../../services/MedicalsService";
import Loader from "../../components/Loader";
import { opacityColor, severityColor } from "../../utils/Utils";
import VoiceText from "../../components/VoiceText";
import FontSize from "../../configs/FontSize";
// import { successToast, warningDailog, warningToast } from "../../utils/Alert";
import Constants from "../../configs/Constants";
import SaveTemplate, { SaveAsTemplate } from "../../components/SaveTemplate";
import Spacing from "../../configs/Spacing";
import MedicalComplaintsModal from "../../components/MedicalComplaintsModal";
import MedicalRecordSection from "../../components/MedicalRecordSection";
import Header from "../../components/Header";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import moment from "moment";

const Complaints = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const complaintsSelectData = useSelector((state) => state.medical.complaints);
  const [selectedCommonNames, setSelectedCommonNames] = useState([
    ...complaintsSelectData,
  ]);
  const [selectedItem, setSelectedItem] = useState({});
  const [toggleSaveBtn, setToggleBtn] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [toggle, setToggle] = useState(false);
  const [toggleCommNameDropdown, setToogleCommNameDropdown] = useState(false);
  const [selectCommonModalName, setSelectCommonModalName] = useState("");
  const [durationNo, setDurationNo] = useState("");
  const [durationType, setDurationType] = useState("Days");
  const [complaintsData, setcomplaintsData] = useState([]);
  // For Dialouge type modal  =========================
  const [isModalVisible, setModalVisible] = useState(false);
  const [DialougeTitle, setDialougeTitle] = useState("");
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);
  const [selectCommonModalId, setSelectCommonModalId] = useState("");
  const { showToast, errorToast, successToast, warningToast } = useToast();
  const [add, setAdd] = useState(
    props?.route?.params?.medicalRecordId ?? false
  );
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  const confirmButtonPress = () => {
    setSelectedCommonNames([]);
    setModalVisible(false);
  };

  const cancelButtonPress = () => {
    alertModalClose();
  };
  const medicalSettingsData = useSelector(
    (state) => state.medical.medicalSettings
  );
  const [templates, setTemplates] = useState(
    medicalSettingsData.complaintsTemplates ?? []
  );
  // const [mostlyUsedData, setMostlyUsedData] = useState(
  //   medicalSettingsData.mostUsedComplaints ?? []
  // );
  const [recentlyUsedData, setRecentlyUsedData] = useState(
    medicalSettingsData.recentlyUsedComplaints ?? []
  );

  const [isLoading, setisLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCheckBox, setselectedCheckBox] = useState("1");
  const [medicalPrirotyModal, setMedicalPrirotyModal] = useState(false);
  const [medicalDateModal, setMedicalDateModal] = useState(false);
  const [selectedCheckBoxDay, setselectedCheckBoxDay] = useState("1");
  const [mappedTempData, setMappedTempData] = useState([]);
  const [medicalStatusModal, setMedicalStatusModal] = useState(false);
  const [selectedCheckBoxStatus, setselectedCheckBoxStatus] = useState("1");
  const [status, setStatus] = useState("");
  const medicalRecordId = useSelector((state) => state.medical.medicalRecordId);
  const [notesStop, setNotesStop] = useState("");
  const [notesNo, setNotesNo] = useState("");
  // const [selectedComplaints,setSelectedComplaints]=useState([])
  const togglePrintModal = () => {
    setMedicalPrirotyModal(!medicalPrirotyModal);
  };
  const closePrintModal = () => {
    setMedicalPrirotyModal(false);
  };

  const [detailsReport, setDetailsReport] = useState({
    severity: "Mild",
    duration: "",
    notes: "",
    active_at: "",
    status: "active",
    comment_list: [],
  });

  const durationData = [
    { id: 1, name: "Days", value: "Days" },
    { id: 2, name: "Months", value: "Months" },
  ];
  const StatusData = [
    {
      id: 1,
      name: "active",
    },
    {
      id: 2,
      name: "closed",
    },
  ];
  const PrirotyData = [
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
   * Navigation
   */
  const goback = () => {
    dispatch(setcomplaints(selectedCommonNames));
    navigation.navigate("AddMedical");
  };

  const clickFunc = (item) => {
    goback();
    dispatch(setcomplaints(item));
  };

  /**
   * color
   */
  const selectedItemsColor = (item) => {
    let items = selectedCommonNames.find((ite) => ite.id === item.id);
    if (items) {
      return true;
    } else {
      return false;
    }
  };
  const closeStatusModal = () => {
    setMedicalStatusModal(false);
  };
  /**
   * clear data
   */
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

  /**
   * Remove select data
   */
  const handleDeleteName = (name) => {
    setSelectedCommonNames(selectedCommonNames.filter((item) => item !== name));
  };

  /**
   * save temp
   */
  const handleClickSaveTemp = () => {
    setToggleBtn(true);
  };

  /**
   * dropdown toggle
   */
  const handleToggleCommDropdown = (item) => {
    setSelectCommonModalName(item?.name);
    setStatus(item?.additional_info?.status ?? "active");
    let data = selectedCommonNames.find((e) => e.name === item.name);
    if (data) {
      if (data?.additional_info?.active_at) {
        setSelectedCommonNames(selectedCommonNames);
      } else {
        setSelectedCommonNames(
          selectedCommonNames.filter((e) => item.name !== e.name)
        );
      }
      // setSelectedCommonNames(
      //   selectedCommonNames.filter((e) => item.name !== e.name)
      // );
      setSelectCommonModalName("");
    } else {
      setSelectedItem(item);
      setToogleCommNameDropdown(!toggleCommNameDropdown);
      setDetailsReport({
        severity: "Mild",
        duration: "",
        active_at: "",
        notes: "",
        status: "active",
        comment_list: [],
      });
      setselectedCheckBox("1");
      setselectedCheckBoxDay("1");
      setDurationNo("");
      setDurationType("Days");
    }
  };

  const handleClosedNotesInptSelect = (no) => {
    setNotesStop(no);
    // if (notesStop !== "") {
    //   setDetailsReport({ ...detailsReport, stop_note: no });
    // }
  };

  const handleNotesInptSelect = (no) => {
    setNotesNo(no);
    if (notesNo !== "") {
      setDetailsReport({ ...detailsReport, notes: no });
    }
  };

  const handleEditSelected = (item) => {
    setNotesStop("");
    setToogleCommNameDropdown(!toggleCommNameDropdown);
    setSelectCommonModalName(item?.name);
    setDetailsReport(item?.additional_info);
    setSelectCommonModalId(item?.id);
    setSelectedItem(item);
    setStatus(item?.additional_info?.status ?? "active");
    const id = PrirotyData.find(
      (e) => e.name === item?.additional_info?.severity
    )?.id;
    setselectedCheckBox(id);
    const statusId = StatusData.find(
      (e) => e.name === item?.additional_info?.status
    )?.id;
    if (statusId) {
      setselectedCheckBoxStatus(statusId);
    } else {
      setselectedCheckBoxStatus("1");
    }
    let durationDataItem = item?.additional_info?.duration?.split(" ");
    if (durationDataItem) {
      setDurationNo(durationDataItem[0] ? durationDataItem[0] : "");
      setDurationType(durationDataItem[1] ? durationDataItem[1] : "Days");
      const days = durationDataItem[1] ? durationDataItem[1] : "Days";
      const idDay = durationData.find((e) => e.name === days)?.id;
      setselectedCheckBoxDay(idDay.toString());
    } else {
      setDurationNo("");
      setDurationType("Days");
      setselectedCheckBoxDay("1");
      // setselectedCheckBoxDay("1");
      // setDurationNo("");
      // setDurationType("Days");
      // setDetailsReport({
      //   severity: "Mild",
      //   duration: "",
      //   active_at: "",
      //   status: "active",
      //   comment_list: [],
      // });
    }
  };
  const toggleStatusModal = () => {
    setMedicalStatusModal(!medicalStatusModal);
  };

  const compareDataWithTemplate = (array) => {
    let data = [];
    selectedCommonNames.forEach((item) => {
      if (isNaN(Number(item.id))) {
        const nonNumericItem = array.find((e) => e.name === item.name);
        if (nonNumericItem) {
          item.id = nonNumericItem.id;
        }
        data.push(item);
      } else {
        data.push(item);
      }
    });
    setSelectedCommonNames(data);
  };
  const isSelectedIdStatus = (id) => {
    if (selectedCheckBoxStatus == id) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Save as template
   */
  const handleSave = () => {
    // setToggleBtn(false);
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
          type: Constants.MEDICAL_TEMPLATE_TYPE.COMPLAINTS,
          template_items: [],
          template_new_items: [],
        };

        selectedCommonNames.forEach((item) => {
          if (isNaN(Number(item.id))) {
            obj.template_new_items.push(item.name);
          } else {
            obj.template_items.push(item.id);
          }
        });
        createTemplate(obj)
          .then((response) => {
            if (response?.success) {
              successToast("success", response?.message);
              setTemplates(response?.data);
              dispatch(
                setMedicalSettings({
                  ...medicalSettingsData,
                  complaintsTemplates: response?.data,
                })
              );
              setTemplateName("");
              // getTemplateData();
              // fetchData();
              // TODO: Anirban, get the response of the Complaints Template List and set it in Redux
              compareDataWithTemplate(response?.data?.template_items);
            }
          })
          .catch((e) => {
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

  const handleLongPress = (item) => {
    navigation.navigate("EditMedicalTempalte", {
      type: "complaint",
      editTempData: item,
      data: item.template_items,
      typeId: item.id,
      mappedTempData:mappedTempData?.filter((i)=>i?.name!=item?.name),
      onGoBackData: (e) => editSelectData(e),
    });
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
    } else if (priroty == "active") {
      return constThemeColor?.onBackground;
    } else if (priroty == "closed") {
      return constThemeColor?.errorContainer;
    } else {
      return constThemeColor?.secondary;
    }
  }
  const closeMenuStatus = (item) => {
    setselectedCheckBoxStatus(item.id);
    // handleStatusSelect(item.name);
    setStatus(item.name);
    setMedicalStatusModal(!medicalStatusModal);
  };

  const editSelectData = (e) => {
    // setTemplateName(e?.name);

    if (e?.checked) {
      const selectedItems = e?.editTempData?.map((itemData) => ({
        id: itemData?.id,
        name: itemData?.name,
        additional_info: { severity: "Mild", duration: "" },
      }));
      setSelectedCommonNames([...(selectedItems || [])]);
    }
    if (e?.delete) {
      setMappedTempData(mappedTempData?.filter((i) => i.id != e?.typeId) ?? []);
      dispatch(
        setMedicalSettings({
          ...medicalSettingsData,
          complaintsTemplates:
          medicalSettingsData.complaintsTemplates?.filter((i) => i.id != e?.typeId),
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
      setMappedTempData(mappedTempData ?? []);
    }
  };
  /**
   * Merge template data to selection data
   */
  // const handleSelectFromTemplate = (item) => {
  //   // if (item.name == templateName) {
  //   //   setTemplateName("")
  //   // }
  //   setTemplateName(item?.name);
  //   // if (item.name != templateName) {
  //   // const uniqueItems = item?.template_items?.filter((itemData) => {
  //   //   return !selectedCommonNames?.some(
  //   //     (selectedItem) => selectedItem?.id === itemData?.id
  //   //   );
  //   // });
  //   const existData = selectedCommonNames?.filter(
  //     (p) => p?.additional_info?.active_at
  //   );

  //   const selectedItems = item?.template_items?.map((itemData) => ({
  //     id: itemData?.id,
  //     name: itemData?.name,
  //     additional_info: { severity: "Mild", duration: "" },
  //   }));

  //   setSelectedCommonNames([...([...existData, ...selectedItems] || [])]);
  //   // }else{
  //   //   setTemplateName("")
  //   // }
  // };
  const handleSelectFromTemplate = (item) => {
    if (!add) {
      setTemplateName(item?.name);
      const itemsWithActiveAt = selectedCommonNames?.filter(
        (item) =>
          item?.additional_info?.active_at != null &&
          item?.additional_info?.active_at != ""
      );

      setStatus("active");

      const selectedItems = item?.template_items?.map((itemData) => ({
        id: itemData?.id,
        name: itemData?.name,
        additional_info: {
          severity: "Mild",
          duration: "",
          notes: "",
          active_at: "",
          status: "active",
          comment_list: [],
        },
      }));

      // if (selectedItems1.length > 0) {
      //   setSelectedCommonNames([...selectedItems1, ...selectedItems]);
      // } else {
      setSelectedCommonNames(selectedItems);
      // }
    } else {
      setTemplateName(item?.name);
      const itemsWithActiveAt = selectedCommonNames?.filter(
        (item) =>
          item?.additional_info?.active_at != null &&
          item?.additional_info?.active_at != ""
      );

      const selectedItems1 = itemsWithActiveAt?.map((itemData) => ({
        id: itemData?.id,
        name: itemData?.name,
        medical_complaint_id: itemData?.medical_complaint_id,
        additional_info: {
          severity: itemData?.additional_info?.severity,
          notes: itemData?.additional_info?.notes,
          active_at: itemData?.additional_info?.active_at,
          status: itemData?.additional_info?.status,
          duration: itemData?.additional_info?.duration,
          comment_list: itemData?.additional_info?.comment_list,
        },
      }));
      // if (item?.name !== templateName) {
      const uniqueItems = item?.template_items?.filter((itemData) => {
        return !selectedItems1?.some(
          (selectedItem) => selectedItem?.id === itemData?.id
        );
      });
      setStatus("active");

      const selectedItems = uniqueItems?.map((itemData) => ({
        id: itemData?.id,
        name: itemData?.name,
        additional_info: {
          severity: "Mild",
          notes: "",
          active_at: "",
          duration: "",
          status: "active",
          comment_list: [],
        },
      }));
      if (selectedItems1.length > 0) {
        setSelectedCommonNames([...selectedItems1, ...selectedItems]);
      } else {
        setSelectedCommonNames(selectedItems);
      }
    }

    // }
  };
  // };
  /**
   * Toggle for side effect
   */
  useEffect(() => {}, [toggle, selectedCommonNames]);

  /**
   * Additional info save to state
   */
  const handleSeveritySelect = (name) => {
    setDetailsReport({ ...detailsReport, severity: name });
  };
  const handleDurationSelect = (type) => {
    setDurationType(type);
    if (parseFloat(durationNo) > 0) {
      setDetailsReport({
        ...detailsReport,
        duration: `${durationNo} ${type}`,
      });
    } else {
      setDurationNo("");
    }
  };

  const handleDurationInptSelect = (no) => {
    if (parseFloat(no) > 0) {
      setDurationNo(no);
      setDetailsReport({
        ...detailsReport,
        duration: `${no} ${durationType}`,
      });
    } else {
      setDurationNo("");
    }
  };
  /**
   * Additional info add
   */
  const handleDetailsSubmit = (name) => {
    const index = selectedCommonNames.findIndex((item) => item.name === name);
    if (index === -1) {
      setSelectedCommonNames([
        ...selectedCommonNames,
        {
          ...("id" && { ["id"]: selectedItem.id }),
          ...("name" && { ["name"]: selectedItem.name }),
          ...("additional_info" && { ["additional_info"]: detailsReport }),
        },
      ]);
    } else {
      setSelectedCommonNames([
        ...selectedCommonNames.slice(0, index),
        {
          ...selectedCommonNames[index],
          ["id"]: selectedCommonNames[index].id,
          ["name"]: selectedCommonNames[index].name,
          ["additional_info"]: detailsReport,
        },
        ...selectedCommonNames.slice(index + 1),
      ]);
    }
    setToogleCommNameDropdown(false);
  };

  /**
   * Search data combined to main screen data
   */
  const searchSelectData = (data) => {
    const newSelectedCommonNames = data.reduce(
      (accumulator, currentItem) => {
        const isPresent = accumulator.find(
          (item) => item.name === currentItem.name
        );
        return isPresent ? accumulator : [...accumulator, currentItem];
      },
      [...selectedCommonNames]
    );

    setSelectedCommonNames(newSelectedCommonNames);

    setToggle((prevToggle) => !prevToggle);
  };

  /**
   * Navigations
   */
  const navigateNextScreen = () => {
    dispatch(setcomplaints(selectedCommonNames));
    navigation.navigate("Diagnosis", {
      medicalRecordId: props?.route?.params?.medicalRecordId ?? false,
    });
  };
  const navigatePreviousScreen = () => {
    dispatch(setcomplaints(selectedCommonNames));
    navigation.navigate("CaseType");
  };

  // Search
  const onVoiceInput = (text) => {
    setSearchText(text);
  };
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const userPermissions = useSelector((state) => state.UserAuth.permission);
  const closeTempSave = () => {
    setToggleBtn(false);
    setTemplateName("");
  };

  const isSelectedId = (id) => {
    if (selectedCheckBox == id) {
      return true;
    } else {
      return false;
    }
  };

  const closeMenu = (item) => {
    if (isSelectedId(item.id)) {
    } else {
      setselectedCheckBox([item.id]);
    }
    handleSeveritySelect(item.name);
    setMedicalPrirotyModal(!medicalPrirotyModal);
  };

  // that function used for days and month modal

  const isSelectedIdDay = (id) => {
    if (selectedCheckBoxDay == id) {
      return true;
    } else {
      return false;
    }
  };

  const toggleDateModal = () => {
    setMedicalDateModal(!medicalDateModal);
  };
  const closeDateModal = () => {
    setMedicalDateModal(false);
  };
  const closeMenuDate = (item) => {
    setselectedCheckBoxDay(item?.id);
    handleDurationSelect(item?.value);
    setMedicalDateModal(!medicalDateModal);
  };
  useEffect(() => {
    let mappedTempData = templates.map((item) => ({
      id: item.id,
      name: item.template_name,
      template_items: item.template_items,
    }));
    setMappedTempData(mappedTempData);
  }, [templates]);
  const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  /* Complaints update function */
  const updateComplaints = (id, status, name) => {
    setToogleCommNameDropdown(!toggleCommNameDropdown);
    const obj = {
      medical_record_id: medicalRecordId,
      complaint_type: id,
      status: status,
      note: notesStop,
    };
    setisLoading(true);
    complaintUpdate(obj)
      .then((response) => {
        if (response?.success) {
          const index = selectedCommonNames.findIndex(
            (item) => item.id === id.toString()
          );
          const indexRedux = complaintsSelectData.findIndex(
            (item) => item.id === id.toString()
          );
          if (index != -1) {
            setSelectedCommonNames([
              ...selectedCommonNames?.slice(0, index),
              {
                ...selectedCommonNames[index],
                ["id"]: selectedCommonNames[index].id,
                ["name"]: selectedCommonNames[index].name,
                ["additional_info"]: {
                  ...detailsReport,
                  status: status,
                  closed_at: status == "closed" ? currentDate : "",
                  // active_at:
                  //   status == "active" ? currentDate : detailsReport?.active_at,
                  stop_note: status == "closed" ? notesStop : "",
                  start_note: status == "active" ? notesStop : "",
                  comment_list: [
                    {
                      note: notesStop,
                      status: status,
                      created_at: currentDate,
                    },
                    ...detailsReport?.comment_list,
                  ],
                },
              },
              ...selectedCommonNames?.slice(index + 1),
            ]);
            setDetailsReport({
              ...detailsReport,
              comment_list: [
                {
                  note: notesStop,
                  status: status,
                  created_at: currentDate,
                },
                ...detailsReport?.comment_list,
              ],
            });
          }
          if (indexRedux != -1) {
            dispatch(
              setcomplaints([
                ...complaintsSelectData.slice(0, index),
                {
                  ...complaintsSelectData[index],
                  ["id"]: complaintsSelectData[index].id,
                  ["name"]: complaintsSelectData[index].name,
                  ["additional_info"]: {
                    ...detailsReport,
                    status: status,
                    closed_at: status == "closed" ? currentDate : "",
                    // active_at:
                    //   status == "active"
                    //     ? currentDate
                    //     : detailsReport?.active_at,
                    stop_note: status == "closed" ? notesStop : "",
                    start_note: status == "active" ? notesStop : "",
                    comment_list: [
                      {
                        note: notesStop,
                        status: status,
                        created_at: currentDate,
                      },
                      ...detailsReport?.comment_list,
                    ],
                  },
                },
                ...complaintsSelectData.slice(index + 1),
              ])
            );
          }
          setisLoading(false);
          // setToogleCommNameDropdown(!toggleCommNameDropdown);
          successToast("Success", response?.message);
        }
      })
      .catch((e) => {
        console.log({ error: e });
        // setToogleCommNameDropdown(!toggleCommNameDropdown);
        setisLoading(false);
        errorToast("error", e?.message);
      });
  };
  console.log({ selectedCommonNames });
  return (
    <>
      {/* <MedicalHeader title="Complaints" noIcon={true} /> */}
      <Header
        title={"Complaints"}
        headerTitle={reduxColors.headerTitle}
        noIcon={true}
        search={false}
        hideMenu={true}
        backgroundColor={constThemeColor?.onPrimary}
        customBack={() => navigation.navigate("AddMedical")}
      />
      <Loader visible={isLoading} />
      <View style={[reduxColors.container]}>
        {/* Search  */}
        <TouchableOpacity
          activeOpacity={0.5}
          style={[reduxColors.searchBox]}
          onPress={() => {
            navigation.navigate("CommonSearch", {
              name: Constants.MEDICAL_TEMPLATE_TYPE.COMPLAINTS,
              listData: complaintsData,
              selected: selectedCommonNames,
              add_permission: userPermissions["medical_add_complaints"],
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
              Search Complaints
            </Text>
          </View>
          {/* <Searchbar
            accessible={true}
            accessibilityLabel={"searchComplaints"}
            AccessibilityId={"searchComplaints"}
            autoCompleteType="off"
            placeholder="Search Complaints"
            placeholderTextColor={constThemeColor.onSurfaceVariant}
            style={[reduxColors.histopathologySearchField]}
            inputStyle={reduxColors.input}
            editable={false}
            // onFocus={() =>
            //   navigation.navigate("CommonSearch", {
            //     name: Constants.MEDICAL_TEMPLATE_TYPE.COMPLAINTS,
            //     listData: complaintsData,
            //     selected: selectedCommonNames,
            //     add_permission: userPermissions["medical_add_complaints"],
            //     onGoBack: (e) => searchSelectData(e),
            //   })
            // }
            value={searchText}
            // right={() => <VoiceText resultValue={onVoiceInput} />}
          /> */}
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[reduxColors.scrollContainer]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Common Name List */}
          {selectedCommonNames.length > 0 ? (
            <View
              style={{
                backgroundColor: constThemeColor.surface,
                borderRadius: Spacing.small,
                borderWidth: 1,
                borderColor: constThemeColor?.outlineVariant,
              }}
            >
              {selectedCommonNames.map((item, index) => {
                return (
                  <View key={item.id}>
                    <TouchableOpacity
                      style={[reduxColors.commonNameList]}
                      onPress={() => handleEditSelected(item)}
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
                        <Text
                          style={[
                            reduxColors.selectedName,
                            {
                              textDecorationLine:
                                item?.additional_info?.status == "closed"
                                  ? "line-through"
                                  : "none",
                            },
                          ]}
                        >
                          {item.name}
                        </Text>
                        {item?.additional_info?.active_at ? null : (
                          <View>
                            <Ionicons
                              name="close-outline"
                              size={24}
                              color={constThemeColor.onSurface}
                              onPress={() => handleDeleteName(item)}
                            />
                          </View>
                        )}
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
                            <Text style={[reduxColors.detailsReportTitle]}>
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
                              size={20}
                              color={constThemeColor.onSurfaceVariant}
                            />
                            <Text style={[reduxColors.detailsReportTitle]}>
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
                    </TouchableOpacity>
                    {selectedCommonNames.length - 1 === index ? null : (
                      <View
                        style={{
                          borderBottomColor: constThemeColor?.outline,
                          borderBottomWidth: 0.5,
                        }}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          ) : null}

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
                <MedicalRecordSection
                  data={mappedTempData}
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

            {/* Recently Used Button */}
            {recentlyUsedData?.length > 0 ? (
              <>
                <MedicalRecordSection
                  data={recentlyUsedData}
                  title={"Recently used"}
                  selectedItemsColor={selectedItemsColor}
                  handleToggle={handleToggleCommDropdown}
                />
              </>
            ) : null}
            {/* Common Button */}
            {/* {mostlyUsedData?.length > 0 ? (
              <>
                <MedicalRecordSection
                  data={mostlyUsedData}
                  title={"Most Used"}
                  selectedItemsColor={selectedItemsColor}
                  handleToggle={handleToggleCommDropdown}
                />
              </>
            ) : null} */}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={{ width: "100%" }}>
          <Footermedical
            ShowIonicons={true}
            ShowRighticon={true}
            firstlabel={"Case Type"}
            lastlabel={"Diagnosis"}
            navigateNextScreen={navigateNextScreen}
            navigatePreviousScreen={navigatePreviousScreen}
            onPress={() => {
              clickFunc(selectedCommonNames);
            }}
          />
        </View>

        {/* Modal Dropdown */}
        {toggleCommNameDropdown ? (
          <MedicalComplaintsModal
            selectCommonModalName={selectCommonModalName}
            handleToggleCommDropdown={handleToggleCommDropdown}
            detailsReport={detailsReport}
            togglePrintModal={togglePrintModal}
            durationNo={durationNo}
            handleDurationInptSelect={handleDurationInptSelect}
            durationType={durationType}
            toggleDateModal={toggleDateModal}
            medicalPrirotyModal={medicalPrirotyModal}
            medicalDateModal={medicalDateModal}
            closePrintModal={closePrintModal}
            PrirotyData={PrirotyData}
            closeMenu={closeMenu}
            isSelectedId={isSelectedId}
            closeDateModal={closeDateModal}
            durationData={durationData}
            closeMenuDate={closeMenuDate}
            isSelectedIdDay={isSelectedIdDay}
            toggleStatusModal={toggleStatusModal}
            backgroundSideColor={backgroundSideColor}
            StatusData={StatusData}
            closeStatusModal={closeStatusModal}
            closeMenuStatus={closeMenuStatus}
            status={status}
            handleClosedNotesInptSelect={handleClosedNotesInptSelect}
            isSelectedIdStatus={isSelectedIdStatus}
            handleNotesInptSelect={handleNotesInptSelect}
            medicalStatusModal={medicalStatusModal}
            selectCommonModalId={selectCommonModalId}
            handleDetailsSubmit={handleDetailsSubmit}
            updateComplaints={updateComplaints}
            notesStop={notesStop}
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
export default Complaints;

const windowHeight = Dimensions.get("screen").height;
const windowWidth = Dimensions.get("screen").width;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
      width: "100%",
    },
    searchBox: {
      marginBottom: Spacing.body,
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
    commonNameList: {
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.small,
    },
    selectedName: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.neutralPrimary,
    },
    caseReportDetails: {
      flexDirection: "row",
      marginVertical: Spacing.small,
    },
    caseReportItem: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "25%",
      justifyContent: "flex-start",
      alignItems: "center",
      marginRight: Spacing.body,
    },
    detailsReportTitle: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginLeft: Spacing.small,
    },
    scrollContainer: {
      paddingHorizontal: Spacing.minor,
    },
    saveTemp: {
      fontSize: FontSize.Antz_Standerd,
      textAlign: "center",
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      marginLeft: Spacing.mini,
      color: reduxColors.onSurface,
    },
    ClearSelect: {
      fontSize: FontSize.Antz_Standerd,
      textAlign: "center",
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onSurface,
    },
    searchSuggestionTitle: {
      color: reduxColors.onSecondaryContainer,
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      marginTop: Spacing.minor,
      marginBottom: Spacing.mini,
      marginLeft: Spacing.micro,
    },
    durationInput: {
      flex: 1,
      height: 56,
      paddingLeft: Spacing.body,
      paddingRight: Spacing.small,
      paddingVertical: Spacing.mini,
      marginRight: Spacing.body,
      borderRadius: Spacing.mini,
      backgroundColor: reduxColors.surface,
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      borderWidth: 1,
      borderColor: reduxColors.outline,
    },
    dropdown: {
      flex: 1,
      height: 56,
      borderWidth: 1,
      borderRadius: Spacing.mini,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.surface,
      paddingHorizontal: Spacing.minor,
    },
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
      backgroundColor: reduxColors.onPrimary,
      height: 230,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: Spacing.minor,
      borderTopRightRadius: Spacing.minor,
    },
    modalHeader: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: Spacing.minor,
    },
    closeBtn: {
      alignItems: "center",
      justifyContent: "center",
    },

    modalBody: {
      flex: 1,
      width: "100%",
      paddingHorizontal: Spacing.minor,
    },

    modalBtnCover: {
      marginTop: Spacing.minor,
      marginBottom: Spacing.major,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: Spacing.small,
      width: 100,
      height: 40,
      backgroundColor: reduxColors.primary,
    },
    severity: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    popUpStyle: {
      padding: Spacing.minor,
      borderRadius: Spacing.mini,
    },
    commonSelectStyle: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: Spacing.mini,
    },
    suggestionTitle: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      color: reduxColors.onSurfaceVariant,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      marginVertical: Spacing.mini,
    },
  });
