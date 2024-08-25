// Name: Ganesh Aher
// Date:24 April
// work: Add FlatList

/**
 * Modified By: Joseph Gerald J
 * Modification Date: 23/08/23
 *
 * Modification: Added pagination in the listing
 */

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import Loader from "../../components/Loader";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import { filterAnimals } from "../../services/AnimalService";
import FloatingButton from "../../components/FloatingButton";
import Colors from "../../configs/Colors";
import ListEmpty from "../../components/ListEmpty";
import { errorToast } from "../../utils/Alert";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { Menu } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import moment from "moment";
import SearchOnPage from "../../components/searchOnPage";
import { FilterMaster, Duration, AnimalStatsType } from "../../configs/Config";
import {
  checkPermissionAndNavigateWithAccess,
  dateFormatter,
} from "../../utils/Utils";
import MenuModalComponent from "../../components/MenuModalComponent";
import { useToast } from "../../configs/ToastConfig";
import { getAsyncData } from "../../utils/AsyncStorageHelper";
import { Searchbar } from "react-native-paper";

const AnimalList = (props) => {
  const navigation = useNavigation();
  const [animalList, setAnimalList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [type, setType] = useState(
    props.route?.params?.type ?? AnimalStatsType.allAnimals
  );
  const [page, setPage] = useState(1);
  const [animalListDataLength, setAnimalListDataLength] = useState([]);
  const permission = useSelector((state) => state.UserAuth.permission);
  const { showToast } = useToast();
  const searchRef = useRef();
  const [searchModalText, setSearchModalText] = useState("");
  const [selectDrop, setSelectDrop] = useState("");
  const [dropdownValue, setDropdownValue] = useState(
    props.route?.params?.duration ??
      (props.route?.params?.type === AnimalStatsType.recentlyAdded
        ? Duration.last6Months
        : Duration.allTime)
  );
  const [visible, setVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [totalAnimalCount, setTotalAnimalCount] = useState(0);
  const [isHideStats, setIsHideStats] = useState(null);
  const openMenu = () => setVisible(true);
  const closeMenu = (item) => {
    setSelectDrop(item.name ?? item);
    setDropdownValue(item.value);
    setVisible(false);
    setDuration(item.value);
  };

  const setDuration = (duration) => {
    const today = new Date();
    let start_date = new Date();
    const dateFormat = "YYYY-MM-DD";

    switch (duration) {
      case Duration.thisMonth:
        start_date = moment(today).clone().startOf("month").format(dateFormat);
        break;
      case Duration.last7Days:
        start_date = moment(today).subtract(7, "days").format(dateFormat);
        break;
      case Duration.last3Months:
        start_date = moment(today).subtract(3, "months").format(dateFormat);
        break;
      case Duration.last6Months:
        start_date = moment(today).subtract(6, "months").format(dateFormat);
        break;
      case Duration.allTime:
        start_date = null;
        break;
      default:
        showToast("warning", "Oops! Something went wrong!");
        return;
    }

    var end_date = moment(today).format(dateFormat);

    setStartDate(start_date);
    setEndDate(end_date);
  };

  useFocusEffect(
    useCallback(() => {
      getHideStatsValue();
    }, [])
  );

  const getHideStatsValue = async () => {
    const value = await getAsyncData("@antz_hide_stats");
    setIsHideStats(value);
  };
  // new added
  useEffect(() => {
    // Function to fetch data
    const fetchData = () => {
      setIsLoading(true);
      setPage(1);
      getData(1);
    };

    // Call fetchData when necessary parameters change
    fetchData();

    // Cleanup function
    return () => {
      // Cleanup logic here, if any
    };
  }, [navigation, startDate, endDate, type]); //add this function

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     setIsLoading(true);
  //     setPage(1);
  //     getData(1);
  //   });
  //   return unsubscribe;
  // }, [navigation,startDate]);
  useEffect(() => {
    setSelectDrop(
      FilterMaster.find((item) => item.value === dropdownValue).name
    );
    setDuration(dropdownValue);
  }, [dropdownValue]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setIsLoading(true);
  //     setPage(1);
  //     getData(1);

  //     return () => {
  //       // Clean up the effect when the screen is unfocused (if necessary)
  //     };
  //   }, [navigation, startDate, type])
  // );

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setSearchModalText(searchModalText);
      setStartDate(startDate);
      setIsLoading(true);
      setPage(1);
      getData(1);
    });

    return unsubscribe;
  }, [navigation, startDate, endDate, type, searchModalText]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   setPage(1);
  //   getData(1);
  //   return () => {};
  // }, [navigation, startDate, type]);  //comment out kore6i
  useEffect(() => {
    if (
      searchModalText !== "" &&
      (searchModalText.length === 0 || searchModalText.length >= 3)
    ) {
      const getSearchData = setTimeout(() => {
        setIsLoading(true);
        getData(1);
      }, 1500);
      return () => clearTimeout(getSearchData);
    } else if (searchModalText?.length == 0) {
      setIsLoading(true);
      getData(1);
    }
  }, [searchModalText]);
  useEffect(() => {
    if (props.route?.params) {
      setType(props.route?.params?.type ?? AnimalStatsType.allAnimals);
    }
  }, [props.route?.params]);

  const handleSearch = (text) => {
    setSearchModalText(text);
    setPage(1);
  };

  const clearSearchText = () => {
    setSearchModalText("");
    setPage(1);
  };
  const getData = (page) => {
    // Keyboard.dismiss();
    let obj = {
      page_no: page,
      type: type,
      start_date: startDate,
      end_date: endDate,
      q: searchModalText,
    };
    filterAnimals(obj)
      .then((res) => {
        if (res.success) {
          let dataArr = page == 1 ? [] : animalList;
          setTotalAnimalCount(
            res.data.total_animal_count === undefined
              ? 0
              : res.data.total_animal_count
          );
          if (res.data) {
            if (res.data.animals) {
              dataArr = dataArr.concat(res.data.animals);
            }
            setAnimalList(dataArr);
            setAnimalListDataLength(dataArr.length);
            setIsLoading(false);
          }
        } else {
          setAnimalListDataLength(totalAnimalCount);
        }
        // setIsLoading(false);
        // setRefreshing(false);
      })
      .catch((err) => {
        showToast("error", "Oops! Something went wrong!");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const handleLoadMore = () => {
    Keyboard?.dismiss()
    if (
      !isLoading &&
      animalListDataLength > 0 &&
      animalListDataLength != totalAnimalCount
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      getData(nextPage);
    }
  };

  const renderFooter = () => {
    if (
      isLoading ||
      animalListDataLength < 10 ||
      animalListDataLength == totalAnimalCount
    ) {
      return null;
    }
    return <ActivityIndicator style={{ color: Colors.primary }} />;
  };
  const ListEmptyComponent = () => {
    return (
      <>
        {isLoading || animalList?.length == 0 ? (
          <ListEmpty visible={isLoading} />
        ) : null}
      </>
    );
  };

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  return (
    <>
      <Header noIcon={true} title={props.route?.params?.name ?? "Animals"} />
      <Loader
        visible={
          searchModalText?.length == 0 && !Keyboard?.isVisible()
            ? isLoading
            : false
        }
      />
      <View
        style={[
          reduxColors.container,
          {
            backgroundColor: constThemeColor.surfaceVariant,
          },
        ]}
      >
        {/* <SearchOnPage
          handleSearch={handleSearch}
          searchModalText={searchModalText}
          placeholderText="Search animals"
          clearSearchText={clearSearchText}
        /> */}

        <Searchbar
          ref={searchRef}
          placeholder={`Search animals`}
          inputStyle={{
            color: constThemeColor.onPrimaryContainer,
            fontSize: FontSize.Antz_Body_Regular.fontSize,
            fontWeight: FontSize.Antz_Body_Regular.fontWeight,
          }}
          placeholderTextColor={constThemeColor.onSurfaceVariant}
          style={[
            {
              backgroundColor: constThemeColor.surface,
              width: "100%",
              borderRadius: Spacing?.small,
            },
          ]}
          loading={
            searchModalText?.length >= 3 || Keyboard?.isVisible()
              ? isLoading
              : false
          }
          onChangeText={(e) => {
            handleSearch(e);
          }}
          value={searchModalText}
          autoFocus={false}
        />

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: Spacing.body,
            marginBottom: Spacing.small,
          }}
        >
          <View>
            <Text
              style={[
                FontSize.Antz_Body_Title,
                { color: constThemeColor.onPrimaryContainer },
              ]}
            >
              {isHideStats ? "" : totalAnimalCount + " Results"}
            </Text>
          </View>
          {animalList?.length != 0 ? (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MenuModalComponent
                  visible={visible}
                  onDismiss={() => setVisible(false)}
                  openMenu={openMenu}
                  Data={FilterMaster}
                  closeMenu={closeMenu}
                  selectDrop={selectDrop}
                  textColor={{ color: constThemeColor.onSurface }}
                  // loading={loading}
                  dropdownValue={dropdownValue}
                />
              </View>
            </View>
          ) : null}
        </View>

        <FlatList
          data={animalList}
          renderItem={({ item }) => (
            <AnimalCustomCard
              item={item}
              isHideStats={isHideStats}
              animalIdentifier={
                !item?.local_identifier_value || !item?.local_identifier_name
                  ? item?.animal_id
                  : item?.local_identifier_name ?? null
              }
              siteName={item?.site_name ? item?.site_name : "NA"}
              localID={
                item?.local_identifier_value && item?.local_identifier_name
                  ? item?.local_identifier_value
                  : null
              }
              icon={item?.default_icon}
              enclosureName={item?.user_enclosure_name}
              animalName={
                item?.default_common_name
                  ? item?.default_common_name
                  : item?.complete_name
              }
              sectionName={item?.section_name}
              show_specie_details={true}
              show_housing_details={true}
              chips={item?.sex}
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
              extra={true}
              age={
                type == "transfered_animals" &&
                moment(item?.transfered_date)?.format("D MMM YYYY")
              }
              transfered_animals={type == "transfered_animals" ? true : false}
            />
          )}
          keyExtractor={(item) => item?.animal_id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                setPage(1);
                getData(1);
              }}
            />
          }
          onScroll={()=>{Keyboard?.dismiss()}}
          onEndReachedThreshold={0}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={ListEmptyComponent}
        />

        {/* <FloatingButton
          icon="plus-circle-outline"
          backgroundColor={constThemeColor.flotionBackground}
          borderWidth={0}
          borderColor={constThemeColor.flotionBorder}
          borderRadius={50}
          linkTo=""
          floaterStyle={{ height: 60, width: 60 }}
          onPress={() => navigation.navigate("AnimalAddDynamicForm")}
        /> */}
      </View>
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: Spacing.minor,
      // paddingBottom: Spacing.minor,
    },

    dropdown: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurface,
    },
  });

export default AnimalList;
