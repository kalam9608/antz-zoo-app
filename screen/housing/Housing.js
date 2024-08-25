import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import React, { useState } from "react";
import Loader from "../../components/Loader";
import Header from "../../components/Header";
import {
  checkPermissionAndNavigate,
  ifEmptyValue,
  shortenNumber,
} from "../../utils/Utils";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  getSectioninsight,
  getHousingSection,
  getHousingSiteList,
} from "../../services/housingService/SectionHousing";
import { ActivityIndicator, FAB, Menu } from "react-native-paper";
import HounsingCard from "../../components/housing/HounsingCard";
import ListEmpty from "../../components/ListEmpty";
import { RefreshControl } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import HousingInsightCom from "../../components/HousingInsightCom";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { removeAnimalMovementData } from "../../redux/AnimalMovementSlice";
import ModalFilterComponent, {
  ModalTitleData,
} from "../../components/ModalFilterComponent";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";

import InsightsSiteFilter from "../../components/InsightsSiteFilter";
import CustomSiteCard from "../../components/CustomSiteCard";
import { getHomeStat } from "../../services/StatsService";
import { getAsyncData } from "../../utils/AsyncStorageHelper";
import { AnimalStatsType } from "../../configs/Config";

const DATA = [
  { id: 1, key: "insights" },
  { id: 2, key: "sections" },
];

export const Sectionlist = ({
  siteData,
  siteDataLength,
  navigation,
  handleSiteSelect,
  pageNo,
  permission,
  isHideStats,
  selectedId,
  siteTotalCount,
  isLoading,
}) => {
  const site = useSelector((state) => state.sites.sites);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [sites, setSites] = useState([]);
  const [sitename, setSitename] = useState("");
  const [housingInshightModal, setHousingInshightModal] = useState(false);
  const [selectedCheckBox, setselectedCheckBox] = useState(selectedId ?? null);

  const closeMenu = (item) => {
    setselectedCheckBox(item.id);
    setSitename(item.name);
    handleSiteSelect(item);
    closePrintModal();
  };

  useEffect(() => {
    let data = site;
    let obj = {
      id: null,
      name: "All Sites",
    };
    data = data.map((item) => ({
      id: item.site_id,
      name: item.site_name,
    }));
    data.unshift(obj);
    setSites(data);

    setSitename(data.find((e) => e.id == selectedId)?.name);
  }, []);

  const isSelectedId = (id) => {
    return selectedCheckBox == id;
  };

  const truncateWord = (word) => {
    if (word?.length > 30) {
      return word?.substring(0, 30) + "...";
    }
    return word;
  };

  const togglePrintModal = () => {
    setHousingInshightModal(!housingInshightModal);
  };

  const closePrintModal = () => {
    setHousingInshightModal(false);
  };

  return (
    <>
      <View>
        {Number(siteTotalCount) !== 0 &&
          !isHideStats &&
          permission["housing_view_insights"] && (
            <View style={reduxColors.textbox}>
              <Text style={reduxColors.textStyle}>
                {Number(siteTotalCount) == 1
                  ? `${siteTotalCount} Site`
                  : `${siteTotalCount} Sites`}
              </Text>
            </View>
          )}
        {siteDataLength === 0 && pageNo < 2 ? (
          <ListEmpty visible={isLoading} />
        ) : (
          <FlatList
            data={siteData}
            keyExtractor={(item) => item.section_id}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.4}
            renderItem={({ item }) => {
              return (
                // <HounsingCard
                //   style={reduxColors.containerStyle}
                //   title={item.section_name}
                //   incharge={item.incharge_name ? item.incharge_name : "NA"}
                //   sitename={item?.site_name ?? "NA"}
                //   chip1={
                //     permission["housing_view_insights"]
                //       ? "Enclosures " + shortenNumber(item.total_enclosures)
                //       : null
                //   }
                //   chip2={
                //     permission["housing_view_insights"]
                //       ? "Animals " + shortenNumber(item.total_animals)
                //       : null
                //   }
                //   onPress={() =>
                //     navigation.navigate("HousingEnclosuer", {
                //       section_id: item?.section_id ?? 0,
                //       sectiondata: item,
                //       incharge_name: item.incharge_name
                //         ? item.incharge_name
                //         : "NA",
                //     })
                //   }
                // />
                <CustomSiteCard
                  title={item.site_name}
                  incharge={item.incharge_name ? item.incharge_name : "NA"}
                  animalCount={shortenNumber(item.animal_count)}
                  speciesCount={shortenNumber(item.species_count)}
                  encCount={shortenNumber(item.enclosure_count)}
                  sectionCount={shortenNumber(item.section_count)}
                  InchargePhoneNumber={item.incharge_mobile_no}
                  images={item.images}
                  permission={permission}
                  isHideStats={isHideStats}
                  onPress={() =>
                    navigation.navigate("siteDetails", {
                      id: item.site_id,
                    })
                  }
                />
              );
            }}
          />
        )}
      </View>
    </>
  );
};

const Housing = (props) => {
  const [siteData, setSiteData] = useState([]);
  const [siteDataLength, setSiteDataLength] = useState(0);
  const [siteTotalCount, setSiteTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [insightData, setInsightData] = useState({});
  const site = useSelector((state) => state.sites.sites);
  const [selectedId, setSelectedId] = useState(
    site.filter((item) => item.site_id == props?.route?.params?.site?.id)
      .length > 0
      ? props?.route?.params?.site?.id
      : null
  );
  const [isHideStats, setIsHideStats] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      setPage(1);
      getHomeData();
      fetchSiteData(1);
      getHideStatsValue();

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [])
  );

  const getHideStatsValue = async () => {
    const value = await getAsyncData("@antz_hide_stats");
    setIsHideStats(value);
  };

  const handleSiteSelect = (e) => {
    setSelectedId(e.id);
  };

  const fetchSiteData = (page_count) => {
    let requestObj = {
      page_no: page_count,
    };
    getHousingSiteList(requestObj)
      .then((res) => {
        let dataArr = page_count == 1 ? [] : siteData;
        if (res) {
          setSiteDataLength(res.data.result.length);
          setSiteData(dataArr.concat(res.data.result));
          setSiteTotalCount(res.data.total_count);
        } else {
          setSiteDataLength(0);
        }
        setIsLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
        setRefreshing(false);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const getHomeData = async () => {
    try {
      const res = await getHomeStat(zooID);
      if (res) {
        // if (permission["housing_view_insights"]) {
        setInsightData(res.data.zoo_stats);
        // }
        // setShowStat(true);
      }
    } catch (e) {
      console.log({ e });
    }
  };

  // const insightsData = () => {
  //   let requestObj = {
  //     zoo_id: zooID,
  //     selected_site_id: selectedId,
  //   };
  //   if (permission["housing_view_insights"]) {
  //     getSectioninsight(requestObj)
  //       .then((res) => {
  //         setInsightData(res.data.stats);
  //       })
  //       .catch((err) => {
  //         // errorToast("Oops!", "Something went wrong!!");
  //       })
  //       .finally(() => {
  //         return true;
  //       });
  //   }
  // };

  const handleLoadMore = () => {
    if (!isLoading && siteDataLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSiteData(nextPage);
    }
  };

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (isLoading || siteDataLength == 0 || siteDataLength < 10) return null;
    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };

  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;
  // fot taking styles from redux use this function
  const dispatch = useDispatch();
  const permission = useSelector((state) => state.UserAuth.permission);

  const onPress = (item) => {
    if (item?.name == "Sections") {
      navigation.navigate("AllListingData", {
        ref_type: "zoo",
        data_type: "section",
        ref_id: zooID,
        total_count: shortenNumber(item?.value),
      });
    } else if (item?.name == "Enclosures") {
      navigation.navigate("AllListingData", {
        ref_type: "zoo",
        data_type: "enclosure",
        ref_id: zooID,
        total_count: shortenNumber(item?.value),
      });
    } else if (item?.name == "Animals") {
      navigation.navigate("AnimalList", {
        type: AnimalStatsType.allAnimals,
        name: "All Animals",
      });
    } else if (item?.name == "Species") {
      navigation.navigate("AllListingData", {
        ref_type: "zoo",
        data_type: "species",
        ref_id: zooID,
        total_count: shortenNumber(item?.value),
      });
    }
  };

  return (
    <>
      <Loader visible={isLoading} />
      <Header
        title="Housing"
        noIcon={true}
        search={true}
        hideMenu={true}
        gotoSearchPage={() =>
          navigation.navigate("SearchScreen", { SearchType: "site" })
        }
        // customBack={() =>
        //   navigation.navigate("HomeScreen", {
        //     screen: "Menu",
        //   })
        // } // Added for AF-959 and remove this code for AF-1570
        style={
          {
            // paddingBottom: widthPercentageToDP("2%"),
            // paddingTop: widthPercentageToDP("2%"),
            // marginBottom: heightPercentageToDP(1),
          }
        }
      />
      <View
        style={[
          reduxColors.container,
          {
            backgroundColor: constThemeColor.surfaceVariant,
          },
        ]}
      >
        <Loader visible={isLoading} />
        {/* <CustomSiteCard /> */}
        <FlatList
          data={DATA}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<ListEmpty visible={isLoading} />}
          renderItem={({ item }) =>
            item.key == "insights" ? (
              <View style={reduxColors.headerCard}>
                {!isHideStats && permission["housing_view_insights"] && (
                  <HousingInsightCom
                    section={
                      isNaN(insightData?.total_sections)
                        ? "--"
                        : shortenNumber(insightData?.total_sections)
                    }
                    species={
                      isNaN(insightData?.total_species)
                        ? "--"
                        : shortenNumber(insightData?.total_species)
                    }
                    enclosures={
                      isNaN(insightData?.total_enclosures)
                        ? "--"
                        : shortenNumber(insightData?.total_enclosures)
                    }
                    animal={
                      isNaN(insightData?.total_animals)
                        ? "--"
                        : shortenNumber(insightData?.total_animals)
                    }
                    sites={
                      isNaN(insightData?.total_sites)
                        ? "--"
                        : shortenNumber(insightData?.total_sites)
                    }
                    showsSiteFilter={true}
                    handleSiteSelect={handleSiteSelect}
                    selectedId={selectedId}
                    onPress={onPress}
                  />
                )}
              </View>
            ) : item.key == "sections" ? (
              <Sectionlist
                siteData={siteData}
                siteDataLength={siteDataLength}
                navigation={navigation}
                handleSiteSelect={(e) => handleSiteSelect(e)}
                selectedSite={selectedId}
                pageNo={page}
                permission={permission}
                isHideStats={isHideStats}
                selectedId={selectedId}
                siteTotalCount={siteTotalCount}
                isLoading={isLoading}
              />
            ) : null
          }
          onEndReachedThreshold={0.4}
          onEndReached={handleLoadMore}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                setPage(1);
                fetchSiteData(1);
              }}
            />
          }
        />
      </View>
      <FAB.Group
        open={open}
        fabStyle={reduxColors.fabStyle}
        visible
        icon={open ? "close-circle-outline" : "plus-circle-outline"}
        actions={[
          {
            icon: "plus",
            label: "Add Site",
            onPress: () => {
              dispatch(removeAnimalMovementData());
              checkPermissionAndNavigate(
                permission,
                "add_sites",
                navigation,
                "AddZooSite"
              );
            },
          },
          // {
          //   icon: "plus",
          //   label: "Add Section",
          //   onPress: () => {
          //     dispatch(removeAnimalMovementData());
          //     checkPermissionAndNavigate(
          //       permission,
          //       "housing_add_section",
          //       navigation,
          //       "Section",
          //       {
          //         selcted_site: selectedId,
          //       }
          //     );
          //   },
          // },
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
    </>
  );
};

export default Housing;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    headerCard: {
      backgroundColor: reduxColors.surface,
      borderRadius: 15,
      marginHorizontal: Spacing.minor,
      //marginTop: 5,
    },

    textbox: {
      //marginTop: heightPercentageToDP(2),
      marginTop: Spacing.minor,
      marginBottom: Spacing.small,
      marginHorizontal: Spacing.major,
      //marginHorizontal: widthPercentageToDP(5),
      alignItems: "flex-start",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    textStyle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      textAlign: "center",
      color: reduxColors.onSurfaceVariant,
    },
    listitemBox: {
      marginTop: heightPercentageToDP(2),
    },
    containerStyle: {
      marginVertical: Spacing.mini,
      marginHorizontal: Spacing.minor,
      borderRadius: 10,
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
  });
