import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
  TouchableOpacity,
} from "react-native";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import { ActivityIndicator, FAB } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Loader from "../../components/Loader";
import AddMedicalRecordCard from "../../components/AddMedicalRecordCard";
import ListEmpty from "../../components/ListEmpty";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { capitalize } from "../../utils/Utils";
import { GetListZooStockMedicineList } from "../../services/PharmicyApi";
import SearchOnPage from "../../components/searchOnPage";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import ModalWindowComponent from "../../components/ModalWindowComponent";

const ListOfProduct = () => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [state, setState] = React.useState({ open: false });
  const [searchModalText, setSearchModalText] = useState("");
  const [page, setPage] = useState(1);
  const [Medidines, setMedidines] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [sort, setSort] = useState("asc");
  const onStateChange = ({ open }) => setState({ open });
  const clearSearchText = () => {
    setSearchModalText("");
    setIsLoading(true);
    setPage(1);
    loadData(1, "");
  };

  const [modalOpenMasterData, setModalOpenMasterData] = useState(false);
  const toggleUserMasterModal = () => {
    setModalOpenMasterData(!modalOpenMasterData);
  };
  const closeUserMasterModal = () => {
    setModalOpenMasterData(false);
  };
  const closeModalMaster = (item) => {
    // navigation.navigate(`${item}`);
    navigation.navigate(item.screen, {
      type_of: item.key,
    });
    setModalOpenMasterData(!modalOpenMasterData);
  };
  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      setPage(1);
      loadData(page, "");
      return () => {};
    }, [navigation, sort])
  );
  // navigation.navigate("SearchManufacture", {
  //   onGoBack: (e, type_of) => searchSelectData(e, type_of),
  //   type_of: "GST",
  // });
  // if (type_of == "Manufacturer") {
  //   loadData(1, searchModalText);
  // } else if (type_of == "Package") {
  //   loadPackageData(1, searchModalText);
  // } else if (type_of == "UOM") {
  //   loadUomData(1, searchModalText);
  // } else if (type_of == "ProductForm") {
  //   loadProductformsData(1, searchModalText);
  // } else if (type_of == "Salt") {
  //   loadSaltData(1, searchModalText);
  // } else if (type_of == "Drug") {
  //   loadDrugsData(1, searchModalText);
  // } else if (type_of == "DrugStorage") {
  //   loadDrugStorageData(1, searchModalText);
  // } else
  const MasterData = [
    {
      id: "1",
      title: "GST ",
      screen: "List",
      key: "GST",
    },
    {
      id: "2",
      title: "Store",
      screen: "List",
      key: "Store",
    },
    {
      id: "3",
      title: "Supplier",
      screen: "List",
      key: "Supplier",
    },
    {
      id: "3",
      title: "Manufacturer",
      screen: "List",
      key: "Manufacturer",
    },
    {
      id: "3",
      title: "UOM",
      screen: "List",
      key: "UOM",
    },
    {
      id: "3",
      title: "ProductForm",
      screen: "List",
      key: "ProductForm",
    },
    {
      id: "3",
      title: "Salt",
      screen: "List",
      key: "Salt",
    },
    {
      id: "3",
      title: "Drug",
      screen: "List",
      key: "Drug",
    },
    {
      id: "3",
      title: "DrugStorage",
      screen: "List",
      key: "DrugStorage",
    },
  ];
  const loadData = (count, search) => {
    let obj = {
      sort: sort,
      column: "name",
    };
    GetListZooStockMedicineList(count, search, obj)
      .then((res) => {
        if (res?.success) {
          setTotalCount(res?.data?.total_count ?? 0);
          let dataArr = count == 1 ? [] : Medidines;
          setMedidines(dataArr.concat(res?.data?.list_items));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleSearch = (text) => {
    setSearchModalText(text);
    if (text.length >= 3) {
      const getData = setTimeout(() => {
        setPage(1);
        setIsLoading(true);
        loadData(1, text);
      }, 2000);
      return () => clearTimeout(getData);
    } else if (text.length == 0) {
      setSearchModalText("");
      const getData = setTimeout(() => {
        setPage(1);
        setIsLoading(true);
        loadData(1, text);
      }, 2000);
      return () => clearTimeout(getData);
    }
  };
  const renderFooter = () => {
    if (
      isLoading ||
      Medidines.length == 0 ||
      totalCount == 0 ||
      totalCount <= 9 ||
      Medidines.length == totalCount
    )
      return null;
    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };

  const handleLoadMore = () => {
    if (
      !isLoading &&
      Medidines.length >= 10 &&
      totalCount != Medidines.length
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, searchModalText);
    }
  };
  const { open } = state;
  return (
    <>
      <Header title="Medicines" noIcon={true} />
      <Loader visible={isLoading} />
      <View
        style={[
          reduxColors.container,
          {
            backgroundColor: constThemeColor.surfaceVariant,
          },
        ]}
      >
        <SearchOnPage
          handleSearch={handleSearch}
          searchModalText={searchModalText}
          placeholderText={"Search Medicines"}
          clearSearchText={clearSearchText}
        />
        <TouchableOpacity
          onPress={() => {
            if (sort == "asc") {
              setSort("desc");
            } else setSort("asc");
          }}
          style={{
            justifyContent: "flex-start",
            alignSelf: "flex-end",
            paddingTop: Spacing.small,
          }}
        >
          {sort == "desc" ? (
            <FontAwesome5
              name="sort-alpha-down"
              size={Spacing.major}
              color={constThemeColor.onSurfaceVariant}
            />
          ) : (
            <FontAwesome5
              name="sort-alpha-down-alt"
              size={Spacing.major}
              color={constThemeColor.onSurfaceVariant}
            />
          )}
        </TouchableOpacity>
        <View style={{ marginBottom: 6 }}></View>
        <View style={{ flex: 1 }}>
          <FlatList
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            data={Medidines}
            renderItem={(item) => (
              <AddMedicalRecordCard
                // onPress={() => {
                //   navigation.navigate("UserDetails", {
                //     allData: item,
                //     user_id: item.item.user_id,
                //   });
                // }}
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
                          {item?.item?.image ? (
                            <Image
                              source={{ uri: item?.item?.image }}
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
                                {item?.item?.name?.slice(0, 1) ?? ""}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <View
                        style={{
                          alignItems: "flex-start",
                          justifyContent: "center",
                          width: "70%",
                        }}
                      >
                        <Text
                          style={[reduxColors.subtitle]}
                          ellipsizeMode="tail"
                          numberOfLines={1}
                        >
                          {capitalize(item?.item?.name)}{" "}
                        </Text>
                        <Text
                          ellipsizeMode="tail"
                          numberOfLines={1}
                          style={reduxColors.subtitle1}
                        >
                          {item?.item?.manufacturer_name
                            ? item?.item?.manufacturer_name
                            : "NA"}
                        </Text>
                        <Text
                          ellipsizeMode="tail"
                          numberOfLines={1}
                          style={reduxColors.subtitle1}
                        >
                          {"Package -"}{" "}
                          {item?.item?.package ? item?.item?.package : "NA"}
                        </Text>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: FontSize.Antz_Body_Title.fontSize,
                              fontWeight: FontSize.Antz_Body_Title.fontWeight,
                            }}
                          >
                            Status{" "}
                          </Text>
                          {item?.item?.active == "1" ? (
                            <View
                              style={{
                                alignSelf: "center",
                                height: Spacing.body,
                                width: Spacing.body,
                                borderRadius: 50,
                                backgroundColor: constThemeColor.primary,
                              }}
                            ></View>
                          ) : (
                            <View
                              style={{
                                alignSelf: "center",
                                height: Spacing.body,
                                width: Spacing.body,
                                borderRadius: 50,
                                backgroundColor: constThemeColor.error,
                              }}
                            ></View>
                          )}
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("EditMedicines", {
                            // onGoBack: (e, type_of) => searchSelectData(e, type_of),
                            item: item.item,
                          });
                        }}
                        style={{
                          alignSelf: "center",
                          position: "absolute",
                          right: Spacing.mini,
                        }}
                      >
                        <FontAwesome name="edit" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                  </>
                }
                ListEmptyComponent={<ListEmpty visible={isLoading} />}
              />
            )}
            ListEmptyComponent={
              isLoading ? null : <ListEmpty visible={isLoading} />
            }
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => {
                  setPage(1);
                  setIsLoading(true);
                  loadData(1, "");
                }}
              />
            }
          />
        </View>
      </View>
      <FAB.Group
        open={open}
        fabStyle={reduxColors.fabStyle}
        visible
        icon={open ? "close-circle-outline" : "plus-circle-outline"}
        actions={[
          {
            icon: "plus",
            label: "Pharmacy Masters",
            onPress: () => {
              toggleUserMasterModal();
            },
          },
          {
            icon: "plus",
            label: "Add  Medicine",
            onPress: () => {
              navigation.navigate("AddProductForm");
            },
          },
          {
            icon: "home",
            label: "Home",
            onPress: () => navigation.navigate("Home"),
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
          }
        }}
      />
      {modalOpenMasterData ? (
        <ModalWindowComponent
          itemNeed={true}
          onPress={() => {}}
          onDismiss={closeUserMasterModal}
          onBackdropPress={closeUserMasterModal}
          onRequestClose={closeUserMasterModal}
          data={MasterData}
          title="Master"
          closeModal={closeModalMaster}
        />
      ) : null}
    </>
  );
};
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: Spacing.minor,
    },
    fabStyle: {
      margin: 10,
      right: 5,
      bottom: 20,
      width: 45,
      height: 45,
      justifyContent: "center",
      alignItems: "center",
    },
    subtitle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
    },
  });

export default ListOfProduct;
