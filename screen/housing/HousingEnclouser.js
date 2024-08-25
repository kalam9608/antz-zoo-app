import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  BackHandler,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import AnimatedHeader from "../../components/AnimatedHeader";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  capitalize,
  checkPermissionAndNavigate,
  checkPermissionAndNavigateWithAccess,
  contactFun,
  ifEmptyValue,
  opacityColor,
  getFileInfo,
  getDocumentData,
  isLessThanTheMB,
  getFileData,
  LengthDecrease,
  ShortFullName,
} from "../../utils/Utils";
import { LinearGradient } from "expo-linear-gradient";
import { Card, FAB, ActivityIndicator, Checkbox } from "react-native-paper";
import CustomCard from "../../components/CustomCard";
import {
  getInchargesListingBySections,
  getSectionDetails,
  getSectionWiseAnimalTreatment,
} from "../../services/GetEnclosureBySectionIdServices";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { shortenNumber } from "../../utils/Utils";
import DownloadFile from "../../components/DownloadFile";
import Configs, { FilterMaster, data } from "../../configs/Config";
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
import HousingInsightCard from "../../components/housing/HousingInsightCard";
import FontSize from "../../configs/FontSize";

import TabBarStyles from "../../configs/TabBarStyles";
import { removeAnimalMovementData } from "../../redux/AnimalMovementSlice";
import Spacing from "../../configs/Spacing";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import ListEmpty from "../../components/ListEmpty";
import { useToast } from "../../configs/ToastConfig";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import ObservationCard from "../Observation/ObservationCard";
import {
  getObservationListOccupant,
  getObservationListforAdd,
} from "../../services/ObservationService";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { FlatList } from "react-native";
import SubmitBtn from "../../components/SubmitBtn";
import ImageViewer from "../../components/ImageViewer";
import { Video } from "expo-av";
import {
  allAddMedia,
  animalAddMedia,
  deleteMedia,
  getDocs,
} from "../../services/AnimalService";
import AnimalImageViewer from "../../components/AnimalImageViewer";
import Switch from "../../components/Switch";
import EnclosuresList from "../../components/EnclosuresList";
import SpeciesList from "../../components/SpeciesList";
import BottomSheetModalComponent from "../../components/BottomSheetModalComponent";
import AnimalsList from "../../components/AnimalsList";
import { warningToast } from "../../utils/Alert";
import SliderComponent from "../../components/SliderComponent";
import { RefreshControl } from "react-native-gesture-handler";
import {
  setEffectListApiCall,
  setMedicalAnimal,
  setMedicalEnclosure,
  setMedicalSection,
  setMedicalSite,
} from "../../redux/MedicalSlice";
import HousingSearchBox from "../../components/HousingSearchBox";
import { getMortalityListTypeWise } from "../../services/mortalityServices";
import { getAsyncData } from "../../utils/AsyncStorageHelper";
import { Platform } from "react-native";
import {
  addHousingInChargeMember,
  getHousingInChargesList,
  getHousingSiteUserAccessList,
  getLoginHisoryList,
} from "../../services/housingService/SectionHousing";
import MedicalRecordCardComponent from "../../components/MedicalRecordCardComponent";
import { getMedicalRecordCount } from "../../services/medicalRecord";
import moment from "moment";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import { searchUserListing } from "../../services/Animal_movement_service/SearchApproval";
import FilterComponent from "../../components/FilterComponent";
import Gallery from "../../assets/Gallery.svg";
import Videos from "../../assets/Video.svg";
import Documents from "../../assets/Document.svg";
import { SvgXml } from "react-native-svg";
import InsideBottomsheet from "../../components/Move_animal/InsideBottomsheet";
import { handleFilesPick } from "../../utils/UploadFiles";
const Header_Maximum_Height = heightPercentageToDP(42);

const HousingEnclouser = (props) => {
  const permission = useSelector((state) => state.UserAuth.permission);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const isEncDeleted = useSelector(
    (state) => state.tabRefresh.isEnclosureDeleted
  );
  const [sectionDetailsData, setSectionDetailsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sectionDetailsLoading, setSectionDetailsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [treatmentData, setTreatmentData] = useState([]);
  const [tabName, setTabName] = useState(
    permission["collection_animal_records"] ? "Occupants" : "Enclosures"
  );
  const [inchargeDetailsData, setInchargeDetailsData] = useState([]);
  const [inchargeLength, setInchargeLength] = useState(0);

  const route = useRoute();
  const section_name = route.params.section_title;
  const section_id = route.params.section_id;
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const [mediaTabName, setMediaTabName] = useState("images");
  const [header, setHeader] = useState(false);
  const navigation = useNavigation();
  const [observationdata, setObservationdata] = useState([]);
  const [observationDataCount, setObservationDataCount] = useState(0);
  const [observationLength, setObservationLength] = useState(0);
  const [observPage, setObservPage] = useState(1);
  const [Items, setItems] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [filterData, setFilterData] = useState(null);

  const [refreshing, setRefreshing] = useState(false);
  const [osbservationLoading, setObservationLoading] = useState(false);
  const [treatmentDataLength, setTreatmentDataLength] = useState(0);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [isAnimalsListModalVisible, setIsAnimalsListModalVisible] =
    useState(false);

  const [mortalityAnimalData, setMortalityAnimalData] = useState([]);
  const [mortalityAnimalDataLength, setMortalityAnimalDataLength] = useState(0);
  const [mortalityAnimalCount, setMortalityAnimalCount] = useState(0);
  const [mortalityAnimalPage, setMortalityAnimalPage] = useState(1);

  const animalsListModalRef = useRef(null);

  const [selectedImages, setSelectedImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [documentModal, setDocumentModal] = useState(false);
  const [status, setStatus] = useState({});
  const [isRestricted, setIsResticted] = useState(false);
  // const [state, setState] = React.useState({ open: false });
  const video = React.useRef(null);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const [mediaCount, setMediaCount] = useState({
    totalImage: 0,
    totalDocument: 0,
    totalVideo: 0,
  });
  const [totalImage, settotalImage] = useState(0);
  const [totalDocument, settotalDocument] = useState(0);
  const [totalVideo, settotalVideo] = useState(0);
  const [showSubenclosures, setShowSubenclosures] = useState(false);
  const [isHideStats, setIsHideStats] = useState(null);
  // two states for search functionality
  const [searchText, setSearchText] = useState("");
  const [searchTextIncharge, setSearchTextIncharge] = useState("");

  const [searchLoading, setSearchLoading] = useState(false);
  const isFocused = useIsFocused();
  const [bottomTitle, setBottomTitle] = useState("");
  const [type, setType] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const [sectionByUserList, setSectionByUserList] = useState([]);
  const [sectionByUserListLength, setSectionByUserListLength] = useState(0);
  const [inchargePage, setInchargePage] = useState(1);
  const [pegination, setPegination] = useState(false);
  const [pageHistory, setPageHistory] = useState(0);
  const [historyList, setHistoryList] = useState([]);
  const [totalLoginHistoryCount, setTotalLoginHistoryCount] = useState(0);
  const [LoginHistoryCount, setLoginHistoryCount] = useState(0);
  const [historyUser, setHistoryUser] = useState({});
  const loginHistoryModalRef = useRef(null);

  // for medical record
  const [medicalStatsCount, setMedicalStatsCount] = useState("");
  // *****this is for medical filter count update*****/
  const [selectDropValue, setSelectDropValue] = useState("Last 6 Months");
  // for this months start date
  const dateFormat = "YYYY-MM-DD";
  const currentDate = new Date();

  const end_date = moment(currentDate).format(dateFormat);

  const Last6Months = moment(currentDate)
    .subtract(6, "months")
    .format(dateFormat);

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

  // for incharge select
  const [sectionInchargeList, setSectionInchargeList] = useState([]);
  const [sectionSelectedInchargeId, setSectionSelectedInchargeId] = useState(
    []
  );
  const [isAddSectionInCharge, setIsAddSectionInCharge] = useState(false);

  const approver = useSelector((state) => state.AnimalMove.approver);

  // handles the on press of inChargeAdd (from the inChargeAndApproverSelect page)
  useFocusEffect(
    React.useCallback(() => {
      if (Object.keys(approver)?.length > 0) {
        if (approver?.length > 0 && isAddSectionInCharge) {
          addSiteIncharge(approver);
        }
      }
      return () => {};
    }, [JSON.stringify(approver), isAddSectionInCharge])
  );

  const [mediaLength, setMediaLength] = useState({
    imageLength: 0,
    documentLength: 0,
    videoLength: 0,
  });
  useFocusEffect(
    React.useCallback(() => {
      // setIsLoading(true);
      fetchTabData();
      return () => {};
    }, [navigation, tabName, mediaTabName, filterData])
  );
  useEffect(() => {
    setMediaTabName("images");
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (isAnimalsListModalVisible) {
        animalsListModalRef.current.close();
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
  }, [navigation, isAnimalsListModalVisible]);

  useFocusEffect(
    React.useCallback(() => {
      setSectionDetailsLoading(true);
      getSectionData();
      return () => {};
    }, [navigation])
  );

  useFocusEffect(
    useCallback(() => {
      getHideStatsValue();
    }, [])
  );

  const getHideStatsValue = async () => {
    const value = await getAsyncData("@antz_hide_stats");
    setIsHideStats(value);
  };

  useFocusEffect(
    useCallback(() => {
      if (tabName == "Medical Record") {
        setIsLoading(true);
        medicalCountFilterStats();
      }
    }, [navigation, tabName, startDate, endDate])
  );

  const fetchTabData = () => {
    setSearchText("");
    setSearchTextIncharge("");
    if (tabName == "Basic Info") {
      setPage(1);
      setIsLoading(false);
    } else if (tabName == "History") {
      setPage(1);
      setIsLoading(false);
    } else if (tabName == "Incharges" && sectionInchargeList?.length === 0) {
      setIsLoading(true);
      setPage(1);
      fetchInchargeListData(1, "");
    } else if (
      tabName == "Animals under treatment" &&
      treatmentData?.length === 0
    ) {
      setPage(1);
      setIsLoading(true);
      loadData3(1, "");
    } else if (tabName == "Notes" && observationLength === 0) {
      setIsLoading(true);
      // setPage(1);
      setObservPage(1);
      getObservation(1, filterData);
    } else if (tabName == "Mortality" && mortalityAnimalData?.length === 0) {
      setIsLoading(true);
      setMortalityAnimalPage(1);
      fetchMortalityData(1);
    } else if (tabName == "Media") {
      if (mediaTabName == "images" && selectedImages?.length === 0) {
        GetDocsData(1, "images");
        setIsLoading(true);
        fetchInchargeListData(1, "");
      } else if (mediaTabName == "videos" && documents?.length === 0) {
        GetDocsData(1, "videos");
        setIsLoading(true);
        fetchInchargeListData(1, "");
      } else if (mediaTabName == "documents" && selectedVideos?.length === 0) {
        GetDocsData(1, "documents");
        setIsLoading(true);
        fetchInchargeListData(1, "");
      }
    } else if (
      tabName == "Users" &&
      sectionByUserListLength === 0
    ) {
      setPage(1);
      setIsLoading(true);
      fetchUserWithExcessData(1, "");
    }
  };
  const SearchAddText = (text) => {
    setSearchText(text);
    if (text.length >= 3) {
      const getData = setTimeout(() => {
        setSearchLoading(true);
        if (tabName == "Animals under treatment") {
          loadData3(1, text);
        }
      }, 2000);
      return () => clearTimeout(getData);
    } else if (text.length == 0) {
      const getData = setTimeout(() => {
        if (tabName == "Animals under treatment") {
          setSearchLoading(true);
          loadData3(1, "");
        }
      }, 2000);
      return () => clearTimeout(getData);
    }
  };
  const SearchAddTextIncharge = (text) => {
    setSearchTextIncharge(text);
    if (text.length >= 3) {
      const getData = setTimeout(() => {
        setSearchLoading(true);
        setPage(1);
        fetchInchargeListData(1, text);
      }, 2000);
      return () => clearTimeout(getData);
    } else if (text.length == 0) {
      const getData = setTimeout(() => {
        setPage(1);
        setSearchLoading(true);
        fetchInchargeListData(1, "");
      }, 2000);
      return () => clearTimeout(getData);
    }
  };

  const SearchRemoveText = () => {
    setSearchText("");
    setSearchLoading(true);
    if (tabName == "Animals under treatment") {
      loadData3(1, "");
    }
  };
  const SearchRemoveTextIncharge = () => {
    setPage(1);
    setSearchLoading(true);
    setSearchTextIncharge("");
    fetchInchargeListData(1, "");
  };

  // API implementation for Enclosure
  const getSectionData = () => {
    let requestObj = {
      zoo_id: zooID,
      section_id: route.params.section_id,
    };
    getSectionDetails(requestObj)
      .then((res) => {
        if (res?.success) {
          if (
            sectionDetailsData === null &&
            Number(res?.data?.total_enclosures) > 0
          ) {
            setTabName("Enclosures");
          }
          setSectionDetailsData(res.data);
        }
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setSectionDetailsLoading(false);
      });
  };

  const fetchMortalityData = (page_count) => {
    const requestObj = {
      section_id: route.params.section_id,
      type: "animals",
      page_no: page_count,
    };
    getMortalityListTypeWise(requestObj)
      .then((res) => {
        let dataArr = page_count == 1 ? [] : mortalityAnimalData;
        if (res.data) {
          setMortalityAnimalCount(res?.data?.total_count);
          setMortalityAnimalDataLength(
            res.data?.result ? res.data?.result?.length : 0
          );
          setMortalityAnimalData(dataArr.concat(res.data?.result));
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const handleLoadMoreMortality = () => {
    if (
      !isLoading &&
      mortalityAnimalDataLength > 0 &&
      mortalityAnimalData?.length != mortalityAnimalCount
    ) {
      const nextPage = mortalityAnimalPage + 1;
      setMortalityAnimalPage(nextPage);
      fetchMortalityData(nextPage);
    }
  };

  const renderFooterMortality = () => {
    if (
      isLoading ||
      mortalityAnimalDataLength < 10 ||
      mortalityAnimalData?.length == mortalityAnimalCount
    )
      return null;
    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };

  const onRefreshSectionIncharge = () => {
    setRefreshing(true);
    fetchInchargeListData(1, "");
  };

  const addSiteIncharge = (users) => {
    setIsLoading(true);
    const requestObj = {
      ref_id: route.params.section_id,
      ref_type: "section",
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
        setIsAddSectionInCharge(false);
        fetchInchargeListData(1, "");
      })
      .catch((err) => {
        console.log(err);
        errorToast("success", JSON.stringify(err));
        setIsLoading(false);
      })
      .finally(() => setIsLoading(false));
  };

  const fetchInchargeListData = (count, searchText) => {
    const requestObj = {
      ref_id: route.params.section_id,
      ref_type: "section",
      page_no: count,
      q: searchText,
    };
    getHousingInChargesList(requestObj)
      .then((res) => {
        if (res.success) {
          setSectionInchargeList(res?.data);
          if (searchText?.length == 0) {
            setSectionSelectedInchargeId(res?.data);
          }
        }
        setIsLoading(false);
        setRefreshing(false);
        setSearchLoading(false);
      })
      .catch((err) => {
        console.log({ err });
        setIsLoading(false);
        setRefreshing(false);
      })
      .finally(() => {
        setRefreshing(false);
        setIsLoading(false);
        setSearchLoading(false);
      });
  };

  // const loadData2 = (count, searchText) => {

  //   // const requestObj = {
  //   //   ref_id:  route.params.section_id,
  //   //   ref_type: "section",
  //   //   page_no: count,
  //   //   search: searchText,
  //   // };
  //   // getHousingInChargesList(requestObj)

  //   getInchargesListingBySections({
  //     section_id: route.params.section_id,
  //     page_no: count,
  //     search: searchText,
  //   })
  //     .then((res) => {
  //       if (res.success) {
  //         setInchargeLength(res?.data?.total_count ?? 0);
  //         let dataArr = count == 1 ? [] : inchargeDetailsData;
  //         setInchargeDetailsData(dataArr.concat(res?.data?.incharge));
  //       }
  //       setIsLoading(false);
  //       setRefreshing(false);
  //       setSearchLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log({ err });
  //       setIsLoading(false);
  //       setRefreshing(false);
  //     })
  //     .finally(() => {
  //       setRefreshing(false);
  //       setIsLoading(false);
  //       setSearchLoading(false);
  //     });
  // };

  const inchargeLoadMore = () => {
    if (
      !isLoading &&
      inchargeDetailsData?.length >= 10 &&
      !refreshing &&
      inchargeDetailsData?.length != inchargeLength
    ) {
      setRefreshing(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchInchargeListData(nextPage, searchTextIncharge);
    }
  };

  const inchargerenderFooter = () => {
    const themeColors = useSelector((state) => state.darkMode.theme.colors);
    if (
      isLoading ||
      inchargeDetailsData.length < 10 ||
      inchargeDetailsData.length == 0 ||
      !refreshing ||
      inchargeDetailsData?.length == inchargeLength
    )
      return null;
    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };

  const loadData3 = (count, searchText) => {
    getSectionWiseAnimalTreatment({
      section_id: route.params.section_id,
      page_no: count,
      q: searchText,
    })
      .then((res) => {
        if (res?.success) {
          let dataArr = count == 1 ? [] : treatmentData;
          setTreatmentData(dataArr.concat(res?.data?.result));
          setIsLoading(false);
          if (res?.data?.total_count) {
            setTreatmentDataLength(res?.data?.total_count ?? 0);
          }
        }
        setRefreshing(false);
        setSearchLoading(false);
      })
      .catch((err) => {
        console.log({ err });
        setIsLoading(false);
        setRefreshing(false);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
        setSearchLoading(false);
      });
  };

  const handleLoadMore3 = () => {
    if (
      !isLoading &&
      treatmentData?.length >= 10 &&
      treatmentData?.length != treatmentDataLength &&
      !refreshing
    ) {
      setRefreshing(true);
      const nextPage = page + 1;
      setPage(nextPage);
      loadData3(nextPage, searchText);
    }
  };

  const renderFooter3 = () => {
    const themeColors = useSelector((state) => state.darkMode.theme.colors);
    if (
      isLoading ||
      treatmentData < 10 ||
      treatmentData == 0 ||
      !refreshing ||
      treatmentData?.length == treatmentDataLength
    )
      return null;
    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };

  const getObservation = (count, filter) => {
    const obj = {
      id: sectionDetailsData?.section_id,
      type: "section",
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
        if (res.success) {
          let dataArr = count == 1 ? [] : observationdata;

          setObservationDataCount(
            res?.data.total_count === undefined ? 0 : res?.data?.total_count
          );

          if (res?.data) {
            if (res?.data?.result) {
              dataArr = dataArr.concat(res?.data?.result);
            }
            setObservationdata(dataArr);
            setObservationLength(dataArr?.length);
            setIsLoading(false);
          } else {
            setObservationLength(observationDataCount);
          }
        }
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", e);
        setRefreshing(false);
      })
      .finally(() => {
        setObservationLoading(false);
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const observhandleLoadMore = () => {
    if (
      !isLoading &&
      observationLength >= 10 &&
      observationLength != observationDataCount
    ) {
      // setObservationLoading(true);

      let nextPage = observPage + 1;
      setObservPage(nextPage);
      getObservation(nextPage, filterData);
    }
  };

  const observrenderFooter = () => {
    if (
      isLoading ||
      observationLength < 10 ||
      observationLength == observationDataCount
    ) {
      return null;
    }
    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
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
      section_id: sectionDetailsData?.section_id,
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
        setRefreshing(false);
      });
  };

  const TAB_HEADER_ITEMS = useMemo(() => {
    const tabs = [
      {
        id: "1",
        title: "Enclosures",
        screen: "enclosure",
      },
      {
        id: "2",
        title: "Occupants",
        screen: "Occupants",
      },
      {
        id: "3",
        title: "Notes",
        screen: "observation",
      },
      // {
      //   id: "4",
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
      {
        id: "7",
        title: "Mortality",
        screen: "Mortality",
      },
      {
        id: "8",
        title: "Users",
        screen: "users"
      },
      {
        id: "9",
        title: "Animals under treatment",
        screen: "treatment",
      },
      // {
      //   id: "10",
      //   title: "History",
      //   screen: "history",
      // },
    ];

    if (sectionDetailsData === null && sectionDetailsLoading) {
      return [];
    }

    if (Number(sectionDetailsData?.total_enclosures) > 0) {
      return tabs;
    }
    return tabs.filter((i) => i.title !== "Enclosures");
  }, [sectionDetailsData]);

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
      !isLoading &&
      selectedImages.length >= 10 &&
      selectedImages.length != mediaCount.totalImage
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
      !isLoading &&
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
      !isLoading &&
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
    // setIsLoading(true);
    setDocumentModal(false);
    let type_of;
    if (type == "images") {
      type_of = "image";
    } else if (type == "documents") {
      type_of = "document";
    } else if (type == "videos") {
      type_of = "video";
    }
    let id = Number(sectionDetailsData?.section_id);
    getDocs("section", id, count, type_of)
      .then((res) => {
        if (res.success) {
          if (type == "images") {
            settotalImage(res?.data?.total_count);
            let dataArrImg = count == 1 ? [] : selectedImages;
            setMediaCount({ totalImage: res?.data?.total_count });
            setMediaLength({
              ...mediaLength,
              imageLength: res?.data?.result?.length,
            });
            setSelectedImages(dataArrImg.concat(res?.data?.result));
          } else if (type == "documents") {
            settotalDocument(res?.data?.total_count);
            let dataArrDocs = count == 1 ? [] : documents;
            setMediaCount({ totalDocument: res?.data?.total_count });
            setMediaLength({
              ...mediaLength,
              documentLength: res?.data?.result?.length,
            });
            setDocuments(dataArrDocs.concat(res?.data?.result));
          } else if (type == "videos") {
            settotalVideo(res?.data?.total_count);
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
      ref_id: sectionDetailsData?.section_id ?? 0,
      ref_type: "section",
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
          setTabName("Media");
          changeMediaInnerName("images");
          GetDocsData(1, "images");
        } else if (selectedItems[0]?.type == "application/pdf") {
          ref.current?.jumpToTab("documents");
          setTabName("Media");
          changeMediaInnerName("documents");
          GetDocsData(1, "documents");
        } else if (selectedItems[0]?.type == "video/mp4") {
          ref.current?.jumpToTab("videos");
          setTabName("Media");
          changeMediaInnerName("videos");
          GetDocsData(1, "videos");
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
  const ref = React.useRef();

  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const customStyles = styles(themeColors);
  const stylesSheet = TabBarStyles.getTabBarStyleSheet(themeColors);

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

  const onTabchange = (data) => {
    if (data.tabName !== undefined) setTabName(data.tabName);
  };

  const minimumHeaderHeight = 70;

  const getScrollPositionOfTabs = useMemo(
    () =>
      throttle((scrollPos) => {
        if (scrollPos - (headerHeight - (minimumHeaderHeight + 72)) >= 0) {
          setHeader(true);
        } else {
          setHeader(false);
        }
      }, 16),
    [headerHeight]
  );

  const [state, setState] = useState({ open: false });
  const { open } = state;

  const onStateChange = ({ open }) => setState({ open });

  const dispatch = useDispatch();

  const handleStats = (item) => {
    if (item === "Animals") {
      animalsListModalRef?.current?.present();
      setIsAnimalsListModalVisible(true);
    } else if (item === "Species") {
      ref.current?.jumpToTab("Occupants");
    } else {
      ref.current?.jumpToTab(item);
    }
  };

  // observation pull to refresh
  const onRefresh = () => {
    // setRefreshing(true);
    setIsLoading(true);
    setObservPage(1);
    getObservation(1, filterData);
    getSectionData();
  };

  // Treatment pull to refresh
  const onRefreshTreatment = () => {
    setRefreshing(true);
    loadData3(1, searchText);
    getSectionData();
  };

  // Incharge pull to refresh
  const onRefreshIncharge = () => {
    setRefreshing(true);
    fetchInchargeListData(1, searchTextIncharge);
    getSectionData();
  };
  // Treatment pull to refresh
  const onRefreshHistroy = () => {
    setRefreshing(true);
    fetchInchargeListData(1);
  };

  const onRefreshMortality = () => {
    setRefreshing(true);
    fetchMortalityData(1);
    getSectionData();
  };

  const onRefreshMedical = () => {
    setRefreshing(true);
    medicalCountFilterStats();
    getSectionData();
  };
  const onRefreshDocuments = () => {
    setRefreshing(true);
    GetDocsData(1, "documents");
    getSectionData();
  };
  const onRefreshVideos = () => {
    setRefreshing(true);
    GetDocsData(1, "videos");
    getSectionData();
  };
  const onRefreshImage = () => {
    setRefreshing(true);
    GetDocsData(1, "images");
    getSectionData();
  };
  const navigateCom = () => {
    dispatch(removeAnimalMovementData());
    dispatch(setMedicalEnclosure([]));
    dispatch(setMedicalAnimal([]));
    dispatch(setMedicalSection([]));
    dispatch(setMedicalSite([]));
    navigation.navigate("Observation", {
      sectionDetailsData: sectionDetailsData,
      onGoBackData: handleBackFromObservationScreen,
    });
  };
  const handleBackFromObservationScreen = (data) => {
    if (data === "observation") {
      ref.current?.jumpToTab("Notes");
      setObservPage(1);
      getObservation(1, filterData);
    }
  };
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  const deleteSectionMedia = (item) => {
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
  const fetchUserWithExcessData = (page_count, searchText) => {
    const requestObj = {
      id: section_id,
      type: "section",
      page_no: page_count,
      search: searchText,
      id: section_id,
    };
    getHousingSiteUserAccessList(requestObj)
      .then((res) => {
        let dataArr = page_count == 1 ? [] : sectionByUserList;
        if (res.data) {
          setSectionByUserListLength(res?.data?.result?.length);
          setSectionByUserList(dataArr.concat(res?.data?.result ?? []));
          setIsLoading(false);
          setSearchLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
        setSearchLoading(false);
        setPegination(false);
      });
  };
  const SearchUserAddText = (text) => {
    setSearchText(text);
    if (text.length >= 3) {
      const getData = setTimeout(() => {
        setSearchLoading(true);
        fetchUserWithExcessData(1, text);
      }, 1000);
      return () => clearTimeout(getData);
    } else if (text.length == 0) {
      setSearchLoading(true);
      fetchUserWithExcessData(1, "");
    }
  };
  const SearchUserRemoveText = () => {
    setSearchText("");
    setSearchLoading(true);
    fetchUserWithExcessData(1, "");
  };
  const handleLoadMoreUsers = () => {
    if (!isLoading && sectionByUserListLength >= 10 && !pegination) {
      const nextPage = inchargePage + 1;
      setInchargePage(nextPage);
      setPegination(true);
      fetchUserWithExcessData(nextPage, searchText);
    }
  };

  const renderFooterUsers = () => {
    if (pegination && sectionByUserListLength >= 10) {
      return (
        <ActivityIndicator style={{ color: themeColors.housingPrimary }} />
      );
    }
  };

  const onRefreshUser = () => {
    setRefreshing(true);
    fetchUserWithExcessData(1, searchText);
    getSectionData();
  };

  const loginHistory = (item, pageNo) => {
    setHistoryUser(item);
    const obj = {
      user_id: item?.user_id,
      page_no: pageNo,
    };
    getLoginHisoryList(obj)
      .then((res) => {
        if (res.success) {
          let dataArr = pageNo == 1 ? [] : historyList;
          setTotalLoginHistoryCount(
            res.data.total_count === undefined ? 0 : res.data.total_count
          );
          if (res?.data?.result) {
            loginHistoryModalRef.current.present();
            dataArr = dataArr.concat(res?.data?.result);
            setHistoryList(dataArr);
            setLoginHistoryCount(dataArr.length);
          }
        } else {
          loginHistoryModalRef.current.close();
          errorToast("Error", "Something went wrong!");
        }
      })
      .catch((err) => {
        console.log({ err });
        loginHistoryModalRef.current.close();
        errorToast("Error", "Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false);
        setPegination(false);
      });
  };

  const handleMoreLoginHistory = () => {
    if (
      !isLoading &&
      LoginHistoryCount > 0 &&
      LoginHistoryCount != totalLoginHistoryCount
    ) {
      const nextPage = pageHistory + 1;
      setPageHistory(nextPage);
      loginHistory(historyUser, nextPage);
    }
  };
  const renderLoginHistoryFooter = () => {
    if (
      isLoading ||
      LoginHistoryCount == 0 ||
      LoginHistoryCount == totalLoginHistoryCount
    )
      return null;
    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };

  return (
    <View
      style={[
        customStyles.container,
        { backgroundColor: themeColors.surfaceVariant },
      ]}
    >
      <Loader visible={isLoading || sectionDetailsLoading} />
      <AppBar
        sectionDetailsData={sectionDetailsData}
        section_name={section_name}
        header={header}
        style={[
          header
            ? { backgroundColor: themeColors.onPrimary }
            : { backgroundColor: "transparent" },
          { position: "absolute", top: 0, width: "100%", zIndex: 1 },
        ]}
      />
      <Tabs.Container
        ref={ref}
        pagerProps={{ scrollEnabled: false }}
        key={sectionDetailsData}
        // Fix of AF - 1986 (in IOS tabs were stuck)
        initialTabName={
          TAB_HEADER_ITEMS.find((item) => item.title === "Enclosures")
            ? "Enclosures"
            : permission["collection_animal_records"]
            ? "Occupants"
            : TAB_HEADER_ITEMS[1]?.title
        }
        // initialTabName={
        //   permission["collection_animal_records"]
        //     ? "Occupants"
        //     : TAB_HEADER_ITEMS[1]?.title
        // }
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
            <OverlayContent
              sectionDetailsData={sectionDetailsData}
              section_name={section_name}
              getScrollPositionOfTabs={getScrollPositionOfTabs}
              getHeaderHeight={getHeaderHeight}
              permission={permission}
              isHideStats={isHideStats}
              handleStats={handleStats}
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
        {TAB_HEADER_ITEMS.map((item) => {
          if (
            !permission["collection_animal_records"] &&
            item.screen == "Occupants"
          ) {
            return null;
          }
          if (
            !permission["access_mortality_module"] &&
            item.screen == "Mortality"
          ) {
            return null;
          }
          return (
            <Tabs.Tab name={item.title} label={item.title} key={item.id}>
              <View
                style={{
                  paddingVertical: item?.screen != "media" ? Spacing.small : 0,
                  height: "100%",
                }}
              >
                {item.screen === "enclosure" ? (
                  <EnclosuresList
                    type={"section"}
                    resetData={isEncDeleted}
                    sectionId={route?.params?.section_id ?? ""}
                    sectionName={route?.params?.sectiondata?.section_name ?? ""}
                    navigation={navigation}
                    permission={permission}
                    isHideStats={isHideStats}
                    isFocused={isFocused && tabName === "Enclosures"}
                    onEnclosurePress={(data) => {
                      navigation.navigate("OccupantScreen", {
                        enclosure_id: data?.enclosure_id ?? 0,
                        enclosure_name: data?.user_enclosure_name ?? "",
                        section_id: route?.params?.section_id ?? "",
                        section_name:
                          route?.params?.sectiondata?.section_name ?? "",
                      });
                    }}
                    onRefreshValue={true}
                    pullToRefresh={getSectionData}
                  />
                ) : item.screen === "history" ? (
                  <History loading={isLoading} />
                ) : item.screen === "basicInfo" ? (
                  <Basicinfo sectionDetailsData={sectionDetailsData} />
                ) : item.screen === "Mortality" ? (
                  <Mortality
                    themeColors={themeColors}
                    navigation={navigation}
                    permission={permission}
                    mortalityAnimalData={mortalityAnimalData}
                    handleLoadMoreMortality={handleLoadMoreMortality}
                    renderFooterMortality={renderFooterMortality}
                    onRefreshMortality={onRefreshMortality}
                    refreshingMortality={refreshing}
                    loading={isLoading}
                  />
                ) : item.screen === "treatment" ? (
                  <AnimalsTreatment
                    searchText={searchText}
                    SearchAddText={SearchAddText}
                    SearchRemoveText={SearchRemoveText}
                    searchLoading={searchLoading}
                    navigation={navigation}
                    themeColors={themeColors}
                    treatmentData={treatmentData}
                    permission={permission}
                    handleLoadMore3={handleLoadMore3}
                    renderFooter3={renderFooter3}
                    onRefreshTreatment={onRefreshTreatment}
                    refreshingTreatment={refreshing}
                    loading={isLoading}
                  />
                ) : item.screen === "Occupants" ? (
                  <SpeciesList
                    searchbox={true}
                    searchText={searchText}
                    SearchAddText={SearchAddText}
                    SearchRemoveText={SearchRemoveText}
                    searchLoading={searchLoading}
                    type={"section"}
                    resetData={false}
                    sectionId={route?.params?.section_id ?? ""}
                    permission={permission}
                    isHideStats={isHideStats}
                    showHeader={false}
                    isFocused={tabName === "Occupants"}
                    totalAnimals={shortenNumber(
                      sectionDetailsData?.total_animals ?? 0
                    )}
                    onSpeciesPress={(data) => {
                      setSelectedSpecies(data);
                      animalsListModalRef?.current?.present();
                      setIsAnimalsListModalVisible(true);
                    }}
                    onRefreshValue={true}
                    pullToRefresh={getSectionData}
                  />
                ) : item.screen === "incharge" ? (
                  <Incharge
                    searchTextIncharge={searchTextIncharge}
                    searchText={searchText}
                    SearchAddText={SearchAddTextIncharge}
                    SearchRemoveText={SearchRemoveTextIncharge}
                    searchLoading={searchLoading}
                    navigation={navigation}
                    themeColors={themeColors}
                    // inchargeDetailsData={inchargeDetailsData}
                    sectionInchargeList={sectionInchargeList}
                    sectionSelectedInchargeId={sectionSelectedInchargeId}
                    inchargeLoadMore={inchargeLoadMore}
                    inchargerenderFooter={inchargerenderFooter}
                    onRefreshIncharge={onRefreshIncharge}
                    refreshingIncharge={refreshing}
                    setIsAddSectionInCharge={setIsAddSectionInCharge}
                    permission={permission}
                    loading={isLoading}
                    section_id={route.params.section_id}
                  />
                ) : item.screen === "observation" ? (
                  <Observation
                    navigation={navigation}
                    themeColors={themeColors}
                    sectionDetailsData={sectionDetailsData}
                    observationdata={observationdata}
                    observhandleLoadMore={observhandleLoadMore}
                    observrenderFooter={observrenderFooter}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
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
                    sectionId={route?.params?.section_id ?? ""}
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
                    reduxColors={customStyles}
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
                    deleteSectionMedia={deleteSectionMedia}
                    alertModalClose={alertModalClose}
                    bottomTitle={bottomTitle}
                    isModalVisible={isModalVisible}
                    firstButtonPress={firstButtonPress}
                    secondButtonPress={secondButtonPress}
                    inchargeList={sectionInchargeList?.incharges ?? []}
                    onRefreshDocuments={onRefreshDocuments}
                    refreshingDocuments={refreshing}
                    onRefreshVideos={onRefreshVideos}
                    refreshingVideos={refreshing}
                    onRefreshImage={onRefreshImage}
                    refreshingImage={refreshing}
                    documentDelete={documentDelete}
                    deleteVideo={deleteVideo}
                  />
                ) : item?.screen == "users" ? (
                  <Users
                    searchText={searchText}
                    SearchUserAddText={SearchUserAddText}
                    SearchUserRemoveText={SearchUserRemoveText}
                    searchLoading={searchLoading}
                    handleLoadMoreUsers={handleLoadMoreUsers}
                    renderFooterUsers={renderFooterUsers}
                    sectionByUserList={sectionByUserList}
                    themeColors={themeColors}
                    onRefreshUser={onRefreshUser}
                    refreshingPermission={refreshing}
                    loading={isLoading}
                    loginHistory={(item) => {
                      setIsLoading(true);
                      setPageHistory(1);
                      loginHistory(item, 1);
                    }}
                  /> 
                ) : null}
              </View>
            </Tabs.Tab>
          );
        })}
      </Tabs.Container>

      <FAB.Group
        open={open}
        visible
        fabStyle={customStyles.fabStyle}
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
            label: "Add Enclosure ",
            onPress: () => {
              dispatch(removeAnimalMovementData());
              checkPermissionAndNavigate(
                permission,
                "housing_add_enclosure",
                navigation,
                "CreateEnclosure",
                {
                  section_id: sectionDetailsData?.section_id,
                  section_name: sectionDetailsData?.section_name,
                }
              );
            },
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
          type={"section"}
          sectionId={route?.params?.section_id ?? ""}
          speciesData={selectedSpecies}
          permission={permission}
          onItemPress={(data) => {
            animalsListModalRef?.current?.close();
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
      <BottomSheetModalComponent ref={loginHistoryModalRef}>
        <InsideBottomsheet
          title="Login History"
          type="loginHistory"
          data={historyList}
          handleLoadMore={handleMoreLoginHistory}
          renderLoginHistoryFooter={renderLoginHistoryFooter}
        />
      </BottomSheetModalComponent>
    </View>
  );
};

const Users = ({
  searchText,
  searchLoading,
  SearchUserAddText,
  SearchUserRemoveText,
  sectionByUserList,
  handleLoadMoreUsers,
  renderFooterUsers,
  themeColors,
  refreshingPermission,
  onRefreshUser,
  loginHistory,
  loading,
}) => {
  const navigation = useNavigation();
  return (
    <>
      <Tabs.FlatList
        data={sectionByUserList}
        keyExtractor={(item, index) => index?.toString()}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.4}
        style={{
          paddingHorizontal: Spacing.minor,
          backgroundColor: themeColors.surfaceVariant,
          paddingVertical: Spacing.mini,
        }}
        ListHeaderComponent={
          <>
            <HousingSearchBox
              value={searchText}
              onChangeText={(e) => SearchUserAddText(e)}
              onClearPress={() => SearchUserRemoveText()}
              loading={searchLoading}
            />
          </>
        }
        renderItem={({ item }) => {
          return (
            <CustomCard
              title={capitalize(item?.full_name ? item?.full_name : "NA")}
              userIcon={item?.profile_pic ?? null}
              fname={
                item?.user_first_name && item?.user_last_name
                  ? capitalize(item?.user_first_name?.charAt(0)) +
                    "" +
                    capitalize(item?.user_last_name?.charAt(0))
                  : item?.full_name
                  ? ShortFullName(item?.full_name)
                  : "NA"
              }
              PhoneCall={item?.mobile_number}
              SendMsz={item?.mobile_number}
              icon={null}
              onPress={() => loginHistory(item)}
            />
          );
        }}
        ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
        onEndReached={handleLoadMoreUsers}
        ListFooterComponent={renderFooterUsers}
        refreshControl={
          <RefreshControl
            refreshing={refreshingPermission}
            onRefresh={onRefreshUser}
            style={{ color: themeColors.blueBg }}
            enabled={true}
          />
        }
      ></Tabs.FlatList>
    </>
  );
};

const OverlayContent = ({
  sectionDetailsData,
  section_name,
  getScrollPositionOfTabs,
  getHeaderHeight,
  permission,
  isHideStats,
  handleStats,
}) => {
  const route = useRoute();
  const navigation = useNavigation();
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const customStyles = styles(themeColors);

  const moreOptionData = [
    { id: 1, option: "Edit Section", screen: "EditSection" },
  ];
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  useEffect(() => {
    navigation.setOptions({ title: route.params.incharge_name });
  }, [route.params.incharge_name]);

  const chooseOption = (item) => {
    if (sectionDetailsData) {
      navigation.navigate(item.screen, { section: sectionDetailsData });
    }
  };
  const { top, height } = useHeaderMeasurements();
  const [tabBarBorderRadius, setTabBarBorderRadius] = useState(false);
  getHeaderHeight(height.value);

  const scrollY = useCurrentTabScrollY();
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 200],
      [1, 0],
      Extrapolate.CLAMP
    );
    if (scrollY.value - (height.value - 142) >= 0) {
      runOnJS(setTabBarBorderRadius)(true);
    } else {
      runOnJS(setTabBarBorderRadius)(false);
    }
    runOnJS(getScrollPositionOfTabs)(scrollY.value);
    return {
      opacity,
    };
  });

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
  const [sliderImages, setSliderImages] = useState([]);
  useEffect(() => {
    if (sectionDetailsData?.images) {
      const imageArray = sectionDetailsData?.images?.filter(
        (item) =>
          // item?.display_type == "gallery"
          item?.display_type == "banner" // change gallery to banner image instructed by nidhin
      );

      const imageObjectsArray = imageArray.map((item) => ({ img: item.file }));

      setSliderImages(imageObjectsArray);
    }
  }, [sectionDetailsData?.images]);

  const backgroundImage = undefined;
  const backgroundImage1 = sectionDetailsData?.images
    ? sectionDetailsData?.images?.filter(
        (item) => item?.display_type == "gallery"
      )[0]?.file
    : null;
  const overlayContent = (
    <View
      style={{
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <View style={{ paddingLeft: 8, paddingLeft: 8 }}>
          <Text style={customStyles.sectionTitleText}>{"SECTION"}</Text>
          <Text
            style={[
              {
                color: themeColors.onPrimary,
              },
              FontSize.Antz_Major_Title,
            ]}
          >
            {sectionDetailsData?.section_name ?? section_name}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 5,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              paddingLeft: 8,
              paddingLeft: 8,
            }}
          >
            <Text
              style={[
                {
                  color: themeColors.onPrimary,
                  textAlign: "center",
                },
                FontSize.Antz_Body_Medium,
              ]}
            >
              In charge
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              height: 32,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                borderWidth: 1,
                borderColor: opacityColor(themeColors.onPrimary, 20),
                marginLeft: heightPercentageToDP(1),
                marginRight: heightPercentageToDP(1),
                backgroundColor: opacityColor(themeColors.neutralPrimary, 40),
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  marginLeft: heightPercentageToDP(1),
                  marginRight: heightPercentageToDP(1),
                }}
              >
                <Text
                  style={{
                    color: themeColors.onPrimary,
                    fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                    fontSize: FontSize.Antz_Minor_Regular.fontSize,
                    textAlign: "center",
                  }}
                >
                  {/* {sectionDetailsData?.incharge_name ?? "NA"} */}
                  {LengthDecrease(
                    16,
                    sectionDetailsData?.incharge_name ?? "NA"
                  )}
                </Text>
              </View>
            </View>
            {ifEmptyValue(sectionDetailsData?.incharge_name) != "NA" ? (
              <>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: opacityColor(themeColors.onPrimary, 20),
                    padding: 8,
                    borderRadius: 5,
                    height: 32,
                    backgroundColor: opacityColor(
                      themeColors.neutralPrimary,
                      40
                    ),
                  }}
                  onPress={() =>
                    handleCall(sectionDetailsData?.incharge_phone_number)
                  }
                >
                  <Image source={require("../../assets/call.png")} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: opacityColor(themeColors.onPrimary, 20),
                    padding: 8,
                    borderRadius: 5,
                    marginLeft: 8,
                    height: 32,
                    backgroundColor: opacityColor(
                      themeColors.neutralPrimary,
                      40
                    ),
                  }}
                  onPress={() =>
                    handleMessage(sectionDetailsData?.incharge_phone_number)
                  }
                >
                  <Image source={require("../../assets/chat.png")} />
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
        <View style={{ marginTop: 5, paddingLeft: 8, paddingLeft: 8 }}>
          <View>
            <Text
              style={{
                color: themeColors.onPrimary,
                fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                fontSize: FontSize.Antz_Body_Medium.fontSize,
                marginBottom: heightPercentageToDP(1),
              }}
            >
              Site - {sectionDetailsData?.site_name ?? "No Site"}
            </Text>
          </View>
        </View>
        {!isHideStats && permission?.["housing_view_insights"] && (
          <HousingInsightCard
            enclosureData={shortenNumber(sectionDetailsData?.total_enclosures)}
            encPress={handleStats}
            AnimalData={shortenNumber(sectionDetailsData?.total_animals)}
            mortalityData={shortenNumber(sectionDetailsData?.total_mortality)}
            speciesData={shortenNumber(sectionDetailsData?.total_species)}
          />
        )}
        {/* <View
                  style={{
                    display: 'flex',
                    flexDirection: "row",
                    margin: widthPercentageToDP(2),
                  }}
                >
                  <Chip
                    style={{
                      backgroundColor: Colors.housingpainBg,
                      borderRadius: 5,
                      marginRight: widthPercentageToDP(2),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: FontSize.Antz_Body_Title.fontSize,
                        fontWeight: FontSize.Antz_Body_Title.fontWeight,
                        color: themeColors.error,
                      }}
                    >
                      3 open task
                    </Text>
                  </Chip>
                  <Chip
                    style={{
                      backgroundColor: "rgba(0, 214, 201, 1)",
                      borderRadius: 5,
                      marginRight: widthPercentageToDP(2),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: FontSize.Antz_Body_Title.fontSize,
                        fontWeight: FontSize.Antz_Body_Title.fontWeight,
                        color: "rgba(31, 65, 91, 1)",
                      }}
                    >
                      Sunroof
                    </Text>
                  </Chip>
                  <Chip
                    style={{
                      backgroundColor: "rgba(0, 214, 201, 1)",
                      borderRadius: 5,
                      marginRight: widthPercentageToDP(2),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: FontSize.Antz_Body_Title.fontSize,
                        fontWeight: FontSize.Antz_Body_Title.fontWeight,
                        color: "rgba(31, 65, 91, 1)",
                      }}
                    >
                      Cam
                    </Text>
                  </Chip>
                </View> */}
      </View>
    </View>
  );

  return (
    <View style={customStyles.headerContainer}>
      <LinearGradient
        colors={[
          themeColors.onSecondaryContainer,
          themeColors.onPrimaryContainer,
        ]}
        style={customStyles.linearGradient}
      >
        <>
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
                      screen={"sectionDetails"}
                      child={
                        <View style={{ bottom: Spacing.body }}>
                          {overlayContent}
                        </View>
                      }
                      noNavigation={true}
                      autoPlay={true}
                      imageData={sliderImages}
                      navigation={navigation}
                      permission={permission}
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
        </>
      </LinearGradient>
    </View>
  );
};

const Mortality = ({
  themeColors,
  navigation,
  permission,
  mortalityAnimalData,
  handleLoadMoreMortality,
  renderFooterMortality,
  onRefreshMortality,
  refreshingMortality,
  loading,
}) => {
  return (
    <Tabs.FlatList
      data={mortalityAnimalData}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      onEndReachedThreshold={0.4}
      onEndReached={handleLoadMoreMortality}
      ListFooterComponent={renderFooterMortality}
      ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
      style={{
        paddingLeft: Spacing.minor,
        paddingRight: Spacing.minor,
        paddingVertical: Spacing.mini,
        backgroundColor: themeColors.surfaceVariant,
      }}
      renderItem={({ item }) => (
        <AnimalCustomCard
          item={item}
          animalIdentifier={
            item?.local_identifier_value
              ? item?.local_identifier_name
              : item?.animal_id
          }
          localID={item?.local_identifier_value ?? null}
          icon={item?.default_icon}
          enclosureName={item?.user_enclosure_name}
          animalName={
            item?.common_name ? item?.common_name : item?.scientific_name
          }
          scientific_name={item?.scientific_name ?? null}
          sectionName={item?.section_name}
          siteName={item?.site_name ?? null}
          show_specie_details={true}
          show_housing_details={true}
          chips={item?.sex}
          onPress={() =>
            checkPermissionAndNavigateWithAccess(
              permission,
              "collection_animal_record_access",
              navigation,
              "AnimalsDetails",
              {
                animal_id: item?.animal_id,
                default_tab: "Mortality", //Mortality Medical
              },
              "VIEW"
            )
          }
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshingMortality}
          onRefresh={onRefreshMortality}
          style={{
            color: themeColors.blueBg,
            marginTop:
              Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
          }}
          enabled={true}
        />
      }
    />
  );
};

const AnimalsTreatment = ({
  searchText,
  SearchAddText,
  SearchRemoveText,
  searchLoading,
  themeColors,
  treatmentData,
  navigation,
  permission,
  handleLoadMore3,
  renderFooter3,
  refreshingTreatment,
  onRefreshTreatment,
  loading,
}) => {
  return (
    <>
      <Tabs.FlatList
        data={treatmentData}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onEndReached={handleLoadMore3}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter3}
        ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
        style={{ paddingLeft: Spacing.minor, paddingRight: Spacing.minor }}
        ListHeaderComponent={
          <>
            <HousingSearchBox
              value={searchText}
              onChangeText={(e) => SearchAddText(e)}
              onClearPress={() => SearchRemoveText()}
              loading={searchLoading}
            />
          </>
        }
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
        refreshControl={
          <RefreshControl
            refreshing={refreshingTreatment}
            onRefresh={onRefreshTreatment}
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

const History = ({ section_id, loading }) => {
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  return (
    <>
      <Tabs.ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View
          style={{
            height: "100%",
            backgroundColor: themeColors.surfaceVariant,
          }}
        >
          <ListEmpty height={"50%"} visible={loading} />
        </View>
      </Tabs.ScrollView>
    </>
  );
};

const Basicinfo = ({ sectionDetailsData }) => {
  // fot taking styles from redux use this function
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const customStyles = styles(themeColors);
  return (
    <>
      <Tabs.ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Card style={customStyles.card} elevation={0}>
          <Card.Content>
            <View style={customStyles.cardContentRow}>
              <Image
                source={{
                  uri:
                    Configs.BASE_APP_URL +
                    "uploads/" +
                    sectionDetailsData?.qr_image,
                }}
                style={{ height: 250, width: 250 }}
              />
              <DownloadFile
                url={
                  Configs.BASE_APP_URL +
                  "uploads/" +
                  sectionDetailsData?.qr_image
                }
                text={"Download"}
              />
            </View>
          </Card.Content>
        </Card>
      </Tabs.ScrollView>
    </>
  );
};

const Incharge = ({
  searchTextIncharge,
  searchText,
  SearchAddText,
  SearchRemoveText,
  searchLoading,
  themeColors,
  inchargeDetailsData,
  inchargeLoadMore,
  inchargerenderFooter,
  refreshingIncharge,
  onRefreshIncharge,
  sectionInchargeList,
  permission,
  setIsAddSectionInCharge,
  sectionSelectedInchargeId,
  loading,
  section_id,
}) => {
  const navigation = useNavigation();
  return (
    <>
      <Tabs.FlatList
        data={sectionInchargeList?.incharges}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onEndReached={inchargeLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={inchargerenderFooter}
        ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
        style={{ paddingLeft: Spacing.minor, paddingRight: Spacing.minor }}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
            {permission["add_sites"] && (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: heightPercentageToDP(1),
                  height: heightPercentageToDP(6),
                  borderRadius: 8,
                  marginBottom: Spacing.mini,
                  backgroundColor: themeColors.secondary,
                }}
                onPress={() => {
                  setIsAddSectionInCharge(true);
                  navigation.navigate("InchargeAndApproverSelect", {
                    selectedInchargeIds:
                      sectionSelectedInchargeId?.incharges?.map(
                        (item) => item?.user_id
                      ),
                    inchargeDetailsData: sectionSelectedInchargeId?.incharges,
                    allowMultipleIncharge: String(
                      sectionInchargeList?.allow_multiple_incharges
                    ),
                    maxAllowedInCharges:
                      sectionInchargeList?.max_allowed_incharges, // TODO: Change this from api key max_allowed_incharges
                    screen: "addIncharge",
                    type: "section_incharge",
                    site_id: section_id,
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
                  Choose Section Incharge
                </Text>
              </TouchableOpacity>
            )}
            <HousingSearchBox
              value={searchTextIncharge}
              onChangeText={(e) => SearchAddText(e)}
              onClearPress={() => SearchRemoveText()}
              loading={searchLoading}
            />
          </>
        }
        renderItem={({ item }) => (
          <CustomCard
            title={
              capitalize(item?.user_first_name) +
              " " +
              capitalize(item?.user_last_name)
            }
            // subtitle={capitalize(item.user_last_name)}
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
        )}
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

const MedicalScreen = ({
  themeColors,
  medicalStatsCount,
  setDates,
  selectDropID,
  selectDropValue,
  sectionId,
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
            sectionId={sectionId}
            startDate={startDate}
            endDate={endDate}
          />
        </View>
      </Tabs.ScrollView>
    </>
  );
};

const Observation = ({
  themeColors,
  observationdata,
  observhandleLoadMore,
  observrenderFooter,
  sectionDetailsData,
  navigation,
  onRefresh,
  refreshing,
  loading,
  Items,
  fetchData,
  getSelectedData,
  selectedData,
  dispatch,
}) => {
  const newData = observationdata?.map((item) => ({
    ...item,
    ref_details: {
      user_section_name: sectionDetailsData?.section_name,
      section_code: sectionDetailsData?.section_code,
      section_id: sectionDetailsData?.section_id,
      section_incharge: sectionDetailsData?.section_incharge,
      section_incharge_number: sectionDetailsData?.incharge_phone_number,
      section_latitude: sectionDetailsData?.section_latitude,
      section_longitude: sectionDetailsData?.section_longitude,
      section_name: sectionDetailsData?.section_name,
      section_site_id: sectionDetailsData?.section_site_id,
    },
  }));

  const navigateCom = () => {
    dispatch(removeAnimalMovementData());
    dispatch(setMedicalEnclosure([]));
    dispatch(setMedicalAnimal([]));
    dispatch(setMedicalSection([]));
    dispatch(setMedicalSite([]));
    navigation.navigate("Observation", {
      sectionDetailsData: sectionDetailsData,
    });
  };
  return (
    <>
      <Tabs.FlatList
        data={newData}
        showsVerticalScrollIndicator={false}
        style={{
          paddingLeft: Spacing.minor,
          paddingRight: Spacing.minor,
          marginBottom: Spacing.small,
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
            {newData.length == 0 && (
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
                  // navigation.navigate("Observation", {
                  //   selectedSection: sectionDetailsData,
                  // });
                  navigateCom();
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
        onEndReachedThreshold={0.4}
        onEndReached={observhandleLoadMore}
        ListFooterComponent={observrenderFooter}
        ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
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

const ImageTab = ({
  selectedImages,
  removeImages,
  loadmoreImageData,
  imageFooterLoader,
  themeColors,
  loading,
  isLoading,
  deleteSectionMedia,
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
          inchargeList.includes(UserId) || UserId == el?.user_id ? true : false,
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
            imageDelete={deleteSectionMedia}
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
  onRefreshDocuments,
  refreshingDocuments,
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
        style={{ flex: 1 }}
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
                      {item?.name ?? item?.file_original_name ?? ""}
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
            style={{ color: themeColors.blueBg }}
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
  const [fullScreen, setFullScreen] = useState(false);

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
                        borderWidth:1, 
                        borderColor: themeColors?.outline
                      }}
                    >
                      <View>
                        <Image
                          source={{uri: item?.thumbnail}}
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
//                           {item?.name ?? item?.file_name ?? ""}
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
  deleteSectionMedia,
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
          // paddingBottom: Spacing.mini,
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
        <View style={{ backgroundColor: themeColors.onPrimary, flex: 1 }}>
          <View
            style={[
              {
                alignItems: "center",
                zIndex: 999,
                borderBottomColor: themeColors.surfaceVariant,
                borderBottomWidth: 1,
                backgroundColor: themeColors.onPrimary,
              },
            ]}
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
              keyExtractor={(item, index) => index.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View
            style={
              {
                // backgroundColor: themeColors?.error,
                // flex:1
              }
            }
          >
            {screen === "images" ? (
              <ImageTab
                selectedImages={selectedImages}
                removeImages={removeImages}
                imageFooterLoader={imageFooterLoader}
                loadmoreImageData={loadmoreImageData}
                themeColors={themeColors}
                loading={isLoading}
                deleteSectionMedia={deleteSectionMedia}
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

      <View
        style={{
          paddingBottom: Spacing.small,
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
// let AnimatedHeaderValue = Animated.Value(0);

//Max Height of the Header

// const animateHeaderHeight = AnimatedHeaderValue.interpolate({
//   inputRange: [0, Header_Maximum_Height],
//   outputRange: [Header_Maximum_Height, heightPercentageToDP(5.5)],
//   extrapolate: 'clamp',
// });

// const animateHeaderBackgroundColor = AnimatedHeaderValue.interpolate({
//   inputRange: [0, Header_Maximum_Height],
//   outputRange: ["#4286F4", "transparent"],
//   extrapolate: "clamp",
// });

export const AppBar = ({ sectionDetailsData, section_name, style, header }) => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const moreOptionData = [
    { id: 1, option: "Edit Section", screen: "EditSection" },
    // { id: 1, option: "QR Code", screen: "ProfileQr" },
  ];
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const permission = useSelector((state) => state.UserAuth.permission);

  useEffect(() => {
    navigation.setOptions({ title: route?.params?.incharge_name });
  }, [route?.params?.incharge_name]);

  const chooseOption = (item) => {
    if (item?.screen == "ProfileQr") {
      navigation.navigate(item.screen, { section: sectionDetailsData });
    } else {
      if (sectionDetailsData?.is_system_generated == "1") {
        warningToast(
          "Restricted",
          "This section is system generated. It will be not editable or deleted!!"
        );
      } else {
        if (sectionDetailsData) {
          dispatch(removeAnimalMovementData());
          checkPermissionAndNavigate(
            permission,
            "housing_add_section",
            navigation,
            item.screen,
            { section: sectionDetailsData }
          );
        }
      }
    }
  };
  return (
    <AnimatedHeader
      optionData={moreOptionData}
      optionPress={chooseOption}
      title={sectionDetailsData?.section_name ?? section_name}
      style={style}
      header={header}
      qrCard={true}
    />
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      //backgroundColor: themeColors.surfaceVariant
    },
    headerContainer: {
      width: "100%",
    },
    image: {
      width: 44,
      height: 44,
      borderRadius: 50,
      alignSelf: "center",
      marginRight: 10,
      marginLeft: 5,
    },
    card: {
      marginHorizontal: "4%",
      marginVertical: "2%",
      backgroundColor: "white",
    },

    cardContentRow: {
      alignItems: "center",
      justifyContent: "center",
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
    header: {
      width: "100%",
      backgroundColor: "transparent",
    },
    tabIcon: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      marginHorizontal: 4,
      // top: 4,
    },
    tabHeaderWrapper: {
      // borderBottomColor: "#E4DAE7",
      borderBottomWidth: 1,
      // backgroundColor: reduxColors.onPrimary,
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
      // backgroundColor: reduxColors.surface,
    },
    showSubenclosuresContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.body,
      backgroundColor: reduxColors.onPrimary,
      borderRadius: Spacing.small,
      paddingVertical: Spacing.minor,
      marginBottom: Spacing.small,
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
    },
    showSubenclosuresText: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      flex: 1,
    },
    sectionTitleText: {
      fontSize: FontSize.Antz_Small,
      fontWeight: "500",
      color: reduxColors.onError,
      letterSpacing: 3.6,
    },
  });
export default HousingEnclouser;
