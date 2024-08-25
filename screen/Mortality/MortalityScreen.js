import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import Header from "../../components/Header";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import SpeciesCustomCard from "../../components/SpeciesCustomCard";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import CustomCard from "../../components/CustomCard";
import {
  getMortalityListTypeWise,
  getMortalityStatsCount,
} from "../../services/mortalityServices";
import Loader from "../../components/Loader";
import { useToast } from "../../configs/ToastConfig";
import ListEmpty from "../../components/ListEmpty";
import ModalFilterComponent, {
  ModalTitleData,
} from "../../components/ModalFilterComponent";
import { FilterMaster } from "../../configs/Config";
import moment from "moment";
import MortalityStatsCard from "../../components/mortality/MortalityStatsCard";
import { checkPermissionAndNavigateWithAccess } from "../../utils/Utils";
import HeaderMortality from "../../components/HeaderMortality";

const MortalityScreen = (props) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();
  const [type, setType] = useState("species");

  const [Loading, setLoading] = useState(false);
  const [mortalityStatsCount, setMortalityStatsCount] = useState("");

  const [speciesData, setSpeciesData] = useState([]);
  const [speciesDataLength, setSpeciesDataLength] = useState([]);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [speciesPage, setSpeciesPage] = useState(1);

  const [resonData, setResonData] = useState([]);
  const [resonDataLength, setResonDataLength] = useState([]);
  const [resonCount, setResonCount] = useState(0);
  const [resonPage, setResonPage] = useState(1);

  const [animalData, setAnimalData] = useState([]);
  const [animalDataLength, setAnimalDataLength] = useState([]);
  const [animalCount, setAnimalCount] = useState(0);
  const [animalPage, setAnimalPage] = useState(1);

  /*****this is for mortality site filter *****/

  const site = useSelector((state) => state.sites.sites);

  const [selectedFilterValue, setselectedFilterValue] = useState("");
  const [siteValue, setSiteValue] = useState(null);
  const [siteId, setSiteId] = useState(null);

  const mappedResult = site?.map((item) => ({
    id: item.site_id,
    name: item.site_name,
  }));

  const [siteFilterModal, setSiteFilterModal] = useState(false);
  const toggleRoleModal = () => {
    setSiteFilterModal(!siteFilterModal);
  };
  const closeRoleModal = () => {
    setSiteFilterModal(false);
  };

  const closeFilterMenu = (item) => {
    if (!isSelectedFilterId(item?.id)) {
      setselectedFilterValue([item?.id]);
    }
    setSiteValue(item?.name ? item?.name : item);
    setSiteId(item.id);
    setSiteFilterModal(!siteFilterModal);
  };
  const isSelectedFilterId = (id) => {
    return selectedFilterValue?.includes(id);
  };

  /*****this is for mortality filter count update*****/
  const [selectDrop, setSelectDrop] = useState(
    props?.route?.params?.selectedFilter ?? "All time data"
  );
  const [selectedCheckBox, setselectedCheckBox] = useState(
    props?.route?.params?.selectDropID ?? ""
  );
  const [mortalityInshightModal, setMortalityInshightModal] = useState(false);

  // for this months start date
  const dateFormat = "YYYY-MM-DD";
  var currentDate = new Date();

  var end_date = moment(currentDate).format(dateFormat);
  // const startOfMonth = moment().clone().startOf("month").format(dateFormat);
  const Last6Months = moment(currentDate)
    .subtract(6, "months")
    .format(dateFormat);

  const [startDate, setStartDate] = useState(
    props?.route?.params?.startDate ?? null
  );
  const [endDate, setEndDate] = useState(
    props?.route?.params?.endDate ?? end_date
  );

  const [searchModalText, setSearchModalText] = useState("");

  /*****set date and update the count*****/
  const setDates = (s, e, item) => {
    setStartDate(s);
    setEndDate(e);
    setSelectDrop(item);
  };

  const togglePrintModal = () => {
    setMortalityInshightModal(!mortalityInshightModal);
  };
  const closePrintModal = () => {
    setMortalityInshightModal(false);
  };

  const closeMenu = (item) => {
    const today = new Date();
    let start_date = new Date();
    const dateFormat = "YYYY-MM-DD";

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
        warningToast("Oops!!", "Unknown option!");
        return;
    }

    if (!isSelectedId(item?.id)) {
      setselectedCheckBox([item.id]);
    }
    var end_date = moment(today).format(dateFormat);

    setSelectDrop(item.name ?? item);
    setMortalityInshightModal(!mortalityInshightModal);
    setDates(start_date, end_date, item?.name);
  };

  const isSelectedId = (id) => {
    return selectedCheckBox.includes(id);
  };

  const permission = useSelector((state) => state.UserAuth.permission);

  //Toggle tab
  const toggleTab = (data) => {
    setSearchModalText("");
    setType(data);
  };
  useFocusEffect(
    React.useCallback(() => {
      if (searchModalText?.length == 0) {
        // setLoading(true);
        fetchMortalitySpeciesCount();
      } else if (searchModalText?.length >= 3) {
        setLoading(true);
        fetchMortalitySpeciesCount();
      }
      if (type == "species") {
        if (searchModalText?.length == 0) {
          setLoading(true);
          fetchMortalitySpeciesList(1, "");
          setSpeciesPage(1);
        } else if (searchModalText?.length >= 3) {
          setLoading(true);
          fetchMortalitySpeciesList(1, searchModalText);
          setSpeciesPage(1);
        }
      } else if (type == "reasons") {
        if (searchModalText?.length == 0) {
          setLoading(true);
          fetchMortalityResonList(1, "");
          setResonPage(1);
        } else if (searchModalText?.length >= 3) {
          setLoading(true);
          fetchMortalityResonList(1, searchModalText);
          setResonPage(1);
        }
      } else if (type == "animals") {
        if (searchModalText?.length == 0) {
          setLoading(true);
          fetchMortalityAnimalList(1, "");
          setAnimalPage(1);
        } else if (searchModalText?.length >= 3) {
          setLoading(true);
          fetchMortalityAnimalList(1, searchModalText);
          setResonPage(1);
        }
      }
      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [navigation, type, startDate, endDate, siteId, searchModalText])
  );

  const fetchMortalitySpeciesCount = () => {
    let obj = {
      ref_type: "zoo",
      end_date: endDate ?? "",
      start_date: startDate ?? "",
    };
    if (siteId !== null) {
      obj["site_id"] = siteId;
    }
    // if (props?.route?.params?.mortalityObj?.type) {
    //   obj["hr_type"] = props?.route?.params?.mortalityObj?.type;
    //   obj["hr_id"] = props?.route?.params?.mortalityObj?.parent_tsn;
    // }

    getMortalityStatsCount(obj)
      .then((res) => {
        setMortalityStatsCount(res?.data);
        // setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log("err===>", err);
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  const fetchMortalitySpeciesList = (count, searchText) => {
    let obj = {
      type: "species",
      page_no: count,
      end_date: endDate ?? "",
      start_date: startDate ?? "",
      q: searchText,
    };
    if (siteId !== null) {
      obj["site_id"] = siteId;
    }
    // if (props?.route?.params?.mortalityObj?.type) {
    //   obj["hr_type"] = props?.route?.params?.mortalityObj?.type;
    //   obj["hr_id"] = props?.route?.params?.mortalityObj?.parent_tsn;
    // }

    getMortalityListTypeWise(obj)
      .then((res) => {
        let dataArr = count == 1 ? [] : speciesData;
        if (res.data) {
          setSpeciesCount(res?.data?.total_count);
          setSpeciesDataLength(res.data?.result ? res.data?.result?.length : 0);
          setSpeciesData(dataArr.concat(res.data?.result));
        }
        setLoading(false);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //pagenation for species list
  const speciesHandleLoadMore = () => {
    if (
      !Loading &&
      speciesDataLength > 0 &&
      speciesData?.length != speciesCount
    ) {
      const nextPage = speciesPage + 1;
      setSpeciesPage(nextPage);
      fetchMortalitySpeciesList(nextPage, searchModalText);
    }
  };

  const speciesRenderFooter = () => {
    if (
      Loading ||
      speciesDataLength < 10 ||
      speciesData?.length == speciesCount
    ) {
      return null;
    }

    return (
      <ActivityIndicator style={{ color: constThemeColor?.housingPrimary }} />
    );
  };

  const fetchMortalityResonList = (count, searchText) => {
    let obj = {
      type: "reasons",
      page_no: count,
      end_date: endDate ?? "",
      start_date: startDate ?? "",
      q: searchText,
    };
    if (siteId !== null) {
      obj["site_id"] = siteId;
    }
    // if (props?.route?.params?.mortalityObj?.type) {
    //   obj["hr_type"] = props?.route?.params?.mortalityObj?.type;
    //   obj["hr_id"] = props?.route?.params?.mortalityObj?.parent_tsn;
    // }
    getMortalityListTypeWise(obj)
      .then((res) => {
        let dataArr = count == 1 ? [] : resonData;
        if (res.data) {
          setResonCount(res?.data?.total_count);
          setResonDataLength(res.data?.result ? res.data?.result?.length : 0);
          setResonData(dataArr.concat(res.data?.result));
        }
        setLoading(false);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //pagenation for resons list
  const resonHandleLoadMore = () => {
    if (!Loading && resonDataLength > 0 && resonData?.length != resonCount) {
      const nextPage = resonPage + 1;
      setResonPage(nextPage);
      fetchMortalityResonList(nextPage, searchModalText);
    }
  };

  const resonRenderFooter = () => {
    if (Loading || resonDataLength < 10 || resonData?.length == resonCount) {
      return null;
    }

    return (
      <ActivityIndicator style={{ color: constThemeColor?.housingPrimary }} />
    );
  };

  const fetchMortalityAnimalList = (count, searchText) => {
    let obj = {
      type: "animals",
      page_no: count,
      end_date: endDate ?? "",
      start_date: startDate ?? "",
      q: searchText,
    };
    if (siteId !== null) {
      obj["site_id"] = siteId;
    }
    // if (props?.route?.params?.mortalityObj?.type) {
    //   obj["hr_type"] = props?.route?.params?.mortalityObj?.type;
    //   obj["hr_id"] = props?.route?.params?.mortalityObj?.parent_tsn;
    // }
    getMortalityListTypeWise(obj)
      .then((res) => {
        let dataArr = count == 1 ? [] : animalData;
        if (res.data) {
          setAnimalCount(res?.data?.total_count);
          setAnimalDataLength(res.data?.result ? res.data?.result?.length : 0);
          setAnimalData(dataArr.concat(res.data?.result));
        }
        setLoading(false);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //pagenation for animals list
  const animalHandleLoadMore = () => {
    if (!Loading && animalDataLength > 0 && animalData?.length != animalCount) {
      const nextPage = animalPage + 1;
      setAnimalPage(nextPage);
      fetchMortalityAnimalList(nextPage, searchModalText);
    }
  };

  const animalRenderFooter = () => {
    if (Loading || animalDataLength < 10 || animalData?.length == animalCount) {
      return null;
    }

    return (
      <ActivityIndicator style={{ color: constThemeColor?.housingPrimary }} />
    );
  };

  const handleSearch = (text) => {
    setSearchModalText(text);
    if (text?.length >= 3) {
      const getSearchData = setTimeout(() => {
        if (type == "species") {
          setLoading(true);
          fetchMortalitySpeciesList(1, text);
        } else if (type == "animals") {
          setLoading(true);
          fetchMortalityAnimalList(1, text);
        } else if (type == "reasons") {
          setLoading(true);
          fetchMortalityResonList(1, text);
        }
      }, 1500);
      return () => clearTimeout(getSearchData);
    } else if (text?.length == 0) {
      setSearchModalText("");
      const getSearchData = setTimeout(() => {
        if (type == "species") {
          setLoading(true);
          fetchMortalitySpeciesList(1, "");
        } else if (type == "animals") {
          setLoading(true);
          fetchMortalityAnimalList(1, "");
        } else if (type == "reasons") {
          setLoading(true);
          fetchMortalityResonList(1, "");
        }
      }, 1500);
      return () => clearTimeout(getSearchData);
    }
  };

  const clearSearchText = () => {
    setSearchModalText("");
    if (type == "species") {
      setLoading(true);
      fetchMortalitySpeciesList(1, "");
    } else if (type == "animals") {
      setLoading(true);
      fetchMortalityAnimalList(1, "");
    } else if (type == "reasons") {
      setLoading(true);
      fetchMortalityResonList(1, "");
    }
  };

  return (
    <View style={reduxColors.container}>
      <HeaderMortality
        noIcon={true}
        title={"Mortality"}
        search={true}
        titlePaddingHorizontal={Spacing.mini}
        handleSearch={handleSearch}
        clearSearchText={clearSearchText}
        searchModalText={searchModalText}
        backgroundColor={"#FFE5DD"} // color code is not in redux
      />
      <Loader visible={Loading} />
      <View style={reduxColors.body}>
        {/* Site Filter */}
        <View
          style={{
            marginHorizontal: Spacing.body,
            marginVertical: Spacing.mini,
            alignItems: "flex-end",
          }}
        >
          <ModalTitleData
            selectDrop={siteValue ? siteValue : "All Sites"}
            toggleModal={toggleRoleModal}
            filterIcon={true}
            size={22}
            filterIconStyle={{ marginLeft: Spacing.small }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {siteFilterModal ? (
            <ModalFilterComponent
              onPress={toggleRoleModal}
              onDismiss={closeRoleModal}
              onBackdropPress={closeRoleModal}
              onRequestClose={closeRoleModal}
              data={mappedResult}
              closeModal={closeFilterMenu}
              title="Filter By"
              style={{ alignItems: "flex-start" }}
              isSelectedId={isSelectedFilterId}
              radioButton={true}
            />
          ) : null}
        </View>

        <View style={reduxColors.mortalityStatsCard}>
          {/* count filter*/}
          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-end",
              alignItems: "center",
            }}
          >
            <ModalTitleData
              selectDrop={selectDrop}
              // loading={Loading}
              toggleModal={togglePrintModal}
              selectDropStyle={[
                FontSize.Antz_Subtext_Regular,
                { color: constThemeColor.onTertiaryContainer },
              ]}
              filterIconStyle={{ marginLeft: Spacing.small }}
              filterIconcolor={{ color: constThemeColor.onTertiaryContainer }}
              filterIcon={true}
              size={20}
              isFromInsights={true}
            />
            {mortalityInshightModal ? (
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
                radioButton={true}
              />
            ) : null}
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              onPress={() => toggleTab("reasons")}
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: Spacing.small + Spacing.micro,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Large_Title.fontSize,
                    fontWeight: FontSize.Antz_Large_Title.fontWeight,
                    color: constThemeColor.onTertiaryContainer,
                    textAlign: "center",
                  }}
                >
                  {mortalityStatsCount?.reason_count ?? "00"}
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                    color: constThemeColor.onErrorContainer,
                    marginBottom: Spacing.body,
                    textAlign: "center",
                  }}
                >
                  Reasons
                </Text>
              </View>

              <View
                style={[
                  {
                    height: 6,
                    width: 85,
                    borderTopLeftRadius: Spacing.small,
                    borderTopRightRadius: Spacing.small,
                    backgroundColor:
                      type == "reasons"
                        ? constThemeColor.tertiary
                        : "transparent",
                  },
                ]}
              ></View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleTab("species")}
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: Spacing.small + Spacing.micro,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Large_Title.fontSize,
                    fontWeight: FontSize.Antz_Large_Title.fontWeight,
                    color: constThemeColor.onTertiaryContainer,
                    textAlign: "center",
                  }}
                >
                  {mortalityStatsCount?.species_count ?? "00"}
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                    color: constThemeColor.onErrorContainer,
                    marginBottom: Spacing.body,
                    textAlign: "center",
                  }}
                >
                  Species
                </Text>
              </View>

              <View
                style={[
                  {
                    height: 6,
                    width: 85,
                    borderTopLeftRadius: Spacing.small,
                    borderTopRightRadius: Spacing.small,
                    backgroundColor:
                      type == "species"
                        ? constThemeColor.tertiary
                        : "transparent",
                  },
                ]}
              ></View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleTab("animals")}
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: Spacing.small + Spacing.micro,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Large_Title.fontSize,
                    fontWeight: FontSize.Antz_Large_Title.fontWeight,
                    color: constThemeColor.onTertiaryContainer,
                    textAlign: "center",
                  }}
                >
                  {mortalityStatsCount?.total_animal ?? "00"}
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                    color: constThemeColor.onErrorContainer,
                    marginBottom: Spacing.body,
                    textAlign: "center",
                  }}
                >
                  Animals
                </Text>
              </View>

              <View
                style={[
                  {
                    height: 6,
                    width: 85,
                    borderTopLeftRadius: Spacing.small,
                    borderTopRightRadius: Spacing.small,
                    backgroundColor:
                      type == "animals"
                        ? constThemeColor.tertiary
                        : "transparent",
                  },
                ]}
              ></View>
            </TouchableOpacity>
          </View>
        </View>
        {type == "species" && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={speciesData}
            renderItem={({ item }) => {
              return (
                <>
                  {/* {type == "species" ? ( */}
                  <SpeciesCustomCard
                    icon={item.default_icon}
                    animalName={
                      item.scientific_name ? item?.scientific_name : "NA"
                    }
                    complete_name={item.common_name ? item.common_name : "NA"}
                    tags={item.sex_data}
                    count={item.total}
                    onPress={() =>
                      navigation.navigate("MortalitySpeciesReson", {
                        specie_id: item?.specie_id,
                        icon: item.default_icon,
                        SpeciesName: item.scientific_name
                          ? item?.scientific_name
                          : "NA",

                        complete_name: item.common_name
                          ? item.common_name
                          : "NA",
                        startDate: startDate,
                        endDate: endDate,
                        selectedFilter: selectDrop,
                      })
                    }
                  />
                  {/* ) : (
                    <AnimalCustomCard
                      animalName={"nscjgvyh"}
                      chips={"male"}
                      show_housing_details={true}
                      sectionName={"Section name"}
                      enclosureName={"Enclosure name"}
                    />
                  )} */}
                </>
              );
            }}
            keyExtractor={(i, index) => index.toString()}
            onEndReached={speciesHandleLoadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={speciesRenderFooter}
            ListEmptyComponent={<ListEmpty height={"50%"} visible={Loading} />}
          />
        )}

        {type == "reasons" && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={resonData}
            renderItem={({ item }) => {
              return (
                <>
                  <CustomCard
                    title={item?.reasons}
                    count={item?.total}
                    onPress={() => {
                      navigation.navigate("MortalityResonSpecies", {
                        reson_name: item?.reasons,
                        reson_id: item?.reason_id,
                        startDate: startDate,
                        endDate: endDate,
                        selectedFilter: selectDrop,
                      });
                    }}
                  />
                </>
              );
            }}
            keyExtractor={(i, index) => index.toString()}
            onEndReached={resonHandleLoadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={resonRenderFooter}
            ListEmptyComponent={<ListEmpty height={"50%"} visible={Loading} />}
          />
        )}
        {type == "animals" && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={animalData}
            renderItem={({ item }) => {
              return (
                <AnimalCustomCard
                  item={item}
                  discoveredDate={item?.discovered_date}
                  reasonName={item?.reason_name}
                  animalIdentifier={
                    item?.local_identifier_value
                      ? item?.local_identifier_name
                      : item?.animal_id
                  }
                  localID={item?.local_identifier_value ?? null}
                  icon={item?.default_icon}
                  enclosureName={item?.user_enclosure_name}
                  animalName={
                    item?.common_name
                      ? item?.common_name
                      : item?.scientific_name
                  }
                  scientific_name={item?.scientific_name ?? null}
                  sectionName={item?.section_name}
                  siteName={item?.site_name}
                  show_mortality_details={true}
                  show_specie_details={true}
                  show_housing_details={true}
                  chips={item?.sex}
                  // noArrow={true}
                  onPress={() =>
                    checkPermissionAndNavigateWithAccess(
                      permission,
                      "collection_animal_record_access",
                      navigation,
                      "AnimalsDetails",
                      {
                        animal_id: item?.animal_id,
                        default_tab: "Mortality", //Mortality Medical
                      },
                      "VIEW"
                    )
                  }
                />
              );
            }}
            keyExtractor={(i, index) => index.toString()}
            onEndReached={animalHandleLoadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={animalRenderFooter}
            ListEmptyComponent={<ListEmpty height={"50%"} visible={Loading} />}
          />
        )}
      </View>
    </View>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFE5DD",
    },
    body: {
      flex: 1,
      paddingHorizontal: Spacing.minor,
    },
    mortalityStatsCard: {
      backgroundColor: reduxColors.tertiaryContainer,
      borderRadius: Spacing.small + Spacing.mini,
      paddingTop: Spacing.minor - 1,
      paddingHorizontal: Spacing.minor,
      marginBottom: Spacing.minor,
    },
  });

export default MortalityScreen;
