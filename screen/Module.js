import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Header from "../components/Header";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Configs from "../configs/Config";

import { SvgXml, SvgUri } from "react-native-svg";
import gridIcon from "../assets/grid.svg";
import listIcon from "../assets/list.svg";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import { useFilteredArray } from "../components/Custom_hook/UserPermissionHook";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { getAsyncData } from "../utils/AsyncStorageHelper";

const data = [
  {
    id: 1,
    fullName: "",
    avatarUrl: Configs.BASE_APP_URL + "menu_icons/menuicon_collections.svg",
    screen: "Collections",
    menuDisplayName: "Collections",
    key: "collection_view_insights",
  },
  {
    id: 2,
    fullName: "",
    avatarUrl: Configs.BASE_APP_URL + "menu_icons/menuicon_housing.svg",
    screen: "Housing",
    menuDisplayName: "Housing",
    key: "enable_housing",
  },
  {
    id: 3,
    fullName: "",
    avatarUrl: Configs.BASE_APP_URL + "menu_icons/menuicon_users.svg",
    screen: "ListStaff",
    menuDisplayName: "Users",
    key: "not_required",
  },
  {
    id: 4,
    fullName: "",
    avatarUrl: Configs.BASE_APP_URL + "menu_icons/menuicon_medical.svg",
    screen: "MedicalRecord",
    key: "medical_records",
    menuDisplayName: "Records",
    subKey: "medical_records_access",
  },
  {
    id: 5,
    fullName: "",
    avatarUrl: Configs.BASE_APP_URL + "menu_icons/menuicon_tasks.svg",
    screen: "ApprovalTask",
    menuDisplayName: "Approvals",
    key: "approval_move_animal_external",
  },
  {
    id: 6,
    fullName: "",
    avatarUrl: Configs.BASE_APP_URL + "menu_icons/menuicon_reports.svg",
    screen: "AnimalModuleStats",
    menuDisplayName: "Animals",
    key: "collection_animal_records",
  },
  {
    id: 7,
    fullName: "",
    avatarUrl: Configs.BASE_APP_URL + "menu_icons/menuicon_reports.svg",
    screen: "MortalityScreen",
    menuDisplayName: "Mortality",
    key: "access_mortality_module",
  },
  // {
  //   id: 8,
  //   fullName: "",
  //   avatarUrl: Configs.BASE_APP_URL + "menu_icons/menuicon_lab.svg",
  //   screen: "LabRequestsFilter",
  //   menuDisplayName: "Lab",
  //   key: "lab_test_mapping",
  // },
  // {
  //   id: 9,
  //   fullName: "",
  //   avatarUrl: Configs.BASE_APP_URL + "menu_icons/menuicon_communication.svg",
  //   screen: "Chats",
  //   menuDisplayName: "Communication",
  //   key: "not_required",
  // },
  // {
  //   id: 10,
  //   fullName: "",
  //   avatarUrl: Configs.BASE_APP_URL + "menu_icons/menuicon_communication.svg",
  //   screen: "ListOfProduct",
  //   menuDisplayName: "Pharmacy",
  //   key: "add_pharmacy",
  // },
  // {
  //   id: 11,
  //   fullName: "",
  //   avatarUrl: Configs.BASE_APP_URL + "menu_icons/menuicon_egg.svg",
  //   screen: "EggLists",
  //   menuDisplayName: "Eggs",
  //   key: "collection_animal_records",
  // },

  // {
  //   id: 12,
  //   fullName: "",
  //   avatarUrl: Configs.BASE_APP_URL + "menu_icons/menuicon_diet.svg",
  //   screen: "",
  //   menuDisplayName: "Diet",
  //   key: "not_required",
  // },
  // {
  //   id: 13,
  //   fullName: "",
  //   avatarUrl: Configs.BASE_APP_URL + "menu_icons/menuicon_feeding.svg",
  //   screen: "",
  //   menuDisplayName: "Feeding",
  //   key: "not_required",
  // },
  // {
  //   id: 14,
  //   fullName: "",
  //   avatarUrl: Configs.BASE_APP_URL + "menu_icons/menuicon_inventory.svg",
  //   screen: "",
  //   menuDisplayName: "Inventory",
  //   key: "not_required",
  // },
  // {
  //   id: 15,
  //   fullName: "",
  //   avatarUrl: Configs.BASE_APP_URL + "menu_icons/menuicon_kitchen.svg",
  //   screen: "",
  //   menuDisplayName: "Kitchen",
  //   key: "not_required",
  // },
  // {
  //   id: 16,
  //   fullName: "",
  //   avatarUrl: Configs.BASE_APP_URL + "menu_icons/menuicon_reports.svg",
  //   screen: "",
  //   menuDisplayName: "Reports",
  //   key: "not_required",
  // },
  // {
  //   id: 17,
  //   fullName: "",
  //   avatarUrl: Configs.BASE_APP_URL + "menu_icons/Grave.svg",
  //   screen: "MortalityReason",
  //   menuDisplayName: "Mortality",
  //   key: "not_required",
  // },
  {
    id: 18,
    fullName: "",
    avatarUrl: Configs.BASE_APP_URL + "menu_icons/menuicon_reports.svg",
    screen: "DispenseList",
    menuDisplayName: "Pharmacy",
    // key: "medical_records",
    // subKey: "medical_records_access",
    key: "not_required",
  },
];

const Module = () => {
  const navigation = useNavigation();
  const [isGridView, setIsGridView] = useState(true);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [selectedIcon, setSelectedIcon] = useState(1);
  const [isHideStats, setIsHideStats] = useState(null);
  const { height, width } = Dimensions.get("window");
  const aspectRatio = height / width;
  let isTablet = false;
  const siteList = useSelector((state) => state.sites.sites);
  const storeLisRedux = useSelector(
    (state) => state.PharmacyAccessSlice?.pharmacyData?.pharmacy
  )??[];
  const filterDispense = storeLisRedux?.filter(
    (item) =>
      item?.permission?.dispense_medicine ||
      item?.permission?.pharmacy_module == "allow_full_access"
  );
  const menuItems = useFilteredArray(data);
  const filterMenuItems = (data) => {
    if (filterDispense?.length === 0) {
      return data.filter((item) => item.menuDisplayName !== "Pharmacy");
    } else {
      return data;
    }
  };
  const moduleData = useMemo(() => {
    let moduleList = [];
    moduleList = menuItems;
    if (isHideStats) {
      let moduleListFilter = moduleList?.filter(
        (element) => element?.key !== "collection_view_insights"
      );
      return filterMenuItems(moduleListFilter);
      return;
    } else {
      return filterMenuItems(moduleList);
    }
    // return moduleList;
  }, [isHideStats, menuItems]);

  if (aspectRatio > 1.6) {
    isTablet = false;
  } else {
    isTablet = true;
  }

  const cardSpacing = 8;
  let cardWidth = (Dimensions.get("window").width - 2 * cardSpacing - 32) / 2;

  const [isPortrait, setIsPortrait] = useState(
    Dimensions.get("window").height > Dimensions.get("window").width
  );

  const updateOrientation = () => {
    const isNowPortrait =
      Dimensions.get("window").height > Dimensions.get("window").width;
    setIsPortrait(isNowPortrait);

    cardWidth = (Dimensions.get("window").width - 2 * cardSpacing - 32) / 2;
  };

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
    const changeListener = Dimensions.addEventListener(
      "change",
      updateOrientation
    );
    return () => {
      if (changeListener) {
        changeListener.remove();
      }
    };
  }, []);

  const moduleNavigate = (screen) => {
    if (siteList.length == 1 && screen == "Housing") {
      navigation.navigate("siteDetails", {
        id: siteList[0].site_id,
      });
    } else {
      navigation.navigate(screen);
    }
  };
  return (
    <>
      <Header
        noIcon={true}
        title={"Modules"}
        customBack={() => navigation.navigate("Home")}
        showBackButton={false}
        hideMenu={true}
      />
      <View style={reduxColors.mainContainer}>
        <View
          style={{
            paddingHorizontal: Spacing.minor,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: FontSize.Antz_Body_Medium.fontSize,
              fontWeight: FontSize.Antz_Body_Medium.fontWeight,
              color: constThemeColor.onSurfaceVariant,
            }}
          >
            View
          </Text>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setIsGridView(true);
              setSelectedIcon(1);
            }}
            style={{
              width: 36,
              height: 36,
              justifyContent: "center",
            }}
          >
            {/* <SvgXml
              xml={gridIcon}
              height={20}
              width={20}
              style={{ alignSelf: "flex-end" }}
            /> */}
            <MaterialCommunityIcons
              name="view-grid"
              size={24}
              color={
                selectedIcon === 1
                  ? constThemeColor.primary
                  : constThemeColor.neutralPrimary
              }
              style={{ alignSelf: "flex-end" }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setIsGridView(false);
              setSelectedIcon(2);
            }}
            style={{
              width: 36,
              height: 36,
              justifyContent: "center",
            }}
          >
            {/* <SvgXml
              xml={listIcon}
              height={20}
              width={20}
              style={{ alignSelf: "flex-end" }}
            /> */}
            <MaterialIcons
              name="format-list-bulleted"
              size={24}
              color={
                selectedIcon === 2
                  ? constThemeColor.primary
                  : constThemeColor.neutralPrimary
              }
              style={{ alignSelf: "flex-end" }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            reduxColors.flatListBox,
            {
              alignItems: moduleData?.length == 1 ? "flex-start" : "center",
            },
          ]}
        >
          <FlatList
            data={moduleData}
            numColumns={isGridView ? 2 : 1}
            key={
              isGridView
                ? isPortrait
                  ? "GridView-Portrait"
                  : "GridView-Landscape"
                : "ListView"
            }
            showsVerticalScrollIndicator={false}
            style={isGridView ? reduxColors.gridBox : reduxColors.listBox}
            renderItem={({ item }) => (
              <View>
                <TouchableHighlight
                  activeOpacity={0.5}
                  onPress={() => {
                    // if (item.screen) navigation.navigate(item.screen);
                    moduleNavigate(item.screen);
                  }}
                  underlayColor="#00D6C9"
                  style={
                    isGridView
                      ? [
                          moduleData?.length == 1
                            ? reduxColors.touchableHighlightGridFor1
                            : reduxColors.touchableHighlightGrid,
                        ]
                      : reduxColors.touchableHighlightList
                  }
                >
                  <View
                    style={
                      isGridView
                        ? [
                            reduxColors.imageBox,
                            {
                              // width: isTablet ? 225 : cardWidth,
                              // height: isTablet ? 225 : cardWidth,

                              width: cardWidth,
                              height: isTablet ? 275 : cardWidth,
                            },
                          ]
                        : reduxColors.imageListBox
                    }
                  >
                    <SvgUri
                      width={isGridView ? (isTablet ? 100 : 46) : 36}
                      height={isGridView ? (isTablet ? 100 : 46) : 36}
                      uri={item.avatarUrl}
                    />
                    <Text
                      style={
                        isGridView
                          ? [
                              reduxColors.gridMenuLabel,
                              {
                                fontSize: isTablet
                                  ? FontSize.Antz_Major_Regular.fontSize
                                  : FontSize.Antz_Minor_Title.fontSize,
                              },
                            ]
                          : reduxColors.listMenuLabel
                      }
                    >
                      {item.menuDisplayName}
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: reduxColors.surfaceVariant,
    },
    flatListBox: {
      flex: 1,
      // alignItems: "center",
      flexDirection: "column",
      overflow: "hidden",
      backgroundColor: reduxColors.surfaceVariant,
      marginTop: 10,
    },
    gridBox: {},
    listBox: {
      width: "100%",
    },
    touchableHighlightGrid: {
      margin: 8,
      borderRadius: 10,
    },
    touchableHighlightGridFor1: {
      marginHorizontal: Spacing.minor,
      margin: 8,
      borderRadius: 10,
    },
    touchableHighlightList: {
      marginHorizontal: Spacing.minor,
      marginVertical: 5,
      borderRadius: 5,
    },
    imageBox: {
      backgroundColor: reduxColors.onPrimary,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
    },
    imageListBox: {
      backgroundColor: reduxColors.onPrimary,
      alignItems: "center",
      height: 60,
      borderRadius: 5,
      display: "flex",
      flex: 1,
      flexDirection: "row",
      paddingHorizontal: 10,
    },
    image: {
      alignSelf: "center",
      marginRight: 12,
      marginLeft: 5,
    },
    gridMenuLabel: {
      color: reduxColors.onSurfaceVariant,
      // fontSize: heightPercentageToDP(2),
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      marginTop: 10,
    },
    listMenuLabel: {
      color: reduxColors.onSurfaceVariant,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      marginLeft: 10,
    },
  });

export default Module;
