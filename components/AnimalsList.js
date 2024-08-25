import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Divider } from "react-native-paper";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import {
  getAnimalsList,
  getAnimalsListWithSubEnc,
} from "../services/GetEnclosureBySectionIdServices";
import { getAsyncData } from "../utils/AsyncStorageHelper";
import Loader from "./Loader";
import AnimalCustomCard from "./AnimalCustomCard";
import SpeciesCustomCard from "./SpeciesCustomCard";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";

const AnimalsList = ({
  type,
  siteId,
  sectionId,
  enclosureId,
  speciesData,
  permission,
  onItemPress,
  subEnclosure,
}) => {
  console.log(subEnclosure);
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [page, setPage] = useState([]);
  const [searchModalText, setSearchModalText] = useState("");
  const [animalsList, setAnimalsList] = useState([]);
  const [stopCallAnimalsList, setStopCallAnimalsList] = useState(false);
  const [isHideStats, setIsHideStats] = useState(null);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const customStyles = styles(constThemeColor);

  const taxonomyId = speciesData?.tsn_id ?? null;

  useEffect(() => {
    setLoading(true);
    loadAnimalsList(1);
    resetState();
    getHideStatsValue();
  }, [siteId, sectionId, enclosureId, taxonomyId]);

  const getHideStatsValue = async () => {
    const value = await getAsyncData("@antz_hide_stats");
    setIsHideStats(value);
  };

  const resetState = () => {
    setPage(1);
    setAnimalsList([]);
    setStopCallAnimalsList(false);
  };

  const loadAnimalsList = (count) => {
    type === "enclosure" && subEnclosure && speciesData !== null
      ? getAnimalsListWithSubEnc({
          ...(type === "site" && { site_id: siteId }),
          ...(type === "section" && { section_id: sectionId }),
          ...(type === "enclosure" && { enclosure_id: enclosureId }),
          ...(taxonomyId && { species_id: taxonomyId }),
          page_no: count,
        })
          .then((res) => {
            if (res?.success) {
              setAnimalsList((prev) => {
                if (count === 1) {
                  return res?.data ?? [];
                } else {
                  return [...(prev ?? []), ...(res?.data ?? [])];
                }
              });
              setStopCallAnimalsList(res?.data?.length === 0);
            }
          })
          .catch((err) => {
            console.log("============", err);
            setAnimalsList([]);
          })
          .finally(() => {
            setMoreLoading(false);
            setLoading(false);
          })
      : getAnimalsList({
          ...(type === "site" && { site_id: siteId }),
          ...(type === "section" && { section_id: sectionId }),
          ...(type === "enclosure" && { enclosure_id: enclosureId }),
          ...(taxonomyId && { taxonomy_id: taxonomyId }),
          page_no: count,
        })
          .then((res) => {
            if (res?.success) {
              setAnimalsList((prev) => {
                if (count === 1) {
                  return res?.data ?? [];
                } else {
                  return [...(prev ?? []), ...(res?.data ?? [])];
                }
              });
              setStopCallAnimalsList(res?.data?.length === 0);
            }
          })
          .catch((err) => {
            setAnimalsList([]);
          })
          .finally(() => {
            setMoreLoading(false);
            setLoading(false);
          });
  };

  const handleSearch = (text) => {
    setSearchModalText(text);
  };

  const handleLoadMore = () => {
    if (!loading && !moreLoading && !stopCallAnimalsList) {
      setMoreLoading(true);
      const nextPage = page + 1;
      setPage(nextPage);
      loadAnimalsList(nextPage);
    }
  };

  const renderFooter = () => {
    if (moreLoading) {
      return (
        <View style={customStyles.footerContainer}>
          <ActivityIndicator />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={customStyles.mainContainer}>
      <Loader visible={loading} />
      <View style={customStyles.titleContainer}>
        <Text style={customStyles.mainTitleText}>{"Animal List"}</Text>
      </View>

      {/* <View style={customStyles.searchBarContainer}>
        <View style={customStyles.searchBarInnerContainer}>
          <Ionicons
            name={'search'}
            size={20}
            color={constThemeColor.onPrimaryContainer}
            style={customStyles.searchIcon}
          />
          <TextInput
            placeholder={'Search'}
            placeholderTextColor={constThemeColor.onPrimaryContainer}
            value={searchModalText}
            onChangeText={(e) => handleSearch(e)}
            style={customStyles.searchInput}
          />
        </View>
        {searchModalText ? (
          <Ionicons
            name={'close'}
            size={20}
            color={constThemeColor.onPrimaryContainer}
            style={{ paddingRight: Spacing.body }}
            onPress={() => {
              setSearchModalText('');
            }}
          />
        ) : null}
      </View> */}

      {speciesData ? (
        <SpeciesCustomCard
          icon={speciesData?.default_icon ?? ""}
          complete_name={
            speciesData?.complete_name ? speciesData?.complete_name : "NA"
          }
          animalName={
            speciesData?.common_name ? speciesData?.common_name : "NA"
          }
          tags={
            !isHideStats && permission?.["housing_view_insights"]
              ? speciesData?.sex_data
              : null
          }
          count={
            !isHideStats && permission?.["housing_view_insights"]
              ? speciesData?.animal_count
              : null
          }
          style={customStyles.speciesContainer}
        />
      ) : null}

      <Divider />

      <BottomSheetFlatList
        data={animalsList}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ItemSeparatorComponent={<Divider />}
        renderItem={({ item }) => (
          <AnimalCustomCard
            item={item}
            animalIdentifier={
              !item?.local_identifier_value
                ? item?.animal_id
                : item?.local_identifier_name ?? null
            }
            localID={item?.local_identifier_value ?? null}
            icon={item?.default_icon ?? ""}
            enclosureName={item?.user_enclosure_name ?? ""}
            animalName={
              item?.common_name ? item?.common_name : item?.scientific_name
            }
            sectionName={item?.section_name}
            siteName={item?.site_name}
            chips={item?.sex}
            show_specie_details={true}
            show_housing_details={true}
            noArrow={true}
            style={{
              borderRadius: 0,
              marginVertical: 0,
            }}
            onPress={() => onItemPress && onItemPress(item)}
          />
        )}
      />
    </View>
  );
};

export default AnimalsList;

const styles = (reduxColors) =>
  StyleSheet.create({
    mainContainer: {
      height: "100%",
    },
    titleContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: Spacing.minor,
    },
    mainTitleText: {
      fontSize: FontSize.Antz_Major_Medium.fontSize,
      fontWeight: FontSize.Antz_Major_Medium.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    speciesContainer: {},
    searchInput: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.neutralPrimary,
      marginLeft: Spacing.small,
    },
    searchBarContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: reduxColors.background,
      borderRadius: Spacing.mini,
      paddingVertical: Spacing.small,
      paddingLeft: Spacing.small,
      marginVertical: Spacing.body,
      marginHorizontal: Spacing.minor,
    },
    searchBarInnerContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    footerContainer: {
      paddingVertical: Spacing.major,
    },
    speciesContainer: {
      backgroundColor: reduxColors.surface,
      marginVertical: 0,
    },
  });
