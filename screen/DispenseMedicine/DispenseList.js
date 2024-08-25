import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { FlatList } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import Loader from "../../components/Loader";
import { useToast } from "../../configs/ToastConfig";
import ListEmpty from "../../components/ListEmpty";
import ModalFilterComponent, {
  ModalTitleData,
} from "../../components/ModalFilterComponent";
import { FilterMaster } from "../../configs/Config";
import {
  checkPermissionAndNavigateWithAccess,
  opacityColor,
} from "../../utils/Utils";
import HeaderMortality from "../../components/HeaderMortality";
import DispenseCard from "./DispenseCard";
import { getDispenseList } from "../../services/MedicalsService";

const DispenseList = (props) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();
  const [type, setType] = useState("Dispense");

  const [Loading, setLoading] = useState(false);
  const [dispense, setDispense] = useState([]);
  const [dispenseCount, setDispenseCount] = useState([]);

  /*****this is for mortality site filter *****/

  const site = useSelector((state) => state.sites.sites);

  const [selectedFilterValue, setselectedFilterValue] = useState("0");
  const [siteValue, setSiteValue] = useState(null);
  const [storeId, setstoreId] = useState(0);
  const [page, setPage] = useState(0);
  const [dispenseDataLength, setDispenseDataLength] = useState(0);
  const storeLisRedux = useSelector(
    (state) => state.PharmacyAccessSlice?.pharmacyData?.pharmacy
  )??[];

  const storeFilterList = storeLisRedux
    ? storeLisRedux?.map((v) => {
        return {
          id: v?.id,
          name: v?.name,
        };
      })
    : [];

  const mappedResult = [{ id: 0, name: "Show All" }, ...storeFilterList];
  //   site?.map((item) => ({
  //     id: item.site_id,
  //     name: item.site_name,
  //   }));
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      getDispenseListFun(1, "", storeId);

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [])
  );

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
    setstoreId(item.id);
    setSiteFilterModal(!siteFilterModal);
    setLoading(true);
    getDispenseListFun(1, "", item.id);
  };
  const isSelectedFilterId = (id) => {
    return selectedFilterValue?.includes(id);
  };
  const [searchModalText, setSearchModalText] = useState("");

  const permission = useSelector((state) => state.UserAuth.permission);

  const getDispenseListFun = (page, q, storeId) => {
    const obj = {
      sort: "desc",
      q: q,
      column: "label",
      page: page,
      limit: 10,
      Selectedstore: storeId,
    };
    setPage(page);
    getDispenseList(obj)
      .then((res) => {
        let dataArr = page == 1 ? [] : dispense;
        if (res.data) {
          setDispenseCount(res?.count);
          setDispenseDataLength(res.data ? res.data?.length : 0);
          setDispense(dataArr.concat(res?.data));
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
  // pagination for dispense list
  const dispenseHandleLoadMore = () => {
    if (
      !Loading &&
      dispenseDataLength > 0 &&
      dispense?.length != dispenseCount
    ) {
      const nextPage = page + 1;
      getDispenseListFun(nextPage, searchModalText, storeId);
    }
  };

  const dispenseRenderFooter = () => {
    if (
      Loading ||
      dispenseDataLength < 10 ||
      dispense?.length == dispenseCount
    ) {
      return null;
    }

    return (
      <ActivityIndicator style={{ color: constThemeColor?.housingPrimary }} />
    );
  };

  const handleSearch = (text) => {
    setSearchModalText(text);
    if (text?.length >= 1) {
      const getSearchData = setTimeout(() => {
        setLoading(true);
        getDispenseListFun(1, text, storeId);
      }, 1500);
      return () => clearTimeout(getSearchData);
    } else if (text?.length == 0) {
      setSearchModalText("");
      const getSearchData = setTimeout(() => {
        setLoading(true);
        getDispenseListFun(1, "", storeId);
      }, 1500);
      return () => clearTimeout(getSearchData);
    }
  };

  const clearSearchText = () => {
    setSearchModalText("");
    handleSearch("");
  };

  return (
    <View style={reduxColors.container}>
      <HeaderMortality
        noIcon={true}
        title={"Dispense"}
        search={true}
        titlePaddingHorizontal={Spacing.mini}
        handleSearch={handleSearch}
        clearSearchText={clearSearchText}
        searchModalText={searchModalText}
        backgroundColor={reduxColors?.surfaceVariant}
      />
      <Loader visible={Loading} />
      <View style={reduxColors.body}>
        {/* Site Filter */}
        <View
          style={{
            // marginHorizontal: Spacing.body,
            marginVertical: Spacing.small,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={[
              {
                textTransform: "capitalize",
                fontWeight: FontSize.Antz_Body_Title.fontWeight,
                fontSize: FontSize.Antz_Body_Title.fontSize,
                color: reduxColors.onPrimaryContainer,
              },
            ]}
          >
            {dispenseCount ?? 0} {"Dispenses"}
          </Text>
          <ModalTitleData
            selectDrop={siteValue ? siteValue : "Show All"}
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

        <FlatList
          showsVerticalScrollIndicator={false}
          data={dispense}
          renderItem={({ item }) => {
            return (
              <>
                <DispenseCard item={item} />
              </>
            );
          }}
          keyExtractor={(i, index) => index.toString()}
          onEndReached={dispenseHandleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={dispenseRenderFooter}
          ListEmptyComponent={<ListEmpty height={"50%"} visible={Loading} />}
        />
      </View>
      <View
        style={{
          paddingVertical: Spacing.minor,
          paddingHorizontal: Spacing.minor,
          backgroundColor: constThemeColor.surface,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("AddDispenseMedicine");
          }}
          style={{
            paddingVertical: Spacing.minor,
            backgroundColor: constThemeColor.onSurface,
            borderRadius: Spacing.small,
          }}
        >
          <Text
            style={{
              color: constThemeColor.onPrimary,
              textAlign: "center",
              fontSize: FontSize.Antz_Major_Title_btn.fontSize,
              fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
            }}
          >
            New Dispense
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors?.surfaceVariant,
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

export default DispenseList;
