// @author : Arnab Gupta
//date:23-05-2023

import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Animated,
  Text,
  FlatList,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  View,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  capitalize,
  checkPermissionAndNavigateWithAccess,
  shortenNumber,
} from "../../utils/Utils";
import {
  getMortalityAnimalListByManner,
  getMortalityListingByReasons,
  getMortalityStats,
} from "../../services/StatsService";
import { ActivityIndicator, Card, Checkbox, Menu } from "react-native-paper";
import CustomCard from "../../components/CustomCard";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Loader from "../../components/Loader";
import Colors from "../../configs/Colors";
import OverlayContent from "../../components/OverlayContent";
import DefaultOverlayContent from "../../components/DefaultOverlayContent";
import Header from "../../components/Header";
import { LinearGradient } from "expo-linear-gradient";
import ListEmpty from "../../components/ListEmpty";
import AnimalListCard from "../../components/AnimalListCard";
import {
  heightPercentageToDP,
  widthPercentageToDP,
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RefreshControl } from "react-native-gesture-handler";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import moment from "moment";
import { FilterMaster } from "../../configs/Config";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import MenuModalComponent from "../../components/MenuModalComponent";
import ModalFilterComponent, {
  ModalTitleData,
} from "../../components/ModalFilterComponent";
import { useToast } from "../../configs/ToastConfig";

const MortalityAnimals = (props) => {
  let AnimatedHeaderValue = new Animated.Value(0);
  const Header_Maximum_Height = 200;
  //Max Height of the Header
  const Header_Minimum_Height = 50;
  //Min Height of the Header
  const permission = useSelector((state) => state.UserAuth.permission);
  const animateHeaderBackgroundColor = AnimatedHeaderValue.interpolate({
    inputRange: [0, Header_Maximum_Height],
    outputRange: ["#4286F4", "#fff"],
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
  const [orderHierchyDataLength, setOrderHierchyDataLength] = useState([]);
  const [mortalityStats, setmortalityStats] = useState({});
  const [Loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  const [showBackgroundImage, SetShowBackgroundImage] = useState(false);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const [visible, setVisible] = useState(false);
  const [selectDrop, setSelectDrop] = useState(
    props?.route?.params?.selectedFilter ?? "This Month"
  );
  const [dropdownValue, setDropdownValue] = useState("");
  let end_date = moment(new Date()).format(dateFormat);
  const [startDate, setStartDate] = useState(
    props?.route?.params?.startDate ?? null
  );
  const [endDate, setEndDate] = useState(
    props?.route?.params?.endDate ?? end_date
  );
  const dateFormat = "YYYY-MM-DD";

  const openMenu = () => setVisible(true);
  const closeMenu = (item) => {
    const today = new Date();
    let start_date = new Date();

    switch (item.value) {
      case "this-month":
        start_date = moment(today).clone().startOf("month").format(dateFormat);
        break;
      case "last-7-days":
        start_date = moment(today).subtract(7, "days").format(dateFormat);
        break;
      case "last-3-months":
        start_date = moment(today).subtract(3, "months").format(dateFormat);
        break;
      case "last-6-months":
        start_date = moment(today).subtract(6, "months").format(dateFormat);
        break;
      case "all":
        start_date = null;
        break;
      default:
        warningToast("warning", "Oops! Unknown option!");
        return;
    }
    if (isSelectedId(item.id)) {
      setselectedCheckBox(selectedCheckBox.filter((item) => item !== item.id));
    } else {
      setselectedCheckBox([selectedCheckBox, item.id]);
    }
    var end_date = moment(today).format(dateFormat);

    setSelectDrop(item.name ?? item);
    setDropdownValue(item.value);
    setMortalityStatsData(!mortalityStatsData);
    setStartDate(start_date);
    setEndDate(end_date);
  };
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      setPage(1);
      fetchMortalityAnimals(1);
      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [navigation, startDate, endDate])
  );

  const fetchMortalityAnimals = (page_count) => {
    const clone = JSON.parse(JSON.stringify(props.route.params?.mortalityObj));
    let obj = clone;
    obj.page_no = page_count;
    obj.manner_of_death = props.route.params?.nature_of_death_id;
    (obj.start_date = startDate), (obj.end_date = endDate);
    Promise.all([getMortalityStats(obj), getMortalityAnimalListByManner(obj)])
      .then((res) => {
        setmortalityStats(res[0].data[0]);
        let dataArr = page_count == 1 ? [] : orderHierchyData;
        setOrderHierchyDataLength(res[1].data.length);
        setOrderHierchyData(dataArr.concat(res[1].data));
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

  const handleLoadMore = () => {
    if (!Loading && orderHierchyDataLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMortalityAnimals(nextPage);
    }
  };

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (Loading || orderHierchyDataLength == 0 || orderHierchyDataLength < 10)
      return null;
    return <ActivityIndicator style={{ color: Colors.primary }} />;
  };

  const [checkedItems, setCheckedItems] = useState([]);

  const isCheckedId = (id) => {
    return checkedItems.includes(id);
  };

  const onValueChacked = (id) => {
    if (isCheckedId(id)) {
      setCheckedItems(checkedItems.filter((item) => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const [mortalityStatsData, setMortalityStatsData] = useState(false);
  const togglePrintModal = () => {
    setMortalityStatsData(!mortalityStatsData);
  };
  const closePrintModal = () => {
    setMortalityStatsData(false);
  };
  const [selectedCheckBox, setselectedCheckBox] = useState("");
  const isSelectedId = (id) => {
    return selectedCheckBox.includes(id);
  };
  useEffect(() => {
    const selectedItem = FilterMaster?.find((item) => item.name === selectDrop);
    if (selectedItem) {
      setselectedCheckBox(["", selectedItem.id]);
    }
  }, [selectDrop]);
  return (
    <>
      <Header noIcon={true} search={true} />
      <Loader visible={Loading} />
      <View
        style={[
          reduxColors.container,
          {
            backgroundColor: constThemeColor.surfaceVariant,
          },
        ]}
      >
        <View style={{ marginHorizontal: Spacing.minor }}>
          <Text
            style={{
              fontSize: FontSize.Antz_Major_Regular.fontSize,
              fontWeight: FontSize.Antz_Major_Regular.fontWeight,
              color: constThemeColor.onSecondaryContainer,
            }}
          >
            {props.route.params?.nature_of_death}{" "}
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Title.fontSize,
                fontWeight: FontSize.Antz_Body_Title.fontWeight,
                color: constThemeColor.onSecondaryContainer,
              }}
            >
              {props.route.params?.mortalityType ?? ""}
            </Text>
          </Text>
        </View>
        <Card style={[reduxColors.cardContainer]}>
          <LinearGradient
            colors={[
              constThemeColor.onSecondaryContainer,
              constThemeColor.primary,
            ]}
            style={{
              borderRadius: 8,
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: Spacing.mini,
                // marginHorizontal: Spacing.body,
                paddingTop: Spacing.micro,
              }}
            >
              <ModalTitleData
                selectDrop={selectDrop}
                toggleModal={togglePrintModal}
                filterIconStyle={{ marginLeft: Spacing.small }}
                filterIcon={true}
                size={18}
                touchStyle={{ marginHorizontal: 8, paddingTop: 8 }}
                selectDropStyle={{ color: constThemeColor.secondary }}
                filterIconcolor={{ color: constThemeColor.secondary }}
              />
              {mortalityStatsData ? (
                <ModalFilterComponent
                  onPress={togglePrintModal}
                  onDismiss={closePrintModal}
                  onBackdropPress={closePrintModal}
                  onRequestClose={closePrintModal}
                  data={FilterMaster}
                  closeModal={closeMenu}
                  title="Filter By"
                  style={{ alignItems: "flex-start" }}
                  isSelectedId={isSelectedId}
                  checkIcon={true}
                />
              ) : null}
            </View>
            <View style={reduxColors.dataContainer}>
              <View style={reduxColors.dataRow}>
                <Text style={[reduxColors.cardNumber]}>
                  {shortenNumber(mortalityStats.species_count)}
                </Text>
                <Text style={[reduxColors.cardNumberTitle]}>Species</Text>
              </View>

              <View style={reduxColors.dataRow}>
                <Text style={[reduxColors.cardNumber]}>
                  {shortenNumber(mortalityStats.animal_count)}
                </Text>
                <Text style={[reduxColors.cardNumberTitle]}>Animals</Text>
              </View>

              <View style={reduxColors.dataRow}>
                <Text style={[reduxColors.cardNumberTitle]}>{"         "}</Text>
              </View>
            </View>
          </LinearGradient>
        </Card>
        <ScrollView
          scrollEventThrottle={16}
          style={{
            backgroundColor: constThemeColor.surfaceVariant,
            flex: 1,
            marginTop: 3,
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
          <FlatList
            data={orderHierchyData}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<ListEmpty visible={Loading} />}
            renderItem={({ item }) => {
              return (
                <View style={{ marginHorizontal: Spacing.minor }}>
                  <AnimalCustomCard
                    item={item}
                    show_housing_details={true}
                    show_specie_details={true}
                    chips={item.sex}
                    icon={item.default_icon}
                    enclosureName={item.user_enclosure_name}
                    sectionName={item.section_name}
                    animalName={
                      item?.default_common_name
                        ? item?.default_common_name
                        : item?.scientific_name
                    }
                    animalIdentifier={
                      !item?.local_identifier_value
                        ? item?.animal_id
                        : item?.local_identifier_name ?? null
                    }
                    localID={item?.local_identifier_value ?? null}
                    rightIcon={
                      <View
                        style={{
                          marginRight: widthPercentageToDP("4%"),
                        }}
                      >
                        <AntDesign
                          name="right"
                          size={14}
                          color={constThemeColor.onSurfaceVariant}
                        />
                      </View>
                    }
                    onPress={() =>
                      checkPermissionAndNavigateWithAccess(
                        permission,
                        "collection_animal_record_access",
                        navigation,
                        "AnimalsDetails",
                        {
                          animal_id: item.animal_id,
                        },
                        "VIEW"
                      )
                    }
                  />
                </View>
              );
            }}
            onEndReachedThreshold={0.4}
            onEndReached={handleLoadMore}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  setPage(1);
                  fetchMortalityAnimals(1);
                }}
              />
            }
          />
        </ScrollView>
      </View>
    </>
  );
};

export default MortalityAnimals;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // paddingTop: 10,
    },
    headerContainer: {
      height: "100%",
      width: "100%",
    },
    DefaultHeaderContainer: {
      height: "20%",
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
      marginHorizontal: Spacing.minor,
      marginVertical: Spacing.body,
      height: 110,
      backgroundColor: reduxColors.neutralPrimary,
    },
    dataContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: Spacing.body,
      paddingHorizontal: 30,
    },
    // dataRow: {
    //   alignItems: "center",
    // },
    cardTitle: {
      color: reduxColors.secondary,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: FontSize.Antz_Body_Title.fontSize,
    },
    cardNumber: {
      fontSize: FontSize.Antz_Large_Title.fontSize,
      fontWeight: FontSize.Antz_Large_Title.fontWeight,
      color: reduxColors.onPrimary,
    },
    cardNumberTitle: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onPrimary,
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
      color: reduxColors.surfaceVariant,
      fontSize: FontSize.Antz_Large_Title.fontSize,
      textAlign: "center",
    },
    textStyle: {
      textAlign: "center",
      color: reduxColors.neutralPrimary,
      fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
      padding: 20,
    },
    tagsContainer: {
      flexDirection: "row",
    },
    tag: {
      backgroundColor: reduxColors.tagColor,
      borderRadius: 8,
      // paddingVertical: 4,
      paddingHorizontal: 8,
      marginRight: 8,
    },

    malechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.secondaryContainer,
      marginHorizontal: 5,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
    },
    femalechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.errorContainer,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      marginLeft: 5,
    },
    undeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.displaybgSecondary,
      marginHorizontal: 5,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
    },
    indeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.displaybgSecondary,
      marginHorizontal: 5,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
    },
    malechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    femalechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    undeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    indeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    undeterminedChipB1: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.secondary,
      marginHorizontal: 5,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
    },
    indeterminedChipE1: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.secondary,
      marginHorizontal: 5,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
    },
    malechipM: {
      backgroundColor: reduxColors.surfaceVariant,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      marginHorizontal: 5,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
    },
    femalechipF: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.secondary,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      marginLeft: 5,
    },
  });
