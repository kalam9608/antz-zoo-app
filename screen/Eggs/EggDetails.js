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
} from "react-native";
import { SvgXml } from "react-native-svg";

import CircularProgress from "react-native-circular-progress-indicator";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import infertileegg from "../../assets/infertileegg.svg";
import done from "../../assets/done.svg";
import hatchedegg from "../../assets/hatchedegg.svg";
import egg from "../../assets/egg.svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState, useMemo } from "react";
import { debounce, set, throttle } from "lodash";
import {
  CollapsibleTabView,
  Tabs,
  MaterialTabBar,
  useHeaderMeasurements,
  useCurrentTabScrollY,
  CollapsibleRef,
} from "react-native-collapsible-tab-view";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  interpolateColor,
  Extrapolate,
  runOnJS,
  color,
} from "react-native-reanimated";
import Loader from "../../components/Loader";
import moment from "moment/moment";
import { getEggsDetails } from "../../services/EggsService";
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-paper";

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
} from "../../utils/Utils";
import { useDispatch, useSelector } from "react-redux";
import { errorToast } from "../../utils/Alert";
import FontSize from "../../configs/FontSize";
import TabBarStyles from "../../configs/TabBarStyles";
import AnimatedHeader from "../../components/AnimatedHeader";
import Spacing from "../../configs/Spacing";
import {
  removeParentAnimal,
  setDestination,
} from "../../redux/AnimalMovementSlice";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import ListEmpty from "../../components/ListEmpty";
import { Modal } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
const EggDetails = (props) => {
  const navigation = useNavigation();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [Father, setFather] = useState("");
  const [Mother, setMother] = useState("");
  const [day, setDay] = useState("");
  const [progressBarPercentage, setProgressBarPercentage] = useState(0);

  const [taxonomyID, setTaxonomyID] = useState(
    props?.route.params?.item?.taxonomy_id ?? 0
  );
  const permission = useSelector((state) => state.UserAuth.permission);
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(themeColors);
  const dispatch = useDispatch();
  const [togalHatchedModal, setToggalHatchedModal] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getData();
      dispatch(removeParentAnimal());
    });
    return unsubscribe;
  }, [navigation]);

  const getBackgroundColor = (status) => {
    if (status === null) {
      return themeColors.onPrimaryContainer;
    } else if (status === "Hatched") {
      return themeColors.onSurface;
    } else if (status === "Undetermined") {
      return themeColors.onSurfaceVariant;
    } else if (status === "Fertile") {
      return themeColors.onPrimaryContainer;
    } else if (status === "Infertile") {
      return themeColors.onErrorContainer;
    } else {
      return themeColors.onPrimaryContainer;
    }
  };
  const getProgressBarBackgroundColor = (status) => {
    if (status === null) {
      return themeColors.secondary;
    } else if (status === "Hatched") {
      return themeColors.primary;
    } else if (status === "Undetermined") {
      return themeColors.secondary;
    } else if (
      status === "Fertile" &&
      Number(data.hatching_period) > 0 &&
      day > Number(data.hatching_period)
    ) {
      return themeColors.onTertiaryContainer;
    } else if (status === "Fertile") {
      return themeColors.secondary;
    } else if (status === "Infertile") {
      return themeColors.error;
    } else if (data.hatching_period === "0") {
      return themeColors.secondary;
    } else {
      return themeColors.secondary;
    }
  };
  const getTextColor = (status) => {
    if (
      status === "Fertile" &&
      day > Number(data.hatching_period) &&
      Number(data.hatching_period) > 0
    ) {
      return themeColors.tertiaryContainer;
    } else if (status === "Infertile") {
      return themeColors.tertiaryContainer;
    } else {
      return themeColors.primaryContainer;
    }
  };

  const getData = () => {
    setIsLoading(true);
    let egg_id = props.route.params?.item.egg_id;
    getEggsDetails({ egg_id })
      .then((res) => {
        res.data.taxonomy_id = taxonomyID;
        setData(res.data);
        const oldDate = moment(res.data.lay_date);
        const newDate = moment(new Date());

        // let result = oldDate.diff(newDate, "days");
        let result = newDate.diff(oldDate, "days");
        if (res.data.hatching_period !== null) {
          let percentage = (result / Number(res.data.hatching_period)) * 100;
          setProgressBarPercentage(percentage);
        }

        setDay(result);
        if (
          res.data.parent_male.length > 0 ||
          res.data.parent_female.length > 0
        ) {
          let parentMother =
            res.data.parent_female[0].parents &&
            res.data.parent_female[0]?.parents
              ?.map((value) =>
                value?.local_id ? value.animal_id : value?.local_id
              )
              .join(", ");
          let parentFather =
            res.data.parent_male[0].parents &&
            res.data.parent_male[0].parents
              ?.map((value) =>
                value?.local_id ? value.animal_id : value?.local_id
              )
              .join(", ");

          setFather(parentFather);
          setMother(parentMother);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        // errorToast("Oops!", "Something went wrong!!");
      });
  };
  const TAB_HEADER_ITEMS = [
    {
      id: "0",
      title: "About",
      screen: "about",
    },
    {
      id: "1",
      title: "Measurements",
      screen: "measurements",
    },
    {
      id: "2",
      title: "Nursery",
      screen: "nursery",
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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };
  const onPress = () => {
    setToggalHatchedModal(!togalHatchedModal);
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
          title={"Egg # " + data.egg_id}
        />
        <Tabs.Container
          ref={ref}
          //onIndexChange={setIndex}
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
                progressBarPercentage={progressBarPercentage}
                getBackgroundColor={getBackgroundColor}
                getProgressBarBackgroundColor={getProgressBarBackgroundColor}
                getTextColor={getTextColor}
                imageBackground={undefined}
                style={[styles.headerContainer]}
                item={data}
                day={day}
                navigation={navigation}
                themeColors={themeColors}
                tabBarBorderRadius={tabBarBorderRadius}
                reduxColors={reduxColors}
                //header={header}
                //reduxColors={reduxColors}
                getScrollPositionOfTabs={getScrollPositionOfTabs}
                getHeaderHeight={getHeaderHeight}
              />
            );
          }}
          headerContainerStyle={{
            backgroundColor: "transparent",
            shadowOpacity: 0,
          }}
          minHeaderHeight={minimumHeaderHeight}
          //onTabChange={onTabchange}
        >
          {TAB_HEADER_ITEMS.map((item) => {
            return (
              <Tabs.Tab name={item.title} label={item.title} key={item.id}>
                <View style={{ height: "100%" }}>
                  {item.screen === "about" ? (
                    <About
                      style={styles.bodyContainer}
                      item={data}
                      parents={{ Father, Mother }}
                      themeColors={themeColors}
                      reduxColors={reduxColors}
                      permission={permission}
                      loading={isLoading}
                    />
                  ) : item.screen === "measurements" ? (
                    <Measurements loading={isLoading} />
                  ) : item.screen === "nursery" ? (
                    <Nursery loading={isLoading} />
                  ) : null}
                </View>
              </Tabs.Tab>
            );
          })}
        </Tabs.Container>

        {/* <Body
          style={styles.bodyContainer}
          item={data}
          parents={{ Father, Mother }}
        /> */}

        <Footer
          style={reduxColors.footerContainer}
          item={data}
          permission={permission}
          reduxColors={reduxColors}
          themeColors={themeColors}
          dispatch={dispatch}
          onPress={onPress}
        />
        {/* Modal Dropdown */}
        <Modal
          avoidKeyboard
          animationType="none"
          transparent={true}
          visible={togalHatchedModal}
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
                      Hatched
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
                      onPress={() => setToggalHatchedModal(false)}
                    />
                  </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={reduxColors.modalBody}>
                    <View style={reduxColors.commonBoxView}>
                      <TouchableOpacity
                        style={[
                          reduxColors.animalCardStyle,
                          {
                            minHeight: heightPercentageToDP(7),
                          },
                        ]}
                        onPress={showDatePicker}
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
                          />
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={reduxColors.itemRow}>
                      <TextInput
                        autoCompleteType="off"
                        style={reduxColors.notesInput}
                        placeholder="Add Notes"
                        multiline
                        placeholderTextColor={themeColors.onErrorContainer}
                      />
                    </View>
                  </View>
                </ScrollView>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </View>

              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: themeColors.addBackground,
                  height: heightPercentageToDP(8),
                }}
              >
                <TouchableOpacity style={[reduxColors.modalBtnCover]}>
                  <Text style={reduxColors.bottomBtnTxt}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </>
  );
};

export default EggDetails;

const Header = ({
  imageBackground,
  item,
  day,
  progressBarPercentage,

  getBackgroundColor,
  getProgressBarBackgroundColor,
  getTextColor,
  themeColors,
  tabBarBorderRadius,
  getHeaderHeight,
  getScrollPositionOfTabs,
  reduxColors,
}) => {
  const navigation = useNavigation();

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

  const overlayContent = (
    <>
      <Animated.View
        style={[
          animatedStyle,
          {
            zIndex: 1,
            paddingTop: 70,
            marginBottom: Spacing.major,
          },
        ]}
      >
        {/* <View
        style={[
          {
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: wp(4),
            marginTop: hp(1),
          },
        ]}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={30}
          color={constThemeColor.onPrimary}
          onPress={() => navigation.goBack()}
        />
        <MaterialCommunityIcons
          color={constThemeColor.onPrimary}
          name="dots-vertical"
          size={30}
        />
      </View> */}
        <View
          // style={[
          //   reduxColors.overlayContent,
          //   Platform.OS === "android" ? reduxColors.overlayContent : null,
          //   { bottom: heightPercen#colortageToDP("10%") },
          // ]}
          style={[
            Platform.OS == "android"
              ? reduxColors.overlayContent
              : reduxColors.iosoverlayContent,
          ]}
        >
          <View style={reduxColors.firstRow}>
            <View style={reduxColors.leftSide}>
              {item.fertility === "Infertile" ? (
                <SvgXml xml={infertileegg} style={[reduxColors.eggIcon]} />
              ) : item.fertility === "Hatched" &&
                day < Number(item.hatching_period) ? (
                <SvgXml xml={hatchedegg} style={[reduxColors.eggIcon]} />
              ) : (
                <SvgXml xml={egg} style={[reduxColors.eggIcon]} />
              )}

              <Text style={[reduxColors.eggCount, reduxColors.textShadow]}>
                Egg #{item.egg_id}
              </Text>
              <Text
                style={[
                  reduxColors.textShadow,
                  {
                    color: themeColors.onPrimary,

                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                  },
                ]}
              >
                Status -{" "}
                <Text
                  style={[
                    reduxColors.textShadow,
                    {
                      fontSize: FontSize.Antz_Body_Medium.fontSize,
                      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                    },
                  ]}
                >
                  {item.fertility}
                </Text>
              </Text>
              <Text
                style={[
                  reduxColors.textShadow,
                  {
                    color: themeColors.onPrimary,

                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                  },
                ]}
              >
                Species -{" "}
                <Text
                  style={[
                    reduxColors.textShadow,
                    {
                      fontSize: FontSize.Antz_Body_Title.fontSize,
                      fontWeight: FontSize.Antz_Body_Title.fontWeight,
                      marginBottom: 21,
                    },
                  ]}
                >
                  {/* {item.vernacular_name}  */}
                  {item.default_common_name !== "" || null
                    ? item.default_common_name
                    : item.complete_name}
                </Text>
              </Text>
            </View>

            <View style={reduxColors.rightSide}>
              {item.fertility === "Hatched" ? (
                <>
                  <View
                    style={[
                      reduxColors.gestationTime,
                      {
                        backgroundColor: getProgressBarBackgroundColor(
                          item.fertility
                        ),
                      },
                    ]}
                  ></View>
                  <View style={reduxColors.circleProgress}>
                    <SvgXml xml={done} style={[reduxColors.eggIcon]} />
                    <Text
                      style={[
                        reduxColors.textShadow,
                        {
                          color: themeColors.onPrimary,
                          fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                          fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                        },
                      ]}
                    >
                      Hatched in {day} days
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View
                    style={[
                      reduxColors.gestationTime,
                      {
                        backgroundColor: getProgressBarBackgroundColor(
                          item.fertility
                        ),
                      },
                    ]}
                  ></View>
                  <View style={reduxColors.circleProgress}>
                    <Text
                      style={[
                        reduxColors.textShadow,
                        {
                          color: themeColors.onPrimary,
                          fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                          fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                        },
                      ]}
                    >
                      DAY
                    </Text>

                    <Text
                      style={[
                        reduxColors.textShadow,
                        {
                          color: getTextColor(item.fertility),
                          fontSize: FontSize.Antz_Large_Title.fontSize,
                          fontWeight: FontSize.Antz_Large_Title.fontWeight,
                        },
                      ]}
                    >
                      {day}
                    </Text>
                    {Number(item.hatching_period) !== 0 || null ? (
                      <>
                        <Text
                          style={[
                            reduxColors.textShadow,
                            {
                              color: themeColors.onPrimary,
                              fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                              fontWeight:
                                FontSize.Antz_Subtext_Regular.fontWeight,
                            },
                          ]}
                        >
                          {item.hatching_period} days
                        </Text>
                        <Text
                          style={[
                            reduxColors.textShadow,
                            {
                              color: themeColors.onPrimary,
                              fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                              fontWeight:
                                FontSize.Antz_Subtext_Regular.fontWeight,
                            },
                          ]}
                        >
                          Gestation
                        </Text>
                      </>
                    ) : null}
                  </View>
                  {Number(item.hatching_period) !== 0 || null ? (
                    item.fertility === "Infertile" ? null : (
                      <View style={reduxColors.progressIndicator}>
                        {item.fertility === "Fertile" &&
                        day > Number(item.hatching_period) ? (
                          <CircularProgress
                            activeStrokeWidth={5}
                            inActiveStrokeWidth={0}
                            subtitle={false}
                            activeStrokeColor={themeColors.tertiary}
                            progressValueColor={false}
                            showProgressValue={false}
                            // value={progressBarPercentage}
                            value={100}
                            inActiveStrokeOpacity={1}
                            radius={68}
                            duration={1000}
                            maxValue={100}
                            title={false}
                            height={130}
                            width={130}
                            circleBackgroundColor="transparent"
                          />
                        ) : (
                          <CircularProgress
                            activeStrokeWidth={5}
                            inActiveStrokeWidth={0}
                            subtitle={false}
                            activeStrokeColor={themeColors.primaryContainer}
                            progressValueColor={false}
                            showProgressValue={false}
                            value={progressBarPercentage}
                            inActiveStrokeOpacity={1}
                            radius={68}
                            duration={1000}
                            maxValue={100}
                            title={false}
                            height={130}
                            width={130}
                            circleBackgroundColor="transparent"
                          />
                        )}
                      </View>
                    )
                  ) : null}
                </>
              )}
            </View>
          </View>
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
  );

  return (
    <>
      <View style={reduxColors.headerContainer}>
        {imageBackground !== undefined ? (
          <ImageBackground
            style={reduxColors.bgImage}
            source={{ uri: imageBackground }}
          >
            {overlayContent}
          </ImageBackground>
        ) : (
          <View
            //colors={["#224459", "#39ab6b"]}
            // style={{ backgroundColor: themeColors.onPrimaryContainer }}
            style={{ backgroundColor: getBackgroundColor(item.fertility) }}
          >
            {overlayContent}
          </View>
        )}
      </View>
    </>
  );
};

const AppBar = ({ header, style, title }) => {
  const navigation = useNavigation();
  const [moreOptionData, setMoreOptionData] = useState([]);
  const optionPress = (item) => {};
  return (
    <>
      <AnimatedHeader
        optionData={moreOptionData}
        optionPress={optionPress}
        title={capitalize(title)}
        style={style}
        header={header}
      />
    </>
  );
};

// const Body = ({ item, parents }) => {
//   return (
//     <>
//       <View style={styles.bodyContainer}>
//         <ScrollView style={styles.scrollContainer}>
//           <View style={styles.row}>
//             <View style={styles.column}>
//               <Text style={styles.title}>Accession Type</Text>

//               <Text style={styles.description}>{item.accession} </Text>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={styles.column}>
//               <Text style={styles.title}>Lay Date</Text>

//               <Text style={styles.description}>
//                 {moment(item.lay_date).format("MMM Do YY")}
//               </Text>
//             </View>

//             <View style={styles.column}>
//               <Text style={styles.title}>Found Date</Text>
//               <Text style={styles.description}>
//                 {moment(item.found_date).format("MMM Do YY")}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={styles.column}>
//               <Text style={styles.title}>Parent Mother</Text>

//               <Text style={styles.description}>{parents.Mother}</Text>
//             </View>

//             <View style={styles.column}>
//               <Text style={styles.title}>Parent Father</Text>
//               <Text style={styles.description}>{parents.Father}</Text>
//             </View>
//           </View>
//           <View style={styles.row}>
//             <View style={styles.column}>
//               <Text style={styles.title}>Nest Location</Text>
//               <Text style={styles.description}>===</Text>
//             </View>
//             <View style={styles.column}>
//               <Text style={styles.title}>Clutch</Text>
//               <Text style={styles.description}>{item.clutch}</Text>
//             </View>
//           </View>
//           {/* <View style={styles.row}>
//             <View style={styles.column}>
//               <Text style={styles.title}>Fertility Status</Text>
//               <Text style={styles.description}>{item.fertility}</Text>
//             </View>
//           </View> */}
//           <View style={styles.row}>
//             <View style={[styles.column, { flex: 1 }]}>
//               <Text style={styles.title}>Fertility Assessment Method</Text>
//               <Text style={styles.description}>
//                 {item.fertility_assessment_method_label}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.row}>
//             <View style={[styles.column]}>
//               <Text style={styles.title}>Incubation Type</Text>
//               <Text style={styles.description}>
//                 {item.incubation_type_label}
//               </Text>
//             </View>
//           </View>
//         </ScrollView>
//       </View>
//     </>
//   );
// };

const Footer = ({ item, permission, reduxColors, themeColors, onPress }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <>
      <View style={reduxColors.footerContainer}>
        <TouchableOpacity>
          <View style={reduxColors.footerItem}>
            <MaterialIcons name="content-copy" style={reduxColors.footerIcon} />
            <Text style={reduxColors.footerText}>Copy</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            checkPermissionAndNavigateWithAccess(
              permission,
              "collection_animal_record_access",
              navigation,
              "EditEggForm",
              { item: Object.keys(item)?.length ? item : null },
              "EDIT"
            );
            dispatch(setDestination());
            dispatch(removeParentAnimal());
          }}
        >
          <View style={reduxColors.footerItem}>
            <MaterialCommunityIcons
              name="pencil-outline"
              style={reduxColors.footerIcon}
            />
            <Text style={reduxColors.footerText}>Edit</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress}>
          <View style={reduxColors.footerItem}>
            <MaterialCommunityIcons name="egg-easter" size={24} color="black" />
            <Text style={reduxColors.footerText}>Hatched</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const About = ({
  item,
  parents,
  themeColors,
  reduxColors,
  permission,
  loading,
}) => {
  const navigation = useNavigation();
  return (
    <Tabs.ScrollView style={reduxColors.scrollContainer}>
      {item && Object.keys(item)?.length > 0 ? (
        <>
          <View style={reduxColors.textRowWraper}>
            <View style={reduxColors.row}>
              <View style={reduxColors.column}>
                <Text style={reduxColors.title}>Accession Type</Text>

                <Text style={reduxColors.description}>
                  {ifEmptyValue(item.accession)}{" "}
                </Text>
              </View>
            </View>
            <View style={reduxColors.row}>
              <View style={reduxColors.column}>
                <Text style={reduxColors.title}>Lay Date</Text>

                <Text style={reduxColors.description}>
                  {item.lay_date_approx == 1 ? "≈" : null}
                  {ifEmptyValue(dateFormatter(item.lay_date, "DD MMM YY"))}
                </Text>
              </View>
            </View>
            <View style={reduxColors.row}>
              <View style={reduxColors.column}>
                <Text style={reduxColors.title}>Found Date</Text>
                <Text style={reduxColors.description}>
                  {ifEmptyValue(dateFormatter(item.found_date, "DD MMM YY"))}
                </Text>
              </View>
            </View>

            {/* <View style={reduxColors.row}>
          <View style={reduxColors.column}>
            <Text style={reduxColors.title}>Parent Mother</Text>
            <Text style={reduxColors.description}>
              {ifEmptyValue(parents.Mother)}
            </Text>
          </View>
        </View> */}
            {/* <View style={reduxColors.row}>
          <View style={reduxColors.column}>
            <Text style={reduxColors.title}>Parent Father</Text>
            <Text style={reduxColors.description}>
              {ifEmptyValue(parents.Father)}
            </Text>
          </View>
        </View> */}
            <View style={reduxColors.row}>
              <View style={reduxColors.column}>
                <Text style={reduxColors.title}>Nest Location</Text>
                <Text style={reduxColors.description}>===</Text>
              </View>
            </View>
            <View style={reduxColors.row}>
              <View style={reduxColors.column}>
                <Text style={reduxColors.title}>Clutch</Text>
                <Text style={reduxColors.description}>
                  {ifEmptyValue(item.clutch)}
                </Text>
              </View>
            </View>
            {/* <View style={reduxColors.row}>
            <View style={reduxColors.column}>
              <Text style={reduxColors.title}>Fertility Status</Text>
              <Text style={reduxColors.description}>{item.fertility}</Text>
            </View>
          </View>  */}
            <View style={reduxColors.row}>
              <View style={[reduxColors.column, { flex: 1 }]}>
                <Text style={reduxColors.title}>
                  Fertility Assessment Method
                </Text>
                <Text style={reduxColors.description}>
                  {ifEmptyValue(item.fertility_assessment_method_label)}
                </Text>
              </View>
            </View>
            <View style={reduxColors.row}>
              <View style={[reduxColors.column]}>
                <Text style={reduxColors.title}>Incubation Type</Text>
                <Text style={reduxColors.description}>
                  {item.incubation_type_label}
                </Text>
              </View>
            </View>
          </View>
          {(item?.parent_female || item?.parent_male) && (
            <Card
              style={
                item?.parent_male[0]?.parents != null ||
                item?.parent_female[0]?.parents != null
                  ? reduxColors.card
                  : { display: "none" }
              }
              elevation={0}
            >
              <Card.Content>
                <View>
                  <View style={reduxColors.cardContentItem}>
                    {item?.parent_female[0]?.parents != null && (
                      <Text style={reduxColors.cardContentTitle}>
                        Parent Mother
                      </Text>
                    )}
                    {item?.parent_female[0]?.parents?.map((parent, index) => {
                      return (
                        <AnimalCustomCard
                          item={parent}
                          key={index}
                          animalName={
                            parent?.vernacular_name
                              ? parent?.vernacular_name
                              : parent?.scientific_name ?? null
                          }
                          animalIdentifier={
                            !parent?.local_identifier_value
                              ? parent?.animal_id
                              : parent?.local_identifier_name ?? null
                          }
                          localID={parent?.local_identifier_value ?? null}
                          icon={parent?.default_icon ?? null}
                          enclosureName={parent?.user_enclosure_name ?? null}
                          sectionName={parent?.section_name ?? null}
                          show_specie_details={true}
                          show_housing_details={true}
                          chips={
                            parent.sex ?? item?.parent_female[0]?.gender ?? null
                          }
                          noArrow={true}
                          onPress={() =>
                            checkPermissionAndNavigateWithAccess(
                              permission,
                              "collection_animal_record_access",
                              navigation,
                              "AnimalsDetails",
                              {
                                animal_id: parent.animal_id,
                              },
                              "VIEW"
                            )
                          }
                        />
                      );
                    })}
                  </View>
                  <View
                    style={[
                      reduxColors.cardContentItem,
                      { marginTop: Spacing.mini },
                    ]}
                  >
                    {item?.parent_male[0]?.parents != null && (
                      <Text style={reduxColors.cardContentTitle}>
                        Parent Father
                      </Text>
                    )}
                    {item?.parent_male[0]?.parents?.map((parent, index) => {
                      return (
                        <AnimalCustomCard
                          item={parent}
                          key={index}
                          animalName={
                            parent?.vernacular_name
                              ? parent?.vernacular_name
                              : parent?.scientific_name ?? null
                          }
                          animalIdentifier={
                            !parent?.local_identifier_value
                              ? parent?.animal_id
                              : parent?.local_identifier_name ?? null
                          }
                          localID={parent?.local_identifier_value ?? null}
                          icon={parent?.default_icon ?? null}
                          enclosureName={parent?.user_enclosure_name ?? null}
                          sectionName={parent?.section_name ?? null}
                          show_specie_details={true}
                          show_housing_details={true}
                          chips={
                            parent.sex ?? item?.parent_male[0]?.gender ?? null
                          }
                          noArrow={true}
                          onPress={() =>
                            checkPermissionAndNavigateWithAccess(
                              permission,
                              "collection_animal_record_access",
                              navigation,
                              "AnimalsDetails",
                              {
                                animal_id: parent.animal_id,
                              },
                              "VIEW"
                            )
                          }
                        />
                      );
                    })}
                  </View>
                </View>
              </Card.Content>
            </Card>
          )}
        </>
      ) : (
        <ListEmpty height={"60%"} visible={loading} />
      )}
    </Tabs.ScrollView>
  );
};

const Measurements = ({ loading }) => {
  return (
    <>
      <Tabs.ScrollView>
        <View style={{ justifyContent: "center" }}>
          {/* <Text>Measurement Screen</Text> */}
          <ListEmpty height={"60%"} visible={loading} />
        </View>
      </Tabs.ScrollView>
    </>
  );
};

const Nursery = ({ loading }) => {
  return (
    <>
      <Tabs.ScrollView>
        <View style={{ justifyContent: "center" }}>
          {/* <Text>Nursery Screen</Text> */}
          <ListEmpty height={"60%"} visible={loading} />
        </View>
      </Tabs.ScrollView>
    </>
  );
};
const windowHeight = Dimensions.get("screen").height;
const windowWidth = Dimensions.get("screen").width;
const styles = (reduxColors) =>
  StyleSheet.create({
    // Master Container
    masterContainer: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
    },

    // Header Container
    headerContainer: {
      flex: 0.4,
      backgroundColor: reduxColors.danger,
    },

    bgImage: {
      width: "100%",
      height: "100%",
    },

    linearGradient: {
      width: "100%",
      height: "100%",
    },

    overlayContent: {
      // width: "80%",
      // height: "80%",
      // margin: "10%",
    },
    iosoverlayContent: {
      // width: "80%",
      // height: "80%",
      // margin: "10%",
      // bottom: heightPercentageToDP("4.5%"),
    },

    firstRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      // alignItems:'center',
      gap: 2,
      // justifyContent: "space-around",
    },

    textShadow: {
      textShadowColor: reduxColors.housingOverlay,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 10,
    },

    eggIcon: {
      color: reduxColors.onPrimary,
      fontSize: FontSize.Antz_Extra_Major,
      // marginLeft: wp(3),
    },

    eggCount: {
      color: reduxColors.onPrimary,
      fontSize: FontSize.Antz_Major_Medium.fontSize,
      fontWeight: FontSize.Antz_Major_Medium.fontWeight,
    },

    leftSide: {
      marginTop: Spacing.body,
      marginLeft: Spacing.micro * 19,
      justifyContent: "space-evenly",

      textAlign: "justify",
    },

    rightSide: {
      alignItems: "flex-end",
      marginRight: 29,
      marginLeft: "auto",
    },

    gestationTime: {
      width: 130,
      height: 130,
      justifyContent: "center",
      opacity: 0.3,
      alignItems: "center",
      // backgroundColor: reduxColors.secondary,

      borderColor: "transparent",

      borderRadius: 65,
    },

    circleProgress: {
      position: "absolute",
      width: 130,
      height: 130,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
      borderColor: "transparent",
      // borderWidth: 5,
      borderRadius: 65,
    },
    progressIndicator: {
      position: "absolute",
      width: 130,
      height: 130,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    // Body Container
    bodyContainer: {
      position: "relative",
      bottom: 20,
      flex: 0.55,
      backgroundColor: reduxColors.onPrimary,
      borderRadius: 20,
      paddingTop: "6%",
    },
    scrollContainer: {
      padding: Spacing.minor,
      marginBottom: Spacing.minor,
    },
    textRowWraper: {
      backgroundColor: reduxColors.displaybgPrimary,
      display: "flex",
      padding: Spacing.minor,
      flexDirection: "column",
      alignItems: "center",
      gap: Spacing.minor,
      borderRadius: Spacing.small,
      marginBottom: Spacing.minor,
    },
    row: {
      // borderWidth: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      alignSelf: "stretch",
    },
    column: {
      flex: 0.5,
    },
    title: {
      color: reduxColors.neutralSecondary,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    description: {
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
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
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    modalHeader: {
      height: heightPercentageToDP(8),
      width: widthPercentageToDP(90),
      flexDirection: "row",
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: reduxColors.outline,
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalItem: {
      minHeight: hp(10),
    },
    notesInput: {
      width: "100%",
      minHeight: 41,
      padding: Spacing.body,
      backgroundColor: reduxColors.notes,
      color: reduxColors.onErrorContainer,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: reduxColors.onErrorContainer,
    },
    animalCardStyle: {
      justifyContent: "center",
      width: widthPercentageToDP(90),
      borderWidth: 0.5,
      borderRadius: 6,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.surface,
      paddingHorizontal: Spacing.body,
    },
    itemRow: {
      flexDirection: "row",
      marginTop: heightPercentageToDP(2),
      alignItems: "center",
      width: widthPercentageToDP(90),
    },
    modalBtnCover: {
      paddingHorizontal: Spacing.major,
      paddingVertical: Spacing.small,
      borderRadius: 3,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: Spacing.small,
      backgroundColor: reduxColors.primary,
    },
    bottomBtnTxt: {
      fontSize: FontSize.Antz_Minor,
      color: reduxColors.onPrimary,
    },
    // Footer Container
    footerContainer: {
      flex: 0.1,
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      backgroundColor: reduxColors.addBackground,
    },

    footerItem: {
      justifyContent: "center",
      alignItems: "center",
    },

    footerIcon: {
      fontSize: FontSize.Antz_Major_Title_btn.fontSize,
      color: reduxColors.insightMenu,
    },

    footerText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.neutralSecondary,
    },

    // for animal card
    card: {
      marginTop: Spacing.mini,
      backgroundColor: reduxColors.displaybgPrimary,
      marginBottom: Spacing.minor,
    },
    cardContentItem: {
      flex: 0.5,
    },
    cardContentTitle: {
      color: reduxColors.neutralSecondary,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
  });
