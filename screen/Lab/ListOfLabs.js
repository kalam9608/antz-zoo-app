import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
} from "react-native";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import { ActivityIndicator, FAB } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import SearchOnPage from "../../components/searchOnPage";
import Loader from "../../components/Loader";
import AddMedicalRecordCard from "../../components/AddMedicalRecordCard";
import ListEmpty from "../../components/ListEmpty";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { capitalize } from "../../utils/Utils";
import { getLabList } from "../../services/staffManagement/addPersonalDetails";
import Config from "../../configs/Config";

const ListOfLabs = () => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [state, setState] = React.useState({ open: false });
  const [searchModalText, setSearchModalText] = useState("");
  const [page, setPage] = useState(1);
  const [labs, setLabs] = useState([]);
  const [letestCount, setLetestCount] = useState(0);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const onStateChange = ({ open }) => setState({ open });
  const clearSearchText = () => {
    setSearchModalText("");
    setIsLoading(true);
    setPage(1);
    // loadData(1, "");
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      setPage(1);
      loadData(page);
      return () => {};
    }, [navigation])
  );
  const loadData = (count) => {
    getLabList(zooID, count)
      .then((res) => {
        if (res?.success) {
          setLetestCount(res?.data?.labs?.length ?? 0);
          let dataArr = count == 1 ? [] : labs;
          setLabs(dataArr.concat(res?.data?.labs));
        }
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
        setIsLoading(true);
        // loadData(1, text);
      }, 2000);
      return () => clearTimeout(getData);
    } else if (text.length == 0) {
      setSearchModalText("");
      const getData = setTimeout(() => {
        setIsLoading(true);
        // loadData(1, text);
      }, 2000);
      return () => clearTimeout(getData);
    }
  };
  const renderFooter = () => {
    if (isLoading || labs.length == 0 || letestCount == 0 || letestCount <= 9)
      return null;
    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };

  const handleLoadMore = () => {
    if (!isLoading && labs.length >= 10 && letestCount != 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
    }
  };
  const { open } = state;
  return (
    <>
      <Header title="Labs" noIcon={true} />
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
          placeholderText={"Search Lab"}
          clearSearchText={clearSearchText}
        />
        <View style={{ marginBottom: 6 }}></View>
        <View style={{ flex: 1 }}>
          <FlatList
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            data={labs}
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
                                {item?.item?.lab_name?.slice(0, 1)}
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
                          {capitalize(item?.item?.lab_name)}
                        </Text>

                        <Text style={reduxColors.subtitle1}>
                          Incharge -{" "}
                          {item?.item?.incharge_name
                            ? item?.item?.incharge_name
                            : "NA"}
                        </Text>
                        <Text style={reduxColors.subtitle1}>
                          Incharge Mobile No -{" "}
                          {item?.item?.lab_contact_number
                            ? item?.item?.lab_contact_number
                            : "NA"}
                        </Text>
                      </View>
                    </View>
                  </>
                }
                ListEmptyComponent={<ListEmpty visible={isLoading} />}
              />
              // <Text>{item.lab_contact_number??"NA"}</Text>
            )}
            ListEmptyComponent={
              isLoading ? null : <ListEmpty visible={isLoading} />
            }
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setPage(1);
                  setRefreshing(true);
                  //   loadData(1, "");
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
            label: "Add Lab",
            onPress: () => {
              navigation.navigate("AddLabForm");
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

export default ListOfLabs;
