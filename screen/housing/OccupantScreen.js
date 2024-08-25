// Created By: Wasim Akram
// Created At: 03/05/2023
// modified by Wasim Akram at 04/05/2023

import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  BackHandler,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";

import {
  LengthDecrease,
  capitalizeFirstLetterAndUppercaseRest,
  checkPermissionAndNavigate,
  checkPermissionAndNavigateWithAccess,
  contactFun,
  getDocumentData,
  getFileData,
  getFileInfo,
  ifEmptyValue,
  isLessThanTheMB,
  opacityColor,
  removeUnderScore,
} from "../../utils/Utils";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { capitalize } from "../../utils/Utils";
import { Card, Checkbox, Chip, Divider, FAB } from "react-native-paper";
import CustomCard from "../../components/CustomCard";
import {
  getAnimalListBySections,
  getBasicInfoData,
  getHistoryData,
  getInchargesListingByEnclosure,
  getSpeciesListByEnclousre,
} from "../../services/GetEnclosureBySectionIdServices";
import Loader from "../../components/Loader";
import { useEffect } from "react";
import { shortenNumber } from "../../utils/Utils";
import DownloadFile from "../../components/DownloadFile";
import {
  GetAnimalListBySpecies,
  GetDetailesEnclosure,
  GetSubEnclosuresList,
} from "../../services/FormEnclosureServices";
import { useDispatch, useSelector } from "react-redux";
import AnimatedHeader from "../../components/AnimatedHeader";
import TabBarStyles from "../../configs/TabBarStyles";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
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
import { throttle } from "lodash";
import { removeAnimalMovementData } from "../../redux/AnimalMovementSlice";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import ListEmpty from "../../components/ListEmpty";
import ObservationCard from "../Observation/ObservationCard";
import {
  getObservationList,
  getObservationListOccupant,
  getObservationListforAdd,
} from "../../services/ObservationService";
import SpeciesCustomCard from "../../components/SpeciesCustomCard";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import SubmitBtn from "../../components/SubmitBtn";
import { Video } from "expo-av";
import ImageViewer from "../../components/ImageViewer";
import {
  allAddMedia,
  deleteMedia,
  getDocs,
} from "../../services/AnimalService";
import { errorToast, successToast, warningToast } from "../../utils/Alert";
import AnimalImageViewer from "../../components/AnimalImageViewer";
import HousingInsightCard from "../../components/housing/HousingInsightCard";
import Switch from "../../components/Switch";
import EnclosureInsightCard from "../../components/housing/EnclosureInsightCard";
import EnclosureOccupantsCard from "../../components/EnclosureOccupantsCard";
import EnclosuresList from "../../components/EnclosuresList";
import BottomSheetModalComponent from "../../components/BottomSheetModalComponent";
import AnimalsList from "../../components/AnimalsList";
import SliderComponent from "../../components/SliderComponent";
import {
  setEffectListApiCall,
  setMedicalAnimal,
  setMedicalEnclosure,
  setMedicalSection,
  setMedicalSite,
} from "../../redux/MedicalSlice";
import { RefreshControl } from "react-native-gesture-handler";
import { getAsyncData } from "../../utils/AsyncStorageHelper";
import { Platform } from "react-native";
import {
  addHousingInChargeMember,
  getHousingInChargesList,
} from "../../services/housingService/SectionHousing";
import { useToast } from "../../configs/ToastConfig";
import HousingSearchBox from "../../components/HousingSearchBox";
import MedicalRecordCardComponent from "../../components/MedicalRecordCardComponent";
import Config, { AddAnimalTypeData, FilterMaster } from "../../configs/Config";
import moment from "moment";
import { getMedicalRecordCount } from "../../services/medicalRecord";
import DialougeModal from "../../components/DialougeModal";
import { searchUserListing } from "../../services/Animal_movement_service/SearchApproval";
import FilterComponent from "../../components/FilterComponent";
import Gallery from "../../assets/Gallery.svg";
import Videos from "../../assets/Video.svg";
import Documents from "../../assets/Document.svg";
import { SvgXml } from "react-native-svg";
import { handleFilesPick } from "../../utils/UploadFiles";
{
  /* Author- Ashutosh 
    Date - 08-05-023
    Des - API implementation 
*/
}

const OccupantScreen = (props) => {
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const [basicInfoData, setBasicInfoData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [enclosureDetails, setenclosureDetails] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [historyDataLength, sethistoryDataLength] = useState(0);
  const [speciesListData, setSpeciesListData] = useState([]);
  const [speciesDataLength, SetSpeciesDataLength] = useState(0);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [speciesPage, setSpeciesPage] = useState(1);
  const [innerTab, setInnerTab] = useState("occupantsAnimal");
  const [historypage, setHistoryPage] = useState(1);
  const [page, setPage] = useState(1);
  const [tabBarBorderRadius, setTabBarBorderRadius] = useState(false);
  const permission = useSelector((state) => state.UserAuth.permission);
  const [inchargeData, setInchargeData] = useState([]);
  const [screenName, setScreenName] = useState(
    permission["collection_animal_records"] ? "Occupants" : "Overview"
  );
  const [selectedImages, setSelectedImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [documentModal, setDocumentModal] = useState(false);
  const [isRestricted, setIsResticted] = useState(false);
  const video = React.useRef(null);
  const [mediaTabName, setMediaTabName] = useState("");
  const [observationdata, setObservationdata] = useState([]);
  const [observationLength, setObservationLength] = useState(0);
  const [observationCount, setObservationCount] = useState(0);
  const [obserPage, setObserPage] = useState(1);
  const [Items, setItems] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [filterData, setFilterData] = useState(null);
  const [moreObservationLoading, setMoreObservationLoading] = useState(false);
  const [showAccessionModal, setShowAccessionModal] = useState(false);
  const [bottomTitle, setBottomTitle] = useState("");
  const [type, setType] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

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

  const [openEnclosuresList, setOpenEnclosuresList] = useState([]);
  const [currentEnclosure, setCurrentEnclosure] = useState(null);
  const [animalListPage, setAnimalListPage] = useState(1);
  const [animalListBySpecies, setAnimalListBySpecies] = useState([]);
  const [animalListStats, setAnimalListStats] = useState({
    total_species_count: 0,
    total_animal_count: 0,
  });
  const [stopCallAnimalList, setStopCallAnimalList] = useState(false);
  const [stopAnimalListCount, setStopAnimalListCount] = useState(0);

  const [includeSubenclosures, setIncludeSubenclosures] = useState(false);
  const [isAnimalsListModalVisible, setIsAnimalsListModalVisible] =
    useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [isHideStats, setIsHideStats] = useState(null);

  const animalsListModalRef = useRef(null);

  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = pageStyles(themeColors);
  const route = useRoute();
  const navigation = useNavigation();

  const isFocused = useIsFocused();

  // for medical record

  const [medicalStatsCount, setMedicalStatsCount] = useState("");
  // *****this is for medical filter count update*****/
  const [selectDropValue, setSelectDropValue] = useState("Last 6 Months");
  // for this months start date
  const dateFormat = "YYYY-MM-DD";
  const currentDate = new Date();

  const Last6Months = moment(currentDate)
    .subtract(6, "months")
    .format(dateFormat);

  const end_date = moment(currentDate).format(dateFormat);

  const [startDate, setStartDate] = useState(Last6Months);
  const [endDate, setEndDate] = useState(end_date);

  /*****set date and update the count*****/
  const setDates = (s, e, item) => {
    setStartDate(s);
    setEndDate(e);
    setSelectDropValue(item);
  };

  function findIdByName(nameToFind, dataArray) {
    const result = dataArray.find((item) => item.name === nameToFind);
    return result ? result.id?.toString() : null;
  }
  const selectDropID = findIdByName(selectDropValue, FilterMaster);
  const closeAccessionModal = () => {
    setShowAccessionModal(false);
  };
  // for incharge select
  const [enclosureInchargeList, setEnclsoureInchargeList] = useState([]);
  const [sectionSelectedInchargeId, setSectionSelectedInchargeId] = useState(
    []
  );
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const [isAddEnclsoureInCharge, setIsAddEnclosureInCharge] = useState(false);

  const approver = useSelector((state) => state.AnimalMove.approver);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [deleteId, setDeleteId] = useState("");
  const dispatch = useDispatch();

  // handles the on press of inChargeAdd (from the inChargeAndApproverSelect page)
  useFocusEffect(
    React.useCallback(() => {
      if (Object.keys(approver)?.length > 0) {
        if (approver?.length > 0 && isAddEnclsoureInCharge) {
          addSiteIncharge(approver);
        }
      }
      return () => {};
    }, [JSON.stringify(approver), isAddEnclsoureInCharge])
  );

  const getObservation = (count, filter) => {
    const obj = {
      id: currentEnclosure,
      type: "enclosure",
      page_no: count,
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
        if (res?.success) {
          let dataArr = count == 1 ? [] : observationdata;
          setObservationCount(
            res?.data?.total_count == undefined ? 0 : res?.data?.total_count
          );

          if (res?.data) {
            if (res?.data?.result) {
              dataArr = dataArr.concat(res?.data?.result);
            }
            setObservationdata(dataArr);
            setObservationLength(dataArr?.length);
            setIsLoading(false);
          }
        }
      })
      .catch((e) => {
        setIsLoading(false);
      })
      .finally(() => {
        setMoreObservationLoading(false);
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const observhandleLoadMore = () => {
    if (
      !isLoading &&
      !moreObservationLoading &&
      observationLength >= 10 &&
      observationLength !== observationCount
    ) {
      setMoreObservationLoading(true);
      const nextPage = obserPage + 1;
      setObserPage(nextPage);
      getObservation(nextPage, filterData);
    }
  };

  const observrenderFooter = () => {
    if (
      isLoading ||
      observationLength < 10 ||
      observationLength == observationCount
    )
      return null;
    return <ActivityIndicator style={{ color: themeColors?.housingPrimary }} />;
  };

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
    setObservationLength(0);
    setObservationdata([]);
    setFilterData(filter);
  };

  //medical record

  const medicalCountFilterStats = () => {
    let obj = {
      enclosure_id: currentEnclosure,
      medical: "zoo",
      start_date: startDate ?? "",
      end_date: endDate ?? "",
    };
    getMedicalRecordCount(obj)
      .then((res) => {
        setMedicalStatsCount(res?.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      if (currentEnclosure !== null) {
        getenclosureDetails();
      }
      return () => {};
    }, [navigation, currentEnclosure])
  );

  useEffect(() => {
    if (currentEnclosure === null) {
      setCurrentEnclosure(route?.params?.enclosure_id);
    }
  }, [route?.params?.enclosure_id]);
  useFocusEffect(
    React.useCallback(() => {
      if (currentEnclosure !== null) {
        if (currentEnclosure) {
          setIsLoading(true);
          setAnimalListPage(1);
          getAnimalListBySpecies(1, includeSubenclosures);
        }
        if (screenName == "Occupants" && animalListBySpecies?.length === 0) {
          setIsLoading(true);
          setAnimalListPage(1);
          getAnimalListBySpecies(1, includeSubenclosures);
        } else if (screenName == "Overview" && basicInfoData?.length === 0) {
          setIsLoading(true);
          loadBasicInfo();
        } else if (
          screenName == "Incharges" &&
          enclosureInchargeList?.length === 0
        ) {
          setSearchText("");
          setIsLoading(true);
          // getInchargeData();
          fetchInchargeListData(1, "");
        } else if (screenName == "History" && historyData?.length === 0) {
          setHistoryPage(1);
          setIsLoading(true);
          loadHistoryData(1);
        } else if (screenName == "Notes" && observationLength === 0) {
          setIsLoading(true);
          setObserPage(1);
          getObservation(1, filterData);
        } else if (screenName == "Medical Record") {
          setIsLoading(true);
          medicalCountFilterStats();
        } else if (screenName === "species") {
          setIsLoading(true);
          setSpeciesPage(1);
          loadSpeciesData(1);
        } else if (screenName === "Media") {
          if (mediaTabName == "images" && selectedImages?.length === 0) {
            GetDocsData(1, "images");
            setIsLoading(true);
            fetchInchargeListData(1, "");
          } else if (mediaTabName == "videos" && documents?.length === 0) {
            GetDocsData(1, "videos");
            setIsLoading(true);
            fetchInchargeListData(1, "");
          } else if (
            mediaTabName == "documents" &&
            selectedVideos?.length === 0
          ) {
            GetDocsData(1, "documents");
            setIsLoading(true);
            fetchInchargeListData(1, "");
          }
        }
      }

      return () => {};
    }, [
      navigation,
      screenName,
      currentEnclosure,
      includeSubenclosures,
      mediaTabName,
      startDate,
      endDate,
      filterData,
    ])
  );

  useEffect(() => {
    const backAction = () => {
      if (isAnimalsListModalVisible) {
        animalsListModalRef.current.close();
        setSelectedSpecies(null);
      } else {
        onBackPress();
      }
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation, isAnimalsListModalVisible, openEnclosuresList]);

  useFocusEffect(
    useCallback(() => {
      getHideStatsValue();
    }, [])
  );

  const getHideStatsValue = async () => {
    const value = await getAsyncData("@antz_hide_stats");
    setIsHideStats(value);
  };

  const onBackPress = () => {
    if (openEnclosuresList?.length > 0) {
      const newList = [...openEnclosuresList];
      const poppedId = newList?.pop();
      setOpenEnclosuresList(newList);
      setCurrentEnclosure(poppedId);
      // ref.current?.setIndex(1);
      // setScreenName("Occupants");
    } else {
      navigation.goBack();
    }
  };

  const getenclosureDetails = () => {
    setIsLoading(true);
    GetDetailesEnclosure(currentEnclosure)
      .then((res) => {
        if (
          enclosureDetails === null &&
          Number(res.data?.total_sub_enclosure_count) > 0
        ) {
          setIncludeSubenclosures(true);
        }
        setenclosureDetails(res.data);
      })
      .catch((err) => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getAnimalListBySpecies = (page_no, includeSubenclosures) => {
    // setIsLoading(true);
    GetAnimalListBySpecies(currentEnclosure, {
      page_no: page_no,
      include_sub_enclosure: includeSubenclosures ? 1 : 0,
    })
      .then((res) => {
        if (page_no === 1) {
          setAnimalListBySpecies(res?.data?.listing ?? []);
          setAnimalListStats(res?.data?.stats);
        } else {
          setAnimalListBySpecies((prev) => [
            ...prev,
            ...(res?.data?.listing ?? []),
          ]);
        }
        if (includeSubenclosures) {
          setStopAnimalListCount(Number(res?.data?.listing?.length ?? 0));
          setStopCallAnimalList(
            Number(res?.data?.listing?.length ?? 0) ===
              Number(res?.data?.stats?.total_species_count)
          );
        } else {
          setStopAnimalListCount(Number(res?.data?.listing?.length ?? 0));
          setStopCallAnimalList(Number(res?.data?.listing?.length ?? 0) === 0);
        }
      })
      .catch((err) => {
        // console.log('err', err);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const getInchargeData = () => {
    setIsLoading(true);
    getInchargesListingByEnclosure({
      enclosure_id: currentEnclosure,
    })
      .then((res) => {
        setInchargeData(res.data.incharge);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const addSiteIncharge = (users) => {
    setIsLoading(true);
    const requestObj = {
      ref_id: currentEnclosure,
      ref_type: "enclosure",
      user_id: users?.map((i) => i.user_id).join(","),
    };

    addHousingInChargeMember(requestObj)
      .then((res) => {
        dispatch(removeAnimalMovementData());
        if (res?.success) {
          successToast("success", res?.message);
        } else {
          errorToast("error", res?.message);
        }
        setIsAddEnclosureInCharge(false);
        fetchInchargeListData(1, "");
      })
      .catch((err) => {
        console.log(err);
        errorToast("success", JSON.stringify(err));
        setIsLoading(false);
      })
      .finally(() => setIsLoading(false));
  };

  const fetchInchargeListData = (count, search) => {
    const requestObj = {
      ref_id: currentEnclosure,
      ref_type: "enclosure",
      q: search,
      page_no: count,
    };
    getHousingInChargesList(requestObj)
      .then((res) => {
        if (res.success) {
          setEnclsoureInchargeList(res?.data);
          if (search?.length == 0) {
            setSectionSelectedInchargeId(res?.data);
          }
        }
        setIsLoading(false);
        setSearchLoading(false);
      })
      .catch((err) => {
        console.log("error", { err });
        setIsLoading(false);
        setRefreshing(false);
        setSearchLoading(false);
      })
      .finally(() => {
        setRefreshing(false);
        setIsLoading(false);
        setSearchLoading(false);
      });
  };

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.length >= 3) {
      const getData = setTimeout(() => {
        setSearchLoading(true);

        fetchInchargeListData(1, text);
      }, 2000);
      return () => clearTimeout(getData);
    } else if (text.length == 0) {
      const getData = setTimeout(() => {
        if (screenName == "Incharges") {
          setSearchLoading(true);
          fetchInchargeListData(1, "");
        }
      }, 2000);
      return () => clearTimeout(getData);
    }
  };
  const SearchRemove = () => {
    setSearchText("");
    setSearchLoading(true);
    if (screenName == "Incharges") {
      fetchInchargeListData(1, "");
    }
  };

  const loadBasicInfo = () => {
    setIsLoading(true);
    getBasicInfoData(currentEnclosure)
      .then((res) => {
        setBasicInfoData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };
  const loadSpeciesData = (count) => {
    getSpeciesListByEnclousre({
      enclosure_id: currentEnclosure,
      page_no: count,
    })
      .then((res) => {
        let dataArr = count == 1 ? [] : speciesListData;
        if (res.data) {
          setSpeciesCount(res?.data?.count);
          SetSpeciesDataLength(res.data?.result ? res.data?.result?.length : 0);
          setSpeciesListData(dataArr.concat(res.data?.result));
        }

        setIsLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setRefreshing(false);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const SpeciesrenderFooter = () => {
    if (
      isLoading ||
      speciesDataLength < 10 ||
      speciesListData?.length == speciesCount
    ) {
      return null;
    }

    return <ActivityIndicator style={{ color: themeColors?.housingPrimary }} />;
  };

  const SpecieshandleLoadMore = () => {
    if (
      !isLoading &&
      speciesDataLength > 0 &&
      speciesListData?.length != speciesCount
    ) {
      const nextPage = speciesPage + 1;
      setSpeciesPage(nextPage);
      loadSpeciesData(nextPage);
    }
  };

  const loadHistoryData = (count) => {
    // setIsLoading(true);
    getHistoryData({
      enclosure_id: currentEnclosure,
      page_no: count,
    })
      .then((res) => {
        let dataArr = count == 1 ? [] : historyData;
        sethistoryDataLength(res?.data ? res.data?.length : 0);
        if (res?.data) {
          setHistoryData(dataArr.concat(res?.data));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const historyHandleLoadMore = () => {
    if (!refreshing && !isLoading && historyDataLength > 0) {
      const nextPage = historypage + 1;
      setRefreshing(true);
      setHistoryPage(nextPage);
      loadHistoryData(nextPage);
    }
  };

  const historyRenderFooter = () => {
    if (
      isLoading ||
      historyDataLength == 0 ||
      historyDataLength < 10 ||
      !refreshing
    )
      return null;
    return <ActivityIndicator style={{ color: themeColors?.housingPrimary }} />;
  };

  const OccupantsHandleLoadMore = () => {
    if (
      !stopCallAnimalList &&
      !isLoading &&
      animalListBySpecies?.length >= 10 &&
      stopAnimalListCount >= 10
    ) {
      const nextPage = page + 1;
      setAnimalListPage(nextPage);
      getAnimalListBySpecies(nextPage, includeSubenclosures);
    }
  };
  const OccupantsRenderFooter = () => {
    if (
      isLoading ||
      stopCallAnimalList ||
      animalListBySpecies?.length < 10 ||
      stopAnimalListCount < 10
    ) {
      return null;
    } else {
      return (
        <ActivityIndicator style={{ color: themeColors?.housingPrimary }} />
      );
    }
  };

  const onRefreshOccupant = () => {
    setRefreshing(true);
    getAnimalListBySpecies(1, includeSubenclosures);
    getenclosureDetails();
  };

  const onRefreshIncharge = () => {
    setRefreshing(true);
    getInchargeData();
    getenclosureDetails();
  };

  const onRefreshDocuments = () => {
    setRefreshing(true);
    GetDocsData(1, "documents");
    getenclosureDetails();
  };
  const onRefreshVideos = () => {
    setRefreshing(true);
    GetDocsData(1, "videos");
    getenclosureDetails();
  };
  const onRefreshImage = () => {
    setRefreshing(true);
    GetDocsData(1, "images");
    getenclosureDetails();
  };

  const onRefreshHistory = () => {
    setRefreshing(true);
    loadHistoryData(1);
    getenclosureDetails();
  };

  const onRefreshNotes = () => {
    setRefreshing(true);
    setObserPage(1);
    getObservation(1, filterData);
    getenclosureDetails();
  };

  const onRefreshOverview = () => {
    setRefreshing(true);
    loadBasicInfo();
    getenclosureDetails();
  };
  const onRefreshMedical = () => {
    setRefreshing(true);
    medicalCountFilterStats();
    getenclosureDetails();
  };

  const Header_Maximum_Height = heightPercentageToDP(42);

  const TAB_HEADER_ITEMS = useMemo(() => {
    const tabs = [
      {
        id: "1",
        title: "Overview",
        screen: "Overview",
      },
      {
        id: "2",
        title: "Occupants",
        screen: "Occupants",
      },
      {
        id: "3",
        title: "Enclosures",
        screen: "SubEnclosures",
      },
      {
        id: "4",
        title: "Notes",
        screen: "observation",
      },
      // {
      //   id: "8",
      //   title: "Medical",
      //   screen: "medicalRecord",
      // },
      {
        id: "5",
        title: "Media",
        screen: "media",
      },
      {
        id: "6",
        title: "Incharges",
        screen: "incharge",
      },
      // {
      //   id: "7",
      //   title: "History",
      //   screen: "History",
      // },
    ];

    if (Number(enclosureDetails?.total_sub_enclosure_count) > 0) {
      return tabs;
    }
    return tabs.filter((i) => i.title !== "Enclosures");
  }, [enclosureDetails]);

  const [header, setHeader] = useState(false);
  const stylesSheet = TabBarStyles.getTabBarStyleSheet(themeColors);
  const ref = React.useRef();
  const minimumHeaderHeight = 70;

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
        if (scrollPos - (headerHeight - (minimumHeaderHeight + 72)) >= 0) {
          setHeader(true);
          setTabBarBorderRadius(true);
        } else {
          setHeader(false);
          setTabBarBorderRadius(false);
        }
      }),
    [headerHeight]
  );

  const changeTab = (data) => {
    setInnerTab(data);
  };
  // const onStateChange = ({ open }) => setState({ open });
  const changeMediaInnerName = (data) => {
    setMediaTabName(data);
  };

  const handleImagePick = async () => {
    const images = await handleFilesPick(errorToast, "image", setIsLoading, selectedItems, true, setDocumentModal);
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
    const documents = await handleFilesPick(errorToast, "doc", setIsLoading, selectedItems, true, setDocumentModal);
    setSelectedItems(documents);
  };

  const handleVideoPick = async () => {
    const videos = await handleFilesPick(errorToast, "video", setIsLoading, selectedItems, true, setDocumentModal);
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
      if (item?.type == "video/mp4") {
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
  const loadmoreImageData = () => {
    if (
      !refreshing &&
      selectedImages.length >= 10 &&
      selectedImages.length < mediaCount.totalImage
    ) {
      setRefreshing(true);
      const nextPage = page + 1;
      setPage(nextPage);
      GetDocsData(nextPage, "images");
    }
  };
  const imageFooterLoader = () => {
    if (
      !refreshing ||
      selectedImages.length < 10 ||
      selectedImages.length == mediaCount.totalImage
    ) {
      return null;
    }

    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };
  const renderDocumentFooter = () => {
    if (
      !refreshing ||
      documents.length < 10 ||
      documents.length == mediaCount.totalDocument
    ) {
      return null;
    }
    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };

  const handleMoreDocument = () => {
    if (
      !refreshing &&
      documents.length >= 10 &&
      documents.length != mediaCount.totalDocument
    ) {
      setRefreshing(true);
      const nextPage = page + 1;
      setPage(nextPage);
      GetDocsData(nextPage, "documents");
    }
  };

  const renderVideoFooter = () => {
    if (
      !refreshing ||
      selectedVideos.length < 10 ||
      selectedVideos.length == mediaCount.totalVideo
    ) {
      return null;
    }

    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };

  const handleMoreVideo = () => {
    if (
      !refreshing &&
      selectedVideos.length >= 10 &&
      selectedVideos.length != mediaCount.totalVideo
    ) {
      setRefreshing(true);
      const nextPage = page + 1;
      setPage(nextPage);
      GetDocsData(nextPage, "videos");
    }
  };

  const GetDocsData = (count, type) => {
    setDocumentModal(false);
    let type_of;
    if (type == "images") {
      type_of = "image";
    } else if (type == "documents") {
      type_of = "document";
    } else if (type == "videos") {
      type_of = "video";
    }
    let id = Number(enclosureDetails?.enclosure_id);
    getDocs("enclosure", id, count, type_of)
      .then((res) => {
        if (res.success) {
          if (type == "images") {
            let dataArrImg = count == 1 ? [] : selectedImages;
            setMediaCount({ totalImage: res?.data?.total_count });
            setMediaLength({
              ...mediaLength,
              imageLength: res?.data?.result?.length,
            });
            setSelectedImages(dataArrImg.concat(res.data?.result));
          } else if (type == "documents") {
            let dataArrDocs = count == 1 ? [] : documents;
            setMediaCount({ totalDocument: res?.data?.total_count });
            setMediaLength({
              ...mediaLength,
              documentLength: res?.data?.result?.length,
            });
            setDocuments(dataArrDocs.concat(res.data?.result));
          } else if (type == "videos") {
            let dataArrVideo = count == 1 ? [] : selectedVideos;
            setMediaCount({ totalVideo: res?.data?.total_count });
            setMediaLength({
              ...mediaLength,
              videoLength: res?.data?.result?.length,
            });
            setSelectedVideos(dataArrVideo.concat(res.data?.result));
          }
        }
      })
      .catch((err) => {
        console.log("error.................................", err);
        setIsLoading(false);
        errorToast("Error", "Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const submitDocument = () => {
    setIsLoading(true);
    setDocumentModal(false);
    let obj = {
      ref_id: enclosureDetails.enclosure_id ?? 0,
      ref_type: "enclosure",
      access_restricted_key: isRestricted ? 1 : 0,
    };
    allAddMedia(obj, selectedItems)
      .then((res) => {
        setIsLoading(false);
        setSelectedItems([]);
        setIsResticted(!isRestricted);
        successToast("Success", res.message);
        if (
          selectedItems[0]?.type == "image/jpeg" ||
          selectedItems[0]?.type == "image/png"
        ) {
          ref.current?.jumpToTab("images");
          setScreenName("Media");
          changeMediaInnerName("images");
          GetDocsData(1, "images");
        } else if (selectedItems[0]?.type == "application/pdf") {
          ref.current?.jumpToTab("documents");
          setScreenName("Media");
          changeMediaInnerName("documents");
          GetDocsData(1, "documents");
        } else if (selectedItems[0]?.type == "video/mp4") {
          ref.current?.jumpToTab("videos");
          setScreenName("Media");
          changeMediaInnerName("videos");
          GetDocsData(1, "videos");
        }
        // setPage(1);
        // GetDocsData(1, mediaTabName);
      })
      .catch((err) => {
        console.log("error", err);
        setIsLoading(false);
        errorToast("Error", "Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteMediaFun = (id) => {
    setIsLoading(true);
    const obj = {
      id: id,
    };
    deleteMedia(obj)
      .then((res) => {
        if (res?.success) {
          successToast("Success", res.message);
          if (mediaTabName == "images") {
            GetDocsData(1, "images");
          } else if (mediaTabName == "documents") {
            GetDocsData(1, "documents");
          } else if (mediaTabName == "videos") {
            GetDocsData(1, "videos");
          }
        } else {
          errorToast("Error", res?.message ?? "Something went wrong!");
        }
      })
      .catch((err) => {
        errorToast("Error", "Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false);
        setDeleteId("");
      });
  };
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;
  const dynamicStyles = pageStyles(themeColors);
  const navigateCom = () => {
    dispatch(removeAnimalMovementData());
    dispatch(setMedicalEnclosure([]));
    dispatch(setMedicalAnimal([]));
    dispatch(setMedicalSection([]));
    dispatch(setMedicalSite([]));
    navigation.navigate("Observation", {
      enclosureData: enclosureDetails,
      // onGoBack: handleBackFromObservationScreen,
      onGoBackData: handleBackFromObservationScreen,
    });
  };
  const handleBackFromObservationScreen = (data) => {
    if (data === "observation") {
      ref.current?.jumpToTab("Notes");
    }
  };
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  const deleteEnclosureMedia = (item) => {
    setBottomTitle("Are you sure you want to delete this Image?");
    setType("deleteSection");
    setDeleteId(item?.id);
    alertModalOpen();
  };
  const documentDelete = (item) => {
    setBottomTitle("Are you sure you want to delete this Document?");
    setType("deleteSection");
    setDeleteId(item?.id);
    alertModalOpen();
  };
  const deleteVideo = (item) => {
    setBottomTitle("Are you sure you want to delete this Video?");
    setType("deleteSection");
    setDeleteId(item?.id);
    alertModalOpen();
  };
  const firstButtonPress = () => {
    if (type == "deleteSection") {
      // mediaDeleteFunc();
      alertModalClose();
      deleteMediaFun(deleteId);
    } else if (type == "navigationBack") {
      navigation.goBack();
      alertModalClose();
    }
  };
  const secondButtonPress = () => {
    alertModalClose();
  };
  return (
    <View
      style={[
        dynamicStyles.container,
        { backgroundColor: themeColors.onPrimary },
      ]}
    >
      <Loader visible={isLoading} />
      <AppBar
        header={header}
        basicInfoData={enclosureDetails}
        enclosureDetailsData={basicInfoData}
        enclosureDetails={enclosureDetails}
        style={[
          header
            ? { backgroundColor: themeColors.onPrimary }
            : { backgroundColor: "transparent" },
          { position: "absolute", top: 0, width: "100%", zIndex: 1 },
        ]}
        incharge={inchargeData}
        onBackPress={onBackPress}
      />

      <Tabs.Container
        ref={ref}
        pagerProps={{ scrollEnabled: false }}
        initialTabName={
          permission["collection_animal_records"] ? "Occupants" : "Overview"
        }
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
        renderHeader={() => {
          return (
            <OverlayContent
              getScrollPositionOfTabs={getScrollPositionOfTabs}
              getHeaderHeight={getHeaderHeight}
              basicInfoData={enclosureDetails}
              enclosureData={enclosureDetails}
              enclosureDetails={enclosureDetails}
              dynamicStyles={dynamicStyles}
              tabBarBorderRadius={tabBarBorderRadius}
              permission={permission}
              selectedSpecies={selectedSpecies}
              isHideStats={isHideStats}
              animalsListModalRef={animalsListModalRef}
              setIsAnimalsListModalVisible={setIsAnimalsListModalVisible}
              onAnimalPress={() => {
                animalsListModalRef?.current?.present();
                setIsAnimalsListModalVisible(true);
                setSelectedSpecies(null);
              }}
              onEnclosuresPress={() => {
                ref.current?.jumpToTab("Enclosures");
              }}
              onSpeciesPress={() => {
                ref.current?.jumpToTab("Occupants");
              }}
            />
          );
        }}
        headerContainerStyle={{
          backgroundColor: "transparent",
          shadowOpacity: 0,
        }}
        minHeaderHeight={minimumHeaderHeight}
        onTabChange={(tab) => {
          setScreenName(tab.tabName);
          // TAB_HEADER_ITEMS.forEach((e, i) => {
          //   if (e.title == tab.tabName) {
          //   }
          // });
        }}
      >
        {TAB_HEADER_ITEMS.map((item) => {
          if (
            !permission["collection_animal_records"] &&
            item.screen == "Occupants"
          ) {
            return null;
          } else {
            return (
              <Tabs.Tab name={item.title} label={item.title} key={item.id}>
                <View
                  style={{
                    paddingTop: Spacing.small,
                    flex: 1,
                    backgroundColor: reduxColors.surfaceVariant,
                  }}
                >
                  {item.screen === "SubEnclosures" ? (
                    <EnclosuresList
                      type={"enclosure"}
                      resetData={true}
                      sectionId={route?.params?.section_id ?? ""}
                      enclosureId={currentEnclosure}
                      permission={permission}
                      isFocused={isFocused && screenName === "Enclosures"}
                      showSubenclosuresValue={
                        Number(enclosureDetails?.total_sub_enclosure_count) > 0
                          ? true
                          : false
                      }
                      onEnclosurePress={(data) => {
                        if (openEnclosuresList?.length === 0) {
                          setOpenEnclosuresList([currentEnclosure]);
                        } else {
                          setOpenEnclosuresList((prev) => [
                            ...prev,
                            currentEnclosure,
                          ]);
                        }
                        setScreenName("Occupants");
                        ref.current?.jumpToTab("Occupants");
                        setCurrentEnclosure(data?.enclosure_id);
                      }}
                      onRefreshValue={true}
                      pullToRefresh={getenclosureDetails}
                    />
                  ) : item.screen === "Occupants" ? (
                    <OccupantsAnimal
                      isLoading={isLoading}
                      animalData={animalListBySpecies}
                      animalStats={animalListStats}
                      navigation={navigation}
                      OccupantsRenderFooter={OccupantsRenderFooter}
                      OccupantsHandleLoadMore={OccupantsHandleLoadMore}
                      showIncludeSubEnclosureSwitch={
                        Number(enclosureDetails?.total_sub_enclosure_count) > 0
                          ? true
                          : false
                      }
                      permission={permission}
                      isHideStats={isHideStats}
                      themeColors={themeColors}
                      includeSubenclosures={includeSubenclosures}
                      animalsListModalRef={animalsListModalRef}
                      setIsAnimalsListModalVisible={
                        setIsAnimalsListModalVisible
                      }
                      setSelectedSpecies={setSelectedSpecies}
                      onIncludeSubenclosuresPress={(value) => {
                        setIncludeSubenclosures(value);
                        setAnimalListPage(1);
                        setStopCallAnimalList(false);
                        setStopAnimalListCount(0);
                        getAnimalListBySpecies(1, value);
                      }}
                      onRefreshOccupant={onRefreshOccupant}
                      refreshingOccupant={refreshing}
                      loading={isLoading}
                    />
                  ) : // item.screen === "species" ? (
                  //   <Species
                  //     speciesListData={speciesListData}
                  //     navigation={navigation}
                  //     enclosure_id={route.params.enclosure_id}
                  //     SpeciesrenderFooter={SpeciesrenderFooter}
                  //     SpecieshandleLoadMore={SpecieshandleLoadMore}
                  //     permission={permission}
                  //     themeColors={themeColors}
                  //   />
                  // )
                  item.screen === "Overview" ? (
                    <Overview
                      basicInfoData={basicInfoData}
                      dynamicStyles={dynamicStyles}
                      onRefreshOverview={onRefreshOverview}
                      refreshingOverview={refreshing}
                      loading={isLoading}
                    />
                  ) : item.screen === "incharge" ? (
                    <Incharge
                      navigation={navigation}
                      headerHide={(e) => headerHide(e)}
                      inchargeData={enclosureInchargeList}
                      sectionSelectedInchargeId={sectionSelectedInchargeId}
                      dynamicStyles={dynamicStyles}
                      onRefreshIncharge={onRefreshIncharge}
                      refreshingIncharge={refreshing}
                      setIsAddEnclosureInCharge={setIsAddEnclosureInCharge}
                      permission={permission}
                      searchText={searchText}
                      handleSearch={handleSearch}
                      SearchRemove={SearchRemove}
                      searchLoading={searchLoading}
                      loading={isLoading}
                    />
                  ) : item.screen === "History" ? (
                    <History
                      historyData={historyData}
                      navigation={navigation}
                      renderFooter={historyRenderFooter}
                      handleLoadMore={historyHandleLoadMore}
                      onRefreshHistory={onRefreshHistory}
                      refreshingHistory={refreshing}
                      loading={isLoading}
                    />
                  ) : item.screen === "observation" ? (
                    <NotesList
                      navigation={navigation}
                      basicInfoData={basicInfoData}
                      observationdata={observationdata}
                      observhandleLoadMore={observhandleLoadMore}
                      observrenderFooter={observrenderFooter}
                      themeColors={themeColors}
                      enclosureDetails={enclosureDetails}
                      onRefreshNotes={onRefreshNotes}
                      refreshingNotes={refreshing}
                      loading={isLoading}
                      Items={Items}
                      fetchData={fetchData}
                      getSelectedData={getSelectedData}
                      selectedData={selectedData}
                      dispatch={dispatch}
                    />
                  ) : item.screen === "medicalRecord" ? (
                    <MedicalScreen
                      themeColors={themeColors}
                      medicalStatsCount={medicalStatsCount}
                      setDates={setDates}
                      selectDropID={selectDropID}
                      selectDropValue={selectDropValue}
                      enclosureId={currentEnclosure}
                      startDate={startDate}
                      endDate={endDate}
                      refreshing={refreshing}
                      onRefreshMedical={onRefreshMedical}
                    />
                  ) : item.screen == "media" ? (
                    <Media
                      setMediaTabName={setMediaTabName}
                      setIsLoading={setIsLoading}
                      setPage={setPage}
                      GetDocsData={GetDocsData}
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
                      animalDetails={{}}
                      isLoading={isLoading}
                      deleteEnclosureMedia={deleteEnclosureMedia}
                      alertModalClose={alertModalClose}
                      bottomTitle={bottomTitle}
                      isModalVisible={isModalVisible}
                      firstButtonPress={firstButtonPress}
                      secondButtonPress={secondButtonPress}
                      inchargeList={enclosureInchargeList?.incharges ?? []}
                      onRefreshDocuments={onRefreshDocuments}
                      refreshingDocuments={refreshing}
                      onRefreshVideos={onRefreshVideos}
                      refreshingVideos={refreshing}
                      onRefreshImage={onRefreshImage}
                      refreshingImage={refreshing}
                      documentDelete={documentDelete}
                      deleteVideo={deleteVideo}
                    />
                  ) : null}
                </View>
              </Tabs.Tab>
            );
          }
        })}
      </Tabs.Container>

      <FAB.Group
        open={open}
        visible
        fabStyle={dynamicStyles.fabStyle}
        icon={open ? "close-circle-outline" : "plus-circle-outline"}
        actions={[
          {
            icon: () => (
              <MaterialCommunityIcons
                name="note-plus-outline"
                size={24}
                color={themeColors.onSecondaryContainer}
              />
            ),
            label: "Add Note",
            onPress: () => navigateCom(),
          },
          {
            icon: "plus",
            label: "Add Sub Enclosure ",
            onPress: () =>
              checkPermissionAndNavigate(
                permission,
                "housing_add_enclosure",
                navigation,
                "CreateEnclosure",
                {
                  item: enclosureDetails,
                  section_id: props.route.params?.section_id,
                  section_name: props.route.params?.section_name,
                }
              ),
          },
          {
            icon: "plus",
            label: "Add Animal",
            onPress: () => setShowAccessionModal(true),
          },

          {
            icon: "home",
            label: "Home",
            onPress: () => navigation.navigate("Home"),
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
          }
        }}
      />

      <BottomSheetModalComponent
        ref={animalsListModalRef}
        onDismiss={() => {
          setSelectedSpecies(null);
          setIsAnimalsListModalVisible(false);
        }}
      >
        <AnimalsList
          type={"enclosure"}
          enclosureId={currentEnclosure}
          permission={permission}
          speciesData={selectedSpecies}
          subEnclosure={includeSubenclosures}
          onItemPress={(data) => {
            animalsListModalRef?.current?.close();
            setSelectedSpecies(null);
            setIsAnimalsListModalVisible(false);
            checkPermissionAndNavigateWithAccess(
              permission,
              "collection_animal_record_access",
              navigation,
              "AnimalsDetails",
              { animal_id: data.animal_id },
              "VIEW"
            );
          }}
        />
      </BottomSheetModalComponent>

      {showAccessionModal ? (
        <Modal
          avoidKeyboard
          animationType="fade"
          visible={true}
          onDismiss={closeAccessionModal}
          onBackdropPress={closeAccessionModal}
          // onRequestClose={{}}
          style={[{ backgroundColor: "transparent", flex: 1, margin: 0 }]}
        >
          <TouchableWithoutFeedback onPress={closeAccessionModal}>
            <View style={[reduxColors.modalOverlay]}>
              <View
                style={[
                  reduxColors.modalContainer,
                  {
                    //
                  },
                ]}
              >
                <View style={reduxColors.modalHeader}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={reduxColors.accession}>Add Animals</Text>
                  </View>
                </View>

                <View
                  style={{ width: "95%", maxHeight: heightPercentageToDP(60) }}
                >
                  <Divider style={{ marginHorizontal: Spacing.small }} />
                  <FlatList
                    data={AddAnimalTypeData}
                    renderItem={({ item }) => (
                      <>
                        <TouchableOpacity
                          style={{
                            backgroundColor: themeColors.onPrimary,
                            padding: Spacing.major,
                            flexDirection: "row",
                          }}
                          // onPress={() =>props.itemNeed?closeModal(item??""): closeModal(item.screen ? item.screen : item.type)}
                          onPress={() => {
                            closeAccessionModal();
                            checkPermissionAndNavigateWithAccess(
                              permission,
                              "collection_animal_record_access",
                              navigation,
                              item?.screen,
                              {
                                item:
                                  enclosureDetails ?? props.route?.params?.item,
                              },
                              "ADD"
                            );
                          }}
                        >
                          <View>
                            <AntDesign
                              name="plus"
                              size={20}
                              color={themeColors.primary}
                            />
                          </View>
                          <Text
                            style={[
                              reduxColors.itemTitle,
                              {
                                paddingHorizontal: Spacing.minor,
                              },
                            ]}
                          >
                            {item.title}
                          </Text>
                        </TouchableOpacity>
                        <Divider style={{ marginHorizontal: Spacing.small }} />
                      </>
                    )}
                    onEndReachedThreshold={0.4}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      ) : null}
    </View>
  );
};

export const AppBar = ({
  basicInfoData,
  style,
  header,
  enclosureDetails,
  incharge,
  enclosureDetailsData,
  onBackPress,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const permission = useSelector((state) => state.UserAuth.permission);
  const [IncrgDetails, setIncrgDetails] = useState();
  const moreOptionData = [
    { id: 1, option: "Edit Enclosure", screen: "EnclosureEdit" },
    // { id: 2, option: "QR Code", screen: "ProfileQr" },
  ];

  useEffect(() => {
    setIncrgDetails(incharge?.map((i) => i.user_id).join(","));
  }, [incharge]);
  const chooseOption = (item) => {
    if (item?.screen == "ProfileQr") {
      navigation.navigate(item.screen, {
        enclosure_id: enclosureDetails.enclosure_id,
        enclosure: basicInfoData,
      });
    } else {
      if (enclosureDetails?.is_system_generated == "1") {
        warningToast(
          "Restricted",
          "This enclosure is system generated. It will be not editable or deleted!!"
        );
      } else {
        if (enclosureDetails) {
          dispatch(removeAnimalMovementData());
          checkPermissionAndNavigate(
            permission,
            "housing_add_enclosure",
            navigation,
            item.screen,
            {
              enclosure_id: enclosureDetails.enclosure_id,
              enclosure: basicInfoData,
            }
          );
        }
      }
    }
  };

  return (
    <AnimatedHeader
      optionData={moreOptionData}
      optionPress={chooseOption}
      title={basicInfoData?.user_enclosure_name ?? "NA"}
      style={style}
      header={header}
      qrCard={true}
      onBackPress={onBackPress}
    />
  );
};

const OverlayContent = ({
  basicInfoData,
  enclosureData,
  getScrollPositionOfTabs,
  getHeaderHeight,
  dynamicStyles,
  tabBarBorderRadius,
  permission,
  isHideStats,
  onAnimalPress,
  onEnclosuresPress,
  onSpeciesPress,
  animalsListModalRef,
  setIsAnimalsListModalVisible,
}) => {
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const customStyles = pageStyles(themeColors);
  const { top, height } = useHeaderMeasurements();
  getHeaderHeight(height.value);
  const navigation = useNavigation();
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
    if (enclosureData?.images) {
      const imageArray = enclosureData?.images?.filter(
        (item) =>
          // item?.display_type == "gallery"
          item?.display_type == "banner" // change gallery to banner image instructed by nidhin
      );

      const imageObjectsArray = imageArray.map((item) => ({ img: item.file }));

      setSliderImages(imageObjectsArray);
    }
  }, [enclosureData?.images]);

  const backgroundImage = undefined;
  // const backgroundImage = enclosureData?.images
  //   ? enclosureData?.images?.filter(
  //     (item) => item?.display_type == "gallery"
  //   )[0]?.file
  //   : "../../assets/parrot.jpeg";

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

  const overlayContent = (
    <View
      style={{
        justifyContent: "space-between",
      }}
    >
      <View>
        <Text style={customStyles.enclosureTitleText}>{"ENCLOSURE"}</Text>
        <Text
          style={[
            {
              color: themeColors.onPrimary,
            },
            FontSize.Antz_Major_Title,
          ]}
        >
          {LengthDecrease(42, basicInfoData?.user_enclosure_name ?? "NA")}
        </Text>
      </View>

      <View style={[dynamicStyles.inChargeBox]}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={dynamicStyles.firstTextStyle}>In Charge</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            height: heightPercentageToDP(4),
            alignItems: "center",
            borderRadius: 5,
            borderWidth: 1,
            borderColor: themeColors?.outline,
            marginLeft: widthPercentageToDP(2),
            paddingHorizontal: widthPercentageToDP(2),
            backgroundColor: opacityColor(themeColors.neutralPrimary, 40),
          }}
        >
          <Image source={require("../../assets/person.png")} />
          <Text
            style={[
              FontSize.Antz_Minor_Regular,
              {
                color: themeColors.onPrimary,
                paddingLeft: widthPercentageToDP(2),
              },
            ]}
          >
            {/* {ifEmptyValue(basicInfoData?.incharge_name)} */}
            {LengthDecrease(16, basicInfoData?.incharge_name ?? "NA")}
          </Text>
        </View>
        {ifEmptyValue(basicInfoData?.incharge_name) != "NA" ? (
          <>
            <TouchableOpacity
              style={{
                height: heightPercentageToDP(4),
                width: widthPercentageToDP(8),
                marginLeft: widthPercentageToDP(1),
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
                borderWidth: 1,
                borderColor: themeColors?.outline,
                backgroundColor: themeColors?.blackWithPointFour,
              }}
              onPress={() => handleCall(basicInfoData?.incharge_phone_no)}
            >
              <Image source={require("../../assets/call.png")} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: heightPercentageToDP(4),
                width: widthPercentageToDP(8),
                marginLeft: widthPercentageToDP(1),
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
                borderWidth: 1,
                borderColor: themeColors?.outline,
                backgroundColor: themeColors?.blackWithPointFour,
              }}
              onPress={() => handleMessage(basicInfoData?.incharge_phone_no)}
            >
              <Image source={require("../../assets/chat.png")} />
            </TouchableOpacity>
          </>
        ) : null}
      </View>
      <View style={[dynamicStyles.secondItemBox, { width: "90%" }]}>
        <Text style={dynamicStyles.firstTextStyle}>Section - </Text>
        <Text style={dynamicStyles.firstTextStyle}>
          {LengthDecrease(40, basicInfoData?.section_name ?? "NA")}
        </Text>
      </View>

      {!isHideStats && permission?.["housing_view_insights"] && (
        <EnclosureInsightCard
          enclosuresCount={shortenNumber(
            enclosureData?.total_sub_enclosure_count ?? 0
          )}
          animalsCount={shortenNumber(enclosureData?.total_occupants ?? 0)}
          speciesCount={shortenNumber(enclosureData?.total_species ?? 0)}
          onEnclosuresPress={onEnclosuresPress}
          onAnimalsPress={onAnimalPress}
          onSpeciesPress={onSpeciesPress}
        />
      )}

      {/* <View style={[dynamicStyles.chipWrap, {}]}>
{permission["housing_view_insights"] && (
  <View
    style={{
      display: "flex",
      flexDirection: "row",
    }}
  >
    <Chip
      style={{
        backgroundColor: themeColors.background,
        borderRadius: 5,
        marginRight: widthPercentageToDP(1),
      }}
    >
      <Text
        style={[
          FontSize.Antz_Body_Title,
          {
            color: themeColors.onPrimaryContainer,
          },
        ]}
      >
        {`Occupants ${shortenNumber(
          enclosureData?.total_occupants ?? 0
        )}`}
      </Text>
    </Chip>
    <Chip
      style={{
        backgroundColor: themeColors.background,
        borderRadius: 5,
        marginRight: widthPercentageToDP(1),
      }}
    >
      <Text
        style={[
          FontSize.Antz_Body_Title,
          {
            color: themeColors.onPrimaryContainer,
          },
        ]}
      >
        {`Species ${shortenNumber(
          enclosureData?.total_species ?? 0
        )}`}
      </Text>
    </Chip>
  </View>
)}
<View
  style={{
    display: "none",
    flexDirection: "row",
    margin: widthPercentageToDP(2),
  }}
>
  <Chip
    style={{
      backgroundColor: themeColors?.errorContainer,
      borderRadius: 5,
      marginRight: widthPercentageToDP(2),
    }}
  >
    <Text
      style={[
        FontSize.Antz_Body_Title,
        {
          color: themeColors.error,
        },
      ]}
    >
      3 open task
    </Text>
  </Chip>
  <Chip
    style={{
      backgroundColor: themeColors?.secondary,
      borderRadius: 5,
      marginRight: widthPercentageToDP(2),
    }}
  >
    <Text
      style={[
        FontSize.Antz_Body_Title,
        {
          color: themeColors?.onSecondaryContainer,
        },
      ]}
    >
      Sunroof
    </Text>
  </Chip>
  <Chip
    style={{
      backgroundColor: themeColors?.secondary,
      borderRadius: 5,
      marginRight: widthPercentageToDP(2),
    }}
  >
    <Text
      style={[
        FontSize.Antz_Body_Title,
        {
          color: themeColors?.onSecondaryContainer,
        },
      ]}
    >
      Cam
    </Text>
  </Chip>
</View>
</View> */}
    </View>
  );
  return (
    <>
      <View style={dynamicStyles.headerContainer}>
        <LinearGradient
          colors={[
            themeColors.onSecondaryContainer,
            // themeColors.borderBottomColor,
            themeColors.onPrimaryContainer,
          ]}
          style={dynamicStyles.linearGradient}
        >
          <Animated.View
            style={[
              animatedStyle,
              {
                zIndex: 1,
                paddingTop: sliderImages.length == 0 ? 70 : 0,
                paddingBottom: sliderImages.length == 0 ? Spacing.major : 0,
                backgroundColor: backgroundImage
                  ? opacityColor(themeColors?.neutralPrimary, 30)
                  : themeColors?.onPrimaryContainer,
              },
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
                {sliderImages.length != 0 ? (
                  <View style={{ width: "100%" }}>
                    <SliderComponent
                      screen={"enclosureDetails"}
                      child={overlayContent}
                      permission={permission}
                      noNavigation={true}
                      autoPlay={true}
                      imageData={sliderImages}
                      navigation={navigation}
                    />
                  </View>
                ) : (
                  overlayContent
                )}
              </Animated.View>
            </View>
          </Animated.View>
          <Animated.View
            style={{
              height: 20,
              backgroundColor: themeColors.onPrimary,
              borderTopLeftRadius: tabBarBorderRadius ? 0 : 40,
              borderTopRightRadius: tabBarBorderRadius ? 0 : 40,
              borderBottomColor: "transparent",
              borderBottomWidth: 6,
              zIndex: 1,
            }}
          ></Animated.View>
        </LinearGradient>
      </View>
    </>
  );
};

const History = ({
  historyData,
  navigation,
  renderFooter,
  handleLoadMore,
  refreshingHistory,
  onRefreshHistory,
  loading,
}) => {
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const permission = useSelector((state) => state.UserAuth.permission);
  return (
    <>
      <Tabs.FlatList
        showsVerticalScrollIndicator={false}
        data={historyData}
        style={{
          paddingLeft: Spacing.minor,
          paddingRight: Spacing.minor,
          backgroundColor: themeColors.surfaceVariant,
          paddingTop: Spacing.small,
        }}
        renderItem={({ item }) => (
          <AnimalCustomCard
            item={item}
            show_housing_details={true}
            show_specie_details={true}
            icon={item.default_icon}
            animalIdentifier={
              !item?.local_identifier_value
                ? item?.animal_id
                : item?.local_identifier_name ?? null
            }
            localID={item?.local_identifier_value ?? null}
            chips={item.sex}
            enclosureName={item.user_enclosure_name}
            sectionName={item.section_name}
            animalName={
              item.common_name ? item.common_name : item.scientific_name
            }
            onPress={() =>
              checkPermissionAndNavigateWithAccess(
                permission,
                "collection_animal_record_access",
                navigation,
                "AnimalsDetails",
                { animal_id: item.animal_id },
                "VIEW"
              )
            }
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshingHistory}
            onRefresh={onRefreshHistory}
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

const Overview = ({
  basicInfoData,
  dynamicStyles,
  refreshingOverview,
  onRefreshOverview,
  loading,
}) => {
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  return (
    <Tabs.ScrollView
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
      style={{
        backgroundColor: themeColors.surfaceVariant,
        paddingTop: Spacing.small,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshingOverview}
          onRefresh={onRefreshOverview}
          style={{
            color: themeColors.blueBg,
            marginTop:
              Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
          }}
          enabled={true}
        />
      }
    >
      {basicInfoData.length !== 0 ? (
        <>
          <Card style={dynamicStyles.card} elevation={0}>
            <Card.Content>
              <View style={dynamicStyles.cardContentRow}>
                <View style={dynamicStyles.cardContentItem}>
                  <Text style={dynamicStyles.cardContentTitle}>
                    Enclosure Name
                  </Text>
                  <Text style={dynamicStyles.cardContentData}>
                    {ifEmptyValue(basicInfoData?.user_enclosure_name ?? "NA")}
                  </Text>
                </View>
                <View style={dynamicStyles.cardContentItem}>
                  <Text style={dynamicStyles.cardContentTitle}>
                    Parent Enclosure
                  </Text>
                  <Text style={dynamicStyles.cardContentData}>
                    {ifEmptyValue(basicInfoData?.parent_enclosure_name ?? "NA")}
                  </Text>
                </View>
              </View>
              <View style={dynamicStyles.cardContentRow}>
                <View style={dynamicStyles.cardContentItem}>
                  <Text style={dynamicStyles.cardContentTitle}>Section</Text>
                  <Text style={dynamicStyles.cardContentData}>
                    {ifEmptyValue(basicInfoData?.section_name ?? "NA")}
                  </Text>
                </View>
                <View style={dynamicStyles.cardContentItem}>
                  <Text style={dynamicStyles.cardContentTitle}>Site</Text>
                  <Text style={dynamicStyles.cardContentData}>
                    {ifEmptyValue(basicInfoData?.site_name ?? "NA")}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
          <Card style={dynamicStyles.card} elevation={0}>
            <Card.Content>
              <View style={dynamicStyles.cardContentRow}>
                <View style={dynamicStyles.cardContentItem}>
                  <Text style={dynamicStyles.cardContentTitle}>
                    Enclosure Type
                  </Text>
                  <Text style={dynamicStyles.cardContentData}>
                    {ifEmptyValue(basicInfoData?.enclosure_type ?? "NA")}
                  </Text>
                </View>
                <View style={dynamicStyles.cardContentItem}>
                  <Text style={dynamicStyles.cardContentTitle}>Sunlight</Text>
                  <Text style={dynamicStyles.cardContentData}>
                    {basicInfoData?.enclosure_sunlight
                      ? capitalize(basicInfoData?.enclosure_sunlight)
                      : "NA"}
                  </Text>
                </View>
              </View>
              <View style={dynamicStyles.cardContentRow}>
                <View style={dynamicStyles.cardContentItem}>
                  <Text style={dynamicStyles.cardContentTitle}>
                    Environment Type
                  </Text>
                  <Text style={dynamicStyles.cardContentData}>
                    {capitalize(basicInfoData?.enclosure_environment ?? "NA")}
                  </Text>
                </View>
                <View style={dynamicStyles.cardContentItem}>
                  <Text style={dynamicStyles.cardContentTitle}>Movable</Text>
                  <Text style={dynamicStyles.cardContentData}>
                    {basicInfoData?.enclosure_is_movable == "0" ? (
                      <Text>No</Text>
                    ) : (
                      <Text>Yes</Text>
                    )}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
          <Card style={dynamicStyles.card} elevation={0}>
            <Card.Content>
              <View style={dynamicStyles.cardContentRow}>
                <View style={dynamicStyles.cardContentItem}>
                  <Text style={dynamicStyles.cardContentTitle}>
                    Surveillance
                  </Text>
                  <Text style={dynamicStyles.cardContentData}>Cam - 00123</Text>
                </View>
                <View style={dynamicStyles.cardContentItem}>
                  <Text style={dynamicStyles.cardContentTitle}>Status</Text>

                  <View style={dynamicStyles.chip}>
                    <Text
                      style={{
                        fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                        color: themeColors?.onPrimaryContainer,
                        textAlign: "center",
                      }}
                    >
                      {capitalize(
                        basicInfoData?.enclosure_status
                          ? removeUnderScore(basicInfoData?.enclosure_status)
                          : "Active"
                      )}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={dynamicStyles.cardContentRow}></View>
            </Card.Content>
          </Card>
          {/* <Card style={dynamicStyles.qrCard}>
            <Card.Content>
              <View style={dynamicStyles.qrCardContentRow}>
                <Image
                  source={{ uri: basicInfoData?.enclosure_qr_image }}
                  style={{ height: 250, width: 250 }}
                />
                <DownloadFile url={basicInfoData?.enclosure_qr_image} />
              </View>
            </Card.Content>
          </Card> */}
        </>
      ) : (
        <ListEmpty height={"50%"} visible={loading} />
      )}
    </Tabs.ScrollView>
  );
};

const OccupantsAnimal = ({
  isLoading,
  animalData,
  animalStats,
  navigation,
  setSelectedSpecies,
  OccupantsRenderFooter,
  animalsListModalRef,
  setIsAnimalsListModalVisible,
  OccupantsHandleLoadMore,
  showIncludeSubEnclosureSwitch,
  permission,
  isHideStats,
  themeColors,
  includeSubenclosures,
  onIncludeSubenclosuresPress,
  refreshingOccupant,
  onRefreshOccupant,
  loading,
}) => {
  const customStyles = pageStyles(themeColors);
  const includeSubEnclosureSwitch = showIncludeSubEnclosureSwitch ? (
    <View style={customStyles.includeSubenclosuresContainer}>
      <Text style={customStyles.includeSubenclosuresText}>
        {"Include subenclosures"}
      </Text>
      <Switch
        active={includeSubenclosures}
        handleToggle={onIncludeSubenclosuresPress}
      />
    </View>
  ) : null;

  const onItemPress = (item) => {
    setSelectedSpecies(item);
    animalsListModalRef?.current?.present();
    setIsAnimalsListModalVisible(true);
  };
  return (
    <>
      <Loader visible={isLoading} />
      <Tabs.FlatList
        showsVerticalScrollIndicator={false}
        data={animalData}
        style={customStyles.occupantsListContainer}
        ListHeaderComponent={
          Number(animalStats?.total_animal_count ?? 0) !== 0 &&
          (showIncludeSubEnclosureSwitch ||
            (!isHideStats && permission?.["housing_view_insights"])) ? (
            <View style={customStyles.headerMainContainer}>
              {includeSubEnclosureSwitch}
              {!isHideStats && permission?.["housing_view_insights"] && (
                <>
                  <View
                    style={[
                      customStyles.headerCountContainer,
                      { marginVertical: Spacing.small },
                    ]}
                  >
                    <Text style={customStyles.headerCountTitleText}>
                      {"Species"}
                    </Text>
                    <Text style={customStyles.headerCountValueText}>
                      {animalStats?.total_species_count ?? "0"}
                    </Text>
                  </View>
                  <View style={customStyles.headerCountContainer}>
                    <Text style={customStyles.headerCountTitleText}>
                      {"Animals"}
                    </Text>
                    <Text style={customStyles.headerCountValueText}>
                      {animalStats?.total_animal_count ?? "0"}
                    </Text>
                  </View>
                </>
              )}
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <SpeciesCustomCard
            icon={item?.default_icon ?? ""}
            complete_name={
              item?.common_name ? item?.common_name : item?.tsn_id ?? "NA"
            }
            animalName={item?.complete_name ? item?.complete_name : "NA"}
            tags={
              !isHideStats && permission?.["housing_view_insights"]
                ? item?.sex_data
                : null
            }
            count={
              !isHideStats && permission?.["housing_view_insights"]
                ? item?.animal_count
                : null
            }
            style={customStyles.listItem}
            onPress={() => onItemPress(item)}
          />
          // <Text style={{backgroundColor:"red"}}>{item?.common_name??"================="}</Text>
        )}
        ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
        onEndReachedThreshold={0.1}
        onEndReached={OccupantsHandleLoadMore}
        ListFooterComponent={OccupantsRenderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshingOccupant}
            onRefresh={onRefreshOccupant}
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

// const Species = ({
//   speciesListData,
//   navigation,
//   enclosure_id,
//   SpeciesrenderFooter,
//   SpecieshandleLoadMore,
//   navigateToComponent,
//   permission,
// }) => {
//   const themeColors = useSelector((state) => state.darkMode.theme.colors);

//   return (
//     <Tabs.FlatList
//       data={speciesListData}
//       showsVerticalScrollIndicator={false}
//       showsHorizontalScrollIndicator={false}
//       scrollEnabled={true}
//       style={{
//         paddingLeft: Spacing.minor,
//         paddingRight: Spacing.minor,
//         backgroundColor: themeColors?.surfaceVariant,
//         paddingBottom: Spacing.small,
//       }}
//       contentContainerStyle={{
//         display: "flex",
//         backgroundColor: themeColors.surfaceVariant,
//       }}
//       scrollToOverflowEnabled={true}
//       renderItem={({ item }) => (
//         <SpeciesCustomCard
//           icon={item.default_icon}
//           complete_name={item?.common_name ? item?.common_name : "NA"}
//           animalName={item.species_name ? item?.species_name : "NA"}
//           tags={permission["housing_view_insights"] ? item.sex_data : null}
//           count={permission["housing_view_insights"] ? item.animal_count : null}
//           onPress={() => {
//             navigation.navigate("SpeciesDetails", {
//               title: item?.common_name,
//               subtitle: item.complete_name,
//               tags: item.sex_data,
//               tsn_id: item.taxonomy_id,
//               icon: item.default_icon,
//               enclosure_id: enclosure_id,
//             });
//           }}
//         />
//       )}
//       ListEmptyComponent={<ListEmpty height={"50%"} />}
//       onEndReached={SpecieshandleLoadMore}
//       onEndReachedThreshold={0.4}
//       ListFooterComponent={SpeciesrenderFooter}
//     />
//   );
// };

const Incharge = ({
  inchargeData,
  refreshingIncharge,
  onRefreshIncharge,
  permission,
  setIsAddEnclosureInCharge,
  searchText,
  handleSearch,
  SearchRemove,
  searchLoading,
  sectionSelectedInchargeId,
  loading,
}) => {
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const navigation = useNavigation();

  return (
    <>
      <Tabs.FlatList
        data={inchargeData?.incharges}
        showsVerticalScrollIndicator={false}
        style={{
          paddingLeft: Spacing.minor,
          paddingRight: Spacing.minor,
          backgroundColor: themeColors.surfaceVariant,
          paddingTop: Spacing.small,
        }}
        ListHeaderComponent={
          <>
            {permission["add_sites"] && (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  height: heightPercentageToDP(6),
                  borderRadius: 8,
                  marginBottom: Spacing.mini,
                  backgroundColor: themeColors.secondary,
                }}
                onPress={() => {
                  setIsAddEnclosureInCharge(true);
                  navigation.navigate("InchargeAndApproverSelect", {
                    selectedInchargeIds:
                      sectionSelectedInchargeId?.incharges?.map(
                        (item) => item?.user_id
                      ),
                    inchargeDetailsData: sectionSelectedInchargeId?.incharges,
                    allowMultipleIncharge: String(
                      inchargeData?.allow_multiple_incharges
                    ),
                    maxAllowedInCharges: inchargeData?.max_allowed_incharges, // TODO: Change this from api key max_allowed_incharges
                  });
                }}
              >
                <MaterialIcons
                  name="person-add-alt-1"
                  size={24}
                  color={themeColors.neutralPrimary}
                  style={{ fontWeight: "bold" }}
                />
                <Text
                  style={{
                    marginLeft: widthPercentageToDP(2),
                    // color: themeColors.onSecondaryContainer,
                    color: themeColors.neutralPrimary,
                    fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                    fontSize: FontSize.Antz_Minor_Medium.fontSize,
                  }}
                >
                  Choose Enclosure Incharge
                </Text>
              </TouchableOpacity>
            )}
            <HousingSearchBox
              value={searchText}
              onChangeText={(e) => handleSearch(e)}
              onClearPress={() => SearchRemove()}
              loading={searchLoading}
            />
          </>
        }
        renderItem={({ item }) => {
          if(!item?.user_id){
            return null
          }
          return (
          <CustomCard
            title={
              capitalize(item?.user_first_name) +
              " " +
              capitalize(item?.user_last_name)
            }
            userIcon={item.user_profile_pic}
            fname={
              capitalize(item?.user_first_name?.charAt(0)) +
              " " +
              capitalize(item?.user_last_name?.charAt(0))
            }
            PhoneCall={item.user_mobile_number}
            SendMsz={item.user_mobile_number}
            icon={null}
          />
        )}}
        ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshingIncharge}
            onRefresh={onRefreshIncharge}
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

const NotesList = ({
  observationdata,
  observhandleLoadMore,
  observrenderFooter,
  navigation,
  enclosureDetails,
  onRefreshNotes,
  refreshingNotes,
  loading,
  Items,
  fetchData,
  getSelectedData,
  selectedData,
  dispatch,
}) => {
  const themeColors = useSelector((state) => state.darkMode.theme.colors);

  const navigateCom = () => {
    dispatch(removeAnimalMovementData());
    dispatch(setMedicalEnclosure([]));
    dispatch(setMedicalAnimal([]));
    dispatch(setMedicalSection([]));
    dispatch(setMedicalSite([]));
    navigation.navigate("Observation", {
      enclosureData: enclosureDetails,
    });
  };
  return (
    <>
      <Tabs.FlatList
        data={observationdata}
        showsVerticalScrollIndicator={false}
        style={{
          paddingLeft: Spacing.minor,
          paddingRight: Spacing.minor,
          marginBottom: Spacing.small,
          backgroundColor: themeColors.background,
          paddingHorizontal: 10,
          flexGrow: 1,
        }}
        ListHeaderComponent={
          <>
            <View
              style={{ alignItems: "flex-end", paddingVertical: Spacing.mini }}
            >
              <FilterComponent
                items={Items}
                fetchData={fetchData}
                dataSendBack={getSelectedData}
                selectedData={selectedData}
              />
            </View>
            {observationdata.length == 0 && (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: heightPercentageToDP(2),
                  height: heightPercentageToDP(6),
                  borderRadius: 8,
                  backgroundColor: themeColors.secondary,
                }}
                onPress={() => {
                  navigateCom();
                }}
              >
                <AntDesign
                  name="plus"
                  size={24}
                  onPrimary
                  style={{ fontWeight: "bold" }}
                />
                <Text
                  style={{
                    marginLeft: widthPercentageToDP(2),
                    color: themeColors.onPrimary,
                    fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                    fontSize: FontSize.Antz_Minor_Medium.fontSize,
                  }}
                >
                  Add Notes
                </Text>
              </TouchableOpacity>
            )}
          </>
        }
        renderItem={({ item, index }) => {
          return (
            <ObservationCard
              key={index}
              item={item}
              priroty={item.priority}
              assign_to={item.assign_to}
              onPress={() => {
                navigation.navigate("ObservationSummary", {
                  item: item,
                });
              }}
              onPressComment={() => {
                navigation.navigate("ObservationSummary", {
                  item: item,
                  boolen: true,
                });
              }}
            />
          );
        }}
        onEndReachedThreshold={0.1}
        onEndReached={observhandleLoadMore}
        ListFooterComponent={observrenderFooter}
        ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshingNotes}
            onRefresh={onRefreshNotes}
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

const MedicalScreen = ({
  themeColors,
  medicalStatsCount,
  setDates,
  selectDropID,
  selectDropValue,
  enclosureId,
  startDate,
  endDate,
  refreshing,
  onRefreshMedical,
}) => {
  return (
    <>
      <Tabs.ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: themeColors.surfaceVariant,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshMedical}
          />
        }
      >
        <View
          style={{
            backgroundColor: themeColors.surfaceVariant,
            paddingHorizontal: Spacing.body,
          }}
        >
          <MedicalRecordCardComponent
            isMedicalTopStats={false}
            medicalStatsCount={medicalStatsCount}
            setDates={setDates}
            selectedFilterValue={selectDropValue}
            selectDropID={selectDropID}
            enclosureId={enclosureId}
            startDate={startDate}
            endDate={endDate}
          />
        </View>
      </Tabs.ScrollView>
    </>
  );
};

const ImageTab = ({
  selectedImages,
  removeImages,
  loadmoreImageData,
  imageFooterLoader,
  themeColors,
  loading,
  isLoading,
  deleteEnclosureMedia,
  isModalVisible,
  bottomTitle,
  alertModalClose,
  firstButtonPress,
  secondButtonPress,
  inchargeList,
  UserId,
  refreshingImage,
  onRefreshImage,
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
        acess_restricted_key: el.acess_restricted_key ?? "",
        url: el.file,
        filename: el?.file_name ?? "",
        user_id: el?.user_id,
        delete_access:
          UserId == el.user_id || inchargeList.includes(UserId) ? true : false,
      };
    });
  return (
    <View style={{ marginHorizontal: Spacing.minor, marginTop: Spacing.body }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshingImage}
            onRefresh={onRefreshImage}
            style={{ color: themeColors.blueBg }}
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
            imageDelete={deleteEnclosureMedia}
          />
        ) : (
          <ListEmpty label={"No images available!"} visible={loading} />
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
  loading,
  refreshingDocuments,
  onRefreshDocuments,
  inchargeList,
  documentDelete,
  isModalVisible,
  bottomTitle,
  alertModalClose,
  firstButtonPress,
  secondButtonPress,
  UserId,
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
          if (item?.file_type == "document") {
            return (
              <>
                <TouchableOpacity
                  onPress={() => openPDF(item?.file)}
                  disabled={item?.acess_restricted_key == "1" ? true : false}
                  style={[
                    {
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      padding: Spacing.body,
                      marginVertical: Spacing.mini,
                      backgroundColor: themeColors.secondaryContainer,
                      borderRadius: Spacing.mini,
                      opacity: item?.acess_restricted_key == "1" ? 0.2 : 1,
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
                  {inchargeList?.includes(UserId) || UserId == item?.user_id ? (
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
          }
        }}
        ListEmptyComponent={() => (
          <ListEmpty label={"No documents available!"} visible={loading} />
        )}
        ListFooterComponent={renderDocumentFooter}
        onEndReached={handleMoreDocument}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={refreshingDocuments}
            onRefresh={onRefreshDocuments}
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
  inchargeList,
  deleteVideo,
  isModalVisible,
  bottomTitle,
  alertModalClose,
  firstButtonPress,
  secondButtonPress,
  UserId,
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
                        borderWidth: 1,
                        borderColor: themeColors?.outline,
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
                            { color: themeColors.onSurfaceVariant },
                          ]}
                          numberOfLines={1}
                          ellipsizeMode="middle"
                        >
                          {item?.name ?? item.file_name ?? ""}
                        </Text>
                        {inchargeList?.includes(UserId) ||
                        UserId == item?.user_id ? (
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
// const VideoTab = ({
//   selectedVideos,
//   themeColors,
//   renderVideoFooter,
//   handleMoreVideo,
//   loading,
// }) => {
//   const videoRef = useRef(null);
//   const [videoModal, setVideoModal] = useState(false);
//   const [modalData, setModalData] = useState({});

//   const modalStyles =
//     BottomSheetModalStyles.getBottomSheetModalStyle(themeColors);

//   const handleVideoModal = (item) => {
//     setVideoModal(!videoModal);
//     setModalData(item);
//   };
//   return (
//     <>
//       <View style={{ padding: Spacing.body }}>
//         <View>
//           {/* {selectedVideos?.map((item) => {
//             return (
//               <>
//                 <View
//                   style={{
//                     width: widthPercentageToDP(45),
//                     marginVertical: Spacing.mini,
//                   }}
//                 >
//                   <Image
//                     source={require("../../assets/thumbnail.jpeg")}
//                     style={{
//                       width: widthPercentageToDP(45),
//                       height: heightPercentageToDP(17),
//                     }}
//                   />
//                   <View
//                     style={{
//                       backgroundColor: themeColors.secondaryContainer,
//                       padding: Spacing.mini,
//                     }}
//                   >
//                     <Text
//                       style={[
//                         FontSize.Antz_Subtext_Regular,
//                         { color: themeColors.onSurfaceVariant },
//                       ]}
//                       numberOfLines={1}
//                       ellipsizeMode="middle"
//                     >
//                       {item?.name}
//                     </Text>
//                   </View>
//                   <TouchableOpacity
//                     style={{
//                       position: "absolute",
//                       top: 0,
//                       right: 0,
//                       bottom: 0,
//                       left: 0,
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                     onPress={() => handleVideoModal(item)}
//                   >
//                     <MaterialCommunityIcons
//                       name="play"
//                       size={40}
//                       color={themeColors?.onPrimary}
//                     />
//                   </TouchableOpacity>
//                 </View>

//               </>
//             );
//           })} */}
//           <FlatList
//             data={selectedVideos}
//             numColumns={2}
//             columnWrapperStyle={{
//               justifyContent: "space-between",
//               marginBottom: 10,
//             }}
//             keyExtractor={(item, index) => index?.toString()}
//             renderItem={({ item }) => {
//               if (item?.file_type == "video") {
//                 return (
//                   <>
//                     <View
//                       style={{
//                         width: widthPercentageToDP(45),
//                         margin: Spacing.mini,
//                       }}
//                     >
//                       <Image
//                         source={require("../../assets/thumbnail.jpeg")}
//                         style={{
//                           width: widthPercentageToDP(45),
//                           height: heightPercentageToDP(17),
//                         }}
//                       />
//                       <View
//                         style={{
//                           backgroundColor: themeColors.secondaryContainer,
//                           padding: Spacing.mini,
//                         }}
//                       >
//                         <Text
//                           style={[
//                             FontSize.Antz_Subtext_Regular,
//                             { color: themeColors.onSurfaceVariant },
//                           ]}
//                           numberOfLines={1}
//                           ellipsizeMode="middle"
//                         >
//                           {item?.name ?? item.file_name ?? ""}
//                         </Text>
//                       </View>
//                       <TouchableOpacity
//                         style={{
//                           position: "absolute",
//                           top: 0,
//                           right: 0,
//                           bottom: 0,
//                           left: 0,
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                         onPress={() => handleVideoModal(item)}
//                       >
//                         <MaterialCommunityIcons
//                           name="play"
//                           size={40}
//                           color={themeColors?.onPrimary}
//                         />
//                       </TouchableOpacity>
//                     </View>
//                   </>
//                 );
//               }
//             }}
//             ListEmptyComponent={
//               <ListEmpty label={"No videos found!"} visible={loading} />
//             }
//             ListFooterComponent={renderVideoFooter}
//             onEndReachedThreshold={0.1}
//             onEndReached={handleMoreVideo}
//           />
//         </View>
//         {videoModal ? (
//           <Modal
//             avoidKeyboard
//             animationType="fade"
//             transparent={true}
//             visible={true}
//             style={[
//               modalStyles.bottomSheetStyle,
//               { backgroundColor: "transparent" },
//             ]}
//             onRequestClose={() => setVideoModal(false)}
//           >
//             <TouchableWithoutFeedback
//               // onPress={handleVideoModal}
//               style={[
//                 {
//                   flex: 1,
//                   backgroundColor: themeColors.blackWithPointEight,
//                 },
//               ]}
//             >
//               <View
//                 style={[
//                   {
//                     flex: 1,
//                     backgroundColor: themeColors.blackWithPointFour,
//                     justifyContent: "center",
//                     alignItems: "center",
//                   },
//                 ]}
//               >
//                 <TouchableOpacity
//                   style={{ position: "absolute", top: 20, right: 20 }}
//                   onPress={handleVideoModal}
//                 >
//                   <Entypo
//                     name="cross"
//                     size={30}
//                     color={themeColors.onPrimary}
//                   />
//                 </TouchableOpacity>
//                 <View
//                   style={[
//                     {
//                       justifyContent: "center",
//                       alignItems: "center",
//                       padding: Spacing.small,
//                     },
//                   ]}
//                 >
//                   <Video
//                     useNativeControls={true}
//                     resizeMode="contain"
//                     isLooping={false}
//                     ref={videoRef}
//                     source={{ uri: `${modalData?.file}` }}
//                     style={{ height: 250, width: 375 }}
//                     shouldPlay={true}
//                   />
//                 </View>
//                 {/* <TouchableWithoutFeedback
//                         onPress={() => setVideoModal(true)}
//                       >
//                         <View
//                           style={[
//                             {
//                               justifyContent: "center",
//                               alignItems: "center",
//                               padding: Spacing.small
//                             }
//                           ]}
//                         >
//                           <Video
//                             useNativeControls={true}
//                             resizeMode="contain"
//                             isLooping={false}
//                             ref={videoRef}
//                             source={{uri: `${modalData?.file}`}}
//                             style={{height:250, width: 375}}
//                             shouldPlay={true}
//                           />
//                         </View>
//                       </TouchableWithoutFeedback> */}
//               </View>
//             </TouchableWithoutFeedback>
//           </Modal>
//         ) : null}
//       </View>
//     </>
//   );
// };
const Media = ({
  setMediaTabName,
  setIsLoading,
  setPage,
  GetDocsData,
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
  isLoading,
  deleteEnclosureMedia,
  isModalVisible,
  bottomTitle,
  alertModalClose,
  firstButtonPress,
  secondButtonPress,
  inchargeList,
  onRefreshDocuments,
  refreshingDocuments,
  onRefreshVideos,
  refreshingVideos,
  onRefreshImage,
  refreshingImage,
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
  const documentData = selectedItems?.filter(
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
        setMediaTabName(screenName);
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
  const incharge_id_list = [
    ...new Set([...inchargeList]?.map((user) => user?.user_id)),
  ];
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
                loading={isLoading}
                deleteEnclosureMedia={deleteEnclosureMedia}
                isModalVisible={isModalVisible}
                bottomTitle={bottomTitle}
                alertModalClose={alertModalClose}
                firstButtonPress={firstButtonPress}
                secondButtonPress={secondButtonPress}
                inchargeList={incharge_id_list}
                UserId={UserId}
                onRefreshImage={onRefreshImage}
                refreshingImage={refreshingImage}
              />
            ) : screen === "documents" ? (
              <DocumentTab
                documents={documents}
                themeColors={themeColors}
                removeDocuments={removeDocuments}
                handleMoreDocument={handleMoreDocument}
                renderDocumentFooter={renderDocumentFooter}
                loading={isLoading}
                onRefreshDocuments={onRefreshDocuments}
                refreshingDocuments={refreshingDocuments}
                inchargeList={incharge_id_list}
                documentDelete={documentDelete}
                alertModalClose={alertModalClose}
                bottomTitle={bottomTitle}
                isModalVisible={isModalVisible}
                firstButtonPress={firstButtonPress}
                secondButtonPress={secondButtonPress}
                UserId={UserId}
              />
            ) : screen === "videos" ? (
              <VideoTab
                selectedVideos={selectedVideos}
                themeColors={themeColors}
                handleMoreVideo={handleMoreVideo}
                renderVideoFooter={renderVideoFooter}
                loading={isLoading}
                onRefreshVideos={onRefreshVideos}
                refreshingVideos={refreshingVideos}
                inchargeList={incharge_id_list}
                deleteVideo={deleteVideo}
                alertModalClose={alertModalClose}
                bottomTitle={bottomTitle}
                isModalVisible={isModalVisible}
                firstButtonPress={firstButtonPress}
                secondButtonPress={secondButtonPress}
                UserId={UserId}
              />
            ) : null}
          </View>
        </View>
      </Tabs.ScrollView>
      {/* {animalDetails?.is_deleted != "1" &&
      animalDetails?.animalDetails?.is_alive != "0" ? ( */}
      <View
        style={{
          marginVertical: Spacing.small,
          backgroundColor: themeColors.onPrimary,
        }}
      >
        <SubmitBtn
          buttonText={"Add Media"}
          iconName={"plus"}
          color={themeColors.onPrimary}
          onPress={() => setDocumentModal(!documentModal)}
        />
      </View>
      {/* ) : null} */}
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
export default OccupantScreen;

const pageStyles = (themeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    images: {
      height: "110%",
    },
    inChargeBox: {
      flexDirection: "row",
      marginTop: 5,
    },
    firstTextStyle: {
      ...FontSize.Antz_Body_Title,
      color: themeColors.onPrimary,
      textAlign: "left",
    },
    secondItemBox: {
      flexDirection: "row",
      marginTop: 5,
      marginBottom: Spacing.body + Spacing.micro,
    },

    bodyContainer: {
      position: "relative",
      bottom: 0,
      flex: 1,
      backgroundColor: themeColors.onPrimary,
      borderRadius: 20,
    },

    linearGradient: {
      width: "100%",
      height: "100%",
    },

    scientificName: {
      color: themeColors.onPrimary,
      fontStyle: "italic",
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      marginVertical: 2,
    },

    sexAndAge: {
      flexDirection: "row",
      marginVertical: 2,
    },

    sex: {
      color: themeColors.onPrimary,
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
      color: themeColors.onPrimary,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: FontSize.Antz_Body_Title.fontSize,
    },

    enclosureAndRingId: {
      flexDirection: "row",
      marginVertical: 2,
    },

    enclosure: {
      color: themeColors.onPrimary,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: FontSize.Antz_Body_Title.fontSize,
    },

    ringId: {
      color: themeColors.onPrimary,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: FontSize.Antz_Body_Title.fontSize,
    },

    tagAndHash: {
      flexDirection: "row",
      marginVertical: 8,
    },

    // Body Container

    card: {
      marginHorizontal: Spacing.minor,
      marginBottom: "2%",
      backgroundColor: themeColors.onPrimary,

      // backgroundColor:'red'
    },

    cardContentRow: {
      flexDirection: "row",
      marginHorizontal: "2%",
      marginVertical: "2%",
    },
    qrCard: {
      marginHorizontal: "4%",
      marginVertical: "2%",
      backgroundColor: themeColors.onPrimary,
    },

    qrCardContentRow: {
      alignItems: "center",
      justifyContent: "center",
    },

    cardContentItem: {
      flex: 0.5,
    },

    cardContentTitle: {
      color: themeColors.gray,
      fontSize: FontSize.Antz_Body_Title.fontSize,
    },

    cardContentData: {
      color: themeColors.neutralPrimary,
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
    },

    // Utilities
    markNode: {
      borderColor: themeColors?.red,
      borderWidth: 1,
    },
    tagMainCont: {
      marginLeft: 3,
    },
    tagsContainer: {
      flexDirection: "row",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      marginHorizontal: 5,
      fontWeight: FontSize.weight500,
    },

    malechipM: {
      backgroundColor: themeColors?.surfaceVariant,

      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      marginHorizontal: 5,
      fontWeight: FontSize.weight700,
    },
    femalechipF: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: themeColors?.secondary,
      fontWeight: FontSize.weight500,
      marginLeft: 5,
      borderWidth: 2,
    },
    malechipText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      color: themeColors?.onPrimaryContainer,
    },
    femalechipText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      color: themeColors?.onPrimaryContainer,
    },

    undeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: themeColors?.red,
      fontWeight: FontSize.weight500,
      marginLeft: 5,
    },
    undeterminedText: {
      marginLeft: 5,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      backgroundColor: themeColors?.errorContainer,
      color: themeColors?.onPrimary,
    },
    indeterminedText: {
      marginLeft: 5,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      backgroundColor: themeColors?.indertermineChip,
      color: themeColors?.onPrimary,
    },
    chipWrap: {
      marginTop: 8,
    },
    chip: {
      height: heightPercentageToDP(3),
      backgroundColor: themeColors.primaryContainer,
      width: widthPercentageToDP(18),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
    },
    fabStyle: {
      margin: 10,
      right: 5,
      bottom: 20,
      width: 45,
      height: 45,
      justifyContent: "center",
      alignItems: "center",
    },
    tabIcon: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      marginHorizontal: 4,
      // top: 4,
    },
    tabHeaderWrapper: {
      borderBottomColor: themeColors.surfaceVariant,
      borderBottomWidth: 1,
      backgroundColor: themeColors.onPrimary,
    },
    tabBody: {
      flex: 1,
    },
    attachBox: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      marginBottom: 3,
      marginTop: 3,
      backgroundColor: themeColors.surface,
    },
    enclosureTitleText: {
      fontSize: FontSize.Antz_Small,
      fontWeight: "500",
      color: themeColors.onError,
      letterSpacing: 3.6,
    },
    showSubenclosuresContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.body,
      backgroundColor: themeColors.onPrimary,
      borderRadius: Spacing.small,
      paddingVertical: Spacing.minor,
      marginBottom: Spacing.small,
      borderWidth: 1,
      borderColor: themeColors.outlineVariant,
    },
    showSubenclosuresText: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: themeColors.onSurfaceVariant,
      flex: 1,
    },
    subEnclosuresContainer: {
      paddingHorizontal: Spacing.minor,
      paddingBottom: Spacing.small,
      backgroundColor: themeColors?.surfaceVariant,
    },
    occupantsListContainer: {
      paddingLeft: Spacing.minor,
      paddingRight: Spacing.minor,
      backgroundColor: themeColors?.surfaceVariant,
      paddingBottom: Spacing.small,
    },
    headerMainContainer: {
      padding: Spacing.minor,
      borderRadius: Spacing.small,
      backgroundColor: themeColors.onError,
      marginBottom: Spacing.small,
    },
    includeSubenclosuresContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: Spacing.body,
      backgroundColor: themeColors.onPrimary,
      borderWidth: 1,
      borderRadius: Spacing.small,
      borderColor: themeColors.outlineVariant,
    },
    includeSubenclosuresText: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: themeColors.onSurfaceVariant,
      flex: 1,
    },
    headerCountContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: themeColors.background,
      padding: Spacing.body,
      borderRadius: Spacing.small,
    },
    headerCountTitleText: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: themeColors.onSurfaceVariant,
      flex: 1,
    },
    headerCountValueText: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: themeColors.onSurfaceVariant,
    },

    //   container: {
    //     flex: 1,
    //     backgroundColor: themeColors.onPrimary,
    // },
    modalOverlay: {
      flex: 1,
      backgroundColor: themeColors.blackWithPointEight,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: themeColors.onPrimary,
      width: widthPercentageToDP("70%"),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: Spacing.small,
    },
    modalView: {
      alignItems: "center",
      justifyContent: "center",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    accession: {
      fontSize: FontSize.Antz_Major_Medium.fontSize,
      fontWeight: FontSize.Antz_Major_Medium.fontWeight,
      padding: Spacing.minor,
      color: themeColors.onSurfaceVariant,
    },
    itemTitle: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: themeColors.onSurface,
    },
  });
