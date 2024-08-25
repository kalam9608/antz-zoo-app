import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  StatusBar,
  ImageBackground,
  View,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  LengthDecrease,
  capitalize,
  capitalizeFirstLetterAndUppercaseRest,
  checkPermissionAndNavigateWithAccess,
  ifEmptyValue,
  opacityColor,
  shortenNumber,
} from "../../utils/Utils";
//Import API CALLS
import {
  getGalleryImage,
  getHierarchy,
  getSpeciesAnimals,
  getSpeciesHierarchy,
} from "../../services/StatsService";
import {
  ActivityIndicator,
  Avatar,
  Card,
  Checkbox,
  Chip,
  FAB,
} from "react-native-paper";
import CustomCard from "../../components/CustomCard";
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import ImageHeader from "../../components/ImageHeader";
import StatsBlock from "../../components/StatsBlock";
import Loader from "../../components/Loader";
import Colors from "../../configs/Colors";
import ListEmpty from "../../components/ListEmpty";
import AnimalCard from "../../components/AnimalCard";
import FontSize from "../../configs/FontSize";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import Spacing from "../../configs/Spacing";
import AnimatedHeader from "../../components/AnimatedHeader";
import { useToast } from "../../configs/ToastConfig";
import DefaultOverlayContent from "../../components/DefaultOverlayContent";
import SliderComponent from "../../components/SliderComponent";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  interpolate,
  useAnimatedStyle,
  runOnJS,
  color,
  Extrapolate,
} from "react-native-reanimated";
import {
  MaterialTabBar,
  Tabs,
  useCurrentTabScrollY,
  useHeaderMeasurements,
} from "react-native-collapsible-tab-view";
import TabBarStyles from "../../configs/TabBarStyles";
import { keys, throttle } from "lodash";
import SiteInsight from "../../components/SiteInsight";
import SpeciesInsight from "../../components/SpeciesInsight";
import EnclosuresList from "../../components/EnclosuresList";
import {
  getSpeciesTaxonomyHierarchy,
  getSpeciesWiseList,
  getSpeciesWiseMedicalList,
  speciesPopulation,
} from "../../services/AddSiteService";
import List from "./Listing/component/List";
import MedicalListCard from "../../components/MedicalListCard";
import Config, { FilterMaster } from "../../configs/Config";
import moment from "moment";
import { getMedicalRecordCount } from "../../services/medicalRecord";
import MedicalRecordCardComponent from "../../components/MedicalRecordCardComponent";
import TaxonomyHirarchyCard from "../../components/TaxonomyHirarchyCard";
import { setGroupAnimalCountUpdated } from "../../redux/TabRefreshSlice";
import EnclosureCustomCard from "../../components/EnclosureCustomCard";
import CustomSiteCard from "../../components/CustomSiteCard";
import { getAsyncData } from "../../utils/AsyncStorageHelper";

const topBarHeight = heightPercentageToDP(30);

export default function SpeciesDetails(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const [showBackgroundImage, SetShowBackgroundImage] = useState(false);
  const [galleryImageData, setGalleryImageData] = useState([]);
  const [page, setPage] = useState(1);
  const [AnimalListLength, setAnimalListLength] = useState(0);
  const [animalList, setAnimalList] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [tags, setTags] = useState(route.params.tags);
  const [orderHierchyData, setOrderHierchyData] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [gender, setGender] = useState(null);
  const [state, setState] = React.useState({ open: false });

  //for site
  const [siteData, setSiteData] = useState([]);
  const [siteDataLength, setSiteDataLength] = useState(0);
  const [siteDataCount, setSiteDataCount] = useState(0);
  const [sitePage, setSitePage] = useState(0);

  //for section
  const [sectionData, setSectionData] = useState([]);
  const [sectionDataLength, setSectionDataLength] = useState(0);
  const [sectionDataCount, setSectionDataCount] = useState(0);
  const [sectionPage, setSectionPage] = useState(0);

  //for enclosure
  const [enclosureData, setEnclosureData] = useState([]);
  const [enclosureDataLength, setEnclosureDataLength] = useState(0);
  const [enclosureDataCount, setEnclosureDataCount] = useState(0);
  const [enclosurePage, setEnclosurePage] = useState(0);

  //for medical
  const [medicalData, setMedicalData] = useState([]);
  const [medicalDataLength, setMedicalDataLength] = useState(0);
  const [medicalDataCount, setMedicalDataCount] = useState(0);
  const [medicalPage, setMedicalPage] = useState(0);

  //for taxonomy hirarchy
  const [taxonomyData, setTaxonomyData] = useState({});
  const [taxonomyDataLength, setTaxonomyDataLength] = useState(0);

  // console.log("taxonomyDataLength====>",taxonomyDataLength)

  // const [taxonomyDataCount, setTaxonomyDataCount] = useState(0);
  // const [taxonomyPage, setTaxonomyPage] = useState(0);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const permission = useSelector((state) => state.UserAuth.permission);

  const [isHideStats, setIsHideStats] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getHideStatsValue();
    }, [])
  );

  const getHideStatsValue = async () => {
    const value = await getAsyncData("@antz_hide_stats");
    setIsHideStats(value);
  };

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

  //Getting current ZooID
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const isGroupAnimalCountUpdated = useSelector(
    (state) => state.tabRefresh.isGroupAnimalCountUpdated
  );
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  const [screenName, setScreenName] = useState("population");
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (
        screenName == "population" &&
        (animalList?.length === 0 || isGroupAnimalCountUpdated)
      ) {
        setLoading(true);
        setPage(1);
        loadMore(1, gender);
        getTagFilters();
      } else if (screenName == "site" && siteData?.length === 0) {
        setLoading(true);
        setSitePage(1);
        fetchSiteData(1);
      } else if (screenName == "section" && sectionData?.length === 0) {
        setLoading(true);
        setSectionPage(1);
        fetchSectionData(1);
      } else if (screenName == "enclosure" && enclosureData?.length === 0) {
        setLoading(true);
        setEnclosurePage(1);
        fetchEnclosureData(1);
      } else if (screenName == "medical" && medicalStatsCount?.length === 0) {
        setLoading(true);
        // setMedicalPage(1);
        fetchMedicalData();
      } else if (screenName == "taxonomy" && taxonomyDataLength === 0) {
        setLoading(true);
        fetchTaxonomyData(1);
      }
      return () => {};
    }, [
      navigation,
      screenName,
      gender,
      startDate,
      endDate,
      isGroupAnimalCountUpdated,
    ])
  );

  //Max Height of the Header

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setLoading(true);
  //     setPage(1);
  //     loadMore(1, gender);
  //     getTagFilters();

  //     return () => {
  //       // Clean up the effect when the screen is unfocused (if necessary)
  //     };
  //   }, [navigation])
  // );

  const getTagFilters = () => {
    setLoading(true);
    Promise.all([
      getSpeciesHierarchy({
        zoo_id: zooID,
        parent_tsn: route.params?.species_tsn_id
          ? route.params?.species_tsn_id
          : route.params?.tsn_id
          ? route.params?.tsn_id
          : 0,
      }),
      getGalleryImage(
        "species",
        route.params?.species_tsn_id
          ? route.params?.species_tsn_id
          : route.params?.tsn_id
          ? route.params?.tsn_id
          : 0
      ),
    ])
      .then((res) => {
        if (res?.success && res[0]?.data?.classification_list[0]?.sex_data) {
          setTags(res[0]?.data?.classification_list[0]?.sex_data);
        }
        setGalleryImageData(res[1]?.data);
        SetShowBackgroundImage(res[1]?.data?.length > 0 ? true : false);
        setLoading(false);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleLoadMore = () => {
    if (!Loading && AnimalListLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadMore(nextPage, gender);
    }
  };

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (Loading || AnimalListLength == 0 || AnimalListLength < 10) return null;
    return <ActivityIndicator style={{ color: Colors.primary }} />;
  };

  const loadMore = (count, gender) => {
    let obj = {
      zoo_id: zooID,
      parent_tsn: route.params?.tsn_id ?? 0,
      page_no: count,
      gender: gender,
    };
    if (route.params.fetchFrom !== "zoo") {
      if (route.params.site_id || route.params.fetchFrom) {
        obj.site_id = route.params.fetchFrom
          ? route.params.fromId
          : route.params.site_id;
      }
    }
    if (route.params.section_id) {
      obj.section_id = route.params.section_id;
    }
    if (route.params.enclosure_id) {
      obj.enclosure_id = route.params.enclosure_id;
    }
    getSpeciesAnimals(obj)
      .then((res) => {
        setTags(res?.data?.sex_data);
        let dataArr = count == 1 ? [] : animalList;
        setOrderHierchyData(res.data);
        if (res.data.animals) {
          setAnimalListLength(res?.data?.animals?.length);
          setAnimalList(dataArr.concat(res?.data?.animals));
        } else {
          setAnimalListLength(0);
        }
        setLoading(false);
        setRefreshing(false);
        dispatch(setGroupAnimalCountUpdated(false));
      })
      .catch((err) => {
        errorToast("Error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  // for site list
  const fetchSiteData = (pageNo) => {
    let obj = {
      page_no: pageNo,
      species_id: route?.params?.tsn_id,
      type: "site",
    };
    getSpeciesWiseList(obj)
      .then((res) => {
        if (res?.success) {
          let dataArr = pageNo == 1 ? [] : siteData;
          setSiteDataCount(
            res?.data?.total_count == undefined ? 0 : res?.data?.total_count
          );
          if (res?.data) {
            if (res?.data?.result) {
              dataArr = dataArr.concat(res?.data?.result);
            }
            setSiteData(dataArr);
            setSiteDataLength(dataArr?.length);
            setLoading(false);
            setRefreshing(false);
          }
        } else {
          setSiteDataLength(siteDataCount);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const handleLoadMoreSite = () => {
    if (!Loading && siteDataLength >= 10 && siteDataLength !== siteDataCount) {
      const nextPage = sitePage + 1;
      setSitePage(nextPage);
      fetchSiteData(nextPage);
    }
  };

  const renderFooterSite = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (
      Loading ||
      siteDataLength == 0 ||
      siteDataLength < 10 ||
      siteDataLength == siteDataCount
    )
      return null;
    return <ActivityIndicator style={{ color: Colors.primary }} />;
  };

  // for site list
  const fetchSectionData = (pageNo) => {
    let obj = {
      page_no: pageNo,
      species_id: route?.params?.tsn_id,
      type: "section",
    };
    getSpeciesWiseList(obj)
      .then((res) => {
        if (res?.success) {
          let dataArr = pageNo == 1 ? [] : sectionData;
          setSectionDataCount(
            res?.data?.total_count == undefined ? 0 : res?.data?.total_count
          );
          if (res?.data) {
            if (res?.data?.result) {
              dataArr = dataArr.concat(res?.data?.result);
            }
            setSectionData(dataArr);
            setSectionDataLength(dataArr?.length);
            setLoading(false);
            setRefreshing(false);
          }
        } else {
          setSectionDataLength(sectionDataCount);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const handleLoadMoreSection = () => {
    if (
      !Loading &&
      sectionDataLength >= 10 &&
      sectionDataLength !== sectionDataCount
    ) {
      const nextPage = sectionPage + 1;
      setSectionPage(nextPage);
      fetchSectionData(nextPage);
    }
  };

  const renderFooterSection = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (
      Loading ||
      sectionDataLength == 0 ||
      sectionDataLength < 10 ||
      sectionDataLength == sectionDataCount
    )
      return null;
    return <ActivityIndicator style={{ color: Colors.primary }} />;
  };

  // for encosure list
  const fetchEnclosureData = (pageNo) => {
    let obj = {
      page_no: pageNo,
      species_id: route?.params?.tsn_id,
      type: "enclosure",
    };
    getSpeciesWiseList(obj)
      .then((res) => {
        if (res?.success) {
          let dataArr = pageNo == 1 ? [] : enclosureData;
          setEnclosureDataCount(
            res?.data?.total_count == undefined ? 0 : res?.data?.total_count
          );
          if (res?.data) {
            if (res?.data?.result) {
              dataArr = dataArr.concat(res?.data?.result);
            }
            setEnclosureData(dataArr);
            setEnclosureDataLength(dataArr?.length);
            setLoading(false);
          }
        } else {
          setEnclosureDataLength(enclosureDataCount);
        }
        setRefreshing(false);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const handleLoadMoreEnclosure = () => {
    if (
      !Loading &&
      enclosureDataLength >= 10 &&
      enclosureDataLength !== enclosureDataCount
    ) {
      const nextPage = enclosurePage + 1;
      setEnclosurePage(nextPage);
      fetchEnclosureData(nextPage);
    }
  };

  const renderFooterEnclosure = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (
      Loading ||
      enclosureDataLength == 0 ||
      enclosureDataLength < 10 ||
      enclosureDataLength == enclosureDataCount
    )
      return null;
    return <ActivityIndicator style={{ color: Colors.primary }} />;
  };

  // for medical list
  const fetchMedicalData = (pageNo) => {
    let obj = {
      species_id: route?.params?.tsn_id,
      medical: "zoo",
      start_date: startDate ?? "",
      end_date: endDate ?? "",
    };
    getMedicalRecordCount(obj)
      .then((res) => {
        setMedicalStatsCount(res?.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        setLoading(false);
        errorToast("error", "Oops! Something went wrong!");
        setRefreshing(false);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const handleLoadMoreMedical = () => {
    if (
      !Loading &&
      medicalDataLength >= 10 &&
      medicalDataLength !== medicalDataCount
    ) {
      const nextPage = medicalPage + 1;
      setMedicalPage(nextPage);
      fetchMedicalData(nextPage);
    }
  };

  const renderFooterMedical = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (
      Loading ||
      medicalDataLength == 0 ||
      medicalDataLength < 10 ||
      medicalDataLength == medicalDataCount
    )
      return null;
    return <ActivityIndicator style={{ color: Colors.primary }} />;
  };

  // for medical list
  const fetchTaxonomyData = (pageNo) => {
    let obj = {
      species_id: route?.params?.tsn_id,
    };
    getSpeciesTaxonomyHierarchy(obj)
      .then((res) => {
        if (res?.success) {
          const arrData = Object.entries(res?.data).map(([key, value]) => ({
            key,
            value,
          }));
          setTaxonomyDataLength(arrData?.length);
          // console.log("res===>", arrData);

          setTaxonomyData(res?.data);
        }
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.log("error====", error);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const isCheckedId = (id) => {
    return checkedItems.includes(id);
  };

  const clickOption = (key) => {
    setGender(key);
    setPage(1);
    setLoading(true);
    loadMore(1, key);
  };

  const onValueChacked = (id) => {
    if (isCheckedId(id)) {
      setCheckedItems(checkedItems.filter((item) => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  const onStatsPress = (item) => {
    if (item === "population") {
      ref.current?.jumpToTab("Population");
    } else if (item === "site") {
      ref.current?.jumpToTab("Sites");
    } else if (item === "section") {
      ref.current?.jumpToTab("Sections");
    } else if (item === "enclosure") {
      ref.current?.jumpToTab("Enclosures");
    } else {
      ref.current?.jumpToTab(item);
    }
  };

  const TAB_HEADER_ITEMS = [
    {
      id: "0",
      title: "Population",
      screen: "population",
    },
    {
      id: "1",
      title: "Sites",
      screen: "site",
    },
    {
      id: "2",
      title: "Sections",
      screen: "section",
    },
    {
      id: "3",
      title: "Enclosures",
      screen: "enclosure",
    },

    // {
    //   id: "4",
    //   title: "Medical",
    //   screen: "medical",
    // },
    {
      id: "5",
      title: "Taxonomy",
      screen: "taxonomy",
    },
  ];

  const ref = React.useRef();
  const stylesSheet = TabBarStyles.getTabBarStyleSheet(constThemeColor);

  const minimumHeaderHeight = 70;
  const [tabBarBorderRadius, setTabBarBorderRadius] = useState(false);
  const [header, setHeader] = useState(false);
  const Header_Maximum_Height = heightPercentageToDP(42);
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

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadMore(1, gender);
  };

  const onRefreshSite = () => {
    setRefreshing(true);
    setSitePage(1);
    fetchSiteData(1);
  };

  const onRefreshSection = () => {
    setRefreshing(true);
    setSectionPage(1);
    fetchSectionData(1);
  };

  const onRefreshenclosure = () => {
    setRefreshing(true);
    setEnclosurePage(1);
    fetchEnclosureData(1);
  };

  const onRefreshMedical = () => {
    setRefreshing(true);
    setMedicalPage(1);
    fetchMedicalData(1);
  };
  const onRefreshTaxonomy = () => {
    setRefreshing(true);
    fetchTaxonomyData(1);
  };

  return (
    <>
      <View style={reduxColors.mainContainer}>
        <Loader visible={Loading} />

        <AppBar
          header={header}
          reduxColors={constThemeColor}
          style={[
            header
              ? { backgroundColor: constThemeColor.onPrimary }
              : { backgroundColor: "transparent" },
            { position: "absolute", top: 0, width: "100%", zIndex: 1 },
          ]}
          title={"species"}
          permission={permission}
          onBackPress={() => {
            navigation.goBack();
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
                activeColor={constThemeColor.onSurface}
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
                style={[styles?.headerContainer]}
                navigation={navigation}
                constThemeColor={constThemeColor}
                tabBarBorderRadius={tabBarBorderRadius}
                reduxColors={reduxColors}
                getScrollPositionOfTabs={getScrollPositionOfTabs}
                getHeaderHeight={getHeaderHeight}
                orderHierchyData={orderHierchyData}
                permission={permission}
                galleryImageData={galleryImageData}
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
              }
            });
          }}
        >
          {TAB_HEADER_ITEMS.map((item) => {
            return (
              <Tabs.Tab name={item.title} label={item.title} key={item.id}>
                <View
                  style={{
                    paddingVertical:
                      item.screen === "animalTransfers" ||
                      item.screen === "teams" ||
                      item.screen === "taxonomy"
                        ? 0
                        : Spacing.small,
                    height: "100%",
                  }}
                >
                  {item.screen === "population" ? (
                    <Population
                      navigation={navigation}
                      permission={permission}
                      animalList={animalList}
                      constThemeColor={constThemeColor}
                      reduxColors={reduxColors}
                      renderFooter={renderFooter}
                      handleLoadMore={handleLoadMore}
                      clickOption={clickOption}
                      tags={tags}
                      gender={gender}
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      Loading={Loading}
                    />
                  ) : item.screen === "site" ? (
                    <SiteList
                      navigation={navigation}
                      siteData={siteData}
                      constThemeColor={constThemeColor}
                      handleLoadMoreSite={handleLoadMoreSite}
                      renderFooterSite={renderFooterSite}
                      refreshing={refreshing}
                      onRefreshSite={onRefreshSite}
                      permission={permission}
                      isHideStats={isHideStats}
                      Loading={Loading}
                    />
                  ) : item.screen === "section" ? (
                    <SectionList
                      navigation={navigation}
                      sectionData={sectionData}
                      constThemeColor={constThemeColor}
                      handleLoadMoreSection={handleLoadMoreSection}
                      renderFooterSection={renderFooterSection}
                      refreshing={refreshing}
                      onRefreshSection={onRefreshSection}
                      Loading={Loading}
                      permission={permission}
                      isHideStats={isHideStats}
                    />
                  ) : item.screen === "enclosure" ? (
                    <EnclosreList
                      navigation={navigation}
                      enclosureData={enclosureData}
                      constThemeColor={constThemeColor}
                      handleLoadMoreEnclosure={handleLoadMoreEnclosure}
                      renderFooterEnclosure={renderFooterEnclosure}
                      refreshing={refreshing}
                      onRefreshenclosure={onRefreshenclosure}
                      Loading={Loading}
                    />
                  ) : item.screen === "medical" ? (
                    // <MedicalList
                    //   navigation={navigation}
                    //   medicalData={medicalData}
                    //   constThemeColor={constThemeColor}
                    //   handleLoadMoreMedical={handleLoadMoreMedical}
                    //   renderFooterMedical={renderFooterMedical}
                    //   refreshing={refreshing}
                    //   onRefreshMedical={onRefreshMedical}
                    // />
                    <MedicalScreen
                      themeColors={constThemeColor}
                      medicalStatsCount={medicalStatsCount}
                      setDates={setDates}
                      selectDropID={selectDropID}
                      selectDropValue={selectDropValue}
                      speciesId={route?.params?.tsn_id}
                      refreshing={refreshing}
                      onRefreshMedical={onRefreshMedical}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  ) : item.screen === "taxonomy" ? (
                    <TaxonomyList
                      navigation={navigation}
                      taxonomyData={taxonomyData}
                      constThemeColor={constThemeColor}
                      reduxColors={reduxColors}
                      refreshing={refreshing}
                      onRefreshTaxonomy={onRefreshTaxonomy}
                      Loading={Loading}
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
          fabStyle={reduxColors.fabStyle}
          icon={open ? "close-circle-outline" : "plus-circle-outline"}
          actions={[
            {
              icon: "plus",
              label: "Add Animal",
              onPress: () =>
                checkPermissionAndNavigateWithAccess(
                  permission,
                  "collection_animal_record_access",
                  navigation,
                  "AnimalAddDynamicForm",
                  {
                    tsn_id: route.params?.tsn_id,
                    tsn: route.params.title,
                    animalList: animalList,
                  },
                  "ADD"
                ),
              // navigation.navigate("AnimalAddDynamicForm", {
              //   tsn_id: route.params?.tsn_id,
              //   tsn: route.params.title,
              // }),
            },
            {
              icon: () => (
                <Ionicons
                  name="paw"
                  size={24}
                  color={constThemeColor.onPrimaryContainer}
                />
              ),
              label: "Collection",
              onPress: () => navigation.navigate("Collections"),
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
      </View>
    </>
  );
}

const AppBar = ({ header, style, title, onBackPress, isHideStats }) => {
  const navigation = useNavigation();

  return (
    <>
      <AnimatedHeader
        hideMenu={true}
        title={title}
        style={style}
        header={header}
        onBackPress={onBackPress}
      />
    </>
  );
};

const Header = ({
  imageBackground,
  galleryImageData,
  constThemeColor,
  tabBarBorderRadius,
  getHeaderHeight,
  getScrollPositionOfTabs,
  reduxColors,
  permission,
  isHideStats,
  onStatsPress,
  orderHierchyData,
}) => {
  const route = useRoute();
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

  const overlayContent = (
    <View
      style={{
        justifyContent: "space-between",
      }}
    >
      <View style={{ marginTop: 24 }}>
        <SpeciesInsight
          style={{
            backgroundColor: opacityColor(constThemeColor.neutralPrimary, 40),
          }}
          onStatsPress={onStatsPress}
          orderHierchyData={orderHierchyData}
        />
      </View>
    </View>
  );

  const DefaultOverlayContent = (
    <View
      style={{
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: Spacing.major,
          marginTop: Spacing.minor,
        }}
      >
        <View>
          {route.params?.title ? (
            <Text
              style={{
                color: constThemeColor.onPrimary,
                fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                fontSize: FontSize.Antz_Body_Medium.fontSize,
                paddingBottom: Spacing.micro,
              }}
            >
              {"Species"}
            </Text>
          ) : null}
          <Text
            style={{
              color: constThemeColor.onPrimary,
              fontWeight: FontSize.Antz_Major_Title.fontWeight,
              fontSize: FontSize.Antz_Major_Title.fontSize,
              paddingBottom: Spacing.micro,
            }}
          >
            {route.params?.title}
          </Text>
          <Text
            style={{
              color: constThemeColor.onPrimary,
              fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
              fontSize: FontSize.Antz_Subtext_Regular.fontSize,
              fontStyle: "italic",
            }}
          >
            {route.params?.subtitle}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: Spacing.small }}>
        <SpeciesInsight
          style={{
            backgroundColor: opacityColor(constThemeColor.neutralPrimary, 40),
          }}
          onStatsPress={onStatsPress}
          orderHierchyData={orderHierchyData}
        />
      </View>
    </View>
  );

  return (
    <>
      <View style={reduxColors.headerContainer}>
        <View style={{ backgroundColor: constThemeColor.onPrimaryContainer }}>
          <Animated.View
            style={[
              animatedStyle,
              {
                zIndex: 1,
                paddingTop: galleryImageData.length == 0 ? 70 : 0,
                paddingBottom: galleryImageData.length == 0 ? Spacing.major : 0,
                backgroundColor: backgroundImage
                  ? opacityColor(constThemeColor?.neutralPrimary, 30)
                  : constThemeColor?.onPrimaryContainer,
              },
            ]}
          >
            <View
              style={{
                justifyContent: "flex-end",
                paddingBottom: galleryImageData.length == 0 ? Spacing.minor : 0,
              }}
            >
              <Animated.View
                style={{
                  height: "auto",
                  justifyContent: "flex-end",
                  marginHorizontal:
                    galleryImageData.length == 0 ? Spacing.major : 0,
                }}
              >
                {galleryImageData.length !== 0 ? (
                  <View style={{ width: "100%" }}>
                    <SliderComponent
                      imageData={galleryImageData}
                      preTitle={"Species"}
                      child={DefaultOverlayContent}
                      permission={permission}
                      noNavigation={true}
                      autoPlay={true}
                      navigation={navigation}
                    />
                  </View>
                ) : (
                  <View style={styles.DefaultHeaderContainer}>
                    {DefaultOverlayContent}
                  </View>
                )}
              </Animated.View>
            </View>
          </Animated.View>
          <Animated.View
            style={{
              height: 18,
              backgroundColor: constThemeColor.onPrimary,
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

const Population = ({
  navigation,
  animalList,
  constThemeColor,
  renderFooter,
  handleLoadMore,
  clickOption,
  tags,
  reduxColors,
  gender,
  permission,
  refreshing,
  onRefresh,
  Loading,
}) => {
  return (
    <>
      <Tabs.FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={animalList ?? []}
        style={{
          paddingHorizontal: Spacing.minor,
          backgroundColor: constThemeColor.surfaceVariant,
          paddingVertical: Spacing.mini,
        }}
        ListEmptyComponent={<ListEmpty height={"50%"} visible={Loading} />}
        ListHeaderComponent={
          <>
            {animalList ? (
              <View
                style={{
                  flexDirection: "row",
                  paddingVertical: Spacing.mini,
                  marginHorizontal: Spacing.mini,
                }}
              >
                <View>
                  <View style={{ alignItems: "center" }}>
                    {tags ? (
                      <View>
                        {Object.keys(tags).filter(
                          (key) => tags[key] !== null || tags[key] == 0
                        ).length <= 1 ? null : (
                          <View
                            style={reduxColors.tagsContainer}
                            onStartShouldSetResponder={() => true}
                          >
                            <View
                              style={[
                                reduxColors.showAll,
                                {
                                  borderWidth: 1,
                                  borderColor:
                                    gender == null
                                      ? constThemeColor.primary
                                      : constThemeColor.surfaceVariant,
                                },
                              ]}
                            >
                              <TouchableOpacity
                                onPress={() => clickOption(null)}
                              >
                                <Text style={reduxColors.showAllText}>All</Text>
                              </TouchableOpacity>
                            </View>

                            {Object.keys(tags).map((key) => {
                              if (!tags[key] || tags[key] == 0) {
                                return null;
                              }
                              return (
                                <TouchableOpacity
                                  onPress={() => clickOption(key)}
                                >
                                  <View
                                    key={key}
                                    style={[
                                      key == "male"
                                        ? reduxColors.malechip
                                        : key == "female"
                                        ? reduxColors.femalechip
                                        : key == "undetermined"
                                        ? reduxColors.undeterminedChip
                                        : key == "indeterminate"
                                        ? reduxColors.indeterminedChip
                                        : {},
                                      // gender == key && {
                                      //   borderWidth: 1,
                                      //   borderColor: constThemeColor.primary,
                                      // },
                                      {
                                        borderWidth: 1,
                                        borderColor:
                                          gender == key
                                            ? constThemeColor.primary
                                            : constThemeColor.surfaceVariant,
                                      },
                                    ]}
                                  >
                                    <Text
                                      style={
                                        key == "male"
                                          ? reduxColors.malechipText
                                          : key == "female"
                                          ? reduxColors.femalechipText
                                          : key == "undetermined"
                                          ? reduxColors.undeterminedText
                                          : key == "indeterminate"
                                          ? reduxColors.indeterminedText
                                          : {}
                                      }
                                    >
                                      {key == "male"
                                        ? `M - ${tags[key]}`
                                        : key == "female"
                                        ? `F - ${tags[key]}`
                                        : key == "undetermined"
                                        ? `UD - ${tags[key]}`
                                        : key == "indeterminate"
                                        ? `ID - ${tags[key]}`
                                        : null}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        )}
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            ) : null}
          </>
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View style={{ marginTop: Spacing.mini }}>
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
                type={item?.type}
                siteName={item?.site_name}
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
                    {
                      animal_id: item.animal_id,
                      enclosure_id: item.enclosure_id,
                    },
                    "VIEW"
                  )
                }
              />
            </View>
          );
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
            style={{ color: constThemeColor.blueBg }}
            enabled={true}
          />
        }
      />
    </>
  );
};

const SiteList = ({
  navigation,
  siteData,
  constThemeColor,
  handleLoadMoreSite,
  renderFooterSite,
  onRefreshSite,
  refreshing,
  Loading,
  permission,
  isHideStats,
}) => {
  return (
    <>
      <Tabs.FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={siteData ?? []}
        style={{
          paddingHorizontal: Spacing.small,
          backgroundColor: constThemeColor.surfaceVariant,
          paddingVertical: Spacing.mini,
        }}
        ListEmptyComponent={
          <ListEmpty
            height={"50%"}
            label={"No sites found!"}
            visible={Loading}
          />
        }
        ListHeaderComponent={<></>}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View>
              {/* <List data={item} type="site" /> */}
              <CustomSiteCard
                hideBackgroundImage={false}
                title={item.site_name}
                incharge={item.incharge_name ? item.incharge_name : "NA"}
                animalCount={shortenNumber(item.animal_count)}
                speciesCount={shortenNumber(item.species_count)}
                encCount={shortenNumber(item.enclosure_count)}
                sectionCount={shortenNumber(item.section_count)}
                InchargePhoneNumber={
                  item.incharge_mobile_no
                    ? item.incharge_mobile_no
                    : item?.incharge_phone_number
                }
                images={item.images}
                permission={!false}
                isHideStats={!false}

                // permission={permission}      // hide the stats count for now
                // isHideStats={isHideStats}
                // onPress={() =>
                //   navigation.navigate("siteDetails", {
                //     id: item.site_id,
                //   })
                // }
              />
            </View>
          );
        }}
        onEndReached={handleLoadMoreSite}
        onEndReachedThreshold={0.4}
        ListFooterComponent={renderFooterSite}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefreshSite()}
            style={{ color: constThemeColor.blueBg }}
            enabled={true}
          />
        }
      />
    </>
  );
};

const SectionList = ({
  navigation,
  sectionData,
  constThemeColor,
  handleLoadMoreSection,
  renderFooterSection,
  refreshing,
  onRefreshSection,
  Loading,
  permission,
  isHideStats,
}) => {
  return (
    <>
      <Tabs.FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={sectionData ?? []}
        style={{
          paddingHorizontal: Spacing.small,
          backgroundColor: constThemeColor.surfaceVariant,
          paddingVertical: Spacing.mini,
        }}
        ListEmptyComponent={
          <ListEmpty
            height={"50%"}
            label={"No sections found!"}
            visible={Loading}
          />
        }
        ListHeaderComponent={<></>}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View>
              {/* <List data={item} type="section" /> */}
              <CustomSiteCard
              hideBackgroundImage={false}
                title={item.section_name}
                incharge={item.incharge_name ? item.incharge_name : "NA"}
                animalCount={shortenNumber(item.animal_count)}
                speciesCount={shortenNumber(item.species_count)}
                encCount={shortenNumber(item.enclosure_count)}
                InchargePhoneNumber={item.incharge_phone_number}
                images={item.images}
                permission={!false} // hide the stats count for now
                isHideStats={!false}

                // onPress={() =>
                //   navigation.navigate("HousingEnclosuer", {
                //     section_id: item?.section_id ?? 0,
                //     sectiondata: item,
                //     incharge_name: item.incharge_name
                //       ? item.incharge_name
                //       : "NA",
                //   })
                // }
              />
            </View>
          );
        }}
        onEndReached={handleLoadMoreSection}
        onEndReachedThreshold={0.4}
        ListFooterComponent={renderFooterSection}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefreshSection()}
            style={{ color: constThemeColor.blueBg }}
            enabled={true}
          />
        }
      />
    </>
  );
};

const EnclosreList = ({
  navigation,
  enclosureData,
  constThemeColor,
  handleLoadMoreEnclosure,
  renderFooterEnclosure,
  refreshing,
  onRefreshenclosure,
  Loading,
}) => {
  return (
    <>
      <Tabs.FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={enclosureData ?? []}
        style={{
          paddingHorizontal: Spacing.small,
          backgroundColor: constThemeColor.surfaceVariant,
          paddingVertical: Spacing.mini,
          paddingHorizontal: Spacing.body,
        }}
        ListEmptyComponent={
          <ListEmpty
            height={"50%"}
            label={"No enclosures found!"}
            visible={Loading}
          />
        }
        ListHeaderComponent={<></>}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <>
              <EnclosureCustomCard
                // title={capitalizeFirstLetterAndUppercaseRest(
                //   item.user_enclosure_name
                // )}
                title={item.user_enclosure_name}
                icon={
                  item?.images?.filter(
                    (item) => item?.display_type == "banner"
                  )[0]?.file ??
                  Config.BASE_APP_URL + "assets/class_images/default_animal.svg"
                }
                count={item?.enclosure_wise_animal_count}
                siteName={item?.site_name}
                enclosureType={item?.enclosure_type ?? null}
                sectionName={item?.section_name ?? null}
                onPress={() =>
                  navigation.navigate("OccupantScreen", {
                    enclosure_id: item?.enclosure_id ?? 0,
                    section_id: item?.section_id,
                    section_name: item?.section_name,
                    enclosure_name: item?.user_enclosure_name,
                    enclosure_id: item?.enclosure_id,
                  })
                }
              />
            </>
          );
        }}
        onEndReached={handleLoadMoreEnclosure}
        onEndReachedThreshold={0.4}
        ListFooterComponent={renderFooterEnclosure}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefreshenclosure()}
            style={{ color: constThemeColor.blueBg }}
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
  speciesId,
  refreshing,
  onRefreshMedical,
  startDate,
  endDate,
}) => {
  return (
    <>
      <Tabs.ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshMedical}
          />
        }
        style={{
          flex: 1,
          backgroundColor: themeColors.surfaceVariant,
        }}
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
            speciesId={speciesId}
            startDate={startDate}
            endDate={endDate}
          />
        </View>
      </Tabs.ScrollView>
    </>
  );
};

const MedicalList = ({
  themeColors,
  medicalStatsCount,
  setDates,
  selectDropID,
  selectDropValue,
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
          />
        </View>
      </Tabs.ScrollView>
    </>
  );
};

const TaxonomyList = ({
  navigation,
  taxonomyData,
  constThemeColor,
  reduxColors,
  onRefreshTaxonomy,
  refreshing,
  Loading,
}) => {
  return (
    <>
      <Tabs.ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshTaxonomy}
          />
        }
      >
        {Loading ? (
          <ListEmpty height={"50%"} visible={Loading} />
        ) : (
          <View
            style={{
              paddingHorizontal: Spacing.minor,
              marginTop: Spacing.small,
              flex: 1,
            }}
          >
            <TaxonomyHirarchyCard
              title={"Class"}
              name={
                taxonomyData?.class?.name
                  ? taxonomyData?.class?.name
                  : taxonomyData?.class?.default_common_name
              }
              default_common_name={taxonomyData?.class?.default_common_name}
              backgroundColor={opacityColor(constThemeColor?.onPrimary, 40)}
            />
            <TaxonomyHirarchyCard
              title={"Order"}
              name={
                taxonomyData?.order?.name
                  ? taxonomyData?.order?.name
                  : taxonomyData?.order?.default_common_name
              }
              default_common_name={taxonomyData?.order?.default_common_name}
              backgroundColor={opacityColor(constThemeColor?.onPrimary, 60)}
            />
            <TaxonomyHirarchyCard
              title={"Family"}
              name={
                taxonomyData?.famely?.name
                  ? taxonomyData?.famely?.name
                  : taxonomyData?.famely?.default_common_name
              }
              default_common_name={taxonomyData?.famely?.default_common_name}
              backgroundColor={opacityColor(constThemeColor?.onPrimary, 70)}
            />
            <TaxonomyHirarchyCard
              title={"Genus"}
              name={
                taxonomyData?.genus?.name
                  ? taxonomyData?.genus?.name
                  : taxonomyData?.genus?.default_common_name
              }
              default_common_name={taxonomyData?.genus?.default_common_name}
              backgroundColor={opacityColor(constThemeColor?.onPrimary, 80)}
            />

            <TaxonomyHirarchyCard
              title={"Species"}
              name={
                taxonomyData?.complete_name
                  ? taxonomyData?.complete_name
                  : taxonomyData?.species_common_name
              }
              default_common_name={taxonomyData?.species_common_name}
              backgroundColor={constThemeColor?.onPrimary}
            />
          </View>
        )}
      </Tabs.ScrollView>
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: reduxColors.surfaceVariant,
    },
    container: {
      //flex: 1,
    },

    headerContainer: {
      // height: "100%",
      width: "100%",
    },
    bgImage: {
      height: "100%",
      width: "100%",
    },
    row: {
      paddingTop: "4%",
      paddingBottom: "4%",
      marginHorizontal: "8%",
      flexDirection: "row",
    },
    title: {
      color: "slategrey",
      fontSize: FontSize.Antz_Strong,
    },
    cardContainer: {
      marginHorizontal: Spacing.minor,
      //marginVertical: 8,
      marginTop: Spacing.body,
      // height: heightPercentageToDP(18.5),
    },

    cardContainerios: {
      marginHorizontal: Spacing.minor,
      marginVertical: Spacing.small,
      marginTop: Spacing.body,
      // height: heightPercentageToDP(18.5),
    },

    dataContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      bottom: 10,
    },
    DefaultHeaderContainer: {
      //height: "20%",
      width: "100%",
      backgroundColor: Colors.ImageBackgroundColor,
    },
    cardTitle: {
      color: reduxColors.onSurface,
      fontWeight: FontSize.Antz_Large_Title.fontWeight,
      fontSize: FontSize.Antz_Minor,
      margin: 15,
    },
    cardNumber: {
      fontSize: FontSize.Antz_Large_Title.fontSize,
      fontWeight: FontSize.Antz_Large_Title.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    cardNumberTitle: {
      color: "#666666",
    },
    dataRow: {
      alignItems: "center",
    },
    tagsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    tag: {
      backgroundColor: "#f0f0f0",
      borderRadius: 8,
      paddingHorizontal: 8,
      marginRight: 8,
    },

    malechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 6,
      backgroundColor: reduxColors.secondaryContainer,
      marginHorizontal: widthPercentageToDP(0.5),
      // marginLeft: widthPercentageToDP(2),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    femalechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 6,
      backgroundColor: reduxColors.errorContainer,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      marginHorizontal: widthPercentageToDP(0.5),
    },
    undeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 6,
      backgroundColor: reduxColors.surface,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    indeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 6,
      backgroundColor: reduxColors.surface,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    malechipText: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onSecondaryContainer,
    },
    femalechipText: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onErrorContainer,
    },
    undeterminedText: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.error,
    },
    indeterminedText: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },

    malechipM: {
      backgroundColor: reduxColors.surfaceVariant,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      marginHorizontal: 5,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    femalechipF: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.secondary,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      marginLeft: 5,
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
    showAll: {
      alignItems: "center",
      justifyContent: "center",
      marginRight: widthPercentageToDP(0.5),
      backgroundColor: reduxColors.onPrimary,
      paddingHorizontal: 5,
      // paddingVertical: 2,
      borderRadius: 6,
    },
    showAllText: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
      paddingHorizontal: Spacing.mini,
    },

    cardContainerTaxonomy: {
      justifyContent: "flex-start",
      alignItems: "center",
      marginLeft: Spacing.small,
    },
    titleStyle: {
      color: reduxColors.onSurfaceVariant,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      paddingHorizontal: Spacing.small,
    },
  });
