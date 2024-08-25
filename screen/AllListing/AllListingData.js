import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import List from "./component/List";
import Loader from "../../components/Loader";
import FontSize from "../../configs/FontSize";
import ListEmpty from "../../components/ListEmpty";
import { ifEmptyValue } from "../../utils/Utils";
import { ActivityIndicator } from "react-native-paper";
import { errorToast } from "../../utils/Alert";
import Spacing from "../../configs/Spacing";
import { housingDataFetch } from "../../services/AddSiteService";
import { speciesPopulation } from "../../services/AddSiteService";
import HousingSearchBox from "../../components/HousingSearchBox";
import { useRef } from "react";

const AllListingData = (props) => {
  const navigation = useNavigation();
  const constThemeColors = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColors);
  const [speciesData, setSpeciesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showBottomLoader, setShowBottomLoader] = useState(false);
  const [allDatafetched, setAllDataFetched] = useState(false);
  const [speciesLength, setSpeciesLength] = useState(0);
  const [countData, setCount] = useState(0);
  const [SearchLoading, setSearchLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const isFirstRender = useRef(true);

  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      setLoading(true);
      loadData(1, searchText ?? "");
      setPage(1);
    });

    return subscribe;
  }, [navigation, searchText]);

  useFocusEffect(
    React.useCallback(() => {
      if (!isFirstRender?.current) {
        if (searchText.length >= 3) {
          setPage(1);
          setSearchLoading(true);
          const getData = setTimeout(() => {
            setPage(1);
            loadData(1, searchText);
          }, 1000);

          return () => clearTimeout(getData);
        } else if (searchText.length == 0) {
          setLoading(true);
          setPage(1);
          loadData(1, searchText);
        }
      } else {
        isFirstRender.current = false;
      }
      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [searchText])
  );

  const loadData = (count, search) => {
    housingDataFetch(
      props?.route.params?.ref_type,
      props?.route.params?.data_type,
      props?.route.params?.ref_id,
      count,
      search
    )
      .then((res) => {
        setCount(res?.data?.total_count);
        if (!res.success) {
          setAllDataFetched(true);
          setSpeciesLength(0);
        } else {
          setAllDataFetched(false);
          let dataArr = count == 1 ? [] : speciesData;
          setSpeciesData(dataArr.concat(res?.data?.result));
          setSpeciesLength(res?.data?.result?.length ?? 0);
        }
      })
      .catch((err) => {
        errorToast("Oops!", "Something went wrong!!");
        setLoading(false);
        setShowBottomLoader(false);
      })
      .finally(() => {
        setLoading(false);
        setShowBottomLoader(false);
        setSearchLoading(false);
      });
  };

  const handleLoadMore = () => {
    if (!allDatafetched && !loading && speciesLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, searchText);
    }
  };

  const ListEmptyComponent = () => {
    return (
      <>
        <ListEmpty visible={loading} />
      </>
    );
  };

  const renderFooter = () => {
    if (speciesLength == 0 || speciesLength < 10) return null;
    return (
      <ActivityIndicator style={{ color: constThemeColors.housingPrimary }} />
    );
  };
  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      <Header
        noIcon={true}
        title={
          props.route.params?.data_type == "enclosure"
            ? "Enclosures"
            : props.route.params?.data_type == "animal"
            ? "Animals"
            : props.route.params?.data_type == "site"
            ? "Sites"
            : props.route.params?.data_type == "section"
            ? "Sections"
            : props.route.params?.data_type == "species"
            ? "Species"
            : null
        }
        // search={true}
        // gotoSearchPage={() => navigation.navigate("SearchScreen")}
      />
      <View style={styles.body}>
        <View style={{ paddingHorizontal: Spacing.minor }}>
          {props?.route.params?.data_type == "enclosure" && (
            <HousingSearchBox
              value={searchText}
              onChangeText={(e) => {
                setSearchText(e);
              }}
              onClearPress={() => {
                setSearchText("");
              }}
              loading={SearchLoading}
            />
          )}
        </View>

        <Text style={styles.count}>
          {`${
            props.route.params?.data_type == "animal"
              ? "Animals"
              : props.route.params?.data_type == "section"
              ? "Sections"
              : props.route.params?.data_type == "site"
              ? "Sites"
              : props.route.params?.data_type == "enclosure"
              ? "Enclosures"
              : props.route.params?.data_type == "species"
              ? "Species"
              : null
          }`}{" "}
          - {!loading ? countData : 0}
        </Text>
        <FlatList
          data={speciesData}
          renderItem={({ item }) => (
            <List
              data={item}
              type={props.route.params?.data_type}
              from={props?.route.params?.ref_type}
              fromId={props?.route.params?.ref_id}
            />
          )}
          keyExtractor={(i, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={ListEmptyComponent}
          ListFooterComponent={renderFooter}
        />
      </View>
    </View>
  );
};

const style = (reduxColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColor.surfaceVariant,
    },
    body: {
      flex: 1,
    },
    count: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColor?.onSurfaceVariant,
      paddingBottom: Spacing.small,
      marginHorizontal: Spacing.minor,
    },
    emptyWrap: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    emptyText: {
      fontSize: FontSize.Antz_Large_Title.fontSize,
      fontWeight: FontSize.Antz_Large_Title.fontWeight,
      color: reduxColor?.onSurfaceVariant,
    },
  });

export default AllListingData;
