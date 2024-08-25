// DATE:13 APRIL 2023
// NAME: GANESH AHER
// WORK:
// 1.Add Header
// 2.Design Birds Insights
// 3.Add parot ScrollView

import React, { useState, useEffect, useRef } from "react";
import InsightsCard from "../../components/InsightsCard";
import Header from "../../components/Header";
import {
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  View,
  BackHandler,
  RefreshControl,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useSelector } from "react-redux";
import { capitalize } from "../../utils/Utils";
import CustomCard from "../../components/CustomCard";
import Loader from "../../components/Loader";
import { FAB } from "react-native-paper";
//Import API CALLS
import { getHierarchy, getInsightsData } from "../../services/StatsService";
import Colors from "../../configs/Colors";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import InsightsCardComp from "../../components/InsightsCardComp";
import FontSize from "../../configs/FontSize";
import moment from "moment";
import Spacing from "../../configs/Spacing";
import ListEmpty from "../../components/ListEmpty";
import { useToast } from "../../configs/ToastConfig";
import { FilterMaster } from "../../configs/Config";
import BottomSheetForOutSIdeClickClose from "../../components/BottomSheetForOutSIdeClickClose";
import ModalListing from "../Listing/ModalListing";

export default function BirdsInsight(props) {
  const navigation = useNavigation();
  const route = useRoute();
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  // const reduxColors = styles(constThemeColor);
  //Getting current ZooID
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  //Control HomeStat Card
  const [showOrder, setShowOrder] = useState(false);

  //HomeStat Data
  const [orderHierchyData, setOrderHierchyData] = useState([]);
  const [insightsData, setInsightsData] = useState([]);

  // Full Name
  const [fullName, setFullName] = useState("");
  const [Loading, setLoading] = useState(false);
  const [LoadingInsight, setLoadingInsight] = useState(false);
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
    getHierarchy({
      zoo_id: zooID,
      type: "order",
      parent_tsn: route.params?.tsn_id ?? 0,
    })
      .then((res) => {
        setOrderHierchyData(res.data);
        setShowOrder(true);
        setFullName(res.data.classification_list[0].complete_name);
        setLoading(false);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
        setLoading(false);
        setRefreshing(false);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const [data, setData] = useState({});
  const { open } = state;
  const [apiCallData, setApiCallData] = useState({});
  const bottmsheetref = useRef();
  const [ShowListModal, setShowListModal] = useState(false);

  // for this months start date
  const dateFormat = "YYYY-MM-DD";
  const [selectDrop, setSelectDrop] = useState(
    props?.route?.params?.selectDrop ?? "Last 6 Months"
  );
  const [selectedFilter, setSelectedFilter] = useState(
    props.route.params?.selectedFilter ?? ""
  );
  let end_date = moment(new Date()).format(dateFormat);
  const [startDate, setStartDate] = useState(
    props?.route?.params?.startDate ?? null
  );
  const [endDate, setEndDate] = useState(
    props?.route?.params?.endDate ?? end_date
  );
  const setDates = (s, e, item) => {
    setStartDate(s);
    setEndDate(e);
    setSelectDrop(item);
    setSelectedFilter(item);
  };

  useEffect(() => {
    const backAction = () => {
      if (ShowListModal) {
        closeButtonSheet();
      } else {
        navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove(); // This line ensures the event listener is removed when the component unmounts
    };
  }, [navigation, ShowListModal]);

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
      type: "class",
      parent_tsn: route.params?.tsn_id ?? 0,
      end_date: endDate ?? "",
      start_date: startDate ?? "",
    };
    getInsightsData(obj)
      .then((res) => {
        setInsightsData(res.data);

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

  function findIdByName(nameToFind, dataArray) {
    const result = dataArray.find((item) => item.name === nameToFind);
    return result ? result.id : null;
  }
  const selectDropIDValue = findIdByName(selectDrop, FilterMaster);

  const ClickOnStats = (data) => {
    setApiCallData(data);
    setShowListModal(true);
    bottmsheetref?.current?.present();
  };
  const closeButtonSheet = () => {
    setShowListModal(false);
    bottmsheetref?.current?.close();
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHirarchyData();
    fetchInsightData();
  };

  return (
    <>
      <Loader visible={Loading} />
      <View
        style={{
          flex: 1,
          backgroundColor: constThemeColor.surfaceVariant,
        }}
      >
        <Header
          title={
            <Text>
              {capitalize(route.params?.title)}{" "}
              <Text style={{ fontSize: FontSize.Antz_Standerd }}>Class</Text>
            </Text>
          }
          noIcon={true}
          hideMenu={true}
          // style={{
          //   paddingBottom: widthPercentageToDP("3%"),
          //   paddingTop: widthPercentageToDP("2%"),
          // }}
        />
        <ScrollView
          style={{ marginHorizontal: Spacing.minor }}
          showsVerticalScrollIndicator={false}
        >
          {/* <InsightsCard
            title={"Insights"}
            middlelabel={198}
            middlabel={437}
            lastlabel={290}
          
          /> */}
          <InsightsCardComp
            setdates={setDates}
            onPress={() => {
              navigation.navigate("MortalityScreen", {
                //MortalityScreen
                mortalityObj: {
                  zoo_id: zooID,
                  type: "class",
                  parent_tsn: route.params?.tsn_id,
                },
                startDate: startDate,
                endDate: endDate,
                selectedFilter: selectedFilter,
                mortalityType: capitalize(route.params?.title),
                selectDropID: selectDropIDValue.toString(),
              });
            }}
            species={data?.species_count ?? "00"}
            population={data?.population ?? "00"}
            accession={data?.total_accession ?? "00"}
            birth={data?.birth_count ?? "00"}
            mortality={data?.mortality_count ?? "00"}
            egg={"100"}
            classType={"class"}
            selectedFilter={selectedFilter}
            tsn_id={props.route.params?.tsn_id}
            loading={Loading ? null : LoadingInsight}
            selectDropID={selectDropIDValue.toString()}
            showModalList={true}
            ClickOnStats={ClickOnStats}
          />
          <View
            style={{
              flex: 1,
              // paddingVertical: heightPercentageToDP(0.5),
              // paddingTop: 15,
              // paddingBottom: 6,
              // backgroundColor: "red",
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
                //paddingHorizontal: Spacing.minor,
                paddingTop: Spacing.body,
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
                  ? orderHierchyData.classification_list?.length + " "
                  : ""}
                Order under{" "}
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
                <ListEmpty label={`No order data found `} visible={Loading} />
              }
              keyExtractor={(item) => item.tsn_id}
              renderItem={({ item }) => {
                return (
                  <View>
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
                        navigation.navigate("FamilyHierarchy", {
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
                          selectDrop: selectDrop,
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
        <FAB.Group
          open={open}
          visible
          fabStyle={{
            margin: 10,
            right: 5,
            bottom: 20,
            width: 45,
            height: 45,
            justifyContent: "center",
            alignItems: "center",
          }}
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
      <View style={{}}>
        <BottomSheetForOutSIdeClickClose
          onDismiss={() => {
            setShowListModal(false);
            bottmsheetref?.current?.close();
          }}
          ref={bottmsheetref}
        >
          <ModalListing
            type={apiCallData?.type}
            classType={apiCallData?.class_type}
            tsnId={apiCallData?.tsn_id ?? ""}
            totalCount={apiCallData?.totalCount}
            navigation={navigation}
            zooId={zooID}
            closeButtonSheet={closeButtonSheet}
          />
        </BottomSheetForOutSIdeClickClose>
      </View>
    </>
  );
}
