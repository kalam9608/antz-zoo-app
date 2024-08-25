import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  ScrollView,
  View,
  FlatList,
  Text,
  BackHandler,
  Alert,
  Dimensions,
  RefreshControl,
} from "react-native";
import InsightsCard from "../../components/InsightsCard";
import Header from "../../components/Header";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import InsightAnimalCard from "../../components/InsightAnimalCard";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
//Import API CALLS

import { getHierarchy, getInsightsData } from "../../services/StatsService";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Colors from "../../configs/Colors";
import InsightsCardComp from "../../components/InsightsCardComp";
import moment from "moment";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { AntDesign } from "@expo/vector-icons";
import { FilterMaster } from "../../configs/Config";
import { AnimalStatsType } from "../../configs/Config";
import ListEmpty from "../../components/ListEmpty";
import { useToast } from "../../configs/ToastConfig";
import BottomSheetForOutSIdeClickClose from "../../components/BottomSheetForOutSIdeClickClose";
import ModalListing from "../Listing/ModalListing";

const Collections = () => {
  const navigation = useNavigation();
  //Dark time
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  //Getting current ZooID
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  //Control HomeStat Card
  const [showClass, setShowClass] = useState(false);

  //HomeStat Data
  const [classHierchyData, setClassHierchyData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [LoadingInsight, setLoadingInsight] = useState(false);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  // const dynamicStyles = styles(constThemeColor);
  const permission = useSelector((state) => state.UserAuth.permission);

  const [isPortrait, setIsPortrait] = useState(
    Dimensions.get("window").height > Dimensions.get("window").width
  );
  const bottmsheetref = useRef();
  const [ShowListModal, setShowListModal] = useState(false);
  const updateOrientation = () => {
    const isNowPortrait =
      Dimensions.get("window").height > Dimensions.get("window").width;
    setIsPortrait(isNowPortrait);
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
      setLoading(true);
      fetchHirarchyData();
      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [])
  );

  const fetchHirarchyData = () => {
    getHierarchy({ zoo_id: zooID, type: "class" })
      .then((res) => {
        if (res.success) {
          setClassHierchyData(res.data);
          setShowClass(true);
          setLoading(false);
        }
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

  // for this months start date
  const dateFormat = "YYYY-MM-DD";
  var currentDate = new Date();

  var end_date = moment(currentDate).format(dateFormat);
  // const startOfMonth = moment().clone().startOf("month").format(dateFormat);
  const Last6Months = moment(currentDate)
    .subtract(6, "months")
    .format(dateFormat);
  const [selectDrop, setSelectDrop] = useState("Last 6 Months");
  const [startDate, setStartDate] = useState(Last6Months);
  const [endDate, setEndDate] = useState(end_date);
  const [data, setData] = useState({});
  const setDates = (s, e, item) => {
    setStartDate(s);
    setEndDate(e);
    setSelectDrop(item);
  };

  const [apiCallData, setApiCallData] = useState({});
  function findIdByName(nameToFind, dataArray) {
    const result = dataArray.find((item) => item.name === nameToFind);
    return result ? result.id : null;
  }
  const selectDropIDValue = findIdByName(selectDrop, FilterMaster);

  useFocusEffect(
    React.useCallback(() => {
      setLoadingInsight(true);
      fetchInsightData();
      return () => {};
    }, [startDate, endDate])
  );

  const fetchInsightData = () => {
    let obj = {
      zoo_id: zooID,
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
    fetchInsightData();
    fetchHirarchyData();
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: constThemeColor.surfaceVariant,
        }}
      >
        <Loader visible={Loading} />

        <Header
          title="Collections"
          noIcon={true}
          search={true}
          hideMenu={true}
          // gotoSearchPage={() => navigation.navigate("InsightSearching")}
          gotoSearchPage={() =>
            navigation.navigate("AnimalList", {
              type: AnimalStatsType.allAnimals,
              name: "All Animals",
            })
          }
          style={
            {
              // paddingBottom: widthPercentageToDP("2%"),
              // paddingTop: widthPercentageToDP("4%"),
              // marginBottom: heightPercentageToDP(1),
            }
          }
        />

        <ScrollView
          style={{
            // marginHorizontal: widthPercentageToDP("3.5%"),
            marginHorizontal: Spacing.minor,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
              style={{ color: constThemeColor?.blueBg }}
              enabled={true}
            />
          }
        >
          <InsightsCardComp
            setdates={setDates}
            onPress={() => {
              navigation.navigate("MortalityScreen", {
                //MortalityScreen  ===>use this for new mortality screen
                mortalityObj: { zoo_id: zooID },
                mortalityType: "",
                selectedFilter: selectDrop,
                startDate: startDate,
                endDate: endDate,
                selectDropID: selectDropIDValue.toString(),
              });
            }}
            species={data?.species_count ?? "00"}
            population={data?.population ?? "00"}
            accession={data?.total_accession ?? "00"}
            birth={data?.birth_count ?? "00"}
            mortality={data?.mortality_count ?? "00"}
            egg={"100"}
            classType={"zoo"}
            loading={Loading ? null : LoadingInsight}
            selectDropID={selectDropIDValue.toString()}
            showModalList={true}
            ClickOnStats={ClickOnStats}
          />
          {classHierchyData?.classification_list ? (
            <View
              style={{
                marginVertical: Spacing.minor,
              }}
            >
              <FlatList
                data={classHierchyData.classification_list}
                numColumns={isPortrait ? 2 : 3}
                key={isPortrait ? "Portrait" : "Landscape"}
                columnWrapperStyle={{
                  flex: 1,
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.tsn_id}
                style={{
                  // backgroundColor: "red",
                  marginHorizontal: -6,
                }}
                renderItem={({ item }) => {
                  return (
                    <>
                      <InsightAnimalCard
                        classData={item}
                        showClassHierchy={showClass}
                        isPortrait={isPortrait}
                        deviceWidth={Dimensions.get("window").width}
                        numColumns={isPortrait ? 2 : 3}
                        onPress={() => {
                          navigation.navigate("OrderHierarchy", {
                            tsn_id: item.tsn_id,
                            title: item.complete_name,
                            icon: item.default_icon,
                            selectedFilter: selectDrop,
                            startDate: startDate,
                            endDate: endDate,
                            selectDrop: selectDrop,
                          });
                        }}
                      />
                    </>
                  );
                }}
              />
            </View>
          ) : (
            <ListEmpty label="No Collections Found" visible={Loading} />
          )}
        </ScrollView>
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
};

export default Collections;
