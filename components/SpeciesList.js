import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { Tabs } from "react-native-collapsible-tab-view";

import SpeciesCustomCard from "./SpeciesCustomCard";
import Loader from "./Loader";
import ListEmpty from "./ListEmpty";
import { getSpeciesList } from "../services/GetEnclosureBySectionIdServices";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import { RefreshControl } from "react-native-gesture-handler";
import HousingSearchBox from "./HousingSearchBox";

const SpeciesList = ({
  type,
  sectionId,
  siteId,
  resetData,
  enclosureId,
  permission,
  isHideStats,
  onSpeciesPress,
  totalAnimals = 0,
  onAnimalsPress,
  showHeader = true,
  isFocused,
  searchbox,
  onRefreshValue,
  pullToRefresh
}) => {
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [page, setPage] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);
  const [totalSpecies, setTotalSpecies] = useState(0);
  const [stopCallSpeciesList, setStopCallSpeciesList] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const customStyles = styles(themeColors);

  useEffect(() => {
    if (isFocused) {
      setSearchText("");
      setPage(1);
      if (resetData) {
        setLoading(true);
        resetState();
        loadSpeciesList(1, "");
      } else if (!resetData && speciesList.length <= 0) {
        setLoading(true);
        resetState();
        loadSpeciesList(1, "");
      }
    }
  }, [siteId, sectionId, enclosureId, isFocused]);

  const resetState = () => {
    setPage(1);
    setSpeciesList([]);
    setStopCallSpeciesList(false);
    setSearchText("");
  };

  const loadSpeciesList = (count, searchText) => {
    getSpeciesList({
      ...(type === "site" && { site_id: siteId }),
      ...(type === "section" && { section_id: sectionId }),
      ...(type === "enclosure" && { enclosure_id: enclosureId }),
      page_no: count,
      search: searchText,
    })
      .then((res) => {
        if (res?.success) {
          setSpeciesList((prev) => {
            if (count === 1) {
              return res?.data?.listing ?? [];
            } else {
              return [...(prev ?? []), ...(res?.data?.listing ?? [])];
            }
          });
          setTotalSpecies(res?.data?.total_scies_count ?? "");
          setStopCallSpeciesList(res?.data?.listing?.length < 10);
        } else {
          if (searchText?.length >= 3 && count == 1 && res?.data?.length == 0) {
            setSpeciesList([]);
            setTotalSpecies(0);
          }
        }
      })
      .catch((err) => {
        setSpeciesList([]);
      })
      .finally(() => {
        setLoading(false);
        setMoreLoading(false);
        setRefreshing(false);
        setSearchLoading(false);
      });
  };

  const handleLoadMore = () => {
    if (
      !loading &&
      !moreLoading &&
      speciesList?.length != totalSpecies &&
      isFocused
    ) {
      setMoreLoading(true);
      const nextPage = page + 1;
      setPage(nextPage);
      loadSpeciesList(nextPage, searchText);
    }
  };

  const renderFooter = () => {
    if (moreLoading) return <ActivityIndicator />;
    return null;
  };

  const onItemPress = (item) => {
    if (onSpeciesPress) {
      onSpeciesPress(item);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadSpeciesList(1, searchText);
    if (onRefreshValue) {
      pullToRefresh();
    }
  };

  const SearchAddText = (text) => {
    setSearchText(text);

    if (text.length >= 3) {
      setSearchLoading(true);
      const getData = setTimeout(() => {
        setPage(1);
        loadSpeciesList(1, text);
      }, 2000);
      return () => clearTimeout(getData);
    } else if (text.length == 0) {
      setPage(1);
      setSearchLoading(true);
      loadSpeciesList(1, "");
    }
  };
  const SearchRemoveText = (e) => {
    setPage(1);
    setSearchText("");
    setSearchLoading(true);
    loadSpeciesList(1, "");
  };
  const ListHeaderComponent = (
    <>
      {showHeader ? (
        <View style={customStyles.statsMainContainer}>
          <View style={customStyles.statsContainer}>
            <Text style={customStyles.statsText}>{"Species"}</Text>
            <Text style={customStyles.statsText}>{totalSpecies}</Text>
          </View>
          <TouchableOpacity
            onPress={onAnimalsPress}
            style={customStyles.statsContainer}
          >
            <Text style={customStyles.statsText}>{"Animals"}</Text>
            <Text style={customStyles.statsText}>{totalAnimals}</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {searchbox && (
        <HousingSearchBox
          value={searchText}
          onChangeText={(e) => SearchAddText(e)}
          onClearPress={() => SearchRemoveText()}
          loading={searchLoading}
        />
      )}
    </>
  );

  return (
    <>
      <Loader visible={loading} />
      <Tabs.FlatList
        data={speciesList}
        ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        style={customStyles.mainContainer}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={ListHeaderComponent}
        renderItem={({ item }) => (
          <SpeciesCustomCard
            icon={item?.default_icon ?? ""}
            complete_name={item?.common_name ? item?.common_name : item?.tsn_id?? "NA"}
            animalName={item?.complete_name ? item?.complete_name : "NA"}
            tags={
              !isHideStats && permission?.["housing_view_insights"]
                ? item?.sex_data
                : null
            }
            count={
              !isHideStats && permission?.["housing_view_insights"]
                ? item?.animal_count
                : null
            }
            style={customStyles.listItem}
            onPress={() => onItemPress(item)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            style={{ color: themeColors.blueBg }}
            enabled={true}
          />
        }
      />
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    mainContainer: {
      paddingLeft: Spacing.minor,
      paddingRight: Spacing.minor,
      backgroundColor: reduxColors.surfaceVariant,
    },
    statsMainContainer: {
      backgroundColor: reduxColors.onPrimary,
      padding: Spacing.small,
      paddingBottom: 0,
      borderRadius: Spacing.small,
      marginBottom: Spacing.small,
    },
    statsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: Spacing.body,
      backgroundColor: reduxColors.background,
      borderRadius: Spacing.small,
      marginBottom: Spacing.small,
    },
    statsText: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    listItem: {
      backgroundColor: reduxColors.surface,
    },
  });

export default SpeciesList;
