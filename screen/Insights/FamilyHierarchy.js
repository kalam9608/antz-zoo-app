// modify By : Gaurav Shukla
//date:04-05-2023
//description: remove the Background image form header and
//give the desing according figma(DefaultOverlayContent) .

import React, { useState, useEffect } from "react";
// import all the components we are going to use
import {
  ScrollView,
  StyleSheet,
  Animated,
  Text,
  FlatList,
  StatusBar,
  ImageBackground,
  View,
  RefreshControl,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useSelector } from "react-redux";
import { capitalize, opacityColor } from "../../utils/Utils";
//Import API CALLS
import {
  getGalleryImage,
  getHierarchy,
  getInsightsData,
} from "../../services/StatsService";
import { Card, FAB } from "react-native-paper";
import CustomCard from "../../components/CustomCard";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Loader from "../../components/Loader";
import Colors from "../../configs/Colors";
import OverlayContent from "../../components/OverlayContent";
import DefaultOverlayContent from "../../components/DefaultOverlayContent";
import { TouchableOpacity } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import InsightStatsCard from "../../components/InsightStatsCard";
import InsightsCardComp from "../../components/InsightsCardComp";
import moment from "moment";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import ListEmpty from "../../components/ListEmpty";
import { useToast } from "../../configs/ToastConfig";
// import ContentCarousel from "../../components/ContentCarousel";
import { ImageSlider } from "react-native-image-slider-banner";
import AnimatedHeader from "../../components/AnimatedHeader";
import SliderComponent from "../../components/SliderComponent";
import { LinearGradient } from "expo-linear-gradient";
import { FilterMaster } from "../../configs/Config";

const FamilyHierarchy = (props) => {
  const [showBackgroundImage, SetShowBackgroundImage] = useState(false);
  const [galleryImageData, setGalleryImageData] = useState([]);
  let AnimatedHeaderValue = new Animated.Value(0);
  const Header_Maximum_Height = showBackgroundImage ? 300 : 155;
  //Max Height of the Header
  const Header_Minimum_Height = 50;
  //Min Height of the Header

  const animateHeaderBackgroundColor = AnimatedHeaderValue.interpolate({
    inputRange: [0, Header_Maximum_Height],
    outputRange: ["#000", "#fff"],
    extrapolate: "clamp",
  });

  const animateHeaderHeight = AnimatedHeaderValue.interpolate({
    inputRange: [0, Header_Maximum_Height],
    outputRange: [Header_Maximum_Height, 50],
    extrapolate: "clamp",
  });

  const navigation = useNavigation();
  const route = useRoute();

  //Getting current ZooID
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  //Control HomeStat Card
  const [showOrder, setShowOrder] = useState(false);

  //HomeStat Data
  const [orderHierchyData, setOrderHierchyData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const [LoadingInsight, setLoadingInsight] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);

      fetchHirarchyData();

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [])
  );

  const fetchHirarchyData = () => {
    Promise.all([
      getHierarchy({
        zoo_id: zooID,
        type: "family",
        parent_tsn: route.params?.tsn_id ?? 0,
      }),
      getGalleryImage("order", route.params?.tsn_id ?? 0),
    ])
      .then((res) => {
        setOrderHierchyData(res[0]?.data);
        setGalleryImageData(res[1]?.data);
        SetShowBackgroundImage(res[1]?.data?.length > 0 ? true : false);
        setShowOrder(true);
        setLoading(false);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
        setRefreshing(false);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const { open } = state;
  const [data, setData] = useState({});

  // for this months start date
  const dateFormat = "YYYY-MM-DD";
  let end_date = moment(new Date()).format(dateFormat);
  const [startDate, setStartDate] = useState(
    props?.route?.params?.startDate ?? null
  );
  const [endDate, setEndDate] = useState(
    props?.route?.params?.endDate ?? end_date
  );
  const [selectedFilter, setSelectedFilter] = useState(
    props.route.params?.selectedFilter ? props.route.params?.selectedFilter : ""
  );
  function findIdByName(nameToFind, dataArray) {
    const result = dataArray.find((item) => item.name === nameToFind);
    return result ? result.id : null;
  }
  const selectDropID = findIdByName(selectedFilter, FilterMaster);

  const setDates = (s, e, item) => {
    setStartDate(s);
    setEndDate(e);
    setSelectedFilter(item);
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoadingInsight(true);

      fetchInsightData();

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [startDate, endDate])
  );

  const fetchInsightData = () => {
    let obj = {
      zoo_id: zooID,
      type: "order",
      parent_tsn: route.params?.tsn_id ?? 0,
      end_date: endDate ?? "",
      start_date: startDate ?? "",
    };
    getInsightsData(obj)
      .then((res) => {
        let extractedData = {};
        for (const item of res.data) {
          for (const [key, value] of Object.entries(item[0])) {
            extractedData[key] = value;
          }
        }
        setData(extractedData);
        setLoadingInsight(false);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
        setLoadingInsight(false);
        setRefreshing(false);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHirarchyData();
    fetchInsightData();
  };

  return (
    <View style={styles.container}>
      <Loader visible={Loading} />
      <View style={styles.container}>
        <LinearGradient
          colors={[
            constThemeColor.neutralPrimary,
            opacityColor(constThemeColor.neutralPrimary, 90),
            opacityColor(constThemeColor.neutralPrimary, 70),
            opacityColor(constThemeColor.neutralPrimary, 50),
            opacityColor(constThemeColor.neutralPrimary, 30),
          ]}
        >
          {!showBackgroundImage ? (
            <View style={styles.DefaultHeaderContainer}>
              <DefaultOverlayContent
                navigation={navigation}
                preTitle={"Order"}
                title={capitalize(route.params.title)}
                subtitle={route.params.subtitle}
                hideMenu={true}
              />
            </View>
          ) : (
            // <LinearGradient colors={["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0)"]}>
            <View style={styles.DefaultHeaderContainer}>
              <SliderComponent
                linearGradient={true}
                GradientColors={["transparent", "orange", "yellow", "purple"]}
                imageData={galleryImageData}
                autoPlay={true}
                navigation={navigation}
                preTitle={"Order"}
                title={capitalize(route.params.title)}
                subtitle={route.params.subtitle}
                hideMenu={true}
              />
            </View>
            // </LinearGradient>
          )}
        </LinearGradient>
        {/* Insight Stats data ============= */}

        <InsightStatsCard
          setdates={setDates}
          onPress={() => {
            navigation.navigate("MortalityScreen", {
              //MortalityScreen
              mortalityObj: {
                zoo_id: zooID,
                type: "order",
                parent_tsn: route.params?.tsn_id,
              },
              mortalityType: capitalize(route.params?.title),
              startDate: startDate,
              endDate: endDate,
              selectedFilter: selectedFilter,
              selectDropID: selectDropID?.toString(),
            });
          }}
          populationData={data?.population ?? "00"}
          birthData={data?.birth_count ?? "00"}
          mortalityData={data?.mortality_count ?? "00"}
          species={data?.species_count ?? "00"}
          classType={"order"}
          selectedFilter={selectedFilter}
          tsn_id={props.route.params?.tsn_id}
          loading={Loading ? null : LoadingInsight}
        />
        {/* <InsightsCardComp
         
            species={"450"}
            population={"153"}
            accession={"198"}
            birth={"53"}
            mortality={"35"}
            egg={"100"}
          /> */}

        <ScrollView
          scrollEventThrottle={16}
          style={{
            backgroundColor: constThemeColor.surfaceVariant,
            flex: 1,
          }}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { y: AnimatedHeaderValue },
                },
              },
            ],
            { useNativeDriver: false }
          )}
        >
          <View
            style={{
              flex: 1,
              //paddingTop: 10,
              //marginTop: Spacing.mini,
            }}
          >
            <View
              style={{
                // marginBottom: heightPercentageToDP(0.5),
                // width: widthPercentageToDP("95%"),
                // height: heightPercentageToDP(4),
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                paddingHorizontal: Spacing.minor,
                paddingBottom: Spacing.small,
                //backgroundColor: 'red',
              }}
            >
              <Text
                style={{
                  alignItems: "flex-start",
                  width: "100%",
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Minor_Title.fontSize,
                  fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                }}
              >
                {orderHierchyData.classification_list?.length > 0
                  ? orderHierchyData.classification_list.length + " "
                  : ""}
                Family under{" "}
                <Text
                  style={{
                    color: constThemeColor.onSurfaceVariant,
                    fontSize: FontSize.Antz_Minor_Title.fontSize,
                    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                  }}
                >
                  {capitalize(route?.params?.title ?? "NA")}
                </Text>
              </Text>
            </View>
            <FlatList
              data={orderHierchyData.classification_list}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <ListEmpty label={`No family data found`} visible={Loading} />
              }
              renderItem={({ item }) => {
                return (
                  <View style={{ marginHorizontal: Spacing.minor }}>
                    <CustomCard
                      title={
                        item?.common_name
                          ? capitalize(item?.common_name)
                          : item.complete_name
                          ? capitalize(item?.complete_name)
                          : "NA"
                      }
                      scientific_name={
                        item.complete_name
                          ? capitalize(item?.complete_name)
                          : "NA"
                      }
                      icon={route.params.icon}
                      tsn_id={item.tsn_id}
                      onPress={() =>
                        navigation.navigate("GenusHierarchy", {
                          tsn_id: item?.tsn_id ?? 0,
                          title: item?.complete_name
                            ? capitalize(item?.complete_name)
                            : "NA",

                          subtitle: item.common_name
                            ? capitalize(item?.common_name)
                            : "NA",

                          icon: route.params.icon,
                          startDate: startDate,
                          endDate: endDate,
                          selectedFilter: selectedFilter,
                        })
                      }
                      count={item.animal_count}
                    />
                  </View>
                );
              }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => onRefresh()}
                  style={{ color: constThemeColor.blueBg }}
                  enabled={true}
                />
              }
            />
          </View>
        </ScrollView>
      </View>
      <FAB.Group
        open={open}
        visible
        fabStyle={styles.fabStyle}
        icon={open ? "close-circle-outline" : "plus-circle-outline"}
        actions={[
          {
            icon: () => <Ionicons name="paw" size={24} color="#1F515B" />,
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
  );
};

export default FamilyHierarchy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: "100%",
    width: "100%",
  },
  DefaultHeaderContainer: {
    //height: "20%",
    width: "100%",
    backgroundColor: Colors.ImageBackgroundColor,
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
    marginHorizontal: 14,
    marginVertical: 10,
    height: 129,
    backgroundColor: "#F2FFF8",
  },
  dataContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    bottom: 10,
  },
  dataRow: {
    alignItems: "center",
  },
  cardTitle: {
    color: "#006D35",
    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    fontSize: FontSize.Antz_Body_Regular.fontSize,
    margin: 15,
  },
  cardNumber: {
    fontSize: FontSize.Antz_Large_Title.fontSize,
    fontWeight: FontSize.Antz_Large_Title.fontWeight,
    color: "#1F515B",
  },
  cardNumberTitle: {
    color: "#666666",
  },
  dataRow: {
    alignItems: "center",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    left: 0,
    right: 0,
  },
  headerText: {
    color: "#fff",
    fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
    textAlign: "center",
  },
  textStyle: {
    textAlign: "center",
    color: "#000",
    fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
    padding: 20,
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
