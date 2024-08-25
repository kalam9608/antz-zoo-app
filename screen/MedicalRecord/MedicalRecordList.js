import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect } from "react";
import Header from "../../components/Header";
import { useState } from "react";
import { getAnimalMedicalRecordListNew } from "../../services/AnimalService";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import Loader from "../../components/Loader";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import ListEmpty from "../../components/ListEmpty";
import MedicalListCard from "../../components/MedicalListCard";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { TabBar, TabView } from "react-native-tab-view";
import ModalFilterComponent, {
  ModalTitleData,
} from "../../components/ModalFilterComponent";
import { useToast } from "../../configs/ToastConfig";
import { useRoute } from "@react-navigation/native";
import Constants from "../../configs/Constants";
import HousingSearchBox from "../../components/HousingSearchBox";
import { useRef } from "react";

const MedicalRecordList = (props) => {
  const [animalMedicalList, setAnimalMedicalList] = useState([]);
  const [allAnimalMedicalList, setAllAnimalMedicalList] = useState([]);
  const [animalDataLength, setAnimalDataLength] = useState(0);
  const [allAnimalDataLength, setAllAnimalDataLength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [index, setIndex] = useState(
    props.route.params?.filter_label_name ? 1 : 0
  );
  const [medicalListModal, setMedicalListModal] = useState(false);
  const [selectedCheckBox, setselectedCheckBox] = useState(1);
  const [count, setCount] = useState(0);
  const [allCount, setAllCount] = useState(0);
  const [filterName, setFilterName] = useState("Show All");
  const [filterType, setFilterType] = useState("all");
  const [filter, setFilter] = useState("all");
  const [searchLoading, setSearchLoading] = useState(false);
  const [routes] = React.useState([
    { key: "mymedical", title: "My Medical Records" },
    { key: "allmedicallist", title: "All Medical Records" },
  ]);

  const [status] = useState(props?.route?.params?.status);
  const [siteId] = useState(props?.route?.params?.siteId);
  const [sectionId] = useState(props?.route?.params?.sectionId);
  const [enclosureId] = useState(props?.route?.params?.enclosureId);
  const [speciesId] = useState(props?.route?.params?.speciesId);
  const [searchText, setSearchText] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const { errorToast } = useToast();
  const route = useRoute();
  const isFirstRender = useRef(true);

  const [moreLoading, setMoreLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // setFilterName("Show All");
      // setFilterType("all");

      // setFilterName(props.route.params?.filter_label_name ?? "Show All");
      // setFilterType(props.route.params?.filter_value ?? "all");

      if (
        props.route.params?.filter_value &&
        props.route.params?.filter_label_name
      ) {
        setFilterName(props.route.params?.filter_label_name ?? "Show All");
        setFilterType(props.route.params?.filter_value ?? "all");
        filterTypeData?.map((i) => {
          if (
            i?.type == props.route.params?.filter_value ||
            i?.type == filterType
          ) {
            setselectedCheckBox(i?.id);
          }
        });
      }

      // if (props.route.params?.filter_label_name) {
      //   setIndex(1);
      // } else {
      //   setIndex(0);
      // }

      // setselectedCheckBox(1);
      // setPage(1);

      // loadData(1, "all", 0);
      // loadData(1, props.route.params?.filter_value ?? "all", index);
      if (searchText.length >= 3) {
        setPage(1);
        const getData = setTimeout(() => {
          setSearchLoading(true);
          setIsLoading(true);
          loadData(1, filterType, index, searchText);
        }, 1000);

        return () => clearTimeout(getData);
      } else if (searchText.length == 0) {
        setIsLoading(true);
        loadData(
          1,
          props.route.params?.filter_value ?? filterType,
          index,
          searchText
        );
      }
      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [index, filterType, searchText])
  );

  const changeIndexFun = (index) => {
    setAnimalMedicalList([]);
    setAnimalDataLength(0);
    setCount(0);
    setIndex(index);
    // setIsLoading(true);
    // setPage(1);
    // loadData(1, filterType, index);

    setFilterType("all");
    setFilterName("Show All");
    setselectedCheckBox(1);
  };
  const togglePrintModal = () => {
    setMedicalListModal(!medicalListModal);
  };
  const closePrintModal = () => {
    setMedicalListModal(false);
  };

  const closeMenu = (item) => {
    setselectedCheckBox(item.id);
    setFilterName(item.name);
    setFilterType(item.type);
    setIsLoading(true);
    // setPage(1);
    // loadData(1, item.type, index, searchText);
    closePrintModal();
  };
  const loadData = (pageNo, filter, index, q) => {
    if (pageNo == 1) {
      setAnimalMedicalList([]);
      setAnimalDataLength(0);
      setCount(0);
    }
    setPage(pageNo);
    const obj = {
      page_no: pageNo,
      type: index == 0 ? "" : "all",
      q: q,
      // filter: filter,
    };
    if (filter != "all") {
      obj.filter = filter;
    }

    // if (status) {
    //   obj["status"] = status;
    // }

    if (siteId) {
      obj["site_id"] = siteId;
    }

    if (sectionId) {
      obj["section_id"] = sectionId;
    }

    if (enclosureId) {
      obj["enclosure_id"] = enclosureId;
    }

    if (speciesId) {
      obj["species_id"] = speciesId;
    }

    getAnimalMedicalRecordListNew(obj)
      .then((res) => {
        let dataArr = pageNo == 1 ? [] : animalMedicalList;
        setCount(res.data?.count === undefined ? 0 : res.data?.count);
        if (res.data) {
          if (res.data?.result) {
            dataArr = dataArr.concat(res.data?.result);
          }
          setAnimalMedicalList(dataArr);
        }
      })
      .catch((error) => {
        console.log({ error });
        errorToast("error", "Oops! Something went wrong!!");
        setIsLoading(false);
        setRefreshing(false);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
        setSearchLoading(false);
        setMoreLoading(false);
      });
  };

  const renderFooter = () => {
    if (
      isLoading ||
      animalMedicalList.length < 10 ||
      animalMedicalList.length == count
    ) {
      return null;
    }

    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };
  const handleLoadMore = () => {
    if (
      !isLoading &&
      !moreLoading &&
      animalMedicalList.length >= 10 &&
      animalMedicalList.length !== count
    ) {
      setMoreLoading(true);
      const nextPage = page + 1;
      loadData(nextPage, filterType, index, searchText);
    }
  };

  const [filterTypeData] = useState([
    {
      id: 1,
      type: "all",
      name: "Show All",
    },
    {
      id: 2,
      type: "active_diagnosis",
      name: "Active Diagnosis",
    },
    {
      id: 3,
      type: "active_prescriptions",
      name: "Active Prescriptions",
    },
  ]);

  const isSelectedId = (id) => {
    return selectedCheckBox == id;
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (!isFirstRender?.current) {
  //       if (searchText.length >= 3) {
  //         // setPage(1);
  //         const getData = setTimeout(() => {
  //           setSearchLoading(true);
  //           setIsLoading(true);
  //           loadData(1, filterType, index, searchText);
  //         }, 1000);

  //         return () => clearTimeout(getData);
  //       } else if (searchText.length == 0) {
  //         setPage(1);
  //         setSearchLoading(true);
  //         setIsLoading(true);
  //         loadData(1, filterType, index, searchText);
  //       }
  //     } else {
  //       isFirstRender.current = false;
  //     }
  //     return () => {
  //       // Clean up the effect when the screen is unfocused (if necessary)
  //     };
  //   }, [searchText])
  // );
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const showFilter = count == 0 && props.route.params?.filter_value == "all";

  const RenderScene = ({ route }) => {
    switch (route.key) {
      case "mymedical":
        return (
          <>
            <View
              style={{
                paddingHorizontal: Spacing.minor,
              }}
            >
              <View style={{}}>
                <HousingSearchBox
                  value={searchText}
                  onChangeText={(e) => {
                    setSearchText(e);
                  }}
                  onClearPress={() => {
                    setSearchText("");
                  }}
                  loading={searchLoading}
                />
              </View>
              <View
                style={{
                  paddingTop: Spacing.small,
                  paddingBottom: Spacing.mini,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: FontSize.Antz_Body_Medium.fontSize,
                    fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                    color: constThemeColor?.onPrimaryContainer,
                  }}
                >
                  {count} Records
                </Text>
                {!props.route.params?.filter_value ||
                props.route.params?.filter_value ==
                  Constants.MEDICAL_RECORD_FILTER_LABEL_VALUE.ALL ? (
                  <ModalTitleData
                    selectDrop={filterName}
                    selectDropStyle={{
                      fontSize: FontSize.Antz_Body_Medium.fontSize,
                      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                      color: constThemeColor?.onPrimaryContainer,
                    }}
                    customStyle={{}}
                    toggleModal={togglePrintModal}
                    filterIconStyle={{
                      marginLeft: Spacing.small,
                      marginTop: Spacing.micro,
                      color: constThemeColor?.onSurface,
                    }}
                    filterIcon={true}
                    size={20}
                    isFromInsights={true}
                  />
                ) : null}
              </View>

              <FlatList
                data={animalMedicalList}
                contentContainerStyle={{
                  paddingBottom: 100,
                }}
                renderItem={({ item }) => (
                  <MedicalListCard item={item} filter={filterType} />
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.4}
                ListEmptyComponent={<ListEmpty visible={isLoading} />}
                ListFooterComponent={renderFooter}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                      setRefreshing(true);
                      // setPage(1);
                      loadData(1, filterType, index, searchText);
                    }}
                    style={{ flex: 1 }}
                  />
                }
              />
            </View>
          </>
        );
      case "allmedicallist":
        return (
          <View
            style={{
              paddingHorizontal: Spacing.minor,
            }}
          >
            <View style={{}}>
              <HousingSearchBox
                value={searchText}
                onChangeText={(e) => setSearchText(e)}
                onClearPress={() => setSearchText("")}
                loading={searchLoading}
              />
            </View>
            <View
              style={{
                paddingTop: Spacing.small,
                paddingBottom: Spacing.mini,
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  color: constThemeColor?.onPrimaryContainer,
                }}
              >
                {count} Records
              </Text>
              {!props.route.params?.filter_value ||
              props.route.params?.filter_value ==
                Constants.MEDICAL_RECORD_FILTER_LABEL_VALUE.ALL ? (
                <ModalTitleData
                  selectDrop={filterName}
                  selectDropStyle={{
                    fontSize: FontSize.Antz_Body_Medium.fontSize,
                    fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                    color: constThemeColor?.onPrimaryContainer,
                  }}
                  customStyle={{}}
                  toggleModal={togglePrintModal}
                  filterIconStyle={{
                    marginLeft: Spacing.small,
                    marginTop: Spacing.micro,
                    color: constThemeColor?.onSurface,
                  }}
                  filterIcon={true}
                  size={20}
                  isFromInsights={true}
                />
              ) : null}
            </View>
            <FlatList
              data={animalMedicalList}
              contentContainerStyle={{
                paddingBottom: 100,
              }}
              renderItem={({ item }) => (
                <MedicalListCard
                  item={item}
                  filter={filterType}
                  index={index}
                />
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.4}
              ListEmptyComponent={<ListEmpty visible={isLoading} />}
              ListFooterComponent={renderFooter}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true);
                    // setPage(1);
                    loadData(1, filterType, index, searchText);
                  }}
                  style={{ flex: 1 }}
                />
              }
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: constThemeColor.secondaryContainer }}
    >
      <Loader visible={isLoading} />
      <Header
        title={props.route.params?.filter_label_name ?? "Medical Record List"}
        noIcon={true}
        backgroundColor={constThemeColor?.secondaryContainer}
        hideMenu={true}
        // backGoesto={true}
      />

      <TabView
        accessible={true}
        accessibilityLabel={"medicalListTab"}
        AccessibilityId={"medicalListItemTab"}
        navigationState={{ index, routes }}
        renderScene={RenderScene}
        swipeEnabled={false}
        onIndexChange={changeIndexFun}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{
              backgroundColor: constThemeColor.secondaryContainer,
              color: constThemeColor.onSurfaceVariant,
              marginBottom: Spacing.small,
            }}
            labelStyle={{
              textAlign: "center",
              fontSize: FontSize.Antz_Body_Medium.fontSize,
              fontWeight: FontSize.Antz_Body_Medium.fontWeight,
              color: constThemeColor.onSurfaceVariant,
            }}
            indicatorStyle={{
              backgroundColor: constThemeColor.primary,
              height: 4,
              borderTopLeftRadius: Spacing.mini,
              borderTopRightRadius: Spacing.mini,
              width: "40%",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: Spacing.minor + Spacing.mini,
            }}
            activeColor={constThemeColor.onSurface}
          />
        )}
      />

      {medicalListModal ? (
        <ModalFilterComponent
          onPress={togglePrintModal}
          onDismiss={closePrintModal}
          onBackdropPress={closePrintModal}
          onRequestClose={closePrintModal}
          data={filterTypeData}
          closeModal={closeMenu}
          title="Select Filter Type"
          style={{ alignItems: "flex-start" }}
          isSelectedId={isSelectedId}
          radioButton={true}
        />
      ) : null}
    </View>
  );
};

export default MedicalRecordList;
