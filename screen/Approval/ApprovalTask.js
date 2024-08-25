import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import Header from "../../components/Header";
import { SegmentedButtons, ActivityIndicator } from "react-native-paper";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useSelector, useStore } from "react-redux";
import { getAllTransfers } from "../../services/approvalService";
import Loader from "../../components/Loader";
import FontSize from "../../configs/FontSize";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import TransferCard from "../../components/Transfer/TransferCard";
import ModalFilterComponent, {
  ModalTitleData,
} from "../../components/ModalFilterComponent";
import Spacing from "../../configs/Spacing";
import ListEmpty from "../../components/ListEmpty";
import { RefreshControl } from "react-native-gesture-handler";

const ApprovalTask = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState("pending");
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCheckBox, setselectedCheckBox] = useState(1);
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [totalPendingTransferCount, setTotalPendingTransfersCount] = useState();
  const [approveAndRejectTransfers, setApproveAndRejectTransfers] = useState(
    []
  );
  const [totalAprvRejCount, setTotalAprvRejCount] = useState([]);
  const [page, setPage] = useState(1);

  const [refreshing, setRefreshing] = useState(false);
  const [apiCall, setApiCall] = useState(false);
  const [requestDataLength, setRequestDataLength] = useState(0);
  const [approvalDataLength, setApprovalDataLength] = useState(0);

  const [filterTypeData] = useState([
    {
      id: 1,
      type: "all",
      name: "Show All",
    },
    {
      id: 2,
      type: "approved",
      name: "Approved",
    },
    {
      id: 3,
      type: "rejected",
      name: "Rejected",
    },
    {
      id: 4,
      type: "canceled",
      name: "Canceled",
    },
  ]);
  const [filterName, setFilterName] = useState("Show All");
  const [filterType, setFilterType] = useState("all");

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  const closeFilterModal = () => {
    setShowFilterModal(false);
  };

  const closeMenu = (item) => {
    setselectedCheckBox(item.id);
    setFilterName(item.name);
    setFilterType(item.type);
    closeFilterModal();
  };
  const isSelectedId = (id) => {
    return selectedCheckBox == id;
  };
  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      setPage(1);
      getAllTransferRequest(value, filterType, 1);
      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [value, filterType])
  );

  const getAllTransferRequest = (type, filter, curentPage) => {
    getAllTransfers(type, type == 'pending' ? "all" : filter, curentPage)
      .then((res) => {
        if (type === "pending") {
          let prevData = curentPage == 1 ? [] : pendingTransfers;
          setPendingTransfers(prevData.concat(res?.data[0]?.result));
          setTotalPendingTransfersCount(res?.data[0]?.total_count);
        }
        if (type === "approved_rejected") {
          let prevData = curentPage == 1 ? [] : approveAndRejectTransfers;
          setApproveAndRejectTransfers(prevData.concat(res?.data[0]?.result));
          setTotalAprvRejCount(res?.data[0]?.total_count);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setRefreshing(false);
        setApiCall(false);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
        setApiCall(false);
      });
  };

  const handleLoadMore = () => {
    if (
      value === "pending" &&
      !isLoading &&
      pendingTransfers?.length >= 10 &&
      !apiCall &&
      pendingTransfers?.length < totalPendingTransferCount
    ) {
      const nextPage = page + 1;
      setApiCall(true);
      setPage(nextPage);
      getAllTransferRequest(value, filterType, nextPage);
    }
    if (
      value === "approved_rejected" &&
      !isLoading &&
      approveAndRejectTransfers?.length >= 10 &&
      !apiCall &&
      approveAndRejectTransfers?.length < totalAprvRejCount
    ) {
      setApiCall(true);
      const nextPage = page + 1;
      setPage(nextPage);
      getAllTransferRequest(value, filterType, nextPage);
    }
  };

  const renderFooter = () => {
    if (apiCall) {
      return (
        <ActivityIndicator style={{ color: constThemeColor?.housingPrimary }} />
      );
    } else {
      return null;
    }
  };

  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <>
      <View style={{ flex: 1 }}>
        <Header title="Transfer Approvals" noIcon={true} />
        <Loader visible={isLoading} />
        <View
          style={[
            reduxColors.container,
            {
              backgroundColor: constThemeColor.surfaceVariant,
            },
          ]}
        >
          <View style={{ alignItems: "center" }}>
            <SegmentedButtons
              value={value}
              onValueChange={setValue}
              buttons={[
                {
                  checkedColor: constThemeColor.onPrimary,
                  uncheckedColor: constThemeColor.onPrimaryContainer,
                  value: "pending",
                  label: "Pending",
                  showSelectedCheck: false,
                  style: {
                    backgroundColor:
                      value === "pending"
                        ? constThemeColor.onPrimaryContainer
                        : constThemeColor.onPrimary,
                    borderColor:
                      value === "pending"
                        ? constThemeColor.onPrimaryContainer
                        : constThemeColor.onPrimary,
                  },
                },
                {
                  checkedColor: constThemeColor.onPrimary,
                  uncheckedColor: constThemeColor.onPrimaryContainer,
                  value: "approved_rejected",
                  label: "Approved/Rejected",
                  showSelectedCheck: false,
                  style: {
                    backgroundColor:
                      value === "approved_rejected"
                        ? constThemeColor.onPrimaryContainer
                        : constThemeColor.onPrimary,
                    borderColor:
                      value === "approved_rejected"
                        ? constThemeColor.onPrimaryContainer
                        : constThemeColor.onPrimary,
                  },
                },
              ]}
              style={reduxColors.group}
            />
          </View>
          <View
            style={{
              marginVertical: Spacing.small,
              marginTop: Spacing.major,
              paddingTop: Spacing.small,
              paddingHorizontal: Spacing.body,
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            {value != "pending" && (
              <ModalTitleData
                selectDrop={filterName}
                toggleModal={toggleFilterModal}
                filterIconStyle={{ marginLeft: Spacing.small }}
                filterIcon={true}
                size={18}
                touchStyle={{ marginBottom: Spacing.mini }}
              />
            )}
            {showFilterModal ? (
              <ModalFilterComponent
                onPress={toggleFilterModal}
                onDismiss={closeFilterModal}
                onBackdropPress={closeFilterModal}
                onRequestClose={closeFilterModal}
                data={filterTypeData}
                closeModal={closeMenu}
                title="Filter By"
                style={{ alignItems: "flex-start" }}
                isSelectedId={isSelectedId}
                checkIcon={true}
              />
            ) : null}
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                marginHorizontal: 10,
              }}
            >
              {value == "pending" ? (
                pendingTransfers.length > 0 ? (
                  <FlatList
                    data={pendingTransfers}
                    contentContainerStyle={{ paddingBottom: 25 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <TransferCard
                        key={item.id}
                        item={item}
                        action="pending"
                        onPress={() => {
                          navigation.navigate("ApprovalSummary", {
                            animal_movement_id: item?.animal_movement_id,
                            site_id: item?.source_site_id,
                            screen: "site",
                            reference: "list",
                          });
                        }}
                      />
                    )}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={renderFooter}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                          setRefreshing(true);
                          getAllTransferRequest(value, filterType, 1);
                          setPage(1);
                        }}
                      />
                    }
                  />
                ) : (
                  <ListEmpty visible={isLoading} />
                )
              ) : null}
              {value == "approved_rejected" ? (
                approveAndRejectTransfers.length > 0 ? (
                  <FlatList
                    data={approveAndRejectTransfers}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 25 }}
                    renderItem={({ item }) => (
                      <TransferCard
                        key={item.id}
                        item={item}
                        action="approve_reject"
                        onPress={() => {
                          navigation.navigate("ApprovalSummary", {
                            animal_movement_id: item?.animal_movement_id,
                            site_id: item?.source_site_id,
                            screen: "site",
                            reference: "list",
                          });
                        }}
                      />
                    )}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={renderFooter}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                          setRefreshing(true);
                          getAllTransferRequest(value, filterType, 1);
                          setPage(1);
                        }}
                      />
                    }
                  />
                ) : (
                  <ListEmpty visible={isLoading} />
                )
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default ApprovalTask;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    group: {
      top: Spacing.body,
      width: "90%",
    },
    title: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      marginBottom: Spacing.mini,
      color: reduxColors.onSurfaceVariant,
      width: "100%",
    },
  });
