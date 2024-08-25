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
import Loader from "../../components/Loader";
import {
  getMortalitySpeciesCount,
  getMortalitySpeciesWiseList,
} from "../../services/mortalityServices";
import ListEmpty from "../../components/ListEmpty";
import { useToast } from "../../configs/ToastConfig";
import MortalityStatsCard from "../../components/mortality/MortalityStatsCard";
import moment from "moment";
import Config, { FilterMaster } from "../../configs/Config";
import { capitalize, checkPermissionAndNavigateWithAccess } from "../../utils/Utils";
import HeaderMortality from "../../components/HeaderMortality";

const MortalitySpeciesReson = (props) => {
  const navigation = useNavigation();
  const permission = useSelector((state) => state.UserAuth.permission);

  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const [Loading, setLoading] = useState(false);
  const [mortalityStatsCount, setMortalityStatsCount] = useState("");
  const [type, setType] = useState("reasons");

  const [speciesResonData, setSpeciesResonData] = useState([]);
  const [resonDataLength, setResonDataLength] = useState([]);
  const [resonCount, setResonCount] = useState(0);
  const [resonPage, setResonPage] = useState(1);

  const [animalData, setAnimalData] = useState([]);
  const [animalDataLength, setAnimalDataLength] = useState([]);
  const [animalCount, setAnimalCount] = useState(0);
  const [animalPage, setAnimalPage] = useState(1);
  const [searchText, setSearchText] = useState("");

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

  useFocusEffect(
    React.useCallback(() => {
      if (searchText.length == 0) {
        setLoading(true);
        fetchMortalitySpeciesCount();
      }

      if (type == "reasons") {
        if (searchText.length == 0) {
          setLoading(true);
          fetchSpeciesResonList(1, "");
          setResonPage(1);
        } else if (searchText.length >= 3) {
          setLoading(true);
          fetchSpeciesResonList(1, searchText);
          setResonPage(1);
        }
      } else if (type == "animals") {
        if (searchText.length == 0) {
          setLoading(true);
          fetchSpeciesAnimalList(1, "");
          setAnimalPage(1);
        } else if (searchText.length >= 3) {
          setLoading(true);
          fetchSpeciesAnimalList(1, searchText);
          setAnimalPage(1);
        }
      }
      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [navigation, type, startDate, endDate, searchText])
  );

  const fetchMortalitySpeciesCount = () => {
    let obj = {
      ref_id: props?.route?.params?.specie_id,
      ref_type: "species",
      end_date: endDate ?? "",
      start_date: startDate ?? "",
    };
    getMortalitySpeciesCount(obj)
      .then((res) => {
        setMortalityStatsCount(res?.data);
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

  const fetchSpeciesResonList = (count, search) => {
    let obj = {
      purpose: "reasons",
      taxonomy_id: props?.route?.params?.specie_id,
      page_no: count,
      end_date: endDate ?? "",
      start_date: startDate ?? "",
      q: search,
    };
    getMortalitySpeciesWiseList(obj)
      .then((res) => {
        let dataArr = count == 1 ? [] : speciesResonData;
        if (res.data) {
          setResonCount(res?.data?.total_count);
          setResonDataLength(res.data?.result ? res.data?.result?.length : 0);
          setSpeciesResonData(dataArr.concat(res.data?.result));
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

  //pagenation for resons list
  const resonHandleLoadMore = () => {
    if (
      !Loading &&
      resonDataLength > 0 &&
      speciesResonData?.length != resonCount
    ) {
      const nextPage = resonPage + 1;
      setResonPage(nextPage);
      fetchSpeciesResonList(nextPage, searchText);
    }
  };

  const resonRenderFooter = () => {
    if (
      Loading ||
      resonDataLength < 10 ||
      speciesResonData?.length == resonCount
    ) {
      return null;
    }

    return (
      <ActivityIndicator style={{ color: constThemeColor?.housingPrimary }} />
    );
  };

  const fetchSpeciesAnimalList = (count, search) => {
    let obj = {
      purpose: "animals",
      taxonomy_id: props?.route?.params?.specie_id,
      page_no: count,
      end_date: endDate ?? "",
      start_date: startDate ?? "",
      q: search,
    };
    getMortalitySpeciesWiseList(obj)
      .then((res) => {
        let dataArr = count == 1 ? [] : animalData;
        if (res.data) {
          setAnimalCount(res?.data?.total_count);
          setAnimalDataLength(res.data?.result ? res.data?.result?.length : 0);
          setAnimalData(dataArr.concat(res?.data?.result));
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
      fetchSpeciesAnimalList(nextPage, searchText);
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
        if (type == "reasons") {
          setLoading(true);
          fetchSpeciesResonList(1, text);
        } else if (type == "animals") {
          setLoading(true);
          fetchSpeciesAnimalList(1, text);
          setAnimalPage(1);
        }
      }, 1500);
      return () => clearTimeout(getSearchData);
    } else if (text?.length == 0) {
      setSearchText("");
      const getSearchData = setTimeout(() => {
        if (type == "reasons") {
          setLoading(true);
          fetchSpeciesResonList(1, "");
        } else if (type == "animals") {
          setLoading(true);
          fetchSpeciesAnimalList(1, "");
          setAnimalPage(1);
        }
      }, 1500);
      return () => clearTimeout(getSearchData);
    }
  };

  const clearSearchText = () => {
    setSearchText("");
    if (type == "reasons") {
      setLoading(true);
      fetchSpeciesResonList(1, "");
    } else if (type == "animals") {
      setLoading(true);
      fetchSpeciesAnimalList(1, "");
      setAnimalPage(1);
    }
  };

  return (
    <View style={styles.container}>
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
      <View style={styles.body}>
        <View
          style={{
            flexDirection: "row",
            borderWidth: 1,
            borderColor: constThemeColor?.tertiaryContainer,
            borderRadius: Spacing.small + Spacing.mini,
            paddingHorizontal: Spacing.minor,
            paddingVertical: Spacing.minor,
            marginBottom: Spacing.minor,
          }}
        >
          <View style={{ marginRight: Spacing.body, alignSelf: "center" }}>
            <ImageComponent
              icon={
                props?.route?.params?.icon ??
                `${Config.BASE_APP_URL}uploads/assets/class_images/default_animal.svg`
              }
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: FontSize.Antz_Minor,
                fontWeight: FontSize.weight600,
              }}
            >
              {capitalize(props?.route?.params?.complete_name)}
            </Text>
            <Text
              style={{
                color: constThemeColor.onSurfaceVariant,
                fontStyle: "italic",
              }}
            >
              ({capitalize(props?.route?.params?.SpeciesName)})
            </Text>
          </View>
        </View>
        {/* <View style={styles.mortalityStatsCard}>

          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
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
        </View> */}

        <MortalityStatsCard
          type="reasons"
          setDates={setDates}
          mortalityStatsCount={mortalityStatsCount ?? "00"}
          screenType={type}
          onTogglePress={toggleTab}
          selectedFilterValue={selectDropValue}
          selectDropID={selectDropID}
        />

        {type == "reasons" ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={speciesResonData}
            renderItem={({ item }) => {
              return (
                <>
                  <CustomCard
                    title={item?.reasons}
                    count={item?.total}
                    onPress={() =>
                      navigation.navigate("MortalitySpeciesResonList", {
                        reason_id: item?.reason_id,
                        reson_name: item?.reasons,
                        total_reson: item?.total,
                        specie_id: props?.route?.params?.specie_id,
                        icon: props?.route?.params?.icon,
                        SpeciesName: props?.route?.params?.SpeciesName
                          ? props?.route?.params?.SpeciesName
                          : "NA",

                        complete_name: props?.route?.params?.complete_name
                          ? props?.route?.params?.complete_name
                          : "NA",
                      })
                    }
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

const style = (reduxColors) =>
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

export default MortalitySpeciesReson;
