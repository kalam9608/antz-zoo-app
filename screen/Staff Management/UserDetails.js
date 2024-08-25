import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Linking,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Loader from "../../components/Loader";
import FloatingButton from "../../components/FloatingButton";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Entypo,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import {
  DeviceDeRegister,
  getDeviceLoggedDetails,
  getStaffDetails,
  updateUserStatus,
} from "../../services/staffManagement/addPersonalDetails";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Card } from "react-native-paper";
import Configs from "../../configs/Config";
import { useDispatch, useSelector } from "react-redux";
import DownloadFile from "../../components/DownloadFile";
import {
  ifEmptyValue,
  capitalize,
  checkPermissionAndNavigate,
  contactFun,
  dateFormatter,
  opacityColor,
  ShortFullName,
} from "../../utils/Utils";
import Config from "../../configs/Config";
import moment from "moment";
import CardTwo from "./components/cardTwo";
import {
  getStaffData,
  getRoleEditData,
  permissionSummary,
} from "../../services/staffManagement/permission";
import FontSize from "../../configs/FontSize";
import { successDailog } from "../../utils/Alert";
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
  useSharedValue,
  Extrapolate,
} from "react-native-reanimated";
import TabBarStyles from "../../configs/TabBarStyles";
import AnimatedHeader from "../../components/AnimatedHeader";
import { throttle } from "lodash";
import Spacing from "../../configs/Spacing";
import { deactivateUser } from "../../services/staffManagement/deactiveUser";
import ListEmpty from "../../components/ListEmpty";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import { RefreshControl } from "react-native-gesture-handler";
import PermissionListItem from "../../components/UtilityComponent";
import { SvgXml } from "react-native-svg";
import home_housing from "../../assets/home_housing.svg";
import { Platform } from "react-native";
import { saveAsyncData } from "../../utils/AsyncStorageHelper";
import { setSignIn } from "../../redux/AuthSlice";
import { setSites } from "../../redux/SiteSlice";
import MyJournal from "../../screen/Staff Management/Journal/MyJournal";
import { ActivityIndicator } from "react-native-paper";
import { Menu } from "react-native-paper";
import ImageViewer from "../../components/ImageViewer";
import note_alt from "../../assets/note_alt.svg";
import {
  setRefreshLoaderFalse,
  setRefreshLoaderTrue,
} from "../../redux/MyJournalSlice";

const { width, height } = Dimensions.get("window");

const UserDetails = ({ route }) => {
  const navigation = useNavigation();
  const [user_id, setUser_id] = useState(route.params?.user_id ?? 0);
  const [data, setData] = useState({});
  const [deviceData, setDeviceData] = useState([]);
  const [currentDeviceDataLEngth, setCurrentDeviceDataLEngth] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const [modalVisible, setModalVisible] = useState(false);
  const [shiftHeader, setShiftHeader] = useState(false);
  const [screenName, setScreenName] = useState("about");
  const [page, setPage] = useState(1);
  const [moreOptionVisible, setMoreOptionVisible] = useState(false);
  const [role_permissionData, setRole_permissionData] = useState({});
  const [permissionSummaryData, setPermissionSummaryData] = useState({});
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const permission = useSelector((state) => state.UserAuth.permission);
  const userDetails = useSelector((state) => state.UserAuth.userDetails);
  const styles = style(constThemeColor);
  const [peginationLoad, setPeginationLoad] = useState(false);
  const [moreOptionData, setMoreOptionData] = useState([]);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const login_user_id = userDetails.user_id;
  const alertModalOpen = () => {
    setAlertVisible(true);
  };
  const alertModalClose = () => {
    setAlertVisible(false);
  };
  const firstButtonPress = () => {
    updateStatus();
    alertModalClose();
  };
  const secondButtonPress = () => {
    alertModalClose();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const scrollOffsetY = useSharedValue(0);
  const getData = () => {
    setIsLoading(true);
    Promise.all([
      getStaffDetails({ id: user_id }),
      permissionSummary({ user_id }),
    ])
      .then((res) => {
        setData(res[0]?.data ?? {});
        setPermissionSummaryData(res[1]?.data ?? {});

        if (permission["allow_add_users"] && user_id != userDetails?.user_id) {
          setMoreOptionData([
            {
              id: 1,
              option:
                res[0]?.data?.status == "active" ? "Deactivate" : "Activate",
            },
            {
              id: 2,
              option: "Reset Password",
            },
            {
              id: 3,
              option: "Reset Passcode",
            },
          ]);
        }
        if (res[0]?.data?.user_role_id !== null) {
          getUserDetails(res[0]?.data?.user_role_id);
        }
        if (route.params?.default_tab) {
          ref.current.jumpToTab(route.params?.default_tab);
          setScreenName(route.params?.default_tab?.toLowerCase());
        }
      })
      .catch((err) => {
        // errorToast(
        //   "error",
        //   "Oops!! Something went wrong, try again later. " + JSON.stringify(err)
        // );
        errorToast("error", "Oops!! Something went wrong, try again later. ");
        navigation.goBack();
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };
  useFocusEffect(
    React.useCallback(() => {
      if (screenName == "devices") {
        setPage(1);
        setIsLoading(true);
        GetDevicesLoged(1);
      }
    }, [screenName, navigation])
  );
  const getUserDetails = (user_role_id) => {
    getRoleEditData(user_role_id)
      .then((res) => {
        setRole_permissionData(res ?? {});
        setIsLoading(false);
      })
      .catch((err) => {
        errorToast(
          "error",
          "Oops! Something went wrong!! " + JSON.stringify(err)
        );
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const DevDeregister = (item) => {
    const obj = {
      user_id: user_id,
      device_id: item?.device_id,
    };
    setIsLoading(true);
    DeviceDeRegister(obj)
      .then((res) => {
        if (res.success) {
          successToast(
            "success",
            res?.message ?? "Token status successfully updated"
          );
          setPage(1);
          GetDevicesLoged(1);
        } else {
          errorToast("error", "Oops! Something went wrong!!");
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(">------------------>", err);
        errorToast("error", "Oops! Something went wrong!!");
        setIsLoading(false);
        setPeginationLoad(false);
      })
      .finally(() => {
        setPeginationLoad(false);
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };

  const GetDevicesLoged = (page) => {
    getDeviceLoggedDetails(user_id, page)
      .then((res) => {
        if (res?.success) {
          setCurrentDeviceDataLEngth(res?.data?.length ?? 0);

          if (res.data) {
            let dataArr = page == 1 ? [] : deviceData;
            setDeviceData(dataArr.concat(res?.data));
          }
          setIsLoading(false);
          setPeginationLoad(false);
          setIsRefreshing(false);
        } else {
          setDeviceData([]);
          setCurrentDeviceDataLEngth(0);
          setIsLoading(false);
          setPeginationLoad(false);
          setIsRefreshing(false);
        }
      })
      .catch((err) => {
        console.log(">------------------>", err);
        errorToast("error", "Oops! Something went wrong!!");
        setIsLoading(false);
        setPeginationLoad(false);
        setIsRefreshing(false);
      })
      .finally(() => {
        setIsLoading(false);
        setPeginationLoad(false);
        setIsRefreshing(false);
      });
  };
  const handleLoadMore = () => {
    if (
      !isLoading &&
      currentDeviceDataLEngth >= 10 &&
      !peginationLoad &&
      deviceData?.length >= 10 &&
      !isRefreshing
    ) {
      const nextPage = page + 1;
      setPeginationLoad(true);
      setPage(nextPage);
      GetDevicesLoged(nextPage);
      console.log("=======================", nextPage);
    }
  };

  const renderFooter = () => {
    if (peginationLoad) {
      return (
        <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
      );
    }
  };
  // const [AnimatedHeaderValue] = useState(new Animated.Value(0));
  const AnimatedHeaderValue = useSharedValue(0);
  const Header_Maximum_Height = true
    ? heightPercentageToDP(30)
    : heightPercentageToDP(21);
  //Max Height of the Header
  const Header_Minimum_Height = heightPercentageToDP(10);
  //Min Height of the Header

  const animateHeaderHeight = interpolate(
    AnimatedHeaderValue,
    [0, Header_Maximum_Height],
    [Header_Maximum_Height, heightPercentageToDP(5.5)],
    Extrapolate.CLAMP
  );
  const CreateNew = () => {
    const userData = {
      personalInfo: data?.user_details?.personal_details,
      userDetails: data,
      userEducationDetails: data?.user_details?.user_education,
      userIdProof: data?.user_details?.user_id_proofs,
      userExperience: data?.user_details?.user_experience,
    };
    if (screenName === "about") {
      navigation.navigate("PersonalDetails", {
        user_id: userData?.userDetails?.user_id,
        item: userData?.personalInfo,
        user: userData?.userDetails?.user_email,
        mobile: userData?.userDetails?.user_mobile_number,
      });
    } else if (screenName === "education") {
      navigation.navigate("CreateEducation", {
        item: { item: { user_id: user_id } },
      });
    } else if (screenName === "idProof") {
      navigation.navigate("AddIdProof", { user_id: user_id });
    } else if (screenName === "workExperience") {
      navigation.navigate("AddExperience", { item: { user_id: user_id } });
    }
  };

  const handleCall = (data) => {
    let phoneNumber = typeof data !== "undefined" ? data : null;

    if (phoneNumber !== null) {
      phoneNumber = "+91" + phoneNumber;
      contactFun("tel", phoneNumber);
    }
  };
  const handleMessage = (data) => {
    let phoneNumber = typeof data !== "undefined" ? data : null;

    if (phoneNumber !== null) {
      phoneNumber = "+91" + phoneNumber;
      contactFun("sms", phoneNumber);
    }
  };

  const handleMail = (data) => {
    let email = typeof data !== "undefined" ? data : null;

    if (email !== null) {
      contactFun("mailto", email);
    }
  };

  const TAB_HEADER_ITEMS = [
    {
      id: "0",
      title: "About",
      screen: "about",
    },
    {
      id: "1",
      title: "Permissions",
      screen: "permissions",
    },
    {
      id: "2",
      title: "Education",
      screen: "education",
    },
    {
      id: "3",
      title: "Id Proofs",
      screen: "idProof",
    },
    {
      id: "4",
      title: "Work Experience",
      screen: "workExperience",
    },
    // {
    //   id: "5",
    //   title: "Site Access",
    //   screen: "siteAccess",
    // },
    {
      id: "6",
      title: "Devices",
      screen: "devices",
    },
    {
      id: "7",
      title: "Journal",
      screen: "journal",
    },
  ];
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const ref = React.useRef();
  const minimumHeaderHeight = 58;
  const stylesSheet = TabBarStyles.getTabBarStyleSheet(themeColors);
  const [header, setHeader] = useState(false);
  const [headerHeight, setHeaderHeight] = React.useState(100);

  const AppBar = ({ title, header, style, user_id }) => {
    return (
      <AnimatedHeader
        title={title}
        optionData={moreOptionData}
        hideMenu={moreOptionData.length == 0 && true}
        optionPress={optionPress}
        header={header}
        user_id={user_id}
        style={style}
      />
    );
  };

  const Profile = ({
    data,
    animHeaderValue,
    getScrollPositionOfTabs,
    getHeaderHeight,
  }) => {
    const Max_Header_Height = hp(33);
    const Min_Header_Height = 100;
    const Scroll_Distance = Max_Header_Height - Min_Header_Height;
    const animatedHeaderHeight = interpolate(
      animHeaderValue,
      [0, 400],
      [Max_Header_Height, Min_Header_Height],
      Extrapolate.CLAMP
    );
    // fot taking styles from redux use this function
    const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
    const { top, height } = useHeaderMeasurements();
    setHeaderHeight(height.value);
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

    // const reduxColors = styles(constThemeColor);
    return (
      <Animated.View
        style={{
          backgroundColor: constThemeColor.onPrimaryContainer,
          paddingTop: minimumHeaderHeight,
        }}
      >
        <Animated.View
          style={[
            {
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "center",
            },
          ]}
        >
          {shiftHeader ? null : (
            <Animated.View
              style={[
                {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              {data.profile_pic ? (
                <Animated.View
                  style={{
                    width: 124,
                    height: 124,
                    borderRadius: 62,
                    backgroundColor: constThemeColor.secondary,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Animated.Image
                    source={{ uri: data.profile_pic }}
                    style={{
                      width: 124,
                      height: 124,
                      borderRadius: 62,
                      alignSelf: "center",
                      backgroundColor: constThemeColor.secondary,
                      // marginBottom: wp("0%"),
                    }}
                  />
                </Animated.View>
              ) : (
                <Animated.View
                  style={[
                    {
                      width: 124,
                      height: 124,
                      borderRadius: 62,
                      backgroundColor: constThemeColor.secondary,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Animated.Text
                    style={{
                      fontSize: FontSize.Antz_Large_Title.fontSize,
                      fontWeight: FontSize.Antz_Large_Title.fontWeight,
                      textAlign: "center",
                      color: constThemeColor.onPrimary,
                    }}
                  >
                    {ShortFullName(
                      data?.user_first_name + " " + data?.user_last_name
                    )}
                  </Animated.Text>
                </Animated.View>
              )}

              <Text
                style={{
                  fontSize: FontSize.Antz_Major_Medium.fontSize,
                  textAlign: "center",
                  color: constThemeColor.onPrimary,
                  fontWeight: FontSize.Antz_Major_Medium.fontWeight,
                  marginTop: Spacing.body,
                }}
              >
                {data.user_first_name} {data.user_last_name}
              </Text>
              <Text
                style={{
                  fontSize: FontSize.Antz_Minor_Regular.fontSize,
                  textAlign: "center",
                  color: constThemeColor.onPrimary,
                  fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                  marginTop: Spacing.mini,
                }}
              >
                {data?.role_name ? data?.role_name : "NA"}
              </Text>
              {data.status == "in_active" ? (
                <View
                  style={{
                    borderRadius: 6,
                    backgroundColor: constThemeColor.error,
                    paddingHorizontal: Spacing.small,
                    paddingVertical: Spacing.mini,
                    marginTop: Spacing.mini,
                    shadowColor: constThemeColor.neutralPrimary,
                    shadowOffset: { width: -2, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    elevation: 4,
                  }}
                >
                  <Text
                    style={{
                      color: constThemeColor.onPrimary,
                      fontSize: FontSize.Antz_Body_Title.fontSize,
                      fontWeight: FontSize.Antz_Body_Title.fontWeight,
                    }}
                  >
                    Inactive
                  </Text>
                </View>
              ) : null}
            </Animated.View>
          )}
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.iconStyle}
              onPress={() => handleCall(data?.user_mobile_number)}
            >
              <MaterialCommunityIcons
                color={constThemeColor.primaryContainer}
                name="phone"
                // onPress={openMoreOption}
                size={30}
              />
              <Text style={styles.iconText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconStyle}
              onPress={() => handleMessage(data?.user_mobile_number)}
            >
              <MaterialIcons
                color={constThemeColor.primaryContainer}
                name="chat"
                size={30}
              />
              <Text style={styles.iconText}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconStyle}
              onPress={() => handleMail(data?.user_email)}
            >
              <MaterialCommunityIcons
                color={constThemeColor.primaryContainer}
                name="email-outline"
                // onPress={openMoreOption}
                size={30}
              />
              <Text style={styles.iconText}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconStyle}
              // onPress={() => setModalVisible(true)}
              onPress={() =>
                navigation.navigate("ProfileQr", {
                  userDetails: data?.user_id,
                })
              }
            >
              <MaterialCommunityIcons
                color={constThemeColor.primaryContainer}
                name="qrcode"
                // onPress={openMoreOption}
                size={30}
              />
              <Text style={styles.iconText}>QR</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <Animated.View
          style={{
            height: 20,
            backgroundColor: themeColors.onPrimary,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            borderBottomColor: "transparent",
            borderBottomWidth: 6,
            zIndex: 1,
          }}
        ></Animated.View>
      </Animated.View>
    );
  };
  // fot taking styles from redux use this function
  // const constThemeColor = useSelector((state)co => state.darkMode.theme.colors);
  // const reduxColors = styles(constThemeColor);

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
        if (scrollPos - (headerHeight - (minimumHeaderHeight + 90)) >= 0) {
          setHeader(true);
        } else {
          setHeader(false);
        }
      }),
    [headerHeight]
  );

  const updateStatus = () => {
    setIsLoading(true);
    let obj = {
      user_id: user_id,
      status: data.status == "active" ? "in_active" : "active",
    };
    updateUserStatus(obj)
      .then((res) => {
        if (res.success) {
          successToast("success", res.message);
          getData();
        } else {
          errorToast("error", res.message);
        }
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
      })
      .finally(() => setIsLoading(false));
  };
  const optionPress = (item) => {
    if (item?.option == "Reset Password") {
      navigation.navigate("UserPassword", {
        userDetails: data,
        resetPassword: true,
      });
    } else if (item?.option == "Reset Passcode") {
      navigation.navigate("DiffPasscodeReset", {
        userDetails: data,
        resetPasscode: true,
      });
    } else {
      alertModalOpen();
    }
  };

  const onRefreshAbout = () => {
    setIsRefreshing(true);
    getData();
  };
  return (
    <View style={{ backgroundColor: constThemeColor.onPrimary, flex: 1 }}>
      {isLoading && <Loader visible={isLoading} />}
      <AppBar
        title={data?.user_first_name + " " + data?.user_last_name}
        optionData={null}
        header={header}
        user_id={user_id}
        style={[
          header
            ? { backgroundColor: themeColors.onPrimary }
            : { backgroundColor: "transparent" },
          { position: "absolute", top: 0, width: "100%", zIndex: 1 },
        ]}
      />
      {/* <Profile data={data} animHeaderValue={scrollOffsetY} /> */}

      <Tabs.Container
        ref={ref}
        // pagerProps={{}}
        // containerStyle={{ width: "100%" }}
        onTabChange={(tab) => {
          TAB_HEADER_ITEMS.forEach((e, i) => {
            if (e.title == tab.tabName) {
              setScreenName(e.screen);
            }
          });
        }}
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
              // onTabPress={(e) => {
              //   if (ref.current.getFocusedTab() != e) {
              //     ref.current.jumpToTab(e);
              //   }
              // }}
            />
          );
        }}
        renderHeader={() => {
          return (
            <Profile
              data={data}
              animHeaderValue={scrollOffsetY}
              getScrollPositionOfTabs={getScrollPositionOfTabs}
              getHeaderHeight={getHeaderHeight}
            />
          );
        }}
        headerContainerStyle={{
          backgroundColor: "transparent",
          shadowOpacity: 0,
        }}
        minHeaderHeight={minimumHeaderHeight + 90}
      >
        {TAB_HEADER_ITEMS.map((item) => {
          if (item.screen === "journal" && !permission["view_journal"]) {
            return null;
          }
          if (
            !permission["view_user_permission"] &&
            (item.screen === "permissions" || item.screen === "devices")
          ) {
            return null;
          }
          return (
            <Tabs.Tab name={item.title} label={item.title} key={item.id}>
              {item.screen === "about" ? (
                <About
                  birthDate={data?.user_details?.personal_details?.user_dob}
                  addressDoc={data?.user_details?.personal_details?.address_doc}
                  userMobileNumber={
                    data?.user_details?.personal_details?.user_mobile_number
                  }
                  createdAt={data?.user_details?.personal_details?.created_at}
                  modifiedAt={data?.user_details?.personal_details?.modified_at}
                  userAddress={
                    data?.user_details?.personal_details?.user_address
                  }
                  userAddressDocs={
                    data?.user_details?.personal_details?.user_address_doc
                  }
                  userBloodGroup={
                    data?.user_details?.personal_details?.user_blood_grp
                  }
                  userEmail={data?.user_email}
                  userGender={data?.user_details?.personal_details?.user_gender}
                  userId={data?.user_id}
                  userMaritialStatus={
                    data?.user_details?.personal_details?.user_marital_status
                  }
                  personalInfo={data?.user_details?.personal_details}
                  userFirstName={data?.user_first_name}
                  userLastName={data?.user_last_name}
                  userDesignation={data?.designation}
                  staffId={data?.staff_id}
                  styles={styles}
                  permission={permission}
                  permissionSummaryData={permissionSummaryData}
                  role_permissionData={role_permissionData}
                  userDetails={userDetails}
                  route={route}
                  data={data}
                  CreateNew={CreateNew}
                  onRefreshAbout={onRefreshAbout}
                  refreshingAbout={isRefreshing}
                  isLoading={isLoading}
                />
              ) : item.screen === "permissions" ? (
                <Permissions
                  permissionData={role_permissionData}
                  styles={styles}
                  permissionSummaryData={permissionSummaryData}
                  data={data}
                  permission={permission}
                  navigation={navigation}
                  role_permissionData={role_permissionData}
                  userDetails={userDetails}
                  userId={data?.user_id}
                  route={route}
                  CreateNew={CreateNew}
                  onRefreshPermission={onRefreshAbout}
                  refreshingPermission={isRefreshing}
                />
              ) : item.screen === "education" ? (
                <Education
                  educationDetails={data?.user_details?.user_education}
                  userId={data?.user_id}
                  styles={styles}
                  constThemeColor={constThemeColor}
                  data={data}
                  permission={permission}
                  permissionSummaryData={permissionSummaryData}
                  role_permissionData={role_permissionData}
                  userDetails={userDetails}
                  route={route}
                  CreateNew={CreateNew}
                  onRefreshEducation={onRefreshAbout}
                  refreshingEducation={isRefreshing}
                  isLoading={isLoading}
                />
              ) : item.screen === "idProof" ? (
                <IdProof
                  userIdProof={data?.user_details?.user_id_proofs}
                  userId={data?.user_id}
                  styles={styles}
                  data={data}
                  permission={permission}
                  permissionSummaryData={permissionSummaryData}
                  role_permissionData={role_permissionData}
                  userDetails={userDetails}
                  route={route}
                  CreateNew={CreateNew}
                  onRefreshIdProof={onRefreshAbout}
                  refreshingIdProof={isRefreshing}
                  idMasterCount={data?.id_proof_count ?? 0}
                  isLoading={isLoading}
                />
              ) : item.screen === "workExperience" ? (
                <WorkExperience
                  userExperience={data?.user_details?.user_experience}
                  userId={data?.user_id}
                  styles={styles}
                  constThemeColor={constThemeColor}
                  data={data}
                  permission={permission}
                  permissionSummaryData={permissionSummaryData}
                  role_permissionData={role_permissionData}
                  userDetails={userDetails}
                  route={route}
                  CreateNew={CreateNew}
                  onRefreshExperience={onRefreshAbout}
                  refreshingExperience={isRefreshing}
                  isLoading={isLoading}
                />
              ) : item.screen === "devices" ? (
                <Devices
                  userDetails={userDetails}
                  route={route}
                  CreateNew={CreateNew}
                  userId={data?.user_id}
                  setPage={setPage}
                  callDevicesListApi={GetDevicesLoged}
                  handleLoadMore={handleLoadMore}
                  renderFooter={renderFooter}
                  DevDeregister={DevDeregister}
                  userIdProof={data?.user_details?.user_id_proofs}
                  styles={styles}
                  data={data}
                  deviceData={deviceData}
                  refreshingDevices={isRefreshing}
                  setrefreshingDevices={setIsRefreshing}
                  role_permissionData={role_permissionData}
                  permissionSummaryData={permissionSummaryData}
                  permission={permission}
                  isLoading={isLoading}
                />
              ) : item.screen == "journal" ? (
                <Journal
                  userId={user_id}
                  screenName={screenName}
                  constThemeColor={constThemeColor}
                />
              ) : null}
            </Tabs.Tab>
          );
        })}
      </Tabs.Container>

      {/* <View>
      {data.status === "active" ? (
        <EditButton
          screenName={screenName}
          user_id={user_id}
          permission={permission}
          navigation={navigation}
          permissionSummaryData={permissionSummaryData}
          role_permissionData={role_permissionData}
          userDetails={userDetails}
          route={route}
          data={data}
          constThemeColor={constThemeColor}
          CreateNew={CreateNew}
          themeColors={themeColors}
        />
      ) : <></>}
    </View> */}

      {/* <View>{data.status == "active" ? (
        permission["allow_add_users"] ||
        userDetails.user_id == route.params?.user_id ? (
          screenName == "permissions" || screenName == "about" ? (
            <View
              style={{
                backgroundColor: themeColors.onPrimary,
                paddingBottom: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  alignItems: "center",
                  marginBottom: 10,
                  paddingTop: 15,
                }}
                onPress={() => {
                  if (screenName == "permissions") {
                    checkPermissionAndNavigate(
                      permission,
                      "allow_add_users",
                      navigation,
                      "EditPermissions",
                      {
                        userId: user_id,
                        permissionData: permissionSummaryData,
                        roleData: role_permissionData,
                      }
                    );
                    
                  } else {
                    checkPermissionAndNavigate(
                      permission,
                      "allow_add_users",
                      navigation,
                      "EditUser",
                      {
                        item: data?.user_details?.personal_details,
                        data: data,
                        AllData: route?.params?.allData,
                      },
                      userDetails.user_id == route.params?.user_id
                    );
                    
                  }
                }}
              >
                <MaterialIcons
                  name="pencil"
                  color={constThemeColor.editIconColor}
                  size={15}
                />
                <Text
                  style={{
                    fontWeight: FontSize.Antz_Subtext_Medium.fontWeight,
                    color: constThemeColor.onSurfaceVariant,
                    fontSize: FontSize.Antz_Subtext_Medium.fontSize,
                  }}
                >
                  {screenName == "permissions"
                    ? "Edit Permissions"
                    : "Edit Basic Info"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ position: "absolute", bottom: 50, right: 0 }}>
              <FloatingButton
                icon={"plus-circle-outline"}
                onPress={CreateNew}
              />
            </View>
          )
        ) : (
          <View
            style={{
              backgroundColor: themeColors.onPrimary,
              paddingBottom: 10,
            }}
          />
        )
      ) : <View></View>}
      </View> */}
      <DialougeModal
        isVisible={isAlertVisible}
        alertType={
          data.status == "active" ? Config.ERROR_TYPE : Config.SUCCESS_TYPE
        }
        title={
          data.status == "active"
            ? "Are you sure you want to Deactivate this user?"
            : "Are you sure you want to Activate this user?"
        }
        closeModal={alertModalClose}
        firstButtonHandle={firstButtonPress}
        secondButtonHandle={secondButtonPress}
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
  );
};

function EditButton({
  screenName,
  user_id,
  permission,
  navigation,
  permissionSummaryData,
  role_permissionData,
  userDetails,
  route,
  data,
  constThemeColor,
  CreateNew,
  themeColors,
}) {
  const allowEdit =
    permission["allow_add_users"] ||
    userDetails.user_id === route.params?.user_id;
  if (
    screenName === "permissions" ||
    screenName === "about" ||
    screenName === "devices"
  ) {
    if (
      (allowEdit && screenName === "about") ||
      (allowEdit && screenName === "devices")
    ) {
      const editLabel = "Edit Basic Info";

      return (
        <View
          style={{
            backgroundColor: themeColors.onPrimary,
            paddingBottom: 10,
          }}
        >
          <TouchableOpacity
            style={{
              alignSelf: "center",
              alignItems: "center",
              marginBottom: 10,
              paddingTop: 15,
            }}
            onPress={() => {
              const targetScreen = "EditUser";
              const targetProps = {
                item: data?.user_details?.personal_details,
                data: data,
                AllData: route?.params?.allData,
              };

              checkPermissionAndNavigate(
                permission,
                "allow_add_users",
                navigation,
                targetScreen,
                targetProps,
                userDetails.user_id === route.params?.user_id
              );
            }}
          >
            <Octicons
              name="pencil"
              size={20}
              color={constThemeColor.editIconColor}
            />
            <Text
              style={{
                fontWeight: FontSize.Antz_Subtext_Medium.fontWeight,
                color: constThemeColor.onSurfaceVariant,
                fontSize: FontSize.Antz_Subtext_Medium.fontSize,
              }}
            >
              {editLabel}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (permission["allow_add_users"] && screenName === "permissions") {
      const editLabel = "Edit Permissions";

      return (
        <View
          style={{
            backgroundColor: themeColors.onPrimary,
            paddingBottom: 10,
          }}
        >
          <TouchableOpacity
            style={{
              alignSelf: "center",
              alignItems: "center",
              marginBottom: 10,
              paddingTop: 15,
            }}
            onPress={() => {
              const targetScreen = "EditPermissions";
              const targetProps = {
                userId: user_id,
                permissionData: permissionSummaryData,
                roleData: role_permissionData,
              };

              checkPermissionAndNavigate(
                permission,
                "allow_add_users",
                navigation,
                targetScreen,
                targetProps,
                userDetails.user_id === route.params?.user_id
              );
            }}
          >
            <Octicons
              name="pencil"
              size={20}
              color={constThemeColor.editIconColor}
            />
            <Text
              style={{
                fontWeight: FontSize.Antz_Subtext_Medium.fontWeight,
                color: constThemeColor.onSurfaceVariant,
                fontSize: FontSize.Antz_Subtext_Medium.fontSize,
              }}
            >
              {editLabel}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  } else {
    if (allowEdit) {
      return (
        <View style={{ position: "absolute", bottom: 50, right: 0 }}>
          <FloatingButton icon="plus-circle-outline" onPress={CreateNew} />
        </View>
      );
    }
  }

  return null;
}

const style = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingTop: 20,
    },

    innerContainer: {
      // backgroundColor: "rgba(100,100,100,0.2)",
      // backgroundColor: "red",
      alignItems: "center",
      marginHorizontal: "10%",
      width: width * 0.9,
      height: "60%",
      justifyContent: "space-evenly",
      borderRadius: 12,
      // marginTop:hp(2),
    },
    row: {
      flexDirection: "row",
      width: width * 0.8,
      justifyContent: "space-between",
    },
    buttonText: {
      fontSize: FontSize.Antz_Standerd,
    },
    iconStyle: {
      alignItems: "center",
      marginHorizontal: Spacing.major,
    },
    iconText: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      textAlign: "center",
      color: reduxColors?.surface,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
    },
    iconContainer: {
      display: "flex",
      flexDirection: "row",
      marginTop: Spacing.minor + Spacing.small,
      marginBottom: Spacing.body,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: reduxColors?.blackWithPointEight,
    },
    modalView: {
      margin: 20,
      backgroundColor: reduxColors?.surface,
      borderRadius: 20,
      // padding: 35,
      alignItems: "center",
      shadowColor: reduxColors?.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    downloadBtnWrap: {
      marginBottom: 10,
    },
    masterContainer: {
      flex: 1,
      backgroundColor: reduxColors?.surface,
    },

    // Header Container
    headerContainer: {
      flex: 0.5,
    },

    linearGradient: {
      width: "100%",
      height: "100%",
    },

    overlayContent: {
      width: "80%",

      marginHorizontal: "8%",
      marginVertical: "35%",
      marginTop: "1%",
    },
    medicalEachSection: {
      marginBottom: hp(2),
      // marginTop: heightPercentageToDP(2),
    },
    medicalHeadingSection: {
      flexDirection: "row",
      alignItems: "center",
    },
    medicalInnerList: {
      flexDirection: "row",
      marginLeft: 30,
      flexWrap: "wrap",
    },
    commonTextStyle: {
      marginLeft: Spacing.mini,
      backgroundColor: reduxColors?.surface,
      padding: 3,
      borderRadius: 4,
      marginTop: Spacing.micro,
    },
    notesTextStyle: {
      marginLeft: Spacing.mini,
      backgroundColor: reduxColors?.notes,
      padding: Spacing.mini,
      borderRadius: 4,
      marginTop: Spacing.micro,
    },
    name: {
      color: reduxColors?.onSecondary,
      fontSize: FontSize.Antz_Major,
      marginVertical: Spacing.micro,
    },
    sex: {
      color: reduxColors?.onSecondary,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: FontSize.Antz_Body_Title.fontSize,
    },

    age: {
      color: reduxColors?.onSecondary,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: FontSize.Antz_Body_Title.fontSize,
    },
    enclosure: {
      color: reduxColors?.onSecondary,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: FontSize.Antz_Body_Title.fontSize,
    },
    // Body Container

    bodyContainer: {
      position: "relative",
      flex: 1,
      backgroundColor: reduxColors?.onSecondary,
      paddingTop: "4%",
    },

    tabHeaderWrapper: {
      borderBottomColor: reduxColors.lightGreyHexa,
      borderBottomWidth: 1,
    },

    tabHeaderItemWrapper: {
      paddingVertical: 4,
      marginHorizontal: 30,
    },

    tabIcon: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      marginHorizontal: 4,
      top: 4,
    },

    tabHeaderItem: {
      padding: 4,
      color: reduxColors.gray,
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
    },

    tabBody: {
      flex: 1,
      marginTop: 5,
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
    card: {
      marginHorizontal: 20,
      marginTop: 14,
      backgroundColor: reduxColors?.displaybgPrimary,
    },

    cardContentRow: {
      flexDirection: "row",
      marginHorizontal: "2%",
      marginVertical: "2%",
    },

    cardContentItem: {
      flex: 0.5,
    },

    mortalityContentItem: {
      paddingVertical: 10,
    },

    parent: {
      width: wp("83%"),
      flexDirection: "row",
    },
    main: {
      width: wp(65),
    },
    imgBox: {
      justifyContent: "center",
      paddingHorizontal: wp(4.5),
    },
    img: {
      width: wp(14),
      height: hp(8),
      resizeMode: "contain",
    },
    qrCardContentRow: {
      alignItems: "center",
      justifyContent: "center",
    },
    cardLebel: {
      color: reduxColors?.cardLebel,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    cardLevelValue: {
      color: reduxColors.housingPrimary,
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      marginTop: Spacing.small,
      // maxWidth: "80%",
      flex:1,
    },
    education_type: {
      color: reduxColors.secondary,
      fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium_title.fontWeight,
      marginTop: Spacing.small,
    },
    innerWrapper: {
      marginVertical: Spacing.mini,
      // maxWidth: "80%",
      flex:0.5,
    },
    permissionLabel: {
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      color: reduxColors?.onSurfaceVariant,
      // lineHeight: "normal",
      paddingTop: Spacing.minor,
      paddingLeft: Spacing.small,
    },
    permissionCard: {
      flexDirection: "row",
      marginTop: Spacing.minor + Spacing.small,
    },
    permissionCardText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors?.cardTextHeading,
    },
    iconSpacing: {
      marginRight: Spacing.minor,
    },
    permissionSubtitle: {
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      color: reduxColors?.onSecondaryContainer,
      padding: wp(0),
      paddingTop: wp(0),
      marginLeft: Spacing.mini,
    },
    checkColor: {
      color: reduxColors.onPrimaryContainer,
    },
    permissionTextBottom: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.onSecondaryContainer,
      marginRight: wp(1),
    },
  });

export default UserDetails;

const About = ({
  birthDate,
  addressDoc,
  userMobileNumber,
  createdAt,
  modifiedAt,
  userAddress,
  userAddressDocs,
  userBloodGroup,
  userEmail,
  userGender,
  userId,
  userMaritialStatus,
  userFirstName,
  userLastName,
  userDesignation,
  staffId,
  personalInfo,
  styles,
  permission,
  permissionSummaryData,
  role_permissionData,
  userDetails,
  route,
  data,
  CreateNew,
  onRefreshAbout,
  refreshingAbout,
  isLoading,
}) => {
  const navigation = useNavigation();
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  const dob = moment(birthDate);
  const today = moment(new Date());
  const duration = moment.duration(today.diff(dob));
  const years = duration._data.years;
  const months = duration._data.months;
  const days = duration._data.days;
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  return (
    <>
      <Tabs.ScrollView
        style={{ flexGrow: 1 }}
        scrollEventThrottle={20}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshingAbout}
            onRefresh={onRefreshAbout}
            style={{
              color: constThemeColor.blueBg,
              marginTop:
                Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
            }}
            enabled={true}
          />
        }
      >
        {userMobileNumber ? (
          <View>
            <Card style={styles.card} elevation={0}>
              <Card.Content>
                <View style={styles.innerWrapper}>
                  <Text style={styles.cardLebel}>Staff ID</Text>
                  <Text style={styles.cardLevelValue}>
                    {ifEmptyValue(staffId)}
                  </Text>
                </View>
                <View style={styles.innerWrapper}>
                  <Text style={styles.cardLebel}>Designation</Text>
                  <Text style={styles.cardLevelValue}>
                    {ifEmptyValue(userDesignation)}
                  </Text>
                </View>
                <View style={styles.innerWrapper}>
                  <Text style={styles.cardLebel}>Departments</Text>
                  <Text style={styles.cardLevelValue}>
                    {ifEmptyValue(null)}
                  </Text>
                </View>
              </Card.Content>
            </Card>
            <Card style={styles.card} elevation={0}>
              <Card.Content>
                <View style={styles.innerWrapper}>
                  <Text style={styles.cardLebel}>Name</Text>
                  <Text style={styles.cardLevelValue}>
                    {ifEmptyValue(userFirstName) +
                      " " +
                      ifEmptyValue(userLastName)}
                  </Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={[styles.innerWrapper, { flex: 0.5 }]}>
                    <Text style={styles.cardLebel}>Date of Birth</Text>
                    <Text style={styles.cardLevelValue}>
                      {ifEmptyValue(dateFormatter(birthDate, "DD MMM YYYY"))}
                    </Text>
                  </View>
                  <View style={[styles.innerWrapper, { flex: 0.5 }]}>
                    <Text style={styles.cardLebel}>Age</Text>
                    <Text
                      style={[
                        styles.cardLebelValue,
                        { marginTop: Spacing.small },
                      ]}
                    >
                      <Text style={styles.cardLevelValue}>
                        {years ? years + " Y" : "NA"}
                      </Text>
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={[styles.innerWrapper, { flex: 0.5 }]}>
                    <Text style={styles.cardLebel}>Gender</Text>
                    <Text style={styles.cardLevelValue}>
                      {ifEmptyValue(capitalize(userGender))}
                    </Text>
                  </View>
                  <View style={[styles.innerWrapper, { flex: 0.5 }]}>
                    <Text style={styles.cardLebel}>Blood Group</Text>
                    <Text style={styles.cardLevelValue}>
                      {ifEmptyValue(userBloodGroup)}
                    </Text>
                  </View>
                </View>

                <View style={styles.innerWrapper}>
                  <Text style={styles.cardLebel}>Marital Status</Text>
                  <Text style={styles.cardLevelValue}>
                    {ifEmptyValue(capitalize(userMaritialStatus))}
                  </Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.card} elevation={0}>
              <Card.Content>
                <View style={styles.innerWrapper}>
                  <Text style={styles.cardLebel}>Mobile Number</Text>
                  <Text style={styles.cardLevelValue}>
                    {ifEmptyValue(userMobileNumber)}
                  </Text>
                </View>
                <View style={styles.innerWrapper}>
                  <Text style={styles.cardLebel}>Email Address</Text>
                  <Text style={[styles.cardLevelValue]}>
                    {ifEmptyValue(userEmail)}
                  </Text>
                </View>
                <View style={styles.innerWrapper}>
                  <Text style={styles.cardLebel}>Address</Text>
                  <Text style={styles.cardLevelValue}>
                    {ifEmptyValue(userAddress)}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </View>
        ) : (
          <ListEmpty height={"50%"} visible={isLoading} />
        )}
      </Tabs.ScrollView>
      {data.status === "active" ? (
        <View style={{}}>
          <EditButton
            screenName="about"
            user_id={userId}
            permission={permission}
            navigation={navigation}
            permissionSummaryData={permissionSummaryData}
            role_permissionData={role_permissionData}
            userDetails={userDetails}
            route={route}
            data={data}
            constThemeColor={constThemeColor}
            CreateNew={CreateNew}
            themeColors={constThemeColor}
          />
        </View>
      ) : null}
    </>
  );
};

const Permissions = ({
  permissionData,
  styles,
  permissionSummaryData,
  data,
  permission,
  navigation,
  role_permissionData,
  userDetails,
  userId,
  route,
  CreateNew,
  onRefreshPermission,
  refreshingPermission,
}) => {
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  return (
    <>
      <Tabs.ScrollView
        style={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshingPermission}
            onRefresh={onRefreshPermission}
            style={{
              color: constThemeColor.blueBg,
              marginTop:
                Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
            }}
            enabled={true}
          />
        }
      >
        <View style={{ flex: 1, paddingHorizontal: Spacing.minor }}>
          <View>
            <Text style={styles.permissionLabel}>Access Permissions</Text>
            <CardTwo
              backgroundColor={constThemeColor.displaybgPrimary}
              elevation={0}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MaterialIcons
                  name="person-pin-circle"
                  size={24}
                  style={{
                    marginRight: Spacing.minor,
                    justifyContent: "center",
                  }}
                  color={constThemeColor.onSurfaceVariant}
                />
                <View style={{}}>
                  <Text style={styles.permissionCardText}>Location Access</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: Spacing.small,
                    }}
                  >
                    {permissionSummaryData.sitecount > 0 ? (
                      <MaterialIcons
                        name="check"
                        color={constThemeColor.onPrimaryContainer}
                        size={20}
                      />
                    ) : null}
                    <Text
                      style={[
                        styles.permissionSubtitle,
                        { marginLeft: Spacing.mini },
                      ]}
                    >
                      {permissionSummaryData.sitecount > 0
                        ? permissionSummaryData.sitecount + " Sites"
                        : "No site access"}
                    </Text>
                  </View>
                </View>
              </View>
            </CardTwo>
            <CardTwo
              backgroundColor={constThemeColor.displaybgPrimary}
              elevation={0}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Fontisto
                  name="laboratory"
                  size={24}
                  style={{
                    marginRight: Spacing.minor,
                    justifyContent: "center",
                  }}
                  color={constThemeColor.onSurfaceVariant}
                />
                <View style={{}}>
                  <Text style={styles.permissionCardText}>Lab Access</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: Spacing.small,
                    }}
                  >
                    {permissionSummaryData.total_full_access_lab > 0 ||
                    permissionSummaryData?.permission
                      ?.allow_complete_lab_access ? (
                      <MaterialIcons
                        name="check"
                        color={constThemeColor.onPrimaryContainer}
                        size={20}
                      />
                    ) : null}
                    <Text
                      style={[
                        styles.permissionSubtitle,
                        { marginLeft: Spacing.mini },
                      ]}
                    >
                      {permissionSummaryData?.permission
                        ?.allow_complete_lab_access
                        ? "Allowed complete access"
                        : permissionSummaryData.total_full_access_lab > 0
                        ? permissionSummaryData.total_full_access_lab + " Labs"
                        : "No Lab access"}
                    </Text>
                  </View>
                </View>
              </View>
            </CardTwo>
            <CardTwo
              backgroundColor={constThemeColor.displaybgPrimary}
              elevation={0}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MaterialIcons
                  name="local-pharmacy"
                  size={24}
                  style={{
                    marginRight: Spacing.minor,
                    justifyContent: "center",
                  }}
                  color={constThemeColor.onSurfaceVariant}
                />
                <View style={{}}>
                  <Text style={styles.permissionCardText}>Pharmacy Access</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: Spacing.small,
                    }}
                  >
                    {permissionSummaryData.total_full_access_pharmacy > 0 ||
                    permissionSummaryData?.permission
                      ?.allow_complete_pharmacy_access ? (
                      <MaterialIcons
                        name="check"
                        color={constThemeColor.onPrimaryContainer}
                        size={20}
                      />
                    ) : null}
                    <Text
                      style={[
                        styles.permissionSubtitle,
                        { marginLeft: Spacing.mini },
                      ]}
                    >
                      {permissionSummaryData?.permission
                        ?.allow_complete_pharmacy_access
                        ? "Allowed complete access"
                        : permissionSummaryData.total_full_access_pharmacy > 0
                        ? permissionSummaryData.total_full_access_pharmacy +
                          " Pharmacy"
                        : "No Pharmacy access"}
                    </Text>
                  </View>
                </View>
              </View>
            </CardTwo>
            <Text style={styles.permissionLabel}>Roles and Permissions</Text>
            <Card elevation={0} style={{ marginVertical: Spacing.body }}>
              <View
                style={{
                  backgroundColor: constThemeColor.displaybgPrimary,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  flexDirection: "row",
                  padding: Spacing.minor,
                  alignItems: "center",
                }}
              >
                <View style={{ marginRight: Spacing.minor }}>
                  <MaterialCommunityIcons
                    name="account-circle-outline"
                    size={24}
                    color={constThemeColor.onSurfaceVariant}
                  />
                </View>
                <View>
                  <Text style={styles.permissionCardText}>Role</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: Spacing.small,
                    }}
                  >
                    {permissionData?.data?.role_name ? (
                      <>
                        <MaterialIcons
                          name="check"
                          color={constThemeColor.onPrimaryContainer}
                          size={20}
                        />
                        <Text
                          style={[
                            styles.permissionSubtitle,
                            { marginLeft: Spacing.mini },
                          ]}
                        >
                          {ifEmptyValue(permissionData?.data?.role_name)}
                        </Text>
                      </>
                    ) : (
                      <Text
                        style={[styles.permissionSubtitle, { marginLeft: 4 }]}
                      >
                        No role & permission
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              {permissionData?.data?.role_name ? (
                <Card.Content
                  style={{
                    backgroundColor: constThemeColor.displaybgSecondary,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}
                >
                  {permissionData?.data?.permission?.collection_view_insights ||
                  permissionData?.data?.permission
                    ?.collection_animal_records ? (
                    <View
                      style={[
                        styles.permissionCard,
                        {
                          marginTop: Spacing.minor + Spacing.small,
                        },
                      ]}
                    >
                      <View style={{ marginRight: Spacing.minor }}>
                        <MaterialIcons
                          name="pets"
                          size={24}
                          color={constThemeColor.onSurfaceVariant}
                        />
                      </View>
                      <View style={{}}>
                        <Text style={styles.permissionCardText}>
                          Collection
                        </Text>

                        {permissionData?.data?.permission
                          ?.collection_view_insights && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: Spacing.small,
                            }}
                          >
                            <MaterialIcons
                              name="check"
                              color={constThemeColor.onPrimaryContainer}
                              size={20}
                            />
                            <Text
                              style={[
                                styles.permissionSubtitle,
                                { marginLeft: Spacing.mini },
                              ]}
                            >
                              Insight
                            </Text>
                          </View>
                        )}
                        {permissionData?.data?.permission
                          ?.collection_animal_records && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: Spacing.small,
                            }}
                          >
                            <MaterialIcons
                              name="check"
                              color={constThemeColor.onPrimaryContainer}
                              size={20}
                            />
                            <Text
                              style={[
                                styles.permissionSubtitle,
                                { marginLeft: Spacing.mini },
                              ]}
                            >
                              Animal Record
                            </Text>
                          </View>
                        )}
                        <View
                          style={{
                            flexDirection: "row",
                            marginLeft: Spacing.major,
                          }}
                        >
                          {permissionData?.data?.permission
                            ?.collection_animal_record_access == "VIEW" ||
                          permissionData?.data?.permission
                            ?.collection_animal_record_access == "ADD" ||
                          permissionData?.data?.permission
                            ?.collection_animal_record_access == "EDIT" ||
                          permissionData?.data?.permission
                            ?.collection_animal_record_access == "DELETE" ? (
                            <Text style={styles.permissionTextBottom}>
                              View
                            </Text>
                          ) : null}
                          {permissionData?.data?.permission
                            ?.collection_animal_record_access == "ADD" ||
                          permissionData?.data?.permission
                            ?.collection_animal_record_access == "EDIT" ||
                          permissionData?.data?.permission
                            ?.collection_animal_record_access == "DELETE" ? (
                            <Text style={styles.permissionTextBottom}>Add</Text>
                          ) : null}
                          {permissionData?.data?.permission
                            ?.collection_animal_record_access == "EDIT" ||
                          permissionData?.data?.permission
                            ?.collection_animal_record_access == "DELETE" ? (
                            <Text style={styles.permissionTextBottom}>
                              Edit
                            </Text>
                          ) : null}
                          {permissionData?.data?.permission
                            ?.collection_animal_record_access == "DELETE" ? (
                            <Text style={styles.permissionTextBottom}>
                              Delete
                            </Text>
                          ) : null}
                        </View>
                        {permissionData?.data?.permission
                          ?.access_mortality_module && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: Spacing.small,
                            }}
                          >
                            <MaterialIcons
                              name="check"
                              color={constThemeColor.onPrimaryContainer}
                              size={20}
                            />
                            <Text
                              style={[
                                styles.permissionSubtitle,
                                { marginLeft: Spacing.mini },
                              ]}
                            >
                              Mortality
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ) : null}

                  {permissionData?.data?.permission?.enable_housing ||
                  permissionData?.data?.permission?.housing_view_insights ||
                  permissionData?.data?.permission?.housing_add_section ||
                  permissionData?.data?.permission?.housing_add_enclosure ? (
                    <View
                      style={[
                        styles.permissionCard,
                        { marginTop: Spacing.minor + Spacing.small },
                      ]}
                    >
                      <View style={{ marginRight: Spacing.minor }}>
                        <MaterialCommunityIcons
                          name="home-analytics"
                          size={24}
                          color={constThemeColor.onSurfaceVariant}
                        />
                      </View>
                      <View style={{}}>
                        <Text style={styles.permissionCardText}>Housing</Text>
                        {permissionData?.data?.permission?.enable_housing && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              paddingTop: Spacing.small,
                            }}
                          >
                            <MaterialIcons
                              name="check"
                              color={constThemeColor.onPrimaryContainer}
                              size={20}
                            />
                            <Text
                              style={[
                                styles.permissionSubtitle,
                                { marginLeft: Spacing.mini },
                              ]}
                            >
                              Housing Enable
                            </Text>
                          </View>
                        )}
                        {permissionData?.data?.permission
                          ?.housing_view_insights && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              paddingTop: Spacing.small,
                            }}
                          >
                            <MaterialIcons
                              name="check"
                              color={constThemeColor.onPrimaryContainer}
                              size={20}
                            />
                            <Text
                              style={[
                                styles.permissionSubtitle,
                                { marginLeft: Spacing.mini },
                              ]}
                            >
                              Insight
                            </Text>
                          </View>
                        )}
                        {permissionData?.data?.permission
                          ?.housing_add_section && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: Spacing.small,
                            }}
                          >
                            <View style={{}}>
                              <MaterialIcons
                                name="check"
                                color={constThemeColor.onPrimaryContainer}
                                size={20}
                              />
                            </View>
                            <Text
                              style={[
                                styles.permissionSubtitle,
                                { marginLeft: Spacing.mini },
                              ]}
                            >
                              Add Section
                            </Text>
                          </View>
                        )}
                        {permissionData?.data?.permission
                          ?.housing_add_enclosure && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: Spacing.small,
                            }}
                          >
                            <MaterialIcons
                              name="check"
                              color={constThemeColor.onPrimaryContainer}
                              size={20}
                            />
                            <Text
                              style={[
                                styles.permissionSubtitle,
                                { marginLeft: Spacing.mini },
                              ]}
                            >
                              Add Enclosure
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ) : null}

                  {permissionData?.data?.permission?.medical_records ? (
                    <View
                      style={[
                        styles.permissionCard,
                        { marginTop: Spacing.minor + Spacing.small },
                      ]}
                    >
                      <View style={{ marginRight: Spacing.minor }}>
                        <MaterialCommunityIcons
                          name="home-plus-outline"
                          size={24}
                          color={constThemeColor.onSurfaceVariant}
                        />
                      </View>
                      <View style={{}}>
                        <Text style={styles.permissionCardText}>Medical</Text>

                        {permissionData?.data?.permission?.medical_records && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: Spacing.small,
                            }}
                          >
                            <MaterialIcons
                              name="check"
                              color={constThemeColor.onPrimaryContainer}
                              size={20}
                            />
                            <Text
                              style={[
                                styles.permissionSubtitle,
                                { marginLeft: Spacing.mini },
                              ]}
                            >
                              Medical Record
                            </Text>
                          </View>
                        )}
                        <View
                          style={{
                            flexDirection: "row",
                            marginLeft: Spacing.major,
                          }}
                        >
                          {permissionData?.data?.permission
                            ?.medical_records_access == "VIEW" ||
                          permissionData?.data?.permission
                            ?.medical_records_access == "ADD" ||
                          permissionData?.data?.permission
                            ?.medical_records_access == "EDIT" ||
                          permissionData?.data?.permission
                            ?.medical_records_access == "DELETE" ? (
                            <Text style={styles.permissionTextBottom}>
                              View
                            </Text>
                          ) : null}
                          {permissionData?.data?.permission
                            ?.medical_records_access == "ADD" ||
                          permissionData?.data?.permission
                            ?.medical_records_access == "EDIT" ||
                          permissionData?.data?.permission
                            ?.medical_records_access == "DELETE" ? (
                            <Text style={styles.permissionTextBottom}>Add</Text>
                          ) : null}
                          {permissionData?.data?.permission
                            ?.medical_records_access == "EDIT" ||
                          permissionData?.data?.permission
                            ?.medical_records_access == "DELETE" ? (
                            <Text style={styles.permissionTextBottom}>
                              Edit
                            </Text>
                          ) : null}
                          {permissionData?.data?.permission
                            ?.medical_records_access == "DELETE" ? (
                            <Text style={styles.permissionTextBottom}>
                              Delete
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  ) : null}

                  {permissionData?.data?.permission?.diet_module ? (
                    <View
                      style={[
                        styles.permissionCard,
                        { marginTop: Spacing.minor + Spacing.small },
                      ]}
                    >
                      <View style={{ marginRight: Spacing.minor }}>
                        <FontAwesome6
                          name="plate-wheat"
                          size={24}
                          color={constThemeColor.onSurfaceVariant}
                        />
                      </View>
                      <View style={{}}>
                        <Text style={styles.permissionCardText}>Diet</Text>

                        {permissionData?.data?.permission?.diet_module && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: Spacing.small,
                            }}
                          >
                            <MaterialIcons
                              name="check"
                              color={constThemeColor.onPrimaryContainer}
                              size={20}
                            />
                            <Text
                              style={[
                                styles.permissionSubtitle,
                                { marginLeft: Spacing.mini },
                              ]}
                            >
                              Diet Module
                            </Text>
                          </View>
                        )}
                        <View
                          style={{
                            flexDirection: "row",
                            marginLeft: Spacing.major,
                          }}
                        >
                          {permissionData?.data?.permission
                            ?.diet_module_access == "VIEW" ||
                          permissionData?.data?.permission
                            ?.diet_module_access == "ADD" ||
                          permissionData?.data?.permission
                            ?.diet_module_access == "EDIT" ||
                          permissionData?.data?.permission
                            ?.diet_module_access == "DELETE" ? (
                            <Text style={styles.permissionTextBottom}>
                              View
                            </Text>
                          ) : null}
                          {permissionData?.data?.permission
                            ?.diet_module_access == "ADD" ||
                          permissionData?.data?.permission
                            ?.diet_module_access == "EDIT" ||
                          permissionData?.data?.permission
                            ?.diet_module_access == "DELETE" ? (
                            <Text style={styles.permissionTextBottom}>Add</Text>
                          ) : null}
                          {permissionData?.data?.permission
                            ?.diet_module_access == "EDIT" ||
                          permissionData?.data?.permission
                            ?.diet_module_access == "DELETE" ? (
                            <Text style={styles.permissionTextBottom}>
                              Edit
                            </Text>
                          ) : null}
                          {permissionData?.data?.permission
                            ?.diet_module_access == "DELETE" ? (
                            <Text style={styles.permissionTextBottom}>
                              Delete
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  ) : null}

                  {permissionData?.data?.permission
                    ?.approval_move_animal_external ? (
                    <View
                      style={[
                        styles.permissionCard,
                        { marginTop: Spacing.minor + Spacing.small },
                      ]}
                    >
                      <View style={{ marginRight: Spacing.minor }}>
                        <MaterialCommunityIcons
                          name="thumb-up-outline"
                          size={24}
                          color={constThemeColor.onSurfaceVariant}
                        />
                      </View>
                      <View style={{}}>
                        <Text style={styles.permissionCardText}>Approvals</Text>

                        {/* {permissionData?.data?.permission
                          ?.approval_move_animal_internal && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: Spacing.small,
                            }}
                          >
                            <MaterialIcons
                              name="check"
                              color={constThemeColor.onPrimaryContainer}
                              size={20}
                            />
                            <Text
                              style={[
                                styles.permissionSubtitle,
                                { marginLeft: Spacing.mini },
                              ]}
                            >
                              Move Animal
                            </Text>
                          </View>
                        )} */}
                        {permissionData?.data?.permission
                          ?.approval_move_animal_external && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: Spacing.small,
                            }}
                          >
                            <MaterialIcons
                              name="check"
                              color={constThemeColor.onPrimaryContainer}
                              size={20}
                            />
                            <Text
                              style={[
                                styles.permissionSubtitle,
                                { marginLeft: Spacing.mini },
                              ]}
                            >
                              Transfer Animal
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ) : null}
                  {permissionData?.data?.permission?.add_lab ||
                  permissionData?.data?.permission?.lab_test_mapping ? (
                    <View
                      style={[
                        styles.permissionCard,
                        { marginTop: Spacing.minor + Spacing.small },
                      ]}
                    >
                      <View style={{ marginRight: Spacing.minor }}>
                        <Entypo
                          name="lab-flask"
                          size={24}
                          color={constThemeColor.onSurfaceVariant}
                        />
                      </View>
                      <View style={{}}>
                        <Text style={styles.permissionCardText}>Labs</Text>

                        {permissionData?.data?.permission?.add_lab && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: Spacing.small,
                            }}
                          >
                            <MaterialIcons
                              name="check"
                              color={constThemeColor.onPrimaryContainer}
                              size={20}
                            />
                            <Text
                              style={[
                                styles.permissionSubtitle,
                                { marginLeft: Spacing.mini },
                              ]}
                            >
                              Add Lab
                            </Text>
                          </View>
                        )}
                        {permissionData?.data?.permission?.lab_test_mapping && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: Spacing.small,
                            }}
                          >
                            <MaterialIcons
                              name="check"
                              color={constThemeColor.onPrimaryContainer}
                              size={20}
                            />
                            <Text
                              style={[
                                styles.permissionSubtitle,
                                { marginLeft: Spacing.mini },
                              ]}
                            >
                              Allow Lab Test Mapping
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ) : null}
                  {permissionData?.data?.permission?.add_pharmacy ? (
                    <View
                      style={[
                        styles.permissionCard,
                        { marginTop: Spacing.minor + Spacing.small },
                      ]}
                    >
                      <View style={{ marginRight: Spacing.minor }}>
                        <MaterialIcons
                          name="local-pharmacy"
                          size={24}
                          color={constThemeColor.onSurfaceVariant}
                        />
                      </View>
                      <View style={{}}>
                        <Text style={styles.permissionCardText}>Pharmacy</Text>

                        {permissionData?.data?.permission?.add_pharmacy && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: Spacing.small,
                            }}
                          >
                            <MaterialIcons
                              name="check"
                              color={constThemeColor.onPrimaryContainer}
                              size={20}
                            />
                            <Text
                              style={[
                                styles.permissionSubtitle,
                                { marginLeft: Spacing.mini },
                              ]}
                            >
                              Add Pharmacy
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ) : null}
                </Card.Content>
              ) : null}
            </Card>

            {/* {permissionSummaryData?.permission?.allow_add_users ||
          permissionSummaryData?.permission?.allow_creating_roles ||
          permissionSummaryData?.permission?.add_new_users ||
          permissionSummaryData?.permission?.add_taxonomy ||
          permissionSummaryData?.permission?.add_sites ||
          permissionSummaryData?.permission?.add_designations ||
          permissionSummaryData?.permission?.add_departments ||
          permissionSummaryData?.permission?.add_id_proofs ||
          permissionSummaryData?.permission?.add_organizations ||
          permissionSummaryData?.permission?.add_educations ? ( */}
            <>
              <Text style={styles.permissionLabel}>Admin Permissions</Text>

              {permissionSummaryData?.permission?.access_all_notes && (
                <CardTwo
                  backgroundColor={constThemeColor.displaybgPrimary}
                  elevation={0}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons
                      name="note-outline"
                      size={24}
                      style={{
                        marginRight: Spacing.minor,
                        justifyContent: "center",
                      }}
                      color={constThemeColor.onSurfaceVariant}
                    />
                    <View style={{}}>
                      <Text style={styles.permissionCardText}>
                        Access all Notes
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: Spacing.small,
                        }}
                      >
                        <MaterialIcons
                          name="check"
                          color={constThemeColor.onPrimaryContainer}
                          size={20}
                        />
                        <Text
                          style={[
                            styles.permissionSubtitle,
                            { marginLeft: Spacing.mini },
                          ]}
                        >
                          Allowed
                        </Text>
                      </View>
                    </View>
                  </View>
                </CardTwo>
              )}
              {permissionSummaryData?.permission?.allow_creating_roles && (
                <CardTwo
                  backgroundColor={constThemeColor.displaybgPrimary}
                  elevation={0}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialIcons
                      name="person-pin"
                      size={24}
                      style={{
                        marginRight: Spacing.minor,
                        justifyContent: "center",
                      }}
                      color={constThemeColor.onSurfaceVariant}
                    />
                    <View style={{}}>
                      <Text style={styles.permissionCardText}>
                        Create Roles
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: Spacing.small,
                        }}
                      >
                        <MaterialIcons
                          name="check"
                          color={constThemeColor.onPrimaryContainer}
                          size={20}
                        />
                        <Text
                          style={[
                            styles.permissionSubtitle,
                            { marginLeft: Spacing.mini },
                          ]}
                        >
                          Allowed
                        </Text>
                      </View>
                    </View>
                  </View>
                </CardTwo>
              )}
              {permissionSummaryData?.permission?.allow_add_users && (
                <CardTwo
                  backgroundColor={constThemeColor.displaybgPrimary}
                  elevation={0}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialIcons
                      name="person-add-alt"
                      size={24}
                      style={{
                        marginRight: Spacing.minor,
                        justifyContent: "center",
                      }}
                      color={constThemeColor.onSurfaceVariant}
                    />
                    <View style={{}}>
                      <Text style={styles.permissionCardText}>Add Users</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: Spacing.small,
                        }}
                      >
                        <MaterialIcons
                          name="check"
                          color={constThemeColor.onPrimaryContainer}
                          size={20}
                        />
                        <Text
                          style={[
                            styles.permissionSubtitle,
                            { marginLeft: Spacing.mini },
                          ]}
                        >
                          Allowed
                        </Text>
                      </View>
                    </View>
                  </View>
                </CardTwo>
              )}

              <Text style={styles.permissionLabel}>User Module</Text>

              {permissionSummaryData?.permission?.view_journal && (
                <CardTwo
                  backgroundColor={constThemeColor.displaybgPrimary}
                  elevation={0}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="journal"
                      size={24}
                      style={{
                        marginRight: Spacing.minor,
                        justifyContent: "center",
                      }}
                      color={constThemeColor.onSurfaceVariant}
                    />
                    <View style={{}}>
                      <Text style={styles.permissionCardText}>
                        View Journal
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: Spacing.small,
                        }}
                      >
                        <MaterialIcons
                          name="check"
                          color={constThemeColor.onPrimaryContainer}
                          size={20}
                        />
                        <Text
                          style={[
                            styles.permissionSubtitle,
                            { marginLeft: Spacing.mini },
                          ]}
                        >
                          Allowed
                        </Text>
                      </View>
                    </View>
                  </View>
                </CardTwo>
              )}
              {permissionSummaryData?.permission?.view_user_permission && (
                <CardTwo
                  backgroundColor={constThemeColor.displaybgPrimary}
                  elevation={0}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome5
                      name="user-shield"
                      size={24}
                      style={{
                        marginRight: Spacing.minor,
                        justifyContent: "center",
                      }}
                      color={constThemeColor.onSurfaceVariant}
                    />
                    <View style={{}}>
                      <Text style={styles.permissionCardText}>
                        View Permissions
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: Spacing.small,
                        }}
                      >
                        <MaterialIcons
                          name="check"
                          color={constThemeColor.onPrimaryContainer}
                          size={20}
                        />
                        <Text
                          style={[
                            styles.permissionSubtitle,
                            { marginLeft: Spacing.mini },
                          ]}
                        >
                          Allowed
                        </Text>
                      </View>
                    </View>
                  </View>
                </CardTwo>
              )}

              {permissionSummaryData?.permission?.allow_masters ? (
                <Card
                  elevation={0}
                  style={[
                    styles.cardGap,
                    { backgroundColor: constThemeColor.displaybgSecondary },
                  ]}
                >
                  <View
                    style={{
                      backgroundColor: constThemeColor.displaybgPrimary,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      flexDirection: "row",
                      padding: Spacing.minor,
                      alignItems: "center",
                    }}
                  >
                    <View style={{ marginRight: Spacing.minor }}>
                      <MaterialIcons
                        name="playlist-add"
                        size={24}
                        color={constThemeColor.onSurfaceVariant}
                      />
                    </View>
                    <View style={{}}>
                      <Text style={styles.permissionCardText}>Add Masters</Text>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: Spacing.small,
                        }}
                      >
                        <MaterialIcons
                          name="check"
                          color={constThemeColor.onPrimaryContainer}
                          size={20}
                        />
                        <Text
                          style={[
                            styles.permissionSubtitle,
                            { marginLeft: Spacing.mini },
                          ]}
                        >
                          Allowed
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Card.Content
                    style={{
                      // paddingVertical: Spacing.body,
                      paddingHorizontal: Spacing.minor,
                    }}
                  >
                    {permissionSummaryData?.permission?.add_taxonomy && (
                      <View style={[styles.permissionCard]}>
                        <MaterialIcons
                          name="pets"
                          size={24}
                          style={[styles.iconSpacing]}
                          color={constThemeColor?.onSurfaceVariant}
                        />

                        <View style={{}}>
                          <Text style={styles.permissionCardText}>
                            Collection
                          </Text>
                          <PermissionListItem
                            permissionTextStyle={styles.permissionSubtitle}
                            iconColor={constThemeColor.onPrimaryContainer}
                            permissionText="Add Species"
                          />
                        </View>
                      </View>
                    )}

                    {permissionSummaryData?.permission?.add_sites && (
                      <View style={[styles.permissionCard]}>
                        <SvgXml
                          xml={home_housing}
                          style={[styles.iconSpacing]}
                        />
                        <View style={{}}>
                          <Text style={styles.permissionCardText}>Housing</Text>
                          {
                            <PermissionListItem
                              permissionTextStyle={styles.permissionSubtitle}
                              iconColor={constThemeColor.onPrimaryContainer}
                              permissionText="Add Sites"
                            />
                          }
                        </View>
                      </View>
                    )}
                    {permissionSummaryData?.permission?.add_designations ||
                    permissionSummaryData?.permission?.add_departments ||
                    permissionSummaryData?.permission?.add_id_proofs ||
                    permissionSummaryData?.permission?.add_educations ? (
                      <View style={[styles.permissionCard]}>
                        <MaterialIcons
                          name="person-add-alt"
                          size={24}
                          style={[styles.iconSpacing]}
                          color={constThemeColor?.onSurfaceVariant}
                        />
                        <View style={{}}>
                          <Text style={styles.permissionCardText}>Users</Text>

                          {permissionSummaryData?.permission
                            ?.add_designations && (
                            <PermissionListItem
                              permissionTextStyle={styles.permissionSubtitle}
                              iconColor={constThemeColor.onPrimaryContainer}
                              permissionText="Add Designations"
                            />
                          )}
                          {permissionSummaryData?.permission
                            ?.add_departments && (
                            <PermissionListItem
                              permissionTextStyle={styles.permissionSubtitle}
                              iconColor={constThemeColor.onPrimaryContainer}
                              permissionText="Add Departments"
                            />
                          )}
                          {permissionSummaryData?.permission?.add_id_proofs && (
                            <PermissionListItem
                              permissionTextStyle={styles.permissionSubtitle}
                              iconColor={constThemeColor.onPrimaryContainer}
                              permissionText="Add Id Proofs"
                            />
                          )}
                          {permissionSummaryData?.permission
                            ?.add_educations && (
                            <PermissionListItem
                              permissionTextStyle={styles.permissionSubtitle}
                              iconColor={constThemeColor.onPrimaryContainer}
                              permissionText="Add Education Type"
                            />
                          )}
                        </View>
                      </View>
                    ) : null}

                    {permissionSummaryData?.permission?.add_organizations ||
                    permissionSummaryData?.permission
                      ?.add_institutes_for_animal_transfer ? (
                      <View style={[styles.permissionCard]}>
                        <MaterialIcons
                          name="person-add-alt"
                          size={24}
                          style={[styles.iconSpacing]}
                          color={constThemeColor?.onSurfaceVariant}
                        />
                        <View style={{}}>
                          <Text style={styles.permissionCardText}>
                            Administration
                          </Text>

                          {permissionSummaryData?.permission
                            ?.add_organizations && (
                            <PermissionListItem
                              permissionTextStyle={styles.permissionSubtitle}
                              iconColor={constThemeColor.onPrimaryContainer}
                              permissionText="Add organization"
                            />
                          )}
                          {permissionSummaryData?.permission
                            ?.add_institutes_for_animal_transfer && (
                            <PermissionListItem
                              permissionTextStyle={styles.permissionSubtitle}
                              iconColor={constThemeColor.onPrimaryContainer}
                              permissionText="Add Institutes for Animal Transfer"
                            />
                          )}
                        </View>
                      </View>
                    ) : null}
                    {permissionSummaryData?.permission?.add_assessment ? (
                      <View style={[styles.permissionCard]}>
                        <SvgXml
                          xml={note_alt}
                          style={[styles.iconSpacing]}
                          color={constThemeColor?.onSurfaceVariant}
                        />
                        <View style={{}}>
                          <Text style={styles.permissionCardText}>
                            Assessment
                          </Text>

                          {permissionSummaryData?.permission
                            ?.add_assessment && (
                            <PermissionListItem
                              permissionTextStyle={styles.permissionSubtitle}
                              iconColor={constThemeColor.onPrimaryContainer}
                              permissionText="Add assessment"
                            />
                          )}
                        </View>
                      </View>
                    ) : null}
                    {permissionSummaryData?.permission
                      ?.medical_add_complaints ||
                    permissionSummaryData?.permission?.medical_add_diagnosis ||
                    permissionSummaryData?.permission
                      ?.medical_add_prescription ||
                    permissionSummaryData?.permission?.medical_add_tests ||
                    permissionSummaryData?.permission?.medical_add_samples ||
                    permissionSummaryData?.permission?.medical_add_advices ? (
                      <View style={[styles.permissionCard]}>
                        <MaterialCommunityIcons
                          name="home-plus-outline"
                          size={24}
                          style={[styles.iconSpacing]}
                          color={constThemeColor?.onSurfaceVariant}
                        />
                        <View style={{}}>
                          <Text style={styles.permissionCardText}>Medical</Text>
                          {permissionSummaryData?.permission
                            ?.medical_add_complaints && (
                            <PermissionListItem
                              permissionTextStyle={styles.permissionSubtitle}
                              iconColor={constThemeColor.onPrimaryContainer}
                              permissionText="Add New Complaints"
                            />
                          )}
                          {permissionSummaryData?.permission
                            ?.medical_add_diagnosis && (
                            <PermissionListItem
                              permissionTextStyle={styles.permissionSubtitle}
                              iconColor={constThemeColor.onPrimaryContainer}
                              permissionText="Add New Diagnosis"
                            />
                          )}
                          {permissionSummaryData?.permission
                            ?.medical_add_prescription && (
                            <PermissionListItem
                              permissionTextStyle={styles.permissionSubtitle}
                              iconColor={constThemeColor.onPrimaryContainer}
                              permissionText="Add New Medicines"
                            />
                          )}
                          {permissionSummaryData?.permission
                            ?.medical_add_tests && (
                            <PermissionListItem
                              permissionTextStyle={styles.permissionSubtitle}
                              iconColor={constThemeColor.onPrimaryContainer}
                              permissionText="Add Medical Tests"
                            />
                          )}
                          {permissionSummaryData?.permission
                            ?.medical_add_samples && (
                            <PermissionListItem
                              permissionTextStyle={styles.permissionSubtitle}
                              iconColor={constThemeColor.onPrimaryContainer}
                              permissionText="Add Medical Samples"
                            />
                          )}
                          {permissionSummaryData?.permission
                            ?.medical_add_advices && (
                            <PermissionListItem
                              permissionTextStyle={styles.permissionSubtitle}
                              iconColor={constThemeColor.onPrimaryContainer}
                              permissionText="Add Medical Advices"
                            />
                          )}
                        </View>
                      </View>
                    ) : null}
                  </Card.Content>
                </Card>
              ) : (
                <Card elevation={0} style={{ marginVertical: Spacing.body }}>
                  <View
                    style={{
                      backgroundColor: constThemeColor.displaybgPrimary,
                      borderRadius: 10,
                      flexDirection: "row",
                      padding: Spacing.minor,
                      alignItems: "center",
                    }}
                  >
                    <View style={{ marginRight: Spacing.minor }}>
                      <MaterialIcons
                        name="playlist-add"
                        size={24}
                        color={constThemeColor.onSurfaceVariant}
                      />
                    </View>
                    <View style={{}}>
                      <Text style={styles.permissionCardText}>Add Masters</Text>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: Spacing.small,
                        }}
                      >
                        <Text
                          style={[
                            styles.permissionSubtitle,
                            { marginLeft: Spacing.minor + Spacing.small },
                          ]}
                        >
                          No masters permission
                        </Text>
                      </View>
                    </View>
                  </View>
                </Card>
              )}
            </>
          </View>
        </View>
      </Tabs.ScrollView>
      {data.status === "active" ? (
        <View style={{}}>
          <EditButton
            screenName="permissions"
            user_id={userId}
            permission={permission}
            navigation={navigation}
            permissionSummaryData={permissionSummaryData}
            role_permissionData={role_permissionData}
            userDetails={userDetails}
            route={route}
            data={data}
            constThemeColor={constThemeColor}
            CreateNew={CreateNew}
            themeColors={constThemeColor}
          />
        </View>
      ) : null}
    </>
  );
};

const Education = ({
  educationDetails,
  userId,
  styles,
  constThemeColor,
  data,
  permission,
  permissionSummaryData,
  role_permissionData,
  userDetails,
  route,
  CreateNew,
  onRefreshEducation,
  refreshingEducation,
  isLoading,
}) => {
  const navigation = useNavigation();
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;
  return (
    <>
      <Tabs.ScrollView
        style={{ flexGrow: 1 }}
        scrollEventThrottle={20}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshingEducation}
            onRefresh={onRefreshEducation}
            style={{
              color: constThemeColor.blueBg,
              marginTop:
                Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
            }}
            enabled={true}
          />
        }
      >
        {educationDetails && educationDetails.length > 0 ? (
          educationDetails?.map((item, index) => {
            return (
              <Card
                style={styles.card}
                // onPress={() =>
                //   navigation.navigate("CreateEducation", { item: { item } })
                // }
                elevation={0}
                key={index}
              >
                <Card.Content>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: Spacing.small,
                    }}
                  >
                    <View style={styles.innerWrapper}>
                      {/* <Text style={styles.cardLebel}>Course</Text> */}
                      <Text style={styles.education_type}>
                        {ifEmptyValue(item?.education_type_name)}
                      </Text>
                    </View>
                    {(permission["allow_add_users"] ||
                      userDetails.user_id == userId) && (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("CreateEducation", {
                            item: { item },
                          })
                        }
                      >
                        <Octicons
                          name="pencil"
                          size={24}
                          color={constThemeColor.onSecondaryContainer}
                          style={{ padding: 6 }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      // maxWidth: "100%",
                    }}
                  >
                    <View style={styles.innerWrapper}>
                      <Text style={styles.cardLebel}>Institute Name</Text>
                      <Text style={styles.cardLevelValue}>
                        {ifEmptyValue(item?.institution_name)}
                      </Text>
                    </View>
                    <View style={styles.innerWrapper}>
                      <Text style={styles.cardLebel}>Course</Text>
                      <Text style={styles.cardLevelValue}>
                        {ifEmptyValue(item?.course)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      // maxWidth: "80%",
                    }}
                  >
                    <View style={styles.innerWrapper}>
                      <Text style={styles.cardLebel}>Year Of Passout</Text>
                      <Text style={styles.cardLevelValue}>
                        {ifEmptyValue(item?.year_of_passout)}
                      </Text>
                    </View>

                    <View style={styles.innerWrapper}>
                      <Text style={styles.cardLebel}>Marks</Text>
                      <Text
                        style={[styles.cardLevelValue, { maxWidth: "auto" }]}
                      >
                        {ifEmptyValue(item?.marks) + "%"}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            );
          })
        ) : (
          <ListEmpty height={"50%"} visible={isLoading} />
        )}
        {/* {educationDetails?.length > 0 ? (
          <View
            style={{ height: Platform.OS == "ios" ? hp("50%") : null }}
          ></View>
        ) : null} */}
      </Tabs.ScrollView>
      {data.status === "active" ? (
        <View style={{}}>
          <EditButton
            screenName="education"
            user_id={userId}
            permission={permission}
            navigation={navigation}
            permissionSummaryData={permissionSummaryData}
            role_permissionData={role_permissionData}
            userDetails={userDetails}
            route={route}
            data={data}
            constThemeColor={constThemeColor}
            CreateNew={CreateNew}
            themeColors={constThemeColor}
          />
        </View>
      ) : null}
    </>
  );
};

const IdProof = ({
  userIdProof,
  userId,
  styles,
  data,
  permission,
  permissionSummaryData,
  role_permissionData,
  userDetails,
  route,
  CreateNew,
  onRefreshIdProof,
  refreshingIdProof,
  idMasterCount,
  isLoading,
}) => {
  const navigation = useNavigation();
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;
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
    <>
      <Tabs.ScrollView
        style={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshingIdProof}
            onRefresh={onRefreshIdProof}
            style={{
              color: constThemeColor.blueBg,
              marginTop:
                Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
            }}
            enabled={true}
          />
        }
      >
        {userIdProof && userIdProof.length > 0 ? (
          userIdProof?.map((item, index) => {
            return (
              <Card style={styles.card} key={index}>
                <Card.Content>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: Spacing.small,
                    }}
                  >
                    <View style={styles.innerWrapper}>
                      <Text style={styles.education_type}>
                        {ifEmptyValue(item?.id_name)}
                      </Text>
                    </View>
                    {(permission["allow_add_users"] ||
                      userDetails.user_id == userId) && (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("EditIdProof", {
                            item: {
                              ...item,
                              user_id: userId,
                              id_value:
                                item?.doc_files?.length > 0
                                  ? item?.doc_files[0]?.id_value
                                  : "",
                            },
                          })
                        }
                      >
                        <Octicons
                          name="pencil"
                          size={20}
                          color={constThemeColor.onSecondaryContainer}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignContent: "flex-start",
                    }}
                  >
                    <View style={styles.innerWrapper}>
                      <Text style={styles.cardLevelValue}>
                        {ifEmptyValue(
                          item?.doc_files.length > 0
                            ? item?.doc_files[0]?.id_value
                            : ""
                        )}
                      </Text>
                    </View>
                    {/* {item?.doc_files?.length > 0 ? (
                      <>
                        {item?.doc_files[0]?.id_doc.match(
                          /\.(jpeg|jpg|png)$/i
                        ) && (
                          <TouchableOpacity
                            onPress={() =>
                              openPDF(
                                Config.BASE_APP_URL +
                                  "uploads/" +
                                  item?.doc_files[0]?.id_doc
                              )
                            }
                          >
                            <Image
                              source={{
                                uri:
                                  Config.BASE_APP_URL +
                                  "uploads/" +
                                  item?.doc_files[0]?.id_doc,
                              }}
                              style={{
                                height: 80,
                                width: 80,
                                resizeMode: "cover",
                              }}
                            />
                          </TouchableOpacity>
                        )}
                      </>
                    ) : null} */}
                  </View>
                  <View style={{ paddingTop: Spacing.small }}>
                    <Text
                      style={{
                        color: constThemeColor.neutralSecondary,
                        fontSize: FontSize.Antz_Body_Regular.fontSize,
                        fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                      }}
                    >
                      Attachments
                    </Text>
                    <ImageViewer
                      data={item?.doc_files
                        .filter((i) => {
                          const extension = i?.id_doc
                            ?.split(".")
                            .pop()
                            .toLowerCase();
                          return (
                            extension === "jpeg" ||
                            extension === "png" ||
                            extension === "jpg"
                          );
                        })
                        .map((e) => {
                          const extension = e?.id_doc
                            ?.split(".")
                            .pop()
                            .toLowerCase();
                          return {
                            ...e,
                            name: e.id_doc,
                            type: `image/${extension}`,
                            uri: Config.BASE_APP_URL + "uploads/" + e?.id_doc,
                          };
                        })}
                      horizontal={true}
                      width={widthPercentageToDP(31)}
                      imgHeight={99}
                      imgWidth={widthPercentageToDP(30.5)}
                    />
                  </View>

                  {/* {item?.id_doc && item?.id_doc?.match(/\.(xls|pdf|doc)$/i) ? (
                    <TouchableOpacity
                      onPress={() =>
                        openPDF(Config.BASE_APP_URL + "uploads/" + item?.id_doc)
                      }
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 10,
                          marginBottom: 3,
                          marginTop: 3,
                          backgroundColor: constThemeColor.surface,
                        }}
                      >
                        <MaterialIcons
                          name="picture-as-pdf"
                          size={24}
                          color={constThemeColor.onSurfaceVariant}
                        />

                        <View style={{ marginLeft: 10 }}>
                          <Text numberOfLines={1} ellipsizeMode="tail">
                            {item?.id_doc}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : null} */}
                </Card.Content>
              </Card>
            );
          })
        ) : (
          <ListEmpty height={"50%"} visible={isLoading} />
        )}
        {/* {userIdProof?.length > 0 ? (
          <View
            style={{ height: Platform.OS == "ios" ? hp("50%") : null }}
          ></View>
        ) : null} */}
      </Tabs.ScrollView>
      {data.status === "active" && idMasterCount > 0 ? (
        <View style={{}}>
          <EditButton
            screenName="idProof"
            user_id={userId}
            permission={permission}
            navigation={navigation}
            permissionSummaryData={permissionSummaryData}
            role_permissionData={role_permissionData}
            userDetails={userDetails}
            route={route}
            data={data}
            constThemeColor={constThemeColor}
            CreateNew={CreateNew}
            themeColors={constThemeColor}
          />
        </View>
      ) : null}
    </>
  );
};

const Devices = ({
  data,
  route,
  userId,
  CreateNew,
  role_permissionData,
  permissionData,
  permissionSummaryData,
  permission,
  setPage,
  callDevicesListApi,
  handleLoadMore,
  renderFooter,
  DevDeregister,
  refreshingDevices,
  setrefreshingDevices,
  styles,
  deviceData,
  userDetails,
  isLoading,
}) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);

  const [openid, setOpenid] = useState("");
  const openMoreOption = (id) => {
    setOpenid(id);
  };
  const closeMoreOption = () => {
    setOpenid("");
  };

  const functime = (item) => {
    const dateObject = moment(item);
    const timeString = dateObject?.format("hh:mm A");
    const outputString = `${timeString}, ${dateObject.format("DD MMM YYYY")}`;
    return outputString;
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={[
          {
            padding: Spacing.body,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 10,
            backgroundColor:
              item?.device_status == "inactive"
                ? opacityColor(constThemeColor?.errorContainer, 50)
                : constThemeColor.onBackground,
            marginHorizontal: 20,
            marginTop: 14,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              width: 60,
              height: 60,
              alignItems: "center",
            }}
          >
            {item?.device_type == "phone" ? (
              <MaterialIcons
                name="phone-android"
                size={34}
                color={constThemeColor.onSecondaryContainer}
              />
            ) : item?.device_type == "tablet" ? (
              <Entypo
                name="tablet"
                size={34}
                color={constThemeColor.onSecondaryContainer}
              />
            ) : (
              <MaterialIcons
                name="phone-iphone"
                size={34}
                color={constThemeColor.onSecondaryContainer}
              />
            )}
            <View
              style={{
                backgroundColor: opacityColor(
                  constThemeColor.neutralPrimary,
                  5
                ),
                marginTop: Spacing.micro,
                borderRadius: Spacing.small,
              }}
            >
              <Text
                style={{
                  color: constThemeColor.onSecondaryContainer,
                  alignSelf: "center",
                  fontSize: FontSize.Antz_Small.fontSize,
                  fontWeight: FontSize.Antz_Small.fontWeight,
                  paddingVertical: Spacing.micro,
                  paddingHorizontal: Spacing.mini,
                  textAlign: "center",
                }}
              >
                {item?.device_type ?? "NA"}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              width: "72%",
            }}
          >
            <Text
              style={{
                color: constThemeColor.onSecondaryContainer,
                alignSelf: "flex-start",
                fontSize: FontSize.Antz_Minor_Title.fontSize,
                fontWeight: FontSize.Antz_Minor_Title.fontWeight,
              }}
            >
              {item?.device_name ?? "NA"}
            </Text>
            <Text
              style={{
                color: constThemeColor.onSurfaceVariant,
                alignSelf: "flex-start",
                fontSize: FontSize.Antz_Body_Medium.fontSize,
                fontWeight: FontSize.Antz_Body_Medium.fontWeight,
              }}
            >
              {"ID:" + item?.device_id ?? "NA"}
            </Text>
            <Text
              style={{
                color: constThemeColor.onSecondaryContainer,
                alignSelf: "flex-start",
                fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
              }}
            >
              {"Last Active: " +
                functime(item?.modified_on ?? item?.created_on) ?? "NA"}
            </Text>
          </View>
        </View>
        {item?.device_status == "inactive" ? null : (
          <Menu
            visible={item?.id == openid && item?.device_status == "active"}
            onDismiss={closeMoreOption}
            style={{
              marginTop: Spacing.minor,
            }}
            contentStyle={{ height: 50, justifyContent: "center" }}
            anchor={
              <TouchableOpacity
                onPress={() => openMoreOption(item?.id)}
                style={{
                  width: 30,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="dots-vertical"
                  color={constThemeColor.neutralPrimary}
                  size={30}
                />
              </TouchableOpacity>
            }
            statusBarHeight={15}
          >
            <Menu.Item
              onPress={() => {
                DevDeregister(item);
                setOpenid("");
              }}
              titleStyle={{ alignSelf: "center", justifyContent: "center" }}
              title="Deactivate"
            />
          </Menu>
        )}
      </View>
    );
  };
  return (
    <>
      <Tabs.ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshingDevices}
            onRefresh={() => {
              setrefreshingDevices(true);
              callDevicesListApi(1);
              setPage(1);
            }}
            style={{
              color: constThemeColor.blueBg,
              marginTop:
                Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
            }}
            enabled={true}
          />
        }
      >
        <FlatList
          data={deviceData ?? []}
          renderItem={renderItem}
          ListEmptyComponent={<ListEmpty height={"50%"} visible={isLoading} />}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          // refreshControl={
          //   // false
          //   <RefreshControl
          //     refreshing={refreshingDevices}
          //     onRefresh={() => {
          //       if (!refreshingDevices) {
          //         setrefreshingDevices(true);
          //         callDevicesListApi(1);
          //         setPage(1);
          //       }
          //     }}
          //     // style={{
          //     //   // flex: 1,
          //     //   color: constThemeColor.blueBg,
          //     //   marginTop:
          //     //     Platform.OS == "ios" ? 10 : (Spacing.body + Spacing.small) * 3,
          //     // }}
          //     // enabled={true}
          //   />
          // }
        />
      </Tabs.ScrollView>
      {/* {data.status === "active" ? (
        <View style={{}}>
          <EditButton
            screenName="devices"
            user_id={userId}
            permission={permission}
            navigation={navigation}
            permissionSummaryData={permissionSummaryData}
            role_permissionData={role_permissionData}
            userDetails={userDetails}
            route={route}
            data={data}
            constThemeColor={constThemeColor}
            CreateNew={CreateNew}
            themeColors={constThemeColor}
          />
        </View>
      ) : null} */}
    </>
  );
};

const WorkExperience = ({
  userExperience,
  userId,
  styles,
  constThemeColor,
  data,
  permission,
  permissionSummaryData,
  role_permissionData,
  userDetails,
  route,
  CreateNew,
  onRefreshExperience,
  refreshingExperience,
  isLoading,
}) => {
  const navigation = useNavigation();
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;
  return (
    <>
      <Tabs.ScrollView
        style={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshingExperience}
            onRefresh={onRefreshExperience}
            style={{
              color: constThemeColor.blueBg,
              marginTop:
                Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
            }}
            enabled={true}
          />
        }
      >
        {userExperience && userExperience.length > 0 ? (
          userExperience?.map((item, index) => {
            return (
              <Card style={styles.card} elevation={0} key={index}>
                <Card.Content>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignContent: "flex-start",
                    }}
                  >
                    <View style={[styles.innerWrapper, {flex:0.7}]}>
                      <Text style={styles.cardLebel}>Company Name</Text>
                      <Text style={styles.cardLevelValue}>
                        {ifEmptyValue(item?.institution_name)}
                      </Text>
                    </View>
                    {(permission["allow_add_users"] ||
                      userDetails.user_id == userId) && (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("AddExperience", { item: item })
                        }
                      >
                        <Octicons
                          name="pencil"
                          size={24}
                          color={constThemeColor.onSecondaryContainer}
                          style={{ padding: 6 }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={[styles.innerWrapper, { flex: 0.5 }]}>
                      <Text style={styles.cardLebel}>Join Date</Text>
                      <Text style={styles.cardLevelValue}>
                        {ifEmptyValue(item?.join_date)}
                      </Text>
                    </View>
                    <View style={[styles.innerWrapper, { flex: 0.5 }]}>
                      <Text style={styles.cardLebel}>End Date</Text>
                      <Text style={styles.cardLevelValue}>
                        {ifEmptyValue(item?.end_date)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.innerWrapper}>
                    <Text style={styles.cardLebel}>Company Location</Text>
                    <Text style={styles.cardLevelValue}>
                      {ifEmptyValue(item?.institution_location)}
                    </Text>
                  </View>
                  <View style={styles.innerWrapper}>
                    <Text style={styles.cardLebel}>Designation</Text>
                    <Text style={styles.cardLevelValue}>
                      {ifEmptyValue(item?.designation)}
                    </Text>
                  </View>
                  <View style={styles.innerWrapper}>
                    <Text style={styles.cardLebel}>Industry Type</Text>
                    <Text style={styles.cardLevelValue}>
                      {ifEmptyValue(item?.industry)}
                    </Text>
                  </View>
                  <View style={styles.innerWrapper}>
                    <Text style={styles.cardLebel}>Total Experience</Text>
                    <Text style={styles.cardLevelValue}>
                      {ifEmptyValue(item?.total_work_experience)}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            );
          })
        ) : (
          <ListEmpty height={"50%"} visible={isLoading} />
        )}
      </Tabs.ScrollView>
      {data.status === "active" ? (
        <View style={{}}>
          <EditButton
            screenName="workExperience"
            user_id={userId}
            permission={permission}
            navigation={navigation}
            permissionSummaryData={permissionSummaryData}
            role_permissionData={role_permissionData}
            userDetails={userDetails}
            route={route}
            data={data}
            constThemeColor={constThemeColor}
            CreateNew={CreateNew}
            themeColors={constThemeColor}
          />
        </View>
      ) : null}
    </>
  );
};

const Journal = ({ userId, screenName, constThemeColor }) => {
  const dispatch = useDispatch();
  const { myJournalRefreshLoader } = useSelector(
    (state) => state.myRefreshJournalSlice
  );

  const renderItem = ({ item }) => (
    <MyJournal
      hideTitle={true}
      userId={userId}
      refreshLoaderUserRef={true}
      focused={screenName == "journal" ? true : false}
    />
  );

  return (
    <Tabs.FlatList
      data={[{ key: "journal" }]}
      renderItem={renderItem}
      contentContainerStyle={{
        backgroundColor: constThemeColor.displaybgSecondary,
      }}
      keyExtractor={(item) => item.key}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={myJournalRefreshLoader}
          onRefresh={() => dispatch(setRefreshLoaderTrue())}
        />
      }
    />
  );
};
