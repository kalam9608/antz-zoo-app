import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "react-native-collapsible-tab-view";
import { debounce } from "lodash";

import EnclosureCustomCard from "./EnclosureCustomCard";
import HousingSearchBox from "./HousingSearchBox";
import Loader from "./Loader";
import Switch from "./Switch";
import ListEmpty from "./ListEmpty";
import { getEnclosuresList } from "../services/GetEnclosureBySectionIdServices";
import { capitalizeFirstLetterAndUppercaseRest } from "../utils/Utils";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import { useFocusEffect } from "@react-navigation/native";
import { RefreshControl } from "react-native-gesture-handler";
import { setEncDelete } from "../redux/TabRefreshSlice";

const EnclosuresList = ({
  type,
  sectionId,
  siteId,
  enclosureId,
  resetData,
  permission,
  isHideStats,
  onEnclosurePress,
  isFocused,
  showSubenclosuresValue,
  onRefreshValue,
  pullToRefresh,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState([]);
  const [showSubenclosures, setShowSubenclosures] = useState(false);
  const [enclosuresList, setEnclosuresList] = useState([]);
  const [stopCallEnclosuresList, setStopCallEnclosuresList] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const customStyles = styles(themeColors);
  useFocusEffect(
    React.useCallback(() => {
      if (isFocused) {
        if (resetData) {
          resetState();
          setLoading(true);
          loadEnclosureList(
            1,
            showSubenclosuresValue ? true : showSubenclosures,
            ""
          );
        } else if (!resetData && enclosuresList?.length <= 0) {
          resetState();
          setLoading(true);
          loadEnclosureList(
            1,
            showSubenclosuresValue ? true : showSubenclosures,
            ""
          );
        }
        setShowSubenclosures(showSubenclosuresValue ? true : false);
      }
    }, [siteId, sectionId, enclosureId, isFocused, showSubenclosuresValue])
  );

  const resetState = () => {
    setPage(1);
    setShowSubenclosures(false);
    setEnclosuresList([]);
    setStopCallEnclosuresList(false);
    setSearchText("");
  };

  const loadEnclosureList = (count, showSubenclosures, searchText) => {
    getEnclosuresList({
      ...(type === "site" && { site_id: siteId }),
      ...(type === "section" && { section_id: sectionId }),
      ...(type === "enclosure" && { enclosure_id: enclosureId }),
      ...(searchText?.length > 0 && { q: searchText }),
      page_no: count,
      include_sub_enclosure: showSubenclosures ? 1 : 0,
    })
      .then((res) => {
        if (res?.success) {
          if (res?.data?.total_count) {
            setTotalCount(res?.data?.total_count);
          } else {
            setTotalCount(0);
          }
          setEnclosuresList((prev) => {
            if (count === 1) {
              return res?.data?.list_items ?? [];
            } else {
              return [...(prev ?? []), ...(res?.data?.list_items ?? [])];
            }
          });
          setStopCallEnclosuresList(res?.data?.list_items?.length < 10);
          dispatch(setEncDelete(false));
        }
      })
      .catch((err) => {
        setEnclosuresList([]);
      })
      .finally(() => {
        setLoading(false);
        setMoreLoading(false);
        setSearchLoading(false);
        setRefreshing(false);
      });
  };

  const onShowSubenclosuresToggle = (value) => {
    setLoading(true);
    setShowSubenclosures(value);
    loadEnclosureList(1, value);
    setPage(1);
    setEnclosuresList([]);
  };
  const handleLoadMore = () => {
    if (
      !loading &&
      !moreLoading &&
      enclosuresList?.length != totalCount &&
      isFocused
    ) {
      setMoreLoading(true);
      const nextPage = page + 1;
      setPage(nextPage);
      loadEnclosureList(nextPage, showSubenclosures, searchText);
    }
  };

  const renderFooter = () => {
    if (moreLoading) return <ActivityIndicator />;
    return null;
  };

  const onItemPress = (item) => {
    if (onEnclosurePress) {
      onEnclosurePress(item);
    }
  };

  const debouncedHandleSearch = useCallback(
    debounce((text) => {
      setPage(1);
      loadEnclosureList(1, showSubenclosures, text);
    }, 500),
    [showSubenclosures]
  );

  const onSearchTextChange = (text) => {
    setSearchLoading(true);
    setSearchText(text);
    debouncedHandleSearch(text);
  };

  const onRefresh = () => {
    setPage(1);
    setRefreshing(true);
    loadEnclosureList(1, showSubenclosuresValue ? true : showSubenclosures, "");
    if (onRefreshValue) {
      pullToRefresh();
    }
  };

  return (
    <>
      <Loader visible={loading} />
      <Tabs.FlatList
        data={enclosuresList}
        ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        style={customStyles.mainContainer}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={
          <>
            <View style={customStyles.showSubenclosuresContainer}>
              <Text style={customStyles.showSubenclosuresText}>
                {"Show subenclosures"}
              </Text>
              <Switch
                active={showSubenclosures}
                handleToggle={onShowSubenclosuresToggle}
              />
            </View>
            <HousingSearchBox
              value={searchText}
              onChangeText={(e) => onSearchTextChange(e)}
              onClearPress={() => onSearchTextChange("")}
              loading={searchLoading}
            />
          </>
        }
        renderItem={({ item }) => (
          <EnclosureCustomCard
            // title={capitalizeFirstLetterAndUppercaseRest(
            //   item.user_enclosure_name
            // )}
            title={item.user_enclosure_name}
            subenclosuresCount={
              showSubenclosures ? 0 : Number(item?.sub_enclosure_count ?? 0)
            }
            parentEnclosure={
              showSubenclosures ? item?.parent_enclosure_name ?? "" : ""
            }
            icon={item.image}
            count={
              !isHideStats && permission?.["housing_view_insights"]
                ? item?.enclosure_wise_animal_count
                : null
            }
            siteName={item.site_name}
            enclosureType={item?.enclosure_type ?? null}
            sectionName={item?.section_name ?? null}
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
    showSubenclosuresContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.body,
      backgroundColor: reduxColors.onPrimary,
      borderRadius: Spacing.small,
      paddingVertical: Spacing.minor,
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
    },
    showSubenclosuresText: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      flex: 1,
    },
  });

export default EnclosuresList;
