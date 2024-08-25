// 1. Measurement design as per figma - done
// 2. Centralize color - Not Done (After api implement and finalize design then centralize whole animal details page)

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  LayoutAnimation,
  UIManager,
  Linking,
  BackHandler,
} from "react-native";
import {
  Tabs,
  MaterialTabBar,
  useHeaderMeasurements,
  useCurrentTabScrollY,
} from "react-native-collapsible-tab-view";
import Animated, {
  interpolate,
  useAnimatedStyle,
  runOnJS,
  Extrapolate,
} from "react-native-reanimated";
import { constant, indexOf, result, throttle } from "lodash";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import ImageHeader from "../../components/ImageHeader";
import {
  Button,
  Card,
  Menu,
  Portal,
  Avatar,
  Chip,
  ActivityIndicator,
  Checkbox,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  AnimalCountUpdate,
  addAnimalMeasurment,
  animalAddMedia,
  deleteMedia,
  getAllMeasurementTypes,
  getAnimalDetails,
  getAnimalMedicalBasicData,
  getAnimalMedicalDetailsNew,
  getAnimalMedicalDiagnosisData,
  getAnimalMedicalPrescriptionData,
  getAnimalMedicalRecordListById,
  getLabRequestAnimal,
  getMeasurmentDetails,
  getMeasurmentUnit,
  getMediaList,
  getmMeasurementConfig,
  saveMeasurementConfig,
} from "../../services/AnimalService";
import moment from "moment/moment";
import {
  calculateAge,
  capitalize,
  checkPermissionAndNavigate,
  checkPermissionAndNavigateWithAccess,
  dateFormatter,
  getDocumentData,
  getFileData,
  ifEmptyValue,
  severityColor,
  shortenSmallerNumber,
  shortenNumber,
  getFileInfo,
  isLessThanTheMB,
  opacityColor,
} from "../../utils/Utils";
import Loader from "../../components/Loader";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import ListEmpty from "../../components/ListEmpty";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {
  getAnimalIdentifier,
  getAnimalMortality,
  getBasicInfoData,
  getEnclosureHistoryData,
  getEnclosureHistoryInmatesData,
} from "../../services/GetEnclosureBySectionIdServices";
import { Image } from "react-native";
import { FAB } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import {
  removeMedical,
  setActiveDiagnosis,
  setActivePrescription,
  setClosedDiagnosis,
  setClosedPrescription,
  removeMedicalMasters,
  setAdviceNotes,
  setAttachments,
  setEditFor,
  setEditFromAnimalDetails,
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
  setActiveDiagnosisEdit,
  setActivePrescriptionEdit,
  removeEditFromAnimalDetailsPage,
  removeFromMedicalBasicPage,
  setEffectListApiCall,
  setMedicalAnimal,
  setMedicalEnclosure,
  setMedicalSection,
  setMedicalSite,
} from "../../redux/MedicalSlice";
import {
  removeAnimalMovementData,
  removeParentAnimal,
  setMotherAnimal,
} from "../../redux/AnimalMovementSlice";
import { removeAnimalTransferData } from "../../redux/AnimalTransferSlice";
import DynamicAlert from "../../components/DynamicAlert";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import SubmitBtn from "../../components/SubmitBtn";
import AnimatedHeader from "../../components/AnimatedHeader";
import TabBarStyles from "../../configs/TabBarStyles";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import MortalityCard from "../../components/mortality/MortalityCard";
// import { errorToast, successToast } from "../../utils/Alert";
import SelectDropdown from "react-native-select-dropdown";
import DiagnosisItem from "../../components/DiagnosisItem";
import PrescriptionItem from "../../components/PrescriptionItem";
import MedicalListCard from "../../components/MedicalListCard";
import Constants from "../../configs/Constants";
import ObservationCard from "../Observation/ObservationCard";
import ModalFilterComponent, {
  ModalTitleData,
} from "../../components/ModalFilterComponent";
import {
  getAnimalCommonData,
  getObservationList,
  getObservationListOccupant,
  getObservationListforAdd,
} from "../../services/ObservationService";
import { useToast } from "../../configs/ToastConfig";
import home_housing from "../../assets/home_housing.svg";
import { SvgXml } from "react-native-svg";
import ImageViewer from "../../components/ImageViewer";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import BlockedPrescriptionCard from "../../components/BlockedPrescriptionCard";
import { Video } from "expo-av";
import EnclosureHistoryCard from "../../components/EnclosureHistoryCard";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { useRef } from "react";
import FilterComponent from "../../components/FilterComponent";
import AnimalImageViewer from "../../components/AnimalImageViewer";
import {
  addAdminster,
  deleteMedicineSideEffect,
  getAdminsterData,
  medicineSideEffect,
} from "../../services/MedicalsService";
import { searchUserListing } from "../../services/Animal_movement_service/SearchApproval";
import {
  ImageWrapper,
  ImageViewer as Viewer,
} from "react-native-reanimated-viewer";
import { TabBar, TabView } from "react-native-tab-view";
import AdministerStats from "../../components/AdministerStats";
import AdministerAddComponent from "../../components/AdministerAddComponent";
import AnimalMediaViewer from "../../components/AnimalMediaViewer";
import SliderComponent from "../../components/SliderComponent";
import { RefreshControl } from "react-native-gesture-handler";
import { warningToast } from "../../utils/Alert";
import EnclosureInmateCard from "../../components/EnclosureInmateCard";
import EnclosureHistoryCard2 from "../../components/EnclosureHistoryCard2";
import BottomSheetModalComponent from "../../components/BottomSheetModalComponent";
import AnimalsList from "../../components/AnimalsList";
import InsideBottomsheet from "../../components/Move_animal/InsideBottomsheet";
import { AssessmentInfo } from "./AssessmentInfo";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import Gallery from "../../assets/Gallery.svg";
import Videos from "../../assets/Video.svg";
import Documents from "../../assets/Document.svg";
import { setGroupAnimalCountUpdated } from "../../redux/TabRefreshSlice";
import { handleFilesPick } from "../../utils/UploadFiles";
const Header_Maximum_Height = heightPercentageToDP(42);

const AnimalDetails = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const video = React.useRef(null);
  const [animalDetails, setAnimalDetails] = useState({});
  const [animalId, setAnimalId] = useState(props.route.params?.animal_id);
  // const [animalId, setAnimalId] = useState("216181");
  const [enclosure_id, setEnclosureId] = useState(
    props.route.params?.enclosure_id
  );
  const { errorToast, successToast } = useToast();
  const [enclosureInfoData, setEnclosureInfoData] = useState(null);
  const [mortalityInfoData, setMortalityInfoData] = useState([]);
  const [animalMedicalList, setAnimalMedicalList] = useState([]);
  const [animalMedicalBasicData, setAnimalMedicalBasicData] = useState([]);
  const [animalMedicalDiagnosisData, setAnimalMedicalDiagnosisData] = useState(
    []
  );
  const [medicalDiagnosisDataLength, setMedicalDiagnosisDataLength] =
    useState(0);
  const [animalMedicalDiagnosisDataCount, setAnimalMedicalDiagnosisDataCount] =
    useState({});
  const [animalMedicalDiagnosisCount, setAnimalMedicalDiagnosisCount] =
    useState(0);
  const [animalMedicalPrescriptionData, setAnimalMedicalPrescriptionData] =
    useState([]);
  const [animalPrescriptionCount, setAnimalPrescriptionCount] = useState({});
  const [animalPrescriptionDataLength, setAnimalPrescriptionDataLength] =
    useState(0);
  const [animalMedicalPrescriptionCount, setAnimalMedicalPrescriptionCount] =
    useState(0);
  const [animalMedicalAdverseRxData, setAnimalMedicalAdverseRxData] = useState(
    []
  );
  const [medicalAdverseRxDataLength, setMedicalAdverseRxDataLength] =
    useState(0);
  const [animalMedicalAdverseRxCount, setAnimalMedicalAdverseRxCount] =
    useState(0);
  const [animalMedicalLabData, setAnimalMedicalLabData] = useState([]);
  const [labActiveCount, setLabActiveCount] = useState(0);
  const [labClosedCount, setLabClosedCount] = useState(0);
  const [medicalLabDataLength, setMedicalLabDataLength] = useState(0);
  const [labreslength, setLabreslength] = useState(0);
  const [animalMedicalLabCount, setAnimalMedicalLabCount] = useState(0);
  const [identifierInfoData, setIdentifierInfoData] = useState(null);
  const [screen, setScreen] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLab, setIsLoadingLab] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [tabBarBorderRadius, setTabBarBorderRadius] = useState(false);
  const [index, setIndex] = useState(0);
  const [tabName, setTabName] = useState(props.route.params?.default_tab ?? "");
  const [innerTabName, setInnerTabName] = useState(
    props.route.params?.default_sub_tab ?? "basic"
  );
  const [encTab, setEncTab] = useState("enclosurehistory");
  const [mediaTabName, setMediaTabName] = useState("");
  const [showUpdate, setShowUpdate] = useState(false);
  const [UpdateCountNote, setUpdateCountNote] = useState(null);
  const [UpdateCount, setUpdateCount] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [measurementDetails, setMeasurementDetails] = useState([]);
  const [measurementTypes, setMeasurementTypes] = useState([]);
  const [type, setType] = useState("active");
  const [labType, setLabType] = useState("pending");
  const [prescriptionType, setPrescriptionType] = useState("active");
  const [page, setPage] = useState(1);
  const [selectedImages, setSelectedImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [documentModal, setDocumentModal] = useState(false);
  const [status, setStatus] = useState({});
  const [isRestricted, setIsResticted] = useState(false);
  const [labList, setLabList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [mediaCount, setMediaCount] = useState({
    totalImage: 0,
    totalDocument: 0,
    totalVideo: 0,
  });
  const [mediaLength, setMediaLength] = useState({
    imageLength: 0,
    documentLength: 0,
    videoLength: 0,
  });

  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(themeColors);
  const permission = useSelector((state) => state.UserAuth.permission);
  const medicalDetails = useSelector(
    (state) => state.medical.animalMedicalDetails
  );
  const [blockprescriptionData, setBlockPrescriptionData] = useState([]);
  const [animalLogHistory, setAnimalLogHistory] = useState([]);
  const [animalLogCount, setAnimalLogCount] = useState(0);
  const [refreshing, setRefreching] = useState(false);

  const [deleteId, setDeleteId] = useState("");
  // const toggleActive = () => setType("active");
  // const toggleClosed = () => setType("closed");
  const toggleActive = () => {
    if (type != "active") {
      setAnimalMedicalDiagnosisData([]);
    }
    setMedicalDiagnosisDataLength(0);
    setPage(1);
    setType("active");
  };
  const toggleClosed = () => {
    if (type != "closed") {
      setAnimalMedicalDiagnosisData([]);
    }
    setMedicalDiagnosisDataLength(0);
    setPage(1);
    setType("closed");
  };

  const toggleLabActive = () => {
    setAnimalMedicalLabData([]);
    setIsLoadingLab(true);
    setAnimalMedicalLabCount(0);
    setPage(1);
    setLabType("pending");
    getLabList(1, "pending");
  };
  const toggleLabClosed = () => {
    setAnimalMedicalLabData([]);
    setIsLoadingLab(true);
    setAnimalMedicalLabCount(0);
    setPage(1);
    setLabType("completed");
    getLabList(1, "completed");
  };

  const toggleActivePrescription = () => {
    if (prescriptionType != "active") {
      setAnimalMedicalPrescriptionData([]);
    }
    setAnimalPrescriptionDataLength(0);
    setPage(1);
    setPrescriptionType("active");
  };
  const toggleClosedPrescription = () => {
    if (prescriptionType != "closed") {
      setAnimalMedicalPrescriptionData([]);
    }
    setAnimalPrescriptionDataLength(0);
    setPage(1);
    setPrescriptionType("closed");
  };
  const [observation, setObservationList] = useState([]);
  const [Items, setItems] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [filterData, setFilterData] = useState(null);
  const [commonData, setCommonData] = useState({});
  const [commonDataLeft, setCommonDataLeft] = useState({});
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [EnclosureHistoryData, setEnclosureHistoryData] = useState({});

  const [enclosureHistoryInmate, setEnclosureHistoryInmate] = useState([]);
  const [encHistoryInmateCount, setEncHistoryInmateCount] = useState(0);
  const [encHistoryInmatelength, setEncHistoryInmateLength] = useState(0);
  const [encInmatePage, setEncInmatePage] = useState(0);

  const [encInmateData, setencInmateData] = useState({});
  const [bottomTitle, setBottomTitle] = useState("");
  const [typeOne, setTypeOne] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const loginHistoryModalRef = useRef(null);

  const { showToast } = useToast();

  useFocusEffect(
    React.useCallback(() => {
      fetchTabData();
      dispatch(removeAnimalMovementData());
      dispatch(removeMedical());
      dispatch(removeEditFromAnimalDetailsPage());
      dispatch(removeAnimalTransferData());
      dispatch(removeParentAnimal());
      dispatch(removeFromMedicalBasicPage());
      return () => {};
    }, [
      navigation,
      tabName,
      type,
      prescriptionType,
      innerTabName,
      mediaTabName,
      encTab,
      filterData,
    ])
  );

  useFocusEffect(
    React.useCallback(() => {
      getDetails();
      return () => {};
    }, [navigation])
  );

  useFocusEffect(
    React.useCallback(() => {
      getMortalityInfo(animalId);
      return () => {};
    }, [])
  );

  const fetchTabData = () => {
    if (tabName == "Identifier") {
      getIdentifierInfo(animalId);
    } else if (tabName == "Enclosure" && enclosureInfoData == null) {
      getBasicDetailsUsingEnclosureId(enclosure_id);
    } else if (tabName == "Mortality") {
      getMortalityInfo(animalId);
    } else if (tabName == "Medical") {
      if (innerTabName == "basic") {
        getMedicalBasicData();

        setAnimalMedicalDiagnosisData([]);
        setMedicalDiagnosisDataLength(0);
        setPage(1);
        setType("active");

        setAnimalMedicalPrescriptionData([]);
        setAnimalPrescriptionDataLength(0);
        setPage(1);
        setPrescriptionType("active");
      } else if (innerTabName == "diagnosis") {
        setAnimalMedicalPrescriptionData([]);
        setAnimalPrescriptionDataLength(0);
        setPage(1);
        setPrescriptionType("active");

        setIsLoading(true);
        setPage(1);
        getMedicalDiagnosisData(1);
      } else if (innerTabName == "clinicalNotes") {
        setAnimalMedicalDiagnosisData([]);
        setMedicalDiagnosisDataLength(0);
        setPage(1);
        setType("active");

        setIsLoading(true);
        setPage(1);
        getMedicalPrescriptionData(1);
      } else if (innerTabName == "adverseRx") {
        setAnimalMedicalAdverseRxData([]);
        setMedicalAdverseRxDataLength(0);
        setPage(1);
        setType("active");

        setIsLoading(true);
        setPage(1);
        getBlockMedicineList(1);
      } else if (innerTabName == "LabTestRequest") {
        setAnimalMedicalLabData([]);
        setMedicalLabDataLength(0);
        setLabreslength(0);
        setPage(1);
        setIsLoadingLab(true);
        setPage(1);
        getLabList(1, labType);
      }
    } else if (tabName == "Measurements") {
      getMeasurment(animalId);
      getConfigData(animalId);
    } else if (tabName == "Notes") {
      getObservationInfo(animalId, filterData);
    } else if (tabName == "Overview" || tabName == "") {
      getCommonData();
      getMortalityInfo(animalId);
    } else if (tabName == "Media") {
      if (mediaTabName == "images") {
        setIsLoading(true);
        setPage(1);
        getAnimalMediaList("image", 1);
      } else if (mediaTabName == "documents") {
        setIsLoading(true);
        setPage(1);
        getAnimalMediaList("document", 1);
      } else if (mediaTabName == "videos") {
        setIsLoading(true);
        setPage(1);
        getAnimalMediaList("video", 1);
      }
    } else if (tabName == "History") {
      if (encTab == "enclosurehistory") {
        setIsLoading(true);
        setPage(1);
        getEncloHistory(1);
      }
    }
  };
  const getEncloHistory = (count) => {
    obj = {
      animal_id: animalId,
      page_no: count,
    };
    // "216620"
    getEnclosureHistoryData(obj)
      .then((response) => {
        setEnclosureHistoryData(response?.data);
        let dataArr = count == 1 ? [] : animalLogHistory;
        if (response?.success) {
          setAnimalLogHistory(dataArr.concat(response?.data?.result));
          if (animalLogCount == 0) {
            setAnimalLogCount(response?.data?.total_count);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };
  // Loader

  const getEncloHistoryInmates = (count, encHistoryData) => {
    // setIsLoading(true);
    obj = {
      enclosure_id: encHistoryData?.enclosure_id,
      in_date: encHistoryData?.in_date,
      out_date: encHistoryData?.out_date,
      page_no: count,
    };
    setEncInmatePage(count);
    getEnclosureHistoryInmatesData(obj)
      .then((response) => {
        if (response?.success) {
          let arrData = count == 1 ? [] : enclosureHistoryInmate;
          setEncHistoryInmateCount(
            response?.data?.total_count == undefined
              ? 0
              : response?.data?.total_count
          );

          if (response.data) {
            if (response?.data?.result) {
              arrData = arrData.concat(response?.data?.result);
            }
            setEnclosureHistoryInmate(arrData);
            setEncHistoryInmateLength(arrData?.length);
            setIsLoading(false);
          }
        } else {
          setEncHistoryInmateLength(encHistoryInmateCount);
          loginHistoryModalRef.current.close();
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleLoadMoreEncloHistory = () => {
    if (
      !isLoading &&
      encHistoryInmatelength > 0 &&
      encHistoryInmatelength != encHistoryInmateCount
    ) {
      const nextPage = encInmatePage + 1;
      getEncloHistoryInmates(nextPage, encInmateData);
    }
  };
  const renderFooterEncloHistory = () => {
    if (
      isLoading ||
      encHistoryInmatelength < 10 ||
      encHistoryInmatelength == encHistoryInmateCount
    ) {
      return null;
    }
    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };

  const getAnimalMediaList = (type, count) => {
    getMediaList(type, count, animalId)
      .then((res) => {
        // if (res.success) {
        if (type == "image") {
          let dataArrImg = count == 1 ? [] : selectedImages;
          setMediaCount({ totalImage: res?.total_count });
          setMediaLength({
            ...mediaLength,
            imageLength: res?.data?.length,
          });
          setSelectedImages(dataArrImg.concat(res.data));
        } else if (type == "document") {
          let dataArrDocs = count == 1 ? [] : documents;
          setMediaCount({ totalDocument: res?.total_count });
          setMediaLength({
            ...mediaLength,
            documentLength: res?.data?.length,
          });
          setDocuments(dataArrDocs.concat(res.data));
        } else if (type == "video") {
          let dataArrVideo = count == 1 ? [] : selectedVideos;
          setMediaCount({ totalVideo: res?.total_count });
          setMediaLength({
            ...mediaLength,
            videoLength: res?.data?.length,
          });
          setSelectedVideos(dataArrVideo.concat(res.data));
        }
        // }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error", err);
        setIsLoading(false);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  const imageFooterLoader = () => {
    if (
      isLoading ||
      mediaLength.imageLength < 10 ||
      mediaLength.imageLength == mediaCount.totalImage
    ) {
      return null;
    }

    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };

  const renderDocumentFooter = () => {
    if (
      isLoading ||
      mediaLength.documentLength < 10 ||
      mediaLength.documentLength == mediaCount.totalDocument
    ) {
      return null;
    }

    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };

  const handleMoreDocument = () => {
    if (
      !isLoading &&
      mediaLength.documentLength > 0 &&
      mediaLength.documentLength != mediaCount.totalDocument
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      getAnimalMediaList("document", nextPage);
    }
  };

  const renderVideoFooter = () => {
    if (
      isLoading ||
      mediaLength.videoLength < 10 ||
      mediaLength.videoLength == mediaCount.totalVideo
    ) {
      return null;
    }

    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };

  const handleMoreVideo = () => {
    if (
      !isLoading &&
      mediaLength.videoLength > 0 &&
      mediaLength.videoLength != mediaCount.totalVideo
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      getAnimalMediaList("video", nextPage);
    }
  };

  const loadmoreImageData = () => {
    if (
      !isLoading &&
      mediaLength.imageLength > 0 &&
      mediaLength.imageLength != mediaCount.totalImage
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      getAnimalMediaList("image", nextPage);
    }
  };

  const getCommonData = () => {
    setIsLoading(true);
    getAnimalCommonData(animalId, "1")
      .then((response) => {
        setCommonData(response.data);
        getAnimalCommonData(animalId, "2")
          .then((res) => {
            setCommonDataLeft({
              ...res.data,
              observation: {
                ...res.data?.observation,
              },
            });
          })
          .catch((err) => {
            console.log("error!!!", err);
          });
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("common data error", err);
        setIsLoading(false);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  // const handleEndReach = useCallback(() => {
  //   if ( isLoadingData) {
  //     handleLeftData();
  //   }
  // }, [isLoadingData]);

  // const handleLeftData = () => {
  //   setIsLoadingData(true);
  //   getAnimalCommonData(animalId, "2")
  //         .then((res) => {
  //           setCommonDataLeft({
  //             ...res.data,
  //             observation: {
  //               ...res.data?.observation,
  //             },
  //           });
  //           setIsLoadingData(false);
  //         })
  //         .catch((err) => {
  //           console.log("error!!!", err);
  //           setIsLoadingData(false);
  //         });
  // }

  const getDetails = () => {
    let requestObj = {
      animal_id: animalId,
    };
    setIsLoading(true);

    getAnimalDetails(requestObj)
      .then((response) => {
        setAnimalDetails(response.data);
        setEnclosureId(response.data.enclosure_id);
      })
      .catch((error) => {
        showToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const TogleUpdateCount = () => {
    setShowUpdate(!showUpdate);
  };

  const editSubmit = () => {
    checkPermissionAndNavigateWithAccess(
      permission,
      "collection_animal_record_access",
      navigation,
      animalDetails.type === "group" ? "EditAnimals" : "AnimalEdit",
      {
        item: animalDetails,
        deleted: Boolean(Number(animalDetails?.is_deleted)),
        inTransit: Boolean(Number(animalDetails?.in_transit ?? false)),
      },
      animalDetails.is_deleted == 1 ? "DELETE" : "EDIT"
    );
  };

  const checkPermission = () => {
    if (!animalDetails?.total_animal) {
      return false;
    }
    if (
      !(
        permission["collection_animal_record_access"] == "EDIT" ||
        permission["collection_animal_record_access"] == "DELETE"
      )
    ) {
      return false;
    } else {
      if (mortalityInfoData.length > 0) {
        if (animalDetails?.total_animal !== animalDetails?.mortality_count) {
          return true;
        }
        return false;
      } else if (animalDetails.is_deleted == 1) {
        return true;
      } else if (animalDetails.active == 0 && animalDetails.is_deleted == 0) {
        return false;
      } else {
        return true;
      }
    }
  };

  const getMeasurment = (animalId) => {
    setIsLoading(true);
    getMeasurmentDetails(animalId)
      .then((response) => {
        // let x = response?.data?.map((i) => i?.measurements);
        // console.log("===================", x);
        setMeasurementDetails(response?.data ?? []);
        setIsLoading(false);
      })
      .catch((error) => {
        showToast("error", "Oops! Something went wrong!");
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };
  const getBlockMedicineList = (page) => {
    let obj = {
      animal_id: JSON.stringify([animalId]),
      page_no: page,
    };
    if (page == 1) {
      setMedicalAdverseRxDataLength(0);
    }
    medicineSideEffect(obj)
      .then((res) => {
        if (res?.success) {
          let dataArr = page == 1 ? [] : animalMedicalAdverseRxData;
          setAnimalMedicalAdverseRxCount(res?.data?.total_count);
          if (res.data.result?.length > 0) {
            setMedicalAdverseRxDataLength(
              dataArr.concat(res?.data?.result)?.length ?? 0
            );
            setAnimalMedicalAdverseRxData(dataArr.concat(res?.data?.result));
            setIsLoading(false);
          }
        } else {
          setMedicalAdverseRxDataLength(0);
          setAnimalMedicalAdverseRxData([]);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.log("err", e);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };
  const onRemoveSideEffectFun = (id) => {
    setIsLoading(true);
    deleteMedicineSideEffect({ side_effect_id: id })
      .then((res) => {
        if (res.success) {
          successToast("Success", res.message);
          getBlockMedicineList(1);
        } else {
          errorToast("Error", "Oops! Something went wrong!");
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.log("err", e);
        errorToast("Error", "Oops! Something went wrong!");
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const getConfigData = (animalId) => {
    Promise.all([getAllMeasurementTypes(), getmMeasurementConfig(animalId)])
      .then((response) => {
        let type = response[0].data.map((item) => ({
          id: item.id,
          name: item.name,
          is_active:
            response[1].data.filter((e) => e.measurement_type_id == item.id)[0]
              ?.is_active == 1
              ? true
              : false,
        }));
        // setMeasurementTypesforAnimal(response[1].data);
        setMeasurementTypes(type);
      })

      .catch((error) => {
        showToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        // setIsLoading(false);
      });
  };
  function getBasicDetailsUsingEnclosureId(enclosure_id) {
    let requestObj = { enclosure_id };
    setIsLoading(true);
    getBasicInfoData(enclosure_id)
      // getEnclosuresDataInfo(enclosure_id)
      .then((res) => {
        // setAnimalDetails(res.data.animal_list);
        setEnclosureInfoData(res.data);
      })
      .catch((err) => {
        showToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  }
  const getMedicalInfo = (animalId) => {
    setIsLoading(true);
    getAnimalMedicalRecordListById(animalId)
      .then((res) => {
        setAnimalMedicalList(res?.data);
        setIsLoading(false);
      })
      .catch((error) => {
        // errorToast("Oops!", JSON.stringify(error));
        showToast("error", "Oops! Something went wrong!");
        setIsLoading(false);
      });
  };

  const getMedicalBasicData = () => {
    setIsLoading(true);
    getAnimalMedicalBasicData(animalId)
      .then((res) => {
        setAnimalMedicalBasicData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error 1", err);
        setIsLoading(false);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  const onRefreshOverview = () => {
    setIsRefreshing(true);
    getCommonData();
  };

  const onRefreshBasic = () => {
    setIsRefreshing(true);
    getMedicalBasicData();
  };

  const onRefreshPrescription = () => {
    setIsRefreshing(true);
    getMedicalPrescriptionData(1);
  };

  const onRefreshDiagnosis = () => {
    setIsRefreshing(true);
    getMedicalDiagnosisData(1);
  };

  const onRefreshAdverse = () => {
    setIsRefreshing(true);
    getBlockMedicineList(1);
  };

  const onRefreshLabTest = () => {
    if (
      !isLoading &&
      !isLoadingLab &&
      !isRefreshing &&
      tabBarBorderRadius == false
    ) {
      setIsRefreshing(true);
      setPage(1);
      getLabList(1, labType);
    }
  };

  const onRefreshMeasurements = () => {
    setIsRefreshing(true);
    getMeasurment(animalId);
  };

  const onRefreshMortalitySingle = () => {
    setIsRefreshing(true);
    getMortalityInfo(animalId);
  };

  const onRefreshEnclosure = () => {
    setIsRefreshing(true);
    getBasicDetailsUsingEnclosureId(enclosure_id);
  };

  const onRefreshIdentifier = () => {
    setIsRefreshing(true);
    getIdentifierInfo(animalId);
  };

  const onRefreshNotes = () => {
    // setIsRefreshing(true);
    getObservationInfo(animalId, filterData);
  };

  const onRefreshImage = () => {
    setIsRefreshing(true);
    getAnimalMediaList("image", 1);
  };

  const onRefreshDocument = () => {
    setIsRefreshing(true);
    getAnimalMediaList("document", 1);
  };

  const onRefreshVideo = () => {
    setIsRefreshing(true);
    getAnimalMediaList("video", 1);
  };

  const onRefreshInmates = () => {
    setIsRefreshing(true);
    getEncloHistory(1);
  };

  const onRefreshAnyother = () => {
    console.log("called");
  };

  const getMedicalDiagnosisData = (count) => {
    getAnimalMedicalDiagnosisData(animalId, type, count)
      .then((res) => {
        setIsLoading(false);
        let dataArr = count == 1 ? [] : animalMedicalDiagnosisData;
        if (count == 1) {
          setAnimalMedicalDiagnosisDataCount({
            active: res.data?.active,
            closed: res.data?.closed,
          });
          setAnimalMedicalDiagnosisCount(res.data?.totalMedicalRecordCount);
        }
        if (res.data.result) {
          setMedicalDiagnosisDataLength(
            medicalDiagnosisDataLength + res.data?.result?.length
          );
          setAnimalMedicalDiagnosisData(dataArr.concat(res.data.result));
        } else {
          setMedicalDiagnosisDataLength(0);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error", err);
        setIsLoading(false);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };
  const getMedicalPrescriptionData = (count) => {
    getAnimalMedicalPrescriptionData(animalId, prescriptionType, count)
      .then((res) => {
        let dataArr = count == 1 ? [] : animalMedicalPrescriptionData;
        if (count == 1) {
          setAnimalPrescriptionCount({
            active: res.data?.active,
            closed: res.data?.closed,
          });
          setAnimalMedicalPrescriptionCount(res.data?.totalMedicalRecordCount);
        }
        if (res.data.result) {
          setAnimalPrescriptionDataLength(
            animalPrescriptionDataLength + res.data?.result?.length
          );
          setAnimalMedicalPrescriptionData(dataArr.concat(res.data.result));
        } else {
          setAnimalPrescriptionDataLength(0);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error", err);
        setIsLoading(false);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  const getLabList = (count, labType) => {
    setPage(count);
    getLabRequestAnimal(count, animalDetails?.animal_id, labType)
      .then((res) => {
        if (res?.success) {
          let dataArr = count == 1 ? [] : animalMedicalLabData;
          setAnimalMedicalLabCount(res?.data?.count);
          setLabActiveCount(res?.data?.active ?? 0);
          setLabClosedCount(res?.data?.close ?? 0);

          if (res.data.result?.length > 0) {
            setLabreslength(res.data.result?.length ?? 0);
            setMedicalLabDataLength(
              animalMedicalLabData?.length + res.data.result?.length
            );
            setAnimalMedicalLabData(dataArr.concat(res?.data?.result));
          } else {
            setLabreslength(0);
          }
          setIsLoadingLab(false);
        } else {
          showToast("error", "Oops! Something went wrong!");
          setIsLoadingLab(false);
        }
      })
      .catch((e) => {
        showToast("error", "Oops! Something went wrong!");
        setIsLoadingLab(false);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  const handleLoadMoreLab = () => {
    if (
      !isLoading &&
      animalMedicalLabData?.length >= 10 &&
      labreslength >= 10
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      getLabList(nextPage, labType);
    }
  };
  const renderFooterLab = () => {
    if (
      isLoadingLab ||
      animalMedicalLabData?.length < 10 ||
      labreslength < 10
    ) {
      return null;
    }

    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };
  function getMortalityInfo(id) {
    let requestObj = {
      entity_id: id,
      type: "animal",
    };

    setIsLoading(true);
    getAnimalMortality(requestObj)
      .then((res) => {
        if (res?.success && res?.data.length > 0) {
          setMortalityInfoData(res?.data);
        }
      })
      .catch((err) => {
        showToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  }

  function getIdentifierInfo(animal_id) {
    let requestObj = { animal_id };
    setIsLoading(true);
    getAnimalIdentifier(requestObj)
      .then((res) => {
        if (res?.success) {
          if (res.data) {
            setIdentifierInfoData(res?.data);
          }
        }
      })
      .catch((err) => {
        showToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  }

  function getObservationInfo(animal_id, filter) {
    setIsLoading(true);
    const obj = {
      id: animal_id,
      type: "animal",
    };
    if (filter?.priority) {
      obj.priority = filter.priority;
    }
    if (filter?.note_type) {
      obj.note_type = filter.note_type;
    }
    if (filter?.created_by) {
      obj.created_by = filter.created_by;
    }
    if (filter?.tagged_to) {
      obj.tagged_to = filter.tagged_to;
    }
    getObservationListOccupant(obj)
      .then((res) => {
        setObservationList(res?.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", e);
      })
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  }

  const fetchData = () => {
    let postData = {
      zoo_id: zooID,
      isActive: true,
    };
    setIsLoading(true);
    Promise.all([getObservationListforAdd(), searchUserListing(postData)])
      .then((res) => {
        setItems([
          {
            id: 1,
            title: "Note Type",
            type: null,
            subItem: res[0].data?.map((item) => {
              return { id: item?.id, isSelect: false, name: item?.type_name };
            }),
          },
          {
            id: 2,
            title: "Priority",
            type: null,
            subItem: [
              {
                id: 1,
                name: "Low",
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
                name: "Critical",
              },
            ],
          },
          {
            id: 3,
            title: "Created By",
            type: "user",
            subItem: res[1].data?.map((item) => {
              return { ...item, id: item?.user_id, isSelect: false };
            }),
          },
          {
            id: 4,
            title: "Tagged To",
            type: "user",
            subItem: res[1].data?.map((item) => {
              return { ...item, id: item?.user_id, isSelect: false };
            }),
          },
        ]);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log({ e });
        setIsLoading(false);
      });
  };

  const getSelectedData = (item) => {
    setSelectedData(item);
    let filter = {};
    filter.note_type = item
      ?.find((a) => a.title == "Note Type")
      ?.subItem?.filter((b) => b.isSelect == true)
      ?.map((b) => b.id)
      ?.join(",");
    filter.priority = item
      ?.find((a) => a.title == "Priority")
      ?.subItem?.filter((b) => b.isSelect == true)
      ?.map((b) => b.name)
      ?.join(",");
    filter.created_by = item
      ?.find((a) => a.title == "Created By")
      ?.subItem?.filter((b) => b.isSelect == true)
      ?.map((b) => b.id)
      ?.join(",");
    filter.tagged_to = item
      ?.find((a) => a.title == "Tagged To")
      ?.subItem?.filter((b) => b.isSelect == true)
      ?.map((b) => b.id)
      ?.join(",");
    setObservationList([]);
    setFilterData(filter);
  };

  const [header, setHeader] = useState(false);
  const headerHide = (e) => {
    setHeader(e);
  };
  const ref = React.useRef();
  let [childComponentScrollValue, setChildComponentScrollValue] = useState(0);
  const TAB_HEADER_ITEMS = [
    {
      id: "0",
      title: "Overview",
      screen: "overview",
    },
    {
      id: "1",
      title: "Assessment",
      screen: "measurements",
    },
    {
      id: "2",
      title: "Notes",
      screen: "observation",
    },
    {
      id: "3",
      title: "Medical",
      screen: "medical",
    },
    {
      id: "4",
      title: "Mortality",
      screen: "mortality",
    },
    {
      id: "5",
      title: "Media",
      screen: "media",
    },
    // {
    //   id: "6",
    //   title: "Enclosure",
    //   screen: "enclosure",
    // },
    {
      id: "7",
      title: "Identifier",
      screen: "identifier",
    },
    // {
    //   id: "8",
    //   title: "History",
    //   screen: "history",
    // },
  ];
  const minimumHeaderHeight = 60;

  const [headerHeight, setHeaderHeight] = React.useState(
    Header_Maximum_Height + 100
  );
  const getHeaderHeight = React.useCallback(
    (headerHeight) => {
      if (headerHeight > 0) {
        setHeaderHeight(headerHeight + 70);
      }
    },
    [headerHeight]
  );

  const getScrollPositionOfTabs = useMemo(
    () =>
      throttle((scrollPos) => {
        if (scrollPos - (headerHeight - (minimumHeaderHeight + 74)) >= 0) {
          setHeader(true);
          setTabBarBorderRadius(true);
        } else {
          setHeader(false);
          setTabBarBorderRadius(false);
        }
      }, 16),
    [headerHeight]
  );

  const onTabchange = (data) => {
    setTabName(data.tabName);
  };

  const changeInnerName = (data) => {
    setInnerTabName(data);
  };
  const changeEncTab = (data) => {
    setEncTab(data);
  };
  const changeMediaInnerName = (data) => {
    setMediaTabName(data);
  };
  const onJumpTab = (data) => {
    ref.current?.jumpToTab(data?.tabName);
    setInnerTabName(data.innerTabName);
  };

  const stylesSheet = TabBarStyles.getTabBarStyleSheet(themeColors);

  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  const validation = () => {
    setError(false);
    setErrorMessage("");
    if (!UpdateCount) {
      setErrorMessage({ UpdateCount: "Enter Count to Update" });
      return false;
    } else if (UpdateCount < 1) {
      setErrorMessage({ UpdateCount: "Please enter the count greater than zero" });
      return false;
    } else if (Number(UpdateCount) < Number(animalDetails?.mortality_count)) {
      setErrorMessage({
        UpdateCount: `Enter count more than and equal ${animalDetails?.mortality_count}`,
      });
      return false;
    }
    // if (!UpdateCountNote) {
    //   setErrorMessage({ UpdateCountNote: "Note is Required" });
    //   return false;
    // }
    return true;
  };

  const hideAlert = () => {
    setIsVisible(false);
  };
  const showAlert = () => {
    setIsVisible(true);
  };
  const handleOK = () => {
    setIsVisible(false);
  };
  const handleCancel = () => {
    navigation.goBack();
    setIsVisible(false);
  };
  const NewCountSubmit = () => {
    if (validation()) {
      const obj = {
        animal_id: animalId,
        total_animal: UpdateCount,
        comments: UpdateCountNote,
      };
      setIsLoading(true);
      AnimalCountUpdate(obj)
        .then((response) => {
          if (response?.success) {
            dispatch(setGroupAnimalCountUpdated(true));
            setShowUpdate(false);
            setIsLoading(false);
            showToast("success", response?.message);
            getDetails();
            setUpdateCount(null);
          }
        })
        .catch((e) => {
          setShowUpdate(false);
          showToast("error", "Oops! Something went wrong!");
          setIsLoading(false);
          console.log(e);
        })
        .finally(() => {
          // showAlert();
          setIsLoading(false);
          setShowUpdate(false);
        });
    }
  };

  const handleLoadMoreDiagnosis = () => {
    if (
      !isLoading &&
      medicalDiagnosisDataLength > 0 &&
      medicalDiagnosisDataLength != animalMedicalDiagnosisCount
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      getMedicalDiagnosisData(nextPage);
    }
  };
  const renderFooterDiagnosis = () => {
    // if (
    //   isLoading ||
    //   medicalDiagnosisDataLength == 0 ||
    //   medicalDiagnosisDataLength < 10 ||
    //   medicalDiagnosisDataLength == animalMedicalDiagnosisData.length
    // )

    if (
      isLoading ||
      medicalDiagnosisDataLength < 10 ||
      medicalDiagnosisDataLength == animalMedicalDiagnosisCount
    ) {
      return null;
    }

    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };
  const handleLoadMorePrescription = () => {
    if (
      !isLoading &&
      animalPrescriptionDataLength > 0 &&
      animalPrescriptionDataLength != animalMedicalPrescriptionCount
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      getMedicalPrescriptionData(nextPage);
    }
  };
  const renderFooterPrescription = () => {
    if (
      isLoading ||
      animalPrescriptionDataLength < 10 ||
      animalPrescriptionDataLength == animalMedicalPrescriptionCount
    ) {
      return null;
    }

    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };
  const handleLoadMoreAdverseRx = () => {
    if (
      !isLoading &&
      medicalAdverseRxDataLength > 0 &&
      medicalAdverseRxDataLength != animalMedicalAdverseRxCount
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      getBlockMedicineList(nextPage);
    }
  };
  const renderFooterAdverseRx = () => {
    if (
      isLoading ||
      medicalAdverseRxDataLength > 0 ||
      medicalAdverseRxDataLength == animalMedicalAdverseRxCount
    ) {
      return null;
    }

    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };

  const handleImagePick = async () => {
    const images = await handleFilesPick(
      errorToast,
      "image",
      setIsLoading,
      selectedItems,
      true,
      setDocumentModal
    );
    setSelectedItems(images);
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        const fileInfo = await getFileInfo(getFileData(result.assets[0]));

        if (!fileInfo?.size) {
          setIsLoading(false);
          setDocumentModal(false);
          errorToast("Error", "Can't select this file as the size is unknown.");
          return;
        }

        // if (result.assets[0]?.type === "image") {
        //   const isLt5MB = isLessThanTheMB(fileInfo?.size, 5);
        //   if (!isLt5MB) {
        //     setIsLoading(false);
        //     setDocumentModal(false);
        //     errorToast("Error", `Image size must be smaller than 5MB!`);
        //     return;
        //   }
        // }
        setSelectedItems([...selectedItems, getFileData(result.assets[0])]);
      }
    } catch (err) {
      console.error("Error picking image:", err);
    }
  };

  const handleDocumentPick = async () => {
    const documents = await handleFilesPick(
      errorToast,
      "doc",
      setIsLoading,
      selectedItems,
      true,
      setDocumentModal
    );
    setSelectedItems(documents);
  };
  const handleVideoPick = async () => {
    const videos = await handleFilesPick(
      errorToast,
      "video",
      setIsLoading,
      selectedItems,
      true,
      setDocumentModal
    );
    setSelectedItems(videos);
  };

  const removeDocuments = (docsName) => {
    const filterData = selectedItems?.filter((item) => {
      if (
        item?.type == "image/jpeg" &&
        item?.type == "image/png" &&
        item?.type == "video/mp4"
      ) {
        return item?.uri != docsName;
      } else {
        return item?.name != docsName;
      }
    });
    setSelectedItems(filterData);
  };
  const removeImages = (docsName) => {
    const filterData = selectedItems?.filter((item) => {
      if (item?.type == "image/jpeg" || item?.type == "image/png") {
        return item?.uri != docsName;
      } else {
        return item?.name != docsName;
      }
    });
    setSelectedItems(filterData);
  };
  const removeVideos = (docsName) => {
    const filterData = selectedItems?.filter((item) => {
      if (item?.type == "video/mp4" || item?.type == "video/quicktime") {
        return item?.name != docsName;
      } else {
        return selectedItems;
      }
    });
    setSelectedItems(filterData);
  };

  const toggleModal = () => {
    setDocumentModal(!documentModal);
    setSelectedItems([]);
  };

  const handleRestrictValue = () => {
    setIsResticted(!isRestricted);
  };
  // Add media for animal
  const submitDocument = () => {
    setIsLoading(true);
    setDocumentModal(false);
    let obj = {
      animal_id: animalId,
      acess_restricted_key: isRestricted ? 1 : 0,
    };
    animalAddMedia(obj, selectedItems)
      .then((res) => {
        setIsLoading(false);
        setSelectedItems([]);
        setIsResticted(false);
        successToast("Success", res.message);
        if (
          selectedItems[0]?.type == "image/jpeg" ||
          selectedItems[0]?.type == "image/png"
        ) {
          if (tabName == "Media" && mediaTabName == "images") {
            getAnimalMediaList("image", 1);
          } else {
            ref.current?.jumpToTab("images");
            setTabName("Media");
            changeMediaInnerName("images");
          }
        } else if (selectedItems[0]?.type == "application/pdf") {
          if (tabName == "Media" && mediaTabName == "documents") {
            getAnimalMediaList("document", 1);
          } else {
            ref.current?.jumpToTab("documents");
            setTabName("Media");
            changeMediaInnerName("documents");
          }
        } else if (selectedItems[0]?.type == "video/mp4") {
          if (tabName == "Media" && mediaTabName == "videos") {
            getAnimalMediaList("video", 1);
          } else {
            ref.current?.jumpToTab("videos");
            setTabName("Media");
            changeMediaInnerName("videos");
          }
        }
        // if (mediaTabName == "images") {
        //   getAnimalMediaList("image", 1);
        // } else if (mediaTabName == "documents") {
        //   getAnimalMediaList("document", 1);
        // } else if (mediaTabName == "videos") {
        //   getAnimalMediaList("video", 1);
        // }
      })
      .catch((err) => {
        console.log("error", err);
        setIsLoading(false);
        errorToast("Error", "Something went wrong!");
      });
  };

  const navigateCom = () => {
    dispatch(removeAnimalMovementData());
    dispatch(setMedicalEnclosure([]));
    dispatch(setMedicalAnimal([]));
    dispatch(setMedicalSection([]));
    dispatch(setMedicalSite([]));
    navigation.navigate("Observation", {
      selectedAnimal: animalDetails,
      onGoBackData: handleEncTabMove,
    });
  };
  const handleEncTabMove = (item) => {
    if (item === "enclosure") {
      ref.current?.jumpToTab("Enclosure");
    } else if (item === "observation") {
      ref.current?.jumpToTab("Notes");
    }
  };
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  const deleteAnimalImage = (item) => {
    setBottomTitle("Are you sure you want to delete this Image?");
    setTypeOne("deleteSection");
    setDeleteId(item.id);
    alertModalOpen();
  };
  const documentDelete = (item) => {
    setBottomTitle("Are you sure you want to delete this Document?");
    setType("deleteSection");
    setDeleteId(item.id);
    alertModalOpen();
  };
  const deleteVideo = (item) => {
    setBottomTitle("Are you sure you want to delete this Video?");
    setType("deleteSection");
    setDeleteId(item.id);
    alertModalOpen();
  };
  const firstButtonPress = () => {
    if (typeOne == "deleteSection") {
      // mediaDeleteFunc();
      deleteMediaFun(deleteId);
      alertModalClose();
    } else if (typeOne == "navigationBack") {
      navigation.goBack();
      alertModalClose();
    }
  };
  const secondButtonPress = () => {
    alertModalClose();
  };

  const deleteMediaFun = (id) => {
    setIsLoading(true);
    const obj = {
      id: id,
      ref_type: "animal",
    };
    deleteMedia(obj)
      .then((res) => {
        if (res?.success) {
          successToast("Success", res.message);
          if (mediaTabName == "images") {
            getAnimalMediaList("image", 1);
          } else if (mediaTabName == "documents") {
            getAnimalMediaList("document", 1);
          } else if (mediaTabName == "videos") {
            getAnimalMediaList("video", 1);
          }
        } else {
          errorToast("Error", res?.message ?? "Something went wrong!");
        }
      })
      .catch((err) => {
        console.log({ err });
        errorToast("Error", "Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false);
        setDeleteId("");
      });
  };
  return (
    <>
      <SafeAreaProvider style={{ backgroundColor: themeColors.onPrimary }}>
        <Loader visible={isLoading} />
        <AppBar
          header={header}
          reduxColors={reduxColors}
          style={[
            header
              ? { backgroundColor: themeColors.onPrimary }
              : { backgroundColor: "transparent" },
            { position: "absolute", top: 0, width: "100%", zIndex: 1 },
          ]}
          title={animalDetails.vernacular_name}
          mortalityInfoData={mortalityInfoData}
          animalDetails={animalDetails}
          deleted={Boolean(Number(animalDetails.is_deleted))}
          setShowUpdate={setShowUpdate}
        />
        <Tabs.Container
          initialTabName={tabName}
          ref={ref}
          pagerProps={{ scrollEnabled: false }}
          onIndexChange={setIndex}
          renderTabBar={(props) => {
            return (
              <MaterialTabBar
                {...props}
                scrollEnabled={true}
                indicatorStyle={stylesSheet.indicatorStyle}
                style={stylesSheet.tabBar}
                contentContainerStyle={[
                  stylesSheet.contentContainerStyle,
                  { minWidth: "100%" },
                ]}
                activeColor={themeColors.onSurface}
                labelStyle={stylesSheet.labelStyle}
                elevation={0}
              />
            );
          }}
          {...props}
          renderHeader={() => {
            return (
              <Header
                imageBackground={undefined}
                style={[reduxColors.headerContainer]}
                scientificName={animalDetails.complete_name}
                sex={animalDetails.sex}
                age={animalDetails.age}
                localIdType={animalDetails.local_id_type}
                localId={animalDetails.local_id}
                enclosure={animalDetails.user_enclosure_name}
                title={animalDetails.vernacular_name ?? ""}
                label={animalDetails.label}
                animal_id={animalDetails?.animal_id}
                dead={animalDetails?.is_alive == 0 ? true : false}
                deleted={Boolean(Number(animalDetails.is_deleted))}
                birthDate={animalDetails.birth_date}
                navigation={navigation}
                header={header}
                permission={permission}
                section={animalDetails?.section_name}
                site={animalDetails?.site_name}
                animalDetails={animalDetails}
                mortalityInfoData={mortalityInfoData}
                reduxColors={reduxColors}
                getScrollPositionOfTabs={getScrollPositionOfTabs}
                getHeaderHeight={getHeaderHeight}
                tabBarBorderRadius={tabBarBorderRadius}
              />
            );
          }}
          headerContainerStyle={{
            backgroundColor: "transparent",
            shadowOpacity: 0,
          }}
          minHeaderHeight={minimumHeaderHeight}
          onTabChange={onTabchange}
        >
          {TAB_HEADER_ITEMS?.map((item) => {
            if (!permission["medical_records"] && item.screen === "medical") {
              return null;
            }

            if (
              (props.route.params?.default_tab == "Medical" &&
                props.route.params?.type == "group") ||
              (props.route.params?.default_tab != "Medical" &&
                animalDetails.type != "single")
            ) {
              if (
                animalDetails.type == "" &&
                item.screen === "measurements" &&
                props.route.params?.default_tab != "Mortality"
              ) {
                return null;
              }
            }

            if (
              mortalityInfoData.length == 0 &&
              item.screen === "mortality" &&
              props.route.params?.default_tab != "Mortality"
            ) {
              return null;
            }
            return (
              <Tabs.Tab name={item.title} label={item.title} key={item.id}>
                <View
                  style={{
                    paddingTop: Spacing.small,
                    height: "100%",
                    paddingBottom:
                      item.screen === "mortality" &&
                      animalDetails?.type == "single"
                        ? 60
                        : 0,
                  }}
                >
                  {item.screen === "medical" ? (
                    <Medical
                      animalDetails={animalDetails}
                      default_sub_tab={innerTabName}
                      themeColors={themeColors}
                      reduxColors={reduxColors}
                      animalMedicalList={animalMedicalList}
                      medicalBasicData={animalMedicalBasicData}
                      type={type}
                      toggleActive={toggleActive}
                      toggleClosed={toggleClosed}
                      toggleLabActive={toggleLabActive}
                      toggleLabClosed={toggleLabClosed}
                      labType={labType}
                      labClosedCount={labClosedCount}
                      labActiveCount={labActiveCount}
                      prescriptionType={prescriptionType}
                      toggleActivePrescription={toggleActivePrescription}
                      toggleClosedPrescription={toggleClosedPrescription}
                      animalMedicalDiagnosisData={animalMedicalDiagnosisData}
                      animalMedicalDiagnosisDataCount={
                        animalMedicalDiagnosisDataCount
                      }
                      animalMedicalPrescriptionData={
                        animalMedicalPrescriptionData
                      }
                      handleMoreDiagnosis={handleLoadMoreDiagnosis}
                      renderDiagnosisFooter={renderFooterDiagnosis}
                      animalPrescriptionCount={animalPrescriptionCount}
                      handleLoadMorePrescription={handleLoadMorePrescription}
                      renderFooterPrescription={renderFooterPrescription}
                      changeInnerName={changeInnerName}
                      animalMedicalAdverseRxData={animalMedicalAdverseRxData}
                      handleLoadMoreAdverseRx={handleLoadMoreAdverseRx}
                      renderFooterAdverseRx={renderFooterAdverseRx}
                      onRemoveSideEffectFun={onRemoveSideEffectFun}
                      getMedicalPrescriptionData={getMedicalPrescriptionData}
                      handleLoadMoreLab={handleLoadMoreLab}
                      renderFooterLab={renderFooterLab}
                      isLoadingLab={isLoadingLab}
                      animalMedicalLabData={animalMedicalLabData}
                      permission={permission}
                      onRefreshBasic={onRefreshBasic}
                      refreshingBasic={isRefreshing}
                      onRefreshPrescription={onRefreshPrescription}
                      refreshingPrescription={isRefreshing}
                      onRefreshDiagnosis={onRefreshDiagnosis}
                      refreshingDiagnosis={isRefreshing}
                      onRefreshAdverse={onRefreshAdverse}
                      refreshingAdverse={isRefreshing}
                      onRefreshLabTest={onRefreshLabTest}
                      refreshingLabTest={isRefreshing}
                      isLoading={isLoading}
                    />
                  ) : item.screen === "enclosure" ? (
                    <Enclosure
                      enclosureInfoData={enclosureInfoData}
                      reduxColors={reduxColors}
                      themeColors={themeColors}
                      onRefreshEnclosure={onRefreshEnclosure}
                      refreshingEnclosure={isRefreshing}
                      loading={isLoading}
                    />
                  ) : item.screen === "mortality" ? (
                    <Mortality
                      mortalityInfoData={mortalityInfoData}
                      reduxColors={reduxColors}
                      animalDetailsData={animalDetails}
                      deleted={Boolean(Number(animalDetails.is_deleted))}
                      active={!Boolean(Number(animalDetails.active))}
                      animal_transfered={
                        !Boolean(Number(animalDetails.animal_transfered))
                      }
                      permission={permission}
                      onRefreshMortalitySingle={onRefreshMortalitySingle}
                      refreshingMortalitySingle={isRefreshing}
                      loading={isLoading}
                    />
                  ) : item.screen === "measurements" ? (
                    // <Measurements
                    //   animalDetails={animalDetails}
                    //   navigation={navigation}
                    //   active={!Boolean(Number(animalDetails.active))}
                    //   animalId={animalId}
                    //   themeColors={themeColors}
                    //   item={item}
                    //   reduxColors={reduxColors}
                    //   dead={animalDetails?.is_alive == 0 ? true : false}
                    //   deleted={Boolean(Number(animalDetails.is_deleted))}
                    //   birthDate={animalDetails.birth_date}
                    //   screen={tabName}
                    //   permission={permission}
                    //   measurementDetails={measurementDetails}
                    //   getMeasurment={() => getMeasurment(animalId)}
                    //   measurementTypes={measurementTypes}
                    //   getConfigData={() => getConfigData(animalId)}
                    //   onRefreshMeasurements={onRefreshMeasurements}
                    //   refreshingMeasurements={isRefreshing}
                    // />
                    // AssessmentSummary
                    <AssessmentInfo
                      tabName={tabName}
                      animalId={animalId}
                      animalDetails={animalDetails}
                    />
                  ) : item.screen === "observation" ? (
                    <Observation
                      observationData={observation}
                      reduxColors={reduxColors}
                      animalDetails={animalDetails}
                      onRefreshNotes={onRefreshNotes}
                      refreshingNotes={isRefreshing}
                      Items={Items}
                      fetchData={fetchData}
                      getSelectedData={getSelectedData}
                      selectedData={selectedData}
                      dispatch={dispatch}
                    />
                  ) : item.screen === "animal" ? (
                    <Animal reduxColors={reduxColors} />
                  ) : item.screen === "birds" ? (
                    <Birds reduxColors={reduxColors} />
                  ) : item.screen === "identifier" ? (
                    <Identifier
                      identifierInfoData={identifierInfoData}
                      reduxColors={reduxColors}
                      deleted={Boolean(Number(animalDetails.is_deleted))}
                      dead={animalDetails?.is_alive == 0 ? true : false}
                      permission={permission}
                      onRefreshIdentifier={onRefreshIdentifier}
                      refreshingIdentifier={isRefreshing}
                      isLoading={isLoading}
                    />
                  ) : item.screen == "overview" ? (
                    <Overview
                      is_alive={animalDetails?.is_alive == 0 ? false : true}
                      isLoading={isLoading}
                      overviewData={commonData}
                      editSubmit={editSubmit}
                      isPermission={checkPermission()}
                      overviewDataLeft={commonDataLeft}
                      animalDetails={animalDetails}
                      openTab={onJumpTab}
                      permission={permission}
                      reduxColors={reduxColors}
                      themeColors={themeColors}
                      onRefreshOverview={onRefreshOverview}
                      refreshingOverview={isRefreshing}
                      handleEncTabMove={handleEncTabMove}
                      // handleLeftData={handleLeftData}
                      // isRefreshing={isLoadingData}
                      // handleEndReach={handleEndReach}
                    />
                  ) : item.screen == "media" ? (
                    <Media
                      reduxColors={reduxColors}
                      themeColors={themeColors}
                      video={video}
                      default_sub_tab={mediaTabName}
                      changeInnerName={changeMediaInnerName}
                      handleImagePick={handleImagePick}
                      takePhoto={takePhoto}
                      selectedImages={selectedImages}
                      removeImages={removeImages}
                      handleDocumentPick={handleDocumentPick}
                      documents={documents}
                      removeDocuments={removeDocuments}
                      handleVideoPick={handleVideoPick}
                      removeVideos={removeVideos}
                      selectedVideos={selectedVideos}
                      selectedItems={selectedItems}
                      setSelectedItems={setSelectedItems}
                      documentModal={documentModal}
                      setDocumentModal={setDocumentModal}
                      toggleModal={toggleModal}
                      submitDocument={submitDocument}
                      isRestricted={isRestricted}
                      handleRestrictValue={handleRestrictValue}
                      imageFooterLoader={imageFooterLoader}
                      loadmoreImageData={loadmoreImageData}
                      handleMoreDocument={handleMoreDocument}
                      renderDocumentFooter={renderDocumentFooter}
                      handleMoreVideo={handleMoreVideo}
                      renderVideoFooter={renderVideoFooter}
                      animalDetails={animalDetails}
                      onRefreshImage={onRefreshImage}
                      refreshingImage={isRefreshing}
                      onRefreshDocument={onRefreshDocument}
                      refreshingDocument={isRefreshing}
                      onRefreshVideo={onRefreshVideo}
                      refreshingVideo={isRefreshing}
                      isLoading={isLoading}
                      deleteAnimalImage={deleteAnimalImage}
                      alertModalClose={alertModalClose}
                      bottomTitle={bottomTitle}
                      isModalVisible={isModalVisible}
                      firstButtonPress={firstButtonPress}
                      secondButtonPress={secondButtonPress}
                      documentDelete={documentDelete}
                      deleteVideo={deleteVideo}
                    />
                  ) : item.screen == "history" ? (
                    <History
                      default_sub_tab={encTab}
                      reduxColors={reduxColors}
                      animalLogHistory={animalLogHistory}
                      // animalMedicalDiagnosisDataCount={
                      //   animalMedicalDiagnosisDataCount
                      // }
                      // animalMedicalPrescriptionData={
                      //   animalMedicalPrescriptionData
                      // }
                      EnclosureHistoryData={EnclosureHistoryData}
                      enclosureHistoryInmate={enclosureHistoryInmate}
                      getEncloHistoryInmates={getEncloHistoryInmates}
                      setEnclosureHistoryInmate={setEnclosureHistoryInmate}
                      changeInnerName={changeEncTab}
                      themeColors={themeColors}
                      handleLoadMoreEncloHistory={handleLoadMoreEncloHistory}
                      renderFooterEncloHistory={renderFooterEncloHistory}
                      onRefreshInmates={onRefreshInmates}
                      refreshingInmates={isRefreshing}
                      onRefreshAnyother={onRefreshAnyother}
                      refreshingAnyother={isRefreshing}
                      setencInmateData={setencInmateData}
                      loginHistoryModalRef={loginHistoryModalRef}
                      setIsLoading={setIsLoading}
                      isLoading={isLoading}
                    />
                  ) : null}
                </View>
              </Tabs.Tab>
            );
          })}
        </Tabs.Container>

        <BottomSheetModalComponent ref={loginHistoryModalRef}>
          <InsideBottomsheet
            title="Inmates"
            type="inmateHistory"
            data={enclosureHistoryInmate}
            handleLoadMore={handleLoadMoreEncloHistory}
            renderLoginHistoryFooter={renderFooterEncloHistory}
            hideSearch={true}
          />
        </BottomSheetModalComponent>

        <FABComponent
          deleted={Boolean(Number(animalDetails.is_deleted))}
          mortalityInfoData={mortalityInfoData}
          animalDetails={animalDetails}
          fabStyle={reduxColors.fabStyle}
          actionButtonStyle={reduxColors.actionButtonStyle}
          actionButtonStyleTop={reduxColors.actionButtonStyleTop}
          navigateCom={navigateCom}
        />
        <Modal
          avoidKeyboard
          animationType="none"
          transparent={true}
          visible={showUpdate}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[reduxColors.container, { backgroundColor: "transparent" }]}
          >
            <TouchableWithoutFeedback>
              <View style={[reduxColors.modalOverlay]}>
                <View style={reduxColors.modalContainer}>
                  <View style={reduxColors.modalHeader}>
                    <View>
                      <Text
                        style={{
                          fontSize: FontSize.Antz_Minor_Title.fontSize,
                          color: themeColors.onPrimaryContainer,
                          fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                        }}
                      >
                        Add Updated{" Count "}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={reduxColors.closeBtn}
                    >
                      <Ionicons
                        name="close"
                        size={22}
                        color={themeColors.onSurface}
                        onPress={() => setShowUpdate(false)}
                      />
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={reduxColors.modalBody}>
                    <View style={reduxColors.commonBoxView}>
                      <TextInput
                        inputLabel={" Count"}
                        autoCompleteType="off"
                        placeholder={" Enter New Count"}
                        style={{
                          justifyContent: "center",
                          width: widthPercentageToDP(40),
                          borderWidth: 0.5,
                          borderRadius: 6,
                          borderColor: themeColors.onSurfaceVariant,
                          backgroundColor: themeColors.surface,
                          paddingHorizontal: widthPercentageToDP(2.5),
                          height: heightPercentageToDP(6.5),
                        }}
                        keyboardType="number-pad"
                        onChangeText={(text) => {
                          setErrorMessage({ UpdateCount: "" });
                          setUpdateCount(text);
                        }}
                      />
                      {errorMessage?.UpdateCount && (
                        <View style={{ textAlign: "left", width: "100%" }}>
                          <Text style={{ color: themeColors?.error }}>
                            {errorMessage?.UpdateCount}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={reduxColors.commonBoxView}>
                      <TextInput
                        autoCompleteType="off"
                        style={reduxColors.notesInput}
                        placeholder="Add Notes"
                        multiline
                        placeholderTextColor={themeColors.onErrorContainer}
                        onChangeText={(text) => {
                          setErrorMessage({ UpdateCountNote: "" });
                          setUpdateCountNote(text);
                        }}
                      />
                      {errorMessage?.UpdateCountNote && (
                        <View style={{ textAlign: "left", width: "100%" }}>
                          <Text style={{ color: themeColors?.error }}>
                            {errorMessage?.UpdateCountNote}
                          </Text>
                        </View>
                      )}
                    </View>
                  </ScrollView>
                </View>

                <View
                  style={{
                    width: "96%",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: themeColors.addBackground,
                    paddingVertical: heightPercentageToDP(8.5),
                    height: heightPercentageToDP(12),
                  }}
                >
                  <View style={reduxColors.commonBoxView}></View>
                  <TouchableOpacity
                    style={[reduxColors.modalBtnCover]}
                    onPress={() => {
                      NewCountSubmit();
                    }}
                  >
                    <Text style={reduxColors.bottomBtnTxt}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaProvider>
      {/* <DynamicAlert
        isVisible={isVisible}
        onClose={hideAlert}
        type={alertType}
        title={alertType === "success" ? "Success" : "Error"}
        message={alertMessage}
        onOK={handleOK}
        isCancelButton={false}
        onCancel={handleCancel}
      /> */}
    </>
  );
};

export default AnimalDetails;
// let AnimatedHeaderValue = new Animated.Value(0);

//const cardIcon = Header_Maximum_Height * 0.1;
//Max Height of the Header

export const FABComponent = ({
  deleted,
  mortalityInfoData,
  animalDetails,
  fabStyle,
  actionButtonStyle,
  actionButtonStyleTop,
  navigateCom,
}) => {
  let options = [
    // {
    //   icon: () => (
    //     <Ionicons
    //       name="arrow-redo-circle-outline"
    //       size={24}
    //       color={constThemeColor.neutralPrimary}
    //     />
    //   ),
    //   label: "Move",
    //   style: actionButtonStyleTop,
    //   onPress: () =>
    //     checkPermissionAndNavigate(
    //       permission,
    //       "approval_move_animal_internal",
    //       navigation,
    //       "AnimalMovement",
    //       paramsData
    //     ),
    // },
    {
      icon: () => (
        <MaterialCommunityIcons
          name="note-plus-outline"
          size={24}
          color={constThemeColor.onSecondaryContainer}
        />
      ),
      label: "Add Note",
      onPress: () => navigateCom(),
    },
    {
      icon: () => (
        <Ionicons
          name="arrow-redo-sharp"
          size={24}
          color={constThemeColor.onSecondaryContainer}
        />
      ),
      label: "Transfer",
      style: actionButtonStyleTop,
      onPress: () =>
        checkPermissionAndNavigate(
          permission,
          "approval_move_animal_external",
          navigation,
          "MoveAnimal",
          paramsData
        ),
    },
    {
      icon: () => (
        <MaterialCommunityIcons
          name="home-remove-outline"
          size={24}
          color={constThemeColor.onSecondaryContainer}
        />
      ),
      label: "Add Mortality",
      style: actionButtonStyleTop,
      onPress: () =>
        checkPermissionAndNavigate(
          permission,
          "access_mortality_module",
          navigation,
          "AddDisposition",
          paramsData
        ),
    },
    {
      icon: () => (
        <MaterialCommunityIcons
          name="home-plus-outline"
          size={24}
          color={constThemeColor.onSecondaryContainer}
        />
      ),
      label: "Add Medical",
      style: actionButtonStyleTop,
      onPress: () => navigateToMedical(),
    },
    {
      icon: "home",
      label: "Go to home",
      onPress: () => navigation.navigate("Home"),
      style: actionButtonStyle,
      labelStyle: actionButtonStyle,
    },
  ];
  const [iconOption, setIconOption] = useState(options);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const permission = useSelector((state) => state.UserAuth.permission);

  useEffect(() => {
    let data = options;

    //  Hide egg module
    if (animalDetails?.sex === "female") {
      data = [
        {
          icon: "plus",
          label: "Add Egg",
          style: actionButtonStyleTop,
          onPress: () => {
            navigatateToComp("EggsAddForm", "collection_animal_record_access");
            dispatch(setMotherAnimal(animalDetails));
          },
        },
        ...data,
      ];
    }
    if (
      (animalDetails?.type == "single" && animalDetails.mortality_count == 1) ||
      deleted ||
      animalDetails?.total_animal == animalDetails?.mortality_count ||
      animalDetails.active == "0"
    ) {
      data = data.filter((item) => item.label == "Go to home");
    }
    if (
      !checkPermissionAndNavigateWithAccess(
        permission,
        "medical_records_access",
        null,
        null,
        null,
        "ADD"
      )
    ) {
      data = data.filter((item) => item.label !== "Add medical");
    }
    if (animalDetails.in_transit) {
      data = data.filter((item) => item.label !== "Transfer");
    }
    setIconOption(data);
  }, [open]);

  const paramsData = {
    item: animalDetails,
    deleted: deleted,
    parentMotherData: true,
    cameFrom: "AnimalDetails",
  };
  const navigatateToComp = (screen, key) => {
    checkPermissionAndNavigateWithAccess(
      permission,
      key,
      navigation,
      screen,
      paramsData,
      "ADD"
    );
  };
  const navigateToMedical = () => {
    dispatch(setEditFromAnimalDetails(true));
    dispatch(setEffectListApiCall(true));
    navigatateToComp("AddMedical", "medical_records_access");
  };

  return (
    <FAB.Group
      open={open}
      visible
      fabStyle={fabStyle}
      icon={
        open
          ? () => (
              <Ionicons
                name="close"
                size={24}
                color={constThemeColor.neutralPrimary}
              />
            )
          : () => (
              <Feather
                name="more-horizontal"
                size={24}
                color={constThemeColor.neutralPrimary}
              />
            )
      }
      actions={iconOption}
      onStateChange={onStateChange}
      onPress={() => {
        if (open) {
        }
      }}
    />
  );
};

export const AppBar = ({
  header,
  style,
  title,
  mortalityInfoData,
  animalDetails,
  deleted,
  reduxColors,
  setShowUpdate,
}) => {
  const navigation = useNavigation();
  const [moreOptionData, setMoreOptionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const openMoreOption = () => setMoreOptionVisible(true);
  const closeMoreOption = () => setMoreOptionVisible(false);
  const permission = useSelector((state) => state.UserAuth.permission);

  useEffect(() => {
    setMoreOptionFn();
  }, [mortalityInfoData, animalDetails]);
  function setMoreOptionFn() {
    let options = [];
    if (mortalityInfoData.length > 0) {
      // if (animalDetails?.total_animal !== animalDetails?.mortality_count) {
      if (
        animalDetails?.is_deleted == "0" &&
        animalDetails?.is_alive == "1" &&
        animalDetails.active == "1"
      ) {
        options.push({
          id: 2,
          option: "Local Identifier",
          screen: "LocalIdentifier",
          key: "ADD",
        });
      }
      if (
        animalDetails.type === "group" &&
        animalDetails?.is_deleted == "0" &&
        animalDetails?.active == "1" &&
        !animalDetails.in_transit &&
        animalDetails?.animal_transfered == 0
      ) {
        options.push({
          id: 4,
          option: "Update Count",
          screen: null,
        });
      }
      // }
    } else {
      if (
        animalDetails?.is_deleted == "0" &&
        animalDetails?.is_alive == "1" &&
        animalDetails.active == "1"
      ) {
        options.push({
          id: 2,
          option: "Local Identifier",
          screen: "LocalIdentifier",
          key: "ADD",
        });
      }

      if (
        animalDetails.type === "group" &&
        animalDetails?.is_deleted == "0" &&
        animalDetails?.active == "1" &&
        !animalDetails.in_transit &&
        animalDetails?.animal_transfered == 0
      ) {
        options.push({
          id: 4,
          option: "Update Count",
          screen: null,
        });
      }
    }
    // options.push({
    //   id: 3,
    //   option: "QR Code",
    //   screen: "ProfileQr",
    //   key: "VIEW",
    // });
    setMoreOptionData(options);
  }
  const optionPress = (item) => {
    if (item.option == "Update Count") {
      if (
        checkPermissionAndNavigateWithAccess(
          permission,
          "collection_animal_record_access",
          null,
          null,
          null,
          "EDIT"
        )
      ) {
        setShowUpdate(true);
      }
    } else {
      if (item.screen !== "") {
        checkPermissionAndNavigateWithAccess(
          permission,
          "collection_animal_record_access",
          navigation,
          item.screen,
          {
            item: animalDetails,
            deleted: deleted,
          },
          item.key
        );
      }
    }
  };

  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  return (
    <AnimatedHeader
      optionData={moreOptionData}
      optionPress={optionPress}
      title={capitalize(animalDetails.vernacular_name) ?? capitalize(title)}
      style={style}
      header={header}
      qrCard={true}
    />
  );
};
export const Header = ({
  imageBackground,
  scientificName,
  sex,
  localId,
  enclosure,
  title,
  label,
  birthDate,
  header,
  dead,
  animalDetails,
  mortalityInfoData,
  deleted,
  getScrollPositionOfTabs,
  reduxColors,
  tabBarBorderRadius,
  getHeaderHeight,
  UpdateCountModal,
  section,
  site,
  animal_id,
  permission,
}) => {
  const dob = moment(birthDate);
  const today = moment(new Date());
  const navigation = useNavigation();

  const gotoBack = () => navigation.goBack();

  const duration = moment.duration(today.diff(dob));
  const years = duration._data.years;
  const months = duration._data.months;
  const days = duration._data.days;

  {
    /*
        author : Arnab
        date: 3.5.23
        desc: added for more function
      */
  }
  const [moreOptionVisible, setMoreOptionVisible] = useState(false);
  const [moreOptionData, setMoreOptionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const openMoreOption = () => setMoreOptionVisible(true);
  const closeMoreOption = () => setMoreOptionVisible(false);

  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const themeColors = useSelector((state) => state.darkMode.theme.colors);

  const { top, height } = useHeaderMeasurements();
  getHeaderHeight(height.value);
  const scrollY = useCurrentTabScrollY();
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 200],
      [1, 0],
      Extrapolate.CLAMP
    );
    runOnJS(getScrollPositionOfTabs)(scrollY.value);
    return {
      opacity,
    };
  });
  const [sliderImages, setSliderImages] = useState([]);

  useEffect(() => {
    if (animalDetails?.banner_images) {
      const imageObjectsArray = animalDetails?.banner_images.map((item) => ({
        img: item.image_path,
      }));

      setSliderImages(imageObjectsArray);
    }
  }, [animalDetails?.banner_images]);

  const overlayBody = (
    <>
      <Text
        style={[
          reduxColors.name,
          reduxColors.textShadow,
          {
            fontSize:
              String(title).length > 17
                ? heightPercentageToDP(3)
                : heightPercentageToDP(3.4),
          },
        ]}
      >
        {capitalize(String(title))}
      </Text>
      <Text style={[reduxColors.scientificName, reduxColors.textShadow]}>
        {scientificName ? <Text>({scientificName})</Text> : ""}
      </Text>
      {animalDetails?.type == "group" ? (
        <View style={reduxColors.sexAndAge}>
          <Text style={[reduxColors.sex, reduxColors.textShadow]}>
            Total Count:
          </Text>
          <Text style={[reduxColors.sexValue, reduxColors.textShadow]}>
            {" "}
            {animalDetails.total_animal}
          </Text>
        </View>
      ) : null}
      <View style={reduxColors.sexAndAge}>
        {sex && (
          <Text style={[reduxColors.sex, reduxColors.textShadow]}>
            Sex:
            <Text style={[reduxColors.sexValue, reduxColors.textShadow]}>
              {" "}
              {sex ? sex?.charAt(0).toUpperCase() + sex?.slice(1) : ""}
            </Text>
          </Text>
        )}
        {animalDetails?.life_stage_name ? (
          <Text
            style={[
              reduxColors.sex,
              reduxColors.textShadow,
              { paddingHorizontal: 10 },
            ]}
          >
            Life Stage:
            <Text style={[reduxColors.sexValue, reduxColors.textShadow]}>
              {" "}
              {animalDetails.life_stage_name}
            </Text>
          </Text>
        ) : null}
      </View>
      {enclosure && (
        <View style={[reduxColors.enclosureAndRingId, { width: "80%" }]}>
          <Text style={[reduxColors.sex, reduxColors.textShadow]}>Encl:</Text>
          <Text
            ellipsizeMode="tail"
            numberOfLines={2}
            style={[
              reduxColors.sexValue,
              reduxColors.textShadow,
              // { textTransform: "uppercase" },
            ]}
          >
            {" "}
            {ifEmptyValue(enclosure)}
          </Text>
        </View>
      )}
      {section && (
        <View style={[reduxColors.enclosureAndRingId, { width: "80%" }]}>
          <Text style={[reduxColors.sex, reduxColors.textShadow]}>Sec:</Text>
          <Text
            ellipsizeMode="tail"
            numberOfLines={2}
            style={[
              reduxColors.sexValue,
              reduxColors.textShadow,
              { textTransform: "capitalize" },
            ]}
          >
            {" "}
            {ifEmptyValue(section)}
          </Text>
        </View>
      )}
      {site && (
        <View style={[reduxColors.enclosureAndRingId, { width: "80%" }]}>
          <Text style={[reduxColors.sex, reduxColors.textShadow]}>Site:</Text>
          <Text
            ellipsizeMode="tail"
            numberOfLines={2}
            style={[reduxColors.sexValue, reduxColors.textShadow]}
          >
            {" "}
            {ifEmptyValue(site)}
          </Text>
        </View>
      )}
      {localId ? (
        <View style={[reduxColors.enclosureAndRingId, { width: "80%" }]}>
          <Text style={[[reduxColors.sex, reduxColors.textShadow]]}>
            {label ? label : "Local Id"}:
          </Text>
          <Text
            ellipsizeMode="tail"
            numberOfLines={2}
            style={[reduxColors.sexValue, reduxColors.textShadow]}
          >
            {" "}
            {ifEmptyValue(localId)}
          </Text>
        </View>
      ) : animalDetails.animal_id ? (
        <View style={[reduxColors.enclosureAndRingId, { width: "80%" }]}>
          <Text style={[[reduxColors.sex, reduxColors.textShadow]]}>
            Animal Id:
          </Text>
          <Text
            ellipsizeMode="tail"
            numberOfLines={2}
            style={[reduxColors.sexValue, reduxColors.textShadow]}
          >
            {" "}
            {ifEmptyValue(animalDetails.animal_id)}
          </Text>
        </View>
      ) : null}
      <View style={reduxColors.tagAndHash}>
        {animalDetails?.type == "single" && animalDetails?.is_alive == 0 ? (
          <View style={[reduxColors.deadContainer, reduxColors.boxShadow]}>
            <MaterialIcons
              name="sentiment-dissatisfied"
              size={20}
              color={themeColors.onPrimary}
            />
            {/* {animalDetails?.type == "group" && (
                      <Text style={reduxColors.deadText}>{`${
                        animalDetails?.mortality_count
                      }/${ifEmptyValue(animalDetails?.total_animal)}`}</Text>
                    )} */}
            <Text style={reduxColors.deadText}>Dead</Text>
          </View>
        ) : null}
        {deleted ? (
          <View style={[reduxColors.deadContainer, reduxColors.boxShadow]}>
            <Entypo
              name="circle-with-cross"
              size={20}
              color={themeColors.onPrimary}
            />
            <Text style={reduxColors.deadText}>Deleted</Text>
          </View>
        ) : null}
        {animalDetails?.in_transit ? (
          <TouchableOpacity
            style={[
              reduxColors.deadContainer,
              { backgroundColor: themeColors?.tertiaryContainer },
            ]}
            onPress={() =>
              checkPermissionAndNavigate(
                permission,
                "approval_move_animal_external",
                navigation,
                "ApprovalSummary",
                {
                  animal_movement_id: animalDetails?.animal_movement_id,
                  screen: "without_qr",
                }
              )
            }
          >
            {/* <Entypo
                        name="circle-with-cross"
                        size={20}
                        color={themeColors.onPrimary}
                      /> */}
            <Text
              style={[
                FontSize.Antz_Subtext_Regular,
                { color: themeColors?.onTertiaryContainer },
              ]}
            >
              In Transit
            </Text>
          </TouchableOpacity>
        ) : null}
        {animalDetails?.type == "group" ? (
          <View style={[reduxColors.tagContainer, reduxColors.boxShadow]}>
            <Text style={reduxColors.tagText}>
              <Text
                style={{
                  fontSize: FontSize.Antz_Body_Title.fontSize,
                  fontWeight: FontSize.Antz_Body_Title.fontWeight,
                }}
              >
                Group
              </Text>{" "}
            </Text>
          </View>
        ) : null}
        {/* <View style={reduxColors.tagAndHash}>
                  <View
                    style={[reduxColors.tagContainer, reduxColors.boxShadow]}
                  >
                    <Text style={reduxColors.tagText}>
                      <Text
                        style={{
                          fontSize: FontSize.Antz_Body_Title.fontSize,
                          fontWeight: FontSize.Antz_Body_Title.fontWeight,
                        }}
                      >
                        3
                      </Text>{" "}
                      Open tags
                    </Text>
                  </View>
                  <View
                    style={[reduxColors.hashContainer, reduxColors.boxShadow]}
                  >
                    <Text style={reduxColors.hashText}>#breeding</Text>
                  </View>
                </View> */}
      </View>
    </>
  );

  return (
    <>
      <View style={styles.headerContainer}>
        <View
          style={{
            backgroundColor: themeColors.onSurfaceVariant,
            justifyContent: "flex-end",
          }}
        >
          <Animated.View
            style={[
              animatedStyle,
              { zIndex: 0, paddingTop: sliderImages.length == 0 ? 70 : 0 },
            ]}
          >
            <View
              style={{
                justifyContent: "flex-end",
                paddingBottom: sliderImages.length == 0 ? Spacing.minor : 0,
              }}
            >
              <Animated.View
                style={{
                  height: "auto",
                  justifyContent: "flex-end",
                  marginHorizontal:
                    sliderImages.length == 0 ? Spacing.major : 0,
                }}
              >
                {sliderImages.length > 0 ? (
                  <View style={{ width: "100%" }}>
                    <SliderComponent
                      screen={"animalDetails"}
                      child={
                        <View
                          style={{
                            marginHorizontal: Spacing.body,
                          }}
                        >
                          {overlayBody}
                        </View>
                      }
                      isGroup={animalDetails?.type == "group" ? true : false}
                      noNavigation={true}
                      autoPlay={true}
                      imageData={sliderImages}
                      navigation={navigation}
                      showIndicator={true}
                      animalDetailsOnly={true}
                    />
                  </View>
                ) : (
                  overlayBody
                )}
              </Animated.View>
            </View>
          </Animated.View>
        </View>
      </View>
    </>
  );
};

// PAGES ARE TEMPORARILY CREATED HERE
// About func removed

const Measurements = ({
  navigation,
  animalDetails,
  animalId,
  themeColors,
  reduxColors,
  birthDate,
  screen,
  dead,
  deleted,
  active,
  permission,
  measurementDetails,
  getMeasurment,
  measurementTypes,
  getConfigData,
  onRefreshMeasurements,
  refreshingMeasurements,
}) => {
  const [toggleMeasurementModal, setToggleMeasurementModal] = useState(false);
  const [measurementTypesforAnimal, setMeasurementTypesforAnimal] = useState(
    []
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const [visible, setVisible] = useState(false);
  const [unitValue, setUnitValue] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [measurementValue, setMeasurementValue] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const formattedTime = selectedTime?.toLocaleTimeString([], { hour12: false });

  const [notes, setNotes] = useState("");
  const [selectedMeasurement, setSelectedMeasurement] = useState({
    measurement_name: "",
    measurement_type: "",
    measurement_type_id: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [errorUnitMessage, setErrorUnitMessage] = useState("");
  const [UnitError, setUnitError] = useState(false);
  const [up, setUp] = useState(false);
  const { showToast } = useToast();

  const validation = () => {
    setError(false);
    setErrorMessage("");
    setUnitError(false);
    setErrorUnitMessage("");
    if (!measurementValue) {
      setError(true);
      setErrorMessage("Enter value");
      return false;
    }
    if (!selectedUnitId) {
      setUnitError(true);
      setErrorUnitMessage("Select unit");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (toggleMeasurementModal) {
      setSelectedDate(new Date());
      setSelectedUnitId("");
      setMeasurementValue("");
      setError(false);
      setErrorMessage("");
      setUnitError(false);
      setErrorUnitMessage("");
      setNotes("");
    }
  }, [toggleMeasurementModal]);

  const handelMeasurmentSubmit = () => {
    if (validation()) {
      const obj = {
        animal_id: animalId,
        measurement_type_id: selectedMeasurement.measurement_type_id,
        measurement_unit_id: selectedUnitId,
        measurement_value: measurementValue,
        record_date: moment(selectedDate).format("YYYY-MM-DD"),
        comments: notes,
        record_time: formattedTime,
        // moment(selectedTime).format("HH-MM-SS")
      };
      setIsLoading(true);
      addAnimalMeasurment(obj)
        .then((response) => {
          if (response.success) {
            setSelectedDate(new Date());
            setSelectedUnitId("");
            setMeasurementValue("");
            setNotes("");
            showToast("success", response?.message);
            getMeasurment();
            // setAlertType("success");
            // setAlertMessage("Measurement Added successfully");
          } else {
            showToast("error", response?.message);
          }
        })
        .catch((e) => {
          // setAlertType("error");
          // setAlertMessage("Something Went Wrong");
          showToast("error", "Oops! Something went wrong!");
        })
        .finally(() => {
          setIsLoading(false);
          setToggleMeasurementModal(false);
          // showAlert();
        });
    }
  };
  const showAlert = () => {
    setIsVisible(true);
  };

  useEffect(() => {
    if (selectedMeasurement.measurement_type) {
      getMeasurmentUnit(selectedMeasurement.measurement_type)
        .then(({ data }) => {
          setUnitValue(data);
        })
        .catch((error) => {
          showToast("error", "Oops! Something went wrong!");
        });
    }
  }, [selectedMeasurement.measurement_type]);

  const openMenu = () => setVisible(!visible);
  const closeMenu = () => setVisible(false);
  const searchSelectData = (data) => {
    let measurements = data.map((item) => {
      return {
        id: item.id,
        is_active: Number(item.is_active),
      };
    });
    let obj = {
      animal_id: animalDetails.animal_id,
      measurement_type_ids: JSON.stringify(measurements),
    };
    saveMeasurementConfig(obj)
      .then((response) => {
        getConfigData();
        getMeasurment();
      })
      .catch((error) => {
        showToast("error", "Oops! Something went wrong!");
      });
  };

  const handleOK = () => {
    setIsVisible(false);
    if (alertType === "success") {
      setToggleMeasurementModal(false);
    }
  };
  const handleCancel = () => {
    setToggleMeasurementModal(false);
    setIsVisible(false);
  };

  const hideAlert = () => {
    setIsVisible(false);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(!isTimePickerVisible);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };
  const handleConfirmTime = (date) => {
    hideTimePicker();
    setSelectedTime(date);
  };

  const renderItem = (item, index, length) => {
    let diff = moment().diff(moment(item?.record_date), "days");
    let time = item?.record_time && item?.record_time;
    let timeMoment = moment(time, "HH:mm:ss");
    let ShowTime = timeMoment.format("LT");
    let day = "";
    if (diff == 0) {
      day = "Today";
    } else if (diff == 1) {
      day = "Yesterday";
    } else {
      day = diff + " Days ago";
    }

    if (index == 0) {
      return null;
    }
    // const themeColors = useSelector((state) => state.darkMode.theme.colors);
    // // const dynamicStyles = styles(themeColors);
    return (
      <>
        <View
          style={{
            minWidth: widthPercentageToDP(15),
            minHeight: heightPercentageToDP(6),
            flexDirection: "column",
            justifyContent: "space-evenly",
            paddingRight: 5,
            paddingVertical: 15,
            backgroundColor: "red",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                color: themeColors.outline,
                fontWeight: FontSize.Antz_Major_Title.fontWeight,
                fontSize: FontSize.Antz_Major_Title.fontSize,
              }}
            >
              {item?.measurement_value}
            </Text>
            <Text
              style={{
                // position: "absolute",
                marginTop: 7,
                marginLeft: 3,
                bottom: 0,
                right: 0,
                color: themeColors.outline,
                fontSize: FontSize.Antz_Body_Title.fontSize,
                fontWeight: FontSize.Antz_Body_Title.fontWeight,
              }}
            >
              {item?.measurement_uom_abbr}
            </Text>
          </View>
          <Text
            style={{
              // fontWeight: FontSize.Antz_Body_Regular.fontWeight,
              // fontSize: FontSize.Antz_Minor_Title.fontSize,
              fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
              fontSize: FontSize.Antz_Subtext_Regular.fontSize,
              color: themeColors.onSecondaryContainer,
              textAlign: "left",
            }}
          >
            {day} {day == "Today" ? ShowTime : ""}
          </Text>
        </View>
        {length - 1 == index ? null : (
          <View
            style={{
              width: 1,
              height: 70,
              backgroundColor: themeColors.outlineVariant,
              marginHorizontal: 10,
            }}
          />
        )}
      </>
    );
  };
  const toggleAssignUser = () => {
    setToggleMeasurementModal(!toggleMeasurementModal);
  };
  return (
    <>
      <Tabs.ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Loader visible={isLoading} />

        <View
          style={[
            reduxColors.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {dead || deleted ? null : (
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginTop: heightPercentageToDP(2),
                    height: heightPercentageToDP(6),
                    width: widthPercentageToDP(90),
                    borderRadius: 8,
                    // backgroundColor: themeColors.secondaryContainer,
                    backgroundColor: themeColors.secondary,
                  }}
                  onPress={() => {
                    // getConfigData(),
                    checkPermissionAndNavigateWithAccess(
                      permission,
                      "collection_animal_record_access",
                      navigation,
                      "SearchWithCheck",
                      {
                        name: "Measurement Type",
                        listData: measurementTypes,
                        onGoBack: (e) => searchSelectData(e),
                        add: () => getConfigData(),
                      },
                      "ADD"
                    );
                  }}
                >
                  <AntDesign
                    name="plus"
                    size={24}
                    // color={themeColors.on05.09.23mary}
                    onPrimary
                    style={{ fontWeight: "bold" }}
                  />
                  <Text
                    style={{
                      marginLeft: widthPercentageToDP(2),
                      // color: themeColors.onSecondaryContainer,
                      color: themeColors.onPrimary,
                      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                      fontSize: FontSize.Antz_Minor_Medium.fontSize,
                    }}
                  >
                    Add Measurement Type
                  </Text>
                </TouchableOpacity>
              )}
              {dead && measurementDetails?.length == 0 ? (
                <ListEmpty visible={isLoading} />
              ) : (
                <FlatList
                  data={measurementDetails}
                  keyExtractor={(item, index) => index?.toString()}
                  renderItem={(value) => {
                    let diff =
                      value?.item?.measurements &&
                      value?.item?.measurements?.length > 0 &&
                      moment().diff(
                        moment(value?.item?.measurements[0]?.record_date),
                        "days"
                      );
                    let time =
                      value?.item?.measurements &&
                      value?.item?.measurements?.length > 0 &&
                      value?.item?.measurements[0]?.record_time &&
                      value?.item?.measurements[0]?.record_time;
                    let timeMoment = moment(time, "HH:mm:ss");
                    let ShowTime = timeMoment.format("LT");
                    let day = "";
                    if (diff == 0) {
                      day = "Today";
                    } else if (diff == 1) {
                      day = "Yesterday";
                    } else {
                      day = diff + " Days ago";
                    }
                    return (
                      <>
                        <View
                          style={{
                            backgroundColor: themeColors.surface,
                            marginTop: heightPercentageToDP(2),
                            borderRadius: 8,
                            paddingHorizontal: widthPercentageToDP(0),
                            width: widthPercentageToDP(90),
                          }}
                        >
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("MeasurementSummary", {
                                animal_id: animalDetails.animal_id,
                                animalData: animalDetails,
                                type: value?.item?.measurement_name,
                                measurmentId:
                                  selectedMeasurement.measurement_type_id,
                                measurmentType:
                                  selectedMeasurement.measurement_type,
                                dead: dead,
                                deleted: deleted,
                              })
                            }
                          >
                            <View
                              style={{
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexDirection: "row",
                                paddingBottom: 10,
                                borderTopRightRadius: 8,
                                borderTopLeftRadius: 8,
                                paddingTop: 8,
                                paddingHorizontal: widthPercentageToDP(2),
                                marginBottom: 5,
                                // backgroundColor: themeColors.displaybgSecondary,
                                backgroundColor: themeColors.secondaryContainer,
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    // marginLeft: widthPercentageToDP(2),
                                    marginLeft: 16,
                                    color: themeColors.onSecondaryContainer,
                                    fontWeight:
                                      FontSize.Antz_Body_Title.fontWeight,
                                    fontSize: FontSize.Antz_Body_Title.fontSize,
                                  }}
                                >
                                  {value?.item?.measurement_name}
                                </Text>
                                <Feather
                                  name="chevron-right"
                                  size={23}
                                  color={themeColors.onSecondaryContainer}
                                />
                              </View>
                              {dead || deleted ? null : (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Ionicons
                                    name="add-circle-outline"
                                    onPress={() => {
                                      if (
                                        checkPermissionAndNavigateWithAccess(
                                          permission,
                                          "collection_animal_record_access",
                                          null,
                                          null,
                                          null,
                                          "ADD"
                                        )
                                      ) {
                                        setSelectedMeasurement({
                                          ...selectedMeasurement,
                                          measurement_name:
                                            value?.item?.measurement_name,
                                          measurement_type:
                                            value?.item?.measurement_type,
                                          measurement_type_id:
                                            value?.item?.measurement_id,
                                        });
                                        setSelectedTime(new Date());
                                        setToggleMeasurementModal(true);
                                      } else {
                                        warningToast(
                                          "Restricted",
                                          "You do not have permission to access!!"
                                        );
                                      }
                                    }}
                                    size={30}
                                    color={themeColors.skyblue}
                                  />
                                </View>
                              )}
                            </View>
                          </TouchableOpacity>
                          {value?.item?.measurements &&
                          value?.item?.measurements?.length > 0 ? (
                            <View
                              style={{
                                flexDirection: "row",
                                paddingHorizontal: widthPercentageToDP(3),
                                position: "relative",
                              }}
                            >
                              {/* <View
                                style={{
                                  backgroundColor: themeColors.surface,
                                  height: 70,
                                  width: 30,
                                  position: "absolute",
                                  right: 0,
                                  zIndex: 99,
                                  opacity: 0.7,
                                }}
                              ></View> */}

                              <View
                                style={{
                                  minWidth: widthPercentageToDP(15),
                                  minHeight: heightPercentageToDP(6),
                                  flexDirection: "column",
                                  justifyContent: "space-evenly",
                                  paddingRight: 5,
                                  paddingVertical: 15,
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: themeColors.onSurface,
                                      fontWeight:
                                        FontSize.Antz_Major_Title.fontWeight,
                                      fontSize:
                                        FontSize.Antz_Major_Title.fontSize,
                                    }}
                                  >
                                    {
                                      value?.item?.measurements[0]
                                        ?.measurement_value
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      marginTop: 7,
                                      marginLeft: 3,
                                      bottom: 0,
                                      right: 0,
                                      color: themeColors.outline,
                                      fontSize:
                                        FontSize.Antz_Body_Title.fontSize,
                                      fontWeight:
                                        FontSize.Antz_Body_Title.fontWeight,
                                    }}
                                  >
                                    {
                                      value?.item?.measurements[0]
                                        ?.measurement_uom_abbr
                                    }
                                  </Text>
                                </View>
                                <Text
                                  style={{
                                    fontWeight:
                                      //   FontSize.Antz_Minor_Title.fontWeight,
                                      // fontSize: FontSize.Antz_Minor_Title.fontSize,
                                      FontSize.Antz_Subtext_title.fontWeight,
                                    fontSize:
                                      FontSize.Antz_Subtext_title.fontSize,
                                    color: themeColors.onSecondaryContainer,
                                    // textAlign: "center",
                                    textAlign: "left",
                                  }}
                                >
                                  {day} {day == "Today" ? ShowTime : ""}
                                </Text>
                              </View>

                              <View
                                style={{
                                  width: 1,
                                  height: 70,
                                  backgroundColor: themeColors.outlineVariant,
                                  marginHorizontal: 10,
                                }}
                              />
                              <FlatList
                                data={value?.item?.measurements}
                                keyExtractor={(item, index) =>
                                  index?.toString()
                                }
                                showsHorizontalScrollIndicator={false}
                                horizontal
                                renderItem={({ item, index }) =>
                                  renderItem(
                                    item,
                                    index,
                                    value?.item?.measurements?.length
                                  )
                                }
                              />
                            </View>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                if (
                                  checkPermissionAndNavigateWithAccess(
                                    permission,
                                    "collection_animal_record_access",
                                    null,
                                    null,
                                    null,
                                    "ADD"
                                  )
                                ) {
                                  setSelectedMeasurement({
                                    ...selectedMeasurement,
                                    measurement_name:
                                      value?.item?.measurement_name,
                                    measurement_type:
                                      value?.item?.measurement_type,
                                    measurement_type_id:
                                      value?.item?.measurement_id,
                                  });
                                  setSelectedTime(new Date());
                                  setToggleMeasurementModal(true);
                                } else {
                                  warningToast(
                                    "Restricted",
                                    "You do not have permission to access!!"
                                  );
                                }
                              }}
                              disabled={
                                dead || deleted || active ? true : false
                              }
                            >
                              <View
                                style={{
                                  minWidth: 70,
                                  height: 60,
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  paddingRight: 5,
                                  marginBottom: 10,
                                }}
                              >
                                <View
                                  style={{
                                    borderWidth: 1,
                                    padding: 12,
                                    borderColor: themeColors.outline,
                                    borderRadius: 8,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: themeColors.onSurface,
                                      fontSize:
                                        FontSize.Antz_Body_Title.fontSize,
                                      fontWeight:
                                        FontSize.Antz_Body_Title.fontWeight,
                                    }}
                                  >
                                    Add {value?.item?.measurement_name}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          )}
                        </View>
                      </>
                    );
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshingMeasurements}
                      onRefresh={onRefreshMeasurements}
                      style={{
                        color: reduxColors.blueBg,
                        marginTop:
                          Platform.OS == "ios"
                            ? 0
                            : (Spacing.body + Spacing.small) * 3,
                      }}
                      enabled={true}
                    />
                  }
                />
              )}
              {/* <DynamicAlert
                isVisible={isVisible}
                onClose={hideAlert}
                type={alertType}
                title={alertType === "success" ? "Success" : "Error"}
                message={alertMessage}
                onOK={handleOK}
                // isCancelButton={alertType === "success" ? true : false}
                onCancel={handleCancel}
              /> */}
            </View>
          </ScrollView>

          {/* Modal Dropdown */}
          <Modal
            avoidKeyboard
            animationType="none"
            transparent={true}
            visible={toggleMeasurementModal}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={[
                reduxColors.container,
                { backgroundColor: "transparent" },
              ]}
            >
              <TouchableWithoutFeedback onPress={toggleAssignUser}>
                <View style={[reduxColors.modalOverlay]}>
                  <View style={reduxColors.modalContainer}>
                    <View style={reduxColors.modalHeader}>
                      <View>
                        <Text
                          style={{
                            fontSize: FontSize.Antz_Minor_Title.fontSize,
                            color: themeColors.onPrimaryContainer,
                            fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                            // lineHeight: 19,
                          }}
                        >
                          Add new{" "}
                          {selectedMeasurement?.measurement_name?.toLocaleLowerCase()}
                        </Text>
                      </View>
                      <TouchableOpacity
                        activeOpacity={1}
                        style={reduxColors.closeBtn}
                        // onPress={handleToggleCommDropdown}
                      >
                        <Ionicons
                          name="close"
                          size={22}
                          color={themeColors.onSurface}
                          onPress={() => setToggleMeasurementModal(false)}
                        />
                      </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <View style={reduxColors.modalBody}>
                        <View style={reduxColors.commonBoxView1}>
                          <TouchableOpacity
                            onPress={() => {
                              let date = moment(
                                animalDetails?.birth_date
                              )?.format("MMMM Do YYYY");
                              let date1 = moment(new Date())?.format(
                                "MMMM Do YYYY"
                              );
                              if (date != date1) {
                                showDatePicker();
                              } else {
                                showToast(
                                  "error",
                                  "Oops! You can't select date for a new born animal!"
                                );
                              }
                            }}
                            style={[
                              reduxColors.animalCardStyle1,
                              {
                                minHeight: heightPercentageToDP(7),
                              },
                            ]}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                // paddingRight: 5,
                              }}
                            >
                              <Text style={reduxColors.animalTextStyle}>
                                {moment(selectedDate).format("DD MMM YYYY")}
                              </Text>
                              <MaterialCommunityIcons
                                name="calendar-refresh-outline"
                                size={18}
                                color={themeColors.onSurfaceVariant}
                                // style={{ marginRight: widthPercentageToDP(4) }}
                              />
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              // let date = moment(
                              //   animalDetails?.birth_date
                              // )?.format("MMMM Do YYYY");
                              // let date1 = moment(new Date())?.format(
                              //   "MMMM Do YYYY"
                              // );
                              // if (date != date1) {
                              showTimePicker();
                              // } else {
                              //   showToast(
                              //     "error",
                              //     "Oops! You can't select date for a new born animal!"
                              //   );
                              // }
                            }}
                            style={[
                              reduxColors.animalCardStyle1,
                              {
                                minHeight: heightPercentageToDP(7),
                              },
                            ]}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                // paddingRight: 5,
                              }}
                            >
                              <Text style={reduxColors.animalTextStyle}>
                                {moment(selectedTime)?.format("LT") ?? ""}
                                {/* {moment(selectedDate).format("DD MMM YYYY")} */}
                              </Text>
                              {/* <MaterialCommunityIcons
                                name="calendar-refresh-outline"
                                size={18}
                                color={themeColors.onSurfaceVariant}
                                // style={{ marginRight: widthPercentageToDP(4) }}
                              /> */}
                              <Entypo
                                name="clock"
                                size={18}
                                color={themeColors.onSurfaceVariant}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            width: widthPercentageToDP(50),
                          }}
                        >
                          <View style={reduxColors.commonBoxView}>
                            <TextInput
                              autoCompleteType="off"
                              style={{
                                justifyContent: "center",
                                width: widthPercentageToDP(20),
                                borderWidth: 0.5,
                                borderRadius: 6,
                                borderColor: themeColors.onSurfaceVariant,
                                backgroundColor: themeColors.surface,
                                paddingHorizontal: widthPercentageToDP(2.5),
                                height: heightPercentageToDP(6.5),
                              }}
                              keyboardType="decimal-pad"
                              placeholder="00"
                              onChangeText={(text) => {
                                setError(false);
                                setMeasurementValue(text);
                              }}
                            />
                            {error && (
                              <View
                                style={{ textAlign: "left", width: "100%" }}
                              >
                                <Text style={{ color: themeColors?.error }}>
                                  {errorMessage}
                                </Text>
                              </View>
                            )}
                          </View>

                          <TouchableOpacity
                            style={[
                              reduxColors.commonBoxView,
                              { marginLeft: widthPercentageToDP(2.5) },
                            ]}
                          >
                            <SelectDropdown
                              onFocus={() => {
                                setUp(true);
                              }}
                              onBlur={() => {
                                setUp(false);
                              }}
                              defaultButtonText="select unit"
                              selectedRowStyle={{
                                backgroundColor: themeColors.surface,
                              }}
                              showsVerticalScrollIndicator={false}
                              buttonStyle={{
                                borderWidth: 0.5,
                                borderRadius: 6,
                                borderColor: themeColors.onSurfaceVariant,
                                backgroundColor: themeColors.surface,
                                width: widthPercentageToDP(27),
                                height: heightPercentageToDP(6.5),
                              }}
                              data={unitValue}
                              onSelect={(selectedItem, index) => {
                                setUnitError(false);
                                setSelectedUnitId(selectedItem?.id);
                              }}
                              rowStyle={{
                                borderBottomWidth: 0,
                                height: heightPercentageToDP(6),
                              }}
                              dropdownStyle={{
                                height: heightPercentageToDP(15),
                                paddingHorizontal: 5,
                                borderWidth: 0.5,
                                backgroundColor: themeColors.onPrimary,
                                borderRadius: 5,
                              }}
                              buttonTextAfterSelection={(
                                selectedItem,
                                index
                              ) => {
                                return selectedItem?.uom_abbr;
                              }}
                              buttonTextStyle={{
                                textAlign: "left",
                                fontSize: FontSize.Antz_Body_Title.fontSize,
                                fontWeight:
                                  FontSize.Antz_Subtext_Regular.fontWeight,
                              }}
                              rowTextForSelection={(item, index) => {
                                return item?.uom_abbr;
                              }}
                              rowTextStyle={{
                                textAlign: "left",
                                fontSize: FontSize.Antz_Body_Title.fontSize,
                              }}
                              renderDropdownIcon={() => {
                                return (
                                  <>
                                    {up ? (
                                      <MaterialIcons
                                        name="keyboard-arrow-up"
                                        size={24}
                                        color="black"
                                      />
                                    ) : (
                                      <MaterialIcons
                                        name="keyboard-arrow-down"
                                        size={24}
                                        color="black"
                                      />
                                    )}
                                  </>
                                );
                              }}
                            />

                            {UnitError && (
                              <View
                                style={{ textAlign: "left", width: "100%" }}
                              >
                                <Text style={{ color: themeColors?.error }}>
                                  {errorUnitMessage}
                                </Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        </View>
                        <View style={reduxColors.itemRow}>
                          <TextInput
                            autoCompleteType="off"
                            style={reduxColors.notesInput}
                            placeholder="Add Notes"
                            multiline
                            placeholderTextColor={themeColors.onErrorContainer}
                            onChangeText={(text) => setNotes(text)}
                          />
                        </View>
                      </View>
                    </ScrollView>

                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      minimumDate={new Date(birthDate)}
                      maximumDate={new Date()}
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                    />

                    <DateTimePickerModal
                      isVisible={isTimePickerVisible}
                      mode="time"
                      locale="en_GB"
                      date={new Date()}
                      // display="spinner"
                      is24Hour={true}
                      onConfirm={handleConfirmTime}
                      onCancel={hideTimePicker}
                    />
                  </View>

                  <View
                    style={{
                      width: "96%",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: themeColors.addBackground,
                      paddingVertical: 20,
                      height: heightPercentageToDP(12),
                    }}
                  >
                    <TouchableOpacity
                      style={[reduxColors.modalBtnCover]}
                      onPress={handelMeasurmentSubmit}
                    >
                      <Text style={reduxColors.bottomBtnTxt}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </Modal>
        </View>
      </Tabs.ScrollView>
    </>
  );
};
const Medical = ({
  animalDetails,
  default_sub_tab,
  themeColors,
  reduxColors,
  animalMedicalList,
  medicalBasicData,
  animalMedicalAdverseRxData,
  onRemoveSideEffectFun,
  type,
  toggleActive,
  toggleClosed,
  prescriptionType,
  toggleActivePrescription,
  toggleClosedPrescription,
  animalMedicalDiagnosisData,
  animalMedicalDiagnosisDataCount,
  animalMedicalPrescriptionData,
  handleMoreDiagnosis,
  renderDiagnosisFooter,
  animalPrescriptionCount,
  handleLoadMorePrescription,
  renderFooterPrescription,
  handleLoadMoreAdverseRx,
  renderFooterAdverseRx,
  changeInnerName,
  getMedicalPrescriptionData,
  animalMedicalLabData,
  toggleLabActive,
  toggleLabClosed,
  labClosedCount,
  labActiveCount,
  handleLoadMoreLab,
  renderFooterLab,
  isLoadingLab,
  labType,
  permission,
  onRefreshBasic,
  refreshingBasic,
  onRefreshPrescription,
  refreshingPrescription,
  onRefreshDiagnosis,
  refreshingDiagnosis,
  onRefreshAdverse,
  refreshingAdverse,
  onRefreshLabTest,
  refreshingLabTest,
  isLoading,
}) => {
  const TAB_HEADER_ITEMS = [
    {
      id: "1",
      title: "Basic",
      screen: "basic",
      iconNormal: <FontAwesome name="heartbeat" style={reduxColors.tabIcon} />,
      iconActive: (
        <FontAwesome
          name="heartbeat"
          style={[reduxColors.tabIcon, { color: themeColors.primary }]}
        />
      ),
    },
    {
      id: "3",
      title: "Diagnosis",
      screen: "diagnosis",
      iconNormal: (
        <FontAwesome name="stethoscope" style={reduxColors.tabIcon} />
      ),
      iconActive: (
        <FontAwesome
          name="stethoscope"
          style={[reduxColors.tabIcon, { color: themeColors.primary }]}
        />
      ),
    },
    {
      id: "2",
      title: "Prescriptions",
      screen: "clinicalNotes",
      iconNormal: (
        <MaterialCommunityIcons
          name="prescription"
          style={reduxColors.tabIcon}
        />
      ),
      iconActive: (
        <MaterialCommunityIcons
          name="prescription"
          style={[reduxColors.tabIcon, { color: themeColors.primary }]}
        />
      ),
    },
    {
      id: "3",
      title: "Adverse Rx",
      screen: "adverseRx",
      iconNormal: <MaterialIcons name="warning" style={reduxColors.tabIcon} />,
      iconActive: (
        <MaterialIcons
          name="warning"
          style={[reduxColors.tabIcon, { color: themeColors.primary }]}
        />
      ),
    },

    {
      id: "4",
      title: "Lab Test Requests",
      screen: "LabTestRequest",
      iconNormal: <Fontisto name="laboratory" style={reduxColors.tabIcon} />,
      iconActive: (
        <Fontisto
          name="laboratory"
          style={[reduxColors.tabIcon, { color: themeColors.primary }]}
        />
      ),
    },
  ];
  const [screen, setScreen] = useState("basic");

  useEffect(() => {
    changeInnerName(default_sub_tab ? default_sub_tab : "basic");
    setScreen(default_sub_tab ? default_sub_tab : screen);
  }, [default_sub_tab, screen]);

  const Item = ({ title, screenName, iconNormal, iconActive }) => (
    <TouchableOpacity
      style={[
        // reduxColors.tabHeaderItemWrapper,
        {
          paddingVertical: Spacing.mini,
          marginHorizontal: Spacing.minor,
        },
        screenName === screen
          ? { borderBottomColor: themeColors.primary, borderBottomWidth: 2 }
          : {},
      ]}
      onPress={() => {
        setScreen(screenName);
        changeInnerName(screenName);
      }}
    >
      {/* <Text
        style={[
          reduxColors.tabHeaderItem,
          screenName === screen ? { color: themeColors.primary } : {},
        ]}
      >
        <View style={{ paddingHorizontal: 2 }}>
          {screenName === screen ? iconActive : iconNormal}
        </View>
        {title}
      </Text> */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: Spacing.mini,
        }}
      >
        <View style={{}}>
          {screenName === screen ? iconActive : iconNormal}
        </View>
        <Text
          style={[
            { paddingRight: Spacing.mini + Spacing.micro },
            screenName === screen ? { color: themeColors.primary } : null,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Tabs.ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={{ backgroundColor: themeColors.onPrimary }}>
          <View
            style={[reduxColors.tabHeaderWrapper, { alignItems: "center" }]}
          >
            <FlatList
              style={reduxColors.tabHeader}
              data={TAB_HEADER_ITEMS}
              renderItem={({ item }) => (
                <Item
                  title={item.title}
                  screenName={item.screen}
                  iconNormal={item.iconNormal}
                  iconActive={item.iconActive}
                  key={item.id}
                />
              )}
              keyExtractor={(item, index) => index?.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View
            style={[
              reduxColors.tabBody,
              {
                backgroundColor:
                  screen == "basic" ? themeColors?.background : null,
              },
            ]}
          >
            {screen === "basic" ? (
              <Basic
                animalMedicalList={animalMedicalList}
                themeColors={themeColors}
                medicalBasicData={medicalBasicData}
                onRefreshBasic={onRefreshBasic}
                refreshingBasic={refreshingBasic}
                loading={isLoading}
              />
            ) : screen === "clinicalNotes" ? (
              <ClinicalNotes
                animalDetails={animalDetails}
                animalMedicalList={animalMedicalList}
                animalMedicalPrescriptionData={animalMedicalPrescriptionData}
                type={prescriptionType}
                toggleActive={toggleActivePrescription}
                toggleClosed={toggleClosedPrescription}
                animalPrescriptionCount={animalPrescriptionCount}
                renderFooterPrescription={renderFooterPrescription}
                handleLoadMorePrescription={handleLoadMorePrescription}
                getMedicalPrescriptionData={getMedicalPrescriptionData}
                permission={permission}
                onRefreshPrescription={onRefreshPrescription}
                refreshingPrescription={refreshingPrescription}
                loading={isLoading}
              />
            ) : screen === "diagnosis" ? (
              <Diagnosis
                animalDetails={animalDetails}
                animalDiagnosisList={animalMedicalList}
                type={type}
                toggleActive={toggleActive}
                toggleClosed={toggleClosed}
                animalMedicalDiagnosisData={animalMedicalDiagnosisData}
                handleMoreDiagnosis={handleMoreDiagnosis}
                renderDiagnosisFooter={renderDiagnosisFooter}
                animalMedicalDiagnosisDataCount={
                  animalMedicalDiagnosisDataCount
                }
                permission={permission}
                onRefreshDiagnosis={onRefreshDiagnosis}
                refreshingDiagnosis={refreshingDiagnosis}
                loading={isLoading}
              />
            ) : screen == "adverseRx" ? (
              <BlockedMedicine
                blockprescriptionData={animalMedicalAdverseRxData}
                handleLoadMoreAdverseRx={handleLoadMoreAdverseRx}
                renderFooterAdverseRx={renderFooterAdverseRx}
                onRemoveSideEffectFun={onRemoveSideEffectFun}
                themeColors={themeColors}
                onRefreshAdverse={onRefreshAdverse}
                refreshingAdverse={refreshingAdverse}
                loading={isLoading}
              />
            ) : screen == "LabTestRequest" ? (
              <LabTestRequest
                animalMedicalLabData={animalMedicalLabData}
                labClosedCount={labClosedCount}
                labActiveCount={labActiveCount}
                toggleLabActive={toggleLabActive}
                toggleLabClosed={toggleLabClosed}
                labType={labType}
                handleLoadMoreLab={handleLoadMoreLab}
                renderFooterLab={renderFooterLab}
                isLoadingLab={isLoadingLab}
                reduxColors={reduxColors}
                onRefreshLabTest={onRefreshLabTest}
                refreshingLabTest={refreshingLabTest}
                loading={isLoading}
              />
            ) : null}
          </View>
        </View>
      </Tabs.ScrollView>
    </>
  );
};

const Enclosure = ({
  enclosureInfoData,
  reduxColors,
  themeColors,
  onRefreshEnclosure,
  refreshingEnclosure,
  loading,
}) => {
  return (
    <>
      <Tabs.ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshingEnclosure}
            onRefresh={onRefreshEnclosure}
            style={{
              color: themeColors.blueBg,
              marginTop:
                Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
            }}
            enabled={true}
          />
        }
      >
        {enclosureInfoData ? (
          <>
            <Card style={reduxColors.card} elevation={0}>
              <Card.Content>
                <View style={[reduxColors.cardContentRow, { width: "100%" }]}>
                  <View style={reduxColors.cardContentItem}>
                    <Text style={reduxColors.cardContentTitle}>
                      Enclosure Name
                    </Text>
                    <Text
                      style={[
                        reduxColors.cardContentData,
                        { textTransform: "uppercase" },
                      ]}
                    >
                      {enclosureInfoData.user_enclosure_name ?? "NA"}
                    </Text>
                  </View>
                  <View
                    style={[
                      reduxColors.cardContentItem,
                      { textTransform: "uppercase" },
                    ]}
                  >
                    <Text style={reduxColors.cardContentTitle}>
                      Parent Enclosure
                    </Text>
                    <Text style={reduxColors.cardContentData}>
                      {enclosureInfoData?.user_enclosure_name ?? "NA"}
                    </Text>
                  </View>
                </View>
                <View style={[reduxColors.cardContentRow, { width: "100%" }]}>
                  <View style={reduxColors.cardContentItem}>
                    <Text style={reduxColors.cardContentTitle}>Section</Text>
                    <Text style={reduxColors.cardContentData}>
                      {enclosureInfoData?.section_name ?? "NA"}
                    </Text>
                  </View>
                  <View style={reduxColors.cardContentItem}>
                    <Text style={reduxColors.cardContentTitle}>Site</Text>
                    <Text style={reduxColors.cardContentData}>
                      {enclosureInfoData?.site_name ?? "NA"}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
            <Card style={reduxColors.card} elevation={0}>
              <Card.Content>
                <View style={reduxColors.cardContentRow}>
                  <View style={reduxColors.cardContentItem}>
                    <Text style={reduxColors.cardContentTitle}>
                      Enclosure Type
                    </Text>
                    <Text style={reduxColors.cardContentData}>
                      {enclosureInfoData?.enclosure_type ?? "NA"}
                    </Text>
                  </View>
                  <View style={reduxColors.cardContentItem}>
                    <Text style={reduxColors.cardContentTitle}>Sunlight</Text>
                    <Text style={reduxColors.cardContentData}>
                      {capitalize(
                        enclosureInfoData.enclosure_sunlight
                          ? enclosureInfoData.enclosure_sunlight
                          : "NA"
                      )}
                    </Text>
                  </View>
                </View>
                <View style={reduxColors.cardContentRow}>
                  <View style={reduxColors.cardContentItem}>
                    <Text style={reduxColors.cardContentTitle}>
                      Environment Type
                    </Text>
                    <Text style={reduxColors.cardContentData}>
                      {capitalize(
                        enclosureInfoData.enclosure_environment ?? "NA"
                      )}
                    </Text>
                  </View>
                  <View style={reduxColors.cardContentItem}>
                    <Text style={reduxColors.cardContentTitle}>Movable</Text>
                    <Text style={reduxColors.cardContentData}>
                      {enclosureInfoData.enclosure_is_movable == "0" ? (
                        <Text>False</Text>
                      ) : (
                        <Text>True</Text>
                      )}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </>
        ) : (
          <ListEmpty height={"50%"} visible={loading} />
        )}
      </Tabs.ScrollView>
    </>
  );
};

const Mortality = ({
  mortalityInfoData,
  reduxColors,
  animalDetailsData,
  deleted,
  animal_transfered,
  active,
  permission,
  refreshingMortalitySingle,
  onRefreshMortalitySingle,
  loading,
}) => {
  const navigation = useNavigation();
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  return (
    <>
      {mortalityInfoData?.length > 0 ? (
        <>
          {animalDetailsData?.type == "single" ? (
            <>
              <Tabs.ScrollView
                showsVerticalScrollIndicator={false}
                // nestedScrollEnabled={true}
                contentContainerStyle={{ flex: 1 }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshingMortalitySingle}
                    onRefresh={onRefreshMortalitySingle}
                    style={{
                      color: themeColors.blueBg,
                      marginTop:
                        Platform.OS == "ios"
                          ? 0
                          : (Spacing.body + Spacing.small) * 3,
                    }}
                    enabled={true}
                  />
                }
              >
                {animalDetailsData?.is_necropsy ||
                deleted ||
                !animal_transfered ? null : (
                  <View style={{ backgroundColor: themeColors.onSecondary }}>
                    <SubmitBtn
                      buttonText="Add Necropsy"
                      onPress={() =>
                        checkPermissionAndNavigateWithAccess(
                          permission,
                          "collection_animal_record_access",
                          navigation,
                          "AddNecropasy",
                          {
                            mortalityData: mortalityInfoData[0],
                            animalDetails: animalDetailsData,
                          },
                          "ADD"
                        )
                      }
                      backgroundColor={themeColors.secondaryContainer}
                      color={themeColors.onSecondaryContainer}
                      iconName={"plus"}
                      fontSize={FontSize.Antz_Minor_Medium.fontSize}
                      fontWeight={FontSize.Antz_Minor_Medium.fontWeight}
                    />
                  </View>
                )}
                <Card
                  style={[
                    reduxColors.card,
                    {
                      marginTop: !animalDetailsData?.is_necropsy
                        ? "3%"
                        : Spacing.small,
                    },
                  ]}
                  elevation={0}
                >
                  <Card.Content>
                    <View style={reduxColors.mortalityContentItem}>
                      <Text style={reduxColors.cardContentTitle}>
                        Manner Of Death
                      </Text>
                      <Text style={reduxColors.cardContentData}>
                        {ifEmptyValue(mortalityInfoData[0]?.manner_of_death)}
                      </Text>
                    </View>
                    <View style={reduxColors.mortalityContentItem}>
                      <Text style={reduxColors.cardContentTitle}>
                        Discovered Date
                      </Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {Boolean(Number(mortalityInfoData[0]?.is_estimate)) ? (
                          <MaterialCommunityIcons
                            name="approximately-equal"
                            size={16}
                            color="black"
                            style={{
                              marginTop: Spacing.micro,
                              marginRight: Spacing.mini,
                            }}
                          />
                        ) : null}
                        <Text style={reduxColors.cardContentData}>
                          {ifEmptyValue(
                            dateFormatter(
                              mortalityInfoData[0]?.discovered_date,
                              "DD MMM YYYY"
                            )
                          )}
                        </Text>
                      </View>
                    </View>
                    <View style={reduxColors.mortalityContentItem}>
                      <Text style={reduxColors.cardContentTitle}>
                        Carcass Condition
                      </Text>
                      <Text style={reduxColors.cardContentData}>
                        {ifEmptyValue(mortalityInfoData[0]?.carcass_condition)}
                      </Text>
                    </View>
                    <View style={reduxColors.mortalityContentItem}>
                      <Text style={reduxColors.cardContentTitle}>
                        Carcass Disposition
                      </Text>
                      <Text style={reduxColors.cardContentData}>
                        {ifEmptyValue(
                          mortalityInfoData[0]?.carcass_disposition
                        )}
                      </Text>
                    </View>
                    {mortalityInfoData[0]?.antz_animal_mortality_media?.length >
                    0 ? (
                      <View style={reduxColors.mortalityContentItem}>
                        <Text style={reduxColors.cardContentTitle}>
                          Attachments
                        </Text>
                        <ImageViewer
                          data={mortalityInfoData[0]?.antz_animal_mortality_media
                            .filter(
                              (i) => i?.file_type?.split("/")[0] == "image"
                            )
                            .map((e) => {
                              return {
                                id: e?.id,
                                name: e?.file_original_name,
                                url: e?.media_path,
                              };
                            })}
                          horizontal={true}
                          width={widthPercentageToDP(41)}
                          imgHeight={99}
                          imgWidth={widthPercentageToDP(40.5)}
                          fileName={true}
                        />
                      </View>
                    ) : null}

                    <View style={reduxColors.mortalityContentItem}>
                      <Text style={reduxColors.cardContentTitle}>Notes</Text>
                      <View style={reduxColors.mortalityNotesBox}>
                        <Text style={reduxColors.cardContentData}>
                          {ifEmptyValue(mortalityInfoData[0]?.notes)}
                        </Text>
                      </View>
                    </View>

                    <View style={reduxColors.mortalityContentItem}>
                      <Text style={reduxColors.cardContentTitle}>Necropsy</Text>
                      <Text style={reduxColors.cardContentData}>
                        {mortalityInfoData[0]?.submitted_for_necropsy == "1"
                          ? "Yes"
                          : "No"}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </Tabs.ScrollView>
              {animalDetailsData?.type == "group" ? null : (
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    alignSelf: "center",
                    width: "100%",
                  }}
                >
                  {animalDetailsData?.is_necropsy ? (
                    <View
                      style={{
                        backgroundColor: themeColors.onSecondary,
                        borderColor: "black",
                        padding: 16,
                        flexDirection: "row",
                        borderTopWidth: 1,
                        borderColor: themeColors.surfaceVariant,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="check"
                        size={24}
                        color={themeColors.onSurface}
                      />
                      <View style={{ marginLeft: 10 }}>
                        <Text
                          style={{
                            fontSize: FontSize.Antz_Minor_Regular.fontSize,
                            fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                            color: themeColors.on_Surface,
                          }}
                        >
                          Necropsy report
                        </Text>
                        <Text
                          style={{
                            color: themeColors.on_Surface,
                            fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                            fontWeight:
                              FontSize.Antz_Subtext_Regular.fontWeight,
                          }}
                        >
                          {dateFormatter(
                            mortalityInfoData?.necropsy?.necropsy_date
                          )}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={{
                          height: 40,
                          backgroundColor: themeColors.primary,
                          justifyContent: "center",
                          alignItems: "center",
                          width: wp(40),
                          borderRadius: 8,
                          marginLeft: wp(10),
                        }}
                        onPress={() =>
                          navigation.navigate("NecropsySummary", {
                            animalId: animalDetailsData?.animal_id,
                            animalDetailsData: animalDetailsData,
                            mortalityId: mortalityInfoData[0]?.mortality_id,
                          })
                        }
                      >
                        <Text
                          style={{
                            fontSize: FontSize.Antz_Minor_Title.fontSize,
                            fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                            color: themeColors.onPrimary,
                          }}
                        >
                          View report
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : deleted ? null : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: themeColors.onSecondary,
                        alignItems: "center",
                        paddingVertical: Spacing.body,
                        borderTopWidth: 1,
                        borderColor: themeColors.surfaceVariant,
                      }}
                      onPress={() =>
                        checkPermissionAndNavigateWithAccess(
                          permission,
                          "collection_animal_record_access",
                          navigation,
                          "EditDisposition",
                          {
                            item: animalDetailsData,
                            editParams: "1",
                            mortalityData: mortalityInfoData,
                          },
                          "EDIT"
                        )
                      }
                    >
                      <MaterialCommunityIcons
                        name="pencil-outline"
                        size={24}
                        color={themeColors.editIconColor}
                      />
                      <Text
                        style={{
                          marginTop: Spacing.mini,
                          color: themeColors.onSurfaceVariant,
                          fontSize: FontSize.Antz_Subtext_Medium.fontSize,
                          fontWeight: FontSize.Antz_Subtext_Medium.fontWeight,
                        }}
                      >
                        Edit Mortality
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </>
          ) : (
            <Tabs.ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              // contentContainerStyle={{ padding: wp(2.5) }}
              contentContainerStyle={{ padding: Spacing.minor }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshingMortalitySingle}
                  onRefresh={onRefreshMortalitySingle}
                  style={{
                    color: themeColors.blueBg,
                    marginTop:
                      Platform.OS == "ios"
                        ? 0
                        : (Spacing.body + Spacing.small) * 3,
                  }}
                  enabled={true}
                />
              }
            >
              <FlatList
                data={mortalityInfoData}
                nestedScrollEnabled={true}
                contentContainerStyle={{ flex: 1 }}
                renderItem={({ item }) => (
                  <MortalityCard
                    data={item}
                    onPressEdit={() =>
                      checkPermissionAndNavigateWithAccess(
                        permission,
                        "collection_animal_record_access",
                        navigation,
                        "EditDisposition",
                        {
                          item: animalDetailsData,
                          editParams: "1",
                          mortalityData: item,
                        },
                        "EDIT"
                      )
                    }
                    onPress={() =>
                      checkPermissionAndNavigateWithAccess(
                        permission,
                        "collection_animal_record_access",
                        navigation,
                        "AddNecropasy",
                        {
                          mortalityData: item,
                          animalDetails: animalDetailsData,
                        },
                        "ADD"
                      )
                    }
                    onPressView={() =>
                      navigation.navigate("NecropsySummary", {
                        animalId: animalDetailsData?.animal_id,
                        animalDetailsData: animalDetailsData,
                        mortalityId: item?.mortality_id,
                      })
                    }
                  />
                )}
                keyExtractor={(item, index) => index?.toString()}
              />
            </Tabs.ScrollView>
          )}
        </>
      ) : (
        <Tabs.ScrollView>
          <ListEmpty height={"50%"} visible={loading} />
        </Tabs.ScrollView>
      )}
    </>
  );
};

const Animal = () => {
  return (
    <>
      <View>
        <Text>Animal Screen</Text>
      </View>
    </>
  );
};

const Observation = ({
  reduxColors,
  observationData,
  animalDetails,
  onRefreshNotes,
  refreshingNotes,
  Items,
  fetchData,
  getSelectedData,
  selectedData,
  dispatch,
}) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const [isLoading, setIsLoading] = useState(false);
  const [selectDrop, setSelectDrop] = useState("Show all");
  const [observationModal, setObservationModal] = useState(false);
  const [selectedCheckBox, setSelectedCheckBox] = useState("");

  const togglePrintModal = () => {
    setObservationModal(!observationModal);
  };
  const closePrintModal = () => {
    setObservationModal(false);
  };
  const isSelectedId = (id) => {
    return selectedCheckBox.includes(id);
  };

  const closeMenu = (item) => {
    setSelectedCheckBox([item.id]);
    setSelectDrop(item.name);
    closePrintModal();
  };

  const navigateCom = () => {
    dispatch(removeAnimalMovementData());
    dispatch(setMedicalEnclosure([]));
    dispatch(setMedicalAnimal([]));
    dispatch(setMedicalSection([]));
    dispatch(setMedicalSite([]));
    navigation.navigate("Observation", {
      selectedAnimal: animalDetails,
    });
  };
  return (
    <>
      <Tabs.ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        scrollEventThrottle={20}
        style={{
          backgroundColor: constThemeColor.background,
          paddingHorizontal: 10,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshingNotes}
            onRefresh={onRefreshNotes}
            style={{
              color: constThemeColor.blueBg,
              marginTop:
                Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
            }}
            enabled={true}
          />
        }
      >
        <Loader visible={isLoading} />
        {observationData?.result?.length !== 0 ? (
          <>
            <View
              style={[
                { justifyContent: "center", paddingLeft: 0, borderWidth: 0 },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 5,
                }}
              >
                <Text
                  style={{
                    color: constThemeColor.onPrimaryContainer,
                    fontWeight: FontSize.Antz_Body_Title.fontWeight,
                    fontSize: FontSize.Antz_Body_Title.fontSize,
                  }}
                >
                  {observationData?.result?.length &&
                    (observationData?.result?.length === 1
                      ? `${observationData?.result?.length} Note`
                      : `${observationData?.result?.length} Notes`)}
                </Text>
                <View
                  style={{
                    alignItems: "flex-end",
                    paddingVertical: Spacing.mini,
                  }}
                >
                  <FilterComponent
                    items={Items}
                    fetchData={fetchData}
                    dataSendBack={getSelectedData}
                    selectedData={selectedData}
                  />
                </View>
              </View>

              {observationData?.result?.map((item, index) => (
                <ObservationCard
                  key={index}
                  item={item}
                  priroty={item?.priority}
                  assign_to={item?.assign_to}
                  onPress={() => {
                    if (animalDetails?.is_alive == 1) {
                      navigation.navigate("ObservationSummary", { item: item });
                    }
                  }}
                  onPressComment={() => {
                    if (animalDetails?.is_alive == 1) {
                      navigation.navigate("ObservationSummary", {
                        item: item,
                        boolen: true,
                      });
                    }
                  }}
                />
              ))}
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 5,
              }}
            >
              <Text
                style={{
                  color: constThemeColor.onPrimaryContainer,
                  fontWeight: FontSize.Antz_Body_Title.fontWeight,
                  fontSize: FontSize.Antz_Body_Title.fontSize,
                }}
              ></Text>
              <View
                style={{
                  alignItems: "flex-end",
                  paddingVertical: Spacing.mini,
                }}
              >
                <FilterComponent
                  items={Items}
                  fetchData={fetchData}
                  dataSendBack={getSelectedData}
                  selectedData={selectedData}
                />
              </View>
            </View>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginTop: heightPercentageToDP(2),
                height: heightPercentageToDP(6),
                borderRadius: 8,
                // backgroundColor: themeColors.secondaryContainer,
                backgroundColor: constThemeColor.secondary,
              }}
              onPress={() => navigateCom()}
            >
              <AntDesign
                name="plus"
                size={24}
                // color={themeColors.on05.09.23mary}
                onPrimary
                style={{ fontWeight: "bold" }}
              />
              <Text
                style={{
                  marginLeft: widthPercentageToDP(2),
                  // color: themeColors.onSecondaryContainer,
                  color: constThemeColor.onPrimary,
                  fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                  fontSize: FontSize.Antz_Minor_Medium.fontSize,
                }}
              >
                Add Notes
              </Text>
            </TouchableOpacity>
            <ListEmpty visible={isLoading} />
          </>
        )}
      </Tabs.ScrollView>
    </>
  );
};

const Overview = ({
  is_alive,
  overviewData,
  overviewDataLeft,
  editSubmit,
  isPermission,
  openTab,
  permission,
  onRefreshOverview,
  refreshingOverview,
  animalDetails,
  reduxColors,
  handleEncTabMove,
  isRefreshing,
  handleEndReach,
  handleLeftData,
}) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const [open, setOpen] = useState(false);
  const [openFather, setOpenFather] = useState(false);
  const today = new Date();
  const birthDay = overviewData.animal_details?.birth_date;
  const age = calculateAge(birthDay, today);
  const renderItem = (item, index, length) => {
    let diff = moment().diff(moment(item?.record_date), "days");
    let day = "";
    if (diff == 0) {
      day = "Today";
    } else if (diff == 1) {
      day = "Yesterday";
    } else {
      day = diff + " Days ago";
    }

    if (index == 0) {
      return null;
    }

    return (
      <>
        <TouchableWithoutFeedback>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                minWidth: widthPercentageToDP(10),
                minHeight: heightPercentageToDP(6),
                flexDirection: "column",
                justifyContent: "space-evenly",
                // paddingRight: 5,
                alignItems: "center",
                paddingVertical: 15,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    color:
                      index == 0
                        ? constThemeColor.onSurface
                        : constThemeColor.outline,
                    fontWeight: FontSize.Antz_Major_Title.fontWeight,
                    fontSize: FontSize.Antz_Major_Title.fontSize,
                  }}
                >
                  {shortenSmallerNumber(item?.measurement_value)}
                </Text>
                <Text
                  style={{
                    marginTop: 7,
                    marginLeft: 3,
                    bottom: 0,
                    right: 0,
                    color: constThemeColor.outline,
                    fontSize: FontSize.Antz_Body_Title.fontSize,
                    fontWeight: FontSize.Antz_Body_Title.fontWeight,
                  }}
                >
                  {item?.measurement_short_units}
                </Text>
              </View>
              <Text
                style={[
                  FontSize.Antz_Subtext_title,
                  {
                    color:
                      index == 0
                        ? constThemeColor.onSecondaryContainer
                        : constThemeColor.onSecondaryContainer,
                    textAlign: "left",
                  },
                ]}
              >
                {day}
              </Text>
            </View>
            {length - 1 == index ? null : (
              <View
                style={{
                  width: 1,
                  height: 70,
                  backgroundColor: constThemeColor.outlineVariant,
                  marginHorizontal: 10,
                }}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </>
    );
  };

  let diff =
    overviewDataLeft.body_weight &&
    moment().diff(
      moment(overviewDataLeft?.body_weight[0]?.record_date),
      "days"
    );
  let day = "";
  if (diff == 0) {
    day = "Today";
  } else if (diff == 1) {
    day = "Yesterday";
  } else {
    day = diff + " Days ago";
  }
  let observationData = overviewDataLeft?.observation
    ? overviewDataLeft?.observation[0]
    : null;
  return (
    <>
      <Tabs.ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        scrollEventThrottle={20}
        refreshControl={
          <RefreshControl
            refreshing={refreshingOverview}
            onRefresh={onRefreshOverview}
            style={{
              color: constThemeColor.blueBg,
              marginTop:
                Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
            }}
            enabled={true}
          />
        }
      >
        <View
          style={{
            paddingHorizontal: Spacing.small + Spacing.micro,
            paddingBottom: (Spacing.body + Spacing.small) * 3,
          }}
        >
          <View
            style={{
              backgroundColor: constThemeColor.displaybgPrimary,
              borderRadius: Spacing.small,
            }}
          >
            <View
              style={{
                paddingTop: Spacing.major,
                paddingHorizontal: Spacing.body + Spacing.mini,
              }}
            >
              {isPermission && (
                <TouchableOpacity
                  onPress={editSubmit}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 10,
                    zIndex: 1,
                    width: 50,
                    height: 50,
                    borderRadius: 100,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons
                    name="edit"
                    size={24}
                    color={constThemeColor.onPrimaryContainer}
                  />
                </TouchableOpacity>
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: Spacing.body + Spacing.mini,
                }}
              >
                <View
                  style={{
                    width: widthPercentageToDP(
                      Spacing.major + Spacing.small + Spacing.small
                    ),
                  }}
                >
                  <Text
                    style={[
                      FontSize.Antz_Body_Regular,
                      { color: constThemeColor.neutralSecondary },
                    ]}
                  >
                    Accession No.
                  </Text>
                  <Text
                    style={[
                      FontSize.Antz_Minor_Medium,
                      {
                        color: constThemeColor.onSecondaryContainer,
                        marginTop: Spacing.mini,
                      },
                    ]}
                  >
                    {ifEmptyValue(overviewData.animal_details?.animal_id)}
                  </Text>
                </View>
                <View
                  style={{
                    width: widthPercentageToDP(
                      Spacing.major + Spacing.small + Spacing.small
                    ),
                  }}
                >
                  <Text
                    style={[
                      FontSize.Antz_Body_Regular,
                      { color: constThemeColor.neutralSecondary },
                    ]}
                  >
                    Age
                  </Text>
                  <Text
                    style={[
                      FontSize.Antz_Minor_Medium,
                      {
                        color: constThemeColor.onSecondaryContainer,
                        marginTop: Spacing.mini,
                      },
                    ]}
                  >
                    {age.years > 0 || age.months > 0 || age.days > 0 ? (
                      <>
                        {age.years > 0 ? <Text>{age.years}y </Text> : null}
                        {age.months > 0 ? <Text>{age.months}m </Text> : null}
                        {age.days > 0 ? <Text>{age.days}d</Text> : null}
                      </>
                    ) : (
                      "NA"
                    )}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: Spacing.body + Spacing.mini,
                }}
              >
                <View
                  style={{
                    width: widthPercentageToDP(
                      Spacing.major + Spacing.small + Spacing.small
                    ),
                  }}
                >
                  <Text
                    style={[
                      FontSize.Antz_Body_Regular,
                      { color: constThemeColor.neutralSecondary },
                    ]}
                  >
                    Birth Date
                  </Text>
                  <Text
                    style={[
                      FontSize.Antz_Minor_Medium,
                      {
                        color: constThemeColor.onSecondaryContainer,
                        marginTop: Spacing.mini,
                      },
                    ]}
                  >
                    {ifEmptyValue(
                      dateFormatter(
                        overviewData?.animal_details?.birth_date,
                        "DD MMM YYYY"
                      )
                    )}
                  </Text>
                </View>
                <View
                  style={{
                    width: widthPercentageToDP(
                      Spacing.major + Spacing.small + Spacing.small
                    ),
                  }}
                >
                  <Text
                    style={[
                      FontSize.Antz_Body_Regular,
                      { color: constThemeColor.neutralSecondary },
                    ]}
                  >
                    Collection Type
                  </Text>
                  <Text
                    style={[
                      FontSize.Antz_Minor_Medium,
                      {
                        color: constThemeColor.onSecondaryContainer,
                        marginTop: Spacing.mini,
                      },
                    ]}
                  >
                    {ifEmptyValue(
                      overviewData.animal_details?.master_collection_type
                    )}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: Spacing.body + Spacing.mini,
                }}
              >
                <View
                  style={{
                    width: widthPercentageToDP(
                      Spacing.major + Spacing.small + Spacing.small
                    ),
                  }}
                >
                  <Text
                    style={[
                      FontSize.Antz_Body_Regular,
                      { color: constThemeColor.neutralSecondary },
                    ]}
                  >
                    Contraception Status
                  </Text>
                  <Text
                    style={[
                      FontSize.Antz_Minor_Medium,
                      {
                        color: constThemeColor.onSecondaryContainer,
                        marginTop: Spacing.mini,
                      },
                    ]}
                  >
                    {ifEmptyValue(
                      overviewData.animal_details?.contraception_status
                    )}
                  </Text>
                </View>
                <View
                  style={{
                    width: widthPercentageToDP(
                      Spacing.major + Spacing.small + Spacing.small
                    ),
                  }}
                >
                  <Text
                    style={[
                      FontSize.Antz_Body_Regular,
                      { color: constThemeColor.neutralSecondary },
                    ]}
                  >
                    Sexting type
                  </Text>
                  <Text
                    style={[
                      FontSize.Antz_Minor_Medium,
                      {
                        color: constThemeColor.onSecondaryContainer,
                        marginTop: Spacing.mini,
                      },
                    ]}
                  >
                    {ifEmptyValue(overviewData.animal_details?.sexing_type)}
                  </Text>
                </View>
              </View>
              {open ? (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: Spacing.body + Spacing.mini,
                    }}
                  >
                    <View
                      style={{
                        width: widthPercentageToDP(
                          Spacing.major +
                            Spacing.major +
                            Spacing.major +
                            Spacing.small
                        ),
                      }}
                    >
                      <Text
                        style={[
                          FontSize.Antz_Body_Regular,
                          { color: constThemeColor.neutralSecondary },
                        ]}
                      >
                        Ownership Term
                      </Text>
                      <Text
                        style={[
                          FontSize.Antz_Minor_Medium,
                          {
                            color: constThemeColor.onSecondaryContainer,
                            marginTop: Spacing.mini,
                          },
                        ]}
                      >
                        {ifEmptyValue(
                          overviewData.animal_details?.ownership_terms_label
                        )}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: Spacing.body + Spacing.mini,
                    }}
                  >
                    <View
                      style={{
                        width: widthPercentageToDP(
                          Spacing.major +
                            Spacing.major +
                            Spacing.major +
                            Spacing.small
                        ),
                      }}
                    >
                      <Text
                        style={[
                          FontSize.Antz_Body_Regular,
                          { color: constThemeColor.neutralSecondary },
                        ]}
                      >
                        Organization
                      </Text>
                      <Text
                        style={[
                          FontSize.Antz_Minor_Medium,
                          {
                            color: constThemeColor.onSecondaryContainer,
                            marginTop: Spacing.mini,
                          },
                        ]}
                      >
                        {ifEmptyValue(
                          overviewData.animal_details?.organization_name
                        )}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: Spacing.body + Spacing.mini,
                    }}
                  >
                    <View
                      style={{
                        width: widthPercentageToDP(
                          Spacing.major +
                            Spacing.major +
                            Spacing.major +
                            Spacing.small
                        ),
                      }}
                    >
                      <Text
                        style={[
                          FontSize.Antz_Body_Regular,
                          { color: constThemeColor.neutralSecondary },
                        ]}
                      >
                        From Institution
                      </Text>
                      <Text
                        style={[
                          FontSize.Antz_Minor_Medium,
                          {
                            color: constThemeColor.onSecondaryContainer,
                            marginTop: Spacing.mini,
                          },
                        ]}
                      >
                        {ifEmptyValue(
                          overviewData.animal_details?.institutes_label
                        )}
                      </Text>
                    </View>
                  </View>
                </>
              ) : null}
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: constThemeColor.displaybgSecondary,
                justifyContent: "center",
                alignItems: "center",
                borderBottomLeftRadius: Spacing.small,
                borderBottomRightRadius: Spacing.small,
                paddingVertical: Spacing.micro,
              }}
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut
                );
                setOpen(!open);
              }}
            >
              <MaterialCommunityIcons
                name={open ? "chevron-up" : "chevron-down"}
                size={24}
                color={constThemeColor.onPrimaryContainer}
              />
            </TouchableOpacity>
          </View>
          {(animalDetails?.parents?.parent_female.length > 0 ||
            animalDetails?.parents?.parent_male.length > 0) && (
            <Card
              style={{
                backgroundColor: constThemeColor.displaybgPrimary,
                borderRadius: Spacing.small,
                marginTop: Spacing.body,
              }}
              elevation={0}
            >
              <Card.Content>
                <View>
                  {animalDetails?.parents?.parent_female.length > 0 && (
                    <View>
                      <Text
                        style={[
                          reduxColors.cardContentTitle,
                          { paddingVertical: Spacing.mini },
                        ]}
                      >
                        Parent Mother
                      </Text>
                      {animalDetails?.parents?.parent_female?.map(
                        (item, index) => {
                          return (
                            <AnimalCustomCard
                              key={index}
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
                              onPress={() =>
                                navigation.push("AnimalsDetails", {
                                  animal_id:
                                    animalDetails?.parents?.parent_female[0]
                                      ?.animal_id,
                                })
                              }
                            />
                          );
                        }
                      )}
                    </View>
                  )}
                  {animalDetails?.parents?.parent_male.length > 0 && (
                    <View
                      style={{
                        marginBottom: Spacing.body,
                      }}
                    >
                      <Text
                        style={[
                          reduxColors.cardContentTitle,
                          { paddingVertical: Spacing.mini },
                        ]}
                      >
                        Parent Father
                      </Text>
                      {!openFather && (
                        <AnimalCustomCard
                          item={animalDetails?.parents.parent_male[0]}
                          animalIdentifier={
                            !animalDetails?.parents.parent_male[0]
                              ?.local_identifier_value
                              ? animalDetails?.parents.parent_male[0]?.animal_id
                              : animalDetails?.parents.parent_male[0]
                                  ?.local_identifier_name
                          }
                          localID={
                            animalDetails?.parents.parent_male[0]
                              ?.local_identifier_value ?? null
                          }
                          icon={
                            animalDetails?.parents.parent_male[0]?.default_icon
                          }
                          enclosureName={
                            animalDetails?.parents.parent_male[0]
                              ?.user_enclosure_name
                          }
                          animalName={
                            animalDetails?.parents.parent_male[0]?.common_name
                              ? animalDetails?.parents.parent_male[0]
                                  ?.common_name
                              : animalDetails?.parents.parent_male[0]
                                  ?.scientific_name
                          }
                          sectionName={
                            animalDetails?.parents.parent_male[0]?.section_name
                          }
                          show_specie_details={true}
                          show_housing_details={true}
                          chips={animalDetails?.parents.parent_male[0]?.sex}
                          noArrow={true}
                          onPress={() =>
                            navigation.push("AnimalsDetails", {
                              animal_id:
                                animalDetails?.parents.parent_male[0]
                                  ?.animal_id,
                            })
                          }
                        />
                      )}
                      {openFather &&
                        animalDetails?.parents.parent_male.map(
                          (item, index) => {
                            return (
                              <AnimalCustomCard
                                key={index}
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
                            );
                          }
                        )}
                    </View>
                  )}
                </View>
              </Card.Content>
              {animalDetails?.parents?.parent_male.length > 1 && (
                <TouchableOpacity
                  style={{
                    backgroundColor: constThemeColor.displaybgSecondary,
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottomLeftRadius: Spacing.small,
                    borderBottomRightRadius: Spacing.small,
                    paddingVertical: Spacing.micro,
                  }}
                  onPress={() => {
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut
                    );
                    setOpenFather(!openFather);
                  }}
                >
                  <MaterialCommunityIcons
                    name={openFather ? "chevron-up" : "chevron-down"}
                    size={24}
                    color={constThemeColor.onPrimaryContainer}
                  />
                </TouchableOpacity>
              )}
            </Card>
          )}
          {overviewData.animal_identifier?.length > 0 &&
          overviewData.animal_identifier?.filter((a) => a.is_deleted == "0")
            ?.length > 0 ? (
            <TouchableOpacity
              style={{
                backgroundColor: constThemeColor.displaybgPrimary,
                borderRadius: Spacing.small,
                padding: Spacing.body + Spacing.mini,
                marginTop: Spacing.body,
              }}
              onPress={() => {
                openTab({ tabName: "Identifier" });
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View>
                  <SvgXml
                    xml={home_housing}
                    style={{ marginRight: Spacing.small + Spacing.micro }}
                  />
                </View>
                <Text
                  style={[
                    FontSize.Antz_Minor_Medium,
                    { color: constThemeColor.onSecondaryContainer },
                  ]}
                >
                  Identifiers
                </Text>
              </View>
              {/* <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: Spacing.body + Spacing.mini,
              }}
            >
              <View style={{ width: widthPercentageToDP(80) }}>
                <Text
                  style={[
                    FontSize.Antz_Body_Regular,
                    { color: constThemeColor.neutralSecondary },
                  ]}
                >
                  Animal Name
                </Text>
                <Text
                  style={[
                    FontSize.Antz_Minor_Medium,
                    {
                      color: constThemeColor.onSecondaryContainer,
                      marginTop: Spacing.mini,
                    },
                  ]}
                >
                  {ifEmptyValue(overviewData.animal_details?.common_name)}
                </Text>
              </View>
            </View> */}
              {overviewData?.animal_identifier?.map((i) => {
                if (i.is_deleted == "1") {
                  return null;
                }
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: Spacing.body + Spacing.mini,
                    }}
                  >
                    <View
                      style={{
                        width: widthPercentageToDP(
                          Spacing.major +
                            Spacing.major +
                            Spacing.major +
                            Spacing.small
                        ),
                      }}
                    >
                      <Text
                        style={[
                          FontSize.Antz_Body_Regular,
                          { color: constThemeColor.neutralSecondary },
                        ]}
                      >
                        {i?.label}
                      </Text>
                      <Text
                        style={[
                          FontSize.Antz_Minor_Medium,
                          {
                            color: constThemeColor.onSecondaryContainer,
                            marginTop: Spacing.mini,
                          },
                        ]}
                      >
                        {ifEmptyValue(i?.local_identifier_value)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </TouchableOpacity>
          ) : null}
          {overviewData.enclosure_details ? (
            <TouchableOpacity
              style={{
                backgroundColor: constThemeColor.displaybgPrimary,
                borderRadius: Spacing.small,
                padding: Spacing.body + Spacing.mini,
                marginTop: Spacing.body,
              }}
              onPress={() => {
                navigation.navigate("OccupantScreen", {
                  enclosure_id: overviewData.enclosure_details?.enclosure_id,
                  section_id: overviewData.enclosure_details?.section_id,
                  section_name: overviewData.enclosure_details?.section_name,
                });
              }}
              // onPress={() => handleEncTabMove("enclosure")}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View>
                  <SvgXml
                    xml={home_housing}
                    style={{ marginRight: Spacing.small + Spacing.micro }}
                  />
                </View>
                <Text
                  style={[
                    FontSize.Antz_Minor_Medium,
                    { color: constThemeColor.onSecondaryContainer },
                  ]}
                >
                  Enclosure
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: Spacing.body + Spacing.mini,
                }}
              >
                <View
                  style={{
                    width: widthPercentageToDP(
                      Spacing.major +
                        Spacing.major +
                        Spacing.major +
                        Spacing.small
                    ),
                  }}
                >
                  <Text
                    style={[
                      FontSize.Antz_Minor_Title,
                      {
                        color: constThemeColor.onSurfaceVariant,
                        // textTransform: "uppercase",
                        // marginBottom: Spacing.mini,
                      },
                    ]}
                  >
                    {ifEmptyValue(
                      overviewData.enclosure_details?.user_enclosure_name
                    )}
                  </Text>
                  <Text
                    style={[
                      FontSize.Antz_Body_Regular,
                      {
                        color: constThemeColor.onSurfaceVariant,
                        marginTop: Spacing.mini,
                      },
                    ]}
                  >
                    Enclosure type:{" "}
                    <Text style={{ textTransform: "capitalize" }}>
                      {ifEmptyValue(
                        overviewData.enclosure_details?.enclosure_type_name
                      )}
                    </Text>
                  </Text>
                  <Text
                    style={[
                      FontSize.Antz_Body_Regular,
                      {
                        color: constThemeColor.onSurfaceVariant,
                        marginTop: Spacing.mini,
                      },
                    ]}
                  >
                    Section:{" "}
                    <Text style={{ textTransform: "capitalize" }}>
                      {ifEmptyValue(
                        overviewData.enclosure_details?.section_name
                      )}
                    </Text>
                  </Text>
                  <Text
                    style={[
                      FontSize.Antz_Body_Regular,
                      {
                        color: constThemeColor.onSurfaceVariant,
                        marginTop: Spacing.mini,
                      },
                    ]}
                  >
                    Site:{" "}
                    <Text style={{ textTransform: "capitalize" }}>
                      {ifEmptyValue(overviewData.enclosure_details?.site_name)}
                    </Text>
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : null}
          {overviewDataLeft.body_weight?.length > 0 ? (
            <TouchableOpacity
              style={{
                backgroundColor: constThemeColor.displaybgPrimary,
                borderRadius: Spacing.small,
                padding: Spacing.body + Spacing.mini,
                marginTop: Spacing.body,
              }}
              onPress={() => {
                openTab({ tabName: "Measurements" });
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ marginRight: Spacing.small + Spacing.micro }}>
                  <MaterialCommunityIcons
                    name="weight"
                    size={24}
                    color={constThemeColor.onSecondaryContainer}
                  />
                </View>
                <Text
                  style={[
                    FontSize.Antz_Minor_Medium,
                    { color: constThemeColor.onSecondaryContainer },
                  ]}
                >
                  Weight
                </Text>
              </View>
              <View
                style={{
                  marginTop: Spacing.body + Spacing.mini,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: widthPercentageToDP(3),
                  }}
                >
                  <View
                    style={{
                      minWidth: widthPercentageToDP(8),
                      minHeight: heightPercentageToDP(6),
                      flexDirection: "column",
                      justifyContent: "space-evenly",
                      paddingRight: 5,
                      paddingVertical: 15,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: constThemeColor.onSurface,
                          fontWeight: FontSize.Antz_Major_Title.fontWeight,
                          fontSize: FontSize.Antz_Major_Title.fontSize,
                        }}
                      >
                        {shortenNumber(
                          overviewDataLeft?.body_weight[0]?.measurement_value
                        )}
                      </Text>
                      <Text
                        style={{
                          marginTop: 7,
                          marginLeft: 3,
                          bottom: 0,
                          right: 0,
                          color: constThemeColor.outline,
                          fontSize: FontSize.Antz_Body_Title.fontSize,
                          fontWeight: FontSize.Antz_Body_Title.fontWeight,
                        }}
                      >
                        {overviewDataLeft?.body_weight[0]?.measurement_uom_abbr}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontWeight: FontSize.Antz_Subtext_title.fontWeight,
                        fontSize: FontSize.Antz_Subtext_title.fontSize,
                        color: constThemeColor.onSecondaryContainer,
                        textAlign: "left",
                      }}
                    >
                      {day}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: 1,
                      height: 70,
                      backgroundColor: constThemeColor.outlineVariant,
                      marginHorizontal: 10,
                    }}
                  />
                  <FlatList
                    data={overviewDataLeft?.body_weight}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    renderItem={({ item, index }) =>
                      renderItem(
                        item,
                        index,
                        overviewDataLeft?.body_weight?.length
                      )
                    }
                    keyExtractor={(item, index) => index?.toString()}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ) : null}
          {(overviewDataLeft?.diagnosis?.length > 0 ||
            overviewDataLeft?.prescription?.length > 0) &&
          permission["medical_records"] ? (
            <View
              style={{
                backgroundColor: constThemeColor.secondaryContainer,
                borderRadius: Spacing.small,
                padding: Spacing.body + Spacing.mini,
                marginTop: Spacing.body,
                marginBottom: Spacing.micro,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View>
                  <SvgXml
                    xml={home_housing}
                    style={{ marginRight: Spacing.small + Spacing.micro }}
                  />
                </View>
                <Text
                  style={[
                    FontSize.Antz_Minor_Medium,
                    { color: constThemeColor.onSecondaryContainer },
                  ]}
                >
                  Medical
                </Text>
              </View>
              {overviewDataLeft.diagnosis?.length > 0 ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: Spacing.body + Spacing.mini,
                  }}
                >
                  <View
                    style={{
                      width: widthPercentageToDP(
                        Spacing.major +
                          Spacing.major +
                          Spacing.major +
                          Spacing.small
                      ),
                    }}
                  >
                    <Text
                      style={[
                        FontSize.Antz_Body_Regular,
                        { color: constThemeColor.neutralSecondary },
                      ]}
                    >
                      Recent Diagnosis
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginTop: Spacing.mini,
                      }}
                    >
                      {overviewDataLeft.diagnosis
                        ?.filter((i) => i?.additional_info?.status == "active")
                        ?.map((item) => {
                          return (
                            <Chip
                              onPress={() => {
                                openTab({
                                  tabName: "Medical",
                                  innerTabName: "diagnosis",
                                });
                              }}
                              style={[
                                {
                                  margin: Spacing.mini,
                                  marginLeft: Spacing.micro,
                                  borderRadius: Spacing.mini,
                                },
                                {
                                  backgroundColor: severityColor(
                                    item?.additional_info?.severity
                                  ),
                                },
                              ]}
                            >
                              <Text
                                style={{
                                  color: constThemeColor.onPrimary,
                                  fontSize: FontSize.Antz_Minor_Medium.fontSize,
                                  fontWeight:
                                    FontSize.Antz_Minor_Medium.fontWeight,
                                }}
                              >
                                {item.name}
                              </Text>
                            </Chip>
                          );
                        })}
                    </View>
                  </View>
                </View>
              ) : null}
              {overviewDataLeft.prescription?.length > 0 ? (
                <View
                  style={{
                    marginTop: Spacing.body + Spacing.mini,
                  }}
                >
                  <View>
                    <Text
                      style={[
                        FontSize.Antz_Body_Regular,
                        { color: constThemeColor.neutralSecondary },
                      ]}
                    >
                      Recent Prescription
                    </Text>
                  </View>
                  <View style={{ marginTop: Spacing.mini }}>
                    {overviewDataLeft.prescription
                      ?.filter((i) => !i?.additional_info?.stop_date)
                      ?.map((item, index) => {
                        return (
                          <PrescriptionItem
                            handleEditToggleCommDropdown={() => {
                              openTab({
                                tabName: "Medical",
                                innerTabName: "clinicalNotes",
                              });
                            }}
                            item={item}
                            key={index.toString()}
                          />
                        );
                      })}
                  </View>
                </View>
              ) : null}
            </View>
          ) : null}
          {observationData ? (
            <View
              style={{
                marginTop: Spacing.micro - Spacing.micro,
              }}
            >
              <ObservationCard
                item={observationData}
                priroty={observationData?.priority}
                assign_to={observationData?.assign_to}
                onPress={() => {
                  navigation.navigate("ObservationSummary", {
                    item: observationData,
                  });
                }}
                onPressComment={() => {
                  if (animalDetails?.is_alive == 1) {
                    navigation.navigate("ObservationSummary", {
                      item: observationData,
                      boolen: true,
                    });
                  }
                }}
                borderColor={constThemeColor.outlineVariant}
                borderWidth={1}
                hideCommentSection={true}
              />
            </View>
          ) : null}
        </View>
      </Tabs.ScrollView>
    </>
  );
};

const Media = ({
  reduxColors,
  themeColors,
  video,
  default_sub_tab,
  changeInnerName,
  handleImagePick,
  takePhoto,
  selectedImages,
  removeImages,
  handleDocumentPick,
  documents,
  removeDocuments,
  handleVideoPick,
  selectedVideos,
  removeVideos,
  selectedItems,
  documentModal,
  setDocumentModal,
  toggleModal,
  submitDocument,
  isRestricted,
  handleRestrictValue,
  imageFooterLoader,
  loadmoreImageData,
  handleMoreDocument,
  renderDocumentFooter,
  handleMoreVideo,
  renderVideoFooter,
  animalDetails,
  onRefreshImage,
  refreshingImage,
  onRefreshDocument,
  refreshingDocument,
  onRefreshVideo,
  refreshingVideo,
  isLoading,
  deleteAnimalImage,
  isModalVisible,
  bottomTitle,
  alertModalClose,
  firstButtonPress,
  secondButtonPress,
  documentDelete,
  deleteVideo,
}) => {
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  const TAB_HEADER_ITEMS = [
    {
      id: "1",
      title: "Image",
      screen: "images",
      iconNormal: (
        <FontAwesome name="file-image-o" style={reduxColors.tabIcon} />
      ),
      iconActive: (
        <FontAwesome
          name="file-image-o"
          style={[reduxColors.tabIcon, { color: themeColors.primary }]}
        />
      ),
    },
    {
      id: "2",
      title: "Document",
      screen: "documents",
      iconNormal: <AntDesign name="filetext1" style={reduxColors.tabIcon} />,
      iconActive: (
        <AntDesign
          name="filetext1"
          style={[reduxColors.tabIcon, { color: themeColors.primary }]}
        />
      ),
    },
    {
      id: "3",
      title: "Video",
      screen: "videos",
      iconNormal: (
        <MaterialCommunityIcons
          name="file-video-outline"
          style={reduxColors.tabIcon}
        />
      ),
      iconActive: (
        <MaterialCommunityIcons
          name="file-video-outline"
          style={[reduxColors.tabIcon, { color: themeColors.primary }]}
        />
      ),
    },
  ];
  const [screen, setScreen] = useState("images");

  const modalStyles =
    BottomSheetModalStyles.getBottomSheetModalStyle(themeColors);
  const documentData = selectedItems.filter(
    (item) =>
      item?.type.split("/")[0].toLowerCase() !== "image" &&
      item?.type.split("/")[0].toLowerCase() !== "video"
  );

  const imageData = selectedItems.filter(
    (item) => item?.type.split("/")[0].toLowerCase() == "image"
  );

  const videoData = selectedItems?.filter(
    (item) => item?.type.split("/")[0].toLowerCase() == "video"
  );

  useEffect(() => {
    changeInnerName(default_sub_tab ? default_sub_tab : "images");
    setScreen(default_sub_tab ? default_sub_tab : screen);
  }, [default_sub_tab, screen]);

  const Item = ({ title, screenName, iconNormal, iconActive }) => (
    <TouchableOpacity
      style={[
        // reduxColors.tabHeaderItemWrapper,
        {
          paddingVertical: Spacing.mini,
          marginHorizontal: Spacing.minor,
        },
        screenName === screen
          ? { borderBottomColor: themeColors.primary, borderBottomWidth: 2 }
          : null,
      ]}
      onPress={() => {
        setScreen(screenName);
        changeInnerName(screenName);
      }}
    >
      {/* <Text
        style={[
          reduxColors.tabHeaderItem,
          screenName === screen ? { color: themeColors.primary } : {},
        ]}
      >
        <View style={{ paddingRight: 2 }}>
          {screenName === screen ? iconActive : iconNormal}
        </View>
        {title}
      </Text> */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: Spacing.mini,
        }}
      >
        <View style={{}}>
          {screenName === screen ? iconActive : iconNormal}
        </View>
        <Text
          style={[
            { paddingRight: Spacing.mini + Spacing.micro },
            screenName === screen ? { color: themeColors.primary } : null,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <>
      <Tabs.ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={{ backgroundColor: themeColors.onPrimary }}>
          <View
            style={[reduxColors.tabHeaderWrapper, { alignItems: "center" }]}
          >
            <FlatList
              style={reduxColors.tabHeader}
              data={TAB_HEADER_ITEMS}
              renderItem={({ item }) => (
                <Item
                  title={item.title}
                  screenName={item.screen}
                  iconNormal={item.iconNormal}
                  iconActive={item.iconActive}
                  key={item.id}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View
            style={[
              reduxColors.tabBody,
              // {
              //   backgroundColor:
              //     screen == "basic" ? themeColors?.background : null,
              // },
            ]}
          >
            {screen === "images" ? (
              <ImageTab
                selectedImages={selectedImages}
                removeImages={removeImages}
                imageFooterLoader={imageFooterLoader}
                loadmoreImageData={loadmoreImageData}
                themeColors={themeColors}
                onRefreshImage={onRefreshImage}
                refreshingImage={refreshingImage}
                deleteAnimalImage={deleteAnimalImage}
                isModalVisible={isModalVisible}
                bottomTitle={bottomTitle}
                alertModalClose={alertModalClose}
                firstButtonPress={firstButtonPress}
                secondButtonPress={secondButtonPress}
                UserId={UserId}
              />
            ) : screen === "documents" ? (
              <DocumentTab
                documents={documents}
                themeColors={themeColors}
                removeDocuments={removeDocuments}
                handleMoreDocument={handleMoreDocument}
                renderDocumentFooter={renderDocumentFooter}
                onRefreshDocument={onRefreshDocument}
                refreshingDocument={refreshingDocument}
                loading={isLoading}
                UserId={UserId}
                documentDelete={documentDelete}
                alertModalClose={alertModalClose}
                bottomTitle={bottomTitle}
                isModalVisible={isModalVisible}
                firstButtonPress={firstButtonPress}
                secondButtonPress={secondButtonPress}
              />
            ) : screen === "videos" ? (
              <VideoTab
                selectedVideos={selectedVideos}
                themeColors={themeColors}
                handleMoreVideo={handleMoreVideo}
                renderVideoFooter={renderVideoFooter}
                // onRefreshVideo={onRefreshVideo}
                // refreshingVideo={refreshingVideo}
                loading={isLoading}
                UserId={UserId}
                deleteVideo={deleteVideo}
                alertModalClose={alertModalClose}
                bottomTitle={bottomTitle}
                isModalVisible={isModalVisible}
                firstButtonPress={firstButtonPress}
                secondButtonPress={secondButtonPress}
                onRefreshVideos={onRefreshVideo}
                refreshingVideos={refreshingVideo}
              />
            ) : null}
          </View>
        </View>
      </Tabs.ScrollView>
      {animalDetails?.is_deleted != "1" &&
      animalDetails?.animalDetails?.is_alive != "0" ? (
        <View style={{ marginVertical: Spacing.small }}>
          <SubmitBtn
            buttonText={"Add Media"}
            iconName={"plus"}
            color={themeColors.onPrimary}
            onPress={() => setDocumentModal(!documentModal)}
          />
        </View>
      ) : null}
      {/* <TouchableOpacity
        style={{
          backgroundColor: themeColors.secondaryContainer,
          paddingVertical: Spacing.body,
          justifyContent: "center",
          alignItems: "center",
          margin: Spacing.small,
          borderRadius: Spacing.small,
        }}
        onPress={() => setDocumentModal(!documentModal)}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="plus"
            size={24}
            color={themeColors.onSurfaceVariant}
          />
          <Text
            style={[
              FontSize.Antz_Minor_Title,
              { color: themeColors?.onSurfaceVariant },
            ]}
          >
            Add Media
          </Text>
        </View>
      </TouchableOpacity> */}
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
          onRequestClose={() => setDocumentModal(false)}
        >
          <TouchableWithoutFeedback
            onPress={toggleModal}
            style={[
              {
                flex: 1,
                backgroundColor: themeColors.blackWithPointEight,
                justifyContent: "flex-end",
                alignItems: "center",
              },
            ]}
          >
            <View
              style={[
                {
                  flex: 1,
                  backgroundColor: themeColors.blackWithPointEight,
                  justifyContent: "flex-end",
                  alignItems: "center",
                },
              ]}
            >
              <TouchableWithoutFeedback onPress={() => setDocumentModal(true)}>
                <View
                  style={[
                    {
                      backgroundColor: themeColors.onPrimary,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderTopLeftRadius: 15,
                      borderTopRightRadius: 15,
                    },
                    {
                      paddingHorizontal: Spacing.small + Spacing.mini,
                      paddingTop: Spacing.small + Spacing.mini,
                      // minHeight: 100,
                    },
                  ]}
                >
                  <ImageViewer
                    data={imageData}
                    horizontal={true}
                    width={160}
                    imgWidth={160}
                    imgHeight={100}
                    imageClose={(item) => removeImages(item?.uri)}
                  />
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: Spacing.small }}
                  >
                    {documentData.map((item, index) => (
                      <TouchableWithoutFeedback
                        style={{ marginTop: Spacing.small }}
                      >
                        <View
                          style={[
                            reduxColors.attachBox,
                            {
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: 10,
                              marginBottom: 3,
                              marginTop: 3,
                              marginLeft: index == 0 ? null : Spacing.mini,
                              marginRight:
                                index == documentData?.length - 1
                                  ? null
                                  : Spacing.mini,
                            },
                            {
                              backgroundColor: themeColors.displaybgPrimary,
                            },
                          ]}
                        >
                          <MaterialIcons
                            name="picture-as-pdf"
                            size={24}
                            color={themeColors.onSurfaceVariant}
                          />
                          <View style={{ marginLeft: 10 }}>
                            <Text style={reduxColors.attachText}>
                              {item?.name}
                            </Text>
                          </View>

                          <MaterialCommunityIcons
                            name="close"
                            size={24}
                            color={themeColors.onSurfaceVariant}
                            style={{
                              paddingHorizontal: 5,
                            }}
                            onPress={() => removeDocuments(item?.name)}
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </ScrollView>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: Spacing.small }}
                  >
                    {videoData?.map((item, index) => {
                      return (
                        <TouchableWithoutFeedback>
                          <View
                            key={index?.toString()}
                            style={{
                              position: "relative",
                              backgroundColor: themeColors.surface,
                              marginHorizontal: Spacing.mini,
                            }}
                          >
                            <Video
                              ref={video}
                              style={{
                                width: widthPercentageToDP(45),
                                height: heightPercentageToDP(15),
                              }}
                              source={{
                                uri: item?.uri,
                              }}
                              useNativeControls={false}
                              isLooping
                              // onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                            />
                            <View
                              style={{
                                padding: Spacing.small,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text
                                style={{ width: widthPercentageToDP(30) }}
                                ellipsizeMode="middle"
                                numberOfLines={1}
                              >
                                {item?.name}
                              </Text>
                              <MaterialCommunityIcons
                                name="close"
                                size={24}
                                color={themeColors.onSurfaceVariant}
                                onPress={() => removeVideos(item?.name)}
                              />
                            </View>
                            {/* <View
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          top: 0,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            status.isPlaying
                              ? video.current.pauseAsync()
                              : video.current.playAsync()
                          }
                        >
                          <MaterialCommunityIcons
                            name={status.isPlaying ? "pause" : "play"}
                            size={40}
                            color={themeColors.primary}
                          />
                        </TouchableOpacity>
                      </View> */}
                          </View>
                        </TouchableWithoutFeedback>
                      );
                    })}
                  </ScrollView>
                  {selectedItems?.length > 0 ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        alignSelf: "flex-start",
                      }}
                    >
                      <Checkbox.Android
                        status={isRestricted ? "checked" : "unchecked"}
                        onPress={handleRestrictValue}
                      />
                      <Text
                        style={[
                          FontSize.Antz_Body_Regular,
                          { color: themeColors?.onSurfaceVariant },
                        ]}
                      >
                        Mark as restricted
                      </Text>
                    </View>
                  ) : null}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      padding: Spacing.major,
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableWithoutFeedback onPress={() => takePhoto()}>
                      <View
                        style={[
                          // reduxColors.modalView,
                          {
                            alignItems: "center",
                            justifyContent: "center",
                            // paddingHorizontal: 24,
                          },
                        ]}
                      >
                        <View
                          style={{
                            backgroundColor: themeColors.secondary,
                            height: 50,
                            width: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 30,
                          }}
                        >
                          <FontAwesome
                            name="camera"
                            size={22}
                            color={themeColors.onPrimary}
                          />
                        </View>
                        <Text
                          style={[
                            reduxColors.docsText,
                            FontSize.Antz_Body_Regular,
                            { color: themeColors.onSurfaceVariant },
                          ]}
                        >
                          Camera
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => handleImagePick()}>
                      <View
                        style={[
                          // reduxColors.modalView,
                          {
                            alignItems: "center",
                            justifyContent: "center",
                            // paddingHorizontal: 24,
                          },
                        ]}
                      >
                        <View
                          style={{
                            backgroundColor: themeColors.secondary,
                            height: 50,
                            width: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 30,
                          }}
                        >
                          <SvgXml
                            xml={Gallery}
                            width="22"
                            height="22"
                            style={[{ alignSelf: "center" }]}
                          />
                        </View>
                        <Text
                          style={[
                            reduxColors.docsText,
                            FontSize.Antz_Body_Regular,
                            { color: themeColors.onSurfaceVariant },
                          ]}
                        >
                          Photo
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => handleVideoPick()}>
                      <View
                        style={[
                          // reduxColors.modalView,
                          {
                            alignItems: "center",
                            justifyContent: "center",
                            // paddingHorizontal: 24,
                          },
                        ]}
                      >
                        <View
                          style={{
                            backgroundColor: themeColors.secondary,
                            height: 50,
                            width: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 30,
                          }}
                        >
                          <SvgXml
                            xml={Videos}
                            width="22"
                            height="22"
                            style={[{ alignSelf: "center" }]}
                          />
                        </View>
                        <Text
                          style={[
                            reduxColors.docsText,
                            FontSize.Antz_Body_Regular,
                            { color: themeColors.onSurfaceVariant },
                          ]}
                        >
                          Video
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={() => handleDocumentPick()}
                    >
                      <View
                        style={[
                          // reduxColors.modalView,
                          {
                            alignItems: "center",
                            justifyContent: "center",
                            // paddingHorizontal: 24,
                          },
                        ]}
                      >
                        <View
                          style={{
                            backgroundColor: themeColors.secondary,
                            height: 50,
                            width: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 40,
                          }}
                        >
                          <SvgXml
                            xml={Documents}
                            width="22"
                            height="22"
                            style={[{ alignSelf: "center" }]}
                          />
                        </View>
                        <Text
                          style={[
                            reduxColors.docsText,
                            FontSize.Antz_Body_Regular,
                            { color: themeColors.onSurfaceVariant },
                          ]}
                        >
                          Document
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  <View
                    style={{
                      backgroundColor: themeColors.addBackground,
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    {selectedItems.length > 0 ? (
                      <View style={{ padding: Spacing.minor }}>
                        <TouchableOpacity
                          style={{
                            backgroundColor: themeColors.primary,
                            padding: Spacing.small + Spacing.micro,
                            borderRadius: Spacing.small,
                            minWidth: "20%",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onPress={submitDocument}
                          accessible={true}
                          accessibilityLabel={"btnSubmit"}
                          AccessibilityId={"btnSubmit"}
                        >
                          <Text style={{ color: themeColors.onPrimary }}>
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
    </>
  );
};

const Birds = () => {
  return (
    <>
      <View>
        <Text>Birds Screen</Text>
      </View>
    </>
  );
};

const Identifier = ({
  identifierInfoData,
  reduxColors,
  permission,
  dead,
  refreshingIdentifier,
  onRefreshIdentifier,
  isLoading,
}) => {
  const navigation = useNavigation();
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  return (
    <>
      {identifierInfoData ? (
        <Tabs.FlatList
          style={reduxColors.masterContainer}
          data={identifierInfoData}
          renderItem={({ item }) => (
            <Card
              style={[
                reduxColors.card,
                {
                  backgroundColor:
                    item.is_deleted == 1
                      ? opacityColor(themeColors?.errorContainer, 50)
                      : themeColors.displaybgPrimary,
                },
              ]}
              elevation={0}
            >
              <Card.Content>
                <TouchableOpacity
                  style={reduxColors.parent}
                  onPress={() => {
                    if (!dead) {
                      checkPermissionAndNavigateWithAccess(
                        permission,
                        "collection_animal_record_access",
                        navigation,
                        "EditLocalIdentifier",
                        {
                          item: item,
                        },
                        "EDIT"
                      );
                    }
                  }}
                >
                  <View style={reduxColors.main}>
                    <View style={reduxColors.cardContentRow}>
                      <View style={reduxColors.cardContentItem}>
                        <Text style={reduxColors.cardContentTitle}>
                          Local Identifier Type
                        </Text>
                        <Text style={reduxColors.cardContentData}>
                          {item.label || "-"}
                        </Text>
                      </View>

                      <View
                        style={[
                          reduxColors.cardContentItem,
                          { marginLeft: 10 },
                        ]}
                      >
                        <Text style={reduxColors.cardContentTitle}>
                          Local Identifier
                        </Text>
                        <Text style={reduxColors.cardContentData}>
                          {item?.value || "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={reduxColors.cardContentRow}>
                      <View style={reduxColors.cardContentItem}>
                        <Text style={reduxColors.cardContentTitle}>Date</Text>
                        <Text style={reduxColors.cardContentData}>
                          {dateFormatter(item?.created_at, "DD MMM yyyy") ||
                            "-"}
                        </Text>
                      </View>
                      <View
                        style={[
                          reduxColors.cardContentItem,
                          { marginLeft: 10 },
                        ]}
                      >
                        <Text style={reduxColors.cardContentTitle}>
                          Primary
                        </Text>
                        <Text style={reduxColors.cardContentData}>
                          {item?.is_primary == "1" ? "True" : "False"}
                        </Text>
                      </View>
                    </View>
                    <View style={{ paddingHorizontal: Spacing.small }}>
                      {item?.file_with_path && (
                        <View>
                          <Image
                            style={reduxColors.img}
                            source={{
                              uri: item?.file_with_path,
                            }}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </Card.Content>
            </Card>
          )}
          keyExtractor={(item) => item.id}
          //showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshingIdentifier}
              onRefresh={onRefreshIdentifier}
              style={{
                color: themeColors.blueBg,
                marginTop:
                  Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
              }}
              enabled={true}
            />
          }
        />
      ) : (
        <Tabs.ScrollView>
          <ListEmpty height={"50%"} visible={isLoading} />
        </Tabs.ScrollView>
      )}
    </>
  );
};

const Basic = ({
  medicalBasicData,
  refreshingBasic,
  onRefreshBasic,
  themeColors,
  loading,
}) => {
  return (
    <View style={{ marginHorizontal: Spacing.minor, marginTop: Spacing.body }}>
      {medicalBasicData.length > 0 ? (
        <FlatList
          data={medicalBasicData}
          renderItem={({ item }) => (
            <MedicalListCard
              item={item}
              fromMedicalBasicPage={true}
              AnimalDetailsBasic={true}
            />
          )}
          keyExtractor={(item, index) => index?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Spacing.body }}
          refreshControl={
            <RefreshControl
              refreshing={refreshingBasic}
              onRefresh={onRefreshBasic}
              style={{
                color: themeColors.blueBg,
                marginTop:
                  Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
              }}
              enabled={true}
            />
          }
        />
      ) : (
        <View>
          <ListEmpty visible={loading} />
        </View>
      )}
    </View>
  );
};

const ClinicalNotes = ({
  animalDetails,
  animalMedicalPrescriptionData,
  type,
  toggleActive,
  toggleClosed,
  animalPrescriptionCount,
  handleLoadMorePrescription,
  renderFooterPrescription,
  getMedicalPrescriptionData,
  permission,
  onRefreshPrescription,
  refreshingPrescription,
  loading,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [visible, setVisible] = useState(false);
  const [modalData, setModalData] = useState({});
  const [textShown, setTextShown] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);
  const [index, setIndex] = useState(0);
  const [administerIsVisible, setAdministerIsVisible] = useState(false);
  const [infoVisble, setInfoVisble] = useState(false);
  const [administerDataList, setAdministerDataList] = useState([]);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [reason, setReason] = useState("");
  const [page, setPage] = useState(1);
  const [administerDataLength, setAdministerDataLength] = useState(0);
  const [administerDataLengthTotal, setAdministerDataLengthTotal] = useState(0);
  const { errorToast, successToast } = useToast();
  const [routes] = React.useState([
    {
      key: "Details",
      title: "Details",
    },
    {
      key: "Logged",
      title: "Logged",
    },
  ]);
  useEffect(() => {
    if (index == 1) {
      setIsLoadingModal(true);
      getAdminsterDataList(1);
    }
  }, [index]);
  const getAdminsterDataList = (count) => {
    const obj = {
      animal_id: animalDetails?.animal_id,
      medical_record_id: modalData?.data?.medical_record_id,
      medicine_id: modalData?.data?.id,
      page_no: count,
      prescription_id: modalData?.data?.prescription_id,
    };
    setPage(count);
    getAdminsterData(obj)
      .then((res) => {
        let dataArr = count == 1 ? [] : administerDataList;
        setAdministerDataList(dataArr.concat(res?.data?.result ?? []));
        setAdministerDataLength(res.data?.total_count ?? 0);
        setAdministerDataLengthTotal(
          dataArr.concat(res?.data?.result ?? [])?.length ?? 0
        );
        setIsLoadingModal(false);
      })
      .catch((e) => {
        console.log({ e });
        setIsLoadingModal(false);
      });
  };
  const addAdminsterData = (data) => {
    setIsLoadingModal(true);
    addAdminster(data)
      .then((res) => {
        if (res?.success) {
          getAdminsterDataList(1);
          getMedicalPrescriptionData(1);
          setAdministerIsVisible(false);
          successToast("Success", res?.message);
        } else {
          errorToast("Error", "Oops! Something went wrong!");
          setIsLoadingModal(false);
        }
      })
      .catch((e) => {
        console.log("log err", e);
        setIsLoadingModal(false);
      });
  };
  const getTabBarIcon = (props) => {
    const { route, focused } = props;
    if (route.key === "Details") {
      return (
        <MaterialCommunityIcons
          name="prescription"
          size={24}
          color={
            focused
              ? constThemeColor?.primary
              : constThemeColor?.onSurfaceVariant
          }
          style={{ marginBottom: Spacing.mini }}
        />
      );
    } else {
      return (
        <MaterialCommunityIcons
          name="clock-fast"
          size={28}
          color={
            focused
              ? constThemeColor?.primary
              : constThemeColor?.onSurfaceVariant
          }
          style={{ marginBottom: Spacing.mini }}
        />
      );
    }
  };
  const isEditable =
    animalDetails?.animal_transfered == "0" &&
    animalDetails?.is_deleted == "0" &&
    animalDetails?.is_alive == "1" &&
    (permission["medical_records_access"] == "EDIT" ||
      permission["medical_records_access"] == "DELETE");
  const modalOpen = (data, med_id) => {
    setVisible(true);
    dispatch(removeMedical());
    dispatch(removeEditFromAnimalDetailsPage());
    dispatch(removeMedicalMasters());
    setModalData({ data: data, medical_record_id: med_id });
    setAdministerDataList([]);
  };
  const modalClose = () => {
    setVisible(false);
    setIndex(0);
  };
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const handlePrescriptionEdit = () => {
    let id = modalData?.data?.medical_record_id;

    getAnimalMedicalDetailsNew({
      medical_record_id: id,
    })
      .then((res) => {
        if (res.success) {
          let animalMedicalData = res?.data;
          dispatch(setMedicalRecordId(id ?? null));
          dispatch(setEditFromAnimalDetails(true));
          dispatch(setActivePrescriptionEdit(modalData.data));
          dispatch(setEditFor(Constants.MEDICAL_TEMPLATE_TYPE.PRESCRIPTION));
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
            setfollowUpDate(
              animalMedicalData?.follow_up_date ? followUpDate : null
            )
          );
          dispatch(
            setShowFollowUpDate(
              animalMedicalData?.follow_up_date ? followUpDate : null
            )
          );
          dispatch(setSelectDurationData(differenceInDays));
          navigation.navigate("AddMedical", {
            item: animalDetails,
            medical_record_id: id[0],
          });
        }
      })
      .catch((error) => {
        console.log({ error });
        errorToast("Oops!", "Something went wrong!!");
      })
      .finally(() => {
        setVisible(false);
      });
  };
  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 4);
  }, []);
  const changeIndexFun = (index) => {
    setIndex(index);
  };
  const renderFooterAdminister = () => {
    if (
      isLoadingModal ||
      administerDataLength <= 0 ||
      administerDataLength == administerDataLengthTotal
    )
      return null;
    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };
  const handleLoadMore = () => {
    if (
      !isLoadingModal &&
      administerDataLength > 0 &&
      administerDataLength != administerDataLengthTotal
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      getAdminsterDataList(nextPage);
    }
  };
  const modalTime = Platform.OS == "ios" ? 3000 : 1500;
  const RenderScene = ({ route }) => {
    switch (route.key) {
      case "Details":
        return (
          <View style={{ justifyContent: "space-between", flex: 1 }}>
            <View
              style={{
                paddingHorizontal: Spacing.body + Spacing.mini,
                paddingBottom: Spacing.body + Spacing.mini,
                height: 300,
              }}
            >
              {modalData?.data?.additional_info?.dosage_per_body_weight ? (
                <View style={{ marginVertical: Spacing.small }}>
                  <Text
                    style={[
                      FontSize.Antz_Body_Regular,
                      { color: constThemeColor.onSurfaceVariant },
                    ]}
                  >
                    Dosage per body weight
                  </Text>
                  <Text
                    style={[
                      FontSize.Antz_Body_Title,
                      { color: constThemeColor.onSurfaceVariant },
                    ]}
                  >
                    {modalData?.data?.additional_info?.dosage_per_body_weight}
                  </Text>
                </View>
              ) : null}

              {modalData?.data?.additional_info?.dosage ? (
                <View style={{ marginVertical: Spacing.small }}>
                  <Text
                    style={[
                      FontSize.Antz_Body_Regular,
                      { color: constThemeColor.onSurfaceVariant },
                    ]}
                  >
                    Give{" "}
                  </Text>
                  <Text
                    style={[
                      FontSize.Antz_Body_Title,
                      { color: constThemeColor.onSurfaceVariant },
                    ]}
                  >
                    {modalData?.data?.additional_info?.dosage}
                  </Text>
                </View>
              ) : null}

              {modalData?.data?.additional_info?.when ? (
                <View style={{ marginVertical: Spacing.small }}>
                  <Text
                    style={[
                      FontSize.Antz_Body_Regular,
                      { color: constThemeColor.onSurfaceVariant },
                    ]}
                  >
                    Frequency{" "}
                  </Text>
                  <Text
                    style={[
                      FontSize.Antz_Body_Title,
                      { color: constThemeColor.onSurfaceVariant },
                    ]}
                  >
                    {modalData?.data?.additional_info?.dosage}
                    {modalData?.data?.additional_info?.when
                      ? ` ${modalData?.data?.additional_info?.when
                          ?.split(" ")[1]
                          ?.replace(
                            "_x_",
                            ` ${
                              modalData?.data?.additional_info?.when?.split(
                                " "
                              )[0]
                            } `
                          )
                          ?.replaceAll("_", " ")}`
                      : null}
                  </Text>
                </View>
              ) : null}

              {modalData?.data?.additional_info?.duration ? (
                <View style={{ marginVertical: Spacing.small }}>
                  <Text
                    style={[
                      FontSize.Antz_Body_Regular,
                      { color: constThemeColor.onSurfaceVariant },
                    ]}
                  >
                    Duration{" "}
                  </Text>
                  <Text
                    style={[
                      FontSize.Antz_Body_Title,
                      {
                        color: constThemeColor.onSurfaceVariant,
                        textTransform: "capitalize",
                      },
                    ]}
                  >
                    {modalData?.data?.additional_info?.duration?.split("")[0] ==
                    0
                      ? modalData?.data?.additional_info?.duration
                          ?.split(" ")[1]
                          ?.replaceAll("_", " ")
                      : modalData?.data?.additional_info?.duration}
                  </Text>
                </View>
              ) : null}

              {modalData?.data?.additional_info?.quantity ? (
                <View style={{ marginVertical: Spacing.small }}>
                  <Text
                    style={[
                      FontSize.Antz_Body_Regular,
                      { color: constThemeColor.onSurfaceVariant },
                    ]}
                  >
                    Quantity{" "}
                  </Text>
                  <Text
                    style={[
                      FontSize.Antz_Body_Title,
                      { color: constThemeColor.onSurfaceVariant },
                    ]}
                  >
                    {modalData?.data?.additional_info?.quantity}
                  </Text>
                </View>
              ) : null}

              {modalData?.data?.additional_info?.delivery_route_name ? (
                <View style={{ marginVertical: Spacing.small }}>
                  <Text
                    style={[
                      FontSize.Antz_Body_Regular,
                      { color: constThemeColor.onSurfaceVariant },
                    ]}
                  >
                    Delivery Route{" "}
                  </Text>
                  <Text
                    style={[
                      FontSize.Antz_Body_Title,
                      { color: constThemeColor.onSurfaceVariant },
                    ]}
                  >
                    {modalData?.data?.additional_info?.delivery_route_name}
                  </Text>
                </View>
              ) : null}

              {modalData?.data?.notes ? (
                <View
                  style={{
                    backgroundColor: constThemeColor.notes,
                    borderRadius: 4,
                    padding: 16,
                    marginTop: Spacing.small,
                    width: wp(80),
                  }}
                >
                  <Text
                    style={[
                      FontSize.Antz_Body_Regular,
                      { color: constThemeColor.onSurfaceVariant },
                    ]}
                  >
                    {modalData?.data?.notes}
                  </Text>
                </View>
              ) : null}
            </View>
            {isEditable ? (
              <TouchableOpacity
                style={{
                  backgroundColor: constThemeColor.background,
                  paddingVertical: Spacing.small,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={handlePrescriptionEdit}
              >
                <View
                  style={{
                    marginTop: Spacing.body,
                    marginBottom: Spacing.body + Spacing.mini,
                  }}
                >
                  <MaterialCommunityIcons name="pencil" size={24} />
                  <Text
                    style={[
                      FontSize.Antz_Subtext_Medium,
                      {
                        color: constThemeColor.onSurfaceVariant,
                        marginTop: Spacing.mini,
                      },
                    ]}
                  >
                    Edit
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        );
      case "Logged":
        return (
          <View
            style={{
              justifyContent: "space-between",
              flex: 1,
              position: "relative",
            }}
          >
            <View
              style={{
                paddingHorizontal: Spacing.body + Spacing.mini,
                paddingBottom: Spacing.body + Spacing.mini,
              }}
            >
              <View
                style={{
                  minHeight: 84,
                  flexDirection: "row",
                  backgroundColor: constThemeColor?.onBackground,
                  justifyContent: "space-evenly",
                  borderRadius: 8,
                  marginVertical: Spacing.small,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <Text style={reduxColors?.administerStatsCount}>
                    {modalData?.data?.additional_info?.dosage}
                  </Text>
                  <Text style={reduxColors?.administerStatsType}>Dosage</Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <Text style={reduxColors?.administerStatsCount}>
                    {administerDataList?.length > 0
                      ? administerDataList[0]?.administritive_count
                      : 0}
                  </Text>
                  <Text style={reduxColors?.administerStatsType}>
                    Times administered
                  </Text>
                </View>
              </View>
              <FlatList
                data={administerDataList}
                renderItem={({ item }) => (
                  <AdministerStats
                    item={item}
                    infoVisble={infoVisble}
                    setInfoVisble={setInfoVisble}
                    setReason={setReason}
                  />
                )}
                keyExtractor={(item, index) => index?.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 200 }}
                onEndReached={handleLoadMore}
                ListFooterComponent={renderFooterAdminister}
              />
            </View>
            {modalData?.data?.additional_info?.stop_date ? null : (
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  bottom: 0,
                  backgroundColor: constThemeColor?.onPrimary,
                  paddingVertical: Spacing.minor,
                }}
              >
                <SubmitBtn
                  buttonText="Administer"
                  backgroundColor={constThemeColor?.primary}
                  paddingHorizontal={Spacing.micro}
                  onPress={() => setAdministerIsVisible(!administerIsVisible)}
                />
              </View>
            )}
          </View>
        );
      default:
        return null;
    }
  };
  return (
    <>
      <View
        style={{
          backgroundColor: constThemeColor.background,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          padding: Spacing.small + Spacing.micro,
          paddingBottom: 0,
          shadowColor: constThemeColor.neutral50,
          elevation: 2,
          shadowOffset: {
            height: 2,
            width: 10,
          },
          marginBottom: Spacing.body + Spacing.mini,
          borderBottomColor: constThemeColor.primary,
          borderBottomWidth: 1,
        }}
      >
        <TouchableOpacity
          onPress={toggleActive}
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: Spacing.small + Spacing.micro,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: FontSize.Antz_Large_Title.fontSize,
                fontWeight: FontSize.Antz_Large_Title.fontWeight,
                color: constThemeColor.onSurfaceVariant,
                textAlign: "center",
              }}
            >
              {animalPrescriptionCount.active ?? 0}
            </Text>
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                color: constThemeColor.cardLebel,
                marginBottom: Spacing.body,
                textAlign: "center",
              }}
            >
              Active Prescriptions
            </Text>
          </View>

          <View
            style={[
              {
                // height: type == "active" ? 6 : 0,
                height: 6,
                width: 85,
                borderTopLeftRadius: Spacing.small,
                borderTopRightRadius: Spacing.small,
                // backgroundColor: constThemeColor.primary
                backgroundColor:
                  type == "active" ? constThemeColor.primary : "transparent",
              },
            ]}
          ></View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleClosed}
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: Spacing.small + Spacing.micro,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: FontSize.Antz_Large_Title.fontSize,
                fontWeight: FontSize.Antz_Large_Title.fontWeight,
                color: constThemeColor.onSurfaceVariant,
                textAlign: "center",
              }}
            >
              {animalPrescriptionCount.closed ?? 0}
            </Text>
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                color: constThemeColor.cardLebel,
                marginBottom: Spacing.body,
                textAlign: "center",
              }}
            >
              Closed Prescriptions
            </Text>
          </View>
          <View
            style={{
              // height: type == "closed" ? 6 : 0,
              height: 6,
              width: 85,
              borderTopLeftRadius: Spacing.small,
              borderTopRightRadius: Spacing.small,
              // backgroundColor: constThemeColor.primary,
              backgroundColor:
                type == "closed" ? constThemeColor.primary : "transparent",
            }}
          ></View>
        </TouchableOpacity>
      </View>

      <View style={{ marginHorizontal: Spacing.minor, marginTop: 0 }}>
        <FlatList
          data={animalMedicalPrescriptionData}
          renderItem={({ item }) => {
            return (
              <View style={{ marginVertical: Spacing.small }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={[
                      FontSize.Antz_Body_Title,
                      { color: constThemeColor.neutralPrimary },
                    ]}
                  >
                    Case Id:
                  </Text>
                  <Text
                    style={[
                      FontSize.Antz_Body_Title,
                      {
                        color: constThemeColor.neutralPrimary,
                        marginHorizontal: Spacing.micro,
                      },
                    ]}
                  >
                    {item?.medical_record_id}
                  </Text>
                </View>
                {item?.data?.map((i, index) => {
                  return (
                    <>
                      <PrescriptionItem
                        item={i}
                        administer={true}
                        handleEditToggleCommDropdown={() => {
                          modalOpen(i, item?.medical_record_id);
                          setIndex(0);
                        }}
                        openLogged={() => {
                          modalOpen(i, item?.medical_record_id);
                          setIndex(1);
                        }}
                        openAdministerModal={(data) => {
                          modalOpen(i, item?.medical_record_id);
                          setIndex(1);
                          // setTimeout(() => {
                          //   setIndex(1);
                          // }, 1000);
                          setTimeout(() => {
                            setAdministerIsVisible(true);
                          }, modalTime);
                        }}
                      />
                    </>
                  );
                })}
              </View>
            );
          }}
          // contentContainerStyle={{
          //   marginHorizontal: Spacing.small + Spacing.micro,
          // }}
          keyExtractor={(item, index) => index?.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <ListEmpty label="No Medical record found" visible={loading} />
          )}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooterPrescription}
          onEndReached={handleLoadMorePrescription}
          refreshControl={
            <RefreshControl
              refreshing={refreshingPrescription}
              onRefresh={onRefreshPrescription}
              style={{
                color: constThemeColor.blueBg,
                marginTop:
                  Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
              }}
              enabled={true}
            />
          }
        />
      </View>

      <Modal
        avoidKeyboard
        animationType="none"
        transparent={true}
        visible={visible}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[{ flex: 1 }, { backgroundColor: "transparent" }]}
        >
          <Loader visible={isLoadingModal} />
          <TouchableWithoutFeedback onPress={() => setVisible(!visible)}>
            <View
              style={{
                flex: 1,
                backgroundColor: administerIsVisible
                  ? constThemeColor.blackWithPointEight
                  : "transparent",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <TouchableWithoutFeedback>
                <View
                  style={{
                    backgroundColor: constThemeColor.onPrimary,
                    height: "80%",
                    width: "100%",
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                  }}
                >
                  <View
                    style={{
                      padding: Spacing.body + Spacing.mini,
                      borderBottomWidth: 0.5,
                      borderColor: constThemeColor.lightGrey,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: Spacing.micro,
                      }}
                    >
                      <Text
                        style={[
                          FontSize.Antz_Minor_Title,
                          { color: constThemeColor.primary },
                        ]}
                      >
                        Case ID: {modalData?.medical_record_id}
                      </Text>
                      <TouchableOpacity onPress={modalClose}>
                        <MaterialCommunityIcons
                          name="close"
                          color={constThemeColor.onSurface}
                          size={24}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={{ marginBottom: Spacing.micro }}>
                      <Text
                        style={[
                          FontSize.Antz_Minor_Title,
                          { color: constThemeColor.onPrimaryContainer },
                        ]}
                      >
                        {modalData.data?.prescription}
                      </Text>
                    </View>
                    {modalData?.data?.composition ? (
                      <View style={{ marginBottom: Spacing.micro }}>
                        <Text
                          style={[
                            FontSize.Antz_Body_Regular,
                            {
                              color: constThemeColor.onSurfaceVariant,
                              width: wp(80),
                            },
                          ]}
                          onTextLayout={onTextLayout}
                          numberOfLines={textShown ? undefined : 3}
                        >
                          {modalData?.data?.composition}
                        </Text>
                        {lengthMore ? (
                          <Text
                            onPress={toggleNumberOfLines}
                            style={{ lineHeight: 21 }}
                          >
                            {textShown ? "Read less" : "Read more"}
                          </Text>
                        ) : null}
                      </View>
                    ) : null}
                  </View>

                  <TabView
                    accessible={true}
                    accessibilityLabel={"medicalListTab"}
                    AccessibilityId={"medicalListItemTab"}
                    navigationState={{ index, routes }}
                    renderScene={RenderScene}
                    onIndexChange={changeIndexFun}
                    renderTabBar={(props) => (
                      <TabBar
                        {...props}
                        renderIcon={(props) => getTabBarIcon(props)}
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
                          textTransform: "capitalize",
                        }}
                        indicatorStyle={{
                          backgroundColor: constThemeColor.primary,
                          height: 4,
                          borderTopLeftRadius: Spacing.mini,
                          borderTopRightRadius: Spacing.mini,
                          width: "40%",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: Spacing.minor + Spacing.mini,
                        }}
                        tabStyle={{
                          flexDirection: "row",
                        }}
                        activeColor={constThemeColor.onSurface}
                      />
                    )}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        {administerIsVisible ? (
          <AdministerAddComponent
            data={modalData}
            visible={administerIsVisible}
            setAdministerIsVisible={setAdministerIsVisible}
            addAdminster={addAdminsterData}
          />
        ) : null}
        <Modal
          avoidKeyboard
          animationType="none"
          transparent={true}
          visible={infoVisble}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: constThemeColor.blackWithPointEight,
              paddingHorizontal: Spacing.major,
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => setInfoVisble(!infoVisble)}
            >
              <View
                style={{
                  backgroundColor: constThemeColor?.onPrimary,
                  minHeight: 100,
                  paddingHorizontal: Spacing.body,
                  paddingVertical: Spacing.body,
                  borderRadius: 8,
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {/* <TouchableOpacity
                  style={{ position: "absolute", right: 5, top: 5 }}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    onPress={() => {
                      setInfoVisble(false);
                      setReason({});
                    }}
                  />
                </TouchableOpacity> */}
                <Text
                  style={[
                    FontSize.Antz_Minor_Medium_title,
                    { textAlign: "center" },
                  ]}
                >
                  {reason?.status == "withheld"
                    ? "Withheld Reason"
                    : "Wastage Reason"}
                </Text>
                <View style={{ minHeight: 50, paddingVertical: Spacing.body }}>
                  <Text
                    style={[
                      FontSize.Antz_Body_Regular,
                      { color: constThemeColor?.onSurfaceVariant },
                    ]}
                  >
                    {reason?.reason}
                  </Text>
                </View>

                <View>
                  <SubmitBtn
                    buttonText="OK"
                    onPress={() => {
                      setInfoVisble(false);
                      setReason({});
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </Modal>

      {/* <AdministerAddComponent
        data={modalData}
        visible={administerIsVisible}
        setAdministerIsVisible={setAdministerIsVisible}
      /> */}
    </>
  );
};

const Diagnosis = ({
  animalDetails,
  type,
  toggleActive,
  toggleClosed,
  animalMedicalDiagnosisData,
  handleMoreDiagnosis,
  renderDiagnosisFooter,
  animalMedicalDiagnosisDataCount,
  permission,
  refreshingDiagnosis,
  onRefreshDiagnosis,
  loading,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { errorToast } = useToast();
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const checkDiagnosis = animalMedicalDiagnosisData?.length > 0 ? true : false;
  const isEditable =
    animalDetails?.animal_transfered == "0" &&
    animalDetails?.is_deleted == "0" &&
    animalDetails?.is_alive == "1" &&
    (permission["medical_records_access"] == "EDIT" ||
      permission["medical_records_access"] == "DELETE");
  const [modalData, setModalData] = useState({});
  const [visible, setVisible] = useState(false);
  const modalOpen = (data, med_id) => {
    setVisible(true);
    dispatch(removeMedical());
    dispatch(removeEditFromAnimalDetailsPage());
    dispatch(removeMedicalMasters());
    setModalData({ data: data, medical_record_id: med_id });
  };
  const handleDiagnosisEdit = () => {
    let id = modalData?.medical_record_id.match(/(\d+)/);

    getAnimalMedicalDetailsNew({
      medical_record_id: id[0],
    })
      .then((res) => {
        if (res.success) {
          let animalMedicalData = res?.data;
          dispatch(setMedicalRecordId(id[0] ?? null));
          dispatch(setEditFromAnimalDetails(true));
          dispatch(setActiveDiagnosisEdit(modalData?.data));
          dispatch(setEditFor(Constants.MEDICAL_TEMPLATE_TYPE.DIAGNOSIS));
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
            setfollowUpDate(
              animalMedicalData?.follow_up_date ? followUpDate : null
            )
          );
          dispatch(
            setShowFollowUpDate(
              animalMedicalData?.follow_up_date ? followUpDate : null
            )
          );
          dispatch(setSelectDurationData(differenceInDays));
          navigation.navigate("AddMedical", {
            item: animalDetails,
            medical_record_id: id[0],
          });
        }
      })
      .catch((error) => {
        console.log({ error });
        errorToast("Oops!", "Something went wrong!!");
      })
      .finally(() => {
        setVisible(false);
      });
  };
  const modalClose = () => setVisible(false);
  return (
    <>
      <View
        style={{
          backgroundColor: themeColors.background,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          padding: Spacing.small + Spacing.micro,
          paddingBottom: 0,
          shadowColor: themeColors.neutral50,
          elevation: 2,
          shadowOffset: {
            height: 2,
            width: 10,
          },
          marginBottom: Spacing.body + Spacing.mini,
          borderBottomColor: themeColors.primary,
          borderBottomWidth: 1,
        }}
      >
        <TouchableOpacity
          onPress={toggleActive}
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: Spacing.small + Spacing.micro,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: FontSize.Antz_Large_Title.fontSize,
                fontWeight: FontSize.Antz_Large_Title.fontWeight,
                color: themeColors.onSurfaceVariant,
                textAlign: "center",
              }}
            >
              {animalMedicalDiagnosisDataCount?.active ?? 0}
            </Text>
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                color: themeColors.cardLebel,
                marginBottom: Spacing.body,
                textAlign: "center",
              }}
            >
              Active
            </Text>
          </View>

          <View
            style={[
              {
                // height: type == "active" ? 6 : 0,
                height: 6,
                width: 85,
                borderTopLeftRadius: Spacing.small,
                borderTopRightRadius: Spacing.small,
                // backgroundColor: themeColors.primary
                backgroundColor:
                  type == "active" ? themeColors.primary : "transparent",
              },
            ]}
          ></View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleClosed}
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: Spacing.small + Spacing.micro,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: FontSize.Antz_Large_Title.fontSize,
                fontWeight: FontSize.Antz_Large_Title.fontWeight,
                color: themeColors.onSurfaceVariant,
                textAlign: "center",
              }}
            >
              {animalMedicalDiagnosisDataCount?.closed ?? 0}
            </Text>
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                color: themeColors.cardLebel,
                marginBottom: Spacing.body,
                textAlign: "center",
              }}
            >
              Closed
            </Text>
          </View>
          <View
            style={{
              // height: type == "closed" ? 6 : 0,
              height: 6,
              width: 85,
              borderTopLeftRadius: Spacing.small,
              borderTopRightRadius: Spacing.small,
              // backgroundColor: themeColors.primary,
              backgroundColor:
                type == "closed" ? themeColors.primary : "transparent",
            }}
          ></View>
        </TouchableOpacity>
      </View>

      <View style={{ marginHorizontal: Spacing.minor, marginTop: 0 }}>
        <FlatList
          data={animalMedicalDiagnosisData}
          // contentContainerStyle={{ marginHorizontal: Spacing.small }}
          ListEmptyComponent={
            <ListEmpty label="No Diagnosis  found" visible={loading} />
          }
          keyExtractor={(item, index) => index?.toString()}
          renderItem={({ item }) => {
            return (
              <>
                {checkDiagnosis ? (
                  <View style={{ marginBottom: Spacing.minor }}>
                    {type == "active" ? (
                      <View style={{}}>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text
                            style={[
                              FontSize.Antz_Body_Title,
                              { color: themeColors.neutralPrimary },
                            ]}
                          >
                            Case Id:
                          </Text>
                          <Text
                            style={[
                              FontSize.Antz_Body_Title,
                              {
                                color: themeColors.neutralPrimary,
                                marginHorizontal: Spacing.micro,
                              },
                            ]}
                          >
                            {item?.medical_record_id}
                          </Text>
                        </View>
                        {item?.data?.map((i, index) => {
                          return (
                            <>
                              <DiagnosisItem
                                item={i}
                                handleEditSelected={() =>
                                  modalOpen(i, item?.medical_record_id)
                                }
                              />
                            </>
                          );
                        })}
                      </View>
                    ) : null}

                    {type == "closed" ? (
                      <View style={{}}>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text
                            style={[
                              FontSize.Antz_Body_Title,
                              { color: themeColors.neutralPrimary },
                            ]}
                          >
                            Case Id:
                          </Text>
                          <Text
                            style={[
                              FontSize.Antz_Body_Title,
                              {
                                color: themeColors.neutralPrimary,
                                marginHorizontal: Spacing.micro,
                              },
                            ]}
                          >
                            {item?.medical_record_id}
                          </Text>
                        </View>
                        {item?.data?.map((i, index) => {
                          return (
                            <DiagnosisItem
                              item={i}
                              handleEditSelected={() =>
                                modalOpen(i, item?.medical_record_id)
                              }
                            />
                          );
                        })}
                      </View>
                    ) : null}
                  </View>
                ) : null}
              </>
            );
          }}
          onEndReachedThreshold={0.1}
          onEndReached={handleMoreDiagnosis}
          ListFooterComponent={renderDiagnosisFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshingDiagnosis}
              onRefresh={onRefreshDiagnosis}
              style={{
                color: themeColors.blueBg,
                marginTop:
                  Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
              }}
              enabled={true}
            />
          }
        />
      </View>
      <Modal
        avoidKeyboard
        animationType="none"
        transparent={true}
        visible={visible}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[{ flex: 1 }, { backgroundColor: "transparent" }]}
        >
          <TouchableWithoutFeedback onPress={() => setVisible(!visible)}>
            <View
              style={{
                flex: 1,
                backgroundColor: themeColors.blackWithPointEight,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <TouchableWithoutFeedback>
                <View
                  style={{
                    backgroundColor: themeColors.onPrimary,
                    minHeight: Math.floor(windowHeight * 0.3),
                    width: "100%",
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                  }}
                >
                  <View
                    style={{
                      padding: Spacing.body + Spacing.mini,
                      borderBottomWidth: 0.5,
                      borderColor: themeColors.lightGrey,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: Spacing.micro,
                      }}
                    >
                      <Text
                        style={[
                          FontSize.Antz_Minor_Title,
                          { color: themeColors.primary },
                        ]}
                      >
                        Case ID: {modalData.medical_record_id}
                      </Text>
                      <TouchableOpacity onPress={modalClose}>
                        <MaterialCommunityIcons
                          name="close"
                          color={themeColors.onSurface}
                          size={24}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={{ marginBottom: Spacing.micro }}>
                      <Text
                        style={[
                          FontSize.Antz_Minor_Title,
                          { color: themeColors.onPrimaryContainer },
                        ]}
                      >
                        {modalData.data?.name}
                      </Text>
                    </View>
                  </View>
                  <View style={{ padding: Spacing.body + Spacing.mini }}>
                    {modalData.data?.additional_info?.severity ? (
                      <View style={{ marginVertical: Spacing.small }}>
                        <Text
                          style={[
                            FontSize.Antz_Body_Regular,
                            { color: themeColors.onSurfaceVariant },
                          ]}
                        >
                          Severity
                        </Text>
                        <Text
                          style={[
                            FontSize.Antz_Body_Title,
                            { color: themeColors.onSurfaceVariant },
                          ]}
                        >
                          {modalData.data?.additional_info?.severity}
                        </Text>
                      </View>
                    ) : null}

                    {ifEmptyValue(
                      modalData.data?.additional_info?.active_at
                    ) !== "NA" ? (
                      <View style={{ marginVertical: Spacing.small }}>
                        <Text
                          style={[
                            FontSize.Antz_Body_Regular,
                            { color: themeColors.onSurfaceVariant },
                          ]}
                        >
                          Activated At
                        </Text>
                        <Text
                          style={[
                            FontSize.Antz_Body_Title,
                            { color: themeColors.onSurfaceVariant },
                          ]}
                        >
                          {moment(
                            modalData.data?.additional_info?.active_at
                          ).format("DD MMM YYYY, LT")}
                        </Text>
                      </View>
                    ) : null}

                    {ifEmptyValue(
                      modalData.data?.additional_info?.closed_at
                    ) !== "NA" ? (
                      <View style={{ marginVertical: Spacing.small }}>
                        <Text
                          style={[
                            FontSize.Antz_Body_Regular,
                            { color: themeColors.onSurfaceVariant },
                          ]}
                        >
                          Closed At
                        </Text>
                        <Text
                          style={[
                            FontSize.Antz_Body_Title,
                            { color: themeColors.onSurfaceVariant },
                          ]}
                        >
                          {moment(
                            modalData.data?.additional_info?.closed_at
                          ).format("DD MMM YYYY, LT")}
                        </Text>
                      </View>
                    ) : null}

                    {modalData.data?.additional_info?.notes ? (
                      <View>
                        <Text
                          style={[
                            FontSize.Antz_Body_Regular,
                            { color: themeColors.onSurfaceVariant },
                          ]}
                        >
                          Starting Note
                        </Text>
                        <View
                          style={{
                            backgroundColor: themeColors.notes,
                            borderRadius: 4,
                            padding: 16,
                            marginTop: Spacing.small,
                            width: wp(80),
                          }}
                        >
                          <Text
                            style={[
                              FontSize.Antz_Body_Regular,
                              { color: themeColors.onSurfaceVariant },
                            ]}
                          >
                            {modalData.data?.additional_info?.notes}
                          </Text>
                        </View>
                      </View>
                    ) : null}

                    {modalData.data?.additional_info?.stop_note ? (
                      <View style={{ marginTop: Spacing.small }}>
                        <Text
                          style={[
                            FontSize.Antz_Body_Regular,
                            { color: themeColors.onSurfaceVariant },
                          ]}
                        >
                          Closing Note
                        </Text>
                        <View
                          style={{
                            backgroundColor: themeColors.notes,
                            borderRadius: 4,
                            padding: 16,
                            marginVertical: Spacing.small,
                            width: wp(80),
                          }}
                        >
                          <Text
                            style={[
                              FontSize.Antz_Body_Regular,
                              { color: themeColors.onSurfaceVariant },
                            ]}
                          >
                            {modalData.data?.additional_info?.stop_note}
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>
                  {isEditable ? (
                    <TouchableOpacity
                      style={{
                        backgroundColor: themeColors.background,
                        paddingVertical: Spacing.small,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={handleDiagnosisEdit}
                    >
                      <View
                        style={{
                          marginTop: Spacing.body,
                          marginBottom: Spacing.body + Spacing.mini,
                        }}
                      >
                        <MaterialCommunityIcons name="pencil" size={24} />
                        <Text
                          style={[
                            FontSize.Antz_Subtext_Medium,
                            {
                              color: themeColors.onSurfaceVariant,
                              marginTop: Spacing.mini,
                            },
                          ]}
                        >
                          Edit
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const ImageTab = ({
  selectedImages,
  removeImages,
  loadmoreImageData,
  imageFooterLoader,
  themeColors,
  isLoading,
  onRefreshImage,
  refreshingImage,
  deleteAnimalImage,
  isModalVisible,
  bottomTitle,
  alertModalClose,
  firstButtonPress,
  secondButtonPress,
  UserId,
}) => {
  const images_Obj = selectedImages
    ?.filter(
      (value) =>
        value?.file_mime_type == "image/jpeg" ||
        value?.file_mime_type == "image/png"
    )
    ?.map((el, index) => {
      return {
        id: el?.id,
        acess_restricted_key: el.acess_restricted_key,
        url: el.file,
        filename: el.name,
        user_id: el?.created_by,
        delete_access: UserId == el?.created_by ? true : false,
      };
    });

  return (
    <View style={{ marginHorizontal: Spacing.minor, marginTop: Spacing.body }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshingImage}
            onRefresh={onRefreshImage}
            style={{
              color: themeColors.blueBg,
              marginTop:
                Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
            }}
            enabled={true}
          />
        }
      >
        {images_Obj?.length > 0 ? (
          <ImageViewer
            data={images_Obj}
            width={widthPercentageToDP(42)}
            imgWidth={widthPercentageToDP(42)}
            fileName={true}
            deleteButton={true}
            imageDelete={deleteAnimalImage}
          />
        ) : (
          <ListEmpty label={"No images available!"} visible={isLoading} />
        )}
      </ScrollView>
      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={bottomTitle}
        closeModal={alertModalClose}
        firstButtonHandle={firstButtonPress}
        secondButtonHandle={secondButtonPress}
        firstButtonText={"Yes"}
        secondButtonText={"No"}
        firstButtonStyle={{
          backgroundColor: themeColors.error,
          borderWidth: 0,
        }}
        firstButtonTextStyle={{ color: themeColors.onPrimary }}
        secondButtonStyle={{
          backgroundColor: themeColors.surfaceVariant,
          borderWidth: 0,
        }}
      />
    </View>
  );
};

const DocumentTab = ({
  documents,
  themeColors,
  removeDocuments,
  renderDocumentFooter,
  handleMoreDocument,
  onRefreshDocument,
  refreshingDocument,
  loading,
  UserId,
  documentDelete,
  isModalVisible,
  bottomTitle,
  alertModalClose,
  firstButtonPress,
  secondButtonPress,
}) => {
  const openPDF = async (pdfURL) => {
    const supported = await Linking.canOpenURL(pdfURL);

    if (supported) {
      await Linking.openURL(pdfURL);
    } else {
      console.error(`Don't know how to open URL: ${pdfURL}`);
    }
  };
  return (
    <View style={{ marginHorizontal: Spacing.minor, marginTop: Spacing.body }}>
      <FlatList
        data={documents}
        keyExtractor={(i, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <>
              <TouchableOpacity
                onPress={() => openPDF(item?.file)}
                disabled={
                  item?.acess_restricted_key == "1" &&
                  UserId != item?.created_by
                    ? true
                    : false
                }
                style={[
                  {
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    padding: Spacing.body,
                    marginVertical: Spacing.mini,
                    backgroundColor: opacityColor(
                      themeColors.secondaryContainer,
                      item?.acess_restricted_key == "1" ? 40 : 100
                    ),
                    borderRadius: Spacing.mini,
                  },
                ]}
              >
                <MaterialIcons
                  name="picture-as-pdf"
                  size={24}
                  color={themeColors.onSurfaceVariant}
                />
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: Spacing.small,
                  }}
                >
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                      color: themeColors.onSurfaceVariant,
                      flexWrap: "wrap",
                    }}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {item?.name ?? item?.file_original_name}
                  </Text>
                </View>
                {UserId == item?.created_by ? (
                  <TouchableOpacity onPress={() => documentDelete(item)}>
                    <Entypo
                      name="cross"
                      size={20}
                      color={themeColors.onSurfaceVariant}
                    />
                  </TouchableOpacity>
                ) : null}
              </TouchableOpacity>
            </>
          );
        }}
        ListEmptyComponent={() => (
          <ListEmpty label={"No documents available!"} visible={loading} />
        )}
        ListFooterComponent={renderDocumentFooter}
        onEndReached={handleMoreDocument}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={refreshingDocument}
            onRefresh={onRefreshDocument}
            style={{
              color: themeColors.blueBg,
              marginTop:
                Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
            }}
            enabled={true}
          />
        }
      />
      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={bottomTitle}
        closeModal={alertModalClose}
        firstButtonHandle={firstButtonPress}
        secondButtonHandle={secondButtonPress}
        firstButtonText={"Yes"}
        secondButtonText={"No"}
        firstButtonStyle={{
          backgroundColor: themeColors.error,
          borderWidth: 0,
        }}
        firstButtonTextStyle={{ color: themeColors.onPrimary }}
        secondButtonStyle={{
          backgroundColor: themeColors.surfaceVariant,
          borderWidth: 0,
        }}
      />
    </View>
  );
};
const VideoTab = ({
  selectedVideos,
  themeColors,
  renderVideoFooter,
  handleMoreVideo,
  loading,
  onRefreshVideos,
  refreshingVideos,
  UserId,
  deleteVideo,
  isModalVisible,
  bottomTitle,
  alertModalClose,
  firstButtonPress,
  secondButtonPress,
}) => {
  const videoRef = useRef(null);
  const [videoModal, setVideoModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [fullScreen, setFullScreen] = useState(false); // State to track full screen mode

  const modalStyles = {
    ...BottomSheetModalStyles.getBottomSheetModalStyle(themeColors),
    modalContainer: {
      flex: 1,
      backgroundColor: "black", // Background color for full screen effect
    },
  };

  const handleVideoModal = (item) => {
    setVideoModal(true);
    setModalData(item);
  };

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  const videoModalClose = () => {
    setVideoModal(false);
    setFullScreen(false);
  };

  return (
    <>
      {videoModal ? (
        <Modal
          avoidKeyboard
          animationType="fade"
          transparent={true}
          visible={true}
          style={[modalStyles.modalContainer, fullScreen && { marginTop: 0 }]}
          onRequestClose={() => setVideoModal(false)}
        >
          <TouchableWithoutFeedback onPress={toggleFullScreen}>
            <View
              style={{ flex: 1, backgroundColor: themeColors?.neutralPrimary }}
            >
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  zIndex: 2323,
                }}
                onPress={videoModalClose}
              >
                <Entypo name="cross" size={30} color={themeColors.error} />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Video
                  useNativeControls={true}
                  resizeMode="contain"
                  isLooping={false}
                  ref={videoRef}
                  source={{ uri: `${modalData?.file}` }}
                  style={{ flex: 1 }}
                  shouldPlay={true}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      ) : null}
      <View style={{ padding: Spacing.body }}>
        <View>
          <FlatList
            data={selectedVideos}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 10,
            }}
            keyExtractor={(item, index) => index?.toString()}
            renderItem={({ item }) => {
              if (item?.file_type == "video") {
                return (
                  <>
                    <View
                      style={{
                        width: widthPercentageToDP(45),
                        margin: Spacing.mini,
                        borderWidth: 0.5,
                        borderColor: themeColors?.outline,
                        borderBottomColor: themeColors?.secondaryContainer,
                      }}
                    >
                      <View>
                        <Image
                          source={{ uri: item?.thumbnail }}
                          style={{
                            width: widthPercentageToDP(45),
                            height: heightPercentageToDP(17),
                          }}
                        />
                        <TouchableOpacity
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onPress={() => handleVideoModal(item)}
                        >
                          <MaterialCommunityIcons
                            name="play"
                            size={40}
                            color={themeColors?.onPrimary}
                          />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          backgroundColor: themeColors.secondaryContainer,
                          padding: Spacing.mini,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={[
                            FontSize.Antz_Subtext_Regular,
                            { color: themeColors.onSurfaceVariant, flex: 0.8 },
                          ]}
                          numberOfLines={1}
                          ellipsizeMode="middle"
                        >
                          {item?.name ?? item.file_name ?? ""}
                        </Text>
                        {UserId == item?.created_by ? (
                          <TouchableOpacity onPress={() => deleteVideo(item)}>
                            <Entypo
                              name="cross"
                              size={20}
                              color={themeColors?.onSurfaceVariant}
                            />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                  </>
                );
              }
            }}
            ListEmptyComponent={
              <ListEmpty label={"No videos found!"} visible={loading} />
            }
            ListFooterComponent={renderVideoFooter}
            onEndReachedThreshold={0.1}
            onEndReached={handleMoreVideo}
            refreshControl={
              <RefreshControl
                refreshing={refreshingVideos}
                onRefresh={onRefreshVideos}
                style={{ color: themeColors.blueBg }}
                enabled={true}
              />
            }
          />
        </View>
        <DialougeModal
          isVisible={isModalVisible}
          alertType={Config.ERROR_TYPE}
          title={bottomTitle}
          closeModal={alertModalClose}
          firstButtonHandle={firstButtonPress}
          secondButtonHandle={secondButtonPress}
          firstButtonText={"Yes"}
          secondButtonText={"No"}
          firstButtonStyle={{
            backgroundColor: themeColors.error,
            borderWidth: 0,
          }}
          firstButtonTextStyle={{ color: themeColors.onPrimary }}
          secondButtonStyle={{
            backgroundColor: themeColors.surfaceVariant,
            borderWidth: 0,
          }}
        />
      </View>
    </>
  );
};
const BlockedMedicine = ({
  blockprescriptionData,
  handleLoadMoreAdverseRx,
  renderFooterAdverseRx,
  onRemoveSideEffectFun,
  themeColors,
  refreshingAdverse,
  onRefreshAdverse,
  loading,
}) => {
  return (
    <>
      <FlatList
        data={blockprescriptionData}
        renderItem={({ item, index }) => (
          <PrescriptionItem
            blockMedicine={true}
            onRemoveSideEffect={onRemoveSideEffectFun}
            item={{
              id: item?.id,
              name: item?.name,
              additional_info: {
                side_effect: true,
                notes: item?.description,
                // start_date: item?.created_at,
              },
            }}
            // handleEditToggleCommDropdown={handleEditToggleCommDropdown}
            // handleDeleteName={handleDeleteName}
            index={index}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: Spacing.small }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => <ListEmpty visible={loading} />}
        onEndReachedThreshold={0.1}
        onEndReached={handleLoadMoreAdverseRx}
        ListFooterComponent={renderFooterAdverseRx}
        refreshControl={
          <RefreshControl
            refreshing={refreshingAdverse}
            onRefresh={onRefreshAdverse}
            style={{
              color: themeColors.blueBg,
              marginTop:
                Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
            }}
            enabled={true}
          />
        }
      />
    </>
  );
};
const LabTestRequest = ({
  // animalDetails,
  // type,
  // toggleActive,
  // toggleClosed,
  // animalMedicalLabData,
  // handleMoreDiagnosis,
  // renderDiagnosisFooter,
  // animalMedicalDiagnosisDataCount,
  // reduxColors,
  // permission,
  isLoadingLab,
  handleLoadMoreLab,
  renderFooterLab,
  labClosedCount,
  labActiveCount,
  toggleLabActive,
  toggleLabClosed,
  labType,
  animalMedicalLabData,
  reduxColors,
  onRefreshLabTest,
  refreshingLabTest,
  loading,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [openLab, setOpenLab] = useState("");
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const openPDF = async (pdfURL) => {
    const supported = await Linking.canOpenURL(pdfURL);

    if (supported) {
      await Linking.openURL(pdfURL);
    } else {
      console.error(`Don't know how to open URL: ${pdfURL}`);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: constThemeColor?.background }}>
      <Loader visible={isLoadingLab} />
      <View
        style={{
          backgroundColor: constThemeColor.background,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          padding: Spacing.small + Spacing.micro,
          paddingBottom: 0,
          shadowColor: constThemeColor.neutral50,
          elevation: 2,
          shadowOffset: {
            height: 2,
            width: 10,
          },
          marginBottom: Spacing.body + Spacing.mini,
          borderBottomColor: constThemeColor.primary,
          borderBottomWidth: 1,
        }}
      >
        <TouchableOpacity
          onPress={toggleLabActive}
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: Spacing.small + Spacing.micro,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: FontSize.Antz_Large_Title.fontSize,
                fontWeight: FontSize.Antz_Large_Title.fontWeight,
                color: constThemeColor.onSurfaceVariant,
                textAlign: "center",
              }}
            >
              {labActiveCount}
            </Text>
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                color: constThemeColor.cardLebel,
                marginBottom: Spacing.body,
                textAlign: "center",
              }}
            >
              Active
            </Text>
          </View>

          <View
            style={[
              {
                // height: type == "active" ? 6 : 0,
                height: 6,
                width: 85,
                borderTopLeftRadius: Spacing.small,
                borderTopRightRadius: Spacing.small,
                // backgroundColor: constThemeColor.primary,
                backgroundColor:
                  labType == "pending"
                    ? constThemeColor.primary
                    : "transparent",
              },
            ]}
          ></View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleLabClosed}
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: Spacing.small + Spacing.micro,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: FontSize.Antz_Large_Title.fontSize,
                fontWeight: FontSize.Antz_Large_Title.fontWeight,
                color: constThemeColor.onSurfaceVariant,
                textAlign: "center",
              }}
            >
              {labClosedCount}
            </Text>
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                color: constThemeColor.cardLebel,
                marginBottom: Spacing.body,
                textAlign: "center",
              }}
            >
              Closed
            </Text>
          </View>
          <View
            style={{
              // height: type == "closed" ? 6 : 0,
              height: 6,
              width: 85,
              borderTopLeftRadius: Spacing.small,
              borderTopRightRadius: Spacing.small,
              // backgroundColor: constThemeColor.primary,
              backgroundColor:
                labType == "completed"
                  ? constThemeColor.primary
                  : "transparent",
            }}
          ></View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          height: "100%",
          marginTop: 0,
          paddingHorizontal: Spacing.small,
          backgroundColor: constThemeColor?.background,
        }}
      >
        <FlatList
          data={animalMedicalLabData}
          contentContainerStyle={{
            marginHorizontal: Spacing.small,
            paddingBottom: Spacing.small,
          }}
          ListEmptyComponent={
            <ListEmpty label="No Lab test Request found" visible={loading} />
          }
          keyExtractor={(item, index) => index?.toString()}
          renderItem={({ item, index }) => {
            return (
              <>
                <View
                  style={{
                    paddingHorizontal: Spacing.mini,
                    paddingVertical: Spacing.small,
                  }}
                >
                  <Text style={[FontSize.Antz_Body_Title]}>
                    {item?.medical_record_code}
                  </Text>
                </View>
                {item?.lab_request?.map((labItem, labIndex) => {
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
                            openLab == labItem?.lab_test_id
                              ? setOpenLab("")
                              : setOpenLab(labItem?.lab_test_id)
                          }
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View>
                            <Text style={reduxColors?.labTextSub}>
                              {moment(labItem?.created_at).format(
                                "DD MMM YYYY"
                              )}
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
                              Lab Test - {labItem?.lab_test_id}
                            </Text>
                          </View>
                          {openLab == labItem?.lab_test_id ? (
                            <MaterialIcons
                              name="keyboard-arrow-up"
                              size={24}
                              color={constThemeColor?.primary}
                              onPress={() => setOpenLab("")}
                            />
                          ) : (
                            <MaterialIcons
                              name="keyboard-arrow-down"
                              size={24}
                              color={constThemeColor?.onSurfaceVariant}
                              onPress={() => setOpenLab(labItem?.lab_test_id)}
                            />
                          )}
                        </TouchableOpacity>
                        {openLab == labItem?.lab_test_id ? (
                          <View style={{ paddingTop: Spacing.major }}>
                            {labItem?.lab_test?.map((itemValue, index) => {
                              return (
                                <>
                                  <View>
                                    {itemValue?.tests ? (
                                      <Text style={reduxColors?.labTextTitle}>
                                        {itemValue?.sample_name}
                                      </Text>
                                    ) : null}

                                    <View>
                                      {itemValue?.tests?.map((value) => {
                                        return (
                                          <>
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
                                                    color:
                                                      reduxColors?.neutralPrimary,
                                                    fontSize:
                                                      FontSize.Antz_Body_Medium
                                                        .fontSize,
                                                    fontWeight:
                                                      FontSize.Antz_Body_Medium
                                                        .fontWeight,
                                                  },
                                                ]}
                                              >
                                                {value?.parent_test_name}
                                              </Text>
                                              {value?.parent_test_name ==
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
                                                  {value?.parent_test_name ==
                                                  "Others"
                                                    ? value?.input_value
                                                    : value?.test_name}
                                                </Text>
                                              ) : null}

                                              <View>
                                                {value?.child_test?.map(
                                                  (v, i) => {
                                                    return (
                                                      <>
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
                                                          <View
                                                            style={{
                                                              height: 21,
                                                              width: 21,
                                                              alignItems:
                                                                "center",
                                                              marginRight:
                                                                Spacing.micro,
                                                            }}
                                                          >
                                                            {v?.status &&
                                                            v?.status ==
                                                              "completed" ? (
                                                              <Ionicons
                                                                name="checkmark-circle"
                                                                size={20}
                                                                color={
                                                                  constThemeColor?.primary
                                                                }
                                                              />
                                                            ) : v?.status &&
                                                              v?.status ==
                                                                "pending" ? (
                                                              <Octicons
                                                                name="dot-fill"
                                                                size={20}
                                                                color={
                                                                  constThemeColor?.onSurfaceVariant
                                                                }
                                                              />
                                                            ) : v?.status &&
                                                              v?.status ==
                                                                "inprogress" ? (
                                                              <MaterialCommunityIcons
                                                                name="progress-clock"
                                                                size={20}
                                                                color={
                                                                  constThemeColor?.moderateSecondary
                                                                }
                                                              />
                                                            ) : (
                                                              <Octicons
                                                                name="dot-fill"
                                                                size={20}
                                                                color={
                                                                  constThemeColor?.onSurfaceVariant
                                                                }
                                                              />
                                                            )}
                                                          </View>
                                                          <Text
                                                            style={[
                                                              FontSize
                                                                .Antz_Body_Regular
                                                                .fontSize,
                                                              {
                                                                color:
                                                                  constThemeColor?.onSurfaceVariant,
                                                                flex: 1,
                                                                textAlignVertical:
                                                                  "center",
                                                              },
                                                            ]}
                                                            numberOfLines={2}
                                                            ellipsizeMode="tail"
                                                          >
                                                            {v?.test_name}
                                                          </Text>
                                                          {v?.attachments &&
                                                          v?.attachments !=
                                                            null &&
                                                          v?.attachments
                                                            ?.length > 0 ? (
                                                            <View
                                                              style={{
                                                                justifyContent:
                                                                  "center",
                                                                alignItems:
                                                                  "center",
                                                                flexDirection:
                                                                  "row",
                                                              }}
                                                            >
                                                              <Ionicons
                                                                name="attach"
                                                                size={21}
                                                                color={
                                                                  constThemeColor.onSurface
                                                                }
                                                              />
                                                              <Text
                                                                style={{
                                                                  fontSize:
                                                                    FontSize
                                                                      .Antz_Subtext_title
                                                                      .fontSize,
                                                                  fontWeight:
                                                                    FontSize
                                                                      .Antz_Subtext_title
                                                                      .fontWeight,
                                                                  color:
                                                                    constThemeColor?.onSurfaceVariant,
                                                                }}
                                                              >
                                                                {v?.attachments !=
                                                                  null &&
                                                                  v?.attachments
                                                                    ?.length}
                                                              </Text>
                                                            </View>
                                                          ) : null}
                                                        </View>
                                                      </>
                                                    );
                                                  }
                                                )}
                                              </View>
                                            </View>
                                          </>
                                        );
                                      })}
                                    </View>
                                  </View>
                                </>
                              );
                            })}

                            {labItem?.additional_samples ? (
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
                                            FontSize.Antz_Body_Medium.fontSize,
                                          fontWeight:
                                            FontSize.Antz_Body_Medium
                                              .fontWeight,
                                        },
                                      ]}
                                    >
                                      {labItem?.additional_samples}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            ) : null}
                            {labItem?.attachments != null &&
                            labItem?.attachments?.length > 0 ? (
                              <>
                                <View
                                  style={
                                    {
                                      // marginBottom: Spacing.minor
                                    }
                                  }
                                >
                                  <ImageViewer
                                    data={labItem?.attachments
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
                                      {labItem?.attachments
                                        .filter(
                                          (i) =>
                                            i.file_type.split("/")[0] != "image"
                                        )
                                        .map((item) => (
                                          <TouchableOpacity
                                            onPress={() => openPDF(item?.file)}
                                          >
                                            <View
                                              style={[
                                                reduxColors.attachBox,
                                                {
                                                  backgroundColor:
                                                    constThemeColor?.background,
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
              </>
            );
          }}
          onEndReachedThreshold={0.1}
          onEndReached={handleLoadMoreLab}
          ListFooterComponent={renderFooterLab}
          refreshControl={
            <RefreshControl
              refreshing={refreshingLabTest}
              onRefresh={onRefreshLabTest}
              style={{
                color: constThemeColor.blueBg,
                marginTop:
                  Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
              }}
              enabled={true}
            />
          }
        />
      </View>
    </View>
  );
};

const History = ({
  reduxColors,
  changeInnerName,
  themeColors,
  default_sub_tab,
  animalLogHistory,
  handleLoadMoreEncloHistory,
  renderFooterEncloHistory,
  EnclosureHistoryData,
  onRefreshInmates,
  refreshingInmates,
  onRefreshAnyother,
  refreshingAnyother,
  enclosureHistoryInmate,
  getEncloHistoryInmates,
  setencInmateData,
  loginHistoryModalRef,
  setEnclosureHistoryInmate,
  setIsLoading,
  isLoading,
}) => {
  const TAB_HEADER_ITEMS = [
    {
      id: "1",
      title: "Enclosures & Inmates",
      screen: "enclosurehistory",
      iconNormal: <Fontisto name="history" style={reduxColors.tabIcon} />,
      iconActive: (
        <Fontisto
          name="history"
          style={[reduxColors.tabIcon, { color: themeColors.primary }]}
        />
      ),
    },
    {
      id: "3",
      title: "Anyother",
      screen: "inmates",
      iconNormal: <FontAwesome5 name="store-alt" style={reduxColors.tabIcon} />,
      iconActive: (
        <FontAwesome5
          name="store-alt"
          style={[reduxColors.tabIcon, { color: themeColors.primary }]}
        />
      ),
    },
  ];

  // useEffect(() => {
  //   changeInnerName(default_sub_tab??"");
  //   // setScreen(default_sub_tab ? default_sub_tab : screen);
  // }, []);

  const Item = ({ title, screenName, iconNormal, iconActive }) => (
    <TouchableOpacity
      style={[
        // reduxColors.tabHeaderItemWrapper,
        {
          paddingVertical: Spacing.mini,
          marginHorizontal: Spacing.minor,
        },
        screenName === default_sub_tab
          ? { borderBottomColor: themeColors.primary, borderBottomWidth: 2 }
          : {},
      ]}
      onPress={() => {
        changeInnerName(screenName);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: Spacing.mini,
        }}
      >
        <View style={{}}>
          {screenName === default_sub_tab ? iconActive : iconNormal}
        </View>
        <Text
          style={[
            { paddingRight: Spacing.mini + Spacing.micro },
            screenName === default_sub_tab
              ? { color: themeColors.primary }
              : null,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Tabs.ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={{ backgroundColor: themeColors.onPrimary, flex: 1 }}>
          <View
            style={[reduxColors.tabHeaderWrapper, { alignItems: "center" }]}
          >
            <FlatList
              style={reduxColors.tabHeader}
              data={TAB_HEADER_ITEMS}
              renderItem={({ item }) => (
                <Item
                  title={item.title}
                  screenName={item.screen}
                  iconNormal={item.iconNormal}
                  iconActive={item.iconActive}
                  key={item.id}
                />
              )}
              keyExtractor={(item, index) => index?.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View
            style={[
              reduxColors.tabBody,
              {
                backgroundColor:
                  default_sub_tab == "enclosurehistory"
                    ? themeColors?.surfaceVariant
                    : null,
              },
            ]}
          >
            {default_sub_tab === "enclosurehistory" ? (
              <EnclosureHistory
                animalLogHistory={animalLogHistory}
                EnclosureHistoryData={EnclosureHistoryData}
                enclosureHistoryInmate={enclosureHistoryInmate}
                handleLoadMoreEncloHistory={handleLoadMoreEncloHistory}
                renderFooterEncloHistory={renderFooterEncloHistory}
                themeColors={themeColors}
                reduxColors={reduxColors}
                onRefreshInmates={onRefreshInmates}
                refreshingInmates={refreshingInmates}
                getEncloHistoryInmates={getEncloHistoryInmates}
                setencInmateData={setencInmateData}
                loginHistoryModalRef={loginHistoryModalRef}
                setEnclosureHistoryInmate={setEnclosureHistoryInmate}
                setIsLoading={setIsLoading}
                loading={isLoading}
              />
            ) : default_sub_tab === "inmates" ? (
              <Inmates
                InmatesData={null}
                themeColors={themeColors}
                onRefreshAnyother={onRefreshAnyother}
                refreshingAnyother={refreshingAnyother}
                loading={isLoading}
              />
            ) : null}
          </View>
        </View>
      </Tabs.ScrollView>
    </>
  );
};
const EnclosureHistory = ({
  animalLogHistory,
  EnclosureHistoryData,
  handleLoadMoreEncloHistory,
  renderFooterEncloHistory,
  themeColors,
  reduxColors,
  refreshingInmates,
  onRefreshInmates,
  enclosureHistoryInmate,
  getEncloHistoryInmates,
  setencInmateData,
  loginHistoryModalRef,
  setEnclosureHistoryInmate,
  setIsLoading,
  loading,
}) => {
  const [isHide, setIsHide] = useState(false);
  const [checkIndex, setCheckIndex] = useState(null);

  return (
    <View
      style={{
        marginHorizontal: Spacing.minor,
        marginTop: Spacing.body,
        flex: 1,
        backgroundColor: themeColors?.surfaceVariant,
      }}
    >
      {/* <View
        style={{
          backgroundColor: themeColors?.onPrimary,
          borderRadius: 8,
          padding: Spacing.body,
        }}
      >
        <View style={reduxColors?.historyStatsRow}>
          <Text style={reduxColors?.historyStatsType}>Total Enclosures</Text>
          <Text
            style={[
              reduxColors?.historyStatsType,
              { fontWeight: FontSize.Antz_Minor_Title.fontWeight },
            ]}
          >
            {EnclosureHistoryData?.total_enclosure ?? 0}
          </Text>
        </View>
        <View style={reduxColors?.historyStatsRow}>
          <Text style={reduxColors?.historyStatsType}>Total Inmates</Text>
          <Text
            style={[
              reduxColors?.historyStatsType,
              { fontWeight: FontSize.Antz_Minor_Title.fontWeight },
            ]}
          >
            {EnclosureHistoryData?.total_inmates ?? 0}
          </Text>
        </View>
      </View> */}
      {animalLogHistory && (
        <FlatList
          data={animalLogHistory}
          renderItem={({ item, index }) => (
            <>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: themeColors.outlineVariant,
                  marginTop: Spacing.small,
                  borderRadius: Spacing.small,
                  backgroundColor: themeColors.surface,
                }}
              >
                <EnclosureHistoryCard2
                  encHistoryData={item}
                  getEncloHistoryInmates={getEncloHistoryInmates}
                />

                <TouchableOpacity
                  style={{
                    backgroundColor: isHide
                      ? themeColors.background
                      : themeColors.onPrimary,
                    padding: Spacing.body,
                    borderTopWidth: 1,
                    borderColor: themeColors.outlineVariant,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomLeftRadius: isHide ? 0 : Spacing.small,
                    borderBottomRightRadius: isHide ? 0 : Spacing.small,
                  }}
                  onPress={() => {
                    setIsLoading(true);
                    setEnclosureHistoryInmate([]);
                    getEncloHistoryInmates(1, item);
                    loginHistoryModalRef.current.present();
                    setencInmateData(item);
                    setCheckIndex(index);
                  }}
                >
                  <Text
                    style={{
                      color: themeColors.onSurfaceVariant,
                      fontSize: FontSize.Antz_Minor_Regular.fontSize,
                      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                      }}
                    >
                      {item?.total_inmates ?? 0}
                    </Text>{" "}
                    Inmates
                  </Text>
                  {isHide ? (
                    <MaterialIcons
                      name="keyboard-arrow-up"
                      size={24}
                      color="black"
                    />
                  ) : (
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={24}
                      color="black"
                    />
                  )}
                </TouchableOpacity>

                {/* {checkIndex == index && (
                  <FlatList
                    data={enclosureHistoryInmate}
                    renderItem={({ item }) => (
                      <EnclosureInmateCard item={item} />
                    )}
                    keyExtractor={(item, index) => index?.toString()}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => <ListEmpty />}
                    onEndReached={handleLoadMoreEncloHistory}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={renderFooterEncloHistory}
                  />
                )} */}
              </View>
            </>
          )}
          keyExtractor={(item, index) => index?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Spacing.body }}
          ListEmptyComponent={() => <ListEmpty visible={loading} />}
        />
      )}
    </View>
  );
};
const Inmates = ({
  InmatesData,
  themeColors,
  onRefreshAnyother,
  refreshingAnyother,
  loading,
}) => {
  return (
    <View style={{ marginHorizontal: Spacing.minor, marginTop: Spacing.body }}>
      {InmatesData ? (
        <FlatList
          data={InmatesData}
          renderItem={({ item }) => (
            <MedicalListCard item={item} fromMedicalBasicPage={true} />
          )}
          keyExtractor={(item, index) => index?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Spacing.body }}
          refreshControl={
            <RefreshControl
              refreshing={refreshingAnyother}
              onRefresh={onRefreshAnyother}
              style={{
                color: themeColors.blueBg,
                marginTop:
                  Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
              }}
              enabled={true}
            />
          }
        />
      ) : (
        <View>
          <ListEmpty label="No inmates record found" visible={loading} />
        </View>
      )}
    </View>
  );
};
// STYLES STARTS FROM HERE
const windowHeight = Dimensions.get("screen").height;
const windowWidth = Dimensions.get("screen").width;
const styles = (reduxColors) =>
  StyleSheet.create({
    // Master Container
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
      // paddingBottom: heightPercentageToDP(2),
    },
    header: {
      //height: Header_Maximum_Height,
      width: "100%",
      backgroundColor: "transparent",
    },

    masterContainer: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
    },

    // Header Container
    headerContainer: {
      // flex: 1,
      width: "100%",
    },

    linearGradient: {
      width: "100%",
      height: "100%",
    },

    overlayContent: {
      width: "80%",
      marginHorizontal: "8%",
      // padding : "3%"
    },

    medicalHeadingSection: {
      flexDirection: "row",
      alignItems: "center",
    },
    // notesDataBox: {
    //   height: heightPercentageToDP(8),
    //   width: widthPercentageToDP(65),
    //   backgroundColor: "#f9e7c0",
    //   borderRadius: 15,
    //   padding: 8,
    //   marginBottom: 5,
    //   marginTop: 2,
    // },                         //UN-USED CSS CODE comment

    medicalInnerList: {
      flexDirection: "row",
      marginLeft: 30,
      flexWrap: "wrap",
    },
    commonTextStyle: {
      marginLeft: 5,
      backgroundColor: reduxColors.surface,
      padding: 3,
      borderRadius: 4,
      marginTop: 2,
    },
    notesTextStyle: {
      marginLeft: 5,
      backgroundColor: reduxColors.notes,
      padding: 3,
      borderRadius: 4,
      marginTop: 2,
    },
    name: {
      color: reduxColors.onPrimary,
      marginVertical: 1,
    },

    scientificName: {
      color: reduxColors.onPrimary,
      fontStyle: "italic",
      fontSize: FontSize.Antz_Strong,
      marginVertical: 2,
    },

    sexAndAge: {
      flexDirection: "row",
      marginVertical: 2,
    },

    sex: {
      color: reduxColors.onPrimary,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
    },
    sexValue: {
      color: reduxColors.onPrimary,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: FontSize.Antz_Body_Title.fontSize,
    },

    fourthRow: {
      width: "70%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 2,
    },

    age: {
      color: reduxColors.onPrimary,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: heightPercentageToDP(1.8),
    },

    enclosureAndRingId: {
      flexDirection: "row",
      marginVertical: 2,
    },

    enclosure: {
      color: reduxColors.onPrimary,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: heightPercentageToDP(1.8),
    },

    ringId: {
      color: reduxColors.onPrimary,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: heightPercentageToDP(1.8),
    },

    tagAndHash: {
      flexDirection: "row",
      // marginVertical: Spacing.small,
      marginTop: Spacing.mini,
    },

    tagContainer: {
      borderRadius: 6,
      backgroundColor: reduxColors.onPrimary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginHorizontal: 2,
    },

    tagText: {
      color: "#FB4364",
      fontSize: 14,
      padding: 2,
    },

    // hashContainer: {
    //   borderRadius: 6,
    //   backgroundColor: "#338bf2",        //UN-used css  comment
    //   paddingHorizontal: 10,
    //   paddingVertical: 6,
    //   marginHorizontal: 4,
    // },

    deadContainer: {
      borderRadius: 8,
      backgroundColor: reduxColors.error,
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginHorizontal: 1.2,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    deadText: {
      color: reduxColors.onPrimary,
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      marginLeft: 5,
    },
    hashText: {
      color: reduxColors.onPrimary,
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      marginLeft: 5,
    },

    textShadow: {
      textShadowColor: reduxColors.housingOverlay,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 10,
    },

    // Body Container

    boxShadow: {
      shadowColor: reduxColors.neutralPrimary,
      shadowOffset: { width: -2, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 4,
    },

    bodyContainer: {
      position: "relative",
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
      paddingTop: "4%",
    },

    tabHeaderWrapper: {
      borderBottomColor: reduxColors.surfaceVariant,
      borderBottomWidth: 1,
      backgroundColor: reduxColors.onPrimary,
    },

    tabHeaderItemWrapper: {
      paddingVertical: Spacing.mini,
      marginHorizontal: Spacing.minor,
    },

    tabIcon: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      marginHorizontal: 4,
      // top: 4,
    },

    tabHeaderItem: {
      padding: 4,
      color: reduxColors.neutralSecondary,
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },

    tabBody: {
      flex: 1,
    },
    fabStyle: {
      margin: widthPercentageToDP(5),
      right: widthPercentageToDP(2),
      bottom: heightPercentageToDP(8.5),
      width: 50,
      height: 50,
      // marginBottom: heightPercentageToDP(4.5),
      justifyContent: "center",
      alignItems: "center",
    },
    actionButtonStyle: {
      marginBottom: heightPercentageToDP(7),
      right: widthPercentageToDP(0.7),
    },
    actionButtonStyleTop: {
      right: widthPercentageToDP(1.3),
    },
    card: {
      // marginHorizontal: "4%",
      marginHorizontal: Spacing.minor,
      marginVertical: Spacing.small,
      backgroundColor: reduxColors.displaybgPrimary,
    },
    parentCard: {
      width: "90%",
      marginVertical: "3%",
      backgroundColor: reduxColors.onPrimary,
    },
    parentCardSubtitle: {
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      color: reduxColors.onSecondaryContainer,
    },

    cardContentRow: {
      flexDirection: "row",
      marginHorizontal: "2%",
      marginVertical: "5%",
    },

    cardContentItem: {
      flex: 0.5,
    },

    mortalityContentItem: {
      // paddingVertical: 10,
      marginVertical: Spacing.small,
    },

    cardContentTitle: {
      color: reduxColors.neutralSecondary,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },

    mortalityNotesBox: {
      // backgroundColor: reduxColors.notes,
      // minHeight: 56,
      // borderRadius: 4,
      // padding: 8,
      // marginTop: 5,
      // justifyContent: "center",

      backgroundColor: reduxColors.notes,
      minHeight: 50,
      borderRadius: 4,
      paddingVertical: Spacing.small,
      paddingHorizontal: Spacing.minor,
      marginTop: Spacing.mini,
      // width: wp(82),

      display: "flex",
      justifyContent: "center",
    },

    cardContentData: {
      color: reduxColors.onSecondaryContainer,
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      marginTop: Spacing.micro,
    },
    parent: {
      flexDirection: "row",
    },
    main: {
      width: widthPercentageToDP(85),
    },
    imgBox: {
      justifyContent: "center",
      paddingHorizontal: widthPercentageToDP(4.5),
    },
    img: {
      width: widthPercentageToDP(14),
      height: heightPercentageToDP(8),
      resizeMode: "contain",
    },
    qrCardContentRow: {
      alignItems: "center",
      justifyContent: "center",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: reduxColors.blackWithPointEight,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: reduxColors.onPrimary,
      minHeight: Math.floor(windowHeight * 0.3),
      width: "96%",
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    modalHeader: {
      height: heightPercentageToDP(8),
      width: widthPercentageToDP(85),
      flexDirection: "row",
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: reduxColors.outline,
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalItem: {
      minHeight: hp(10),
    },
    closeBtn: {
      // width: "10%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },

    modalBody: {
      height: "100%",
      flex: 1,
      // paddingBottom: 80,
      width: "90%",
      // backgroundColor: "red",
    },
    modalNotesBtnCover: {
      width: "auto",
      height: 38,
      marginVertical: 6,
      paddingVertical: 2,
      paddingHorizontal: 12,
      // marginTop: 10,
      borderWidth: 1,
      borderRightWidth: 0,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.onPrimary,
      justifyContent: "center",
      alignItems: "center",
    },
    modalBtnCover: {
      margin: 10,
      paddingVertical: 2,
      paddingHorizontal: 20,
      // marginTop: 10,
      borderRadius: 3,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      // width: wp(),
      height: hp(4.5),
      backgroundColor: reduxColors.primary,
    },
    notesInput: {
      width: "100%",
      minHeight: 41,
      padding: 10,
      paddingTop: 11,
      backgroundColor: reduxColors.notes,
      color: reduxColors.onErrorContainer,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      lineHeight: 17,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: reduxColors.onErrorContainer,
      marginBottom: 15,
    },
    bottomBtnTxt: {
      fontSize: FontSize.Antz_Minor,
      color: reduxColors.onPrimary,
    },
    animalCardStyle: {
      justifyContent: "center",
      width: widthPercentageToDP(85),
      borderWidth: 0.5,
      borderRadius: 6,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.surface,
      paddingHorizontal: widthPercentageToDP(2.5),
      // height: heightPercentageToDP(6.5),
    },
    animalCardStyle1: {
      justifyContent: "center",
      width: widthPercentageToDP(40),
      borderWidth: 0.5,
      borderRadius: 6,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.surface,
      paddingHorizontal: widthPercentageToDP(2.5),
      // height: heightPercentageToDP(6.5),
    },
    commonBoxView: {
      marginTop: heightPercentageToDP(2),
      // width: widthPercentageToDP(75),
    },
    commonBoxView1: {
      marginTop: heightPercentageToDP(2),
      flexDirection: "row",
      justifyContent: "space-between",
      width: widthPercentageToDP(85),
    },
    itemRow: {
      flexDirection: "row",
      marginTop: heightPercentageToDP(2),
      alignItems: "center",
      width: widthPercentageToDP(85),
    },
    administerStatsCount: {
      fontSize: FontSize.Antz_Major_Title.fontSize,
      fontWeight: FontSize.Antz_Major_Title.fontWeight,
      color: reduxColors?.onPrimaryContainer,
    },
    administerStatsType: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors?.cardLebel,
    },
    historyStatsType: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors?.onSurfaceVariant,
    },
    historyStatsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: Spacing.mini,
    },

    medicalInnerList: {
      // flexDirection: "row",
      marginLeft: Spacing.major + Spacing.mini,
      flexWrap: "wrap",
    },
    medicalInnerListGrey: {
      // marginLeft: Spacing.major + Spacing.mini,
      flexWrap: "wrap",
      alignSelf: "flex-start",
      borderRadius: Spacing.mini,
      // backgroundColor: reduxColors.background,
    },
    attachBox: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      marginBottom: 3,
      marginTop: 3,
      backgroundColor: reduxColors.surface,
    },
    // card: {
    //   paddingHorizontal: Spacing.minor,
    // },

    labContainer: {
      backgroundColor: reduxColors?.onPrimary,
      width: "100%",
      padding: Spacing.body,
      borderRadius: 8,
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
