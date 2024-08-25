import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import SpeciesCustomCard from "../../components/SpeciesCustomCard";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import CustomCard from "../../components/CustomCard";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import ImageComponent from "../../components/ImageComponent";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useToast } from "../../configs/ToastConfig";
import {
  getMortalityResonWiseList,
  getMortalitySpeciesCount,
} from "../../services/mortalityServices";
import Loader from "../../components/Loader";
import ListEmpty from "../../components/ListEmpty";
import moment from "moment";
import { FilterMaster } from "../../configs/Config";
import MortalityStatsCard from "../../components/mortality/MortalityStatsCard";
import { checkPermissionAndNavigateWithAccess } from "../../utils/Utils";
import HeaderMortality from "../../components/HeaderMortality";

const MortalityResonSpecies = (props) => {
  const navigation = useNavigation();
  const permission = useSelector((state) => state.UserAuth.permission);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [Loading, setLoading] = useState(false);
  const [mortalityResonCount, setMortalityResonCount] = useState("");

  const [type, setType] = useState("species");
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  /*****this is for mortality filter count update*****/
  const [selectDropValue, setSelectDropValue] = useState(
    props?.route?.params?.selectedFilter ?? "All time data"
  );
  // for this months start date
  const dateFormat = "YYYY-MM-DD";
  var currentDate = new Date();

  var end_date = moment(currentDate).format(dateFormat);

  const [startDate, setStartDate] = useState(
    props?.route?.params?.startDate ?? null
  );
  const [endDate, setEndDate] = useState(
    props?.route?.params?.endDate ?? end_date
  );

  /*****set date and update the count*****/
  const setDates = (s, e, item) => {
    setStartDate(s);
    setEndDate(e);
    setSelectDropValue(item);
  };

  function findIdByName(nameToFind, dataArray) {
    const result = dataArray.find((item) => item.name === nameToFind);
    return result ? result.id?.toString() : null;
  }
  const selectDropID = findIdByName(selectDropValue, FilterMaster);

  //Toggle tab
  const toggleTab = (data) => {
    setSearchText("");
    setType(data);
  };

  const [speciesData, setSpeciesData] = useState([]);
  const [speciesDataLength, setSpeciesDataLength] = useState([]);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [speciesPage, setSpeciesPage] = useState(1);

  const [animalData, setAnimalData] = useState([]);
  const [animalDataLength, setAnimalDataLength] = useState([]);
  const [animalCount, setAnimalCount] = useState(0);
  const [animalPage, setAnimalPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      if (searchText.length == 0) {
        setLoading(true);
        fetchMortalityResonCount();
      }
      if (type == "species") {
        if (searchText.length == 0) {
          setLoading(true);
          fetchMortalityResonSpecies(1, "");
          setSpeciesPage(1);
        } else if (searchText.length >= 3) {
          setLoading(true);
          fetchMortalityResonSpecies(1, searchText);
          setSpeciesPage(1);
        }
      } else if (type == "animals") {
        if (searchText.length == 0) {
          setLoading(true);
          fetchMortalityResonAnimal(1, "");
          setAnimalPage(1);
        } else if (searchText.length >= 3) {
          setLoading(true);
          fetchMortalityResonAnimal(1, searchText);
          setAnimalPage(1);
        }
      }
      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [navigation, type, , startDate, endDate, , searchText])
  );

  const fetchMortalityResonCount = () => {
    let obj = {
      ref_id: props?.route?.params?.reson_id,
      ref_type: "reason",
      end_date: endDate ?? "",
      start_date: startDate ?? "",
    };
    getMortalitySpeciesCount(obj)
      .then((res) => {
        setMortalityResonCount(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchMortalityResonSpecies = (count, search) => {
    let obj = {
      purpose: "species",
      reason_id: props?.route?.params?.reson_id,
      page_no: count,
      end_date: endDate ?? "",
      start_date: startDate ?? "",
      q: search,
    };
    getMortalityResonWiseList(obj)
      .then((res) => {
        let dataArr = count == 1 ? [] : speciesData;
        if (res.data) {
          setSpeciesCount(res?.data?.total_count);
          setSpeciesDataLength(res.data?.result ? res.data?.result?.length : 0);
          setSpeciesData(dataArr.concat(res?.data?.result));
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
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
      fetchMortalityResonSpecies(nextPage, searchText);
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

  const fetchMortalityResonAnimal = (count, search) => {
    let obj = {
      purpose: "animals",
      reason_id: props?.route?.params?.reson_id,
      page_no: count,
      end_date: endDate ?? "",
      start_date: startDate ?? "",
      q: search,
    };
    getMortalityResonWiseList(obj)
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
        setLoading(false);
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
      fetchMortalityResonAnimal(nextPage, searchText);
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
    setSearchText(text);
    if (text?.length >= 3) {
      const getSearchData = setTimeout(() => {
        if (type == "species") {
          setLoading(true);
          fetchMortalityResonSpecies(1, text);
        } else if (type == "animals") {
          setLoading(true);
          fetchMortalityResonAnimal(1, text);
          setAnimalPage(1);
        }
      }, 1500);
      return () => clearTimeout(getSearchData);
    } else if (text?.length == 0) {
      setSearchText("");
      const getSearchData = setTimeout(() => {
        if (type == "species") {
          setLoading(true);
          fetchMortalityResonSpecies(1, "");
        } else if (type == "animals") {
          setLoading(true);
          fetchMortalityResonAnimal(1, "");
          setAnimalPage(1);
        }
      }, 1500);
      return () => clearTimeout(getSearchData);
    }
  };

  const clearSearchText = () => {
    setSearchText("");
    if (type == "species") {
      setLoading(true);
      fetchMortalityResonSpecies(1, "");
    } else if (type == "animals") {
      setLoading(true);
      fetchMortalityResonAnimal(1, "");
      setAnimalPage(1);
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
        searchModalText={searchText}
        backgroundColor={"#FFE5DD"} // color code is not in redux
      />
      <Loader visible={Loading} />
      <View style={reduxColors.body}>
        <Text
          style={{
            fontSize: FontSize.Antz_Major,
            fontWeight: FontSize.weight400,
            marginBottom: Spacing.minor,
          }}
        >
          {props?.route?.params?.reson_name ?? "NA"}
        </Text>
        {/* <View style={reduxColors.mortalityStatsCard}>
        
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
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
                  {mortalityResonCount?.species_count ?? "00"}
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
                        ? constThemeColor?.tertiary
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
                  {mortalityResonCount?.total_animal ?? "00"}
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
        </View> */}

        {/* this is for mortality insight filter date */}

        <MortalityStatsCard
          type="species"
          setDates={setDates}
          mortalityStatsCount={mortalityResonCount ?? "00"}
          screenType={type}
          onTogglePress={toggleTab}
          selectedFilterValue={selectDropValue}
          selectDropID={selectDropID}
        />

        {type == "species" ? (
          <FlatList
            data={speciesData}
            renderItem={({ item }) => {
              return (
                <>
                  <SpeciesCustomCard
                    icon={item?.default_icon}
                    animalName={
                      item?.scientific_name ? item?.scientific_name : "NA"
                    }
                    complete_name={item?.common_name ? item?.common_name : "NA"}
                    tags={item?.sex_data}
                    count={item?.total}
                    onPress={() =>
                      navigation.navigate("MortalityResonSpeciesList", {
                        reson_name: props?.route?.params?.reson_name,
                        reson_id: props?.route?.params?.reson_id,
                        specie_id: item?.specie_id,
                        icon: item.default_icon,
                        SpeciesName: item.scientific_name
                          ? item?.scientific_name
                          : "NA",

                        complete_name: item.common_name
                          ? item.common_name
                          : "NA",
                      })
                    }
                    keyExtractor={(i, index) => index.toString()}
                    onEndReached={speciesHandleLoadMore}
                    onEndReachedThreshold={0.4}
                    ListFooterComponent={speciesRenderFooter}
                    ListEmptyComponent={
                      <ListEmpty height={"50%"} visible={Loading} />
                    }
                  />
                </>
              );
            }}
          />
        ) : (
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
                        default_tab: "Mortality",
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
      backgroundColor: "#FFE5DD", // no color code in redux
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

export default MortalityResonSpecies;
