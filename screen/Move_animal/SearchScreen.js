import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { ActivityIndicator, Searchbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import Spacing from "../../configs/Spacing";
import ListEmpty from "../../components/ListEmpty";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getEnclosureSiteWiseData } from "../../services/housingService/SectionHousing";
import EnclosureCard from "../../components/EnclosureCard";
import { setDestination } from "../../redux/AnimalMovementSlice";
import FontSize from "../../configs/FontSize";
import Loader from "../../components/Loader";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { QrGetDetails } from "../../services/staffManagement/addPersonalDetails";

const MoveSearchScreen = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const [filterData, setfilterData] = useState(
    props.route.params?.listData ?? []
  );
  const [filterDataLength, setFilterDataLength] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState(false);
  const [count, setCount] = useState(0);
  const [selected_site_id] = useState(
    props.route.params.selected_site_id ?? null
  );

  useFocusEffect(
    React.useCallback(() => {
      if (searchInput?.length >= 3) {
        const getData = setTimeout(() => {
          setIsLoading(true);
          getEnclosureSiteWise(1, searchInput);
        }, 1000);
        return () => clearTimeout(getData);
      } else if (searchInput?.length == 0) {
        // const getData = setTimeout(() => {
        setIsLoading(true);
        getEnclosureSiteWise(1, "");
        // }, 1000);
        // return () => clearTimeout(getData);
      }
    }, [searchInput])
  );

  const getEnclosureSiteWise = (count, query) => {
    getEnclosureSiteWiseData(count, query, selected_site_id)
      .then((res) => {
        let dataArr = count == 1 ? [] : filterData;
        setCount(res.data?.count == undefined ? 0 : res.data?.count);
        if (res.data?.result) {
          let data = dataArr?.concat(res.data?.result);
          setfilterData(data);
          setFilterDataLength(data?.length);
        }
        setIsLoading(false);
        setSearch(false);
      })
      .catch((err) => {
        console.log("error", err);
        setIsLoading(false);
        setSearch(false);
      });
  };

  const searchFilterData = (text) => {
    setSearchInput(text);
  };

  const clearSearch = () => {
    setfilterData(props.route.params?.listData ?? []);
    setPage(1);
    setSearchInput("");
  };

  const navigateToComponent = ({ screenName, params }) => {
    setPage(1);
    navigation.navigate(screenName, params);
  };

  const handleLoadMore = () => {
    if (
      !isLoading &&
      filterDataLength > 0 &&
      !filterDataLength < 25 &&
      !search &&
      filterDataLength != count
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      getEnclosureSiteWise(nextPage, searchInput);
    }
  };
  const renderFooter = () => {
    if (
      isLoading ||
      filterDataLength == 0 ||
      search ||
      filterDataLength < 25 ||
      filterDataLength == count
    ) {
      return null;
    } else {
      return (
        <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
      );
    }
  };
  const handleOnPress = (item) => {
    navigation.navigate("MoveToEnclosure", {
      enclosure: item,
      type: props?.route?.params?.type,
      isEnclosure: "enclosure",
      onPress: (e) => moveBack(e),
    });
  };
  const moveBack = (item) => {
    props?.route?.params?.onPress(item);
    navigation.goBack();
  };
  const moveItHere = (item) => {
    dispatch(setDestination(item));
    navigation.goBack();
  };
  const QrMergeData = (item) => {
    if (item.type == "section") {
      getdetail(item?.type, item?.section_id);
    } else if (item.type == "enclosure") {
      getdetail(item?.type, item?.enclosure_id);
    } else if (item.type == "animal") {
      getdetail(item?.type, item?.animal_id);
    }
  };

  const getdetail = (type, id) => {
    QrGetDetails({ type, id })
      .then((res) => {
        if (res.success == true) {
          navigation.navigate("MoveToEnclosure", {
            section: res.data,
            type: props?.route?.params?.type,
            isSection: type,
            onPress: (e) => moveItHere(e),
          });
        } else {
          setIsLoading(false);
          warningToast("Oops!!", res.message);
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  return (
    <>
      <Loader visible={isLoading} />
      <View style={styles.container}>
        <Searchbar
          accessible={true}
          mode="bar"
          accessibilityLabel={"commonSearchBar"}
          AccessibilityId={"commonSearchBar"}
          placeholder={`Search ${props.route.params?.name}`}
          placeholderTextColor={constThemeColor.primary}
          //   defaultValue={props.route.params?.itemName}
          onChangeText={searchFilterData}
          value={searchInput}
          inputStyle={[styles.input, { color: constThemeColor.primary }]}
          autoFocus={false}
          style={[
            styles.searchbar,
            {
              backgroundColor: constThemeColor.surface,
            },
          ]}
          icon={({ size, color }) => (
            <Ionicons
              name="arrow-back"
              size={24}
              color
              style={{
                color: constThemeColor.neutralPrimary,
              }}
              onPress={() => navigation.goBack()}
            />
          )}
          right={() => (
            <>
              <View
                style={{
                  paddingRight: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {searchInput ? (
                  <View>
                    <Entypo
                      name="cross"
                      size={30}
                      color={constThemeColor.neutralPrimary}
                      style={{ marginRight: heightPercentageToDP(1) }}
                      onPress={clearSearch}
                    />
                  </View>
                ) : (
                  <></>
                )}
                <MaterialIcons
                  name="qr-code-scanner"
                  size={24}
                  color={constThemeColor.neutralPrimary}
                  style={{ marginRight: heightPercentageToDP(1) }}
                  onPress={() =>
                    navigation.navigate("LatestCamScanner", {
                      dataSendBack: (item) => QrMergeData(item),
                      screen: "enclosure",
                    })
                  }
                />
              </View>
            </>
          )}
        />
        <View style={{ flex: 1 }}>
          <View>
            <Text
              style={[
                FontSize.Antz_Minor_Title,
                {
                  color: constThemeColor.onPrimaryContainer,
                  paddingVertical: Spacing.body,
                },
              ]}
            >
              Enclosures
            </Text>
          </View>
          <FlatList
            data={filterData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <>
                  <EnclosureCard
                    item={item}
                    onPress={() => handleOnPress(item)}
                  />
                </>
              );
            }}
            keyExtractor={(_, index) => index.toString()}
            ListEmptyComponent={
              <ListEmpty height={"50%"} visible={isLoading} />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
          />
        </View>
      </View>
    </>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.surfaceVariant,
      padding: Spacing.body,
    },
    searchbar: {
      borderRadius: 50,
      width: "100%",
      marginVertical: Spacing.micro,
    },
  });

export default MoveSearchScreen;
