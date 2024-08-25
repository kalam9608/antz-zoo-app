import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import HeaderTaxonomy from "../../components/HeaderTaxonomy";
// import { useNavigation } from "@react-navigation/core";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
/*
 * Responsive Import
 */
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import SpeciesCard from "../../components/SpeciesCard";
import { getTaxonomyList } from "../../services/AccessionService";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import Loader from "../../components/Loader";
import SearchOnPage from "../../components/searchOnPage";
import ListEmpty from "../../components/ListEmpty";
import { useToast } from "../../configs/ToastConfig";
import { Searchbar } from "react-native-paper";

const SpeciesMaster = () => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const [searchModalText, setSearchModalText] = useState("");
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [taxonomyData, setTaxonomyData] = useState([]);

  const [isLoading, setLoding] = useState(false);
  const [taxonomyDataLength, setTaxonomyDataLength] = useState(0);
  const [page, setPage] = useState(1);
  const [taxonomyTotal, setTaxonomyTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const searchRef = useRef();

  const [search, setSearch] = useState(false);

  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  const gotoBack = () => {
    navigation.goBack();
  };

  const clearSearchText = () => {
    setSearchModalText("");
    setPage(1);
    setLoding(true);
    getData(1, "");
  };
  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (searchModalText?.length >= 3) {
  //       setLoding(true);
  //       setPage(1);
  //       getData(1, searchModalText);
  //     } else if (searchModalText?.length == 0) {
  //       setLoding(true);
  //       setPage(1);
  //       getData(1, "");
  //     }
  //     return () => {};
  //   }, [navigation, searchModalText])
  // );

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (searchModalText?.length >= 3) {
        setSearch(true);
        setPage(1);
        getData(1, searchModalText);
      } else {
        setLoding(true);
        setPage(1);
        getData(1, searchModalText);
      }
    });

    // Clean up the listener when the component is unmounted
    return unsubscribe;
  }, [navigation, searchModalText]);

  const handleSearch = (text) => {
    setSearchModalText(text);
    if (text.length >= 3) {
      const getSearchData = setTimeout(() => {
        setTaxonomyData([]);
        setPage(1);
        setSearch(true);
        getData(1, text);
        setTaxonomyTotal(0);
      }, 2000);
      return () => clearTimeout(getSearchData);
    } else if (text.length == 0) {
      setSearchModalText("");
      const getSearchData = setTimeout(() => {
        setPage(1);
        setSearch(true);
        getData(1, text);
        setTaxonomyTotal(0);
      }, 2000);
      return () => clearTimeout(getSearchData);
    }
  };

  const getData = (count, searchText) => {
    let postData = {
      zoo_id: zooID,
      page_no: count,
      q: searchText,
    };
    getTaxonomyList(postData)
      .then((res) => {
        if (res?.data) {
          let dataArr = count == 1 ? [] : taxonomyData;
          setTaxonomyTotal(res.data?.taxonomy_total);

          setTaxonomyDataLength(res.data?.taxonomy_list?.length);
          setTaxonomyData(dataArr.concat(res.data?.taxonomy_list));
        }
      })
      .catch((error) => {
        errorToast("error", "Oops! Something went wrong!");
        setLoding(false);
        setSearch(false);
      })
      .finally(() => {
        setLoding(false);
        setRefreshing(false);
        setSearch(false);
      });
  };

  const handleLoadMore = () => {
    if (
      !isLoading &&
      taxonomyDataLength >= 10 &&
      taxonomyData?.length < taxonomyTotal &&
      !search
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      setSearch(true);
      getData(nextPage, searchModalText);
    }
  };
  const renderFooter = () => {
    if (
      search &&
      taxonomyDataLength >= 10 &&
      taxonomyData?.length < taxonomyTotal
    ) {
      return <ActivityIndicator style={{ color: constThemeColor.primary }} />;
    }
  };

  return (
    <View style={{ backgroundColor: constThemeColor.surfaceVariant, flex: 1 }}>
      <HeaderTaxonomy gotoBack={gotoBack} />
      <Loader visible={searchModalText?.length == 0 ? isLoading : false} />

      {/* main screen */}
      <View style={reduxColors.main}>
        <Text style={reduxColors.headerTitle}>Species Master</Text>
        <View style={{ marginTop: 20 }}>
          {/* <SearchOnPage
            handleSearch={handleSearch}
            searchModalText={searchModalText}
            placeholderText="Search added species"
            clearSearchText={clearSearchText}
          /> */}
          <Searchbar
            ref={searchRef}
            placeholder={`Search added species`}
            inputStyle={{
              color: constThemeColor.onPrimaryContainer,
              fontSize: FontSize.Antz_Body_Regular.fontSize,
              fontWeight: FontSize.Antz_Body_Regular.fontWeight,
            }}
            placeholderTextColor={constThemeColor.onSurfaceVariant}
            onIconPress={gotoBack}
            style={[
              {
                backgroundColor: constThemeColor.surface,
                width: "100%",
                borderRadius: Spacing?.small,
              },
            ]}
            loading={search}
            onChangeText={(e) => {
              handleSearch(e);
            }}
            value={searchModalText}
            autoFocus={true}
          />
        </View>
        <View style={{ marginTop: 30 }}>
          <Text style={reduxColors.speciesTitle}>
            Total Species - {taxonomyTotal}
          </Text>
        </View>

        <View style={{ flex: 1, marginTop: 12 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={taxonomyData}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              return (
                <SpeciesCard
                  index={index}
                  imgUrl={item?.default_icon}
                  title={item?.default_common_name}
                  subTitle={item?.complete_name}
                  onPress={() =>
                    navigation.navigate("EditTaxonomy", {
                      taxonomyName: item?.complete_name,
                      tsn_id: item?.tsn,
                      imgUrl: item?.default_icon,
                      default_common_name: item?.default_common_name,
                      // banner_images: taxonomyData[index]?.banner_images,
                    })
                  }
                />
              );
            }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={<ListEmpty visible={isLoading} />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  setPage(1);
                  getData(1, searchModalText);
                }}
              />
            }
          />
        </View>
      </View>
    </View>
  );
};

export default SpeciesMaster;

const styles = (reduxColors) =>
  StyleSheet.create({
    main: {
      flex: 1,
      paddingHorizontal: Spacing.minor,
    },
    headerTitle: {
      color: reduxColors.onSurFace,
      fontSize: FontSize.Antz_Major_Regular.fontSize,
      fontWeight: FontSize.Antz_Major_Regular.fontWeight,
    },
    speciesTitle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },

    input: {
      flex: 1,
      marginLeft: Spacing.small,
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    searchBarContainer: {
      marginTop: 20,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: reduxColors.surface,
      borderRadius: 8,
      width: "100%",
      height: 56,
      paddingHorizontal: Spacing.small,
    },
  });
