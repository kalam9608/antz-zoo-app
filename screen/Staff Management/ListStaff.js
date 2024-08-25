/**
 * Modified By: gaurav shukla
 * Modification Date: 15/05/23
//  *
 * Modification: Added pagination in the listing
 */

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
  Image,
} from "react-native";
import ListComponent from "../../components/ListComponent";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Loader from "../../components/Loader";
import Header from "../../components/Header";
import FloatingButton from "../../components/FloatingButton";
import { getStaffListWithPagination } from "../../services/staffManagement/addPersonalDetails";
import { useSelector } from "react-redux";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { ActivityIndicator } from "react-native-paper";
import ListEmpty from "../../components/ListEmpty";
import { ShortFullName, checkPermissionAndNavigate, ifEmptyValue } from "../../utils/Utils";
import AddMedicalRecordCard from "../../components/AddMedicalRecordCard";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { Feather, Ionicons } from "@expo/vector-icons";
import SearchOnPage from "../../components/searchOnPage";
import { errorToast } from "../../utils/Alert";

const ListStaff = () => {
  const navigation = useNavigation();
  const [staff, setstaff] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchModalText, setSearchModalText] = useState("");
  const [search, setSearch] = useState(false);

  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const [page, setPage] = useState(1);
  const [staffDataLength, setStaffDataLength] = useState(0);
  const [userRefresh, setUserRefresh] = useState(false);
  const permission = useSelector((state) => state.UserAuth.permission);
  const clearSearchText = () => {
    setSearchModalText("");
    setIsLoading(true);
    setPage(1);
    loadData(1, "");
  };

  useFocusEffect(
    React.useCallback(() => {
      if (searchModalText?.length == 0) {
        setIsLoading(true);
        setPage(1);
        loadData(1, "");
      }
      const getData = setTimeout(() => {
        if (searchModalText.length >= 3) {
          setIsLoading(true);
          setPage(1);
          loadData(1, searchModalText);
        }
      }, 2000);
      return () => clearTimeout(getData);
    }, [navigation, searchModalText])
  );

  const handleSearch = (text) => {
    setSearchModalText(text);
    // if (text.length >= 3) {
    //   const getData = setTimeout(() => {
    //     setIsLoading(true);
    //     loadData(1, text);
    //   }, 2000);
    //   return () => clearTimeout(getData);
    // } else if (text.length == 0) {
    //   setSearchModalText("");
    //   const getData = setTimeout(() => {
    //     setIsLoading(true);
    //     loadData(1, text);
    //   }, 2000);
    //   return () => clearTimeout(getData);
    // }
  };

  const loadData = (count, searchText) => {
    let postData = {
      zoo_id: zooID,
      page_no: count,
      q: searchText,
    };
    getStaffListWithPagination(postData)
      .then((res) => {
        if (res?.success) {
          setSearch(false);
          let dataArr = count == 1 ? [] : staff;
          if (res.data) {
            setStaffDataLength(res?.data?.length ?? 0);
            setstaff(dataArr.concat(res.data));
            setIsLoading(false);
            setRefreshing(false);
            setUserRefresh(false);
          }
        }
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
        setUserRefresh(false);
        setIsLoading(false);
        setRefreshing(false);
      })
      .finally(() => {
        setUserRefresh(false);
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const handleLoadMore = () => {
    if (!isLoading && staffDataLength >= 10 && !userRefresh) {
      const nextPage = page + 1;
      setUserRefresh(true);
      setPage(nextPage);
      loadData(nextPage, searchModalText);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const getData = setTimeout(() => {
        if (page == 1 && staffDataLength >= 10) {
          setUserRefresh(true);
          setPage(2);
          loadData(2, searchModalText);
        }
      }, 1500);
      return () => clearTimeout(getData);
    }, [navigation, staff])
  );
  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (userRefresh) {
      return (
        <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
      );
    }
  };

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const refInput = React.useRef(null);

  return (
    <>
      <Header title={"Users"} noIcon={true} />
      <Loader visible={isLoading} />
      <View
        style={[
          reduxColors.container,
          { backgroundColor: constThemeColor.surfaceVariant },
        ]}
      >
        <SearchOnPage
          handleSearch={handleSearch}
          searchModalText={searchModalText}
          placeholderText={"Search user"}
          clearSearchText={clearSearchText}
        />
        <View style={{ marginBottom: 6 }}></View>
        {/* <View style={reduxColors.listSection}> */}
        <View style={{ flex: 1 }}>
          <FlatList
            data={staff}
            renderItem={(item) => (
              <AddMedicalRecordCard
                onPress={() => {
                  navigation.navigate("UserDetails", {
                    allData: item,
                    user_id: item.item.user_id,
                  });
                }}
                children={
                  <>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 15,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: constThemeColor.neutral50,
                            borderRadius: 50,
                            height: 36,
                            width: 36,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item?.item?.user_profile_pic ? (
                            <Image
                              source={{ uri: item?.item?.user_profile_pic }}
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: widthPercentageToDP("50%"),
                              }}
                            />
                          ) : (
                            <View
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 100,
                                backgroundColor: constThemeColor.secondary,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: FontSize.Antz_Minor_Title.fontSize,
                                  fontWeight:
                                    FontSize.Antz_Minor_Title.fontWeight,
                                  textAlign: "center",
                                  color: reduxColors.onPrimary,
                                }}
                              >
                                {ShortFullName(item?.item?.user_name) ?? "NA"}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <View
                        style={{
                          alignItems: "flex-start",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={reduxColors.subtitle}>
                          {item.item.user_name}
                        </Text>

                        <Text style={reduxColors.subtitle1}>
                          {item.item.role_name ? item.item.role_name : "NA"}
                        </Text>
                      </View>
                    </View>
                  </>
                }
                ListEmptyComponent={<ListEmpty visible={isLoading} />}
              />
            )}
            ListEmptyComponent={<ListEmpty visible={isLoading} />}
            ListFooterComponent={renderFooter}
            keyExtractor={(item) => item.user_id}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setPage(1);
                  setRefreshing(true);
                  loadData(1, searchModalText);
                }}
              />
            }
          />
          {/* </View> */}

          <FloatingButton
            icon="plus-circle-outline"
            backgroundColor={constThemeColor.flotionBackground}
            borderWidth={0}
            borderColor={constThemeColor.flotionBorder}
            borderRadius={50}
            linkTo=""
            floaterStyle={{ height: 60, width: 60 }}
            onPress={() =>
              checkPermissionAndNavigate(
                permission,
                "allow_add_users",
                navigation,
                "AddStaff"
              )
            }
          />
        </View>
      </View>
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
      paddingHorizontal: Spacing.minor,
    },
    listSection: {
      flex: 1,
    },
  });

export default ListStaff;
