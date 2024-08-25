// Date:- 4 April 2023
// Name:- Ganesh Aher
// Work:- 1.this component i called Get-Egg-Details API on Header,Body And Footer Design
//        2.Add moment Formate on API's date.

// Name : Wasim akram
//  work :- moment days difference  function added  to the header hatchinng part, hatching_period value also added by wasim akram.
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Image,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Linking,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  MaterialIcons,
  Octicons,
  Entypo,
  FontAwesome,
} from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { debounce, escape, result, set, throttle } from "lodash";
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
  color,
  Extrapolate,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import Loader from "../../components/Loader";
import DialougeModal from "../../components/DialougeModal";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {
  checkPermissionAndNavigateWithAccess,
  capitalize,
  ifEmptyValue,
  dateFormatter,
  LengthDecrease,
  opacityColor,
  shortenNumber,
  contactFun,
  checkPermissionAndNavigate,
  getFileInfo,
  getDocumentData,
  isLessThanTheMB,
  getFileData,
  ShortFullName,
} from "../../utils/Utils";
import { useDispatch, useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import TabBarStyles from "../../configs/TabBarStyles";
import AnimatedHeader from "../../components/AnimatedHeader";
import Spacing from "../../configs/Spacing";
import ListEmpty from "../../components/ListEmpty";
import SiteInsight from "../../components/SiteInsight";
import {
  addHousingInChargeMember,
  getHousingInChargesList,
  getHousingSectionList,
  getHousingSiteUserAccessList,
  getLoginHisoryList,
} from "../../services/housingService/SectionHousing";
import CustomSiteCard from "../../components/CustomSiteCard";
import CustomCard from "../../components/CustomCard";
import SpeciesCustomCard from "../../components/SpeciesCustomCard";
import { Checkbox, Divider, FAB } from "react-native-paper";
import EnclosuresList from "../../components/EnclosuresList";
import { FlatList } from "react-native";
import {
  createSiteLab,
  getTestsDefaultLab,
  getTestsLabMappingList,
  getZooSiteDetails,
} from "../../services/ZooSiteService";
import { getSampleAndTests } from "../../services/staffManagement/addPersonalDetails";
import UserCustomCard from "../../components/UserCustomCard";
import { searchUserListing } from "../../services/Animal_movement_service/SearchApproval";
import {
  addTeamMembers,
  getListOfTeams,
  getTransferListbySite,
  removeMembers,
  updateApprovalPermission,
} from "../../services/Animal_transfer/TransferAnimalService";
import { removeAnimalMovementData } from "../../redux/AnimalMovementSlice";
import { useToast } from "../../configs/ToastConfig";
import ModalWindowComponent from "../../components/ModalWindowComponent";
import SubmitBtn from "../../components/SubmitBtn";
import LabMappingModalComponent from "../../components/LabMappingModalComponent";
import ModalFilterComponent, {
  ModalTitleData,
} from "../../components/ModalFilterComponent";
import { FilterMaster, TRANSFER_STATUS } from "../../configs/Config";
import TransferListCard from "../../components/Transfer/TransferListCard";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import ImageViewer from "../../components/ImageViewer";
import { Video } from "expo-av";
import {
  allAddMedia,
  deleteMedia,
  getDocs,
  getSiteWiseAnimalsTreatment,
} from "../../services/AnimalService";
import AnimalImageViewer from "../../components/AnimalImageViewer";
import SpeciesList from "../../components/SpeciesList";
import BottomSheetModalComponent from "../../components/BottomSheetModalComponent";
import AnimalsList from "../../components/AnimalsList";
import FilterComponent from "../../components/FilterComponent";
import {
  animalEnclosureSite,
  animalListBySpecies,
} from "../../services/Animal_movement_service/MoveAnimalService";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import CheckBox from "../../components/CheckBox";
import { BackHandler } from "react-native";
import SliderComponent from "../../components/SliderComponent";
import compare_arrow from "../../assets/compare_arrows.svg";
import move_down from "../../assets/move_down.svg";
import moved_location from "../../assets/moved_location.svg";
import compare_arrow_white from "../../assets/compare_arrows_white.svg";
import move_down_white from "../../assets/move_down_white.svg";
import moved_location_white from "../../assets/moved_location_white.svg";
import { SvgXml } from "react-native-svg";
import { RefreshControl } from "react-native-gesture-handler";
import HousingSearchBox from "../../components/HousingSearchBox";
import { getMortalityListTypeWise } from "../../services/mortalityServices";
import InsideBottomsheet from "../../components/Move_animal/InsideBottomsheet";
import { getAsyncData } from "../../utils/AsyncStorageHelper";
import MedicalRecordCardComponent from "../../components/MedicalRecordCardComponent";
import moment from "moment";
import { getMedicalRecordCount } from "../../services/medicalRecord";
import {
  getObservationListOccupant,
  getObservationListforAdd,
} from "../../services/ObservationService";
import ObservationCard from "../Observation/ObservationCard";
import {
  setMedicalAnimal,
  setMedicalEnclosure,
  setMedicalSection,
  setMedicalSite,
} from "../../redux/MedicalSlice";
import Gallery from "../../assets/Gallery.svg";
import Videos from "../../assets/Video.svg";
import Documents from "../../assets/Document.svg";
import { handleFilesPick } from "../../utils/UploadFiles";

const SiteDetails = ({ siteData, ...props }) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const permission = useSelector((state) => state.UserAuth.permission);
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(themeColors);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  const TAB_HEADER_ITEMS = [
    {
      id: "0",
      title: "Sections",
      screen: "section",
    },
    {
      id: "1",
      title: "Enclosures",
      screen: "Enclosures",
    },
    {
      id: "2",
      title: "Occupants",
      screen: "species",
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
      title: "Animal Transfers",
      screen: "animalTransfers",
    },
    {
      id: "6",
      title: "Teams",
      screen: "teams",
    },
    {
      id: "7",
      title: "Media",
      screen: "media",
    },
    {
      id: "8",
      title: "Config",
      screen: "config",
    },
    {
      id: "9",
      title: "Users",
      screen: "permissions",
    },
    {
      id: "10",
      title: "Incharges",
      screen: "incharges",
    },
    {
      id: "11",
      title: "Mortality",
      screen: "Mortality",
    },
    {
      id: "12",
      title: "Animals under treatment",
      screen: "treatment",
    },
  ];

  const ref = React.useRef();
  const stylesSheet = TabBarStyles.getTabBarStyleSheet(themeColors);
  const minimumHeaderHeight = 70;
  const [tabBarBorderRadius, setTabBarBorderRadius] = useState(false);
  const [header, setHeader] = useState(false);
  const Header_Maximum_Height = heightPercentageToDP(42);
  const [headerHeight, setHeaderHeight] = React.useState(
    Header_Maximum_Height + 100
  );
  const [siteDetailsData, setSiteDetailsData] = useState();
  const site_id = props?.route?.params?.id;
  const user_id = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  // these state is used for section listing
  const [siteBySectionList, setSiteBySectionList] = useState([]);
  const [siteBySectionListLength, setSiteBySectionListLength] = useState([]);
  const [page, setPage] = useState(1);
  // two states for search functionality
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // these state is used for site wise permission user list
  const [siteByInchargeList, setSiteByInchargeList] = useState([]);
  const [siteByInchargeListLength, setSiteByInchargeListLength] = useState(0);
  const [inchargePage, setInchargePage] = useState(1);
  const [documentModal, setDocumentModal] = useState(false);

  const [observationdata, setObservationdata] = useState([]);
  const [observationDataCount, setObservationDataCount] = useState(0);
  const [observationLength, setObservationLength] = useState(0);
  const [observPage, setObservPage] = useState(1);
  const [Items, setItems] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [filterData, setFilterData] = useState(null);

  const [mortalityAnimalData, setMortalityAnimalData] = useState([]);
  const [mortalityAnimalDataLength, setMortalityAnimalDataLength] = useState(0);
  const [mortalityAnimalCount, setMortalityAnimalCount] = useState(0);
  const [mortalityAnimalPage, setMortalityAnimalPage] = useState(1);
  const [mediaTabName, setMediaTabName] = useState("images");

  const [extractedChildTests, setExtractedChildTests] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [isAnimalsListModalVisible, setIsAnimalsListModalVisible] =
    useState(false);
  const [isHideStats, setIsHideStats] = useState(null);

  // for inCharge list
  const [inChargeSiteList, setInChargeSiteList] = useState([]);
  const [isAddSiteInCharge, setIsAddSiteInCharge] = useState(false);
  const [pegination, setPegination] = useState(false);
  const animalsListModalRef = useRef(null);
  const loginHistoryModalRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      getHideStatsValue();
    }, [])
  );

  const getHideStatsValue = async () => {
    const value = await getAsyncData("@antz_hide_stats");
    setIsHideStats(value);
  };

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

  const [teamList, setTeamList] = useState([]);
  const [teamListCount, setTeamListCount] = useState(0);
  const [teamListPage, setTeamListPage] = useState(1);
  const [approverList, setApproverList] = useState([]);

  const [transferDataList, setTransferDataList] = useState([]);
  const [transferDataLength, setTransferDataLength] = useState(0);
  const [transferDataListCount, setTransferDataListCount] = useState(0);
  const [transferDataListPage, setTransferDataListPage] = useState(0);
  const [moreTransferLoading, setMoreTransferLoading] = useState(false);
  const [transferFilter, setTransferFilter] = useState("ALL");
  const [userType, setUserType] = useState("transfer_user");
  const [isAddMember, setIsAddMember] = useState(false);

  //Animals underTreatment
  const [treatmentData, setTreatmentData] = useState([]);
  const [treatmentDataCount, setTreatmentDataCount] = useState(0);
  const [treatmentLength, setTreatmentLength] = useState(0);
  const [treatmentPage, setTreatmentPage] = useState(0);
  const [treatmentLoading, setTreatmentLoading] = useState(false);
  const [innerTab, setInnerTab] = useState("intra");
  const [prevInnerTab, setPrevInnerTab] = useState("");

  const [innerTabTeam, setInnerTabTeam] = useState("team");
  const [prevInnerTabTeam, setPrevInnerTabTeam] = useState("");
  const [historyList, setHistoryList] = useState([]);
  const [totalLoginHistoryCount, setTotalLoginHistoryCount] = useState(0);
  const [LoginHistoryCount, setLoginHistoryCount] = useState(0);
  const [historyUser, setHistoryUser] = useState({});
  const [pageHistory, setPageHistory] = useState(0);

  const dispatch = useDispatch();
  const approver = useSelector((state) => state.AnimalMove.approver);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);

  const handleSetInnerTab = (tabName) => {
    setPrevInnerTab(innerTab);
    setInnerTab(tabName);
  };

  const handleTeamInnerTab = (tab) => {
    setPrevInnerTabTeam(innerTabTeam);
    setInnerTabTeam(tab);
  };
  useFocusEffect(
    React.useCallback(() => {
      if (Object.keys(approver)?.length > 0) {
        setApproverList(approver);
        if (approver.length > 0 && isAddMember) {
          addMembers(approver);
        }
      }
      return () => {};
    }, [JSON.stringify(approver), isAddMember])
  );

  // handles the on press of inChargeAdd (from the inChargeAndApproverSelect page)
  useFocusEffect(
    React.useCallback(() => {
      if (Object.keys(approver)?.length > 0) {
        if (approver?.length > 0 && isAddSiteInCharge) {
          addSiteIncharge(approver);
        }
      }
      return () => {};
    }, [JSON.stringify(approver), isAddSiteInCharge])
  );

  const [speciesCount, setSpeciesCount] = useState(0);
  const [siteBySpeciesList, setSiteBySpeciesList] = useState([]);
  const [SpeciesPage, setSpeciesPage] = useState(0);

  // for medical record
  const [medicalStatsCount, setMedicalStatsCount] = useState({});
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

  const medicalCountFilterStats = () => {
    let obj = {
      site_id: site_id,
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

  const [screenName, setScreenName] = useState(
    props?.route?.params?.mainScreen ?? "section"
  );
  const [PrevScreenName, setPrevScreenName] = useState("");
  const getHeaderHeight = React.useCallback(
    (headerHeight) => {
      if (headerHeight > 0) {
        setHeaderHeight(headerHeight + 70);
      }
    },
    [headerHeight]
  );

  useEffect(() => {
    if (PrevScreenName == "Animal Transfers") {
      setPrevInnerTab(innerTab);
    }
  }, [PrevScreenName]);
  useEffect(() => {
    if (PrevScreenName == "Teams") {
      setPrevInnerTabTeam(innerTabTeam);
    }
  }, [PrevScreenName]);
  const getScrollPositionOfTabs = useMemo(
    () =>
      throttle((scrollPos) => {
        if (scrollPos - (headerHeight - (minimumHeaderHeight + 74 + 26)) >= 0) {
          setHeader(true);
          setTabBarBorderRadius(true);
        } else {
          setHeader(false);
          setTabBarBorderRadius(false);
        }
      }),
    [headerHeight]
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchSiteDetails();
      return () => {};
    }, [navigation])
  );

  useFocusEffect(
    React.useCallback(() => {
      // setPegination(false);
      setSearchText("");
      // setTeamList([]);
      if (screenName == "section" && siteBySectionList.length <= 0) {
        setIsLoading(true);
        setPage(1);
        fetchSectionData(1, "");
      } else if (screenName == "animalTransfers" && prevInnerTab !== innerTab) {
        // if (innerTab == "team") {
        //   setIsLoading(true);
        //   setTeamListPage(1);
        //   setUserType("transfer_user");
        //   fetchTeams(1, "transfer_user");
        // } else if (innerTab == "securityTeam") {
        //   setIsLoading(true);
        //   setTeamListPage(1);
        //   setUserType("security");
        //   fetchTeams(1, "security");
        // } else if (innerTab == "transfers") {
        setIsLoading(true);
        setTransferDataListPage(1);
        setTransferDataListCount(0);
        setTransferDataList(0);
        setTransferDataLength(0);
        fetchTransferList(1);
        if (props?.route?.params?.mainScreen == "animalTransfers") {
          setTimeout(() => {
            ref.current?.jumpToTab("Animal Transfers");
          }, 1000);
        }
        // }
      } else if (screenName == "teams" && prevInnerTabTeam !== innerTabTeam) {
        if (innerTabTeam == "team") {
          setIsLoading(true);
          setTeamListPage(1);
          setUserType("transfer_user");
          fetchTeams(1, "transfer_user");
        } else if (innerTabTeam == "securityTeam") {
          setIsLoading(true);
          setTeamListPage(1);
          setUserType("security");
          fetchTeams(1, "security");
        }
      } else if (screenName == "species") {
        // setIsLoading(true);
        // setSpeciesPage(1);
        // fetchSiteSpeciesData(1);
      } else if (screenName == "observation" && observationLength === 0) {
        setIsLoading(true);
        // setPage(1);
        setObservPage(1);
        getObservation(1, filterData);
      } else if (screenName == "treatment" && treatmentLength === 0) {
        setIsLoading(true);
        setTreatmentPage(1);
        treatmentDataLoad(1, "");
      } else if (
        screenName == "permissions" &&
        siteByInchargeListLength === 0
      ) {
        setPage(1);
        setIsLoading(true);
        fetchUserWithExcessData(1, "");
      } else if (screenName == "Mortality" && mortalityAnimalDataLength === 0) {
        setIsLoading(true);
        setMortalityAnimalPage(1);
        fetchMortalityData(1);
      } else if (screenName == "media") {
        if (mediaTabName == "images" && selectedImages?.length === 0) {
          GetDocsData(1, "images");
          setIsLoading(true);
          fetchHousingInChargesList();
        } else if (mediaTabName == "videos" && documents?.length === 0) {
          GetDocsData(1, "videos");
          setIsLoading(true);
          fetchHousingInChargesList();
        } else if (
          mediaTabName == "documents" &&
          selectedVideos?.length === 0
        ) {
          GetDocsData(1, "documents");
          setIsLoading(true);
          fetchHousingInChargesList();
        }
        // setIsLoading(true);
        // GetDocsData(1, "images");
      } else if (screenName == "incharges" && inChargeSiteList?.length === 0) {
        fetchHousingInChargesList();
      } else if (
        screenName == "medicalRecord" &&
        Object.keys(medicalStatsCount).length <= 0
      ) {
        setIsLoading(true);
        medicalCountFilterStats();
      }

      return () => {};
    }, [
      navigation,
      screenName,
      innerTab,
      transferFilter,
      innerTabTeam,
      startDate,
      endDate,
      mediaTabName,
      filterData,
    ])
  );

  const [allAnimalList, setAllAnimalList] = useState([]);
  const [allAnimalCount, setAllAnimalCount] = useState(0);

  const fetchAllAnimal = () => {
    setIsLoading(true);
    animalEnclosureSite({ site_id })
      .then((res) => {
        if (res?.success) {
          setAllAnimalList(res.data.result);
          setAllAnimalCount(res.data.total_count ?? 0);
          // animalSheetRef.current.present();
        } else {
          // errorToast("Error", "Oops! ,Something went wrong!!");
        }
      })
      .catch((err) => {
        console.log("err", err);
        // errorToast("Error", "Oops! ,Something went wrong!!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchSiteDetails = () => {
    const requestObj = {
      site_id: site_id,
    };
    getZooSiteDetails(requestObj)
      .then((res) => {
        setSiteDetailsData(res?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
        setPegination(false);
      });
  };

  const SearchAddText = (text) => {
    setSearchText(text);

    if (text.length >= 3) {
      const getData = setTimeout(() => {
        setSearchLoading(true);
        if (screenName == "section") {
          setPage(1);
          fetchSectionData(1, text);
        } else if (screenName == "permissions") {
          fetchUserWithExcessData(1, text);
        }
        if (screenName == "treatment") {
          setTreatmentPage(1);
          treatmentDataLoad(1, text);
        }
      }, 1000);
      return () => clearTimeout(getData);
    } else if (text.length == 0) {
      if (screenName == "section") {
        setSearchLoading(true);
        setPage(1);
        fetchSectionData(1, "");
      } else if (screenName == "permissions") {
        setSearchLoading(true);
        fetchUserWithExcessData(1, "");
      } else if (screenName == "treatment") {
        setSearchLoading(true);
        setTreatmentPage(1);
        treatmentDataLoad(1, "");
      }
    }
  };
  const SearchRemoveText = () => {
    setSearchText("");
    if (screenName == "section") {
      setSearchLoading(true);
      setPage(1);
      fetchSectionData(1, "");
    } else if (screenName == "permissions") {
      setSearchLoading(true);
      fetchUserWithExcessData(1, "");
    } else if (screenName == "treatment") {
      setSearchLoading(true);
      setTreatmentPage(1);
      treatmentDataLoad(1, "");
    }
  };
  const fetchSectionData = (page_count, searchText) => {
    const requestObj = {
      site_id: site_id,
      page_no: page_count,
      search: searchText,
    };
    getHousingSectionList(requestObj)
      .then((res) => {
        let dataArr = page_count == 1 ? [] : siteBySectionList;
        if (res.data) {
          setSiteBySectionListLength(res.data.result.length);
          setSiteBySectionList(dataArr.concat(res.data.result));
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

  const handleLoadMore = () => {
    if (!isLoading && siteBySectionListLength >= 10 && !pegination) {
      const nextPage = page + 1;
      setPage(nextPage);
      setPegination(true);
      fetchSectionData(nextPage, searchText);
    }
  };

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (siteBySectionListLength >= 10 && pegination) {
      return (
        <ActivityIndicator style={{ color: themeColors.housingPrimary }} />
      );
    }
  };

  const getObservation = (count, filter) => {
    const obj = {
      id: site_id,
      type: "site",
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

  // observation pull to refresh
  const onRefreshObservation = () => {
    // setRefreshing(true);
    setIsLoading(true);
    setObservPage(1);
    getObservation(1, filterData);
    fetchSiteDetails();
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

  const navigateCom = () => {
    dispatch(removeAnimalMovementData());
    dispatch(setMedicalEnclosure([]));
    dispatch(setMedicalAnimal([]));
    dispatch(setMedicalSection([]));
    dispatch(setMedicalSite([]));
    navigation.navigate("Observation", {
      SiteEntity: siteDetailsData,
      onGoBackData: handleBackFromObservationScreen,
    });
  };
  const handleBackFromObservationScreen = (data) => {
    if (data === "observation") {
      ref.current?.jumpToTab("Notes");
    }
  };

  // this function is used for site wise permisssion user list

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setIsLoading(true);
  //     fetchUserWithExcessData(1);
  //     return () => {};
  //   }, [])
  // );
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

  const renderLoginHistoryFooter = () => {
    if (
      isLoading ||
      LoginHistoryCount == 0 ||
      LoginHistoryCount == totalLoginHistoryCount
    )
      return null;
    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
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
  const fetchUserWithExcessData = (page_count, searchText) => {
    const requestObj = {
      id: site_id,
      type: "site",
      page_no: page_count,
      search: searchText,
      id: site_id,
    };
    getHousingSiteUserAccessList(requestObj)
      .then((res) => {
        let dataArr = page_count == 1 ? [] : siteByInchargeList;
        if (res.data) {
          setSiteByInchargeListLength(res?.data?.result?.length);
          setSiteByInchargeList(dataArr.concat(res?.data?.result ?? []));
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

  const fetchMortalityData = (page_count) => {
    const requestObj = {
      site_id: site_id,
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
        setPegination(false);
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
  const handleLoadMoreIncharge = () => {
    if (!isLoading && siteByInchargeListLength >= 10 && !pegination) {
      const nextPage = inchargePage + 1;
      setInchargePage(nextPage);
      setPegination(true);
      fetchUserWithExcessData(nextPage, searchText);
    }
  };
  const renderFooterIncharge = () => {
    if (pegination && siteByInchargeListLength >= 10) {
      return (
        <ActivityIndicator style={{ color: themeColors.housingPrimary }} />
      );
    }
  };

  // {// this function is used for site wise species list}

  const fetchTeams = (page_count, user_type) => {
    const requestObj = {
      site_id: site_id,
      user_type: user_type,
    };
    getListOfTeams(requestObj)
      .then((res) => {
        let dataArr = page_count == 1 ? [] : teamList;
        if (res?.data) {
          setTeamListCount(res?.data?.count);
          setTeamList(dataArr.concat(res?.data));
          setApproverList(res?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
        setPegination(false);
      });
  };

  // const fetchTransferList = (page_count) => {
  //   const requestObj = {
  //     site_id: site_id,
  //     page_no: page_count,
  //     filter_type: transferFilter,
  //   };
  //   getTransferListbySite(requestObj)
  //     .then((res) => {
  //       let dataArr = page_count == 1 ? [] : transferDataList;
  //       if (res?.data) {
  //         setTransferDataListCount(res?.data?.total_count);
  //         setTransferDataList(dataArr.concat(res?.data?.result));
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // };

  const fetchTransferList = (pageNo) => {
    let obj = {
      site_id: site_id,
      page_no: pageNo,
      filter_type: transferFilter,
      transfer_type: innerTab,
    };

    getTransferListbySite(obj)
      .then((response) => {
        setIsLoading(false);

        if (response.success) {
          let dataArr = pageNo == 1 ? [] : transferDataList;
          setTransferDataListCount(
            response.data.total_count === undefined
              ? 0
              : response.data.total_count
          );
          if (response.data) {
            if (response.data.result) {
              dataArr = dataArr.concat(response.data.result);
            }
            setTransferDataList(dataArr);
            setTransferDataLength(dataArr.length);
            setIsLoading(false);
          }
        } else {
          setTransferDataLength(transferDataListCount);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      })
      .finally(() => {
        setRefreshing(false);
        setIsLoading(false);
        setMoreTransferLoading(false);
        setPegination(false);
      });
  };

  const fetchHousingInChargesList = () => {
    setIsLoading(true);
    const requestObj = {
      ref_id: site_id,
      ref_type: "site",
    };
    getHousingInChargesList(requestObj)
      .then((data) => {
        setInChargeSiteList(data?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
        setPegination(false);
      });
  };

  const handleLoadMoreTransfer = () => {
    if (
      !isLoading &&
      !moreTransferLoading &&
      transferDataLength >= 15 &&
      transferDataLength != transferDataListCount
    ) {
      setMoreTransferLoading(true);
      const nextPage = transferDataListPage + 1;
      setTransferDataListPage(nextPage);
      //   setIsLoading(true);
      fetchTransferList(nextPage);
    }
  };

  const renderFooterTransfer = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (
      isLoading ||
      transferDataLength < 15 ||
      transferDataLength == transferDataListCount
    ) {
      return null;
    }
    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };

  const addMembers = (users) => {
    setIsLoading(true);
    const requestObj = {
      site_id: site_id,
      user_id: JSON.stringify(users?.map((i) => i.user_id)),
      user_type: userType,
    };
    addTeamMembers(requestObj)
      .then((res) => {
        dispatch(removeAnimalMovementData());
        setApproverList([]);
        console.log({ res, requestObj });
        if (res?.success) {
          showToast("success", "Transfer Members Added Successfully");
        } else {
          errorToast("success", res?.message);
          setIsLoading(false);
        }
        setIsAddMember(false);
        fetchTeams(1, userType);
      })
      .catch((err) => {
        console.log(err);
        errorToast("success", JSON.stringify(err));
        setIsLoading(false);
      })
      .finally(() => setIsAddMember(false));
  };

  const addSiteIncharge = (users) => {
    setIsLoading(true);
    const requestObj = {
      ref_id: site_id,
      ref_type: "site",
      user_id: users?.map((i) => i.user_id).join(","),
    };

    addHousingInChargeMember(requestObj)
      .then((res) => {
        dispatch(removeAnimalMovementData());
        if (res?.success) {
          showToast("success", res?.message);
        } else {
          errorToast("success", res?.message);
        }
        setIsAddSiteInCharge(false);
        fetchHousingInChargesList();
      })
      .catch((err) => {
        console.log(err);
        errorToast("success", JSON.stringify(err));
        setIsLoading(false);
      })
      .finally(() => setIsLoading(false));
  };

  const handlePerformAction = (user) => {
    setIsLoading(true);
    const requestObj = {
      site_id: site_id,
      user_id: user.user_id,
      can_perform_action: Number(!Boolean(Number(user.can_perform_action))),
      user_type: userType,
    };
    updateApprovalPermission(requestObj)
      .then((res) => {
        if (!res?.success) {
          setIsLoading(false);
          errorToast("success", res?.message);
        } else {
          showToast("success", res?.message);
        }
        fetchTeams(1, userType);
      })
      .catch((err) => {
        errorToast("error", JSON.stringify(err));
        setIsLoading(false);
      });
  };

  const handleRemove = (user) => {
    setIsLoading(true);
    const requestObj = {
      site_id: site_id,
      user_id: user.user_id,
      user_type: userType,
    };
    removeMembers(requestObj)
      .then((res) => {
        if (!res?.success) {
          errorToast("success", res?.message);
          setIsLoading(false);
        }
        fetchTeams(1, userType);
      })
      .catch((err) => {
        console.log(err);
        errorToast("success", JSON.stringify(err));
        setIsLoading(false);
      });
  };

  const treatmentDataLoad = (count, searchText) => {
    getSiteWiseAnimalsTreatment({
      site_id: site_id,
      page_no: count,
      q: searchText,
    })
      .then((response) => {
        if (response.success) {
          let dataArray = count == 1 ? [] : treatmentData;
          setTreatmentDataCount(
            response?.data?.total_count === undefined
              ? 0
              : response?.data?.total_count
          );

          if (response?.data) {
            if (response.data.result) {
              dataArray = dataArray.concat(response?.data.result);
            }
            setTreatmentData(dataArray);
            setTreatmentLength(dataArray.length);
          } else {
            setTreatmentLength(treatmentDataCount);
          }
        }
      })
      .catch((err) => {
        console.log({ err });
        setIsLoading(false);
        setSearchLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
        setTreatmentLoading(false);
        setSearchLoading(false);
        setRefreshing(false);
        setPegination(false);
      });
  };

  //pagination for the Animals Under Treatment

  const TreatmentHandleLoadMore = () => {
    if (
      !isLoading &&
      !pegination &&
      treatmentLength >= 10 &&
      treatmentLength != treatmentDataCount
    ) {
      const NextPage = treatmentPage + 1;
      setPegination(true);
      setTreatmentPage(NextPage);
      treatmentDataLoad(NextPage, searchText);
    }
  };

  const TreatmentRenderFooter = () => {
    if (pegination && treatmentLength >= 10) {
      return (
        <ActivityIndicator style={{ color: themeColors.housingPrimary }} />
      );
    }
  };

  const fetchSiteSpeciesData = (page_count) => {
    const requestObj = {
      site_id: site_id,
      page_no: page_count,
    };
    getHousingSiteSpeciesList(requestObj)
      .then((res) => {
        let dataArr = page_count == 1 ? [] : siteBySpeciesList;
        if (res?.data.result) {
          setSpeciesCount(res?.data?.count);
          // setSiteBySpeciesListLength(res.data.result.length);
          setSiteBySpeciesList(dataArr.concat(res?.data?.result));
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleLoadMoreSpecies = () => {
    if (
      !isLoading &&
      siteBySpeciesList?.length >= 10 &&
      siteBySpeciesList?.length != speciesCount
    ) {
      const nextPage = SpeciesPage + 1;
      setSpeciesPage(nextPage);
      fetchSiteSpeciesData(nextPage);
    }
  };

  const renderFooterSpecies = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (
      isLoading ||
      siteBySpeciesList?.length == speciesCount ||
      siteBySpeciesList?.length < 10
    )
      return null;
    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };

  const handleLoadMoreTeams = () => {
    if (
      !isLoading &&
      teamList?.length >= 10 &&
      teamList?.length != teamListCount
    ) {
      const nextPage = teamListPage + 1;
      setTeamListPage(nextPage);
      fetchTeams(nextPage, userType);
    }
  };

  const renderFooterTeams = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (isLoading || teamList?.length == teamListCount || teamList?.length < 10)
      return null;
    return <ActivityIndicator style={{ color: themeColors.housingPrimary }} />;
  };

  // This function is used for site incharge calling
  const openMessagingApp = (data) => {
    let phoneNumber = typeof data !== "undefined" ? data : null;

    if (phoneNumber !== null) {
      contactFun("sms", phoneNumber);
    }
  };
  const makePhoneCall = (data) => {
    let phoneNumber = typeof data !== "undefined" ? data : null;

    if (phoneNumber !== null) {
      contactFun("tel", phoneNumber);
    }
  };

  const [tabMedia, setTabMedia] = useState("images");
  const [selectedImages, setSelectedImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [status, setStatus] = useState({});
  const [isRestricted, setIsResticted] = useState(false);
  const [state, setState] = React.useState({ open: false });
  const video = React.useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const onStateChange = ({ open }) => setState({ open });
  const [bottomTitle, setBottomTitle] = useState("");
  const [type, setType] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState("");
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
  const changeMediaInnerName = (data) => {
    setMediaTabName(data);
  };
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
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
    getDocs("site", site_id, count, type_of)
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
        setRefreshing(false);
        // errorToast("Error", "Something went wrong!");
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
      ref_id: site_id ?? 0,
      ref_type: "site",
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
          changeMediaInnerName("images");
          GetDocsData(1, "images");
        } else if (selectedItems[0]?.type == "application/pdf") {
          ref.current?.jumpToTab("documents");
          changeMediaInnerName("documents");
          GetDocsData(1, "documents");
        } else if (selectedItems[0]?.type == "video/mp4") {
          ref.current?.jumpToTab("videos");
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
  const { open } = state;

  const onStatsPress = (item) => {
    if (item === "Animals") {
      animalsListModalRef?.current?.present();
      setIsAnimalsListModalVisible(true);
    } else if (item === "Species") {
      ref.current?.jumpToTab("Occupants");
    } else {
      ref.current?.jumpToTab(item);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSectionData(1, searchText);
    fetchSiteDetails();
  };

  const onRefreshTransfer = () => {
    setRefreshing(true);
    fetchTransferList(1);
    fetchSiteDetails();
  };

  const onRefreshTeam = () => {
    setRefreshing(true);
    fetchTeams(1, "transfer_user");
    fetchSiteDetails();
  };

  const onRefreshSecurityTeam = () => {
    setRefreshing(true);
    fetchTeams(1, "security");
    fetchSiteDetails();
  };

  const onRefreshPermission = () => {
    setRefreshing(true);
    fetchUserWithExcessData(1, "");
  };

  const onRefreshMortality = () => {
    setRefreshing(true);
    fetchMortalityData(1);
    fetchSiteDetails();
  };

  const onRefreshTreatment = () => {
    setRefreshing(true);
    treatmentDataLoad(1, "");
    fetchSiteDetails();
  };

  const onRefreshSiteIncharge = () => {
    setRefreshing(true);
    fetchHousingInChargesList();
    fetchSiteDetails();
  };
  const onRefreshMedical = () => {
    setRefreshing(true);
    medicalCountFilterStats();
    fetchSiteDetails();
  };
  const onRefreshDocuments = () => {
    setRefreshing(true);
    setPage(1);
    GetDocsData(1, "documents");
    fetchSiteDetails();
  };
  const onRefreshVideos = () => {
    setRefreshing(true);
    GetDocsData(1, "videos");
    fetchSiteDetails();
  };
  const onRefreshImage = () => {
    setRefreshing(true);
    GetDocsData(1, "images");
    fetchSiteDetails();
  };
  const onRefreshIncharge = () => {
    setRefreshing(true);
    fetchUserWithExcessData(1, searchText);
    fetchSiteDetails();
  };

  const deleteSiteMedia = (item) => {
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
    <>
      <View style={reduxColors.masterContainer}>
        <Loader visible={isLoading} />
        <AppBar
          header={header}
          reduxColors={themeColors}
          style={[
            header
              ? { backgroundColor: themeColors.onPrimary }
              : { backgroundColor: "transparent" },
            { position: "absolute", top: 0, width: "100%", zIndex: 1 },
          ]}
          title={siteDetailsData?.site_name}
          siteDetailsData={siteDetailsData}
          permission={permission}
          onBackPress={() => {
            if (props?.route?.params?.mainScreen == "animalTransfers") {
              navigation.navigate("Home");
            } else {
              navigation.goBack();
            }
          }}
        />
        <Tabs.Container
          ref={ref}
          pagerProps={{ scrollEnabled: false }}
          defaultIndex={2}
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
                style={[styles.headerContainer]}
                navigation={navigation}
                themeColors={themeColors}
                tabBarBorderRadius={tabBarBorderRadius}
                reduxColors={reduxColors}
                getScrollPositionOfTabs={getScrollPositionOfTabs}
                getHeaderHeight={getHeaderHeight}
                siteDetailsData={siteDetailsData}
                openMessagingApp={openMessagingApp}
                makePhoneCall={makePhoneCall}
                permission={permission}
                isHideStats={isHideStats}
                onStatsPress={onStatsPress}
              />
            );
          }}
          headerContainerStyle={{
            backgroundColor: "transparent",
            shadowOpacity: 0,
          }}
          minHeaderHeight={minimumHeaderHeight}
          onTabChange={(tab) => {
            TAB_HEADER_ITEMS.forEach((e, i) => {
              if (e.title == tab.tabName) {
                setScreenName(e.screen);
                setPrevScreenName(tab.prevTabName);
              }
            });
          }}
        >
          {TAB_HEADER_ITEMS.map((item) => {
            if (
              !permission["collection_animal_records"] &&
              item.screen == "species"
            ) {
              return null;
            }
            if (
              !permission["access_mortality_module"] &&
              item.screen == "Mortality"
            ) {
              return null;
            }
            if (
              !permission["approval_move_animal_external"] &&
              item.screen == "animalTransfers"
            ) {
              return null;
            }
            return (
              <Tabs.Tab name={item.title} label={item.title} key={item.id}>
                <View
                  style={{
                    // top: -10,
                    paddingVertical:
                      item.screen === "animalTransfers" ||
                      item.screen === "teams"
                        ? 0
                        : Spacing.small,
                    height: "100%",
                  }}
                >
                  {item.screen === "section" ? (
                    <Section
                      style={styles.bodyContainer}
                      themeColors={themeColors}
                      reduxColors={reduxColors}
                      siteBySectionList={siteBySectionList}
                      searchText={searchText}
                      SearchAddText={SearchAddText}
                      SearchRemoveText={SearchRemoveText}
                      searchLoading={searchLoading}
                      handleLoadMore={handleLoadMore}
                      renderFooter={renderFooter}
                      onRefresh={onRefresh}
                      refreshing={refreshing}
                      permission={permission}
                      isHideStats={isHideStats}
                      loading={isLoading}
                    />
                  ) : item.screen === "animalTransfers" ? (
                    <AnimalTransferScreen
                      themeColors={themeColors}
                      reduxColors={reduxColors}
                      stylesSheet={stylesSheet}
                      teamList={teamList}
                      approverList={approverList}
                      handleLoadMoreTeams={handleLoadMoreTeams}
                      renderFooterTeams={renderFooterTeams}
                      handlePerformAction={handlePerformAction}
                      handleRemove={handleRemove}
                      transferDataList={transferDataList}
                      setInnerTab={handleSetInnerTab}
                      transferDataListCount={transferDataListCount}
                      setTransferFilter={setTransferFilter}
                      handleLoadMoreTransfer={handleLoadMoreTransfer}
                      renderFooterTransfer={renderFooterTransfer}
                      setUserType={setUserType}
                      site_id={site_id}
                      allAnimalCount={allAnimalCount}
                      allAnimalList={allAnimalList}
                      permission={permission}
                      default_sub_tab={props?.route?.params?.subScreen}
                      onRefreshTransfer={onRefreshTransfer}
                      refreshingTransfer={refreshing}
                      isLoading={isLoading}
                    />
                  ) : item.screen === "teams" ? (
                    <TeamList
                      themeColors={themeColors}
                      reduxColors={reduxColors}
                      stylesSheet={stylesSheet}
                      siteDetailsData={siteDetailsData}
                      loggedin_user_id={user_id}
                      teamList={teamList}
                      approverList={approverList}
                      handleLoadMoreTeams={handleLoadMoreTeams}
                      renderFooterTeams={renderFooterTeams}
                      handlePerformAction={handlePerformAction}
                      handleRemove={handleRemove}
                      transferDataList={transferDataList}
                      setInnerTabTeam={handleTeamInnerTab}
                      transferDataListCount={transferDataListCount}
                      setTransferFilter={setTransferFilter}
                      handleLoadMoreTransfer={handleLoadMoreTransfer}
                      renderFooterTransfer={renderFooterTransfer}
                      setUserType={setUserType}
                      setIsAddMember={setIsAddMember}
                      site_id={site_id}
                      allAnimalCount={allAnimalCount}
                      allAnimalList={allAnimalList}
                      permission={permission}
                      onRefreshTeam={onRefreshTeam}
                      refreshingTeam={refreshing}
                      onRefreshSecurityTeam={onRefreshSecurityTeam}
                      refreshingSecurityTeam={refreshing}
                      isLoading={isLoading}
                    />
                  ) : item.screen === "observation" ? (
                    <Observation
                      navigateCom={navigateCom}
                      navigation={navigation}
                      themeColors={themeColors}
                      sectionDetailsData={siteDetailsData}
                      observationdata={observationdata}
                      observhandleLoadMore={observhandleLoadMore}
                      observrenderFooter={observrenderFooter}
                      onRefresh={onRefreshObservation}
                      refreshing={refreshing}
                      loading={isLoading}
                      Items={Items}
                      fetchData={fetchData}
                      getSelectedData={getSelectedData}
                      selectedData={selectedData}
                      dispatch={dispatch}
                    />
                  ) : item.screen === "Enclosures" ? (
                    <EnclosuresList
                      type={"site"}
                      siteId={site_id}
                      permission={permission}
                      resetData={false}
                      isHideStats={isHideStats}
                      isFocused={screenName === "Enclosures"}
                      onEnclosurePress={(data) => {
                        navigation.navigate("OccupantScreen", {
                          enclosure_id: data?.enclosure_id ?? 0,
                          enclosure_name: data?.user_enclosure_name ?? "",
                          section_id: data?.section_id ?? "",
                          section_name: data?.section_name ?? "",
                        });
                      }}
                      onRefreshValue={true}
                      pullToRefresh={fetchSiteDetails}
                    />
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
                      TreatmentHandleLoadMore={TreatmentHandleLoadMore}
                      TreatmentRenderFooter={TreatmentRenderFooter}
                      onRefreshTreatment={onRefreshTreatment}
                      refreshingTreatment={refreshing}
                      loading={isLoading}
                    />
                  ) : item.screen === "species" ? (
                    <SpeciesList
                      searchbox={true}
                      type={"site"}
                      searchText={searchText}
                      resetData={false}
                      SearchAddText={SearchAddText}
                      SearchRemoveText={SearchRemoveText}
                      searchLoading={searchLoading}
                      siteId={site_id}
                      permission={permission}
                      isHideStats={isHideStats}
                      showHeader={false}
                      isFocused={screenName === "species"}
                      totalAnimals={shortenNumber(
                        siteDetailsData?.animal_count ?? 0
                      )}
                      onAnimalsPress={() => {
                        animalsListModalRef?.current?.present();
                        setIsAnimalsListModalVisible(true);
                      }}
                      onSpeciesPress={(data) => {
                        setSelectedSpecies(data);
                        animalsListModalRef?.current?.present();
                        setIsAnimalsListModalVisible(true);
                      }}
                      onRefreshValue={true}
                      pullToRefresh={fetchSiteDetails}
                    />
                  ) : item.screen === "config" ? (
                    <Config
                      themeColors={themeColors}
                      reduxColors={reduxColors}
                      stylesSheet={stylesSheet}
                      site_id={site_id}
                      user_id={user_id}
                      isFocused={screenName === "config"}
                      // tests={extractedChildTests}
                      fetchSiteDetails={fetchSiteDetails}
                    />
                  ) : item.screen === "permissions" ? (
                    <Permission
                      searchText={searchText}
                      SearchAddText={SearchAddText}
                      SearchRemoveText={SearchRemoveText}
                      searchLoading={searchLoading}
                      handleLoadMoreIncharge={handleLoadMoreIncharge}
                      renderFooterIncharge={renderFooterIncharge}
                      siteByInchargeList={siteByInchargeList}
                      themeColors={themeColors}
                      onRefreshIncharge={onRefreshIncharge}
                      refreshingPermission={refreshing}
                      loading={isLoading}
                      loginHistory={(item) => {
                        setIsLoading(true);
                        setPageHistory(1);
                        loginHistory(item, 1);
                      }}
                    />
                  ) : item.screen == "media" ? (
                    <Media
                      setIsLoading={setIsLoading}
                      setPage={setPage}
                      GetDocsData={GetDocsData}
                      setTabMedia={setTabMedia}
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
                      deleteMediaFun={deleteMediaFun}
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
                      deleteSiteMedia={deleteSiteMedia}
                      alertModalClose={alertModalClose}
                      bottomTitle={bottomTitle}
                      isModalVisible={isModalVisible}
                      firstButtonPress={firstButtonPress}
                      secondButtonPress={secondButtonPress}
                      inChargeSiteList={inChargeSiteList?.incharges ?? []}
                      onRefreshDocuments={onRefreshDocuments}
                      refreshingDocuments={refreshing}
                      onRefreshVideos={onRefreshVideos}
                      refreshingVideos={refreshing}
                      onRefreshImage={onRefreshImage}
                      refreshingImage={refreshing}
                      documentDelete={documentDelete}
                      deleteVideo={deleteVideo}
                    />
                  ) : item.screen == "incharges" ? (
                    <InChargesList
                      inChargeSiteList={inChargeSiteList}
                      themeColors={themeColors}
                      permission={permission}
                      approver={approver}
                      loggedin_user_id={user_id}
                      setIsAddSiteInCharge={setIsAddSiteInCharge}
                      onRefreshSiteIncharge={onRefreshSiteIncharge}
                      refreshingSiteIncharge={refreshing}
                      loading={isLoading}
                      site_id={site_id}
                    />
                  ) : item.screen == "medicalRecord" ? (
                    <MedicalRecordScreen
                      themeColors={themeColors}
                      medicalStatsCount={medicalStatsCount}
                      setDates={setDates}
                      startDate={startDate}
                      endDate={endDate}
                      selectDropID={selectDropID}
                      selectDropValue={selectDropValue}
                      site_id={site_id}
                      refreshing={refreshing}
                      onRefreshMedical={onRefreshMedical}
                    />
                  ) : null}
                </View>
              </Tabs.Tab>
            );
          })}
        </Tabs.Container>
      </View>

      <FAB.Group
        open={open}
        fabStyle={reduxColors.fabStyle}
        visible
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
            label: "Add Section",
            onPress: () => {
              checkPermissionAndNavigate(
                permission,
                "housing_add_section",
                navigation,
                "Section",
                {
                  item: siteDetailsData,
                }
              );
            },
          },
          {
            icon: "home",
            label: "Home",
            onPress: () => navigation.navigate("Home"),
            style: { marginBottom: Spacing.major + Spacing.minor },
            labelStyle: { marginBottom: Spacing.major + Spacing.minor },
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
          type={"site"}
          siteId={site_id}
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
    </>
  );
};

export default SiteDetails;

const Header = ({
  imageBackground,
  themeColors,
  tabBarBorderRadius,
  getHeaderHeight,
  getScrollPositionOfTabs,
  reduxColors,
  siteDetailsData,
  makePhoneCall,
  openMessagingApp,
  permission,
  isHideStats,
  onStatsPress,
}) => {
  const navigation = useNavigation();

  const { height } = useHeaderMeasurements();
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
  const backgroundImage = undefined;
  const [sliderImages, setSliderImages] = useState([]);

  useEffect(() => {
    if (siteDetailsData?.images) {
      const imageArray = siteDetailsData?.images?.filter(
        (item) =>
          // item?.display_type == "gallery"
          item?.display_type == "banner" // change gallery to banner image instructed by nidhin
      );

      const imageObjectsArray = imageArray.map((item) => ({ img: item.file }));

      setSliderImages(imageObjectsArray);
    }
  }, [siteDetailsData?.images]);
  // const backgroundImage = siteDetailsData?.images?.filter(
  //   (item) => item?.display_type == "gallery"
  // )[0]?.file;
  const overlayContent = (
    <View
      style={{
        justifyContent: "space-between",
      }}
    >
      <View>
        <Text style={reduxColors.siteTitleText}>{"SITE"}</Text>
        <Text
          style={[
            {
              color: themeColors.onPrimary,
            },
            FontSize.Antz_Major_Title,
          ]}
        >
          {LengthDecrease(42, siteDetailsData?.site_name ?? "NA")}
        </Text>
      </View>

      <View style={[reduxColors.inChargeBox]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            height: heightPercentageToDP(4),
            alignItems: "center",
            borderRadius: 5,
            borderWidth: 1,
            borderColor: themeColors?.outline,
            paddingHorizontal: widthPercentageToDP(2),
            backgroundColor: opacityColor(themeColors.neutralPrimary, 40),
          }}
        >
          <Ionicons
            name="person-outline"
            size={16}
            color={themeColors.onPrimary}
          />
          <Text
            style={[
              FontSize.Antz_Minor_Regular,
              {
                color: themeColors.onPrimary,
                paddingLeft: widthPercentageToDP(2),
              },
            ]}
          >
            {/* {siteDetailsData?.incharge_name
              ? siteDetailsData?.incharge_name
              : "NA"} */}

            {LengthDecrease(22, siteDetailsData?.incharge_name ?? "NA")}
          </Text>
        </View>
        {siteDetailsData?.incharge_mobile_no && (
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
            <MaterialIcons
              name="call"
              size={22}
              color={themeColors.primary}
              onPress={() =>
                makePhoneCall(
                  siteDetailsData.incharge_mobile_no
                    ? siteDetailsData.incharge_mobile_no
                    : siteDetailsData.site_incharge_number
                )
              }
            />
          </View>
        )}
        {siteDetailsData?.incharge_mobile_no && (
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
            <MaterialCommunityIcons
              name="message-text-outline"
              size={24}
              color={themeColors.primary}
              onPress={() =>
                openMessagingApp(
                  siteDetailsData.incharge_mobile_no
                    ? siteDetailsData.incharge_mobile_no
                    : siteDetailsData.site_incharge_number
                )
              }
            />
          </View>
        )}
      </View>
      {!isHideStats && permission["housing_view_insights"] && (
        <View style={{ marginTop: 16 }}>
          <SiteInsight
            style={{
              backgroundColor: opacityColor(themeColors.neutralPrimary, 40),
            }}
            cardNum={{ color: themeColors.primaryContainer }}
            animalCount={
              siteDetailsData?.animal_count
                ? shortenNumber(siteDetailsData?.animal_count)
                : 0
            }
            speciesCount={
              siteDetailsData?.species_count
                ? shortenNumber(siteDetailsData?.species_count)
                : 0
            }
            encCount={
              siteDetailsData?.enclosure_count
                ? shortenNumber(siteDetailsData?.enclosure_count)
                : 0
            }
            onStatsPress={onStatsPress}
          />
        </View>
      )}
    </View>
  );

  return (
    <>
      <View style={reduxColors.headerContainer}>
        <View style={{ backgroundColor: themeColors.onPrimaryContainer }}>
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
                  <View style={{}}>
                    <SliderComponent
                      screen={"siteDetails"}
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
              height: 18,
              backgroundColor: themeColors.onPrimary,
              borderTopLeftRadius: tabBarBorderRadius ? 0 : 40,
              borderTopRightRadius: tabBarBorderRadius ? 0 : 40,
              borderBottomColor: "transparent",
              borderBottomWidth: 6,
              zIndex: 1,
            }}
          ></Animated.View>
        </View>
      </View>
    </>
  );
};

const AppBar = ({
  header,
  style,
  title,
  siteDetailsData,
  permission,
  onBackPress,
  isHideStats,
}) => {
  const navigation = useNavigation();
  const moreOptionData = [{ id: 1, option: "Edit Site", screen: "EditSite" }];

  const optionPress = (item) => {
    if (siteDetailsData) {
      checkPermissionAndNavigate(
        permission,
        "add_sites",
        navigation,
        item.screen,
        { site: siteDetailsData }
      );
    }
  };
  return (
    <>
      <AnimatedHeader
        optionData={moreOptionData}
        optionPress={optionPress}
        title={title}
        style={style}
        header={header}
        onBackPress={onBackPress}
      />
    </>
  );
};

const Section = ({
  searchLoading,
  SearchAddText,
  searchText,
  SearchRemoveText,
  siteBySectionList,
  handleLoadMore,
  renderFooter,
  themeColors,
  onRefresh,
  refreshing,
  permission,
  isHideStats,
  loading,
}) => {
  const navigation = useNavigation();
  return (
    <>
      <Tabs.FlatList
        data={siteBySectionList}
        keyExtractor={(item) => item.section_id}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.4}
        style={{
          paddingVertical: Spacing.mini,
          backgroundColor: themeColors.surfaceVariant,
        }}
        ListHeaderComponent={
          <>
            <View
              style={{
                paddingLeft: Spacing.minor,
                paddingRight: Spacing.minor,
              }}
            >
              <HousingSearchBox
                value={searchText}
                onChangeText={(e) => SearchAddText(e)}
                onClearPress={() => SearchRemoveText()}
                loading={searchLoading}
              />
            </View>
          </>
        }
        renderItem={({ item }) => {
          return (
            <CustomSiteCard
              title={item.section_name}
              incharge={item.incharge_name ? item.incharge_name : "NA"}
              animalCount={shortenNumber(item.animal_count)}
              speciesCount={shortenNumber(item.species_count)}
              encCount={shortenNumber(item.enclosure_count)}
              InchargePhoneNumber={item.incharge_phone_number}
              images={item.images}
              permission={permission}
              isHideStats={isHideStats}
              onPress={() =>
                navigation.navigate("HousingEnclosuer", {
                  section_id: item?.section_id ?? 0,
                  sectiondata: item,
                  incharge_name: item.incharge_name ? item.incharge_name : "NA",
                })
              }
            />
          );
        }}
        ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
        onEndReached={handleLoadMore}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            style={{ color: themeColors.blueBg }}
            enabled={true}
          />
        }
      ></Tabs.FlatList>
    </>
  );
};

const Species = ({
  siteBySpeciesList,
  site_id,
  handleLoadMoreSpecies,
  renderFooterSpecies,
  themeColors,
  permission,
  loading,
}) => {
  const navigation = useNavigation();
  return (
    <>
      <Tabs.FlatList
        data={siteBySpeciesList}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        style={{
          paddingHorizontal: Spacing.minor,
          backgroundColor: themeColors.surfaceVariant,
          paddingVertical: Spacing.mini,
        }}
        scrollToOverflowEnabled={true}
        renderItem={({ item }) => (
          <SpeciesCustomCard
            icon={item.default_icon}
            animalName={item.species_name ? item?.species_name : "NA"}
            complete_name={item.common_name ? item.common_name : "NA"}
            tags={permission["housing_view_insights"] ? item.sex_data : null}
            count={
              permission["housing_view_insights"] ? item.animal_count : null
            }
            onPress={() => {
              navigation.navigate("SpeciesDetails", {
                title: item?.common_name,
                subtitle: item.complete_name,
                tags: item.sex_data,
                tsn_id: item.taxonomy_id ? item.taxonomy_id : item.tsn_id,
                icon: item.default_icon,
                site_id: site_id,
              });
            }}
          />
        )}
        ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
        onEndReached={handleLoadMoreSpecies}
        onEndReachedThreshold={0.4}
        ListFooterComponent={renderFooterSpecies}
      />
    </>
  );
};

const AnimalTransferScreen = ({
  reduxColors,
  themeColors,
  default_sub_tab,
  transferDataList,
  setInnerTab,
  transferDataListCount,
  setTransferFilter,
  handleLoadMoreTransfer,
  renderFooterTransfer,
  site_id,
  permission,
  onRefreshTransfer,
  refreshingTransfer,
  isLoading,
}) => {
  const [screen, setScreen] = useState("intra");
  const [isEditScreen, setIsEditScreen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (default_sub_tab) {
      setInnerTab(default_sub_tab);
      setScreen(default_sub_tab);
    }
  }, [default_sub_tab]);

  return (
    <>
      <View style={{ backgroundColor: themeColors.surfaceVariant, flex: 1 }}>
        <TransferList
          themeColors={themeColors}
          transferDataList={transferDataList}
          transferDataListCount={transferDataListCount}
          setTransferFilter={setTransferFilter}
          handleLoadMoreTransfer={handleLoadMoreTransfer}
          renderFooterTransfer={renderFooterTransfer}
          site_id={site_id}
          default_sub_tab={default_sub_tab}
          reduxColors={reduxColors}
          setInnerTab={setInnerTab}
          permission={permission}
          onRefreshTransfer={onRefreshTransfer}
          refreshingTransfer={refreshingTransfer}
          loading={isLoading}
        />
      </View>
      {permission["add_sites"] &&
        (screen === "team" || screen === "securityTeam") && (
          <View
            style={{
              backgroundColor: themeColors.onPrimary,
              paddingBottom: 10,
              justifyContent: "center",
            }}
          >
            {isEditScreen ? (
              <TouchableOpacity
                style={reduxColors.btnBg}
                onPress={() => {
                  showToast("success", "Team members updated");
                  setIsEditScreen(false);
                }}
              >
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Title.fontSize,
                    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                    color: themeColors.onPrimary,
                  }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  alignItems: "center",
                  marginBottom: 10,
                  paddingTop: 15,
                }}
                onPress={() => {
                  setIsEditScreen(true);
                }}
              >
                <Octicons
                  name="pencil"
                  size={20}
                  color={themeColors.editIconColor}
                />
                <Text
                  style={{
                    fontWeight: FontSize.Antz_Subtext_Medium.fontWeight,
                    color: themeColors.onSurfaceVariant,
                    fontSize: FontSize.Antz_Subtext_Medium.fontSize,
                  }}
                >
                  Edit List
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
    </>
  );
};

const AnimalTransfers = ({
  reduxColors,
  themeColors,
  default_sub_tab,
  transferDataList,
  setInnerTab,
  transferDataListCount,
  setTransferFilter,
  handleLoadMoreTransfer,
  renderFooterTransfer,
  site_id,
  permission,
  isLoading,
}) => {
  const TAB_HEADER_ITEMS = [
    {
      id: "3",
      title: "In-house",
      screen: "intra",
      icon: move_down,
      icon1: move_down_white,
    },
    {
      id: "2",
      title: "Inter-site",
      screen: "inter",
      icon: compare_arrow,
      icon1: compare_arrow_white,
    },
    {
      id: "1",
      title: "External",
      screen: "external",
      icon: moved_location,
      icon1: moved_location_white,
    },
  ];
  const [screen, setScreen] = useState("intra");
  const [isEditScreen, setIsEditScreen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (default_sub_tab) {
      setInnerTab(default_sub_tab);
      setScreen(default_sub_tab);
    }
  }, [default_sub_tab]);
  const Item = ({ title, screenName, icon, icon1 }) => (
    <TouchableOpacity
      style={[
        {
          paddingHorizontal: Spacing.body,
          paddingVertical: Spacing.small,
          marginHorizontal: Spacing.mini,
          marginBottom: Spacing.small,
          borderWidth: 1,
          borderColor: themeColors?.outline,
          borderRadius: 8,
          backgroundColor:
            screenName === screen
              ? themeColors?.onPrimaryContainer
              : themeColors?.onPrimary,
        },
      ]}
      onPress={() => {
        setScreen(screenName);
        setInnerTab(screenName);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: Spacing.mini,
        }}
      >
        <View style={reduxColors.AvtarImage}>
          <View style={reduxColors.imgStyle}>
            <SvgXml
              xml={screenName === screen ? icon1 : icon}
              height={23}
              width={23}
              style={[reduxColors.image]}
            />
          </View>
        </View>
        <Text
          style={[
            FontSize?.Antz_Body_Regular,
            {
              color:
                screenName === screen
                  ? themeColors?.onPrimary
                  : themeColors?.onPrimaryContainer,
              marginLeft: Spacing.mini,
            },
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
        style={{ backgroundColor: themeColors.surfaceVariant }}
      >
        <View style={{ backgroundColor: themeColors.surfaceVariant }}>
          <View
            style={[
              reduxColors.tabHeaderWrapper,
              { alignItems: "center", paddingTop: Spacing.small },
            ]}
          >
            <FlatList
              style={reduxColors.tabHeader}
              data={TAB_HEADER_ITEMS}
              renderItem={({ item }) => (
                <Item
                  title={item.title}
                  screenName={item.screen}
                  key={item.id}
                  icon={item?.icon}
                  icon1={item?.icon1}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View
            style={[
              reduxColors.tabBody,
              { backgroundColor: themeColors.surfaceVariant },
            ]}
          >
            <Transfers
              themeColors={themeColors}
              transferDataList={transferDataList}
              transferDataListCount={transferDataListCount}
              setTransferFilter={setTransferFilter}
              handleLoadMoreTransfer={handleLoadMoreTransfer}
              renderFooterTransfer={renderFooterTransfer}
              site_id={site_id}
              loading={isLoading}
            />
          </View>
        </View>
      </Tabs.ScrollView>
      {permission["add_sites"] &&
        (screen === "team" || screen === "securityTeam") && (
          <View
            style={{
              backgroundColor: themeColors.onPrimary,
              paddingBottom: 10,
              justifyContent: "center",
            }}
          >
            {isEditScreen ? (
              <TouchableOpacity
                style={reduxColors.btnBg}
                onPress={() => {
                  showToast("success", "Team members updated");
                  setIsEditScreen(false);
                }}
              >
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Title.fontSize,
                    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                    color: themeColors.onPrimary,
                  }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  alignItems: "center",
                  marginBottom: 10,
                  paddingTop: 15,
                }}
                onPress={() => {
                  setIsEditScreen(true);
                }}
              >
                <Octicons
                  name="pencil"
                  size={20}
                  color={themeColors.editIconColor}
                />
                <Text
                  style={{
                    fontWeight: FontSize.Antz_Subtext_Medium.fontWeight,
                    color: themeColors.onSurfaceVariant,
                    fontSize: FontSize.Antz_Subtext_Medium.fontSize,
                  }}
                >
                  Edit List
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
    </>
  );
};
const TeamList = ({
  reduxColors,
  themeColors,
  default_sub_tab,
  siteDetailsData,
  loggedin_user_id,
  stylesSheet,
  teamList,
  approverList,
  handlePerformAction,
  handleRemove,
  setInnerTabTeam,
  setUserType,
  setIsAddMember,
  permission,
  onRefreshTeam,
  refreshingTeam,
  refreshingSecurityTeam,
  onRefreshSecurityTeam,
  site_id,
  isLoading,
}) => {
  const TAB_HEADER_ITEMS = [
    {
      id: "1",
      title: "Transfer Team",
      screen: "team",
    },
    {
      id: "2",
      title: "Security Team",
      screen: "securityTeam",
    },
  ];
  const [screen, setScreen] = useState("team");
  const [isEditScreen, setIsEditScreen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (default_sub_tab) {
      setInnerTabTeam(default_sub_tab);
      setScreen(default_sub_tab);
    }
  }, [default_sub_tab]);

  useEffect(() => {
    if (teamList?.length == 0) {
      setIsEditScreen(false);
    }
  }, [teamList]);

  const Item = ({ title, screenName }) => (
    <TouchableOpacity
      style={[
        {
          paddingVertical: Spacing.small,
          marginHorizontal: Spacing.minor,
        },
        screenName === screen
          ? { borderBottomColor: themeColors.primary, borderBottomWidth: 2 }
          : null,
      ]}
      onPress={() => {
        setScreen(screenName);
        setInnerTabTeam(screenName);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: Spacing.mini,
        }}
      >
        <Text
          style={[
            stylesSheet.labelStyle,
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
        style={{ backgroundColor: themeColors.surfaceVariant }}
      >
        <View style={{ backgroundColor: themeColors.surfaceVariant }}>
          <View
            style={[
              reduxColors.tabHeaderWrapper,
              { alignItems: "center", paddingTop: Spacing.small },
            ]}
          >
            <FlatList
              style={reduxColors.tabHeader}
              data={TAB_HEADER_ITEMS}
              renderItem={({ item }) => (
                <Item
                  title={item.title}
                  screenName={item.screen}
                  key={item.id}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View
            style={[
              reduxColors.tabBody,
              { backgroundColor: themeColors.surfaceVariant },
            ]}
          >
            {screen === "team" ? (
              <Team
                themeColors={themeColors}
                reduxColors={reduxColors}
                teamList={teamList}
                approverList={approverList}
                isEditScreen={isEditScreen}
                handlePerformAction={handlePerformAction}
                handleRemove={handleRemove}
                setUserType={setUserType}
                setIsAddMember={setIsAddMember}
                permission={permission}
                onRefreshTeam={onRefreshTeam}
                refreshingTeam={refreshingTeam}
                site_id={site_id}
                loggedin_user_id={loggedin_user_id}
                siteDetailsData={siteDetailsData}
                loading={isLoading}
              />
            ) : screen === "securityTeam" ? (
              <SecurityTeam
                themeColors={themeColors}
                reduxColors={reduxColors}
                teamList={teamList}
                approverList={approverList}
                isEditScreen={isEditScreen}
                handlePerformAction={handlePerformAction}
                handleRemove={handleRemove}
                setUserType={setUserType}
                setIsAddMember={setIsAddMember}
                permission={permission}
                onRefreshSecurityTeam={onRefreshSecurityTeam}
                refreshingSecurityTeam={refreshingSecurityTeam}
                site_id={site_id}
                loggedin_user_id={loggedin_user_id}
                siteDetailsData={siteDetailsData}
                loading={isLoading}
              />
            ) : null}
          </View>
        </View>
      </Tabs.ScrollView>
      {teamList?.length > 0 &&
        (siteDetailsData?.site_incharge?.includes(loggedin_user_id) ||
          permission["add_sites"]) &&
        (screen === "team" || screen === "securityTeam") && (
          <View
            style={{
              backgroundColor: themeColors.onPrimary,
              paddingBottom: 10,
              justifyContent: "center",
            }}
          >
            {isEditScreen ? (
              <TouchableOpacity
                style={reduxColors.btnBg}
                onPress={() => {
                  showToast("success", "Team members updated");
                  setIsEditScreen(false);
                }}
              >
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Title.fontSize,
                    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                    color: themeColors.onPrimary,
                  }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  alignItems: "center",
                  marginBottom: 10,
                  paddingTop: 15,
                }}
                onPress={() => {
                  setIsEditScreen(true);
                }}
              >
                <Octicons
                  name="pencil"
                  size={20}
                  color={themeColors.editIconColor}
                />
                <Text
                  style={{
                    fontWeight: FontSize.Antz_Subtext_Medium.fontWeight,
                    color: themeColors.onSurfaceVariant,
                    fontSize: FontSize.Antz_Subtext_Medium.fontSize,
                  }}
                >
                  Edit List
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
    </>
  );
};

const Team = ({
  themeColors,
  reduxColors,
  teamList,
  approverList,
  siteDetailsData,
  loggedin_user_id,
  handlePerformAction,
  handleRemove,
  isEditScreen,
  setUserType,
  setIsAddMember,
  permission,
  refreshingTeam,
  onRefreshTeam,
  site_id,
  loading,
}) => {
  const navigation = useNavigation();
  return (
    <>
      <View
        style={{
          backgroundColor: themeColors.surfaceVariant,
          paddingHorizontal: Spacing.minor,
          marginBottom: Spacing.minor,
        }}
      >
        {isEditScreen ? (
          <FlatList
            data={teamList}
            renderItem={({ item }) => (
              <UserCustomCard
                item={item}
                handleRemove={handleRemove}
                isPermission={Boolean(Number(item.can_perform_action))}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <>
            {(siteDetailsData?.site_incharge?.includes(loggedin_user_id) ||
              permission["add_sites"]) && (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: heightPercentageToDP(2),
                  height: heightPercentageToDP(6),
                  borderRadius: 8,
                  // backgroundColor: themeColors.secondaryContainer,
                  backgroundColor: themeColors.secondary,
                }}
                onPress={() => {
                  navigation.navigate("InchargeAndApproverSelect", {
                    selectedInchargeIds: approverList.map(
                      (item) => item.user_id
                    ),
                    inchargeDetailsData: approverList,
                    screen: "addMember",
                    type: "transfer",
                    site_id: site_id,
                  });
                  setUserType("transfer_user");
                  setIsAddMember(true);
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
                  Add Transfer Members
                </Text>
              </TouchableOpacity>
            )}
            {teamList && teamList?.length > 0 ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingTop: Spacing.minor,
                    paddingBottom: Spacing.small,
                  }}
                >
                  <MaterialCommunityIcons
                    // name="star-circle-outline"
                    name="star-circle"
                    size={28}
                    color={themeColors.moderateSecondary}
                  />
                  <Text
                    style={{
                      marginLeft: Spacing.mini,
                      fontSize: FontSize.Antz_Medium_Medium_btn.fontSize,
                      fontWeight: FontSize.weight400,
                      color: themeColors.onSecondaryContainer,
                    }}
                  >
                    Permission to Approve
                  </Text>
                </View>
                <FlatList
                  data={teamList.map((a) => {
                    return {
                      ...a,
                      can_perform_action: Boolean(Number(a.can_perform_action)),
                    };
                  })}
                  renderItem={({ item }) => (
                    <UserCustomCard
                      item={item}
                      handleToggle={
                        siteDetailsData?.site_incharge?.includes(
                          loggedin_user_id
                        ) || permission["add_sites"]
                          ? handlePerformAction
                          : undefined
                      }
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshingTeam}
                      onRefresh={onRefreshTeam}
                      style={{ color: themeColors.blueBg }}
                      enabled={true}
                    />
                  }
                />
              </>
            ) : (
              <ListEmpty visible={loading} />
            )}
          </>
        )}
      </View>
    </>
  );
};

const SecurityTeam = ({
  themeColors,
  reduxColors,
  teamList,
  approverList,
  handlePerformAction,
  siteDetailsData,
  loggedin_user_id,
  handleRemove,
  isEditScreen,
  setUserType,
  setIsAddMember,
  permission,
  onRefreshSecurityTeam,
  refreshingSecurityTeam,
  site_id,
  loading,
}) => {
  const navigation = useNavigation();
  return (
    <>
      <View
        style={{
          backgroundColor: themeColors.surfaceVariant,
          paddingHorizontal: Spacing.small,
          marginBottom: Spacing.small,
        }}
      >
        {isEditScreen ? (
          <FlatList
            data={teamList}
            renderItem={({ item }) => (
              <UserCustomCard
                item={item}
                handleRemove={handleRemove}
                isPermission={Boolean(Number(item.can_perform_action))}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <>
            {(siteDetailsData?.site_incharge?.includes(loggedin_user_id) ||
              permission["add_sites"]) && (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: heightPercentageToDP(2),
                  height: heightPercentageToDP(6),
                  borderRadius: 8,
                  // backgroundColor: themeColors.secondaryContainer,
                  backgroundColor: themeColors.secondary,
                }}
                onPress={() => {
                  navigation.navigate("InchargeAndApproverSelect", {
                    selectedInchargeIds: approverList.map(
                      (item) => item.user_id
                    ),
                    inchargeDetailsData: approverList,
                    screen: "addMember",
                    type: "security",
                    site_id: site_id,
                  });
                  setUserType("security");
                  setIsAddMember(true);
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
                  Add Security Members
                </Text>
              </TouchableOpacity>
            )}
            {teamList && teamList?.length > 0 ? (
              <>
                {/* <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingTop: Spacing.minor,
                    paddingBottom: Spacing.small,
                  }}
                >
                  <MaterialCommunityIcons
                    name="star-circle-outline"
                    size={28}
                    color={themeColors.onSurfaceVariant}
                  />
                  <Text
                    style={{
                      marginLeft: Spacing.mini,
                      fontSize: FontSize.Antz_Medium_Medium_btn.fontSize,
                      fontWeight: FontSize.weight400,
                      color: themeColors.onSecondaryContainer,
                    }}
                  >
                    Permission to Approve
                  </Text>
                </View> */}
                <FlatList
                  data={teamList.map((a) => {
                    return {
                      ...a,
                      can_perform_action: Boolean(Number(a.can_perform_action)),
                    };
                  })}
                  renderItem={({ item }) => <UserCustomCard item={item} />}
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshingSecurityTeam}
                      onRefresh={onRefreshSecurityTeam}
                      style={{ color: themeColors.blueBg }}
                      enabled={true}
                    />
                  }
                />
              </>
            ) : (
              <ListEmpty visible={loading} />
            )}
          </>
        )}
      </View>
    </>
  );
};

const Observation = ({
  navigateCom,
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

  // const navigateCom = () => {
  //   dispatch(removeAnimalMovementData());
  //   dispatch(setMedicalEnclosure([]));
  //   dispatch(setMedicalAnimal([]));
  //   dispatch(setMedicalSection([]));
  //   dispatch(setMedicalSite([]));
  //   navigation.navigate("Observation", {
  //     sectionDetailsData: sectionDetailsData,
  //   });
  // };
  return (
    <>
      <Tabs.FlatList
        data={newData}
        showsVerticalScrollIndicator={false}
        style={{
          paddingLeft: Spacing.minor,
          paddingRight: Spacing.minor,
          marginBottom: Spacing.small,
          backgroundColor: themeColors.surfaceVariant,
        }}
        ListHeaderComponent={
          <>
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

const TransferList = ({
  themeColors,
  transferDataList,
  transferDataListCount,
  setTransferFilter,
  handleLoadMoreTransfer,
  renderFooterTransfer,
  site_id,
  default_sub_tab,
  reduxColors,
  permission,
  setInnerTab,
  onRefreshTransfer,
  refreshingTransfer,
  loading,
}) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [selectDrop, setSelectDrop] = useState(TRANSFER_STATUS[0].name);
  const [observationModal, setObservationModal] = useState(false);
  const [selectedCheckBox, setSelectedCheckBox] = useState(
    TRANSFER_STATUS[0].id
  );
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [Items, setItems] = useState([]);

  const togglePrintModal = () => {
    setObservationModal(!observationModal);
  };
  const closePrintModal = () => {
    setObservationModal(false);
  };
  const isSelectedId = (id) => {
    return selectedCheckBox == id;
  };

  const closeMenu = (item) => {
    setSelectedCheckBox(item.id);
    setSelectDrop(item.name);
    setTransferFilter(item.value);
    closePrintModal();
  };

  const getSelectedData = (item) => {
    setSelectedData(item);
  };

  const TAB_HEADER_ITEMS = [
    {
      id: "3",
      title: "In-house",
      screen: "intra",
      icon: move_down,
      icon1: move_down_white,
    },
    {
      id: "2",
      title: "Inter-site",
      screen: "inter",
      icon: compare_arrow,
      icon1: compare_arrow_white,
    },
    {
      id: "1",
      title: "External",
      screen: "external",
      icon: moved_location,
      icon1: moved_location_white,
    },
  ];
  const [screen, setScreen] = useState("intra");
  const [isEditScreen, setIsEditScreen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (default_sub_tab) {
      setInnerTab(default_sub_tab);
      setScreen(default_sub_tab);
    }
  }, [default_sub_tab]);
  const Item = ({ title, screenName, icon, icon1 }) => (
    <TouchableOpacity
      style={[
        {
          paddingHorizontal: Spacing.body,
          paddingVertical: Spacing.small,
          marginHorizontal: Spacing.mini,
          marginBottom: Spacing.small,
          borderWidth: 1,
          borderColor: themeColors?.outline,
          borderRadius: 8,
          backgroundColor:
            screenName === screen
              ? themeColors?.onPrimaryContainer
              : themeColors?.onPrimary,
        },
      ]}
      onPress={() => {
        setScreen(screenName);
        setInnerTab(screenName);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: Spacing.mini,
        }}
      >
        <View style={reduxColors.AvtarImage}>
          <View style={reduxColors.imgStyle}>
            <SvgXml
              xml={screenName === screen ? icon1 : icon}
              height={23}
              width={23}
              style={[reduxColors.image]}
            />
          </View>
        </View>
        <Text
          style={[
            FontSize?.Antz_Body_Regular,
            {
              color:
                screenName === screen
                  ? themeColors?.onPrimary
                  : themeColors?.onPrimaryContainer,
              marginLeft: Spacing.mini,
            },
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Loader visible={isLoading} />
      <Tabs.FlatList
        data={transferDataList}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        scrollToOverflowEnabled={true}
        ListHeaderComponent={
          <>
            <View
              style={[
                reduxColors.tabHeaderWrapper,
                {
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  paddingTop: Spacing.small,
                  backgroundColor: themeColors?.background,
                },
              ]}
            >
              {TAB_HEADER_ITEMS.map((item) => (
                <Item
                  title={item.title}
                  screenName={item.screen}
                  key={item.id}
                  icon={item?.icon}
                  icon1={item?.icon1}
                />
              ))}
            </View>

            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: Spacing.minor,
                paddingHorizontal: Spacing.mini,
                paddingLeft: Spacing.minor,
                paddingRight: Spacing.minor,
                backgroundColor: themeColors?.surfaceVariant,
              }}
            >
              <Text
                style={{
                  color: constThemeColor.onPrimaryContainer,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                }}
              >
                {transferDataListCount} Transfers
              </Text>
              <ModalTitleData
                selectDrop={selectDrop}
                toggleModal={togglePrintModal}
                filterIconStyle={{ marginLeft: Spacing.small }}
                filterIcon={true}
                size={16}
              />
              {observationModal ? (
                <ModalFilterComponent
                  onPress={togglePrintModal}
                  onDismiss={closePrintModal}
                  onBackdropPress={closePrintModal}
                  onRequestClose={closePrintModal}
                  data={TRANSFER_STATUS}
                  closeModal={closeMenu}
                  title="Filter By"
                  style={{ alignItems: "flex-start" }}
                  isSelectedId={isSelectedId}
                  radioButton={true}
                />
              ) : null}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View
            style={{
              paddingLeft: Spacing.minor,
              paddingRight: Spacing.minor,
            }}
          >
            <TransferListCard
              item={item}
              site_id={site_id}
              onPress={() => {
                navigation.navigate("ApprovalSummary", {
                  animal_movement_id: item.animal_movement_id,
                  site_id: site_id,
                  screen: "site",
                });
              }}
            />
          </View>
        )}
        ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
        onEndReached={handleLoadMoreTransfer}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooterTransfer}
        refreshControl={
          <RefreshControl
            refreshing={refreshingTransfer}
            onRefresh={onRefreshTransfer}
            style={{ color: themeColors.blueBg }}
            enabled={true}
          />
        }
      />
    </>
  );
};

const Transfers = ({
  themeColors,
  transferDataList,
  transferDataListCount,
  setTransferFilter,
  handleLoadMoreTransfer,
  renderFooterTransfer,
  site_id,
  loading,
}) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [selectDrop, setSelectDrop] = useState(TRANSFER_STATUS[0].name);
  const [observationModal, setObservationModal] = useState(false);
  const [selectedCheckBox, setSelectedCheckBox] = useState(
    TRANSFER_STATUS[0].id
  );
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [Items, setItems] = useState([]);

  const togglePrintModal = () => {
    setObservationModal(!observationModal);
  };
  const closePrintModal = () => {
    setObservationModal(false);
  };
  const isSelectedId = (id) => {
    return selectedCheckBox == id;
  };

  const closeMenu = (item) => {
    setSelectedCheckBox(item.id);
    setSelectDrop(item.name);
    setTransferFilter(item.value);
    closePrintModal();
  };

  const getSelectedData = (item) => {
    setSelectedData(item);
  };

  return (
    <View
      style={{
        paddingHorizontal: Spacing.minor,
        flexGrow: 1,
      }}
    >
      <Loader visible={isLoading} />
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: Spacing.minor,
          paddingHorizontal: Spacing.mini,
        }}
      >
        <Text
          style={{
            color: constThemeColor.onPrimaryContainer,
            fontWeight: FontSize.Antz_Body_Medium.fontWeight,
            fontSize: FontSize.Antz_Body_Medium.fontSize,
          }}
        >
          {transferDataListCount} Transfers
        </Text>
        <ModalTitleData
          selectDrop={selectDrop}
          toggleModal={togglePrintModal}
          filterIconStyle={{ marginLeft: Spacing.small }}
          filterIcon={true}
          size={16}
        />

        {observationModal ? (
          <ModalFilterComponent
            onPress={togglePrintModal}
            onDismiss={closePrintModal}
            onBackdropPress={closePrintModal}
            onRequestClose={closePrintModal}
            data={TRANSFER_STATUS}
            closeModal={closeMenu}
            title="Filter By"
            style={{ alignItems: "flex-start" }}
            isSelectedId={isSelectedId}
            radioButton={true}
          />
        ) : null}
      </View>
      <FlatList
        data={transferDataList}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        scrollToOverflowEnabled={true}
        renderItem={({ item }) => (
          <TransferListCard
            item={item}
            site_id={site_id}
            onPress={() => {
              navigation.navigate("ApprovalSummary", {
                animal_movement_id: item.animal_movement_id,
                site_id: site_id,
                screen: "site",
              });
            }}
          />
        )}
        ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
        onEndReached={handleLoadMoreTransfer}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooterTransfer}
      />
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
          style={{ color: themeColors.blueBg }}
          enabled={true}
        />
      }
    />
  );
};
const AnimalsTreatment = ({
  searchLoading,
  SearchAddText,
  searchText,
  SearchRemoveText,
  themeColors,
  treatmentData,
  navigation,
  permission,
  TreatmentHandleLoadMore,
  TreatmentRenderFooter,
  onRefreshTreatment,
  refreshingTreatment,
  loading,
}) => {
  return (
    <>
      <Tabs.FlatList
        data={treatmentData}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={0.4}
        onEndReached={TreatmentHandleLoadMore}
        ListFooterComponent={TreatmentRenderFooter}
        ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
        style={{
          paddingLeft: Spacing.minor,
          paddingRight: Spacing.minor,
          paddingBottom: Spacing.minor,
          backgroundColor: themeColors.surfaceVariant,
        }}
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
            style={{ color: themeColors.blueBg }}
            enabled={true}
          />
        }
      />
    </>
  );
};

const Allocate = ({
  themeColors,
  allSelectedIds,
  selectedAnimals,
  allAnimalCount,
  allAnimalList,
  site_id,
  isLoading,
}) => {
  const navigation = useNavigation();
  const [Items, setItems] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [filterName, setFilterName] = useState("Show All");
  const [selectedIds, setSelectedIds] = useState(
    // selectedAnimals?.length > 0 ? selectedAnimals : []
    []
  );
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  // species checkbox select here
  const toggleSpeciesCheckBox = (speciesId, animalsId, checked) => {
    if (checked) {
      setSelectedIds(selectedIds?.filter((p) => !animalsId?.includes(p)));
    } else {
      setSelectedIds([...selectedIds, ...animalsId]);
    }
  };
  // animal checkbox select automatically
  const toggleAnimalCheckBox = (animalId, speciesId) => {
    const isSelectedSpecies = selectedSpecies.includes(speciesId);
    const isChecked = isSelectedSpecies || selectedIds.includes(animalId);

    setSelectedIds(
      isChecked
        ? selectedIds.filter((id) => id !== animalId)
        : [...selectedIds, animalId]
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      setSelectedIds([]);
    }, [navigation])
  );

  const selectAllAnimals = () => {
    const animalIds = [];
    allAnimalList.forEach((item) => {
      if (item.animal_details) {
        item.animal_details.forEach((detail) => {
          if (detail.animal_id) {
            animalIds.push(detail?.animal_id);
          }
        });
      }
    });
    if (selectedIds.length == animalIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(animalIds);
    }
  };
  const fetchData = () => {
    console.log("called");
  };
  const getSelectedData = (item) => {
    setSelectedData(item);
  };
  const togglePrintModal = () => {
    // setMedicalListModal(!medicalListModal);
    console.log("called");
  };
  const closePrintModal = () => {
    // setMedicalListModal(false);
    console.log("called");
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          width: "100%",
          flex: 1,
        }}
      >
        {item.animal_details?.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              padding: Spacing.minor,
              alignItems: "center",

              backgroundColor: opacityColor(themeColors.onPrimaryContainer, 20),
            }}
          >
            <Text
              style={[
                {
                  textAlign: "center",
                  fontSize: FontSize.Antz_Body_Title.fontSize,
                  fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                },
                { fontWeight: FontSize.Antz_Body_Title.fontWeight },
              ]}
            >
              {item.animal_details?.length}{" "}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: FontSize.Antz_Body_Title.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
              }}
            >
              {item.complete_name}
            </Text>
            <View style={{ position: "absolute", right: 8 }}>
              <CheckBox
                checked={item.animal_details?.every((p) =>
                  selectedIds.includes(p?.animal_id)
                )}
                onPress={() =>
                  toggleSpeciesCheckBox(
                    item.taxonomy_id,
                    item.animal_details?.map((p) => p?.animal_id),
                    item.animal_details?.every((p) =>
                      selectedIds.includes(p?.animal_id)
                    )
                  )
                }
              />
            </View>
          </View>
        ) : null}

        <View
          style={{
            width: "100%",
            flex: 1,
          }}
        >
          <FlatList
            data={item.animal_details}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <>
                <AnimalCustomCard
                  item={item}
                  animalIdentifier={
                    !item?.local_identifier_value
                      ? item?.animal_id
                      : item?.label ?? null
                  }
                  localID={item?.local_identifier_value ?? null}
                  icon={item.default_icon}
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
                  onPress={() => {
                    toggleAnimalCheckBox(item.animal_id, item.speciesId);
                  }}
                  noArrow={true}
                  showCheckList={selectedSpecies.includes(item.speciesId)}
                  checklistStatus={item?.transfer_status}
                  checkbox={true}
                  checked={selectedIds?.includes(item.animal_id)}
                  from={item?.source_site_name}
                  movedon={item?.transferred_on}
                  style={{
                    borderRadius: 0,
                    marginVertical: 0,
                    paddingVertical: Spacing.minor,
                  }}
                />
                <Divider />
              </>
            )}
          />
        </View>
      </View>
    );
  };

  const Animal = ({ speciesListData, loading }) => {
    return (
      <>
        <View style={{}}>
          <Divider />
          <FlatList
            scrollEnabled={true}
            data={speciesListData}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item) => item.taxonomy_id}
            ListEmptyComponent={<ListEmpty visible={loading} />}
          />
        </View>
      </>
    );
  };

  return (
    <View
      style={{
        // paddingHorizontal: Spacing.small,
        flexGrow: 1,
      }}
    >
      {selectedIds?.length > 0 ? (
        <View
          style={{
            paddingHorizontal: Spacing.body + Spacing.mini,
            paddingVertical: Spacing.body,
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
            backgroundColor: themeColors.secondaryContainer,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => setSelectedIds([])}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={themeColors?.onSecondaryContainer}
              />
            </TouchableOpacity>

            <Text
              style={[
                FontSize.Antz_Minor_Title,
                {
                  color: themeColors?.onSecondaryContainer,
                  paddingLeft: Spacing.minor + Spacing.small,
                },
              ]}
            >
              {selectedIds?.length} items
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={selectAllAnimals}>
              <MaterialCommunityIcons
                name="select-all"
                size={24}
                color={themeColors?.onSecondaryContainer}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={{
                paddingHorizontal: Spacing.small,
                paddingVertical: Spacing.small,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: themeColors?.onPrimaryContainer,
                borderRadius: 4,
              }}
              onPress={() =>
                navigation.navigate("SelectSection", {
                  selectedAnimal: selectedIds,
                })
              }
            >
              <MaterialCommunityIcons
                name="arrow-right-top"
                size={24}
                color={themeColors?.onPrimary}
              />
              <Text
                style={[
                  FontSize.Antz_Subtext_title,
                  { paddingLeft: Spacing.mini, color: themeColors?.onPrimary },
                ]}
              >
                Allocate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {allAnimalList?.length > 0 ? (
            <View
              style={{
                padding: Spacing.body + Spacing.mini,
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
                backgroundColor: themeColors.onPrimary,
              }}
            >
              <Text
                style={{
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  color: themeColors?.onPrimaryContainer,
                }}
              >
                {allAnimalCount} Animals
              </Text>
              {
                <ModalTitleData
                  selectDrop={filterName}
                  selectDropStyle={{
                    fontSize: FontSize.Antz_Body_Medium.fontSize,
                    fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                    color: themeColors?.onPrimaryContainer,
                  }}
                  customStyle={{}}
                  toggleModal={togglePrintModal}
                  filterIconStyle={{
                    marginLeft: Spacing.small,
                    marginTop: Spacing.micro,
                    color: themeColors?.onSurface,
                  }}
                  filterIcon={true}
                  size={20}
                />
              }
            </View>
          ) : null}
        </>
      )}

      <View style={{}}>
        <Animal speciesListData={allAnimalList} loading={isLoading} />
      </View>
    </View>
  );
};

const Config = ({
  reduxColors,
  themeColors,
  default_sub_tab,
  site_id,
  user_id,
  stylesSheet,
  isFocused,
  tests,
  fetchSiteDetails,
}) => {
  const TAB_HEADER_ITEMS = [
    {
      id: "1",
      title: "Lab Config",
      screen: "labConfig",
    },
    {
      id: "2",
      title: "Pharmacy Config",
      screen: "pharmacyConfig",
    },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [screen, setScreen] = useState("labConfig");
  const [labWithTests, setLabWithTests] = useState();
  const [resAfterSubmission, setResAfterSubmission] = useState([]);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  useEffect(() => {
    // changeInnerName(default_sub_tab ? default_sub_tab : "labConfig");
    setScreen(default_sub_tab ? default_sub_tab : screen);
  }, [default_sub_tab, screen]);

  const updateTestsArray = (data) => {
    setLabWithTests(data);
  };

  const submitHandler = () => {
    setIsLoading(true);
    const requestObj = {
      user_id: user_id,
      site_id: site_id,
      lab: JSON.stringify(labWithTests),
    };
    createSiteLab(requestObj)
      .then((res) => {
        setResAfterSubmission(res.data);
        successToast("success", "Default Lab Updated successfully");
      })
      .catch((err) => {
        console.log(err);
        errorToast("success", JSON.stringify(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const Item = ({ title, screenName }) => (
    <TouchableOpacity
      style={[
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
        // changeInnerName(screenName);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: Spacing.mini,
        }}
      >
        <Text
          style={[
            stylesSheet.labelStyle,
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
      <Loader visible={isLoading} />
      <Tabs.ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={{ backgroundColor: themeColors.onPrimary }}>
          <View
            style={[
              reduxColors.tabHeaderWrapper,
              { alignItems: "center", paddingTop: Spacing.small },
            ]}
          >
            <FlatList
              style={reduxColors.tabHeader}
              data={TAB_HEADER_ITEMS}
              renderItem={({ item }) => (
                <Item
                  title={item.title}
                  screenName={item.screen}
                  key={item.id}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View style={[reduxColors.tabBody, { paddingBottom: Spacing.major }]}>
            {screen === "labConfig" ? (
              <LabConfig
                themeColors={themeColors}
                reduxColors={reduxColors}
                updateTestsArray={(e) => updateTestsArray(e)}
                resAfterSubmission={resAfterSubmission}
                isFocused={isFocused}
                // tests={tests}
                site_id={site_id}
                loading={isLoading}
                fetchSiteDetails={fetchSiteDetails}
              />
            ) : screen === "pharmacyConfig" ? (
              <PharmacyConfig themeColors={themeColors} loading={isLoading} />
            ) : null}
          </View>
        </View>
      </Tabs.ScrollView>
      <View
        style={{
          width: "100%",
          backgroundColor: themeColors.surfaceVariant,
          paddingBottom: Spacing.mini,
        }}
      >
        <SubmitBtn buttonText={"Submit"} onPress={submitHandler} />
      </View>
    </>
  );
};

const LabConfig = ({
  themeColors,
  reduxColors,
  resAfterSubmission,
  isFocused,
  site_id,
  loading,
  fetchSiteDetails,
  ...props
}) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpenMasterData, setModalOpenMasterData] = useState(false);
  const [labData, setLabData] = useState([]);
  const [selectedTestsId, setSelectedTestsId] = useState("");
  const [extractedChildTests, setExtractedChildTests] = useState([]);
  const [labTestDataArray, setLabTestDataArray] = useState([]);
  const [labIdForTests, setLabIdForTests] = useState("");
  const [labNameForTests, setLabNameForTests] = useState("");
  const [labRefresh, setlabRefresh] = useState(false);
  const [testsAndDefaultLab, setTestsAndDefaultLab] = useState(
    resAfterSubmission ?? []
  );
  const { errorToast } = useToast();
  const callLabConfigFunc = () => {
    if (isFocused) {
      Promise.all([getTestsDefaultLab(site_id), getSampleAndTests()])
        .then((res) => {
          const testsDefaultLabData = res[0]?.data;
          const sampleAndTestsData = res[1]?.data;

          setLabTestDataArray(sampleAndTestsData);
          setTestsAndDefaultLab(testsDefaultLabData);
        })
        .catch((err) => {
          setlabRefresh(false);
          // errorToast("error", "Oops! Something went wrong!");
        })
        .finally(() => {
          setIsLoading(false);
          setlabRefresh(false);
        });
    }
  };
  useEffect(() => {
    callLabConfigFunc();
  }, [isFocused]);

  useEffect(() => {
    props.updateTestsArray(extractedChildTests);
  }, [extractedChildTests, modalOpenMasterData]);

  useEffect(() => {
    const extractChildTests = (data) => {
      const testsArray = [];
      for (const sample of data) {
        for (const test of sample.tests) {
          if (test.child_tests && test.child_tests.length > 0) {
            const childTestsArray = test.child_tests.map((childTest) => {
              const testIndex = testsAndDefaultLab.findIndex(
                (test) => test.test_id == childTest.test_id
              );
              return {
                id: childTest.test_id,
                name: childTest.test_name,
                default_lab:
                  testIndex !== -1 ? testsAndDefaultLab[testIndex].lab_id : "",
                default_lab_name:
                  testIndex !== -1
                    ? testsAndDefaultLab[testIndex].lab_name
                    : "",
                parent_test: false,
              };
            });
            testsArray.push(...childTestsArray);
          } else {
            const testIndex = testsAndDefaultLab.findIndex(
              (test) => test.test_id === test.test_id
            );

            testsArray.push({
              id: test.test_id,
              name: test.test_name,
              default_lab:
                testIndex !== -1 ? testsAndDefaultLab[testIndex].lab_id : "",
              default_lab_name:
                testIndex !== -1 ? testsAndDefaultLab[testIndex].lab_name : "",
              parent_test: true,
            });
          }
        }
      }
      return testsArray;
    };
    setExtractedChildTests(extractChildTests(labTestDataArray));
  }, [labTestDataArray, testsAndDefaultLab]);

  const closeLabMasterModal = () => {
    setModalOpenMasterData(false);
  };

  const closeModalMaster = (item) => {
    navigation.navigate(`${item}`);
    setModalOpenMasterData(!modalOpenMasterData);
  };

  const chooseLabForTestAndMapping = (item) => {
    setIsLoading(true);
    setSelectedTestsId(item.id);
    setLabIdForTests(item.default_lab);
    setLabNameForTests(item.default_lab_name);
    getTestsLabMappingList(item.id)
      .then((res) => {
        setLabData(res.data.result);
        setTimeout(() => {
          setModalOpenMasterData(!modalOpenMasterData);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
        setlabRefresh(false);
      });
  };

  const selectLabFunc = (item) => {
    const testIndex = extractedChildTests.findIndex(
      (test) => test.id === parseInt(item.test_id)
    );

    if (testIndex !== -1) {
      extractedChildTests[testIndex].default_lab = item.lab_id;
      extractedChildTests[testIndex].default_lab_name = item.lab_name;
    }
    setModalOpenMasterData(false);
  };

  return (
    <>
      <Loader visible={isLoading} />
      {extractedChildTests && extractedChildTests?.length > 0 ? (
        <View
          style={{
            backgroundColor: themeColors.surfaceVariant,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ width: "100%" }}>
            <FlatList
              contentContainerStyle={{
                flexDirection: "column",
                width: "100%",
                padding: Spacing.minor,
              }}
              refreshControl={
                <RefreshControl
                  refreshing={labRefresh}
                  onRefresh={() => {
                    if (!labRefresh && !isLoading) {
                      setlabRefresh(true);
                      callLabConfigFunc();
                      fetchSiteDetails();
                    }
                  }}
                  style={{ color: themeColors.blueBg }}
                  enabled={true}
                />
              }
              data={extractedChildTests}
              renderItem={({ item }) => (
                <>
                  <View
                    style={[
                      reduxColors.titleContainer,
                      {
                        backgroundColor: themeColors.surface,
                      },
                    ]}
                  >
                    <Text ellipsizeMode="tail" numberOfLines={3}>
                      {item?.name}
                    </Text>
                    {item.default_lab_name ? (
                      <TouchableOpacity
                        onPress={() => chooseLabForTestAndMapping(item)}
                        style={[
                          reduxColors.labBox,
                          {
                            paddingVertical: Spacing.body,
                          },
                          {
                            borderColor: themeColors.outlineVariant,
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: FontSize.Antz_Minor_Medium.fontSize,
                            fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                          }}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {item.default_lab_name}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => chooseLabForTestAndMapping(item)}
                        style={[
                          reduxColors.labBox,
                          {
                            paddingVertical: Spacing.body,
                          },
                          {
                            borderColor: themeColors.outlineVariant,
                          },
                        ]}
                      >
                        <Text style={[reduxColors.animalTextStyle]}>
                          Choose Default Lab
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      ) : (
        <ListEmpty visible={loading} />
      )}

      {modalOpenMasterData ? (
        <LabMappingModalComponent
          onPress={(item) => selectLabFunc(item)}
          onDismiss={closeLabMasterModal}
          onBackdropPress={closeLabMasterModal}
          onRequestClose={closeLabMasterModal}
          selectedLabId={labIdForTests}
          selectedLabName={labNameForTests}
          data={labData}
          title="Labs"
          closeModal={closeModalMaster}
          loading={isLoading}
        />
      ) : null}
    </>
  );
};

const PharmacyConfig = ({ themeColors, loading }) => {
  const navigation = useNavigation();
  return <ListEmpty visible={loading} />;
};

const Permission = ({
  searchText,
  searchLoading,
  SearchAddText,
  SearchRemoveText,
  siteByInchargeList,
  handleLoadMoreIncharge,
  renderFooterIncharge,
  themeColors,
  refreshingPermission,
  onRefreshIncharge,
  loginHistory,
  loading,
}) => {
  const navigation = useNavigation();
  return (
    <>
      <Tabs.FlatList
        data={siteByInchargeList}
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
              onChangeText={(e) => SearchAddText(e)}
              onClearPress={() => SearchRemoveText()}
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
        onEndReached={handleLoadMoreIncharge}
        ListFooterComponent={renderFooterIncharge}
        refreshControl={
          <RefreshControl
            refreshing={refreshingPermission}
            onRefresh={onRefreshIncharge}
            style={{ color: themeColors.blueBg }}
            enabled={true}
          />
        }
      ></Tabs.FlatList>
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
  deleteSiteMedia,
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
  // console?.log({selectedImages})
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
          inchargeList?.includes(UserId) || UserId == el.user_id ? true : false,
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
            imageDelete={deleteSiteMedia}
            deleteButton={true}
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
                        borderWidth:1,
                        borderColor: themeColors?.outline
                      }}
                    >
                      <View style={{}}>
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
const Media = ({
  setIsLoading,
  setPage,
  GetDocsData,
  setTabMedia,
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
  deleteSiteMedia,
  alertModalClose,
  bottomTitle,
  isModalVisible,
  firstButtonPress,
  secondButtonPress,
  inChargeSiteList,
  onRefreshDocuments,
  refreshingDocuments,
  onRefreshVideos,
  refreshingVideos,
  onRefreshImage,
  refreshingImage,
  documentDelete,
  deleteVideo,
  deleteMediaFun,
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
        setTabMedia(screenName);
        setIsLoading(true);
        setPage(1);
        GetDocsData(1, screenName);
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
    ...new Set([...inChargeSiteList]?.map((user) => user?.user_id)),
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
              keyExtractor={(item, index) => index.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View style={[reduxColors.tabBody]}>
            {screen === "images" ? (
              <ImageTab
                selectedImages={selectedImages}
                removeImages={removeImages}
                imageFooterLoader={imageFooterLoader}
                loadmoreImageData={loadmoreImageData}
                themeColors={themeColors}
                loading={isLoading}
                deleteSiteMedia={deleteSiteMedia}
                alertModalClose={alertModalClose}
                bottomTitle={bottomTitle}
                isModalVisible={isModalVisible}
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
          visible={documentModal}
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
                    style={{
                      marginTop: Spacing.small,
                      marginHorizontal: Spacing.small,
                    }}
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
                              justifyContent: "flex-start",
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

const InChargesList = ({
  themeColors,
  permission,
  inChargeSiteList,
  approver,
  loggedin_user_id,
  setIsAddSiteInCharge,
  refreshingSiteIncharge,
  onRefreshSiteIncharge,
  loading,
  site_id
}) => {
  const navigation = useNavigation();
  return (
    <>
      <Tabs.FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={inChargeSiteList?.incharges ?? []}
        style={{
          paddingHorizontal: Spacing.minor,
          backgroundColor: themeColors.surfaceVariant,
          paddingVertical: Spacing.mini,
        }}
        ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
        // onEndReached={handleLoadMore}
        // ListFooterComponent={renderFooter}
        /* The above code is setting an event handler for the "onEndReached" event. When this event is
        triggered, the function "handleLoadMore" will be called. */
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={onRefresh}
        //     style={{
        //       color: themeColors.blueBg,
        //       marginTop: (Spacing.body + Spacing.small) * 3,
        //     }}
        //     enabled={true}/>}

        ListHeaderComponent={
          //TODO- use permission to show hide button
          <>
            {(inChargeSiteList?.incharges
              ?.map((item) => item?.user_id)
              .includes(loggedin_user_id) ||
              permission["add_sites"]) && (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: heightPercentageToDP(2),
                  height: heightPercentageToDP(6),
                  borderRadius: 8,
                  marginBottom: Spacing.mini,
                  backgroundColor: themeColors.secondary,
                }}
                onPress={() => {
                  setIsAddSiteInCharge(true);
                  navigation.navigate("InchargeAndApproverSelect", {
                    selectedInchargeIds: inChargeSiteList?.incharges?.map(
                      (item) => item?.user_id
                    ),
                    inchargeDetailsData: inChargeSiteList?.incharges,
                    allowMultipleIncharge: String(
                      inChargeSiteList?.allow_multiple_incharges
                    ),
                    maxAllowedInCharges:
                      inChargeSiteList?.max_allowed_incharges, // TODO: Change this from api key max_allowed_incharges
                    screen: "addIncharge",
                    type: "site_incharge",
                    site_id: site_id,
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
                  Choose Site Incharge
                </Text>
              </TouchableOpacity>
            )}
          </>
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <>
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
            </>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshingSiteIncharge}
            onRefresh={onRefreshSiteIncharge}
            style={{ color: themeColors.blueBg }}
            enabled={true}
          />
        }
      />
    </>
  );
};

const MedicalRecordScreen = ({
  themeColors,
  medicalStatsCount,
  setDates,
  selectDropID,
  selectDropValue,
  site_id,
  startDate,
  endDate,
  refreshing,
  onRefreshMedical,
}) => {
  const navigation = useNavigation();

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
            siteId={site_id}
            startDate={startDate}
            endDate={endDate}
          />
        </View>
      </Tabs.ScrollView>
    </>
  );
};

const windowHeight = Dimensions.get("screen").height;
const windowWidth = Dimensions.get("screen").width;
const styles = (reduxColors) =>
  StyleSheet.create({
    masterContainer: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
    },
    inChargeBox: {
      flexDirection: "row",
      marginTop: 5,
    },
    headerContainer: {
      flex: 0.4,
      // backgroundColor: reduxColors.danger,
    },

    bgImage: {
      width: "100%",
      height: "100%",
    },

    linearGradient: {
      width: "100%",
      height: "100%",
    },

    firstRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 2,
    },
    titleText: {
      ...FontSize.Antz_Major_Title,
      color: reduxColors.onPrimary,
      marginLeft: Spacing.minor,
      marginVertical: Spacing.small,
    },
    titleNum: {
      ...FontSize.Antz_Major_Medium,
      color: reduxColors.onPrimary,
    },
    titleTextData: {
      ...FontSize.Antz_Subtext_Regular,
      color: reduxColors.onPrimary,
      fontFamily: "InterLight",
    },
    styleView: {
      flexDirection: "row",
      alignItems: "center",
    },
    fabStyle: {
      margin: 10,
      right: 5,
      bottom: 55,
      width: 45,
      height: 45,
      justifyContent: "center",
      alignItems: "center",
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
    tabBody: {
      flex: 1,
    },
    titleContainer: {
      width: "100%",
      borderRadius: Spacing.mini,
      marginVertical: Spacing.mini,
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.small,
      flexDirection: "column",
    },
    labBox: {
      width: "100%",
      marginVertical: Spacing.small,
      justifyContent: "center",
      borderWidth: 1,
      paddingHorizontal: Spacing.body,
      borderRadius: Spacing.small,
      borderColor: reduxColors.outlineVariant,
      backgroundColor: reduxColors.surface,
    },
    btnBg: {
      backgroundColor: reduxColors.primary,
      marginVertical: Spacing.small,
      width: 90,
      height: 40,
      borderRadius: Spacing.small,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
    },
    tabIcon: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      marginHorizontal: 4,
      // top: 4,
    },
    tabHeaderWrapper: {
      borderBottomColor: reduxColors.surfaceVariant,
      borderBottomWidth: 1,
      backgroundColor: reduxColors.onPrimary,
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
      backgroundColor: reduxColors.surface,
    },
    siteTitleText: {
      fontSize: FontSize.Antz_Small,
      fontWeight: "500",
      color: reduxColors.onError,
      letterSpacing: 3.6,
    },
    AvtarImage: {
      justifyContent: "center",
      alignItems: "center",
    },
    imgStyle: {
      // backgroundColor: opacityColor(reduxColors.neutralPrimary, 5),
      borderRadius: Spacing.small,
      width: 30,
      height: 30,
      alignItems: "center",
      justifyContent: "center",
    },
  });
