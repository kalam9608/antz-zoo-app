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
  Modal,
  TouchableWithoutFeedback,
  Button,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveDiagnosisEdit,
  setMedicalSettings,
  setdiagnosis,
} from "../../redux/MedicalSlice";
import {
  checkDiagonosisByAnimals,
  createTemplate,
  diagnosisUpdate,
} from "../../services/MedicalsService";
import Loader from "../../components/Loader";
import { Divider, Searchbar } from "react-native-paper";
import VoiceText from "../../components/VoiceText";
import Footermedical from "../../components/Footermedical";
import { opacityColor } from "../../utils/Utils";
import FontSize from "../../configs/FontSize";
// import { successToast, warningDailog, warningToast } from "../../utils/Alert";
import Spacing from "../../configs/Spacing";
import chronic from "../../assets/Chronic.svg";
import Chronic_white from "../../assets/Chronic_white.svg";
import { SvgXml } from "react-native-svg";
import Constants from "../../configs/Constants";
import SaveTemplate, { SaveAsTemplate } from "../../components/SaveTemplate";
import MedicalDiagnosisModal from "../../components/MedicalDiagnosisModal";
import MedicalRecordSection from "../../components/MedicalRecordSection";
import Header from "../../components/Header";
import moment from "moment";
import DiagnosisItem from "../../components/DiagnosisItem";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import AnimalCustomCard from "../../components/AnimalCustomCard";
const Diagnosis = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const diagnosisSelectData = useSelector((state) => state.medical.diagnosis);
  const medicalRecordId = useSelector((state) => state.medical.medicalRecordId);
  const activeDiagnosisEdit = useSelector(
    (state) => state.medical.activeDiagnosisEdit
  );
  const SelectedAnimalRedux = useSelector((state) => state.medical.animal);
  const [selectedCommonNames, setSelectedCommonNames] = useState([
    ...diagnosisSelectData,
  ]);
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
    setSelectedCommonNames([]);
    setModalVisible(false);
  };

  const cancelButtonPress = () => {
    alertModalClose();
  };
  const [toggleSaveBtn, setToggleBtn] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [toggle, setToggle] = useState(false);
  const [toggleCommNameDropdown, setToogleCommNameDropdown] = useState(false);
  const [selectCommonModalName, setSelectCommonModalName] = useState("");
  const [selectCommonModalId, setSelectCommonModalId] = useState("");
  const [notesNo, setNotesNo] = useState("");
  const [notesStop, setNotesStop] = useState("");
  const [diagnosisData, setdiagnosisData] = useState([]);
  const [status, setStatus] = useState("");
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);
  const [existingModal, setExistingModal] = useState(false);
  const medicalSettingsData = useSelector(
    (state) => state.medical.medicalSettings
  );
  const [templates, setTemplates] = useState(
    medicalSettingsData.diagnosisTemplates ?? []
  );
  // const [mostlyUsedData, setMostlyUsedData] = useState(
  //   medicalSettingsData.mostUsedDiagnosis ?? []
  // );
  const [recentlyUsedData, setRecentlyUsedData] = useState(
    medicalSettingsData.recentlyUsedDiagnosis ?? []
  );
  const [add, setAdd] = useState(
    props?.route?.params?.medicalRecordId ?? false
  );
  const [dataAppear, setData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [existingDiagonosis, setExistingDiagonosis] = useState([]);
  const [detailsReport, setDetailsReport] = useState({
    severity: "",
    notes: "",
    stop_note: "",
    chronic: false,
    active_at: "",
    comment_list: [],
    // status:'active'
  });
  const [selectedCheckBox, setselectedCheckBox] = useState("1");
  const [selectedCheckBoxStatus, setselectedCheckBoxStatus] = useState("1");
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [mappedTempData, setMappedTempData] = useState([]);
  const onToggleSwitch = (e) => {
    setIsSwitchOn(e);
    setDetailsReport({
      ...detailsReport,
      chronic: e,
    });
  };
  const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  useEffect(() => {
    if (activeDiagnosisEdit) {
      setTimeout(() => {
        handleEditSelected(activeDiagnosisEdit);
      }, 1000);
    }
    setTimeout(() => {
      dispatch(setActiveDiagnosisEdit(null));
    }, 1000);
  }, []);

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
   * Navigations
   */
  const goback = () => {
    dispatch(setdiagnosis(selectedCommonNames));
    navigation.navigate("AddMedical");
  };

  const clickFunc = (item) => {
    goback();
    dispatch(setdiagnosis(item));
  };

  /**
   * Color
   */
  const selectedItemsColor = (item) => {
    let items = selectedCommonNames.find((ite) => ite.id === item.id);
    if (items) {
      return true;
    } else {
      return false;
    }
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
   * Remove item
   */
  const handleDeleteName = (name) => {
    setSelectedCommonNames(selectedCommonNames.filter((item) => item !== name));
  };

  /**
   * Temp save button toggle
   */
  const handleClickSaveTemp = () => {
    setToggleBtn(true);
  };

  /**
   * Dropdown toggle with data
   */
  const handleToggleCommDropdown = (item) => {
    setData(item);
    setSelectCommonModalName(item?.name);
    setStatus("active");
    let data = selectedCommonNames.find((e) => e.name === item.name);
    if (data) {
      if (data?.additional_info?.active_at) {
        setSelectedCommonNames(selectedCommonNames);
      } else {
        setSelectedCommonNames(
          selectedCommonNames.filter((e) => item.name !== e.name)
        );
      }

      setSelectCommonModalName("");
    } else {
      setIsSwitchOn(false);
      setToogleCommNameDropdown(!toggleCommNameDropdown);
      setDetailsReport({
        severity: "Mild",
        notes: "",
        stop_note: "",
        chronic: false,
        status: "active",
        active_at: "",
        comment_list: [],
      });
      setselectedCheckBox("1");
    }
  };
  /* Diagonosis update function */
  const updateDiagnosis = (id, status, name) => {
    setToogleCommNameDropdown(!toggleCommNameDropdown);
    const obj = {
      medical_record_id: medicalRecordId,
      diagnosis_type: id,
      status: status,
      note: notesStop,
    };
    setisLoading(true);
    diagnosisUpdate(obj)
      .then((response) => {
        if (response?.success) {
          const index = selectedCommonNames.findIndex(
            (item) => item.id === id.toString()
          );
          const indexRedux = diagnosisSelectData.findIndex(
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
              setdiagnosis([
                ...diagnosisSelectData.slice(0, index),
                {
                  ...diagnosisSelectData[index],
                  ["id"]: diagnosisSelectData[index].id,
                  ["name"]: diagnosisSelectData[index].name,
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
                ...diagnosisSelectData.slice(index + 1),
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
  const handleEditSelected = (item) => {
    setNotesStop("");
    setStatus(item?.additional_info?.status ?? "active");
    setToogleCommNameDropdown(!toggleCommNameDropdown);
    setSelectCommonModalName(item?.name);
    setSelectCommonModalId(item?.id);
    setDetailsReport({
      ...item?.additional_info,
      comment_list: item?.additional_info?.comment_list ?? [],
    });
    setData(item);
    const id = PrirotyData.find(
      (e) => e.name === item?.additional_info?.severity
    )?.id;
    if (id) {
      setselectedCheckBox(id);
    } else {
      setselectedCheckBox("1");
    }

    const statusId = StatusData.find(
      (e) => e.name === item?.additional_info?.status
    )?.id;
    if (statusId) {
      setselectedCheckBoxStatus(statusId);
    } else {
      setselectedCheckBoxStatus("1");
    }
  };
  // console.log({ selectedCommonNames });

  // check diagnosis status by animals ids

  const checkDiagnosisStatus = (type) => {
    // if (type == "done") {
    //   clickFunc(selectedCommonNames);
    // } else if (type == "next") {
    //   navigateNextScreen();
    // } else if (type == "prev") {
    //   navigatePreviousScreen();
    // }
    setisLoading(true);
    const obj = {
      animal_id: JSON.stringify(
        SelectedAnimalRedux?.map((item) => item?.animal_id)
      ),
      diagnosis_type_id: JSON.stringify(
        selectedCommonNames
          ?.filter((item) => !item?.additional_info?.active_at)
          ?.map((item) => item?.id)
      ),
    };
    // setisLoading(true)
    checkDiagonosisByAnimals(obj)
      .then((res) => {
        // setisLoading(false)
        // console.log({ res });
        if (res.success) {
          setisLoading(false);
          setExistingDiagonosis(res.data ?? []);
          setTimeout(() => {
            setExistingModal(true);
          }, 1000);
        } else {
          if (type == "done") {
            clickFunc(selectedCommonNames);
          } else if (type == "next") {
            navigateNextScreen();
          } else if (type == "prev") {
            navigatePreviousScreen();
          }
        }
      })
      .catch((err) => {
        console.log({ err });

        if (type == "done") {
          clickFunc(selectedCommonNames);
        } else if (type == "next") {
          navigateNextScreen();
        } else if (type == "prev") {
          navigatePreviousScreen();
        }
      })
      .finally(() => {
        setisLoading(false);
      });
  };
  /**
   * Save template
   */
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
          type: Constants.MEDICAL_TEMPLATE_TYPE.DIAGNOSIS,
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
              successToast("Success", response?.message);
              setTemplates(response?.data);
              dispatch(
                setMedicalSettings({
                  ...medicalSettingsData,
                  diagnosisTemplates: response?.data,
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

  /**
   * Template to select data
   */
  const handleSelectFromTemplate = (item) => {
    if (!add) {
      setTemplateName(item?.name);
      const itemsWithActiveAt = selectedCommonNames?.filter(
        (item) =>
          item?.additional_info?.active_at != null &&
          item?.additional_info?.active_at != ""
      );
      const selectedItems1 = itemsWithActiveAt?.map((itemData) => ({
        id: itemData?.id,
        name: itemData?.name,
        additional_info: {
          severity: itemData?.additional_info?.severity,
          notes: itemData?.additional_info?.notes,
          stop_note: itemData?.additional_info?.stop_note,
          chronic: itemData?.additional_info?.chronic,
          active_at: itemData?.additional_info?.active_at,
          status: itemData?.additional_info?.status,
        },
      }));
      // if (item?.name !== templateName) {
      // const uniqueItems = item?.template_items?.filter((itemData) => {
      //   return !selectedCommonNames?.some(
      //     (selectedItem) => selectedItem?.id === itemData?.id
      //   );
      // });

      setStatus("active");

      const selectedItems = item?.template_items?.map((itemData) => ({
        id: itemData?.id,
        name: itemData?.name,
        additional_info: {
          severity: "Mild",
          notes: "",
          stop_note: "",
          chronic: false,
          active_at: "",
          status: "active",
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
        main_diagnosis_id: itemData?.main_diagnosis_id,
        additional_info: {
          severity: itemData?.additional_info?.severity,
          notes: itemData?.additional_info?.notes,
          stop_note: itemData?.additional_info?.stop_note,
          chronic: itemData?.additional_info?.chronic,
          active_at: itemData?.additional_info?.active_at,
          status: itemData?.additional_info?.status,
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
          stop_note: "",
          chronic: false,
          active_at: "",
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
  /**
   * toggle side effect
   */
  useEffect(() => {}, [toggle, selectedCommonNames]);

  /**
   * Modal data to state
   */
  const handleSeveritySelect = (name) => {
    setDetailsReport({ ...detailsReport, severity: name });
  };
  const handleStatusSelect = (name) => {
    setDetailsReport({ ...detailsReport, status: name });
  };
  const handleNotesInptSelect = (no) => {
    setNotesNo(no);
    if (notesNo !== "") {
      setDetailsReport({ ...detailsReport, notes: no });
    }
  };
  const handleClosedNotesInptSelect = (no) => {
    setNotesStop(no);
    // if (notesStop !== "") {
    //   setDetailsReport({ ...detailsReport, stop_note: no });
    // }
  };

  /**
   * Submit modal data and edit
   */
  const handleDetailsSubmit = (name) => {
    const index = selectedCommonNames.findIndex((item) => item.name === name);
    if (index === -1) {
      setSelectedCommonNames([
        ...selectedCommonNames,
        {
          ...("id" && { ["id"]: dataAppear.id }),
          ...("name" && { ["name"]: dataAppear.name }),
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
    setIsSwitchOn(false);
  };

  /**
   * Search select data compare and save to state
   */
  const searchSelectData = (data) => {
    let arrayData = [...selectedCommonNames];
    for (let index = 0; index < data.length; index++) {
      const item = selectedCommonNames.find(
        (item) => item.name === data[index].name
      );
      const itemIndex = selectedCommonNames.findIndex(
        (item) => item.name === data[index].name
      );
      if (itemIndex !== -1) {
        arrayData = [
          ...selectedCommonNames?.slice(0, itemIndex),
          {
            ...selectedCommonNames[itemIndex],
            ["id"]: selectedCommonNames[itemIndex].id,
            ["name"]: selectedCommonNames[itemIndex].name,
            ["additional_info"]: data[index]?.additional_info,
          },
          ...selectedCommonNames?.slice(itemIndex + 1),
        ];
        // setSelectedCommonNames([
        //   ...selectedCommonNames,
        //   {
        //     ...("id" && { ["id"]: data[index].id }),
        //     ...("name" && { ["name"]: data[index].name }),
        //     ...("additional_info" && {
        //       ["additional_info"]: data[index]?.additional_info,
        //     }),
        //   },
        // ]);
        setToggle(!toggle);
      } else {
        arrayData.push(data[index]);
        setToggle(!toggle);
      }
    }
    setSelectedCommonNames(arrayData);
  };

  /**
   * Navigations
   */
  const navigateNextScreen = () => {
    dispatch(setdiagnosis(selectedCommonNames));
    navigation.navigate("Prescription");
  };
  const navigatePreviousScreen = () => {
    dispatch(setdiagnosis(selectedCommonNames));
    navigation.navigate("Complaints", {
      medicalRecordId: props?.route?.params?.medicalRecordId ?? false,
    });
  };

  const onVoiceInput = (text) => {
    setSearchText(text);
  };

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const userPermissions = useSelector((state) => state.UserAuth.permission);

  function backgroundColor(priroty, constThemeColor) {
    if (priroty == "Mild") {
      return constThemeColor?.secondaryContainer;
    } else if (priroty == "Moderate") {
      return constThemeColor?.notes;
    } else if (priroty == "High") {
      return constThemeColor?.tertiaryContainer;
    } else if (priroty == "Extreme") {
      return constThemeColor?.errorContainer;
    } else if (priroty == "active") {
      return constThemeColor?.onBackground;
    } else if (priroty == "closed") {
      return constThemeColor?.errorContainer;
    } else {
      return constThemeColor?.secondaryContainer;
    }
  }
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

  const closeMenu = (item) => {
    setselectedCheckBox(item.id);
    handleSeveritySelect(item.name);
    setMedicalPrirotyModal(!medicalPrirotyModal);
  };
  const closeMenuStatus = (item) => {
    setselectedCheckBoxStatus(item.id);
    // handleStatusSelect(item.name);
    setStatus(item.name);
    setMedicalStatusModal(!medicalStatusModal);
  };
  const [medicalPrirotyModal, setMedicalPrirotyModal] = useState(false);
  const [medicalStatusModal, setMedicalStatusModal] = useState(false);
  const togglePrintModal = () => {
    setMedicalPrirotyModal(!medicalPrirotyModal);
  };
  const closePrintModal = () => {
    setMedicalPrirotyModal(false);
  };
  const toggleStatusModal = () => {
    setMedicalStatusModal(!medicalStatusModal);
  };
  const closeStatusModal = () => {
    setMedicalStatusModal(false);
  };
  const isSelectedId = (id) => {
    if (selectedCheckBox == id) {
      return true;
    } else {
      return false;
    }
  };
  const isSelectedIdStatus = (id) => {
    if (selectedCheckBoxStatus == id) {
      return true;
    } else {
      return false;
    }
  };
  const closeTempSave = () => {
    setToggleBtn(false);
    setTemplateName("");
  };
  useEffect(() => {
    let mappedTempData = templates.map((item) => ({
      id: item.id,
      name: item.template_name,
      template_items: item.template_items,
    }));
    setMappedTempData(mappedTempData);
  }, [templates]);

  const handleLongPress = (item) => {
    navigation.navigate("EditMedicalTempalte", {
      type: "diagnosis",
      editTempData: item,
      data: item.template_items,
      typeId: item.id,
      mappedTempData:mappedTempData?.filter((i)=>i?.name!=item?.name),
      onGoBackData: (e) => editSelectData(e),
    });
  };
  const editSelectData = (e) => {
    if (e?.checked) {
      const selectedItems = e?.editTempData?.map((itemData) => ({
        id: itemData?.id,
        name: itemData?.name,
        additional_info: {
          severity: "Mild",
          notes: "",
          stop_note: "",
          chronic: false,
          active_at: "",
          status: "active",
        },
      }));
      setSelectedCommonNames([...(selectedItems || [])]);
    }
    if (e?.delete) {
      setMappedTempData(mappedTempData?.filter((i) => i.id != e?.typeId) ?? []);
      dispatch(
        setMedicalSettings({
          ...medicalSettingsData,
          diagnosisTemplates:
          medicalSettingsData.diagnosisTemplates?.filter((i) => i.id != e?.typeId),
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

  return (
    <>
      {/* <MedicalHeader title="Diagnosis" noIcon={true} /> */}
      <Header
        title={"Diagnosis"}
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
          style={[reduxColors.searchBox]}
          onPress={() =>
            navigation.navigate("CommonSearch", {
              name: Constants.MEDICAL_TEMPLATE_TYPE.DIAGNOSIS,
              singular: true,
              listData: diagnosisData,
              add_permission: userPermissions["medical_add_diagnosis"],
              selected: selectedCommonNames?.filter(
                (p) => p?.additional_info?.status == "active"
              ),
              onGoBack: (e) => searchSelectData(e),
            })
          }
        >
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
              Search Diagnosis
            </Text>
          </View>
          {/* <Searchbar
            accessible={true}
            accessibilityLabel={"searchDiagnosis"}
            AccessibilityId={"searchDiagnosis"}
            autoCompleteType="off"
            placeholder="Search Diagnosis"
            placeholderTextColor={constThemeColor.onSurfaceVariant}
            style={[reduxColors.histopathologySearchField]}
            inputStyle={reduxColors.input}
            onFocus={() =>
              navigation.navigate("CommonSearch", {
                name: Constants.MEDICAL_TEMPLATE_TYPE.DIAGNOSIS,
                listData: diagnosisData,
                add_permission: userPermissions["medical_add_diagnosis"],
                selected: selectedCommonNames,
                onGoBack: (e) => searchSelectData(e),
              })
            }
            onChangeText={(e) => {
              setSearchText(e);
            }}
            value={searchText}
            // right={() => (
            //   <>
            //     <VoiceText resultValue={onVoiceInput} />
            //   </>
            // )}
          /> */}
        </TouchableOpacity>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[reduxColors.scrollContainer]}
          keyboardShouldPersistTaps="handled"
        >
          {selectedCommonNames.length > 0 ? (
            <View>
              {selectedCommonNames.map((item, index) => {
                return (
                  <DiagnosisItem
                    item={item}
                    handleEditSelected={handleEditSelected}
                    handleDeleteName={handleDeleteName}
                  />
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
                  <View
                    style={{
                      marginHorizontal: Spacing.small,
                      marginTop: Spacing.mini,
                      // marginRight: 12,
                    }}
                  >
                    <SaveAsTemplate
                      handleClearAll={() => {
                        setDialougeTitle("Do you want to clear all?");
                        alertModalOpen();
                      }}
                      medicalRecordId={medicalRecordId}
                      handleClickSaveTemp={handleClickSaveTemp}
                    />
                  </View>
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
            firstlabel={"Complaints"}
            lastlabel={"Prescription"}
            navigateNextScreen={() => checkDiagnosisStatus("next")}
            navigatePreviousScreen={() => checkDiagnosisStatus("prev")}
            onPress={() => {
              // clickFunc(selectedCommonNames);
              checkDiagnosisStatus("done");
            }}
          />
        </View>
        {/* Modal Dropdown */}
        {toggleCommNameDropdown ? (
          <MedicalDiagnosisModal
            selectCommonModalName={selectCommonModalName}
            selectCommonModalId={selectCommonModalId}
            handleToggleCommDropdown={handleToggleCommDropdown}
            chronic={chronic}
            detailsReport={detailsReport}
            onToggleSwitch={onToggleSwitch}
            togglePrintModal={togglePrintModal}
            toggleStatusModal={toggleStatusModal}
            backgroundSideColor={backgroundSideColor}
            handleNotesInptSelect={handleNotesInptSelect}
            handleClosedNotesInptSelect={handleClosedNotesInptSelect}
            handleDetailsSubmit={handleDetailsSubmit}
            medicalPrirotyModal={medicalPrirotyModal}
            closePrintModal={closePrintModal}
            closeStatusModal={closeStatusModal}
            currentDate={currentDate}
            PrirotyData={PrirotyData}
            StatusData={StatusData}
            status={status}
            notesStop={notesStop}
            isSelectedIdStatus={isSelectedIdStatus}
            closeMenu={closeMenu}
            closeMenuStatus={closeMenuStatus}
            medicalStatusModal={medicalStatusModal}
            isSelectedId={isSelectedId}
            isSwitchOn={isSwitchOn}
            updateDiagnosis={updateDiagnosis}
            setToogleCommNameDropdown={setToogleCommNameDropdown}
            toggleCommNameDropdown={toggleCommNameDropdown}
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
        <Modal
          avoidKeyboard
          animationType="fade"
          visible={existingModal}
          transparent={true}
          style={[{ backgroundColor: "transparent", flex: 1, margin: 0 }]}
        >
          {/* <TouchableWithoutFeedback> */}
          <View style={[reduxColors.modalOverlay]}>
            <View style={reduxColors.modalContainer}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={[reduxColors.scrollContainer, { flex: 1 }]}
                keyboardShouldPersistTaps="handled"
              >
                <View style={reduxColors.modalHeader}>
                  <MaterialIcons
                    name="gpp-maybe"
                    size={35}
                    color={constThemeColor.tertiary}
                    style={{ marginVertical: Spacing.body }}
                  />
                  <Text
                    style={{
                      ...FontSize.Antz_Medium_Medium,
                      color: constThemeColor.onTertiaryContainer,
                      textAlign: "center",
                    }}
                  >
                    Diagnosis already exists
                  </Text>
                  <Text
                    style={{
                      ...FontSize.Antz_Body_Medium,
                      color: constThemeColor.onTertiaryContainer,
                      textAlign: "center",
                      paddingVertical: Spacing.small,
                    }}
                  >
                    To proceed choose a different diagnosis or remove the animal
                    diagnosed
                  </Text>
                </View>

                {existingDiagonosis?.map((item) => {
                  return (
                    <View
                      style={{
                        // paddingBottom: Spacing.small,
                        borderColor: constThemeColor?.outlineVariant,
                        borderWidth: 1,
                        borderRadius: Spacing.small,
                        marginBottom: Spacing.body,
                      }}
                    >
                      <View
                        style={[
                          {
                            backgroundColor: constThemeColor?.tertiaryContainer,
                            padding: Spacing.body,
                            borderTopLeftRadius: Spacing.small,
                            borderTopRightRadius: Spacing.small,
                            flexDirection: "row",
                            alignItems: "center",
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="stethoscope"
                          size={24}
                          color={constThemeColor?.onTertiaryContainer}
                        />
                        <Text
                          style={[
                            FontSize.Antz_Minor_Title,
                            { paddingLeft: Spacing.small },
                          ]}
                        >
                          {item?.diagnosis}
                        </Text>
                      </View>
                      <View
                        style={{
                          backgroundColor: constThemeColor?.onPrimary,
                          borderRadius: Spacing.small,
                        }}
                      >
                        {item?.animal_details?.map((item) => {
                          return (
                            <View
                              style={{
                                borderColor: constThemeColor?.outlineVariant,
                                borderTopWidth: 1,
                              }}
                            >
                              <AnimalCustomCard
                                item={item}
                                animalIdentifier={
                                  !item?.local_identifier_value
                                    ? item?.animal_id
                                    : item?.local_identifier_name
                                }
                                localID={item?.local_identifier_value ?? null}
                                icon={item?.default_icon}
                                enclosureName={item?.user_enclosure_name}
                                animalName={
                                  item?.common_name
                                    ? item?.common_name
                                    : item?.scientific_name
                                }
                                sectionName={item?.section_name}
                                show_specie_details={true}
                                show_housing_details={true}
                                chips={item?.sex}
                                noArrow={true}
                              />
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  paddingVertical: Spacing.small,
                }}
              >
                <TouchableOpacity
                  style={[
                    reduxColors?.secondbutton,
                    { backgroundColor: constThemeColor?.onTertiaryContainer },
                  ]}
                  onPress={() => setExistingModal(false)}
                >
                  <Text style={reduxColors?.textstyleSecond}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* </TouchableWithoutFeedback> */}
        </Modal>
      </View>
    </>
  );
};
export default Diagnosis;

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
    commonNameList: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      paddingVertical: Spacing.body,
    },
    noteItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    selectedName: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.neutralPrimary,
    },

    detailsReportTitle: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.neutralPrimary,
    },
    scrollContainer: {
      paddingHorizontal: Spacing.minor,
    },
    saveTemp: {
      fontSize: FontSize.Antz_Standerd,
      textAlign: "center",
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      marginLeft: Spacing.mini,
      color: reduxColors.onPrimary,
    },
    ClearSelect: {
      fontSize: FontSize.Antz_Standerd,
      textAlign: "center",
      fontWeight: "500",
      color: reduxColors.onSurface,
    },
    itemRow: {
      flexDirection: "row",
      marginVertical: Spacing.minor,
      padding: Spacing.micro,
      alignItems: "center",
    },
    notesInput: {
      width: "100%",
      height: 50,
      padding: Spacing.small,
      alignItems: "center",
      justifyContent: "center",
      color: reduxColors.onErrorContainer,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      borderRadius: Spacing.mini,
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
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
      height: 580,
      width: "100%",
      // justifyContent: "center",
      alignItems: "flex-start",
      borderTopLeftRadius: Spacing.minor,
      borderTopRightRadius: Spacing.minor,
      padding: Spacing.small,
    },
    modalHeader: {
      width: "100%",
      flexDirection: "column",
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
    chronicStyle: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginLeft: Spacing.small,
    },
    severity: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    popUpStyle: {
      padding: Spacing.minor,
      borderRadius: Spacing.small,
    },
    secondbutton: {
      borderRadius: Spacing.small,
      width: 90,
      height: 40,
      justifyContent: "center",
      backgroundColor: reduxColors.primary,
      marginHorizontal: Spacing.small,
    },
    textstyleSecond: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      textAlign: "center",
      color: reduxColors.onPrimary,
    },
  });
