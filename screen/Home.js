import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Animated,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  AccessionData,
  MasterHomeData,
  PrintLabel,
  data,
} from "../configs/Config";
import { buttonData } from "../configs/Config";
import Header from "../components/Header";
import FloatingButton from "../components/FloatingButton";
import { BottomPopUp } from "../components/BottomSheet";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import HomeStat from "../components/HomeStat";
//Import API CALLS
import { getHomeStat } from "../services/StatsService";
import DemoCard from "../components/DemoCard";
import Loader from "../components/Loader";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../configs/Colors";
import { removeAnimalMovementData } from "../redux/AnimalMovementSlice";
import { removeAddMedicalPage, removeMedical } from "../redux/MedicalSlice";
import { removeAnimalTransferData } from "../redux/AnimalTransferSlice";
import { getDeviceData, getDeviceInformation } from "../utils/Utils";
import { manageDeviceLog } from "../services/staffManagement/addPersonalDetails";
import FontSize from "../configs/FontSize";
import { errorToast } from "../utils/Alert";
import DragDrop from "../components/DragDrop";
import { getRefreshToken } from "../services/AuthService";
import {
  clearAsyncData,
  getAsyncData,
  saveAsyncData,
} from "../utils/AsyncStorageHelper";
import { setPassCode, setSignIn, setSignOut } from "../redux/AuthSlice";
import { setSites } from "../redux/SiteSlice";
import ModalWindowComponent from "../components/ModalWindowComponent";

import { useFilteredArray } from "../components/Custom_hook/UserPermissionHook";

import Spacing from "../configs/Spacing";
import { SvgXml } from "react-native-svg";
import Vantara_logo from "../assets/Vantara_logo.svg";
import { getObservationList } from "../services/ObservationService";
import ObservationCard from "./Observation/ObservationCard";
import { HomeBottomSheet } from "../components/HomeBottomSheet";
import Constants from "../configs/Constants";
import { useToast } from "../configs/ToastConfig";
import { setPharmacyData } from "../redux/PharmacyAccessSlice";

// import { Image } from "expo-image";
const DATA = [
  { id: 1, key: "insights" },
  { id: 2, key: "paradise" },
];

const height = Dimensions.get("window").height;
const CONTAINER_HEIGHT = 90; //hp(13.8);
const HomeScreen = (props) => {
  //Getting current ZooID
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const userDetails = useSelector((state) => state.UserAuth.userDetails);

  const permission = useSelector((state) => state.UserAuth.permission);

  //Control HomeStat Card
  const [showStat, setShowStat] = useState(false);

  //HomeStat Data
  const [insightData, setInsightData] = useState([]);
  const [route, setRoute] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const scrollY = useRef(new Animated.Value(0)).current;
  const offSetAnim = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = React.useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [dropInThePit, setDropInThePit] = useState(false);
  const [button_data, setButtonData] = React.useState(buttonData);
  const menuItems = useFilteredArray(button_data);
  const masterMenu = useFilteredArray(MasterHomeData);
  const [latestObservation, setLatestObservation] = useState([]);
  const [isHideStats, setIsHideStats] = useState(null);
  const { successToast, warningToast, errorToast, showToast } = useToast();

  // state for home bottom modal
  const [isVisibleHomeBottom, setIsVisibleHomeBottom] = useState(false);
  const onShowPopUp = () => {
    setIsVisibleHomeBottom(!isVisibleHomeBottom);
  };
  const closeHomeBottomSheet = () => {
    setIsVisibleHomeBottom(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      setRoute(true);
      getHideStatsValue();
      getDeviceDetails();
      dispatch(removeAnimalMovementData());
      dispatch(removeMedical());
      dispatch(removeAnimalTransferData());
      dispatch(removeAddMedicalPage());
      fetchHomeData();
      return () => {
        // You can perform cleanup when the screen loses focus if needed
      };
    }, [])
  );

  const getHideStatsValue = async () => {
    const value = await getAsyncData("@antz_hide_stats");
    setIsHideStats(value);
  };

  const fetchHomeData = async () => {
    setRefreshing(true);
    try {
      await getHomeData();
      getLatestObservation();
    } catch (error) {
      // console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  const getDeviceDetails = async () => {
    try {
      const data = await getDeviceInformation();
      let obj = {
        user_id: userDetails?.user_id,
        user_name: userDetails?.user_name,
        zoo_id: zooID,
        type: "home",
        device_details: data.device,
        lat: data.lat,
        long: data.long,
      };
      await manageDeviceLog(obj);
    } catch (e) {
      console.log(e);
    }
  };
  const getHomeData = async () => {
    try {
      const res = await getHomeStat(zooID);
      if (res) {
        setInsightData(res.data);
        setShowStat(true);
      }
    } catch (e) {
      console.log({ e });
    }
  };
  const storeLisRedux =
    useSelector((state) => state.PharmacyAccessSlice?.pharmacyData?.pharmacy) ??
    [];
  const filterDispense = storeLisRedux?.filter(
    (item) =>
      item?.permission?.dispense_medicine ||
      item?.permission?.pharmacy_module == "allow_full_access"
  );
  const filterMenuItems = (data) => {
    if (filterDispense?.length === 0) {
      return data.filter((item) => item.screen !== "AddDispenseMedicine");
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

  const fetchRefreshTokenData = async () => {
    try {
      getDeviceData().then((DeviceDataRes) => {
        if (DeviceDataRes) {
          getRefreshToken({ device_details: DeviceDataRes }).then(
            (response) => {
              if (response) {
                if (!response.success) {
                  warningToast("Oops!!", response.message);
                  clearAsyncData("@antz_user_device_token");
                  clearAsyncData("@antz_user_data");
                  clearAsyncData("@antz_user_token");
                  clearAsyncData("@antz_selected_site");
                  dispatch(setSignOut());
                  dispatch(setPassCode(null));
                  dispatch(setPharmacyData([]));
                } else {
                  saveAsyncData(
                    "@antz_user_device_token",
                    DeviceDataRes.device_token
                  );
                  saveAsyncData("@antz_user_token", response.token);
                  saveAsyncData("@antz_max_upload_sizes", response?.settings);
                  dispatch(setPharmacyData(response?.modules?.pharmacy_data));
                  dispatch(setSignIn(response));
                  dispatch(setSites(response?.user?.zoos[0]?.sites));
                  setButtonData(buttonData);
                }
              }
            }
          );
        }
      });
    } catch (e) {
      console.log({ e });
    } finally {
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // setShowLoader(true);
    await loadDataForHome();
    setRefreshing(false);
    // setShowLoader(false);
  }, []);

  const loadDataForHome = async () => {
    await getHomeData();
    await getLatestObservation();
    await fetchRefreshTokenData();
  };

  const accordionHeight = useRef(new Animated.Value(0)).current;

  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: "clamp",
      }),
      offSetAnim
    ),
    0,
    CONTAINER_HEIGHT
  );
  const Translate = clampedScroll.interpolate({
    inputRange: [0, CONTAINER_HEIGHT],
    outputRange: [0, -CONTAINER_HEIGHT],
    extrapolate: "clamp",
  });
  let popUpRef = React.createRef();

  const onIconClick = (item) => {
    if (item.screen == "Accession") {
      closeHomeBottomSheet();
      setTimeout(() => {
        setModalOpen(!modalOpen);
      }, Constants.GLOBAL_ALERT_TIMEOUT_VALUE);
    } else if (item.buttonTitle == "Master") {
      closeHomeBottomSheet();
      setTimeout(() => {
        setModalOpenMasterData(!modalOpenMasterData);
      }, Constants.GLOBAL_ALERT_TIMEOUT_VALUE);
    } else if (item.buttonTitle == "Get Print Label") {
      closeHomeBottomSheet();
      setTimeout(() => {
        setPrintModalOpen(!printModalOpen);
      }, Constants.GLOBAL_ALERT_TIMEOUT_VALUE);
    } else {
      closeHomeBottomSheet();
      console.log("screen...", item.screen);
      navigation.navigate(item.screen);
    }
  };

  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);

  const drag = (x, y) => {
    console.log("Dragging:", x, y);
  };
  const drop = (x, y) => {
    console.log("Droping:", x, y);
    if (y > Dimensions.get("screen").height - 200) {
      console.log("drop in the body");
    }
  };
  // master Modal data

  const [modalOpenMasterData, setModalOpenMasterData] = useState(false);
  const toggleUserMasterModal = () => {
    setModalOpenMasterData(!modalOpenMasterData);
  };
  const closeUserMasterModal = () => {
    setModalOpenMasterData(false);
  };
  const closeModalMaster = (item) => {
    navigation.navigate(`${item}`);
    setModalOpenMasterData(!modalOpenMasterData);
  };
  // Accession data

  // Accession Modal window open
  const [modalOpen, setModalOpen] = useState(false);
  const toggleUserImageModal = () => {
    setModalOpen(!modalOpen);
  };
  const closeUserImageModal = () => {
    setModalOpen(false);
  };
  const closeModal = (item) => {
    navigation.navigate(`${item}`);
    setModalOpen(!modalOpen);
  };

  // Print label Modal window open

  const [printModalOpen, setPrintModalOpen] = useState(false);
  const togglePrintModal = () => {
    setPrintModalOpen(!printModalOpen);
  };
  const closePrintModal = () => {
    setPrintModalOpen(false);
  };
  const printModalClose = (type) => {
    navigation.navigate("PrintLabel", { type });
    setPrintModalOpen(!printModalOpen);
  };
  const window = Dimensions.get("window");
  const desiredHeight = window.height * 0.7;

  // -------------------------------------------------------------------
  let imageWidth = Dimensions.get("window").width - Spacing.minor * 2;
  const [imageHeight, setImageHeight] = useState(0);
  const [isPortrait, setIsPortrait] = useState(
    Dimensions.get("window").height > Dimensions.get("window").width
  );

  useEffect(() => {
    Image.getSize(
      Image.resolveAssetSource(require("../assets/welcome_antz.png")).uri,
      (width, height) => {
        const calculatedHeight = (imageWidth * height) / width; // Calculate the height based on the aspect ratio
        setImageHeight(calculatedHeight); // Set the calculated height in the state
      }
    );
  }, []);

  const updateOrientation = () => {
    const isNowPortrait =
      Dimensions.get("window").height > Dimensions.get("window").width;
    setIsPortrait(isNowPortrait);

    imageWidth = Dimensions.get("window").width - Spacing.minor * 2;
    Image.getSize(
      Image.resolveAssetSource(require("../assets/welcome_antz.png")).uri,
      (width, height) => {
        const calculatedHeight = (imageWidth * height) / width;
        setImageHeight(calculatedHeight);
      }
    );
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

  const getLatestObservation = () => {
    const obj = {
      zoo_id: zooID,
      is_latest: true,
      type: "all",
    };

    getObservationList(obj)
      .then((res) => {
        setLatestObservation(res?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };
  // -------------------------------------------------------------------

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: constThemeColor.surfaceVariant,
      }}
    >
      <Loader visible={showLoader} />

      <Animated.View
        style={[
          dynamicStyles.header,
          { transform: [{ translateY: Translate }] },
        ]}
      >
        <Header route={route} searchType={"Identifier"} />
      </Animated.View>
      <View
        style={{
          flex: 1,
          margin: Spacing.minor,
          marginBottom: 0,
          marginTop: 0,
        }}
      >
        <Animated.FlatList
          data={DATA}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) =>
            item.key == "insights" ? (
              <HomeStat
                insightData={insightData}
                showStat={showStat}
                insightsPermission={
                  !isHideStats && permission?.collection_view_insights == true
                    ? true
                    : false
                }
              />
            ) : item.key == "paradise" ? (
              <View style={{ marginBottom: hp(17), width: "100%" }}>
                {/* <DemoCard data={data} isSwitchOn={isSwitchOn} /> */}
                {latestObservation.length > 0 ? (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={latestObservation}
                    keyExtractor={(item, index) => index}
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
                          style={{ marginTop: 0, marginBottom: 16 }}
                        />
                      );
                    }}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                          setRefreshing(true);
                          getLatestObservation();
                        }}
                      />
                    }
                  />
                ) : (
                  <Image
                    contentFit="fill"
                    source={require("../assets/welcome_antz.png")}
                    style={{ height: imageHeight, width: imageWidth }}
                  />
                )}
              </View>
            ) : null
          }
          contentContainerStyle={dynamicStyles.contentContainer}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressViewOffset={100}
              style={{ color: Colors.blueBg }}
            />
          }
        />
      </View>
      {/* <DragDrop>   */}
      <FloatingButton onPress={onShowPopUp} icon={"plus-circle-outline"} />
      {/* </DragDrop> */}
      <View style={{}}></View>
      <HomeBottomSheet
        closeHomeBottomSheet={closeHomeBottomSheet}
        isVisibleHomeBottom={isVisibleHomeBottom}
        handleBackdropPress={closeHomeBottomSheet}
        title={"Quick Actions"}
      >
        {
          <View style={{ alignItems: "center" }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              overScrollMode="never"
              numColumns={3}
              data={moduleData}
              width="100%"
              // style={{marginBottom: 20}}
              renderItem={({ item }) => {
                return (
                  <View style={dynamicStyles.btnCont}>
                    <TouchableOpacity
                      onPress={() => onIconClick(item)}
                      accessible={true}
                      accessibilityLabel={item.buttonTitle}
                      accessibilityId={item.id}
                    >
                      <View style={{ alignItems: "center" }}>
                        <View style={dynamicStyles.bottomSheetSvg}>
                          <SvgXml
                            xml={item.icon}
                            style={{ alignSelf: "center" }}
                          />
                        </View>
                        <Text style={dynamicStyles.btnText}>
                          {item.buttonTitle}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        }
      </HomeBottomSheet>
      {/* <BottomPopUp
        ref={(target) => (popUpRef = target)}
        onTouchOutside={onClosePopUp}
        title="Add"
        style={{ backgroundColor: Colors.surface }}
      >
        {
          <View style={{ alignItems: "center" }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              overScrollMode="never"
              numColumns={3}
              data={menuItems}
              width="100%"
              style={{ marginTop: 5, marginBottom: 30 }}
              renderItem={({ item }) => {
                return (
                  <View style={dynamicStyles.btnCont}>
                    <TouchableOpacity
                      onPress={() => onIconClick(item)}
                      accessible={true}
                      accessibilityLabel={item.buttonTitle}
                      accessibilityId={item.id}
                    >
                      <View style={{ alignItems: "center" }}>
                        <AntDesign
                          name="pluscircleo"
                          size={30}
                          color={constThemeColor.neutralPrimary}
                          style={{ marginBottom: 8 }}
                        />
                        <Text style={dynamicStyles.btnText}>
                          {item.buttonTitle}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        }
      </BottomPopUp> */}
      {modalOpen ? (
        <ModalWindowComponent
          onPress={toggleUserImageModal}
          onDismiss={closeUserImageModal}
          onBackdropPress={closeUserImageModal}
          onRequestClose={closeUserImageModal}
          data={AccessionData}
          title="Accession"
          icon={
            <AntDesign name="plus" size={20} color={constThemeColor.primary} />
          }
          closeModal={closeModal}
        />
      ) : null}

      {modalOpenMasterData ? (
        <ModalWindowComponent
          onPress={toggleUserMasterModal}
          onDismiss={closeUserMasterModal}
          onBackdropPress={closeUserMasterModal}
          onRequestClose={closeUserMasterModal}
          data={masterMenu}
          title="Master"
          closeModal={closeModalMaster}
        />
      ) : null}

      {printModalOpen ? (
        <ModalWindowComponent
          onPress={togglePrintModal}
          onDismiss={closePrintModal}
          onBackdropPress={closePrintModal}
          onRequestClose={closePrintModal}
          data={PrintLabel}
          title="Print Label"
          closeModal={printModalClose}
        />
      ) : null}
    </View>
  );
};
const windowHeight = Dimensions.get("window").height;
const styles = (DarkModeReducer) =>
  StyleSheet.create({
    container: {},
    newsCont: {
      alignItems: "center",
      marginTop: 18,
    },
    newsText: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
    },
    btnCont: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "33%",
      padding: "2%",
      marginBottom: 10,
    },
    button: {
      width: "81%",
      borderRadius: 5,
    },
    btnText: {
      // fontWeight: "600",
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
    },

    contentContainer: {
      marginTop: CONTAINER_HEIGHT,
    },
    header: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      marginBottom: 10,
      zIndex: 100,
    },
    bottomSheetSvg: {
      borderWidth: 1,
      borderColor: DarkModeReducer.onSurface,
      height: 50,
      width: 50,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 100,
      marginBottom: 4,
    },
  });

export default HomeScreen;
