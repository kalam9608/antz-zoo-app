import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Colors from "../../configs/Colors";
import AddMedicalRecordCard from "../../components/AddMedicalRecordCard";
import { useDispatch, useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import FloatingButton from "../../components/FloatingButton";
import ListEmpty from "../../components/ListEmpty";
import Loader from "../../components/Loader";
import Header from "../../components/Header";
import {
  getObservationList,
  getObservationListforAdd,
} from "../../services/ObservationService";
import ObservationCard from "./ObservationCard";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import {
  removeAnimalMovementData,
  setApprover,
} from "../../redux/AnimalMovementSlice";
import { RefreshControl } from "react-native-gesture-handler";
import FilterComponent from "../../components/FilterComponent";
import { searchUserListing } from "../../services/Animal_movement_service/SearchApproval";
import Spacing from "../../configs/Spacing";
import { FAB } from "react-native-paper";
import {
  setMedicalAnimal,
  setMedicalEnclosure,
  setMedicalSection,
  setMedicalSite,
} from "../../redux/MedicalSlice";

const MyObservation = () => {
  const [observation, setObservationList] = useState([]);
  const [observationLength, setObservationLength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [Items, setItems] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [filterData, setFilterData] = useState(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);

  // Scroll to Top state and function
  // const [showScrollToTop, setShowScrollToTop] = useState(false);
  // const flatListRef = useRef(null);
  // const navigateToTop = () => {
  //   // use current
  //   flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  // };
  // const checkScrollDirection = (event) => {
  //   const { y } = event.nativeEvent.contentOffset;
  //   setShowScrollToTop(y > 0);
  // };

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      getObservation(1, filterData);
      setPage(1);
      return () => {};
    }, [filterData])
  );

  const getObservation = (count, filter) => {
    const obj = {
      zoo_id: zooID,
      page_no: count,
    };
    if (filter?.priority) {
      obj.priority = filter.priority;
    }
    if (filter?.note_type) {
      obj.note_type = filter.note_type;
    }
    getObservationList(obj)
      .then((res) => {
        let dataArr = count == 1 ? [] : observation;
        setObservationLength(res.data ? res.data?.length : 0);
        if (res.data) {
          setObservationList(dataArr.concat(res?.data));
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setRefreshing(false);
        console.log("error", e);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const fetchData = () => {
    setIsLoading(true);
    Promise.all([getObservationListforAdd()])
      .then((res) => {
        setItems([
          {
            id: 1,
            title: "Note Type",
            type: null,
            subItem: res[0].data?.map((item) => {
              return { id: item?.id, isSelect: false, name: item?.type_name };
            }),
          },
          {
            id: 2,
            title: "Priority",
            type: null,
            subItem: [
              {
                id: 1,
                name: "Low",
              },
              {
                id: 2,
                name: "Moderate",
              },
              {
                id: 3,
                name: "High",
              },
              {
                id: 4,
                name: "Critical",
              },
            ],
          },
        ]);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const getSelectedData = (item) => {
    setSelectedData(item);
    let filter = {};
    filter.note_type = item
      ?.find((a) => a.title == "Note Type")
      ?.subItem?.filter((b) => b.isSelect == true)
      ?.map((b) => b.id)
      ?.join(",");
    filter.priority = item
      ?.find((a) => a.title == "Priority")
      ?.subItem?.filter((b) => b.isSelect == true)
      ?.map((b) => b.name)
      ?.join(",");
    setFilterData(filter);
  };

  const handleLoadMore = () => {
    if (!isLoading && observationLength > 0) {
      let nextPage = page + 1;
      setPage(nextPage);
      getObservation(nextPage, filterData);
    }
  };

  const renderFooter = () => {
    if (isLoading || observationLength == 0 || observationLength < 10)
      return null;
    return (
      <ActivityIndicator
        size={"large"}
        style={{ color: constThemeColor.primary }}
      />
    );
  };

  return (
    <>
      <View
        style={{ flex: 1, backgroundColor: constThemeColor.surfaceVariant }}
      >
        <Loader visible={isLoading} />

        <View style={{ paddingHorizontal: 16 }}>
          <View
            style={{ alignItems: "flex-end", paddingVertical: Spacing.subMajor }}
          >
            <FilterComponent
              items={Items}
              fetchData={fetchData}
              dataSendBack={getSelectedData}
              selectedData={selectedData}
            />
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={observation}
            // ref={flatListRef}
            // onScroll={checkScrollDirection}
            contentContainerStyle={{ paddingBottom: Spacing.major }}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => {
              return (
                <ObservationCard
                  key={index}
                  item={item}
                  priroty={item.priority}
                  assign_to={item.assign_to}
                  onPress={() => {
                    navigation.navigate("ObservationSummary", { item: item });
                  }}
                  onPressComment={() => {
                    navigation.navigate("ObservationSummary", {
                      item: item,
                      boolen: true,
                    });
                  }}
                />
              );
            }}
            onEndReachedThreshold={0.4}
            onEndReached={handleLoadMore}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={<ListEmpty visible={isLoading} />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  getObservation(1, filterData);
                  setPage(1);
                }}
                style={{ flex: 1 }}
              />
            }
          />
        </View>
      </View>

      <FloatingButton
        icon="plus-circle-outline"
        backgroundColor={Colors.backgroundColorinList}
        borderWidth={0}
        borderColor={Colors.borderColorinListStaff}
        borderRadius={50}
        linkTo=""
        floaterStyle={{ height: 60, width: 60 }}
        onPress={() => {
          dispatch(removeAnimalMovementData());
          dispatch(setMedicalEnclosure([]));
          dispatch(setMedicalAnimal([]));
          dispatch(setMedicalSection([]));
          dispatch(setMedicalSite([]));
          navigation.navigate("Observation");
        }}
      />

      {/* {showScrollToTop && (
        <NavigateToTopFab reduxColors={reduxColors} onPress={navigateToTop} />
      )} */}
    </>
  );
};

const ObserVationTav = () => {
  const [index, setIndex] = useState(0);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const routes = [
    { key: "first", title: "My Notes" },
    { key: "second", title: "All Notes" },
  ];

  const renderScene = SceneMap({
    first: MyObservation,
    second: ObservationList,
  });

  const onIndexChange = (newIndex) => {
    setIndex(newIndex);
  };

  return (
    <>
      <Header
        noIcon={true}
        title={"Notes"}
        showBackButton={false}
        hideMenu={true}
      />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={onIndexChange}
        swipeEnabled={false}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            scrollEnabled={false}
            style={{
              backgroundColor: constThemeColor.surfaceVariant,
              elevation: 0,
              borderBottomWidth: 1,
              borderBottomColor: constThemeColor.outlineVariant,
            }}
            labelStyle={{
              color: constThemeColor.onSurfaceVariant,
              fontSize: FontSize.Antz_Minor_Medium.fontSize,
              fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
              width: "100%",
              textAlign: "center",
              textTransform: "capitalize",
            }}
            tabStyle={{
              height: 44,
            }}
            indicatorStyle={{
              backgroundColor: constThemeColor.primary,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              width: "40%",
              marginLeft: "5%",
            }}
            activeColor={constThemeColor.onSurface}
          />
        )}
      />
    </>
  );
};

const ObservationList = () => {
  const [observation, setObservationList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [observationLength, setObservationLength] = useState(0);
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [Items, setItems] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [filterData, setFilterData] = useState(null);
  const dispatch = useDispatch();

  const reduxColors = styles(constThemeColor);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);

  // Scroll to top

  // const [showScrollToTop, setShowScrollToTop] = useState(false);
  const flatListRef = useRef(null);
  // const navigateToTop = () => {
  //   // use current
  //   flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  // };
  // const checkScrollDirection = (event) => {
  //   const { y } = event.nativeEvent.contentOffset;
  //   setShowScrollToTop(y > 0);
  // };

  useFocusEffect(
    React.useCallback(() => {
      dispatch(setApprover([]));
      setIsLoading(true);
      getObservation(1, filterData);
      setPage(1);
      return () => {};
    }, [filterData])
  );
  const getObservation = (count, filter) => {
    const obj = {
      zoo_id: zooID,
      page_no: count,
      type: "all",
    };
    if (filter?.priority) {
      obj.priority = filter.priority;
    }
    if (filter?.note_type) {
      obj.note_type = filter.note_type;
    }
    if (filter?.created_by) {
      obj.created_by = filter.created_by;
    }
    if (filter?.tagged_to) {
      obj.tagged_to = filter.tagged_to;
    }
    getObservationList(obj)
      .then((res) => {
        let dataArr = count == 1 ? [] : observation;
        setObservationLength(res.data ? res.data?.length : 0);
        if (res.data) {
          setObservationList(dataArr.concat(res?.data));
        }
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", e);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const handleLoadMore = () => {
    if (!isLoading && observationLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      getObservation(nextPage, filterData);
    }
  };

  const renderFooter = () => {
    if (isLoading || observationLength == 0 || observationLength < 10)
      return null;
    return (
      <ActivityIndicator
        size={"large"}
        style={{ color: constThemeColor.primary }}
      />
    );
  };

  const fetchData = () => {
    let postData = {
      zoo_id: zooID,
      isActive: true,
    };
    setIsLoading(true);
    Promise.all([getObservationListforAdd(), searchUserListing(postData)])
      .then((res) => {
        setItems([
          {
            id: 1,
            title: "Note Type",
            type: null,
            subItem: res[0].data?.map((item) => {
              return { id: item?.id, isSelect: false, name: item?.type_name };
            }),
          },
          {
            id: 2,
            title: "Priority",
            type: null,
            subItem: [
              {
                id: 1,
                name: "Low",
              },
              {
                id: 2,
                name: "Moderate",
              },
              {
                id: 3,
                name: "High",
              },
              {
                id: 4,
                name: "Critical",
              },
            ],
          },
          {
            id: 3,
            title: "Created By",
            type: "user",
            subItem: res[1].data?.map((item) => {
              return { ...item, id: item?.user_id, isSelect: false };
            }),
          },
          {
            id: 4,
            title: "Tagged To",
            type: "user",
            subItem: res[1].data?.map((item) => {
              return { ...item, id: item?.user_id, isSelect: false };
            }),
          },
        ]);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const getSelectedData = (item) => {
    setSelectedData(item);
    let filter = {};
    filter.note_type = item
      ?.find((a) => a.title == "Note Type")
      ?.subItem?.filter((b) => b.isSelect == true)
      ?.map((b) => b.id)
      ?.join(",");
    filter.priority = item
      ?.find((a) => a.title == "Priority")
      ?.subItem?.filter((b) => b.isSelect == true)
      ?.map((b) => b.name)
      ?.join(",");
    filter.created_by = item
      ?.find((a) => a.title == "Created By")
      ?.subItem?.filter((b) => b.isSelect == true)
      ?.map((b) => b.id)
      ?.join(",");
    filter.tagged_to = item
      ?.find((a) => a.title == "Tagged To")
      ?.subItem?.filter((b) => b.isSelect == true)
      ?.map((b) => b.id)
      ?.join(",");
    setFilterData(filter);
  };

  return (
    <>
      <View
        style={{ flex: 1, backgroundColor: constThemeColor.surfaceVariant }}
      >
        <Loader visible={isLoading} />

        <View style={{ paddingHorizontal: 16 }}>
          <View
            style={{
              alignItems: "flex-end",
              paddingVertical: Spacing.mini,
              display: observation?.length > 0 ? "flex" : "none",
            }}
          >
            <FilterComponent
              items={Items}
              fetchData={fetchData}
              dataSendBack={getSelectedData}
              selectedData={selectedData}
            />
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            // ref={flatListRef}
            data={observation}
            // onScroll={checkScrollDirection}
            contentContainerStyle={{ paddingBottom: Spacing.major }}
            keyExtractor={(item, index) => index}
            ListEmptyComponent={<ListEmpty visible={isLoading} />}
            renderItem={({ item, index }) => {
              return (
                <ObservationCard
                  key={index}
                  item={item}
                  priroty={item.priority}
                  assign_to={item.assign_to}
                  onPress={() => {
                    navigation.navigate("ObservationSummary", { item: item });
                  }}
                  onPressComment={() => {
                    navigation.navigate("ObservationSummary", {
                      item: item,
                      boolen: true,
                    });
                  }}
                />
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
                  getObservation(1, filterData);
                  setPage(1);
                }}
                style={{ flex: 1 }}
              />
            }
          />
        </View>
      </View>

      <FloatingButton
        icon="plus-circle-outline"
        backgroundColor={Colors.backgroundColorinList}
        borderWidth={0}
        borderColor={Colors.borderColorinListStaff}
        borderRadius={50}
        linkTo=""
        floaterStyle={{ height: 60, width: 60 }}
        onPress={() => {
          dispatch(removeAnimalMovementData());
          dispatch(setMedicalEnclosure([]));
          dispatch(setMedicalAnimal([]));
          dispatch(setMedicalSection([]));
          dispatch(setMedicalSite([]));
          navigation.navigate("Observation");
        }}
      />

      {/* {showScrollToTop && (
        <NavigateToTopFab reduxColors={reduxColors} onPress={navigateToTop} />
      )} */}
    </>
  );
};

const NavigateToTopFab = ({ onPress, reduxColors }) => {
  return (
    <FAB
      label="Navigate to top"
      style={reduxColors.fabStyle}
      onPress={onPress}
    />
  );
};

export default ObserVationTav;
const styles = (reduxColors) =>
  StyleSheet.create({
    fabStyle: {
      // position: "absolute",
      // margin: 25,
      // right: 0,
      // bottom: 60,
      // width: 50,
      // height: 50,
      justifyContent: "center",
      alignSelf: "center",
      width: "50%",
      backgroundColor: "transparent",
      // elevation: 8
    },
  });
