import React, { useState, useEffect } from "react";
import InsightsCard from "../../components/InsightsCard";
import Header from "../../components/Header";
import { Avatar, Card, Chip, FAB } from "react-native-paper";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  View,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useSelector } from "react-redux";
import { capitalize, opacityColor } from "../../utils/Utils";
import CustomCard from "../../components/CustomCard";
import { AntDesign } from "@expo/vector-icons";
import Loader from "../../components/Loader";

//Import API CALLS
import {
  getGalleryImage,
  getInsightsData,
  getInsightsDatacount,
  getSpeciesHierarchy,
} from "../../services/StatsService";
import Colors from "../../configs/Colors";
import OverlayContent from "../../components/OverlayContent";
import DefaultOverlayContent from "../../components/DefaultOverlayContent";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import InsightStatsCard from "../../components/InsightStatsCard";
import FontSize from "../../configs/FontSize";
import SpeciesCustomCard from "../../components/SpeciesCustomCard";
import Spacing from "../../configs/Spacing";
import moment from "moment";
import ListEmpty from "../../components/ListEmpty";
import { useToast } from "../../configs/ToastConfig";
import SliderComponent from "../../components/SliderComponent";
import { FilterMaster } from "../../configs/Config";
import { LinearGradient } from "expo-linear-gradient";

export default function SpeciesHierarchy(props) {
  const [showBackgroundImage, SetShowBackgroundImage] = useState(false);
  const [galleryImageData, setGalleryImageData] = useState([]);
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
  const [Loading, setLoading] = React.useState(false);
  const [LoadingInsight, setLoadingInsight] = useState(false);
  const [state, setState] = React.useState({ open: false });

  const [refreshing, setRefreshing] = useState(false);

  const onStateChange = ({ open }) => setState({ open });

  // for this months start date
  const dateFormat = "YYYY-MM-DD";
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
    return result ? result.id?.toString() : null;
  }
  const selectDropID = findIdByName(selectedFilter, FilterMaster);
  // const date = new Date();
  // date.setDate(1);
  // const thismonth = date.toISOString().split("T")[0];
  const { open } = state;
  const [data, setData] = useState({});
  const [countData, setCountData] = useState({});

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
      getSpeciesHierarchy({
        zoo_id: zooID,
        parent_tsn: route.params?.tsn_id ?? 0,
      }),
      getGalleryImage("genus", route.params?.tsn_id ?? 0),
    ])
      .then((res) => {
        setOrderHierchyData(res[0].data);
        setGalleryImageData(res[1]?.data);
        SetShowBackgroundImage(res[1]?.data?.length > 0 ? true : false);
        setShowOrder(true);
        setLoading(false);
      })
      .catch(
        (err) => {
          errorToast("error", "Oops! Something went wrong!");
        }
        // errorToast("Oops!", "Something went wrong!!")
      )
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

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
      type: "genus",
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

  useFocusEffect(
    React.useCallback(() => {
      setLoadingInsight(true);
      let obj = {
        type: "genus",
        parent_tsn: route.params?.tsn_id ?? 0,
      };
      getInsightsDatacount(obj)
        .then((res) => {
          setCountData(res?.data);
          setLoadingInsight(false);
        })
        .catch((err) => {
          errorToast("error", "Oops! Something went wrong!");
          setLoadingInsight(false);
        });
      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [])
  );

  const GenderChip = ({ data }) => {
    return Object.keys(data).map((key) => (
      <View style={key == "male" ? Styles.malechip : Styles.femalechip}>
        <Text
          style={key == "male" ? Styles.malechipText : Styles.femalechipText}
        >{`${capitalize(key)} - ${data[key]}`}</Text>
      </View>
    ));
  };
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHirarchyData();
    fetchInsightData();
  };

  return (
    <View style={reduxColors.screen}>
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
              preTitle={"Genus"}
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
              preTitle={"Genus"}
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
              type: "genus",
              parent_tsn: route.params?.tsn_id,
            },
            mortalityType: capitalize(route.params?.title),
            startDate: startDate,
            endDate: endDate,
            selectedFilter: selectedFilter,
            selectDropID: selectDropID,
          });
        }}
        populationData={data?.population ?? "00"}
        birthData={data?.birth_count ?? "00"}
        mortalityData={data?.mortality_count ?? "00"}
        species={data?.species_count ?? "00"}
        classType={"genus"}
        tsn_id={route.params?.tsn_id}
        loading={Loading ? null : LoadingInsight}
        selectedFilter={selectedFilter}
        siteData={countData?.site_count ?? "00"}
        sectionData={countData?.section_count ?? "00"}
        enclosureData={countData?.enclosure_count ?? "00"}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: constThemeColor.surfaceVariant,
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
            Species under{" "}
            <Text
              style={{
                color: constThemeColor.onSurfaceVariant,
                fontSize: FontSize.Antz_Minor_Title.fontSize,
                fontWeight: FontSize.Antz_Minor_Title.fontWeight,
              }}
            >
              {capitalize(route.params?.title)}
            </Text>
          </Text>
        </View>
        <FlatList
          data={orderHierchyData.classification_list}
          ListEmptyComponent={
            <ListEmpty label={`No species data found `} visible={Loading} />
          }
          keyExtractor={(item) => item.tsn_id}
          renderItem={({ item }) => {
            return (
              <View style={{ marginHorizontal: Spacing.minor }}>
                <SpeciesCustomCard
                  icon={item.default_icon}
                  complete_name={
                    item?.complete_name ? item?.complete_name : "NA"
                  }
                  animalName={item.common_name ? item?.common_name : "NA"}
                  tags={item.sex_data}
                  count={item.animal_count}
                  onPress={() => {
                    navigation.navigate("SpeciesDetails", {
                      title: item.common_name,
                      subtitle: item.complete_name,
                      tags: item.sex_data,
                      tsn_id: item.tsn_id,
                      icon: route.params.icon,
                      species_tsn_id: item.tsn_id,
                    });
                  }}
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
        {orderHierchyData.classification_list?.length > 0 ? (
          <View style={{ marginBottom: Spacing.mini }}></View>
        ) : null}
      </View>
      <FAB.Group
        open={open}
        visible
        fabStyle={reduxColors.fabStyle}
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
  );
}

const styles = (reduxColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: reduxColors.surfaceVariant,
    },
    genderContainer: {
      flexDirection: "row",
    },
    malechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 3,
      backgroundColor: reduxColors?.onSurfaceVariant,
      marginHorizontal: 5,
      fontWeight: FontSize.weight500,
    },
    malechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    femalechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    femalechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 3,
      backgroundColor: reduxColors?.onSurfaceVariant,
      fontWeight: FontSize.weight500,
    },
    headerContainer: {
      height: "31%",
      width: "100%",
    },
    DefaultheaderContainer: {
      //height: "20%",
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

    row: {
      paddingTop: "4%",
      paddingBottom: "4%",
      marginHorizontal: "8%",
      flexDirection: "row",
    },

    column: {
      flex: 0.5,
    },

    // Footer Container
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
