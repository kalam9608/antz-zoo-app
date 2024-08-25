// DATE:13 APRIL 2023
// NAME: GANESH AHER
// WORK:
// 1. fixed parot ScrollView
// 2. fixed the Image issues in GenusHierarchy page
// 3. fixed the  header issues in GenusHierarchy page
// 4. Design the Title in GenusHierarchy page

// modify By : Gaurav Shukla
//date:04-05-2023
//description: remove the Background image form header and give the desing according figma(DefaultOverlayContent) .

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
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
// import Loader from "../../components/Loader";
import { Card, FAB } from "react-native-paper";
import CustomCard from "../../components/CustomCard";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Colors from "../../configs/Colors";
import OverlayContent from "../../components/OverlayContent";
import DefaultOverlayContent from "../../components/DefaultOverlayContent";
import Loader from "../../components/Loader";
import { TouchableOpacity } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import InsightStatsCard from "../../components/InsightStatsCard";
import FontSize from "../../configs/FontSize";
import moment from "moment";
import Spacing from "../../configs/Spacing";
import ListEmpty from "../../components/ListEmpty";
import { useToast } from "../../configs/ToastConfig";
import SliderComponent from "../../components/SliderComponent";
import { FilterMaster } from "../../configs/Config";
import { LinearGradient } from "expo-linear-gradient";

export default function GenusHierarchy(props) {
  const navigation = useNavigation();
  const route = useRoute();

  //for header BackGround Image
  const [showBackgroundImage, SetShowBackgroundImage] = useState(false);
  const [galleryImageData, setGalleryImageData] = useState([]);

  //Getting current ZooID
  const zooID = useSelector((state) => state.UserAuth.zoo_id);

  //Control HomeStat Card
  const [showOrder, setShowOrder] = useState(false);

  //HomeStat Data
  const [orderHierchyData, setOrderHierchyData] = useState([]);

  const [Loading, setLoading] = useState(false);
  const [LoadingInsight, setLoadingInsight] = useState(false);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const [refreshing, setRefreshing] = useState(false);

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
        type: "genus",
        parent_tsn: route.params?.tsn_id ?? 0,
      }),
      getGalleryImage("family", route.params?.tsn_id ?? 0),
    ])
      .then((res) => {
        setOrderHierchyData(res[0].data);
        setGalleryImageData(res[1]?.data);
        SetShowBackgroundImage(res[1]?.data?.length > 0 ? true : false);
        setShowOrder(true);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });
  const [data, setData] = useState({});
  const { open } = state;
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

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
      type: "family",
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
    <>
      <Loader visible={Loading} />
      <StatusBar />
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
              preTitle={"Family"}
              title={capitalize(route.params.title)}
              subtitle={route.params.subtitle}
              hideMenu={true}
            />
          </View>
        ) : (
          <View style={styles.DefaultHeaderContainer}>
            <SliderComponent
              imageData={galleryImageData}
              autoPlay={true}
              navigation={navigation}
              preTitle={"Family"}
              title={capitalize(route.params.title)}
              subtitle={route.params.subtitle}
              hideMenu={true}
            />
          </View>
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
              type: "family",
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
        classType={"family"}
        tsn_id={props.route.params?.tsn_id}
        loading={Loading ? null : LoadingInsight}
        selectedFilter={selectedFilter}
      />

      <View
        style={{
          flex: 1,
          height: "100%",
          backgroundColor: constThemeColor.surfaceVariant,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            paddingHorizontal: Spacing.minor,
            paddingBottom: Spacing.small,
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
            Genus under{" "}
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
          ListEmptyComponent={
            <ListEmpty label={`No genus data found `} visible={Loading} />
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <View style={{ marginHorizontal: 14 }}>
                <CustomCard
                  title={
                    item?.common_name
                          ? capitalize(item?.common_name)
                          : item.complete_name
                          ? capitalize(item?.complete_name)
                          : "NA"
                  }
                  scientific_name={
                    item.complete_name ? capitalize(item?.complete_name) : "NA"
                  }
                  icon={route.params.icon}
                  tsn_id={item.tsn_id}
                  onPress={() =>
                    navigation.navigate("SpeciesHierarchy", {
                      tsn_id: item?.tsn_id ?? 0,
                      title: item.complete_name
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
        <FAB.Group
          open={open}
          fabStyle={reduxColors.fabStyle}
          visible
          icon={open ? "close-circle-outline" : "plus-circle-outline"}
          actions={[
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

const styles = (reduxColors) =>
  StyleSheet.create({
    headerContainer: {
      height: "31%",
      width: "100%",
    },
    DefaultheaderContainer: {
      // height: "20%",
      width: "100%",
      // backgroundColor: Colors.ImageBackgroundColor,
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
    },
    dataContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      bottom: 10,
    },
    cardTitle: {
      color: reduxColors.onSurface,
      fontWeight: FontSize.weight600,
      fontSize: FontSize.Antz_Strong,
      margin: 15,
    },
    cardNumber: {
      fontSize: FontSize.Antz_Large,
      fontWeight: FontSize.weight600,
    },

    dataRow: {
      alignItems: "center",
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
